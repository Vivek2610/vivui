import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const preset = require("./tailwind.preset.cjs") as Partial<Config>;

/**
 * Internal Tailwind config (used by Storybook, Vitest, and the
 * pre-compiled `dist/styles.css`).
 *
 * Consumers of the published npm package don't use this file directly —
 * they extend `tailwind.preset.cjs` instead.
 */
const config: Config = {
  presets: [preset],
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./.storybook/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
