import { getMenuConfig } from "@/lib/db/menuConfig";
import { MenuPageClient } from "@/components/MenuPageClient";

// Menu data lives in MongoDB and is edited from the pizzaiiolo admin at any
// time. Without this, Next.js has no fetch/Request-time API to detect and
// statically prerenders this page at build time, so admin edits would never
// show up until the next deploy.
export const dynamic = "force-dynamic";

export default async function Page() {
  const menu = await getMenuConfig();
  const items = menu.filter((i) => i.available);

  return <MenuPageClient items={items} />;
}
