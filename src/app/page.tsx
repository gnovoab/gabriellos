import { getMenuConfig } from "@/lib/db/menuConfig";
import { MenuPageClient } from "@/components/MenuPageClient";

export default async function Page() {
  const menu = await getMenuConfig();
  const items = menu.filter((i) => i.available);

  return <MenuPageClient items={items} />;
}
