"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { formatPrice } from "@/lib/utils";

function PaymentForm({
  total,
  fulfillment,
  onBack,
}: {
  total: number;
  fulfillment: string;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const returnUrl = new URL(`${window.location.origin}/checkout/success`);
    returnUrl.searchParams.set("fulfillment", fulfillment);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl.toString(),
      },
    });

    // If we reach here, confirmation failed (otherwise the browser redirects).
    if (submitError) {
      setError(submitError.message ?? "Payment could not be completed.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="flex-1 rounded-full bg-primary text-primary-foreground font-semibold px-5 py-3 shadow-sm hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
        >
          {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </form>
  );
}

export function PaymentSection({
  clientSecret,
  total,
  fulfillment,
  onBack,
}: {
  clientSecret: string;
  total: number;
  fulfillment: string;
  onBack: () => void;
}) {
  const stripePromise = getStripe();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "flat",
      variables: {
        colorPrimary: "#F4A261",
        colorText: "#2B2B2B",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "10px",
      },
    },
  };

  if (!stripePromise) {
    return (
      <p className="text-sm text-destructive">
        Payments are not configured. Add your Stripe publishable key to .env.local.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm total={total} fulfillment={fulfillment} onBack={onBack} />
    </Elements>
  );
}
