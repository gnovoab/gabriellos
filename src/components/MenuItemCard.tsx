"use client";

import { useEffect, useState } from "react";
import type { GabriellosMenuItem as MenuItem } from "@/lib/db/menuConfig";
import { useBasketStore } from "@/store/useBasketStore";
import { formatPrice } from "@/lib/utils";

export function MenuItemCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  const items = useBasketStore((s) => s.items);
  const addItem = useBasketStore((s) => s.addItem);
  const increment = useBasketStore((s) => s.increment);
  const decrement = useBasketStore((s) => s.decrement);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const qty = mounted ? items.find((i) => i.id === item.id)?.quantity ?? 0 : 0;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onKey}
      className="group text-left flex flex-col overflow-hidden rounded-xl border border-border bg-card cursor-pointer hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-5xl opacity-40 group-hover:opacity-60 transition-opacity">🍕</div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col p-4">
        <h3 className="font-serif font-semibold text-lg sm:text-xl leading-tight text-foreground">{item.name}</h3>
        {item.style && <p className="text-xs text-[#C84B31] italic mt-0.5">{item.style}</p>}
        <p className="text-sm text-muted-foreground mt-1.5 leading-snug line-clamp-2">{item.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-mono text-lg font-bold text-[#2A2A2A]">{formatPrice(item.price)}</span>

          <div onClick={(e) => e.stopPropagation()}>
            {!item.available ? (
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Currently unavailable
              </span>
            ) : qty === 0 ? (
              <button
                onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                aria-label={`Add ${item.name}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 text-stone-900 text-sm font-semibold px-3.5 py-1.5 hover:bg-[#C84B31] hover:text-white active:scale-95 transition-colors"
              >
                <span className="text-base leading-none" aria-hidden>+</span> Add
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-full bg-stone-100 border border-stone-200 text-stone-800 px-2 py-1">
                <button
                  onClick={() => decrement(item.id)}
                  aria-label={`Remove one ${item.name}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-200 text-lg leading-none"
                >
                  −
                </button>
                <span className="min-w-4 text-center text-sm font-semibold tabular-nums text-stone-900">{qty}</span>
                <button
                  onClick={() => increment(item.id)}
                  aria-label={`Add one ${item.name}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-200 text-lg leading-none"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
