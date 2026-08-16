# Contributing to VivUI

Thanks for considering a contribution! VivUI keeps a high quality bar but the
process is simple.

## 1. Set up

```bash
pnpm install
pnpm storybook
```

The dev loop is **component → story → see it live in Storybook**. There's no
separate playground; stories *are* the playground.

## 2. Add a component

Use the canonical 5-file layout (see `ARCHITECTURE.md` §2):

```
src/components/Foo/
├── Foo.tsx
├── Foo.variants.ts
├── Foo.stories.tsx
├── Foo.test.tsx
└── index.ts
```

Then re-export from `src/components/index.ts`. The barrel from `src/index.ts`
will pick it up automatically.

## 3. Variant rules

- One CVA call per component, exported from `<Name>.variants.ts`.
- Default variants = the most-used combination.
- Avoid more than 4 axes (`variant`, `size`, plus 2 booleans). If you need
  more, the component is probably two components.

## 4. Accessibility checklist

Every PR must pass:

- [ ] Keyboard-only operable (Tab/Shift+Tab/Enter/Space/Esc/arrows where applicable)
- [ ] Visible focus ring (`viv-focus-ring` or equivalent)
- [ ] Storybook a11y panel: 0 violations on every new story
- [ ] Loading / disabled / error states communicate via ARIA, not just visuals

## 5. Tests

- Cover render, ARIA attributes, ref forwarding, primary user interaction.
- Use `userEvent`, not `fireEvent`.

## 6. Changeset

```bash
pnpm changeset
```

Pick:

- **patch** — bug fix, internal refactor
- **minor** — new component, new prop, new export, new variant
- **major** — removed export, prop signature change, default change

Commit the `.changeset/*.md` with your code. CI will fail without one when
`src/` changed.

## 7. PR

CI runs lint, typecheck, tests, build, and a Storybook build. The Storybook
artifact is uploaded to the PR for reviewers to download and inspect.

That's it. Welcome aboard.
