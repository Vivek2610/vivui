/**
 * VivUI — public entry point.
 *
 * Tree-shaking strategy:
 *   - All exports are named (no default).
 *   - Components are split into per-folder files under src/components/<Name>.
 *   - The build (tsup) preserves entry boundaries and respects sideEffects.
 *   - Consumers should `import { Button } from "@vivui/react"` and bundlers
 *     will eliminate everything else.
 */

// Components
export * from "./components";

// Theme
export * from "./theme";

// Utilities (escape hatches consumers may want)
export { cn } from "./utils/cn";
export type {
  PolymorphicProps,
  PolymorphicRef,
  PolymorphicPropsWithRef,
  AsProp,
} from "./utils/polymorphic";

// Library version (replaced at build time if desired)
export const VIVUI_VERSION = "0.1.0";
