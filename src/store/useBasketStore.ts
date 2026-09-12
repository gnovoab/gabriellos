"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
  addItem: (item: Omit<BasketItem, "quantity">, quantity?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),
      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "gabriellos-basket" }
  )
);

export function selectTotalItems(items: BasketItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function selectTotalPrice(items: BasketItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
