import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — the canonical class merger used by every VivUI component.
 *
 * - `clsx` resolves conditional class objects/arrays into a flat string.
 * - `twMerge` resolves Tailwind utility conflicts (e.g. `p-2` overrides `p-4`).
 *
 * This is what makes `<Button className="p-8" />` actually win over the
 * component's default padding — without using `!important` hacks.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
