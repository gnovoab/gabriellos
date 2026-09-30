"use client";

import { useEffect, useState } from "react";
import type { GabriellosMenuItem as MenuItem } from "@/lib/db/menuConfig";
import { useBasketStore } from "@/store/useBasketStore";
import { formatPrice } from "@/lib/utils";

export function ItemModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const addItem = useBasketStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image }, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[94vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <div className="relative aspect-[16/9] bg-muted border-b border-border flex items-center justify-center shrink-0">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="text-6xl opacity-30">🍕</div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight">{item.name}</h2>
            {item.style && <p className="text-sm text-secondary italic mt-1">{item.style}</p>}
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/90">{item.description}</p>
          <p className="font-mono text-xl font-bold text-primary">{formatPrice(item.price)}</p>
        </div>

        <div className="border-t border-border p-4 sm:p-5 flex items-center gap-4 bg-card">
          {item.available ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1.5 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 text-xl leading-none disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="min-w-6 text-center font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 text-xl leading-none"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-between gap-3 rounded-full bg-primary text-primary-foreground font-semibold px-5 py-3 shadow-sm hover:brightness-110 active:scale-[0.99] transition"
              >
                <span>Add to basket</span>
                <span className="font-mono tabular-nums">{formatPrice(item.price * quantity)}</span>
              </button>
            </>
          ) : (
            <span className="flex-1 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Currently unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
