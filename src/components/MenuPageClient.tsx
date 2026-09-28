"use client";

import { useEffect, useState } from "react";
import { MENU_CATEGORIES } from "@/lib/menu";
import type { GabriellosMenuItem } from "@/lib/db/menuConfig";
import { MenuItemCard } from "@/components/MenuItemCard";
import { ItemModal } from "@/components/ItemModal";
import { Basket } from "@/components/Basket";
import { useBasketStore, selectTotalItems, selectTotalPrice } from "@/store/useBasketStore";
import { formatPrice } from "@/lib/utils";

export function MenuPageClient({ items }: { items: GabriellosMenuItem[] }) {
  const [selected, setSelected] = useState<GabriellosMenuItem | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);
  const basketItems = useBasketStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const list = mounted ? basketItems : [];
  const count = selectTotalItems(list);
  const total = selectTotalPrice(list) + (count > 0 ? 2.5 : 0);

  return (
    <div className="min-h-screen pb-28 lg:pb-0">
      <header className="relative overflow-hidden border-b border-border bg-secondary/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-secondary font-medium">Handmade · Napoletana</p>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold mt-3 text-primary">Gabriello&apos;s</h1>
          <p className="text-muted-foreground text-base mt-3 max-w-xl italic">
            We keep our friends close — and our dough closer.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-foreground/80">
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>⭐</span> 4.9 · 500+ ratings</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>🛵</span> 25–35 min</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>🧾</span> £{"2.50"} delivery · £10 min</span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-2 overflow-x-auto py-3">
          {MENU_CATEGORIES.filter((c) => items.some((i) => i.category === c.id)).map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground/80 hover:border-primary/60 hover:text-primary transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
        <main className="py-6 space-y-10">
          {MENU_CATEGORIES.map((c) => {
            const cItems = items.filter((i) => i.category === c.id).sort((a, b) => a.number - b.number);
            if (cItems.length === 0) return null;
            return (
              <section key={c.id} id={c.id} className="space-y-4 scroll-mt-24">
                <div className="flex items-end justify-between gap-4 border-b-2 border-primary/20 pb-3">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold">{c.label}</h2>
                    <p className="text-sm text-muted-foreground mt-1 italic">{c.blurb}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground shrink-0">{cItems.length} pizzas</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {cItems.map((m) => (
                    <MenuItemCard key={m.id} item={m} onOpen={() => setSelected(m)} />
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        <aside className="hidden lg:block sticky top-20 py-6">
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden h-[calc(100vh-7rem)]">
            <Basket />
          </div>
        </aside>
      </div>

      {mounted && count > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-background/95 backdrop-blur border-t border-border">
          <button
            onClick={() => setBasketOpen(true)}
            className="w-full flex items-center justify-between gap-3 rounded-full bg-primary text-primary-foreground font-semibold px-5 py-3.5 shadow-lg active:scale-[0.99] transition"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-primary-foreground/20 text-sm tabular-nums">{count}</span>
              View basket
            </span>
            <span className="font-mono tabular-nums">{formatPrice(total)}</span>
          </button>
        </div>
      )}

      {basketOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-foreground/40 backdrop-blur-sm"
          onClick={() => setBasketOpen(false)}
        >
          <div
            className="bg-card rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Basket onClose={() => setBasketOpen(false)} />
          </div>
        </div>
      )}

      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
