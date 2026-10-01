import type { Metadata } from "next";
import { getMenuConfig, type GabriellosMenuItem } from "@/lib/db/menuConfig";
import { getSettings } from "@/lib/db/settings";
import { getCategories } from "@/lib/db/categories";
import type { MenuCategoryDoc } from "@/lib/menuCategories";

export const metadata: Metadata = {
  title: "Menu — Gabriello's",
  description: "In-restaurant menu display for Gabriello's.",
};

// Same reasoning as app/page.tsx: menu data comes from MongoDB (no fetch/
// Request-time API), so without this Next.js would statically cache the
// page at build time and never reflect admin edits.
export const dynamic = "force-dynamic";

// Read-only menu board for a large in-restaurant screen. No ordering — this
// is deliberately not linked from the ordering site nav. Prices are shown or
// hidden per the owner's global "showPrices" setting (pizzaiiolo admin).
// Mirrors the naming and card style of the pizzaiiolo /menu page (Il Menù,
// № numbering, image-top cards, category sections), scaled up for big-screen
// display.
export default async function MenuDisplayPage() {
  const [menu, settings, categories] = await Promise.all([getMenuConfig(), getSettings(), getCategories()]);
  const pizzas = menu.filter((i) => i.available).sort((a, b) => a.number - b.number);
  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const knownIds = new Set(sortedCategories.map((c) => c.id));
  const orphanItems = pizzas.filter((p) => !knownIds.has(p.category));
  const sections: MenuCategoryDoc[] = [
    ...sortedCategories,
    ...(orphanItems.length ? [{ id: "__other__", label: "Other", sortOrder: Infinity }] : []),
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-shell-border bg-shell">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-10 py-10 sm:py-14 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.5em] text-primary/80 font-medium">
            Handmade · Napoletana
          </p>
          <h1 className="font-script text-6xl sm:text-7xl xl:text-8xl mt-3 -rotate-2 inline-block text-primary drop-shadow-md">
            Gabriello&apos;s
          </h1>
          <p className="text-[11px] sm:text-sm uppercase tracking-[0.4em] text-primary/80 font-medium mt-6">
            Il Menù
          </p>
          <p className="text-white/60 text-lg sm:text-xl mt-3 italic">
            {pizzas.length} pizzas available
          </p>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 sm:px-10 py-12 space-y-10">
        {sections.map((c) => {
          const cItems = c.id === "__other__" ? orphanItems : pizzas.filter((p) => p.category === c.id);
          if (cItems.length === 0) return null;
          return (
            <section key={c.id} className="space-y-4">
              <div className="flex items-end justify-between gap-4 border-b-2 border-primary/20 pb-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">{c.label}</h2>
                <span className="font-mono text-xs text-muted-foreground shrink-0">{cItems.length} pizzas</span>
              </div>
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {cItems.map((item) => (
                  <MenuCard key={item.id} item={item} showPrice={settings.showPrices} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

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
    </div>
  );
}

function MenuCard({ item, showPrice }: { item: GabriellosMenuItem; showPrice: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="relative w-full aspect-[4/3] bg-muted border-b border-border/70 flex items-center justify-center">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="text-6xl opacity-40" aria-hidden>
            🍕
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline gap-2 flex-wrap justify-between">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-mono text-primary font-semibold">№ {item.number}</span>
            <h3 className="font-serif font-semibold text-xl sm:text-2xl leading-tight text-foreground">
              {item.name}
            </h3>
          </div>
          {showPrice && (
            <span className="text-lg sm:text-xl font-serif font-semibold text-primary shrink-0">
              £{item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.style && (
          <p className="text-sm sm:text-base text-secondary italic mt-1">{item.style}</p>
        )}
        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-snug">
          {item.description}
        </p>
      </div>
    </div>
  );
}
