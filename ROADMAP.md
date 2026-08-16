# VivUI Roadmap

A living document. Items are listed in *recommended build order* — earlier ones
establish patterns later ones reuse.

## ✅ v0.1 — Foundations (shipped)

- [x] Design tokens (colors, spacing, radii, shadows, motion, typography, z-index)
- [x] `ThemeProvider`, `useTheme`, `VivUIScript`
- [x] `cn` utility, polymorphic types
- [x] `Button`, `Input`, `Card`, `Badge`
- [x] Storybook 8 with autodocs, a11y, themes addons
- [x] Tailwind preset for consumers
- [x] tsup ESM+CJS build, Changesets, GH Pages deploy

## v0.2 — Layout & Forms

- [ ] `Stack` (horizontal/vertical, responsive gap)
- [ ] `Container` (max-width tokens)
- [ ] `Separator` (semantic `<hr>` with orientation)
- [ ] `Label` (associated with inputs)
- [ ] `Textarea` (auto-resize variant)
- [ ] `Switch` (Radix-backed)
- [ ] `Checkbox` (Radix-backed)
- [ ] `RadioGroup` (Radix-backed)
- [ ] `FormField` (label + control + error + hint composition)

## v0.3 — Overlay

- [ ] `Dialog` (Radix-backed, glass + scale-in motion)
- [ ] `Popover`
- [ ] `Tooltip`
- [ ] `DropdownMenu`
- [ ] `Sheet` (side drawer)
- [ ] `Drawer` (mobile bottom sheet)

## v0.4 — Feedback

- [ ] `Toast` (Sonner-style queue)
- [ ] `Alert` (variants for success/warning/danger/info)
- [ ] `Progress` (linear + circular)
- [ ] `Skeleton` (shimmer animation)
- [ ] `Spinner` (sized)

## v0.5 — Navigation & Data

- [ ] `Tabs`
- [ ] `Breadcrumb`
- [ ] `Pagination`
- [ ] `Sidebar` (collapsible)
- [ ] `Avatar` (with status dot)
- [ ] `Table` (sortable, sticky header)
- [ ] `Command` (cmdk-style palette)
- [ ] `Combobox`

## v0.6 — AI-native (the differentiator)

This is where VivUI earns its identity vs. shadcn/Chakra/Radix.

- [ ] `PromptInput` — multi-line, slash commands, attachments
- [ ] `MessageBubble` — user/assistant variants, streaming, copy/regen actions
- [ ] `StreamingText` — token-by-token reveal with cursor
- [ ] `ThinkingIndicator` — reasoning steps with elapsed timer
- [ ] `Suggestion` — chip list with brand glow
- [ ] `Source` — RAG citation card
- [ ] `ModelBadge` — model name + quality tier
- [ ] `ToolCall` — collapsible JSON of an MCP/tool invocation
- [ ] `Diff` — inline before/after for AI-edited code

## v1.0 — Stability

- [ ] All components have stories + tests + a11y green
- [ ] Visual regression via Chromatic
- [ ] Public design tokens consumable from Figma (Tokens Studio export)
- [ ] Migration guide from shadcn/Chakra
- [ ] Documented "AI patterns" recipe gallery
