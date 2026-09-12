import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // Surfaced at request time by the API route, not at import time in the browser.
  console.warn("STRIPE_SECRET_KEY is not set. Add it to .env.local to enable payments.");
}

/** Server-side Stripe client. Never import this into client components. */
export const stripe = new Stripe(secretKey ?? "", {
  typescript: true,
});
