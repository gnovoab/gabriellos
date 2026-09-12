import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a GBP price, e.g. 12.5 -> "£12.50". */
export function formatPrice(value: number): string {
  return `£${value.toFixed(2)}`;
}
