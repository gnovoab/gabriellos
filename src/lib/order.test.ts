import { describe, it, expect } from "vitest";
import {
  computeOrder,
  toPence,
  DELIVERY_FEE,
  orderReference,
  estimatedTime,
} from "@/lib/order";
import type { GabriellosMenuItem } from "@/lib/db/menuConfig";

// Fixture menu used in assertions:
//   margherita = £9.50, napoli = £12.50, unavailable-item = £99 but not available
const MENU_ITEMS: GabriellosMenuItem[] = [
  {
    id: "margherita",
    number: 1,
    name: "Margherita",
    category: "classic",
    description: "Tomato, mozzarella, basil, olive oil.",
    price: 9.5,
    available: true,
  },
  {
    id: "napoli",
    number: 5,
    name: "Napolitan",
    category: "classic",
    description: "Tomato, mozzarella, anchovies, olives, capers, garlic, oregano.",
    price: 12.5,
    available: true,
  },
  {
    id: "unavailable-item",
    number: 99,
    name: "Out of Stock Pizza",
    category: "classic",
    description: "Temporarily unavailable.",
    price: 99,
    available: false,
  },
];

describe("computeOrder", () => {
  it("computes subtotal and adds the delivery fee for delivery orders", () => {
    const order = computeOrder([{ id: "margherita", quantity: 2 }], "delivery", MENU_ITEMS);
    expect(order.subtotal).toBe(19);
    expect(order.deliveryFee).toBe(DELIVERY_FEE);
    expect(order.total).toBe(19 + DELIVERY_FEE);
  });

  it("charges no delivery fee for collection orders", () => {
    const order = computeOrder([{ id: "margherita", quantity: 2 }], "collection", MENU_ITEMS);
    expect(order.subtotal).toBe(19);
    expect(order.deliveryFee).toBe(0);
    expect(order.total).toBe(19);
  });

  it("sums multiple different items correctly", () => {
    const order = computeOrder(
      [
        { id: "margherita", quantity: 1 },
        { id: "napoli", quantity: 3 },
      ],
      "collection",
      MENU_ITEMS
    );
    // 9.50 + (12.50 * 3) = 47.00
    expect(order.subtotal).toBe(47);
    expect(order.lines).toHaveLength(2);
  });

  it("uses trusted menu prices and names, not client-supplied data", () => {
    const order = computeOrder([{ id: "margherita", quantity: 1 }], "collection", MENU_ITEMS);
    expect(order.lines[0]).toMatchObject({
      id: "margherita",
      name: "Margherita",
      price: 9.5,
      quantity: 1,
    });
  });

  it("ignores unknown item ids", () => {
    const order = computeOrder(
      [
        { id: "does-not-exist", quantity: 5 },
        { id: "margherita", quantity: 1 },
      ],
      "collection",
      MENU_ITEMS
    );
    expect(order.lines).toHaveLength(1);
    expect(order.subtotal).toBe(9.5);
  });

  it("ignores unavailable items even when requested", () => {
    const order = computeOrder(
      [{ id: "unavailable-item", quantity: 1 }],
      "collection",
      MENU_ITEMS
    );
    expect(order.lines).toHaveLength(0);
    expect(order.subtotal).toBe(0);
  });

  it("ignores zero and negative quantities", () => {
    const order = computeOrder(
      [
        { id: "margherita", quantity: 0 },
        { id: "napoli", quantity: -2 },
      ],
      "collection",
      MENU_ITEMS
    );
    expect(order.lines).toHaveLength(0);
    expect(order.subtotal).toBe(0);
  });

  it("floors fractional quantities", () => {
    const order = computeOrder([{ id: "margherita", quantity: 2.9 }], "collection", MENU_ITEMS);
    expect(order.lines[0].quantity).toBe(2);
    expect(order.subtotal).toBe(19);
  });

  it("returns zeroed totals for an empty basket", () => {
    const order = computeOrder([], "delivery", MENU_ITEMS);
    expect(order.lines).toHaveLength(0);
    expect(order.subtotal).toBe(0);
    expect(order.deliveryFee).toBe(0);
    expect(order.total).toBe(0);
  });

  it("does not add a delivery fee when no valid items remain", () => {
    const order = computeOrder([{ id: "does-not-exist", quantity: 2 }], "delivery", MENU_ITEMS);
    expect(order.lines).toHaveLength(0);
    expect(order.deliveryFee).toBe(0);
    expect(order.total).toBe(0);
  });
});

describe("toPence", () => {
  it("converts pounds to integer pence", () => {
    expect(toPence(21.5)).toBe(2150);
    expect(toPence(9.5)).toBe(950);
  });

  it("rounds to the nearest penny", () => {
    expect(toPence(9.999)).toBe(1000);
    expect(toPence(0.005)).toBe(1);
  });
});

describe("orderReference", () => {
  it("builds a GB- prefixed reference from the last 6 alphanumerics, uppercased", () => {
    expect(orderReference("pi_3ABc123xyz")).toBe("GB-123XYZ");
  });

  it("is deterministic for the same seed", () => {
    expect(orderReference("pi_abcdef")).toBe(orderReference("pi_abcdef"));
  });

  it("pads short seeds to six characters", () => {
    expect(orderReference("pi_a")).toBe("GB-000PIA");
  });
});

describe("estimatedTime", () => {
  it("returns a shorter window for collection", () => {
    expect(estimatedTime("collection")).toBe("15–20 min");
  });

  it("returns the delivery window for delivery (and any other value)", () => {
    expect(estimatedTime("delivery")).toBe("30–45 min");
    expect(estimatedTime("anything-else")).toBe("30–45 min");
  });
});
