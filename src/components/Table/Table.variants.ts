import { cva, type VariantProps } from "class-variance-authority";

/**
 * Table — outer container variants.
 *
 * Visual axes:
 *   • radius   — corner rounding (sm → 2xl)
 *   • density  — vertical row padding tier (compact → spacious)
 *
 * The actual surface (solid vs glass) is decided in `Table.tsx` based on
 * the `glass` prop, mirroring `Card` so the two compose cleanly when a
 * `Table` is dropped inside a `<Card gradient>` wrapper.
 */
export const tableContainerVariants = cva(
  [
    "relative w-full text-foreground",
    "overflow-hidden",
    "transition-[background-color,border-color,box-shadow] duration-fast ease-viv-out",
  ],
  {
    variants: {
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        "2xl": "rounded-3xl",
      },
      density: {
        compact: "",
        comfortable: "",
        spacious: "",
      },
    },
    defaultVariants: {
      radius: "lg",
      density: "comfortable",
    },
  },
);

export type TableContainerVariants = VariantProps<typeof tableContainerVariants>;
