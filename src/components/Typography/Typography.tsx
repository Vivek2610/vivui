import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import {
  headingVariants,
  textVariants,
  codeInlineVariants,
  kbdVariants,
  type HeadingVariants,
  type TextVariants,
  type CodeInlineVariants,
  type KbdVariants,
} from "./Typography.variants";

/**
 * VivUI Typography primitives — Heading, Text, Code (inline), Kbd.
 *
 * Why a dedicated component when raw HTML works? Two reasons:
 *   1. Design tokens — the variant system bakes in font / leading / tracking
 *      decisions so consumers don't reinvent the type ramp.
 *   2. AI-native variants — `gradient`, `glow`, `ai` are repeatable accents
 *      used by VivUI's AI surfaces (CodeBlock, AI Answer card, etc.).
 *
 * All three primitives are polymorphic (`as`) and accept `asChild` for
 * interop with Next.js `<Link>`-style children.
 */

/* -------------------------------------------------------------------------- */
/*                                  Heading                                    */
/* -------------------------------------------------------------------------- */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = `h${HeadingLevel}` | "div" | "span" | "p";

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    Omit<HeadingVariants, "level"> {
  /** Semantic heading level (1–6). Drives default size + weight. */
  level?: HeadingLevel;
  /** Override the rendered tag. Defaults to `h{level}`. */
  as?: HeadingTag;
  /** Render the child element via Radix Slot — keeps styles + attrs. */
  asChild?: boolean;
}

/**
 * Heading — semantic typography with a futuristic display treatment.
 *
 * @example
 *   <Heading level={1} variant="gradient" balance>
 *     Future of AI Interfaces
 *   </Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 2,
      as,
      asChild = false,
      variant,
      align,
      balance,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = (asChild ? Slot : (as ?? `h${level}`)) as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(
          headingVariants({ level, variant, align, balance }),
          className,
        )}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

/* -------------------------------------------------------------------------- */
/*                                    Text                                     */
/* -------------------------------------------------------------------------- */

type TextTag = "p" | "span" | "div" | "label" | "li" | "blockquote";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    TextVariants {
  /** Override the rendered tag. Defaults to `p`. */
  as?: TextTag;
  /** Render the child element via Radix Slot. */
  asChild?: boolean;
}

/**
 * Text — paragraph-grade prose primitive.
 *
 * @example
 *   <Text variant="lead">
 *     A futuristic, AI-native React UI library.
 *   </Text>
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      as = "p",
      asChild = false,
      size,
      variant,
      align,
      leading,
      className,
      ...props
    },
    ref,
  ) => {
    // The polymorphic `as` produces a union of element types whose refs
    // resolve to an unsatisfiable intersection (e.g. HTMLParagraphElement
    // ∩ HTMLSpanElement). We cast at the boundary — runtime is the same.
    const Comp = (asChild ? Slot : as) as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(
          textVariants({ size, variant, align, leading }),
          className,
        )}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

/* -------------------------------------------------------------------------- */
/*                                Inline Code                                  */
/* -------------------------------------------------------------------------- */

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    CodeInlineVariants {
  /** Render the child via Radix Slot — useful for wrapping links. */
  asChild?: boolean;
}

/**
 * Inline `<Code>` — for short snippets embedded in prose.
 *
 * Pair with `<CodeBlock>` for multi-line, syntax-highlighted blocks.
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ asChild = false, variant, size, className, ...props }, ref) => {
    const Comp = (asChild ? Slot : "code") as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn(codeInlineVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Code.displayName = "Code";

/* -------------------------------------------------------------------------- */
/*                                     Kbd                                     */
/* -------------------------------------------------------------------------- */

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    KbdVariants {}

/**
 * `<Kbd>` — keyboard key indicator with a tactile key-cap feel.
 *
 * @example
 *   <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ size, className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";
