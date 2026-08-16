/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * VivUI Tailwind preset (public).
 *
 * Consumers add this to their tailwind.config in their app:
 *
 *   // tailwind.config.ts
 *   import vivui from "@vivui/react/tailwind-preset";
 *   export default {
 *     presets: [vivui],
 *     content: [
 *       "./src/**\/*.{ts,tsx}",
 *       "./node_modules/@vivui/react/dist/**\/*.{js,mjs,cjs}"
 *     ]
 *   };
 *
 * All design tokens are CSS variables (defined in styles.css),
 * so the preset just maps Tailwind utilities -> tokens.
 */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: "hsl(var(--viv-brand) / <alpha-value>)",
          foreground: "hsl(var(--viv-brand-foreground) / <alpha-value>)",
          subtle: "hsl(var(--viv-brand-subtle) / <alpha-value>)",
          muted: "hsl(var(--viv-brand-muted) / <alpha-value>)",
        },
        // Surfaces
        background: "hsl(var(--viv-bg) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--viv-surface) / <alpha-value>)",
          elevated: "hsl(var(--viv-surface-elevated) / <alpha-value>)",
          overlay: "hsl(var(--viv-surface-overlay) / <alpha-value>)",
        },
        // Text
        foreground: "hsl(var(--viv-fg) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--viv-muted) / <alpha-value>)",
          foreground: "hsl(var(--viv-muted-foreground) / <alpha-value>)",
        },
        // Borders
        border: "hsl(var(--viv-border) / <alpha-value>)",
        ring: "hsl(var(--viv-ring) / <alpha-value>)",
        // Status
        success: {
          DEFAULT: "hsl(var(--viv-success) / <alpha-value>)",
          foreground: "hsl(var(--viv-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--viv-warning) / <alpha-value>)",
          foreground: "hsl(var(--viv-warning-foreground) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--viv-danger) / <alpha-value>)",
          foreground: "hsl(var(--viv-danger-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--viv-info) / <alpha-value>)",
          foreground: "hsl(var(--viv-info-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        xs: "var(--viv-radius-xs)",
        sm: "var(--viv-radius-sm)",
        DEFAULT: "var(--viv-radius)",
        md: "var(--viv-radius-md)",
        lg: "var(--viv-radius-lg)",
        xl: "var(--viv-radius-xl)",
        "2xl": "var(--viv-radius-2xl)",
        "3xl": "var(--viv-radius-3xl)",
      },
      boxShadow: {
        "viv-xs": "var(--viv-shadow-xs)",
        "viv-sm": "var(--viv-shadow-sm)",
        viv: "var(--viv-shadow)",
        "viv-md": "var(--viv-shadow-md)",
        "viv-lg": "var(--viv-shadow-lg)",
        "viv-xl": "var(--viv-shadow-xl)",
        "viv-glow": "var(--viv-shadow-glow)",
        "viv-inner": "var(--viv-shadow-inner)",
      },
      backdropBlur: {
        glass: "var(--viv-blur-glass)",
      },
      fontFamily: {
        sans: ["var(--viv-font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--viv-font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--viv-font-display)", "var(--viv-font-sans)", "sans-serif"],
      },
      transitionTimingFunction: {
        viv: "var(--viv-ease)",
        "viv-in": "var(--viv-ease-in)",
        "viv-out": "var(--viv-ease-out)",
        "viv-spring": "var(--viv-ease-spring)",
      },
      transitionDuration: {
        instant: "var(--viv-duration-instant)",
        fast: "var(--viv-duration-fast)",
        DEFAULT: "var(--viv-duration)",
        slow: "var(--viv-duration-slow)",
        slower: "var(--viv-duration-slower)",
      },
      keyframes: {
        "viv-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "viv-fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "viv-slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "viv-scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "viv-shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "viv-pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--viv-brand) / 0.45)" },
          "50%": { boxShadow: "0 0 0 12px hsl(var(--viv-brand) / 0)" },
        },
        // Light bar that sweeps across a surface (used by AI button).
        "viv-sheen": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
        // Continuously pans a multi-stop gradient background (one direction
        // so the loop resets without a reverse stutter / flicker).
        "viv-gradient-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        // Soft outer glow that breathes (used by gradient/AI buttons).
        "viv-glow-breathe": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px hsl(var(--viv-brand) / 0.20), 0 8px 24px -4px hsl(var(--viv-brand) / 0.45)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px hsl(var(--viv-brand) / 0.35), 0 12px 40px -4px hsl(var(--viv-brand) / 0.65)",
          },
        },
        // AI typing cursor — blinking caret that mimics a code editor.
        "viv-caret-blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
        // Soft skeleton shimmer for AI loading states (drawn as a moving
        // light bar using a CSS background-position trick — works for any
        // element regardless of its background-color).
        "viv-skeleton": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "viv-fade-in": "viv-fade-in var(--viv-duration) var(--viv-ease)",
        "viv-fade-out": "viv-fade-out var(--viv-duration) var(--viv-ease)",
        "viv-slide-up": "viv-slide-up var(--viv-duration-slow) var(--viv-ease-out)",
        "viv-scale-in": "viv-scale-in var(--viv-duration) var(--viv-ease-out)",
        "viv-shimmer": "viv-shimmer 1.4s linear infinite",
        "viv-pulse-glow": "viv-pulse-glow 1.6s ease-out infinite",
        "viv-sheen": "viv-sheen 1.6s ease-out",
        "viv-sheen-loop": "viv-sheen 2.4s ease-out infinite",
        "viv-gradient-pan": "viv-gradient-pan 10s linear infinite",
        "viv-glow-breathe": "viv-glow-breathe 3.2s ease-in-out infinite",
        "viv-caret-blink": "viv-caret-blink 1.1s steps(2) infinite",
        "viv-skeleton": "viv-skeleton 2.4s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".viv-glass": {
          background: "hsl(var(--viv-surface) / 0.6)",
          "backdrop-filter": "blur(var(--viv-blur-glass)) saturate(140%)",
          "-webkit-backdrop-filter": "blur(var(--viv-blur-glass)) saturate(140%)",
          border: "1px solid hsl(var(--viv-border) / 0.6)",
        },
        ".viv-glass-strong": {
          background: "hsl(var(--viv-surface-elevated) / 0.7)",
          "backdrop-filter": "blur(calc(var(--viv-blur-glass) * 1.5)) saturate(160%)",
          "-webkit-backdrop-filter":
            "blur(calc(var(--viv-blur-glass) * 1.5)) saturate(160%)",
          border: "1px solid hsl(var(--viv-border) / 0.8)",
        },
        // Premium glassmorphism — diagonal sheen overlay + frosted background.
        // Used by Card variant="glassmorphism" and any consumer who wants a
        // higher-fidelity glass surface than the base `.viv-glass`.
        ".viv-glassmorphism": {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.08) 100%), hsl(var(--viv-surface) / 0.55)",
          "backdrop-filter": "blur(calc(var(--viv-blur-glass) * 1.2)) saturate(150%)",
          "-webkit-backdrop-filter":
            "blur(calc(var(--viv-blur-glass) * 1.2)) saturate(150%)",
          border: "1px solid hsl(var(--viv-border) / 0.7)",
        },
        ".viv-focus-ring": {
          outline: "2px solid transparent",
          "outline-offset": "2px",
          "&:focus-visible": {
            outline: "2px solid hsl(var(--viv-ring))",
            "outline-offset": "2px",
          },
        },
        // Subtle high-frequency noise — used by code blocks to break up
        // perfectly flat surfaces. Inline SVG so consumers don't need
        // to ship an asset. ~2KB after gzip.
        ".viv-noise": {
          "background-image":
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          "background-size": "160px 160px",
        },
        // Skeleton shimmer — a moving brand-tinted light bar that works
        // regardless of the element's own background color.
        ".viv-shimmer-bar": {
          "background-image":
            "linear-gradient(90deg, transparent 0%, hsl(var(--viv-brand) / 0.15) 30%, hsl(var(--viv-brand) / 0.35) 50%, hsl(var(--viv-brand) / 0.15) 70%, transparent 100%)",
          "background-size": "200% 100%",
          "background-repeat": "no-repeat",
          animation: "viv-skeleton 2.4s linear infinite",
        },
      });
    }),
  ],
};
