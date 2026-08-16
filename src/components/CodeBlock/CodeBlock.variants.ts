import { cva, type VariantProps } from "class-variance-authority";

/**
 * CodeBlock variants — VivUI's premium code surface.
 *
 * Visual axes:
 *   • variant — `standard` (frosted glass), `ai` (gradient outline + glow),
 *               `terminal` (Warp-style command shell), `ghost` (minimal,
 *               for inline-in-prose code blocks), `markdown` (matches the
 *               Markdown renderer's flow).
 *   • radius  — corner rounding token.
 *   • density — vertical rhythm of the code lines.
 *
 * Surfaces are layered by `CodeBlock.tsx`:
 *   • z-0  — gradient/blob underlay
 *   • z-1  — frosted overlay (backdrop-filter)
 *   • z-2  — noise texture (very subtle)
 *   • z-3  — sheen / shimmer
 *   • z-10 — content
 */
export const codeBlockVariants = cva(
  [
    "group/codeblock relative overflow-hidden isolate",
    "text-foreground",
    "transition-[transform,box-shadow,border-color] duration ease-viv-out",
    // Mono font for the entire surface — even the toolbar reads as code-y.
    "font-mono",
  ],
  {
    variants: {
      variant: {
        // ── Standard — frosted glass with a quiet violet edge.
        standard: [
          "border border-white/10 dark:border-white/8",
          "bg-[hsl(var(--viv-surface)/0.65)] dark:bg-[hsl(240_14%_8%/0.85)]",
          "backdrop-blur-xl backdrop-saturate-150",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_10px_28px_-8px_rgba(0,0,0,0.18)]",
          "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_44px_-10px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.02)]",
        ],
        // ── AI — gradient ring + ambient brand-colored glow.
        ai: [
          "border border-transparent",
          "bg-[hsl(var(--viv-surface)/0.6)] dark:bg-[hsl(240_14%_7%/0.82)]",
          "backdrop-blur-xl backdrop-saturate-150",
          "shadow-[inset_0_0_0_1px_hsl(258_95%_70%/0.45),0_0_0_1px_hsl(218_95%_60%/0.18),0_18px_46px_-12px_hsl(258_95%_65%/0.45),0_0_56px_-12px_hsl(218_95%_60%/0.4)]",
          "dark:shadow-[inset_0_0_0_1px_hsl(258_95%_70%/0.55),0_0_0_1px_hsl(218_95%_60%/0.25),0_18px_50px_-12px_hsl(258_95%_65%/0.6),0_0_72px_-12px_hsl(190_95%_60%/0.45)]",
        ],
        // ── Terminal — deep charcoal Warp/iTerm body with cyan halo.
        terminal: [
          "border border-white/8",
          "bg-[hsl(225_22%_7%/0.96)] text-[hsl(0_0%_98%)]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_44px_-10px_rgba(0,0,0,0.6),0_0_36px_-10px_hsl(190_95%_60%/0.35)]",
        ],
        // ── Ghost — minimal: just a border, no fancy surface treatment.
        // Useful when embedding code blocks inside other surfaces (Cards,
        // Modals) where the parent already supplies the frame.
        ghost: [
          "border border-border/60",
          "bg-surface-overlay/40",
        ],
        // ── Markdown — slim rounded chip matching the Markdown renderer.
        markdown: [
          "border border-border/50",
          "bg-[hsl(var(--viv-surface-overlay)/0.7)] dark:bg-[hsl(240_12%_10%/0.9)]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_4px_14px_-4px_rgba(0,0,0,0.12)]",
          "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_6px_18px_-6px_rgba(0,0,0,0.5)]",
        ],
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        "2xl": "rounded-[20px]",
      },
      density: {
        compact: "[--cb-line-height:1.55rem]",
        comfortable: "[--cb-line-height:1.75rem]",
      },
    },
    defaultVariants: {
      variant: "standard",
      radius: "xl",
      density: "comfortable",
    },
  },
);

export type CodeBlockVariants = VariantProps<typeof codeBlockVariants>;
