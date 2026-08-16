import { cva, type VariantProps } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*                                  Heading                                    */
/* -------------------------------------------------------------------------- */

/**
 * Heading variants — the display end of VivUI's type system.
 *
 * Visual axes:
 *   • level    — semantic heading level (drives default size + weight).
 *   • variant  — `default` (foreground), `muted`, `gradient` (animated AI
 *                gradient), `glow` (neon halo), `display` (extra-tight tracking).
 *   • align    — text-align passthrough.
 *   • balance  — `text-wrap: balance` for premium multi-line headings.
 */
export const headingVariants = cva(
  ["font-display tracking-tight text-foreground", "[text-wrap:pretty]"],
  {
    variants: {
      level: {
        1: "text-5xl font-bold leading-[1.05] sm:text-6xl",
        2: "text-4xl font-semibold leading-[1.1] sm:text-5xl",
        3: "text-3xl font-semibold leading-[1.15]",
        4: "text-2xl font-semibold leading-[1.2]",
        5: "text-xl font-semibold leading-[1.3]",
        6: "text-base font-semibold leading-[1.4] uppercase tracking-[0.08em]",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        // Animated AI gradient — three-stop violet/blue/cyan, panning.
        gradient: [
          "bg-clip-text text-transparent",
          "bg-[length:200%_200%]",
          "bg-[linear-gradient(120deg,hsl(218_95%_60%),hsl(258_95%_70%),hsl(190_95%_60%),hsl(258_95%_70%),hsl(218_95%_60%))]",
          "animate-viv-gradient-pan",
        ],
        // Neon halo — readable foreground with a soft brand-colored glow.
        glow: [
          "text-foreground",
          "[text-shadow:0_0_24px_hsl(var(--viv-brand)/0.45),0_0_48px_hsl(var(--viv-brand)/0.25)]",
        ],
        // Display — VivUI's marketing-page hero treatment.
        display: ["font-display tracking-[-0.04em]", "text-foreground"],
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      balance: {
        true: "[text-wrap:balance]",
        false: "",
      },
    },
    defaultVariants: {
      level: 2,
      variant: "default",
      align: "left",
      balance: false,
    },
  },
);

export type HeadingVariants = VariantProps<typeof headingVariants>;

/* -------------------------------------------------------------------------- */
/*                                    Text                                     */
/* -------------------------------------------------------------------------- */

/**
 * Text variants — paragraph-grade prose styles.
 *
 * Visual axes:
 *   • size     — base scale (xs → 2xl)
 *   • variant  — semantic role (default, muted, lead, ai, gradient)
 *   • align    — text-align passthrough
 *   • leading  — line-height token
 *
 * Implementation note — the shared base avoids always applying
 * `text-foreground`; each variant declares its ink so `muted`/gradient
 * don't rely on conflicting merge-order, and `lead` carries a dedicated
 * light-theme-friendly tone (see `:root --viv-muted-foreground` tweak).
 */
export const textVariants = cva(["font-sans antialiased"], {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      /** Lead stays softer than `default` yet dark enough on `#fff`/glass surfaces. */
      lead: [
        "text-lg text-foreground/[0.92] sm:text-xl",
        "dark:text-muted-foreground",
      ],
      ai: "text-brand font-medium",
      // Gradient text — same animated gradient as the heading variant.
      gradient: [
        "bg-clip-text text-transparent",
        "bg-[length:200%_200%]",
        "bg-[linear-gradient(120deg,hsl(218_95%_60%),hsl(258_95%_70%),hsl(190_95%_60%),hsl(258_95%_70%),hsl(218_95%_60%))]",
        "animate-viv-gradient-pan",
      ],
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    leading: {
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
  },
  defaultVariants: {
    size: "base",
    variant: "default",
    align: "left",
    leading: "relaxed",
  },
});

export type TextVariants = VariantProps<typeof textVariants>;

/* -------------------------------------------------------------------------- */
/*                                Inline Code                                  */
/* -------------------------------------------------------------------------- */

/**
 * Inline `Code` variants — for `<code>` elements rendered inside prose.
 * The `ai` variant adds a subtle gradient outline + neon glow that pairs
 * with the AI-generated content patterns elsewhere in the library.
 */
export const codeInlineVariants = cva(
  [
    "relative inline-flex items-center font-mono",
    "rounded-md px-[0.4em] py-[0.15em] text-[0.875em]",
    "transition-colors duration-fast ease-viv-out",
  ],
  {
    variants: {
      variant: {
        // Default — surface-overlay chip with brand-tinted text.
        default: [
          "bg-surface-overlay text-foreground",
          "border border-border/60",
          "shadow-[inset_0_-1px_0_0_hsl(var(--viv-fg)/0.04)]",
          "dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.04)]",
        ],
        // Brand — soft violet wash.
        brand: [
          "bg-brand-subtle text-brand",
          "border border-brand/20",
        ],
        // AI — gradient outline + soft glow.
        ai: [
          "text-foreground",
          "bg-[linear-gradient(135deg,hsl(218_95%_60%/0.10),hsl(258_95%_70%/0.10),hsl(190_95%_60%/0.10))]",
          "shadow-[inset_0_0_0_1px_hsl(258_95%_70%/0.35),0_0_12px_-2px_hsl(258_95%_70%/0.4)]",
        ],
        // Status accents — pair with prose semantics.
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/25",
        danger: "bg-danger/10 text-danger border border-danger/25",
        // Ghost — no background, just the mono treatment.
        ghost: "bg-transparent text-foreground/85",
      },
      size: {
        sm: "text-[0.8em]",
        md: "text-[0.875em]",
        lg: "text-[0.95em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type CodeInlineVariants = VariantProps<typeof codeInlineVariants>;

/* -------------------------------------------------------------------------- */
/*                                     Kbd                                     */
/* -------------------------------------------------------------------------- */

/**
 * Keyboard key — Raycast-grade rendering with a layered shadow that
 * gives the chip a tactile "key-cap" feel.
 */
export const kbdVariants = cva(
  [
    "inline-flex items-center justify-center font-mono font-medium",
    "rounded-md select-none whitespace-nowrap",
    "border border-border/80 bg-surface text-foreground",
    "shadow-[inset_0_-1px_0_0_hsl(var(--viv-fg)/0.10),0_1px_0_0_hsl(var(--viv-border)/0.6)]",
    "dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06),0_1px_0_0_rgba(0,0,0,0.5)]",
  ],
  {
    variants: {
      size: {
        sm: "h-5 min-w-[1.25rem] px-1 text-[10px]",
        md: "h-6 min-w-[1.5rem] px-1.5 text-[11px]",
        lg: "h-7 min-w-[1.75rem] px-2 text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type KbdVariants = VariantProps<typeof kbdVariants>;
