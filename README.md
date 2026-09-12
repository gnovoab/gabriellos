# Gabriello's — Pizza Ordering

> _We keep our friends close — and our dough closer._

A single-restaurant pizza ordering website for **Gabriello's**, built with Next.js.
It presents the menu in a recipe-style layout (image left, description right — inspired
by the "Pizza Lab" recipes UI) and lays it out full-width like Deliveroo, with a live
basket and a full **Stripe card checkout** that emails order confirmations via **Resend**.

## Features

- **Menu** — Neapolitan classics plus a "Pumpkin Base" range, two pizzas per row,
  recipe-style cards with an **Add** button (light terracotta tint, fills on hover).
- **Item modal** — click a card for a Deliveroo-style popup with a quantity stepper.
- **Basket** — sticky sidebar on desktop, slide-up drawer on mobile. Totals, delivery
  fee, and quantities. Persists across refreshes (localStorage via Zustand).
- **Checkout** (`/checkout`) — choose **Delivery or Collection**, enter
  **name, email, phone, address (delivery only) and notes**, then pay by card.
- **Payments** — real card payment with Stripe (Payment Element). Link is disabled so
  Stripe doesn't ask for an email twice; Apple/Google Pay still work.
- **Order emails** — a Stripe webhook (`payment_intent.succeeded`) sends a branded
  confirmation to the **customer** and a notification to the **restaurant** via Resend.
- **Success page** (`/checkout/success`) — confirms payment and clears the basket.

## Tech stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (theme tokens in `src/app/globals.css`)
- **Zustand** (`persist`) for the basket
- **Stripe** (`stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **Resend** for transactional email
- **Vitest** for unit tests
- Fonts: Inter (sans), Fraunces (serif), JetBrains Mono (mono)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your keys (see below)
npm run dev                  # http://localhost:3000
```

The app runs without keys (you can browse the menu and build a basket), but **payments
and emails only work once you fill in `.env.local`**.

### Environment variables (`.env.local`)

All secrets live in a **`.env.local`** file at the project root. It is **git-ignored**, so
your keys never get committed. Copy the template and edit it:

```bash
cp .env.example .env.local
```

Then set each value:

| Variable | What it is | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_…`) | Stripe Dashboard → **Developers → API keys**: https://dashboard.stripe.com/test/apikeys |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…`) | Same page — click **Reveal** on the secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) | Printed by `stripe listen` (local) or Dashboard → **Developers → Webhooks** (production) |
| `RESEND_API_KEY` | Resend API key (`re_…`) | Resend Dashboard → **API Keys**: https://resend.com/api-keys |
| `ORDER_FROM_EMAIL` | The "from" address for emails | Use `onboarding@resend.dev` for testing, or an address on a domain you verified at https://resend.com/domains |
| `ORDER_NOTIFY_EMAIL` | Restaurant inbox that gets new-order alerts | Any email you want new orders sent to |

Example `.env.local` (values are placeholders — use your own):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_<your-publishable-key>
STRIPE_SECRET_KEY=sk_test_<your-secret-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-secret>
RESEND_API_KEY=re_<your-resend-key>
ORDER_FROM_EMAIL=onboarding@resend.dev
ORDER_NOTIFY_EMAIL=you@example.com
```

> ⚠️ Env changes are only read on server start — **stop and restart `npm run dev`** after
> editing `.env.local`, or the new values won't be picked up.

> 🔑 Use **test-mode** Stripe keys (`pk_test_…` / `sk_test_…`) for development. Live keys
> (`pk_live_…` / `sk_live_…`) charge real cards.

### Testing payments + emails locally

1. Add your Stripe **test** keys and your Resend key to `.env.local` (see above).
2. Forward Stripe events to the local webhook (requires the [Stripe CLI](https://docs.stripe.com/stripe-cli)):

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET` and **restart the dev server**.
3. Add a pizza, go to checkout, and pay with a **Stripe test card**:

   | Card number | Result |
   | --- | --- |
   | `4242 4242 4242 4242` | ✅ Successful payment (Visa) |
   | `5555 5555 5555 4444` | ✅ Successful payment (Mastercard) |
   | `4000 0000 0000 9995` | ❌ Declined (insufficient funds) |
   | `4000 0027 6000 3184` | 🔐 Requires 3D Secure authentication |

   For any test card use **any future expiry date**, **any 3-digit CVC**, and
   **any postcode**. Full list: https://docs.stripe.com/testing.
4. On success you'll see `payment_intent.succeeded` in the `stripe listen` terminal, the
   browser redirects to `/checkout/success` (showing your **order reference** and **ETA**),
   and both confirmation emails are sent.

> 📧 With the shared sender `onboarding@resend.dev`, Resend only delivers to **your own
> Resend account email**. So for a real end-to-end test, use that same address for the
> customer email and `ORDER_NOTIFY_EMAIL`. To email real customers, verify a domain at
> https://resend.com/domains and set `ORDER_FROM_EMAIL` to e.g. `orders@gabriellos.co.uk`.

> 💳 **No test card / keys yet?** The checkout page still renders, but the payment step
> shows a "not configured" message until Stripe keys are present.

## Deploying to Vercel

`.env.local` is **only** for local development — it is git-ignored and **never uploaded**
to Vercel. On Vercel you must add the same variables in the project settings, or the app
will report _"Payments are not configured"_ at checkout.

1. **Add environment variables** — Vercel Dashboard → your project → **Settings →
   Environment Variables**. Add each of these (for the **Production** environment, and
   Preview if you want previews to work):

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | your `pk_test_…` (or `pk_live_…`) |
   | `STRIPE_SECRET_KEY` | your `sk_test_…` (or `sk_live_…`) |
   | `STRIPE_WEBHOOK_SECRET` | the `whsec_…` from the **Dashboard** webhook (see step 3) |
   | `RESEND_API_KEY` | your `re_…` |
   | `ORDER_FROM_EMAIL` | a verified sender on your domain |
   | `ORDER_NOTIFY_EMAIL` | the restaurant inbox |

2. **Redeploy** — env vars are only picked up on a new deployment. Trigger a redeploy
   (Deployments → ⋯ → **Redeploy**, or push a commit). Changing env vars later also
   requires a redeploy.

3. **Set up the production webhook** — in Stripe Dashboard → **Developers → Webhooks →
   Add endpoint**, use `https://<your-app>.vercel.app/api/webhook`, subscribe to
   **`payment_intent.succeeded`**, then copy that endpoint's **Signing secret** (`whsec_…`)
   into the `STRIPE_WEBHOOK_SECRET` env var on Vercel and redeploy. (The `stripe listen`
   CLI secret is for local testing only and won't work in production.)

> Use **live** Stripe keys + a **verified Resend domain** only when you're ready to take
> real orders. Keep test keys for preview deployments.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Watch mode |

## Project structure

```
src/
  app/
    layout.tsx              # Root layout, fonts, metadata
    page.tsx                # Menu + basket page
    globals.css             # Tailwind v4 theme tokens (colours, fonts)
    checkout/page.tsx       # Checkout: details -> payment
    checkout/success/page.tsx
    api/checkout/route.ts   # Creates the Stripe PaymentIntent
    api/webhook/route.ts    # Verifies Stripe events, sends emails
  components/               # MenuItemCard, ItemModal, Basket, Checkout*, PaymentSection
  lib/
    menu.ts                 # Menu data + helpers (EDIT PRICES HERE)
    order.ts                # Server-trusted totals + delivery fee (tested)
    order.test.ts           # Vitest unit tests
    stripe.ts               # Server Stripe client
    stripe-client.ts        # Browser Stripe.js loader
    email.ts                # Resend sender
    email-templates.ts      # HTML email templates
    utils.ts                # cn(), formatPrice()
  store/useBasketStore.ts   # Zustand basket (persisted)
```

## Editing the menu

All pizzas, descriptions and **prices** live in `src/lib/menu.ts`. Prices are placeholder
GBP values — edit them freely. The delivery fee (`£2.50`) is in `src/lib/order.ts`.

## Notes

- Prices are always recomputed **server-side** from `menu.ts` in `/api/checkout`; the
  client only sends item ids + quantities, so amounts can't be tampered with.
- Orders are currently not persisted to a database — details live in the Stripe
  PaymentIntent metadata and the confirmation emails. See `PROJECT_CONTEXT.md` for
  architecture details and suggested next steps.
