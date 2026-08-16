# VivUI Architecture

This is the deep-dive companion to the README. It explains *why* VivUI is shaped
the way it is, so you can extend it without breaking the contracts.

---

## 1. Three concerns, three pipelines

VivUI keeps three concerns intentionally separate:

| Concern | Source | Pipeline | Output |
| --- | --- | --- | --- |
| **The npm package** | `src/` | `tsup` | `dist/` (ESM + CJS + .d.ts) |
| **The docs site** | `src/**/*.stories.tsx`, `docs/**/*.mdx` | `storybook build` (Vite) | `storybook-static/` |
| **The CSS bundle** | `src/styles/globals.css` | `tailwindcss -i … -o …` | `dist/styles.css` |

Storybook reads the *source* (so HMR is instant), but the published package
ships the bundled `dist/`. This is what lets the two evolve independently:
docs can deploy on every commit, releases happen on Changesets cadence.

```
                                ┌─────────────────────────┐
                                │       src/components    │
                                └────────────┬────────────┘
                                             │
                ┌────────────────────────────┼────────────────────────────┐
                ▼                            ▼                            ▼
       ┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
       │     tsup        │         │    Storybook     │         │    Tailwind CLI  │
       │  ESM + CJS + dts│         │    (Vite)        │         │  globals.css →   │
       └────────┬────────┘         └────────┬─────────┘         │  dist/styles.css │
                ▼                           ▼                   └────────┬─────────┘
            dist/*.{js,cjs,d.ts}      storybook-static/                  ▼
                │                           │                       dist/styles.css
                ▼                           ▼                            │
           npm publish                GH Pages / Vercel                  │
                │                           │                            │
                └─────────────► consumed by users ◄──────────────────────┘
```

## 2. Component anatomy

Every component lives in its own folder with this exact 5-file layout:

```
Button/
├── Button.tsx           # JSX + behavior (no styles inlined as raw classes when avoidable)
├── Button.variants.ts   # CVA configuration (variant/size/state class maps)
├── Button.stories.tsx   # Storybook stories — mandatory
├── Button.test.tsx      # Vitest + RTL — mandatory
└── index.ts             # public re-exports (component, types, variants fn)
```

**Why split `.variants.ts`?**

- Variants become reusable type primitives via `VariantProps<typeof buttonVariants>`.
- Stories and tests can import the same source of truth.
- Component file stays focused on JSX + accessibility logic.

**Why mandatory stories + tests?**

- Stories *are* the docs. No story = no docs.
- Tests gate keyboard/ARIA contracts that visual review can't catch.

## 3. Variant system (CVA)

We use [`class-variance-authority`](https://cva.style) for one reason: it
gives us **type-safe variant unions for free**.

```ts
const buttonVariants = cva("base", {
  variants: { variant: { solid: "...", outline: "..." }, size: { sm: "...", md: "..." } },
  defaultVariants: { variant: "solid", size: "md" },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;
//   ^? { variant?: "solid" | "outline"; size?: "sm" | "md" }
```

Combined with `cn()` (clsx + tailwind-merge), consumers can override any
default with `className` and the override actually wins:

```tsx
<Button className="p-8" />   // wins over the variant's default `px-4`
```

## 4. Theming — variables, not props

The biggest architectural decision in VivUI is: **all visual values are CSS variables**.

```
:root, [data-theme="light"]   → defines defaults
[data-theme="dark"]           → overrides for dark
[data-theme="cyber"]          → user-defined themes (any depth)
```

Components reference variables through Tailwind utilities (via the preset),
never hard-coded hexes. Three consequences:

1. **No prop-drilling** of theme state — flipping `data-theme` retheming all descendants.
2. **Per-subtree theming** — wrap any subtree with a different `data-theme`.
3. **Animatable** — variables transition like any CSS property; no React rerenders.

The `<ThemeProvider />` is *just* a wrapper that sets `data-theme` on `<html>`
(or a wrapper div) and exposes `useTheme()`. The actual theming is CSS.

## 5. SSR & hydration

Concerns:

- **No `window` reads at module scope.** Anything that touches `window`
  is wrapped in `useEffect` or guarded with `typeof window !== "undefined"`.
- **No theme flash.** `<VivUIScript />` is a tiny inline `<script>` that
  reads `localStorage` and the system preference *before* React hydrates
  and writes `data-theme` to `<html>`.
- **`"use client"` everywhere.** All component files start with `"use client"`,
  and tsup re-emits this banner on the bundled output, so Next.js Server
  Components can import them safely.
- **Refs forwarded** so RSC parents can hand them to client children.

## 6. Tree-shaking

Three rules keep tree-shaking healthy:

1. **`sideEffects: ["**/*.css"]`** in package.json — only CSS has side effects.
2. **Per-component entries** — `tsup` is configured with multiple `entry`
   points (one per public sub-path), so importing `Button` doesn't pull
   in `Card`'s code or types.
3. **No barrel re-exports of dynamic modules.** The barrel only contains
   pure ESM re-exports; bundlers can drop unused names.

Verify any time:

```bash
pnpm dlx esm-bundler-trace @vivui/react Button
# or import { Button } in a tiny app and look at the chunk graph
```

## 7. Storybook as documentation

Storybook plays three roles:

1. **Dev environment** — `pnpm storybook` boots a Vite dev server with HMR.
   Edits to component or story show up instantly.
2. **Documentation site** — every story tagged `autodocs` gets an MDX-style
   docs page with: a description, a live "Primary" preview, args/controls
   table generated from TS types via `react-docgen-typescript`, and source.
3. **Visual + a11y testing surface** — the `addon-a11y` panel runs axe-core
   per story; `addon-interactions` lets you write `play()` functions that
   simulate user behavior (and Vitest reuses the same patterns).

### Story conventions

- Title hierarchy: `Foundations/...`, `Primitives/...`, `Layout/...`, `Feedback/...`, `Overlay/...`, `Forms/...`.
- Tag every meta with `tags: ["autodocs"]`.
- Always include an `AllVariants` and an `AllSizes` story — these become
  visual matrix references.
- Reserve the **default named export** for `meta`; reserve `Solid` / `Outline` /
  etc. for the variants — story names map 1:1 to variant names where possible.
- Decorate with `<div className="w-[…]">` if the component is full-width by default.

### MDX docs pages (`docs/*.mdx`)

These power the **Foundations** sidebar group: Introduction, Design Tokens,
Theming, Accessibility, Motion. Use them for narrative content; use stories
for live previews.

## 8. Versioning & release

[Changesets](https://github.com/changesets/changesets) drive everything:

- Every PR with a behavior change must include a `.changeset/*.md`.
- The Release workflow batches changesets into a single "Version Packages" PR.
- Merging that PR runs `changeset publish` → npm. Provenance is enabled.

We follow strict **semver**:

- **Patch** — bug fix, doc, internal refactor with no API change.
- **Minor** — new component, new prop, new variant, new export.
- **Major** — removed/renamed export, prop signature change, default change
  that visibly shifts existing consumers, dropped framework version.

## 9. Recommended component build order

The order matters — later components depend on earlier patterns:

1. **Foundations**: `cn`, `cva`, tokens, `ThemeProvider`. ✅ done
2. **Primitives**: `Button`, `Input`, `Badge`. ✅ done
3. **Layout**: `Card`, `Stack`, `Container`, `Separator`.
4. **Forms**: `Label`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`, `Select`.
5. **Overlay** (build on Radix UI primitives): `Dialog`, `Popover`, `Tooltip`, `DropdownMenu`.
6. **Feedback**: `Toast`, `Alert`, `Progress`, `Skeleton`, `Spinner`.
7. **Navigation**: `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar`.
8. **Data**: `Avatar`, `Table`, `Command`, `Combobox`.
9. **AI-native (where VivUI shines)**: `PromptInput`, `MessageBubble`,
   `ThinkingIndicator`, `StreamingText`, `Suggestion`, `Source`, `ModelBadge`.

Avoid early: virtualized tables, calendars, rich-text editors — these are
their own libraries; start with adapters once the system is stable.

## 10. Testing strategy

| Layer | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest + RTL | render, ARIA, ref forwarding, event handling |
| Interaction | Storybook `play()` | flows that span multiple states |
| Accessibility | `@storybook/addon-a11y` (axe-core) | every story automatically |
| Visual regression | (optional) Chromatic / Loki | Storybook → snapshots |
| Type | `tsc --noEmit` in CI | every PR |

Aim for **≥80%** statement coverage on `src/components/**`.
