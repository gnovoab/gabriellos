# PROJECT CONTEXT — Gabriello's Pizza Ordering

> Handoff document for an AI (or developer) picking up this project. It captures the
> full intent, architecture, decisions, conventions and open work so you can continue
> without re-deriving context. Keep this file up to date as the project evolves.

## 1. What this is & why

A single-restaurant online ordering site for a pizzeria called **Gabriello's**
(slogan: _"We keep our friends close — and our dough closer."_).

Design brief from the owner:
- Present the menu like the **"Pizza Lab" recipes UI** from a sibling project
  (`/Users/gna336/IdeaProjects/pizzaiiolo`): image on the left, description on the
  right, same warm colour palette and structure — with **price + Add button** added.
- Clicking a pizza opens a **Deliveroo-style popup**.
- Overall page structure/layout should feel **full-width like Deliveroo** (not the
  colours — colours come from Pizza Lab).
- Then: a **full checkout with real card payment (Stripe)**, letting the customer
  choose **delivery or collection**, collecting **name + phone + (email) + address +
  notes**, and **emailing an order confirmation** to customer and restaurant.

## 2. Current status (implemented)

- ✅ Menu page with recipe-style cards, 2 per row, full-width (max `1600px`).
- ✅ Item modal (Deliveroo-style) with quantity stepper.
- ✅ Persisted basket (Zustand + localStorage), desktop sidebar + mobile drawer.
- ✅ Checkout page: delivery/collection toggle, customer form, order summary.
- ✅ Stripe Payment Element (card-only; Link disabled), success page clears basket.
- ✅ `/api/checkout` creates a PaymentIntent with server-trusted totals.
- ✅ `/api/webhook` verifies Stripe signature and sends confirmation emails (Resend).
- ✅ Unit tests for the totals logic (Vitest), build + typecheck green.

## 3. Tech stack

- Next.js **16.2.9** (App Router, Turbopack), React **19**, TypeScript **5**.
- Tailwind CSS **v4** (no `tailwind.config`; theme is CSS tokens in `globals.css`).
- Zustand **5** with `persist` (storage key `gabriellos-basket`).
- Stripe: `stripe` (server, v22), `@stripe/stripe-js`, `@stripe/react-stripe-js`.
- Resend (`resend` v6) for email.
- Vitest **4** (config `vitest.config.mts`, `@` alias -> `src`).
- Fonts (next/font): Inter `--font-sans`, Fraunces `--font-serif`, JetBrains Mono `--font-mono`.

## 4. Architecture & order flow

```
Menu (page.tsx) --add--> Zustand basket --> Basket.tsx "Go to checkout"
   -> /checkout (details: fulfillment + name/email/phone/address/notes)
   -> POST /api/checkout  (recompute totals from menu, create PaymentIntent)
   -> Stripe Payment Element (confirmPayment, return_url=/checkout/success)
   -> Stripe processes card
        |-> browser redirected to /checkout/success (clears basket)
        |-> Stripe fires payment_intent.succeeded -> POST /api/webhook
              -> verify signature -> read PI metadata -> Resend emails
                   (customer confirmation + restaurant notification)
```

Key principle: **the client never sets prices.** The basket sends only `{id, quantity}`
to `/api/checkout`; `computeOrder()` looks prices up from `menu.ts`. All order details
needed for the email are stored in the **PaymentIntent metadata**, so the webhook is the
single source of truth for fulfilment and is tamper-proof and retry-safe.

## 5. File-by-file reference

### App
- `src/app/layout.tsx` — root layout, fonts, metadata (title/description).
- `src/app/page.tsx` — menu page. Client component. Hero, sticky category nav,
  2-col menu grid, desktop basket `aside`, mobile "View basket" bar + drawer, item modal.
- `src/app/globals.css` — Tailwind v4 import + theme tokens (see §7).
- `src/app/checkout/page.tsx` — orchestrates checkout. Holds `fulfillment`, `form`
  (`CustomerForm`), `step` (`"details" | "payment"`), `clientSecret`. Validates, calls
  `/api/checkout`, then renders `PaymentSection`. Empty-basket guard.
- `src/app/checkout/success/page.tsx` — reads `redirect_status`, clears basket on success
  (wrapped in `<Suspense>` because it uses `useSearchParams`).
- `src/app/api/checkout/route.ts` — POST. Validates body (items, fulfillment, customer
  incl. email regex), `computeOrder`, `stripe.paymentIntents.create` with
  `payment_method_types: ["card"]`, `receipt_email`, and metadata. Returns `clientSecret`,
  `amount`, `subtotal`, `deliveryFee`.
- `src/app/api/webhook/route.ts` — POST, `runtime = "nodejs"`, `dynamic = "force-dynamic"`.
  Reads raw body via `request.text()`, `stripe.webhooks.constructEvent`, on
  `payment_intent.succeeded` maps metadata -> `OrderEmailData` -> `sendOrderEmails`.
  Returns 500 on email failure so Stripe retries.

### Components (all `"use client"`)
- `MenuItemCard.tsx` — recipe-style card. Add button: `bg-primary/10` tint that fills to
  solid `bg-primary` on hover. Turns into a stepper once in basket.
- `ItemModal.tsx` — popup with image, description, price, quantity stepper, Add to basket.
- `Basket.tsx` — item list, subtotal/delivery/total, "Go to checkout" is a `<Link>` to
  `/checkout` (calls `onClose` for the mobile drawer). `DELIVERY_FEE = 2.5` (local const).
- `CheckoutDetailsForm.tsx` — exports `CustomerForm` type. Fulfillment toggle + inputs
  (name, phone, email, address [delivery only], notes) + submit. Controlled via props.
- `CheckoutSummary.tsx` — order summary list + totals; recomputes fee from `fulfillment`.
- `PaymentSection.tsx` — wraps `<Elements>` (terracotta appearance) + `PaymentElement`;
  `confirmPayment` with `return_url` to the success page. Shows "not configured" if no key.

### Lib
- `menu.ts` — `MenuCategory` (`"classic" | "pumpkin"`), `MenuItem`, `MENU_CATEGORIES`,
  `MENU` (data — **prices live here**), `getItemsByCategory`, `getItemById`.
- `order.ts` — `DELIVERY_FEE = 2.5`, `Fulfillment`, `OrderLineInput`, `OrderLine`,
  `OrderTotals`, `computeOrder(items, fulfillment)`, `toPence(amount)`.
- `order.test.ts` — 11 Vitest tests (subtotal, delivery vs collection fee, unknown ids,
  zero/negative/fractional quantities, empty basket, `toPence` rounding).
- `stripe.ts` — server `Stripe` client from `STRIPE_SECRET_KEY`. Never import client-side.
- `stripe-client.ts` — `getStripe()` singleton (returns null if key missing/placeholder),
  `isStripeConfigured()`.
- `email.ts` — Resend client, `sendOrderEmails(data)` (customer + restaurant via
  `Promise.allSettled`, throws if any fail), `isEmailConfigured()`.
- `email-templates.ts` — `OrderEmailData` type, `buildCustomerEmail`, `buildRestaurantEmail`
  (inline-styled HTML, `escapeHtml` on all user input).
- `utils.ts` — `cn()` (clsx + tailwind-merge), `formatPrice()` (`£x.xx`).

### Store
- `store/useBasketStore.ts` — `BasketItem {id,name,price,image?,quantity}`, actions
  `addItem/increment/decrement/removeItem/clear`, selectors `selectTotalItems`,
  `selectTotalPrice`. Persisted under `gabriellos-basket`.

## 6. Environment variables

Read only on server start — **restart the dev server after editing `.env.local`**.

| Variable | Where used | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `stripe-client.ts` | `pk_test_…`; exposed to browser |
| `STRIPE_SECRET_KEY` | `stripe.ts` | `sk_test_…`; server only |
| `STRIPE_WEBHOOK_SECRET` | `api/webhook/route.ts` | `whsec_…` from `stripe listen` / Dashboard |
| `RESEND_API_KEY` | `email.ts` | `re_…` |
| `ORDER_FROM_EMAIL` | `email.ts` | Verified sender; testing `onboarding@resend.dev` |
| `ORDER_NOTIFY_EMAIL` | `api/webhook/route.ts` | Restaurant inbox |

`.env.example` documents all of these; `.env.local` holds the real values (git-ignored).

## 7. Theme & styling conventions

- **Tailwind v4, no config file** — theme is defined as CSS tokens in `globals.css`
  under `@theme`. Colours are the warm "Pizza Lab" palette:
  `--color-background` (parchment), `--color-foreground` (near-black),
  `--color-primary` (terracotta) + `--color-primary-foreground`, `--color-secondary`,
  `--color-muted`, `--color-card`, `--color-border`.
- Use semantic classes (`bg-primary`, `text-foreground`, `border-border`) — do **not**
  hardcode hex values in components.
- Layout is full-width capped at `max-w-[1600px]`; menu grid is 2 columns on desktop.
- Buttons follow the light-tint→solid-on-hover pattern (`bg-primary/10` → `bg-primary`).
- Fonts: serif (Fraunces) for headings, sans (Inter) for body, mono (JetBrains Mono)
  for prices/numbers (`tabular-nums`).

## 8. Conventions & gotchas

- Prices are **GBP placeholders** in `menu.ts` — edit freely. `formatPrice` renders `£x.xx`.
- **Never trust client prices.** `/api/checkout` recomputes from `menu.ts` via `computeOrder`.
- Stripe amounts are in **pence** — always convert with `toPence()`.
- The webhook needs the **raw body** (`request.text()`), so it must stay on the
  `nodejs` runtime with `dynamic = "force-dynamic"`; don't parse JSON before verifying.
- Stripe **Link is intentionally disabled** (`payment_method_types: ["card"]`) so the
  card form doesn't ask for the email a second time.
- `success/page.tsx` uses `useSearchParams` → must stay inside `<Suspense>`.
- Vitest config is `vitest.config.mts` (the `.mts` extension avoids CJS/ESM warnings).

## 9. Known limitations & suggested next steps

- **No database.** Orders live only in Stripe PaymentIntent metadata + the emails.
  Next: persist orders (e.g. Postgres/Prisma or a KV store) from the webhook.
- **No order reference / ETA** shown to the customer on the success page.
- **No admin view** for the restaurant to see/manage incoming orders.
- **No plain-text email** alternative (HTML only) — adding one improves deliverability.
- **No menu CMS** — menu is hardcoded in `menu.ts`.
- Emails only send once a **real `STRIPE_WEBHOOK_SECRET`** and **`RESEND_API_KEY`** are set
  and Stripe events are forwarded (locally via the Stripe CLI).

## 10. How to run & verify

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 11 unit tests (order totals)
npm run build      # production build + typecheck
```

For end-to-end payment + email testing see the "Testing payments + emails locally"
section in `README.md`.
