/**
 * Color tokens — semantic, theme-driven.
 *
 * Each value is the *name* of a CSS variable (defined in styles/globals.css).
 * Do not hard-code raw hex values in components — always reference these.
 */
export const colorTokens = {
  brand: {
    DEFAULT: "var(--viv-brand)",
    foreground: "var(--viv-brand-foreground)",
    subtle: "var(--viv-brand-subtle)",
    muted: "var(--viv-brand-muted)",
  },
  background: "var(--viv-bg)",
  surface: {
    DEFAULT: "var(--viv-surface)",
    elevated: "var(--viv-surface-elevated)",
    overlay: "var(--viv-surface-overlay)",
  },
  foreground: "var(--viv-fg)",
  muted: {
    DEFAULT: "var(--viv-muted)",
    foreground: "var(--viv-muted-foreground)",
  },
  border: "var(--viv-border)",
  ring: "var(--viv-ring)",
  success: {
    DEFAULT: "var(--viv-success)",
    foreground: "var(--viv-success-foreground)",
  },
  warning: {
    DEFAULT: "var(--viv-warning)",
    foreground: "var(--viv-warning-foreground)",
  },
  danger: {
    DEFAULT: "var(--viv-danger)",
    foreground: "var(--viv-danger-foreground)",
  },
  info: {
    DEFAULT: "var(--viv-info)",
    foreground: "var(--viv-info-foreground)",
  },
} as const;

export type ColorTokens = typeof colorTokens;
