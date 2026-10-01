import clientPromise from "./mongo";
import { DEFAULT_CATEGORIES, type MenuCategoryDoc } from "../menuCategories";

export { DEFAULT_CATEGORIES, type MenuCategoryDoc };

interface CategoryDoc {
  _id: string;
  label: string;
  sortOrder: number;
}

function toCategory(doc: CategoryDoc): MenuCategoryDoc {
  return { id: doc._id, label: doc.label, sortOrder: doc.sortOrder };
}

/**
 * Read-only for gabriellosui. pizzaiiolo is the sole writer of the shared
 * `categories` collection. Falls back to `DEFAULT_CATEGORIES` if Mongo is
 * unconfigured, unreachable, or the collection is empty, so the ordering
 * site never hard-crashes on a Mongo outage.
 */
export async function getCategories(): Promise<MenuCategoryDoc[]> {
  try {
    const client = await clientPromise;
    const docs = await client
      .db("gabriellos")
      .collection<CategoryDoc>("categories")
      .find({})
      .sort({ sortOrder: 1 })
      .toArray();
    if (docs.length === 0) return DEFAULT_CATEGORIES;
    return docs.map(toCategory);
  } catch (e) {
    console.error("categories fallback to defaults:", e);
    return DEFAULT_CATEGORIES;
  }
}
