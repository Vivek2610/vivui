# VivUI

> **A futuristic, AI-native, motion-first React UI library.**
> Built with TypeScript, Tailwind CSS, design tokens, and Storybook-as-docs.

[![npm version](https://img.shields.io/npm/v/@vivui/react.svg?color=8b5cf6)](https://www.npmjs.com/package/@vivui/react)
[![types](https://img.shields.io/npm/types/@vivui/react.svg?color=3b82f6)](https://www.npmjs.com/package/@vivui/react)
[![bundle](https://img.shields.io/bundlephobia/minzip/@vivui/react?color=22c55e)](https://bundlephobia.com/package/@vivui/react)

VivUI gives you a Radix-grade primitive layer with a Chakra-grade DX, dressed in
a Aceternity-grade aesthetic. Glassmorphism, brand glow, motion tokens — all
swappable via CSS variables.

---

## Features

- ✨ **Futuristic, AI-first design** — glassmorphism, brand glow, motion tokens
- 🌗 **Dark/light + system theme** with no FOUC (`<VivUIScript />`)
- 🎨 **Token-driven theming** — pure CSS variables under `data-theme`
- 🧩 **Headless-grade primitives** — `asChild`, `forwardRef`, polymorphic
- 🪶 **Tree-shakeable** — per-folder entries, `sideEffects` honored
- ⚡ **SSR-safe** — works out of the box with Next.js App Router
- ♿ **A11y-first** — keyboard, ARIA, axe-checked in CI
- 📚 **Storybook 8** as both dev environment *and* the public docs site
- 🧪 **Vitest + RTL** for unit tests, axe for a11y
- 📦 **ESM + CJS + .d.ts** via `tsup`, published with provenance

## Install

```bash
pnpm add @vivui/react
```

## Set up Tailwind

```ts
// tailwind.config.ts (consumer app)
import vivui from "@vivui/react/tailwind-preset";

export default {
  presets: [vivui],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@vivui/react/dist/**/*.{js,mjs,cjs}",
  ],
};
```

```css
/* app/globals.css */
@import "@vivui/react/styles.css";
```

## Add the provider (Next.js App Router)

```tsx
// app/layout.tsx
import { ThemeProvider, VivUIScript } from "@vivui/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><VivUIScript /></head>
      <body>
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Use a component

```tsx
import { Button, Card, Badge } from "@vivui/react";

export default function Page() {
  return (
    <Card variant="glass">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Synthesize</Card.Title>
          <Badge variant="brand" withDot pulse>AI</Badge>
        </div>
        <Card.Description>Describe what you want — get UI back.</Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button>Generate</Button>
      </Card.Footer>
    </Card>
  );
}
```

---

## Repo layout

```
viv-ui/
├── .changeset/                # versioning + changelogs
├── .github/workflows/         # CI, release, Storybook deploy
├── .storybook/                # Storybook config (uses Vite under the hood)
├── docs/                      # MDX docs pages (Introduction, Tokens, Theming, A11y, Motion)
├── src/
│   ├── components/<Name>/
│   │   ├── <Name>.tsx
│   │   ├── <Name>.variants.ts
│   │   ├── <Name>.stories.tsx
│   │   ├── <Name>.test.tsx
│   │   └── index.ts
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── tokens/{colors,spacing,radii,shadows,motion,typography,zIndex}.ts
│   │   └── index.ts
│   ├── utils/{cn,polymorphic}.ts
│   ├── styles/globals.css     # CSS variable definitions (light + dark)
│   └── index.ts               # public entry
├── tests/setup.ts             # Vitest + RTL bootstrapping
├── tailwind.preset.cjs        # PUBLIC: consumers add this to their tailwind.config
├── tailwind.config.ts         # internal (Storybook + dist styles compile)
├── tsup.config.ts             # builds dist/ for npm
├── vitest.config.ts           # test environment
└── package.json
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | tsup watcher rebuilding `dist/` on change |
| `pnpm build` | Build `dist/` (ESM + CJS + d.ts) and compile `dist/styles.css` |
| `pnpm storybook` | Start Storybook on http://localhost:6006 |
| `pnpm storybook:build` | Static build of Storybook for deployment |
| `pnpm test` / `pnpm test:watch` | Vitest |
| `pnpm test:coverage` | Coverage (v8) |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | quality gates |
| `pnpm changeset` | record a semver-relevant change |
| `pnpm release` | build + publish via Changesets |

## Workflow

1. **Develop** — write a component in `src/components/<Name>/`. Add a `.stories.tsx`. Run `pnpm storybook` and iterate.
2. **Test** — `pnpm test:watch`. Co-locate tests next to source.
3. **Document** — Storybook auto-generates a docs page from your stories tagged `autodocs` and your TS prop types.
4. **Changeset** — `pnpm changeset` to describe the change.
5. **PR** — CI lints, typechecks, tests, builds, and uploads a Storybook preview.
6. **Merge to main** — Release workflow opens or merges a "Version Packages" PR; merging it publishes to npm. The Deploy workflow rebuilds Storybook to GitHub Pages.

## Components shipped (initial)

- `Button` — 7 variants × 6 sizes, `asChild`, loading
- `Input` — 4 variants × 3 sizes, adornments, invalid
- `Card` — compound (`Header / Title / Description / Body / Footer`)
- `Badge` — 9 variants × 3 sizes, dot + pulse

See [`ROADMAP.md`](./ROADMAP.md) for what's next.

## License

MIT © VivUI
