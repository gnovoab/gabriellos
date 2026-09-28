import type { Metadata } from "next";
import { getMenuConfig, type GabriellosMenuItem } from "@/lib/db/menuConfig";

export const metadata: Metadata = {
  title: "Menu — Gabriello's",
  description: "In-restaurant menu display for Gabriello's.",
};

// Same reasoning as app/page.tsx: menu data comes from MongoDB (no fetch/
// Request-time API), so without this Next.js would statically cache the
// page at build time and never reflect admin edits.
export const dynamic = "force-dynamic";

// Read-only menu board for a large in-restaurant screen. No prices, no
// ordering — this is deliberately not linked from the ordering site nav.
// Mirrors the naming and card style of the pizzaiiolo /menu page (Il Menù,
// № numbering, image-top cards), scaled up for big-screen display.
export default async function MenuDisplayPage() {
  const menu = await getMenuConfig();
  const pizzas = menu.filter((i) => i.available).sort((a, b) => a.number - b.number);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-secondary/10">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-10 py-10 sm:py-14 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.5em] text-secondary font-medium">
            Handmade · Napoletana
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-semibold mt-3 text-primary">
            Gabriello&apos;s
          </h1>
          <p className="text-[11px] sm:text-sm uppercase tracking-[0.4em] text-secondary font-medium mt-6">
            Il Menù
          </p>
          <p className="text-muted-foreground text-lg sm:text-xl mt-3 italic">
            {pizzas.length} pizzas available
          </p>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 sm:px-10 py-12">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {pizzas.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}

function MenuCard({ item }: { item: GabriellosMenuItem }) {
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
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-mono text-primary font-semibold">№ {item.number}</span>
          <h3 className="font-serif font-semibold text-xl sm:text-2xl leading-tight text-foreground">
            {item.name}
          </h3>
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
