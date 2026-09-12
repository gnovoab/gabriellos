"use client";

import { formatPrice } from "@/lib/utils";
import { DELIVERY_FEE, type Fulfillment } from "@/lib/order";
import type { BasketItem } from "@/store/useBasketStore";

export function CheckoutSummary({
  items,
  fulfillment,
}: {
  items: BasketItem[];
  fulfillment: Fulfillment;
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = fulfillment === "delivery" && items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-serif text-xl font-semibold">Order summary</h2>
      </div>

      <div className="px-5 py-3 space-y-2.5 max-h-[40vh] overflow-y-auto">
        {items.map((i) => (
          <div key={i.id} className="flex items-start justify-between gap-3 text-sm">
            <span className="flex-1 min-w-0">
              <span className="font-semibold tabular-nums">{i.quantity}×</span> {i.name}
            </span>
            <span className="font-mono tabular-nums shrink-0">{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{fulfillment === "delivery" ? "Delivery" : "Collection"}</span>
          <span className="font-mono tabular-nums">
            {deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-1">
          <span>Total</span>
          <span className="font-mono tabular-nums text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
