import type { WithId, Document } from "mongodb";
import clientPromise from "./mongo";
import { MENU } from "@/lib/menu";

export type MenuCategory = "classic" | "innovative" | "calzone-focaccia" | "specials";

export interface GabriellosMenuItem {
  id: string;
  number: number;
  name: string;
  style?: string;
  category: MenuCategory;
  description: string;
  price: number;
  image?: string;
  available: boolean;
}

function toGabriellosMenuItem(doc: WithId<Document>): GabriellosMenuItem {
  return {
    id: String(doc._id),
    number: doc.number,
    name: doc.name,
    style: doc.style,
    category: doc.category,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    available: doc.available,
  };
}

/** Seed/fallback data — used when Mongo is unconfigured, unreachable, or empty. */
function seedMenu(): GabriellosMenuItem[] {
  return MENU.map((m) => ({ ...m, available: true }));
}

/**
 * Read-only for gabriellosui. This app never writes to the shared `menu`
 * collection — pizzaiiolo is the sole writer. Falls back to seed `MENU` data
 * if Mongo is unconfigured, unreachable, or the collection is empty, so the
 * public site never hard-crashes on a Mongo outage.
 */
export async function getMenuConfig(): Promise<GabriellosMenuItem[]> {
  try {
    const client = await clientPromise;
    const docs = await client.db("gabriellos").collection("menu").find({}).toArray();
    if (docs.length === 0) return seedMenu();
    return docs.map(toGabriellosMenuItem);
  } catch (e) {
    console.error("menuConfig fallback to seed MENU:", e);
    return seedMenu();
  }
}
