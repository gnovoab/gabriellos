import { getMenuConfig } from "@/lib/db/menuConfig";
import { getCategories } from "@/lib/db/categories";
import { MenuPageClient } from "@/components/MenuPageClient";

// Menu data lives in MongoDB and is edited from the pizzaiiolo admin at any
// time. Without this, Next.js has no fetch/Request-time API to detect and
// statically prerenders this page at build time, so admin edits would never
// show up until the next deploy.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [menu, categories] = await Promise.all([getMenuConfig(), getCategories()]);
  const items = menu.filter((i) => i.available);

  return <MenuPageClient items={items} categories={categories} />;
}
