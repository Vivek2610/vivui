export const shadows = {
  none: "none",
  xs: "var(--viv-shadow-xs)",
  sm: "var(--viv-shadow-sm)",
  DEFAULT: "var(--viv-shadow)",
  md: "var(--viv-shadow-md)",
  lg: "var(--viv-shadow-lg)",
  xl: "var(--viv-shadow-xl)",
  glow: "var(--viv-shadow-glow)",
  inner: "var(--viv-shadow-inner)",
} as const;

export type ShadowToken = keyof typeof shadows;
