import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Browser-side Stripe.js loader (singleton). Returns null when the publishable
 * key is missing so the UI can show a helpful message instead of crashing.
 */
export function getStripe(): Promise<Stripe | null> | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key || key === "pk_test_replace_me") return null;
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}

export const isStripeConfigured = (): boolean => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return Boolean(key) && key !== "pk_test_replace_me";
};
