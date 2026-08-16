/**
 * Internal — shared "surface" tokens for glass + animated-gradient effects.
 *
 * This module is consumed by overlay-style components (Modal, Popup,
 * Drawer) that share the same Card-like surface vocabulary:
 *   - frosted glass (with blur / tint / inner glow)
 *   - animated multi-stop gradient backgrounds (with optional sheen sweep)
 *
 * The component-level JSX layers are NOT here on purpose. Each consumer
 * renders its own absolutely-positioned <span>s for the gradient blob,
 * frosted overlay, and sheen — they share the data, not the markup.
 *
 * Not exported from the package's public entry points; it is bundled into
 * whatever chunk imports it, but consumers cannot reach it through
 * `package.json`'s `exports` map.
 */

/* -------------------------------------------------------------------------- */
/*                                  Types                                      */
/* -------------------------------------------------------------------------- */

/**
 * Glass presets — balanced defaults for blur / tint / glow that are
 * tuned to a single visual goal. Any individual prop overrides.
 */
export type GlassPreset = "subtle" | "medium" | "strong";

/** Backdrop-blur strength tokens. Map directly to Tailwind utilities. */
export type GlassBlur =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

/**
 * Animated-gradient palettes — same family used by the gradient button.
 *   • brand  — VivUI signature (blue → violet → magenta)
 *   • aurora — cool teal → indigo → magenta
 *   • sunset — warm orange → pink → violet
 *   • ocean  — cyan → blue → indigo
 */
export type GradientPreset = "brand" | "aurora" | "sunset" | "ocean";

/** Pan speed for the `viv-gradient-pan` keyframe. */
export type GradientSpeed = "slow" | "normal" | "fast";

export interface ResolvedGlass {
  enabled: boolean;
  blur: GlassBlur;
  tint: number;
  glow: boolean;
}

export interface ResolvedGradient {
  enabled: boolean;
  preset: GradientPreset;
  speed: GradientSpeed;
  sheen: boolean;
}

/* -------------------------------------------------------------------------- */
/*                            Glass tokens                                     */
/* -------------------------------------------------------------------------- */

export const GLASS_PRESETS: Record<GlassPreset, Omit<ResolvedGlass, "enabled">> = {
  subtle: { blur: "md", tint: 0.55, glow: false },
  medium: { blur: "xl", tint: 0.3, glow: true },
  strong: { blur: "2xl", tint: 0.18, glow: true },
};

/**
 * Tailwind class lookup for `backdrop-blur-*`. Listed exhaustively so
 * the JIT compiler picks them up at build time (dynamic class
 * concatenation defeats Tailwind's content scan).
 */
export const BLUR_CLASS: Record<GlassBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

export interface ResolveGlassInput {
  glass?: boolean | GlassPreset;
  blur?: GlassBlur;
  tint?: number;
  glow?: boolean;
}

/**
 * Convert the user-facing glass props into a fully resolved struct that
 * downstream renderers can use to emit className + inline style.
 *
 * Resolution order:
 *   1. `glass={false}`  → disabled, regardless of preset/blur/tint/glow.
 *   2. `glass={true}`   → "medium" preset.
 *   3. `glass="..."`    → named preset.
 *   4. (no glass)       → disabled.
 *
 * Once a preset is selected, individual `blur`/`tint`/`glow` props
 * override the preset's defaults. This lets a consumer say
 * `glass="strong" blur="md"` to get a strong glass with a softer frost.
 */
export function resolveGlass(input: ResolveGlassInput): ResolvedGlass {
  let preset: GlassPreset | null = null;
  if (input.glass === false) {
    preset = null;
  } else if (input.glass === true) {
    preset = "medium";
  } else if (typeof input.glass === "string") {
    preset = input.glass;
  }

  if (!preset) {
    return { enabled: false, blur: "none", tint: 0, glow: false };
  }

  const defaults = GLASS_PRESETS[preset];
  return {
    enabled: true,
    blur: input.blur ?? defaults.blur,
    tint: input.tint ?? defaults.tint,
    glow: input.glow ?? defaults.glow,
  };
}

/**
 * Inline `linear-gradient(...)` background for the frosted-glass overlay
 * span. Keeps a top-left highlight + a faint bottom-right specular
 * over a tinted surface so the layer reads as glass even on flat
 * backgrounds. The tint is interpolated by the caller.
 */
export function glassOverlayBackground(tint: number): string {
  return `linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 42%, rgba(255,255,255,0.10) 100%), hsl(var(--viv-surface) / ${tint})`;
}

/* -------------------------------------------------------------------------- */
/*                          Animated-gradient tokens                           */
/* -------------------------------------------------------------------------- */

/**
 * Five-stop linear-gradients per palette. The first and last stops match
 * so the panning animation loops without a visible reset. Set as inline
 * `background-image` because Tailwind cannot statically extract per-prop
 * gradient stop lists.
 */
export const GRADIENT_BG: Record<GradientPreset, string> = {
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
 * classes so the JIT picks them up at build time. Each preset pairs an
 * inset top-edge highlight with two colored drop-shadows that echo the
 * gradient's dominant hues.
 */
export const GRADIENT_SHADOW: Record<GradientPreset, string> = {
  brand:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(258_95%_65%/0.55),0_3px_10px_-2px_hsl(310_85%_65%/0.4)]",
  aurora:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(240_90%_60%/0.55),0_3px_10px_-2px_hsl(320_85%_60%/0.4)]",
  sunset:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(15_90%_60%/0.55),0_3px_10px_-2px_hsl(330_85%_60%/0.4)]",
  ocean:
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_10px_28px_-4px_hsl(220_90%_50%/0.55),0_3px_10px_-2px_hsl(195_95%_55%/0.4)]",
};

/** Animation durations for `viv-gradient-pan`. */
export const GRADIENT_DURATION: Record<GradientSpeed, string> = {
  slow: "14s",
  normal: "10s",
  fast: "6s",
};

export interface ResolveGradientInput {
  gradient?: boolean | GradientPreset;
  gradientSpeed?: GradientSpeed;
  sheen?: boolean;
}

export function resolveGradient(input: ResolveGradientInput): ResolvedGradient {
  if (!input.gradient) {
    return { enabled: false, preset: "brand", speed: "normal", sheen: false };
  }
  const preset: GradientPreset =
    typeof input.gradient === "string" ? input.gradient : "brand";
  return {
    enabled: true,
    preset,
    speed: input.gradientSpeed ?? "normal",
    sheen: input.sheen ?? true,
  };
}
