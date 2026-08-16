import type { Meta, StoryObj } from "@storybook/react";
import { Heading, Text, Code, Kbd } from "./Typography";

const meta: Meta = {
  title: "Primitives/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "VivUI typography primitives — `Heading`, `Text`, `Code` (inline), and `Kbd`. All polymorphic via `as` / `asChild`, with display-led variants tuned for AI-native marketing surfaces.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

/* -------------------------------------------------------------------------- */
/*                                  Headings                                   */
/* -------------------------------------------------------------------------- */

export const HeadingScale: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Heading level={1}>The future of AI interfaces</Heading>
      <Heading level={2}>Premium developer experiences</Heading>
      <Heading level={3}>Built for motion and depth</Heading>
      <Heading level={4}>Glassmorphism, neon, polish</Heading>
      <Heading level={5}>Tuned for accessibility</Heading>
      <Heading level={6}>Section label</Heading>
    </div>
  ),
};

export const HeadingGradient: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1} variant="gradient" balance>
        The future of AI interfaces
      </Heading>
      <Heading level={3} variant="glow">
        Glow accent for hero moments
      </Heading>
      <Heading level={2} variant="display" balance>
        Display tracking for marketing pages
      </Heading>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                                    Text                                     */
/* -------------------------------------------------------------------------- */

export const TextVariants: Story = {
  render: () => (
    <div className="max-w-prose space-y-3">
      <Text variant="lead">
        VivUI is a futuristic, AI-native React UI library built with TypeScript,
        Tailwind, and Radix-grade primitives.
      </Text>
      <Text>
        Default body text — readable, comfortable, and tuned for long-form
        prose on marketing and documentation surfaces.
      </Text>
      <Text variant="muted">
        Muted text is for secondary information, captions, and helper copy.
      </Text>
      <Text variant="ai" size="sm">
        AI-tinted text — pairs well with sparkle icons and copilot patterns.
      </Text>
      <Text variant="gradient" size="lg">
        Gradient text for premium hero callouts.
      </Text>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                                Inline Code                                  */
/* -------------------------------------------------------------------------- */

export const InlineCode: Story = {
  render: () => (
    <div className="max-w-prose space-y-4">
      <Text>
        Install with <Code>npm install @vivui/react</Code> and import the
        component you need: <Code variant="brand">Button</Code>.
      </Text>
      <Text>
        VivUI exposes <Code variant="ai">AI</Code>-powered helpers for
        copilots and intelligent surfaces.
      </Text>
      <Text>
        Status accents — <Code variant="success">200 OK</Code>,{" "}
        <Code variant="warning">deprecated</Code>,{" "}
        <Code variant="danger">500 Error</Code>.
      </Text>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                                     Kbd                                     */
/* -------------------------------------------------------------------------- */

export const KeyboardKeys: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Text variant="muted">Open command palette:</Text>
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="muted">Save file:</Text>
        <Kbd size="lg">⌘</Kbd> + <Kbd size="lg">S</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <Text variant="muted">Show shortcuts:</Text>
        <Kbd size="sm">?</Kbd>
      </div>
    </div>
  ),
};
