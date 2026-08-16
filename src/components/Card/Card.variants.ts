import { cva, type VariantProps } from "class-variance-authority";

/**
 * Card variants.
 *
 * Visual axes:
 *   • variant      — visual style (elevated, outlined, glass, glassmorphism, ai, ghost)
 *   • padding      — internal spacing
 *   • radius       — corner rounding
 *   • hoverEffect  — motion on hover (lift, expand, glow, tilt, none)
 *   • interactive  — boolean — adds cursor-pointer; pairs with hoverEffect="lift"
 *                    by default for backward compatibility.
 */
export const cardVariants = cva(
  [
    "relative text-foreground",
    "transition-[transform,box-shadow,background-color,border-color,filter] duration-fast ease-viv-out",
  ],
  {
    variants: {
      variant: {
        // Soft elevation — the workhorse style for most cards.
        elevated: "bg-surface shadow-viv border border-border/40",
        // Flat with a visible border — good for dense data layouts.
        outlined: "bg-surface border border-border",
        // Legacy frosted glass — kept for backward compatibility.
        glass: "viv-glass shadow-viv-sm",
        // Glassmorphism — recognized variant that auto-enables the glass
        // modifier with the "medium" preset and a brand-colored glow blob.
        // Visuals are applied in `Card.tsx` via the layered glass renderer.
        glassmorphism: "bg-transparent border-transparent",
        // AI Response — brand-tinted, slightly recessed, gradient surface.
        ai: [
          "border border-brand/15",
          "bg-gradient-to-br from-brand-subtle/70 via-surface to-surface",
          "shadow-[inset_0_1px_0_0_hsl(var(--viv-brand)/0.08),0_1px_2px_0_rgba(0,0,0,0.04)]",
          "dark:from-brand-subtle/30 dark:via-surface-elevated dark:to-surface-elevated",
          "dark:border-brand/25",
        ],
        ghost: "bg-transparent border border-transparent",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        "2xl": "rounded-3xl",
      },
      hoverEffect: {
        none: "",
        lift: "hover:-translate-y-0.5 hover:shadow-viv-md active:translate-y-0",
        expand: "hover:scale-[1.02] hover:shadow-viv-lg active:scale-[1.005]",
        // Glow uses an INSET 1px ring (perfectly follows border-radius — no
        // outer-spread mismatch on rounded corners) plus an outer blur for
        // the actual "glow". This avoids the corner-clip feel of the old
        // `0 0 0 1px` spread shadow.
        glow: [
          "hover:shadow-[inset_0_0_0_1px_hsl(var(--viv-brand)/0.45),0_0_28px_-2px_hsl(var(--viv-brand)/0.5)]",
          "dark:hover:shadow-[inset_0_0_0_1px_hsl(var(--viv-brand)/0.55),0_0_32px_-2px_hsl(var(--viv-brand)/0.6)]",
          "hover:border-brand/40",
        ],
        tilt: [
          "[transform-style:preserve-3d]",
          "hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(-3deg)_translateY(-2px)]",
          "hover:shadow-viv-md",
        ],
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },
    compoundVariants: [
      // Backward-compat: `interactive` alone still gives the legacy lift hover.
      {
        interactive: true,
        hoverEffect: "none",
        class: "hover:-translate-y-0.5 hover:shadow-viv-md active:translate-y-0",
      },
    ],
    defaultVariants: {
      variant: "elevated",
      padding: "md",
      radius: "lg",
      hoverEffect: "none",
      interactive: false,
    },
  },
);

export type CardVariants = VariantProps<typeof cardVariants>;
