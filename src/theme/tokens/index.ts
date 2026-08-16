export * from "./colors";
export * from "./spacing";
export * from "./radii";
export * from "./shadows";
export * from "./motion";
export * from "./typography";
export * from "./zIndex";

import { colorTokens } from "./colors";
import { spacing } from "./spacing";
import { radii } from "./radii";
import { shadows } from "./shadows";
import { durations, easings } from "./motion";
import { fontFamilies, fontSizes, fontWeights } from "./typography";
import { zIndices } from "./zIndex";

/**
 * The complete VivUI token tree — primarily useful for
 * docs / Storybook auto-generated token tables.
 */
export const tokens = {
  colors: colorTokens,
  spacing,
  radii,
  shadows,
  durations,
  easings,
  fontFamilies,
  fontSizes,
  fontWeights,
  zIndices,
} as const;

export type Tokens = typeof tokens;
