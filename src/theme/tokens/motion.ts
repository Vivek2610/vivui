/**
 * Motion tokens — VivUI is motion-first, so durations and easings are
 * first-class design primitives.
 */
export const durations = {
  instant: "var(--viv-duration-instant)",
  fast: "var(--viv-duration-fast)",
  DEFAULT: "var(--viv-duration)",
  slow: "var(--viv-duration-slow)",
  slower: "var(--viv-duration-slower)",
} as const;

export const easings = {
  /** Smooth, expressive default — used for most UI motion. */
  DEFAULT: "var(--viv-ease)",
  /** Sharp acceleration into action — for exits. */
  in: "var(--viv-ease-in)",
  /** Decelerating ease — for entrances and slide-ins. */
  out: "var(--viv-ease-out)",
  /** Bouncy spring — for playful or AI feedback motions. */
  spring: "var(--viv-ease-spring)",
} as const;

export type DurationToken = keyof typeof durations;
export type EasingToken = keyof typeof easings;
