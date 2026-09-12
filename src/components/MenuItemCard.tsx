"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/menu";
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
      className="group text-left flex gap-4 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-muted border border-border/70 flex items-center justify-center">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="text-4xl opacity-40 group-hover:opacity-60 transition-opacity">🍕</div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <h3 className="font-serif font-semibold text-lg sm:text-xl leading-tight text-foreground">{item.name}</h3>
        {item.style && <p className="text-xs text-secondary italic mt-0.5">{item.style}</p>}
        <p className="text-sm text-muted-foreground mt-1.5 leading-snug line-clamp-2">{item.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
          <span className="font-mono text-sm font-semibold text-primary">{formatPrice(item.price)}</span>

          <div onClick={(e) => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                aria-label={`Add ${item.name}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold px-4 py-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-colors"
              >
                <span className="text-base leading-none" aria-hidden>+</span> Add
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-full bg-card border border-primary/40 px-2 py-1 shadow-sm">
                <button
                  onClick={() => decrement(item.id)}
                  aria-label={`Remove one ${item.name}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 text-lg leading-none"
                >
                  −
                </button>
                <span className="min-w-4 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button
                  onClick={() => increment(item.id)}
                  aria-label={`Add one ${item.name}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 text-lg leading-none"
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
