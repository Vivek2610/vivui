import * as React from "react";
import { cn } from "../../utils/cn";
import { cardVariants, type CardVariants } from "./Card.variants";

/**
 * Card — VivUI's container primitive.
 *
 * Variants:
 *   • elevated      — soft shadow on a surface (default)
 *   • outlined      — flat with a visible border
 *   • glass         — legacy frosted glass
 *   • glassmorphism — premium glass with diagonal sheen overlay
 *   • ai            — brand-tinted recessed look (AI response bubble)
 *   • ghost         — transparent
 *
 * Compound parts:
 *   Card.Header • Card.Title • Card.Description
 *   Card.Body   • Card.Footer
 *   Card.Media  • Card.CloseButton
 *
 * Companion component:
 *   <CardStack>  — wraps a card in a layered shadow-stack effect.
 *
 * Usage:
 *   <Card variant="ai" hoverEffect="lift">
 *     <Card.Header>
 *       <Card.Title>AI Response</Card.Title>
 *       <Card.Description>Streaming…</Card.Description>
 *     </Card.Header>
 *     <Card.Body>...</Card.Body>
 *   </Card>
 */
/**
 * Glass material settings — a "preset" picks balanced defaults for blur,
 * tint, and glow. Any individual prop (`blur`, `tint`, `glow`) overrides.
 */
export type GlassPreset = "subtle" | "medium" | "strong";
export type GlassBlur =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

/**
 * Animated-gradient palettes. Same family as the `gradient` button variant.
 *   • brand  — VivUI signature (blue → violet → magenta)
 *   • aurora — cool teal → indigo → magenta
 *   • sunset — warm orange → pink → violet
 *   • ocean  — cyan → blue → indigo
 */
export type GradientPreset = "brand" | "aurora" | "sunset" | "ocean";

/**
 * Animated-gradient pan speed.
 *   • slow   — 12s, ambient
 *   • normal — 6s   (default, matches the gradient button)
 *   • fast   — 3s, energetic
 */
export type GradientSpeed = "slow" | "normal" | "fast";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariants {
  /**
   * Apply a frosted-glass material on top of the variant. Works on any
   * variant. `true` = `"medium"`. Pass `false` to disable on the
   * `glassmorphism` variant (rare — the variant auto-enables glass).
   */
  glass?: boolean | GlassPreset;
  /**
   * Override the frost amount. Higher values feel thicker / more opaque.
   * Tokens: `sm` 4px → `md` 12px → `lg` 16px → `xl` 24px → `2xl` 40px → `3xl` 64px.
   * Defaults: subtle=`md`, medium=`xl`, strong=`2xl`.
   */
  blur?: GlassBlur;
  /**
   * Surface tint opacity (0–1). 0 = fully transparent, 1 = fully opaque.
   * Defaults: subtle=0.55, medium=0.30, strong=0.18.
   */
  tint?: number;
  /**
   * Show the decorative brand-colored blob behind the glass. Without one,
   * the frost has nothing to blur. Defaults: subtle=`false`, medium=`true`,
   * strong=`true`.
   */
  glow?: boolean;
  /**
   * Toggle an animated multi-color gradient surface — same vibe as the
   * `gradient` and `ai` button variants (continuously panning gradient
   * + diagonal sheen sweep on hover). `true` enables the brand palette;
   * pass a preset name to swap. Pairs cleanly with `glass` — the frost
   * blurs the gradient for a colored-glass effect.
   */
  gradient?: boolean | GradientPreset;
  /** Animation speed for the gradient pan. Defaults to `normal`. */
  gradientSpeed?: GradientSpeed;
  /**
   * Hide the diagonal sheen sweep that fires on hover. Defaults to `false`
   * (sheen visible) when `gradient` is enabled.
   */
  sheen?: boolean;
}

interface ResolvedGlass {
  enabled: boolean;
  blur: GlassBlur;
  tint: number;
  glow: boolean;
}

const GLASS_PRESETS: Record<GlassPreset, Omit<ResolvedGlass, "enabled">> = {
  subtle: { blur: "md", tint: 0.55, glow: false },
  medium: { blur: "xl", tint: 0.3, glow: true },
  strong: { blur: "2xl", tint: 0.18, glow: true },
};

const BLUR_CLASS: Record<GlassBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

function resolveGlass(props: {
  glass?: boolean | GlassPreset;
  blur?: GlassBlur;
  tint?: number;
  glow?: boolean;
  variant?: CardProps["variant"];
}): ResolvedGlass {
  let preset: GlassPreset | null = null;
  if (props.glass === false) {
    preset = null;
  } else if (props.glass === true) {
    preset = "medium";
  } else if (typeof props.glass === "string") {
    preset = props.glass;
  } else if (props.variant === "glassmorphism") {
    preset = "medium";
  }

  if (!preset) {
    return { enabled: false, blur: "none", tint: 0, glow: false };
  }

  const defaults = GLASS_PRESETS[preset];
  return {
    enabled: true,
    blur: props.blur ?? defaults.blur,
    tint: props.tint ?? defaults.tint,
    glow: props.glow ?? defaults.glow,
  };
}

/* -------------------------------------------------------------------------- */
/*                          Animated gradient surface                          */
/* -------------------------------------------------------------------------- */

interface ResolvedGradient {
  enabled: boolean;
  preset: GradientPreset;
  speed: GradientSpeed;
  sheen: boolean;
}

/**
 * Five-stop linear-gradient strings for each preset. The first and last
 * stops match so the panning animation loops seamlessly. Set as inline
 * `background-image` because Tailwind can't statically extract per-prop
 * gradient stop lists.
 */
const GRADIENT_BG: Record<GradientPreset, string> = {
  brand:
    "linear-gradient(120deg, hsl(218 95% 60%), hsl(258 95% 65%), hsl(310 85% 65%), hsl(258 95% 65%), hsl(218 95% 60%))",
  aurora:
    "linear-gradient(120deg, hsl(180 90% 55%), hsl(240 90% 60%), hsl(280 85% 65%), hsl(320 85% 60%), hsl(180 90% 55%))",
  sunset:
    "linear-gradient(120deg, hsl(30 95% 60%), hsl(15 90% 60%), hsl(330 85% 60%), hsl(280 80% 55%), hsl(30 95% 60%))",
  ocean:
    "linear-gradient(120deg, hsl(195 95% 55%), hsl(220 90% 50%), hsl(250 85% 55%), hsl(220 90% 50%), hsl(195 95% 55%))",
};

/**
 * Per-preset shadow tokens — written as static Tailwind arbitrary-value
 * classes so the JIT compiler picks them up at build time. Each preset
 * pairs an inset top-edge highlight with two colored drop-shadows that
 * echo the gradient's dominant hues.
 */
const GRADIENT_SHADOW: Record<GradientPreset, string> = {
  brand:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(258_95%_65%/0.55),0_3px_10px_-2px_hsl(310_85%_65%/0.4)]",
  aurora:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(240_90%_60%/0.55),0_3px_10px_-2px_hsl(320_85%_60%/0.4)]",
  sunset:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(15_90%_60%/0.55),0_3px_10px_-2px_hsl(330_85%_60%/0.4)]",
  ocean:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(220_90%_50%/0.55),0_3px_10px_-2px_hsl(195_95%_55%/0.4)]",
};

/** Animation durations for `viv-gradient-pan`. Map to Tailwind arbitrary durations. */
const GRADIENT_DURATION: Record<GradientSpeed, string> = {
  slow: "12s",
  normal: "6s",
  fast: "3s",
};

function resolveGradient(props: {
  gradient?: boolean | GradientPreset;
  gradientSpeed?: GradientSpeed;
  sheen?: boolean;
}): ResolvedGradient {
  if (!props.gradient) {
    return { enabled: false, preset: "brand", speed: "normal", sheen: false };
  }
  const preset: GradientPreset =
    typeof props.gradient === "string" ? props.gradient : "brand";
  return {
    enabled: true,
    preset,
    speed: props.gradientSpeed ?? "normal",
    sheen: props.sheen ?? true,
  };
}

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      radius,
      hoverEffect,
      interactive,
      glass,
      blur,
      tint,
      glow,
      gradient,
      gradientSpeed,
      sheen,
      children,
      ...props
    },
    ref,
  ) => {
    const g = resolveGlass({ glass, blur, tint, glow, variant });
    const gr = resolveGradient({ gradient, gradientSpeed, sheen });

    // When glass is enabled, the frame's own multi-layer box-shadow holds
    // inset highlights that give the card its "edge of glass" feel. The
    // glow hoverEffect's `hover:shadow-*` would otherwise replace the
    // entire box-shadow on hover, killing those highlights and making the
    // corners read as flat / cut off. We compose a single hover shadow
    // here that keeps the insets AND adds the brand glow.
    const isGlassWithGlow =
      g.enabled && !gr.enabled && hoverEffect === "glow";
    const hasLayers = g.enabled || gr.enabled;

    return (
      <div
        ref={ref}
        data-variant={variant ?? "elevated"}
        data-glass={g.enabled || undefined}
        data-gradient={gr.enabled ? gr.preset : undefined}
        className={cn(
          cardVariants({ variant, padding, radius, hoverEffect, interactive }),
          // Glass frame — applied when glass is enabled AND no gradient
          // (gradient owns the surface and its own shadow tokens).
          g.enabled && !gr.enabled && [
            "relative overflow-hidden",
            "bg-transparent",
            "border border-white/30 dark:border-white/12",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_1px_0_0_0_rgba(255,255,255,0.18),0_10px_28px_-8px_rgba(0,0,0,0.18)]",
            "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_1px_0_0_0_rgba(255,255,255,0.06),0_10px_28px_-6px_rgba(0,0,0,0.45)]",
          ],
          // Glass + glow: combine glass insets + brand inset ring + outer brand blur.
          isGlassWithGlow && [
            "hover:border-brand/45",
            "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_1px_0_0_0_rgba(255,255,255,0.18),inset_0_0_0_1px_hsl(var(--viv-brand)/0.4),0_0_32px_-2px_hsl(var(--viv-brand)/0.5)]",
            "dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_1px_0_0_0_rgba(255,255,255,0.06),inset_0_0_0_1px_hsl(var(--viv-brand)/0.55),0_0_36px_-2px_hsl(var(--viv-brand)/0.6)]",
          ],
          // Gradient frame — overrides bg/text/border/shadow. `group/gradient`
          // is the named hover scope used by the sheen layer below.
          gr.enabled && [
            "group/gradient relative overflow-hidden",
            "bg-transparent text-white",
            "border border-white/15",
            GRADIENT_SHADOW[gr.preset],
          ],
          className,
        )}
        {...props}
      >
        {hasLayers ? (
          <>
            {/*
              z-0 — surface layer. When `gradient` is on, this is the animated
              multi-color background. Otherwise (glass-only), it's the legacy
              decorative blob that gives the frost something to blur.
            */}
            {gr.enabled ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
                style={{
                  backgroundImage: GRADIENT_BG[gr.preset],
                  backgroundSize: "200% 200%",
                  animation: `viv-gradient-pan ${GRADIENT_DURATION[gr.speed]} linear infinite`,
                }}
              />
            ) : g.glow ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-12 z-0 h-[80%] w-[80%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, hsl(258 95% 68% / 0.75) 0%, hsl(218 95% 58% / 0.5) 32%, transparent 70%)",
                  filter: "blur(6px)",
                }}
              />
            ) : null}

            {/*
              z-[1] — frosted glass overlay. With gradient enabled, the frost
              blurs the gradient layer below, producing a colored-glass effect.
              `rounded-[inherit]` is critical — backdrop-filter creates its own
              stacking context that some browsers don't clip cleanly with the
              parent's overflow:hidden, so we mirror the parent radius here.
            */}
            {g.enabled ? (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 z-[1] rounded-[inherit]",
                  BLUR_CLASS[g.blur],
                  "backdrop-saturate-[140%]",
                )}
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 42%, rgba(255,255,255,0.10) 100%), hsl(var(--viv-surface) / ${g.tint})`,
                }}
              />
            ) : null}

            {/*
              z-[2] — diagonal sheen sweep on hover. Same motion as the AI
              button: a translucent white bar parked off-canvas that sweeps
              across when the card is hovered. Skewed -12° to read as light
              reflection rather than a wipe transition.
            */}
            {gr.enabled && gr.sheen ? (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-y-0 -left-1/3 z-[2] w-1/3",
                  "bg-gradient-to-r from-transparent via-white/40 to-transparent",
                  "translate-x-[-200%] skew-x-[-12deg] opacity-0",
                  "transition-[transform,opacity] duration-[800ms] ease-viv-out",
                  "group-hover/gradient:translate-x-[400%] group-hover/gradient:opacity-100",
                )}
              />
            ) : null}

            <div className="relative z-10">{children}</div>
          </>
        ) : (
          children
        )}
      </div>
    );
  },
);
CardRoot.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "Card.Header";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-lg font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "Card.Title";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "Card.Description";

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-4", className)} {...props} />
  ),
);
CardBody.displayName = "Card.Body";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-2 pt-4", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "Card.Footer";

/* -------------------------------------------------------------------------- */
/*                              Card.Media                                     */
/* -------------------------------------------------------------------------- */

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio of the media surface. */
  aspect?: "video" | "square" | "wide" | "tall" | "auto";
  /**
   * Where the media sits inside the card. The matching corners auto-round
   * to inherit the card's radius, and matching margins bleed to the edge.
   */
  position?: "top" | "bottom" | "full" | "inline";
  /** Card padding the media bleeds to. Match this with the parent card's `padding`. */
  bleed?: "none" | "sm" | "md" | "lg";
}

const bleedMap = {
  none: "",
  sm: "-mx-3",
  md: "-mx-5",
  lg: "-mx-7",
} as const;

const bleedTopMap = {
  none: "",
  sm: "-mt-3 mb-3",
  md: "-mt-5 mb-4",
  lg: "-mt-7 mb-5",
} as const;

const bleedBottomMap = {
  none: "",
  sm: "-mb-3 mt-3",
  md: "-mb-5 mt-4",
  lg: "-mb-7 mt-5",
} as const;

const bleedFullMap = {
  none: "",
  sm: "-m-3",
  md: "-m-5",
  lg: "-m-7",
} as const;

/**
 * Card.Media — visual area inside a card (image, video, custom svg).
 *
 *   <Card padding="md">
 *     <Card.Media aspect="video" position="top" bleed="md">
 *       <img src="..." alt="..." />
 *     </Card.Media>
 *     <Card.Header>...</Card.Header>
 *   </Card>
 */
const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  (
    { className, aspect = "video", position = "top", bleed = "md", children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-surface-overlay",
        "[&>img]:size-full [&>img]:object-cover",
        "[&>video]:size-full [&>video]:object-cover",
        aspect === "video" && "aspect-video",
        aspect === "square" && "aspect-square",
        aspect === "wide" && "aspect-[16/7]",
        aspect === "tall" && "aspect-[3/4]",
        position !== "inline" && bleedMap[bleed],
        position === "top" && [bleedTopMap[bleed], "rounded-t-[inherit]"],
        position === "bottom" && [bleedBottomMap[bleed], "rounded-b-[inherit]"],
        position === "full" && [bleedFullMap[bleed], "rounded-[inherit]"],
        position === "inline" && "rounded-[calc(var(--viv-radius-lg)-4px)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
CardMedia.displayName = "Card.Media";

/* -------------------------------------------------------------------------- */
/*                              Card.Glow                                      */
/* -------------------------------------------------------------------------- */

export interface CardGlowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tailwind color (e.g. "brand", "info", "danger") OR raw CSS color. */
  color?: string;
  /** Where the blob is anchored inside the card. */
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  /** Diameter as a percentage of the card's smaller axis. */
  size?: number;
  /** Visual blur in pixels for the blob itself (separate from glass blur). */
  blur?: number;
  /** Opacity multiplier (0–1). */
  intensity?: number;
}

/**
 * Card.Glow — decorative color blob placed inside any Card, designed to
 * pair with `variant="glassmorphism"`. Without a blob, glassmorphism on a
 * flat background looks washed out; the glow gives the frosted overlay
 * something to blur against.
 *
 *   <Card variant="glassmorphism">
 *     <Card.Glow color="hsl(310 95% 65%)" position="top-left" />
 *     <Card.Header>...</Card.Header>
 *   </Card>
 *
 * When this is rendered inside a glassmorphism card, the default blob
 * behind the glass is suppressed automatically (CSS specificity).
 */
const CardGlow = React.forwardRef<HTMLSpanElement, CardGlowProps>(
  (
    {
      className,
      color = "hsl(258 95% 68%)",
      position = "bottom-right",
      size = 80,
      blur = 6,
      intensity = 0.75,
      style,
      ...props
    },
    ref,
  ) => {
    const positionClass = {
      "top-left": "-top-16 -left-12",
      "top-right": "-top-16 -right-12",
      "bottom-left": "-bottom-16 -left-12",
      "bottom-right": "-bottom-16 -right-12",
      center:
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    }[position];

    return (
      <span
        ref={ref}
        aria-hidden="true"
        data-card-glow=""
        className={cn(
          "pointer-events-none absolute z-0 rounded-full",
          positionClass,
          className,
        )}
        style={{
          width: `${size}%`,
          height: `${size}%`,
          background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color} 18%, transparent 70%)`,
          opacity: intensity,
          filter: `blur(${blur}px)`,
          ...style,
        }}
        {...props}
      />
    );
  },
);
CardGlow.displayName = "Card.Glow";

/* -------------------------------------------------------------------------- */
/*                            Card.CloseButton                                 */
/* -------------------------------------------------------------------------- */

export interface CardCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. Defaults to "Close". */
  "aria-label"?: string;
}

const CardCloseButton = React.forwardRef<HTMLButtonElement, CardCloseButtonProps>(
  ({ className, "aria-label": ariaLabel = "Close", children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      className={cn(
        "absolute right-3 top-3 z-10",
        "inline-flex size-7 items-center justify-center rounded-full",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-surface-overlay viv-focus-ring",
        "transition-colors duration-fast ease-viv-out",
        className,
      )}
      {...props}
    >
      {children ?? <CloseIcon />}
    </button>
  ),
);
CardCloseButton.displayName = "Card.CloseButton";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CardStack                                      */
/* -------------------------------------------------------------------------- */

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of decorative layer cards rendered behind the primary content. */
  layers?: number;
  /**
   * Vertical offset between layers, in pixels. Layers stack *behind* the
   * front card by default — i.e. their tops peek upward above the front
   * card's edge, so it reads as a deck rather than a fanned-out spread.
   */
  offset?: number;
  /** Scale reduction per layer (0–1). Smaller values = tighter deck. */
  scaleStep?: number;
  /**
   * Where the layers stack relative to the front card.
   *   • `"behind"` (default) — back-to-back deck; layers peek up above.
   *   • `"down"`              — layers fan out below.
   *   • `"up"`                — layers fan out above with full Y offset.
   */
  direction?: "behind" | "down" | "up";
  /** Animate the stack on hover. */
  hover?: boolean;
  /** Tailwind radius utility for the layer cards. Match the foreground card. */
  layerRadius?: string;
}

/**
 * CardStack — wraps a single Card to create a stacked deck effect.
 *
 *   <CardStack layers={2}>
 *     <Card variant="elevated">...</Card>
 *   </CardStack>
 *
 * Default direction is `"behind"`: layers sit directly behind the front
 * card with a subtle upward peek, evoking a deck of cards rather than a
 * staircase. Hover state is React-driven (not Tailwind hover utilities)
 * because each layer's transform depends on its index, and Tailwind's
 * JIT can't statically resolve interpolated class names at build time.
 */
export const CardStack = React.forwardRef<HTMLDivElement, CardStackProps>(
  (
    {
      children,
      layers = 2,
      offset = 6,
      scaleStep = 0.03,
      direction = "behind",
      hover = true,
      layerRadius = "rounded-xl",
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn("relative isolate", className)}
        style={style}
        onMouseEnter={(e) => {
          if (hover) setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (hover) setIsHovered(false);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {Array.from({ length: layers }).map((_, i) => {
          const depth = i + 1; // 1 = nearest behind, 2 = farther, …
          // Direction sign: behind/up peek above (-Y), down peeks below (+Y).
          // For `behind`, the offset is intentionally tiny so each layer just
          // shows a sliver at the top — the back-to-back deck look.
          const sign = direction === "down" ? 1 : -1;
          const baseOffset = direction === "behind" ? offset : offset * 1.6;
          const ty = sign * depth * baseOffset * (isHovered ? 1.4 : 1);
          const scale = 1 - depth * scaleStep * (isHovered ? 0.85 : 1);
          const opacity = (1 - depth * 0.16) * (isHovered ? 0.95 : 1);
          return (
            <div
              key={i}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 -z-10",
                layerRadius,
                "bg-surface border border-border/40 shadow-viv-sm",
                "transition-[transform,opacity] duration-slow ease-viv-out",
              )}
              style={{
                transform: `translate3d(0, ${ty}px, 0) scale(${scale})`,
                opacity,
              }}
            />
          );
        })}
        {children}
      </div>
    );
  },
);
CardStack.displayName = "CardStack";

/* -------------------------------------------------------------------------- */
/*                          Compound assembly                                  */
/* -------------------------------------------------------------------------- */

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Media: typeof CardMedia;
  Glow: typeof CardGlow;
  CloseButton: typeof CardCloseButton;
};

export const Card = CardRoot as CardComponent;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Media = CardMedia;
Card.Glow = CardGlow;
Card.CloseButton = CardCloseButton;

// Flat exports for tree-shaking precision and direct imports.
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  CardMedia,
  CardGlow,
  CardCloseButton,
};
