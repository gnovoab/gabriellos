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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const basketItems = useBasketStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const visibleCategories = MENU_CATEGORIES.filter((c) => items.some((i) => i.category === c.id));

  useEffect(() => {
    const sections = visibleCategories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveCategory(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const list = mounted ? basketItems : [];
  const count = selectTotalItems(list);
  const total = selectTotalPrice(list) + (count > 0 ? 2.5 : 0);

  return (
    <div className="min-h-screen pb-28 lg:pb-0">
      <header className="relative overflow-hidden bg-shell border-b border-shell-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 text-center sm:text-left">
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary/80 font-medium">Handmade · Napoletana</p>
          <h1 className="font-script text-primary text-6xl sm:text-7xl lg:text-8xl mt-3 -rotate-2 inline-block drop-shadow-md">
            Gabriello&apos;s
          </h1>
          <p className="font-script text-white text-2xl sm:text-3xl lg:text-4xl -mt-1">
            Authentic Napoletana Pizza
          </p>
          <p className="text-white/60 text-base mt-3 max-w-xl italic mx-auto sm:mx-0">
            We keep our friends close — and our dough closer.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-5 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-shell-2 border border-shell-border px-3 py-1.5 text-white/90">
              <span aria-hidden>⭐</span> 4.9 · 500+ ratings
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-shell-2 border border-shell-border px-3 py-1.5 text-white/90">
              <span aria-hidden>🛵</span> 25–35 min
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-shell-2 border border-shell-border px-3 py-1.5 text-white/90">
              <span aria-hidden>🧾</span> £{"2.50"} delivery · £10 min
            </span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-shell/95 backdrop-blur border-b border-shell-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex gap-2 overflow-x-auto py-3">
          {visibleCategories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === c.id
                  ? "bg-[#C84B31] text-white border-[#C84B31]"
                  : "bg-[#2A2A2A] border-shell-border text-stone-300 hover:bg-[#3A3A3A] hover:text-white"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
        <main className="py-6 space-y-10">
          {visibleCategories.map((c) => {
            const cItems = items
              .filter((i) => i.category === c.id)
              .sort((a, b) => a.number - b.number);
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
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {cItems.map((m) => (
                    <MenuItemCard key={m.id} item={m} onOpen={() => setSelected(m)} />
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        <aside className="hidden lg:block sticky top-20 py-6">
          <div className="overflow-hidden h-[calc(100vh-7rem)]">
            <Basket />
          </div>
        </aside>
      </div>

      <footer className="relative w-full h-64 sm:h-80 lg:h-[26rem] overflow-hidden border-t border-border mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg.jpeg"
          alt="Gabriello's — chef's kiss"
          className="absolute inset-0 w-full h-full object-cover object-[30%_30%]"
        />
        <div className="absolute left-[6%] sm:left-[12%] top-[8%] sm:top-[10%] -rotate-6">
          <p className="font-script text-[#F4A261] text-5xl sm:text-7xl lg:text-8xl leading-none [text-shadow:0_4px_10px_rgba(0,0,0,0.5)]">
            Gabriello&apos;s
          </p>
          <p className="font-script text-white text-2xl sm:text-4xl lg:text-5xl leading-tight mt-1 [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
            Authentic Napoletana Pizza
          </p>
        </div>
      </footer>

      {mounted && count > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-shell/95 backdrop-blur border-t border-shell-border">
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
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm"
          onClick={() => setBasketOpen(false)}
        >
          <div
            className="max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-200"
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
