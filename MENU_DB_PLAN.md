# Plan — Database-backed Menu, Toppings & Drinks

> A phased implementation plan for moving the menu off the hardcoded
> `src/lib/menu.ts` file into a database, adding **toppings** (add/remove, and
> which toppings are allowed per pizza), and selling **drinks**. No code has been
> written yet — this is the roadmap to agree before building.

## Goal & scope

- Make the menu **data-driven** (editable without a code deploy).
- Model **toppings** as first-class items: a global list, plus per-pizza rules for
  which are allowed, which are default/included, and each topping's extra price.
- Add **drinks** as a second product type sharing the same basket/checkout flow.
- Keep the existing security invariant: **all prices computed server-side** from
  trusted data, never from the client.
- Persist completed **orders** (currently they live only in Stripe metadata + email).

## Current state (what exists today)

- `src/lib/menu.ts` — hardcoded `MENU: MenuItem[]` with `id, name, style?,
  category ("classic" | "pumpkin"), description, price, image?`; helpers
  `getItemsByCategory`, `getItemById`.
- `src/store/useBasketStore.ts` — `BasketItem { id, name, price, image?, quantity }`,
  persisted under `gabriellos-basket`. **No toppings on a line item.**
- `src/lib/order.ts` — `computeOrder(items, fulfillment)` looks prices up from
  `menu.ts` by id; adds the `£2.50` delivery fee; `toPence`.
- `src/app/api/checkout/route.ts` — recomputes totals, creates the Stripe
  PaymentIntent, stores order details in metadata.
- `src/components/ItemModal.tsx` — quantity stepper only (no topping selection).

## Recommended stack

- **PostgreSQL + Prisma ORM** (hosted on Vercel Postgres, Neon, or Supabase).
  Best fit for the relational topping rules, availability toggles, and order
  persistence, and it keeps everything inside the Next.js project for now.
- Alternative if the *only* need were non-dev menu editing: a headless CMS
  (Sanity/Contentful). Not recommended here because of the order/pricing logic.

## Target data model (conceptual)

```
products
  id            (uuid / cuid)
  type          ('pizza' | 'drink')
  category_id   -> categories.id            (pizzas: classic/pumpkin; drinks: soft/beer/…)
  name, style?, description?, image?
  base_price    (GBP)
  is_available  (bool)                        # sold-out toggle
  sort_order    (int)

categories
  id, type ('pizza' | 'drink'), label, blurb?, sort_order

toppings
  id, name, price (GBP, extra cost), is_available, sort_order

product_toppings            # which toppings apply to which pizza (many-to-many)
  product_id -> products.id
  topping_id -> toppings.id
  is_default (bool)          # included/pre-selected on that pizza
  (PK: product_id + topping_id)

orders
  id, order_ref, status, fulfillment, subtotal, delivery_fee, total,
  customer_name, customer_email, customer_phone, address?, notes?,
  stripe_payment_intent_id, created_at

order_items                 # snapshot at time of order (price copied, not linked)
  id, order_id -> orders.id, product_id?, name, unit_price, quantity

order_item_toppings         # snapshot of chosen toppings per line
  id, order_item_id -> order_items.id, topping_id?, name, price
```

Key idea: `product_toppings` drives the **selector** (what you *can* choose);
`order_item_toppings` is a **snapshot** so historical orders stay correct even if
topping prices change later.

## Phased plan

### Phase 0 — Decide & provision
- Confirm Postgres + Prisma (vs CMS). Pick host (Vercel Postgres / Neon / Supabase).
- Add `DATABASE_URL` to `.env.local` and Vercel env vars (required at build/runtime).
- Install Prisma, init schema. **No behaviour change yet.**

### Phase 1 — Schema, migrations & seed
- Write the Prisma schema for the model above.
- Create a **seed script** that imports the current `menu.ts` data (so nothing is
  lost) plus an initial toppings list and a few drinks.
- Run the first migration; verify data in a DB client.

### Phase 2 — Server data-access layer (read path)
- Add server-only query functions (e.g. `src/lib/db/menu.ts`): `getProducts`,
  `getProductWithToppings`, `getCategories`, `getToppings`.
- Replace `menu.ts` reads on the **menu page** and helpers with DB queries
  (server components / route handlers). Keep `MenuItem` shape compatible to
  minimise UI churn. `menu.ts` becomes seed data only, then is removed.
- Handle `is_available` (hide or mark sold-out).

### Phase 3 — Toppings selection in the UI
- Extend `ItemModal` for pizzas: show allowed toppings from
  `product_toppings`, pre-tick defaults, allow add/remove.
- Update the basket model: a line item gains
  `selectedToppings: { id, name, price }[]` and a stable line key (same pizza with
  different toppings = **separate** basket lines). Update
  `useBasketStore` add/increment/decrement/remove and the persist migration.
- Show chosen toppings + per-line price in `Basket` and `CheckoutSummary`.

### Phase 4 — Drinks
- Drinks are `products` with `type = 'drink'` and no toppings.
- Add a **Drinks** section/category to the menu page and category nav.
- They flow through the same basket/checkout; no special handling beyond having
  no topping selector.

### Phase 5 — Server-trusted pricing with toppings
- Change the client → server contract: each line sends
  `{ productId, quantity, toppingIds: string[] }` (ids only, never prices).
- Rewrite `computeOrder` to look up product `base_price` **and** each selected
  topping's `price` from the DB, validating that every `toppingId` is actually
  allowed on that product (reject/ignore invalid ones). Line total =
  `(base_price + Σ topping prices) × quantity`.
- Keep delivery-fee logic; keep `toPence`. Update `/api/checkout` to use the new
  shape and store a readable topping summary in Stripe metadata.

### Phase 6 — Order persistence
- In the **webhook** (`payment_intent.succeeded`), write the order to
  `orders` / `order_items` / `order_item_toppings` (idempotent on
  `stripe_payment_intent_id` so Stripe retries don't duplicate).
- Include toppings in the confirmation emails and on `/checkout/success`.
- Store/read the `order_ref` from the DB (align with the existing
  `orderReference()` helper).

### Phase 7 — Admin (menu management)
- Protected admin area (auth required) to:
  - Add/edit/remove **toppings** and set prices/availability.
  - Set **which toppings are allowed per pizza** and which are default.
  - Add/edit **products** (pizzas & drinks): price, availability, category, images.
- Optional later: a **kitchen/orders dashboard** listing incoming orders.

### Phase 8 — Order management & live tracking
Build the system that receives a paid order and drives it to "ready".

- **Status lifecycle** on `orders.status`, e.g.
  `received → accepted → preparing → ready → out_for_delivery → completed`
  (`cancelled`/`rejected` as terminal states). Store `status_updated_at` and a
  small `order_events` audit table (order_id, from, to, at, by).
- **Staff dashboard (KDS)** — an authed screen listing live orders with buttons to
  advance status. Writing a status change is the single source of truth.
- **Customer tracker** — a page (e.g. `/orders/[ref]`) that shows the current stage
  and ETA. Reached via a link in the confirmation email / success page.
- **Live updates to the browser** — see the sync architecture below. Start with
  SSE or polling; the DB status is the source of truth.
- **Side effects on transition** — notify the customer (email/SMS/push) and, later,
  the kitchen printer / delivery provider. Emit a domain event per transition so
  these can be handled asynchronously and idempotently.

## Sync architecture — queues vs realtime

There are **two distinct syncs**; they need different tools:

1. **Backend → customer browser (the tracker UI).** Do **not** use a work queue.
   Use **realtime push** (SSE, WebSockets, or a hosted pub/sub such as Pusher /
   Ably / Supabase Realtime). The order status is a DB column; the tracker reflects
   it. Simplest MVP = short-interval **polling**.
2. **Event-driven side effects & service-to-service comms** (on status change:
   notifications, kitchen printing, delivery hand-off, analytics). This is where a
   **queue / event bus** earns its place — decoupling + retries + reliability
   (BullMQ/Redis, QStash, SQS, Inngest; or RabbitMQ/Kafka if multi-service).

Rule of thumb: **don't add a broker just to display a status field.** Add one when
you have async, retryable side effects, or you split into separate services.

Recommended progression:
- **MVP (single Next.js app):** status column + KDS + tracker (SSE/polling), emit a
  domain event per transition. No broker yet.
- **Growth:** route those events through a **managed queue** for
  notifications/printing/delivery, with idempotent handlers.
- **Multi-service / Spring Boot order service:** publish events to a **broker**
  (RabbitMQ/Kafka); consumers handle side effects. The tracker still updates via
  realtime push, not the broker directly.

## Invariants & principles (must hold throughout)

- **Never trust client prices.** The server recomputes every amount from the DB,
  including toppings — same rule as today's `computeOrder`.
- **Validate topping choices** against `product_toppings`; silently ignore or
  reject toppings not allowed on that product.
- **Snapshot prices on the order.** `order_item(_toppings)` copy name + price at
  purchase time so later menu edits don't rewrite history.
- **Idempotent order writes** keyed on the Stripe PaymentIntent id.
- Stripe amounts stay in **pence** via `toPence()`.
- **Status is the source of truth in the DB.** The tracker *reflects* it; it is
  never driven from the client. Every transition is recorded in `order_events`.
- **Side-effect handlers are idempotent** (a status event may be delivered more
  than once) — safe to reprocess without duplicate emails/prints.

## Migration & rollout notes

- `menu.ts` becomes the **seed source**, then is deleted once the DB read path is
  live (Phase 2). Keep it until then so nothing is lost.
- The basket persist format changes in Phase 3 — bump the Zustand `persist`
  version and add a migration (or clear) so old baskets without toppings don't
  break.
- `DATABASE_URL` must be present for **both** local dev and Vercel (add it to the
  build-time required-env check alongside the Stripe keys).

## Open decisions (need your input before Phase 0)

1. **DB host** — Vercel Postgres, Neon, or Supabase?
2. **Topping pricing** — flat price per topping, or tiered (e.g. premium vs
   standard)? Any free-topping allowance?
3. **Drinks** — do any have variants (size/can vs bottle) that need modelling like
   simple options?
4. **Admin auth** — who edits the menu, and what login method (email link, simple
   password, existing SSO)?
5. **Order statuses** — do you want a lifecycle (received → preparing → out →
   done) now, or just store paid orders for now?
6. **Live tracker transport** — polling (simplest), SSE, WebSockets, or a hosted
   realtime service (Pusher/Ably/Supabase Realtime)?
7. **Customer notifications on status change** — email only, or also SMS/push
   (adds a provider like Twilio/web-push)?
8. **Queue/event bus** — is a separate order service (e.g. Spring Boot) on the
   roadmap? If so we design events for a broker now; if not, keep it in-process.

## Testing strategy

- Unit tests for the new `computeOrder` (base + toppings, invalid topping
  rejection, delivery vs collection) — extend `src/lib/order.test.ts`.
- Seed-based tests for the data-access layer.
- A webhook idempotency test (same PaymentIntent processed twice = one order).
- Order status-transition tests (valid transitions only; audit row written).
- Idempotency test for status side-effect handlers (event delivered twice = one
  notification).

## Suggested first step

Agree the **Open decisions** above, then do **Phase 0 + Phase 1** (provision DB,
schema, seed from current menu) — a self-contained change with no user-facing
impact — before touching the UI.
