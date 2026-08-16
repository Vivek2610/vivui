import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CodeBlock } from "./CodeBlock";
import { Heading, Text, Code } from "../Typography/Typography";
import { Button } from "../Button/Button";

const meta: Meta<typeof CodeBlock> = {
  title: "Surfaces/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "VivUI's premium AI-native code surface. One renderer powers every variant — standard, AI-generated, terminal, diff, expandable, multi-tab, live-preview, floating-AI-card, and markdown blocks — all sharing the same syntax tokenizer and toolbar. **Use the `Playground` story** for interactive Controls; the numbered variant stories are fixed demos and do not wire props from the panel.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "ai", "terminal", "ghost", "markdown"],
    },
    radius: { control: "select", options: ["md", "lg", "xl", "2xl"] },
    density: { control: "select", options: ["compact", "comfortable"] },
    /** Source string — edits here re-render highlighting. */
    children: { control: { type: "text" }, name: "code (children)" },
    language: { control: "text" },
    filename: { control: "text" },
    prompt: { control: "text" },
    maxLines: { control: { type: "number", min: 1, max: 100, step: 1 } },
    highlightLines: { control: "object", description: "1-based line indexes, e.g. [3, 5]" },
    showLineNumbers: { control: "boolean" },
    copyable: { control: "boolean" },
    diff: { control: "boolean" },
    expandable: { control: "boolean" },
    loading: { control: "boolean" },
    cursor: { control: "boolean" },
    windowControls: { control: "boolean" },
    // React nodes don't map cleanly to Controls.
    toolbarTrailing: { control: false, table: { disable: true } },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/*                               Playground (Controls)                         */
/* -------------------------------------------------------------------------- */

/**
 * This story forwards every Control into `<CodeBlock />`. The numbered demos
 * below use fixed `render` functions purely for visuals — tweak props here,
 * not there, when exploring the component API interactively.
 */
export const Playground: Story = {
  args: {
    children:
      `import { Button } from "@vivui/react";\n\nexport default function Demo() {\n  return (\n    <Button variant="ai">\n      Hello VivUI\n    </Button>\n  );\n}`,
    language: "tsx",
    filename: "Demo.tsx",
    variant: "standard",
    radius: "xl",
    density: "comfortable",
    showLineNumbers: true,
    highlightLines: [3],
    copyable: true,
    diff: false,
    expandable: false,
    maxLines: 8,
    loading: false,
    cursor: false,
    windowControls: true,
    prompt: "$",
  },
  render: (args) => (
    <div className="max-w-3xl">
      <CodeBlock {...args} />
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                              Sample sources                                 */
/* -------------------------------------------------------------------------- */

const REACT_SAMPLE = `import { Button } from "@vivui/react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <Button
      variant="ai"
      onClick={() => setCount((c) => c + 1)}
    >
      Generated {count} components
    </Button>
  );
}`;

const TS_SAMPLE = `interface NeuralComponent {
  variant: "ai" | "magnetic" | "gradient";
  glow?: boolean;
  shimmer?: boolean;
}

export const generate = async (
  prompt: string,
): Promise<NeuralComponent> => {
  const result = await ai.complete({ prompt, model: "viv-1" });
  return result.parse<NeuralComponent>();
};`;

const CLI_SAMPLE = `# install the library
pnpm add @vivui/react

# scaffold a component with the AI assistant
npx vivui generate button --variant ai --shimmer

# preview locally
pnpm storybook`;

const TERMINAL_SAMPLE = `pnpm add @vivui/react
npx vivui init --theme dark
pnpm dev --port 3000`;

const DIFF_SAMPLE = ` import { Button } from "@vivui/react";
 
 export function CTA() {
-  return <button className="btn">Get started</button>;
+  return (
+    <Button variant="ai" leftIcon={<SparkIcon />}>
+      Get started
+    </Button>
+  );
 }`;

const LONG_SAMPLE = `import { CodeBlock, Button, Card } from "@vivui/react";

export function Showcase() {
  const [tab, setTab] = useState("react");
  const [code, setCode] = useState(SAMPLE);

  useEffect(() => {
    if (tab === "react") setCode(REACT_SAMPLE);
    if (tab === "typescript") setCode(TS_SAMPLE);
    if (tab === "cli") setCode(CLI_SAMPLE);
  }, [tab]);

  return (
    <Card variant="glassmorphism" padding="lg">
      <Card.Header>
        <Card.Title>Live preview</Card.Title>
        <Card.Description>
          Pairs a rendered component with its source.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <CodeBlock
          variant="ai"
          language="tsx"
          showLineNumbers
          copyable
        >
          {code}
        </CodeBlock>
      </Card.Body>
    </Card>
  );
}`;

/* -------------------------------------------------------------------------- */
/*                       1. Standard React Code Block                          */
/* -------------------------------------------------------------------------- */

export const StandardReact: Story = {
  name: "1. Standard React Code Block",
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock
        language="tsx"
        filename="App.tsx"
        showLineNumbers
        copyable
        highlightLines={[3]}
      >
        {REACT_SAMPLE}
      </CodeBlock>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       2. AI-Generated Response with Code                    */
/* -------------------------------------------------------------------------- */

export const AIGenerated: Story = {
  name: "2. AI-Generated Response",
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock
        variant="ai"
        language="tsx"
        filename="generated.tsx"
        showLineNumbers
        copyable
        cursor
        toolbarTrailing={
          <span
            className="inline-flex h-5 items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-1.5
                       text-[10px] font-semibold uppercase tracking-[0.06em] text-brand"
          >
            <span className="size-1.5 rounded-full bg-brand animate-viv-pulse-glow" />
            VivUI Generated
          </span>
        }
      >
        {`export const NeuralButton = (props: Props) => {
  const surface = useSurface("ai");
  const motion = useMotion("magnetic");
  return (
    <button {...props} className={surface.className}>
      {props.children}
    </button>
  );
};`}
      </CodeBlock>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       3. Terminal Command Block                             */
/* -------------------------------------------------------------------------- */

export const Terminal: Story = {
  name: "3. Terminal Command Block",
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock variant="terminal" language="bash" filename="warp · zsh">
        {TERMINAL_SAMPLE}
      </CodeBlock>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       4. Inline Code Styling                                */
/* -------------------------------------------------------------------------- */

export const InlineCodeStyling: Story = {
  name: "4. Inline Code Styling",
  parameters: {
    docs: {
      description: {
        story:
          "The inline `<Code>` primitive (from Typography) styles short snippets embedded in prose to match the block surface.",
      },
    },
  },
  render: () => (
    <div className="max-w-prose space-y-4">
      <Text>
        Install with <Code>npm install @vivui/react</Code> and import any
        component you need.
      </Text>
      <Text>
        The <Code variant="ai">AI</Code> sample renders with a soft gradient
        outline and neon glow, matching the AI block above.
      </Text>
      <Text>
        Use <Code variant="brand">useSurface()</Code> for premium glass
        surfaces, or call <Code>generate(prompt)</Code> directly.
      </Text>
      <Text>
        Status flavors — <Code variant="success">200 OK</Code>,{" "}
        <Code variant="warning">deprecated</Code>,{" "}
        <Code variant="danger">500 Error</Code>.
      </Text>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       5. Diff / Syntax Highlighted Block                    */
/* -------------------------------------------------------------------------- */

export const DiffBlock: Story = {
  name: "5. Diff / Syntax Highlighted",
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock
        language="tsx"
        filename="src/components/CTA.tsx"
        diff
        showLineNumbers
        copyable
      >
        {DIFF_SAMPLE}
      </CodeBlock>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       6. Expandable Code Section                            */
/* -------------------------------------------------------------------------- */

export const Expandable: Story = {
  name: "6. Expandable Code Section",
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock
        language="tsx"
        filename="Showcase.tsx"
        showLineNumbers
        copyable
        expandable
        maxLines={6}
      >
        {LONG_SAMPLE}
      </CodeBlock>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       7. Live Preview + Code Split                          */
/* -------------------------------------------------------------------------- */

export const LivePreview: Story = {
  name: "7. Live Preview Split",
  render: () => (
    <div className="max-w-3xl">
      <CodeBlock.LivePreview orientation="horizontal">
        <CodeBlock.Preview label="Live">
          <div className="flex flex-col items-center gap-3">
            <Button variant="ai" leftIcon={<SparkIcon />}>
              Generate component
            </Button>
            <Text variant="muted" size="sm">
              Hover to see the sheen sweep.
            </Text>
          </div>
        </CodeBlock.Preview>
        <CodeBlock language="tsx" copyable>
          {`<Button
  variant="ai"
  leftIcon={<SparkIcon />}
>
  Generate component
</Button>`}
        </CodeBlock>
      </CodeBlock.LivePreview>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       8. Floating AI Answer Card                            */
/* -------------------------------------------------------------------------- */

export const FloatingAIAnswer: Story = {
  name: "8. Floating AI Answer",
  render: () => (
    <div className="max-w-xl">
      <CodeBlock.AIAnswer
        agentName="VivUI Copilot"
        question="How do I build a magnetic AI button?"
        status="ready"
      >
        <Text size="sm" className="mb-3">
          Use the <Code variant="brand">ai</Code> variant with the magnetic
          hover modifier. The motion is handled with pointer events:
        </Text>
        <CodeBlock variant="ai" language="tsx" copyable>
          {`<Button
  variant="ai"
  className="hover:scale-[1.03]"
  leftIcon={<SparkIcon />}
>
  Generate
</Button>`}
        </CodeBlock>
      </CodeBlock.AIAnswer>
    </div>
  ),
};

export const FloatingAIAnswerStreaming: Story = {
  name: "8b. Floating AI Answer (streaming)",
  render: () => (
    <div className="max-w-xl">
      <CodeBlock.AIAnswer
        agentName="VivUI Copilot"
        question="Generate a neural button component"
        status="streaming"
      >
        <CodeBlock variant="ai" language="tsx" loading cursor>
          {`export const NeuralButton = ({ children, ...props }) => {
  const surface = useSurface("ai");
  return (
    <button className={surface.className} {...props}>
      {children}`}
        </CodeBlock>
      </CodeBlock.AIAnswer>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       9. Markdown Renderer                                  */
/* -------------------------------------------------------------------------- */

export const MarkdownRenderer: Story = {
  name: "9. Markdown Renderer",
  parameters: {
    docs: {
      description: {
        story:
          "`CodeBlock.Markdown` styles arbitrary HTML/React children to match VivUI's prose system. Pair with `<CodeBlock variant=\"markdown\">` for embedded code blocks that flow with the prose.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock.Markdown>
        <Heading level={2} variant="gradient">
          Quick start
        </Heading>
        <p>
          Install <code>@vivui/react</code> and add the Tailwind preset to your
          config. Then import any component:
        </p>
        <CodeBlock variant="markdown" language="tsx" copyable>
          {`import { Button } from "@vivui/react";

export default () => (
  <Button variant="ai">Generate</Button>
);`}
        </CodeBlock>
        <p>
          The library tree-shakes per-component, so the import above ships
          only what it needs.
        </p>
        <ul>
          <li>Zero-runtime — pure CSS via Tailwind preset</li>
          <li>Polymorphic via Radix Slot (<code>asChild</code>)</li>
          <li>Streaming AI variants out of the box</li>
        </ul>
      </CodeBlock.Markdown>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       10. Multi-Tab Examples                                */
/* -------------------------------------------------------------------------- */

export const MultiTab: Story = {
  name: "10. Multi-Tab (React / TS / CLI)",
  render: () => (
    <div className="max-w-2xl">
      <CodeBlock.Tabs defaultValue="react">
        <CodeBlock.TabList>
          <CodeBlock.Tab value="react" icon={<ReactIcon />}>
            React
          </CodeBlock.Tab>
          <CodeBlock.Tab value="ts" icon={<TSIcon />}>
            TypeScript
          </CodeBlock.Tab>
          <CodeBlock.Tab value="cli" icon={<CliIcon />}>
            CLI
          </CodeBlock.Tab>
        </CodeBlock.TabList>
        <CodeBlock.Panel value="react">
          <CodeBlock language="tsx" showLineNumbers copyable>
            {REACT_SAMPLE}
          </CodeBlock>
        </CodeBlock.Panel>
        <CodeBlock.Panel value="ts">
          <CodeBlock language="ts" showLineNumbers copyable>
            {TS_SAMPLE}
          </CodeBlock>
        </CodeBlock.Panel>
        <CodeBlock.Panel value="cli">
          <CodeBlock variant="terminal" language="bash" copyable windowControls={false}>
            {CLI_SAMPLE}
          </CodeBlock>
        </CodeBlock.Panel>
      </CodeBlock.Tabs>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                              Showcase grid                                  */
/* -------------------------------------------------------------------------- */

export const Showcase: Story = {
  name: "Showcase (all variants)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen bg-background p-10">
      <div className="mx-auto max-w-7xl space-y-3">
        <Heading level={1} variant="gradient" balance>
          VivUI Code Block Showcase
        </Heading>
        <Text variant="muted" size="lg">
          Premium AI-native code experiences — frosted glass, neon accents,
          motion-first.
        </Text>
        <div className="grid grid-cols-1 gap-6 pt-8 lg:grid-cols-2">
          <ShowcaseCard title="1. Standard React" subtitle="Glass + line numbers">
            <CodeBlock language="tsx" filename="App.tsx" showLineNumbers copyable>
              {REACT_SAMPLE.split("\n").slice(0, 8).join("\n")}
            </CodeBlock>
          </ShowcaseCard>

          <ShowcaseCard title="2. AI Generated" subtitle="Streaming with cursor">
            <CodeBlock variant="ai" language="tsx" cursor copyable>
              {`export const Component = () => {
  const surface = useSurface("ai");
  return <button className={surface.className} />`}
            </CodeBlock>
          </ShowcaseCard>

          <ShowcaseCard title="3. Terminal" subtitle="Warp-style command shell">
            <CodeBlock variant="terminal" language="bash" filename="warp">
              {`pnpm add @vivui/react
npx vivui init --theme dark`}
            </CodeBlock>
          </ShowcaseCard>

          <ShowcaseCard title="4. Inline Code" subtitle="Prose embedded">
            <Text>
              Run <Code>pnpm install @vivui/react</Code>, then call{" "}
              <Code variant="ai">generate()</Code> with your prompt.
            </Text>
          </ShowcaseCard>

          <ShowcaseCard title="5. Diff" subtitle="Add / remove lines">
            <CodeBlock language="tsx" diff showLineNumbers copyable>
              {DIFF_SAMPLE}
            </CodeBlock>
          </ShowcaseCard>

          <ShowcaseCard title="6. Expandable" subtitle="Collapsed by default">
            <CodeBlock language="tsx" expandable maxLines={4} showLineNumbers>
              {LONG_SAMPLE}
            </CodeBlock>
          </ShowcaseCard>

          <ShowcaseCard title="7. Live Preview" subtitle="Split layout">
            <CodeBlock.LivePreview orientation="vertical">
              <CodeBlock.Preview label="Live">
                <Button variant="ai">Click me</Button>
              </CodeBlock.Preview>
              <CodeBlock language="tsx">
                {`<Button variant="ai">Click me</Button>`}
              </CodeBlock>
            </CodeBlock.LivePreview>
          </ShowcaseCard>

          <ShowcaseCard title="8. AI Answer" subtitle="Floating card">
            <CodeBlock.AIAnswer
              agentName="Copilot"
              question="How do I render this?"
              status="ready"
            >
              <CodeBlock variant="ai" language="tsx">
                {`<Button variant="ai">Click</Button>`}
              </CodeBlock>
            </CodeBlock.AIAnswer>
          </ShowcaseCard>

          <ShowcaseCard title="9. Markdown" subtitle="Prose + code flow">
            <CodeBlock.Markdown>
              <h3>Render a button</h3>
              <p>
                Use the <code>variant=&quot;ai&quot;</code> prop:
              </p>
              <CodeBlock variant="markdown" language="tsx">
                {`<Button variant="ai">Click</Button>`}
              </CodeBlock>
            </CodeBlock.Markdown>
          </ShowcaseCard>

          <ShowcaseCard title="10. Multi-Tab" subtitle="React / TS / CLI">
            <CodeBlock.Tabs defaultValue="react">
              <CodeBlock.TabList>
                <CodeBlock.Tab value="react">React</CodeBlock.Tab>
                <CodeBlock.Tab value="ts">TypeScript</CodeBlock.Tab>
                <CodeBlock.Tab value="cli">CLI</CodeBlock.Tab>
              </CodeBlock.TabList>
              <CodeBlock.Panel value="react">
                <CodeBlock language="tsx">
                  {`<Button variant="ai">Click</Button>`}
                </CodeBlock>
              </CodeBlock.Panel>
              <CodeBlock.Panel value="ts">
                <CodeBlock language="ts">
                  {`type Props = { variant: "ai" | "default" };`}
                </CodeBlock>
              </CodeBlock.Panel>
              <CodeBlock.Panel value="cli">
                <CodeBlock variant="terminal" language="bash" windowControls={false}>
                  {`npx vivui add button`}
                </CodeBlock>
              </CodeBlock.Panel>
            </CodeBlock.Tabs>
          </ShowcaseCard>
        </div>
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                            Local helpers                                    */
/* -------------------------------------------------------------------------- */

function ShowcaseCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Heading level={6}>{title}</Heading>
        <Text variant="muted" size="xs">
          {subtitle}
        </Text>
      </div>
      {children}
    </div>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.4" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(-60 12 12)"
      />
    </svg>
  );
}

function TSIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.15" />
      <path
        d="M7 10h6M10 10v8M14 11.5c.5-1 4-1.4 4 .5 0 1.5-3.5 1.6-3.5 3.5 0 1.6 3.5 1.4 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CliIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 9l3 3-3 3M12 15h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
