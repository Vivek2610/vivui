import { defineConfig } from "tsup";

/**
 * tsup builds the npm package output (consumed by React + Next.js apps).
 *
 * Why tsup:
 * - Zero-config esbuild powered bundler — extremely fast.
 * - Outputs ESM + CJS + .d.ts in one pass.
 * - Preserves "use client" directives, supports tree-shaking via per-file
 *   entry points (no single bundle), and respects `sideEffects`.
 *
 * Storybook is NOT built here — it has its own pipeline (Vite under the hood).
 * Storybook reads the *source* files in `src/` while users of the published
 * package consume `dist/`.
 */
export default defineConfig({
  entry: [
    "src/index.ts",
    "src/theme/index.ts",
    "src/theme/tokens/index.ts",
    "src/utils/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: false,
  target: "es2022",
  outDir: "dist",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // NOTE: We DON'T add `"use client"` here.
  //   tsup → Rollup chunk-splitting strips module-level directives during
  //   chunk merge. Instead, the `scripts/add-use-client.mjs` postbuild
  //   step prepends the directive to every emitted JS/CJS file. This is the
  //   pragmatic, well-trodden pattern for shipping a React library that
  //   plays nicely with the Next.js App Router.
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
