/**
 * Typography tokens — VivUI is *display-led*: a tight modern type scale
 * with optical-size aware fonts (Inter, Space Grotesk, JetBrains Mono).
 */
export const fontFamilies = {
  sans: "var(--viv-font-sans)",
  display: "var(--viv-font-display)",
  mono: "var(--viv-font-mono)",
} as const;

export const fontSizes = {
  xs: ["12px", { lineHeight: "16px", letterSpacing: "0.02em" }],
  sm: ["14px", { lineHeight: "20px", letterSpacing: "0.005em" }],
  base: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
  lg: ["18px", { lineHeight: "28px", letterSpacing: "-0.005em" }],
  xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
  "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em" }],
  "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
  "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-0.025em" }],
  "5xl": ["48px", { lineHeight: "1", letterSpacing: "-0.03em" }],
  "6xl": ["60px", { lineHeight: "1", letterSpacing: "-0.035em" }],
  "7xl": ["72px", { lineHeight: "1", letterSpacing: "-0.04em" }],
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;
export type FontSizeToken = keyof typeof fontSizes;
export type FontWeightToken = keyof typeof fontWeights;
