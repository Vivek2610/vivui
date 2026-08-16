import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button variants — VivUI's signature button system.
 *
 * Visual axes:
 *   • variant: visual style (primary, ai, magnetic, gradient, …)
 *   • size:    height / padding scale (xs → fab)
 *   • shape:   pill (rounded-full) | rounded | square
 *   • fullWidth, loading: state flags
 *
 * `overflow-hidden` is intentional: variants like `ai` paint a sheen
 * pseudo-element that must be clipped to the button's silhouette.
 * `box-shadow` and focus outline are NOT clipped by overflow-hidden,
 * so glow effects still extend outside the button.
 */
export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "font-medium whitespace-nowrap select-none isolate",
    "viv-focus-ring overflow-hidden",
    "transition-[transform,box-shadow,background-color,color,filter] duration-fast ease-viv-out",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // ── Primary — solid blue gradient with inner highlight + drop shadow.
        primary: [
          "text-white",
          "bg-gradient-to-b from-[hsl(238,84%,67%)] to-[hsl(248,80%,55%)]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_4px_14px_-2px_hsl(248_80%_55%/0.45)]",
          "hover:brightness-110 hover:-translate-y-px",
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_10px_22px_-4px_hsl(248_80%_55%/0.55)]",
        ],
        // ── Secondary — light surface, subtle border, soft inner highlight.
        secondary: [
          "bg-surface text-foreground",
          "border border-border/80",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_1px_2px_0_rgba(0,0,0,0.04)]",
          "hover:bg-surface-overlay hover:border-foreground/20",
          "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_1px_2px_0_rgba(0,0,0,0.4)]",
        ],
        // ── Ghost — transparent, hover reveals overlay.
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-surface-overlay",
        ],
        // ── Outline — border only, brand tint on hover.
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:border-brand/50 hover:bg-brand-subtle/30",
        ],
        // ── Soft — tinted brand fill, low intensity.
        soft: [
          "bg-brand-subtle text-brand",
          "hover:bg-brand-muted",
        ],
        // ── Glass — frosted surface with backdrop blur.
        glass: [
          "viv-glass text-foreground",
          "hover:bg-surface/80 hover:shadow-viv",
        ],
        // ── Link — text-only, underlines on hover.
        link: [
          "bg-transparent text-brand underline-offset-4",
          "hover:underline px-0",
        ],
        // ── Danger — red gradient with the same depth treatment as primary.
        danger: [
          "text-white",
          "bg-gradient-to-b from-[hsl(0,80%,64%)] to-[hsl(0,75%,50%)]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_4px_14px_-2px_hsl(0_75%_55%/0.45)]",
          "hover:brightness-110",
        ],
        // ── AI — vivid gradient + a sheen bar that sweeps across on hover.
        ai: [
          "text-white",
          "bg-gradient-to-r from-[hsl(218,90%,58%)] via-[hsl(232,85%,60%)] to-[hsl(252,82%,60%)]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_6px_18px_-4px_hsl(232_85%_60%/0.55)]",
          "hover:brightness-110",
          // Sheen bar (pseudo-element). Hidden off-canvas, sweeps on hover.
          "before:content-[''] before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3",
          "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
          "before:translate-x-[-200%] before:skew-x-[-12deg] before:opacity-0",
          "before:transition-[transform,opacity] before:duration-[800ms] before:ease-viv-out",
          "hover:before:translate-x-[400%] hover:before:opacity-100",
        ],
        // ── Magnetic — neutral surface; component attaches a JS magnetic
        //    hover effect via pointer events when this variant is active.
        magnetic: [
          "bg-surface text-foreground",
          "border border-border/80",
          "shadow-viv-sm will-change-transform",
          "hover:shadow-viv-md hover:border-foreground/30",
          "transition-[transform] duration-300 ease-viv-spring",
        ],
        // ── Gradient — smooth panning multi-color fill + static glow
        // (avoid animating box-shadow / brightness — causes visible flicker).
        gradient: [
          "text-white",
          "bg-[length:200%_100%]",
          "bg-[linear-gradient(120deg,hsl(218_95%_60%),hsl(258_95%_65%),hsl(310_85%_65%),hsl(258_95%_65%),hsl(218_95%_60%))]",
          "animate-viv-gradient-pan",
          "transition-[transform,filter] duration-fast ease-viv-out",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_8px_28px_-4px_hsl(258_95%_65%/0.50)]",
          "hover:-translate-y-px hover:brightness-[1.04]",
          "motion-reduce:animate-none",
        ],
      },
      size: {
        xs: "h-7 px-3 text-xs gap-1.5",
        sm: "h-8 px-3.5 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        xl: "h-12 px-6 text-base",
        "icon-sm": "h-8 w-8 p-0",
        icon: "h-10 w-10 p-0",
        "icon-lg": "h-12 w-12 p-0",
        fab: "h-14 w-14 p-0",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      loading: {
        true: "pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      // Link variant should never carry a button shape outline.
      { variant: "link", size: "md", class: "h-auto px-0 overflow-visible" },
      { variant: "link", size: "sm", class: "h-auto px-0 overflow-visible" },
      // FAB sizes always look best as circles.
      { size: "fab", shape: "rounded", class: "rounded-2xl" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "pill",
      fullWidth: false,
      loading: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
