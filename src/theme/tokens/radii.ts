export const radii = {
  none: "0",
  xs: "var(--viv-radius-xs)",
  sm: "var(--viv-radius-sm)",
  DEFAULT: "var(--viv-radius)",
  md: "var(--viv-radius-md)",
  lg: "var(--viv-radius-lg)",
  xl: "var(--viv-radius-xl)",
  "2xl": "var(--viv-radius-2xl)",
  "3xl": "var(--viv-radius-3xl)",
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radii;
