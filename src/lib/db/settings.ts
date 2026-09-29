import clientPromise from "./mongo";

export interface GabriellosSettings {
  /** Whether prices are shown on read-only displays (tablet menu, catering site). Online ordering always shows prices regardless of this flag. */
  showPrices: boolean;
}

interface SettingsDoc extends GabriellosSettings {
  _id: string;
}

const SETTINGS_ID = "global";

const DEFAULT_SETTINGS: GabriellosSettings = { showPrices: true };

/**
 * Read-only for gabriellosui. This app never writes to the shared `settings`
 * collection — pizzaiiolo is the sole writer. Falls back to showing prices
 * (the safer default for online ordering elsewhere in this app) if Mongo is
 * unconfigured, unreachable, or the document doesn't exist yet.
 */
export async function getSettings(): Promise<GabriellosSettings> {
  try {
    const client = await clientPromise;
    const doc = await client
      .db("gabriellos")
      .collection<SettingsDoc>("settings")
      .findOne({ _id: SETTINGS_ID });
    if (!doc) return DEFAULT_SETTINGS;
    return { showPrices: doc.showPrices };
  } catch (e) {
    console.error("settings fallback to default:", e);
    return DEFAULT_SETTINGS;
  }
}
