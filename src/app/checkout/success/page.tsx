"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useBasketStore } from "@/store/useBasketStore";
import { estimatedTime, orderReference } from "@/lib/order";

function SuccessContent() {
  const params = useSearchParams();
  const clear = useBasketStore((s) => s.clear);
  const status = params.get("redirect_status");
  const succeeded = status === "succeeded" || status === null;
  const [cleared, setCleared] = useState(false);

  const paymentIntent = params.get("payment_intent");
  const fulfillment = params.get("fulfillment") === "collection" ? "collection" : "delivery";
  const orderRef = paymentIntent ? orderReference(paymentIntent) : null;
  const eta = estimatedTime(fulfillment);

  useEffect(() => {
    if (succeeded && !cleared) {
      clear();
      setCleared(true);
    }
  }, [succeeded, cleared, clear]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-secondary/10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm p-8 text-center">
        {succeeded ? (
          <>
            <div className="text-5xl mb-4">🍕</div>
            <h1 className="font-serif text-2xl font-semibold text-primary">Grazie mille!</h1>
            <p className="text-sm text-muted-foreground mt-3">
              Your payment was successful and your order is on its way to the kitchen. We&apos;ll be in
              touch shortly to confirm the details.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              {orderRef && (
                <div className="rounded-xl border border-border bg-secondary/10 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Order ref
                  </div>
                  <div className="font-mono font-semibold text-foreground mt-0.5">{orderRef}</div>
                </div>
              )}
              <div className="rounded-xl border border-border bg-secondary/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {fulfillment === "collection" ? "Ready in" : "Estimated delivery"}
                </div>
                <div className="font-semibold text-foreground mt-0.5">{eta}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h1 className="font-serif text-2xl font-semibold">Payment not completed</h1>
            <p className="text-sm text-muted-foreground mt-3">
              Something went wrong and your payment didn&apos;t go through. Your basket has been kept so
              you can try again.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block mt-6 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 text-sm hover:brightness-110 active:scale-[0.99] transition"
        >
          Back to the menu
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
