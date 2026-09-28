/**
 * One-time seed script: populates the shared MongoDB `gabriellos.menu`
 * collection from the hardcoded MENU in src/lib/menu.ts, with `available: true`
 * for every item. Run once before cutting the ordering/display pages over to
 * read from Mongo, so getMenuConfig() returns real data instead of falling
 * back to the seed array in production.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." npx tsx scripts/seed-menu-config.ts
 *
 * Safe to re-run (upserts by _id). Not wired into the build — leave under
 * scripts/ or delete once seeding is confirmed via the Atlas UI / GET /api/menu.
 */
import { MongoClient } from "mongodb";
import { MENU, type MenuCategory } from "../src/lib/menu";

interface MenuDoc {
  _id: string;
  number: number;
  name: string;
  style?: string;
  category: MenuCategory;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  updatedAt: Date;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Aborting.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db("gabriellos").collection<MenuDoc>("menu");

    const ops = MENU.map(({ id, ...rest }) => ({
      replaceOne: {
        filter: { _id: id },
        replacement: { _id: id, ...rest, available: true, updatedAt: new Date() },
        upsert: true,
      },
    }));

    if (ops.length === 0) {
      console.log("Nothing to seed — MENU is empty.");
      return;
    }

    const result = await col.bulkWrite(ops);
    console.log(
      `Seeded ${ops.length} menu items (matched: ${result.matchedCount}, upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}).`
    );
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
