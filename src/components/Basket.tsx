"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBasketStore, selectTotalItems, selectTotalPrice } from "@/store/useBasketStore";
import { formatPrice } from "@/lib/utils";

const DELIVERY_FEE = 2.5;

export function Basket({ onClose }: { onClose?: () => void }) {
  const items = useBasketStore((s) => s.items);
  const increment = useBasketStore((s) => s.increment);
  const decrement = useBasketStore((s) => s.decrement);
  const clear = useBasketStore((s) => s.clear);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const list = mounted ? items : [];
  const count = selectTotalItems(list);
  const subtotal = selectTotalPrice(list);
  const total = subtotal + (count > 0 ? DELIVERY_FEE : 0);

  const isEmpty = count === 0;

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#FFFDF9] border border-stone-200">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-stone-200">
        <h2 className="font-serif text-xl font-semibold text-stone-900">Your basket</h2>
        <div className="flex items-center gap-3">
          {count > 0 && (
            <button onClick={clear} className="text-xs text-stone-500 hover:text-destructive transition-colors">
              Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close basket"
              className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 text-stone-500">
          <div className="text-4xl mb-3 opacity-70" aria-hidden>🍕</div>
          <p className="text-sm font-medium text-stone-600">Your basket is empty.</p>
          <p className="text-xs mt-1">Select a pizza to get started.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
            {list.map((i) => (
              <div key={i.id} className="flex items-start gap-3 py-2.5 border-b border-stone-200 last:border-0">
                <div className="flex items-center gap-2 rounded-full border border-stone-200 px-1.5 py-1 shrink-0">
                  <button onClick={() => decrement(i.id)} aria-label={`Remove one ${i.name}`} className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 text-lg leading-none">−</button>
                  <span className="min-w-4 text-center text-sm font-semibold tabular-nums text-stone-900">{i.quantity}</span>
                  <button onClick={() => increment(i.id)} aria-label={`Add one ${i.name}`} className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 text-lg leading-none">+</button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight text-stone-900">{i.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatPrice(i.price)} each</p>
                </div>
                <span className="font-mono text-sm font-semibold tabular-nums shrink-0 text-stone-900">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600">
              <span>Delivery</span>
              <span className="font-mono tabular-nums">{formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-1 text-stone-900">
              <span>Total</span>
              <span className="font-mono tabular-nums text-[#C84B31]">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full mt-2 text-center rounded-full bg-[#C84B31] text-white font-bold px-5 py-3 shadow-sm hover:bg-[#B83B1D] active:scale-[0.99] transition"
            >
              Go to checkout · {formatPrice(total)}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
