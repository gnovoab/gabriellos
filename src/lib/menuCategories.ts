// Mongo-free — safe to import from client components, unlike
// src/lib/db/categories.ts which pulls in the MongoDB driver.
//
// Categories are managed from the pizzaiiolo admin ("La Carta") and stored
// in the shared `categories` collection. gabriellosui only reads them.

export interface MenuCategoryDoc {
  id: string;
  label: string;
  sortOrder: number;
}

// Seed/fallback set used only if Mongo is unconfigured, unreachable, or the
// shared `categories` collection is empty — mirrors pizzaiiolo's defaults.
export const DEFAULT_CATEGORIES: MenuCategoryDoc[] = [
  { id: "classic", label: "Classic", sortOrder: 0 },
  { id: "innovative", label: "Innovative", sortOrder: 1 },
  { id: "le-nostre", label: "Le Nostre", sortOrder: 2 },
  { id: "pumpkin", label: "Pumpkin Base", sortOrder: 3 },
  { id: "calzone-focaccia", label: "Calzone & Focaccia", sortOrder: 4 },
  { id: "specials", label: "Limited Time Only", sortOrder: 5 },
];
