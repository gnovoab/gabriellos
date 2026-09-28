import type { GabriellosMenuItem } from "@/lib/db/menuConfig";

export const DELIVERY_FEE = 2.5;

export type Fulfillment = "delivery" | "collection";

/** A single line as sent from the client basket (id + quantity only). */
export interface OrderLineInput {
  id: string;
  quantity: number;
}

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderTotals {
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/**
 * Recompute an order from trusted menu data. Prices are never taken from the
 * client — only item ids and quantities are, so the amount can't be tampered
 * with. `menuItems` is the caller-resolved, current menu (e.g. from
 * `getMenuConfig()`) so this stays pure/testable with fixtures instead of
 * reaching into Mongo itself. Unavailable items are always excluded, even if
 * the caller passes an unfiltered list.
 */
export function computeOrder(
  items: OrderLineInput[],
  fulfillment: Fulfillment,
  menuItems: GabriellosMenuItem[]
): OrderTotals {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const menuItem = menuItems.find((m) => m.id === item.id);
    const quantity = Math.max(0, Math.floor(item.quantity));
    if (!menuItem || !menuItem.available || quantity <= 0) continue;
    lines.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const deliveryFee = fulfillment === "delivery" && lines.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return { lines, subtotal, deliveryFee, total };
}

/** Convert a GBP amount to integer pence for Stripe. */
export function toPence(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Build a short, human-readable order reference from a seed (e.g. the Stripe
 * PaymentIntent id). Deterministic so the same order always shows the same ref.
 */
export function orderReference(seed: string): string {
  const cleaned = (seed ?? "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const tail = cleaned.slice(-6).padStart(6, "0");
  return `GB-${tail}`;
}

/** Estimated time until the order is ready/delivered, by fulfilment type. */
export function estimatedTime(fulfillment: string): string {
  return fulfillment === "collection" ? "15–20 min" : "30–45 min";
}
