import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardStack } from "./Card";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "glass", "glassmorphism", "ai", "ghost"],
    },
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    radius: { control: "select", options: ["sm", "md", "lg", "xl", "2xl"] },
    hoverEffect: {
      control: "select",
      options: ["none", "lift", "expand", "glow", "tilt"],
    },
    interactive: { control: "boolean" },
    glass: {
      control: "select",
      options: [false, true, "subtle", "medium", "strong"],
      description: "Apply a frosted-glass material on top of the variant.",
    },
    blur: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl", "3xl"],
      if: { arg: "glass", truthy: true },
      description: "Frost amount. Higher = thicker.",
    },
    tint: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      if: { arg: "glass", truthy: true },
      description: "Surface tint opacity (0 = fully transparent).",
    },
    glow: {
      control: "boolean",
      if: { arg: "glass", truthy: true },
      description: "Show the brand-colored decorative blob behind the glass.",
    },
    gradient: {
      control: "select",
      options: [false, true, "brand", "aurora", "sunset", "ocean"],
      description:
        "Animated multi-color gradient surface — same vibe as the gradient/AI buttons. `true` = brand palette.",
    },
    gradientSpeed: {
      control: "select",
      options: ["slow", "normal", "fast"],
      if: { arg: "gradient", truthy: true },
      description: "Pan speed for the gradient animation.",
    },
    sheen: {
      control: "boolean",
      if: { arg: "gradient", truthy: true },
      description: "Diagonal light sweep on hover (default on).",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/*                       Single-pattern stories (autodocs)                     */
/* -------------------------------------------------------------------------- */

export const Elevated: Story = {
  render: (args) => (
    <Card {...args} className="w-[360px]">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Synthesize UI</Card.Title>
          <Badge variant="brand">AI</Badge>
        </div>
        <Card.Description>
          Describe what you want to build and VivUI generates accessible components.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <p className="text-sm text-muted-foreground">
          Powered by motion-first primitives, glassmorphism accents, and semantic
          design tokens.
        </p>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button size="sm">Generate</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Glassmorphism: Story = {
  args: { variant: "glassmorphism" },
  parameters: { backgrounds: { default: "gradient" } },
  render: (args) => (
    <Card {...args} className="w-[280px] h-[180px]">
      <Card.Header>
        <Card.Title>Glassmorphism Card</Card.Title>
      </Card.Header>
    </Card>
  ),
};

export const AIResponse: Story = {
  args: { variant: "ai" },
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <Card.Header>
        <Card.Title>AI Response Card</Card.Title>
      </Card.Header>
      <Card.Body>
        <p className="text-sm italic text-muted-foreground/90 leading-relaxed">
          Frequent studies suggest a balanced fitness routine is essential for
          long-term health and overall well-being.
        </p>
      </Card.Body>
    </Card>
  ),
};

export const HoverExpand: Story = {
  args: { variant: "elevated", hoverEffect: "expand" },
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <Card.CloseButton />
      <Card.Header>
        <Card.Title>Hover-Expand</Card.Title>
        <Card.Description>
          Smooth scale and shadow lift on hover. Try hovering me.
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button size="sm" variant="secondary">Reply</Button>
      </Card.Footer>
    </Card>
  ),
};

export const MediaCard: Story = {
  args: { variant: "elevated", padding: "md" },
  render: (args) => (
    <Card {...args} className="w-[280px]">
      <Card.Media aspect="video" position="top" bleed="md">
        <MediaArtwork />
      </Card.Media>
      <Card.Header>
        <Card.Title>Media Card</Card.Title>
      </Card.Header>
    </Card>
  ),
};

export const Outlined: Story = { ...Elevated, args: { variant: "outlined" } };
export const Interactive: Story = { ...Elevated, args: { interactive: true } };

/* -------------------------------------------------------------------------- */
/*                       Glass Material Playground                             */
/* -------------------------------------------------------------------------- */

export const GlassPlayground: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Use the controls panel to tune `glass`, `blur`, `tint`, and `glow` on any variant. Try `glass=\"strong\"` with `tint=0.15` for the thickest frost; `glass=\"subtle\"` with `tint=0.6` for a softer sheen.",
      },
    },
  },
  args: {
    variant: "elevated",
    glass: "medium",
    glow: true,
  },
  render: (args) => (
    <div className="min-h-[420px] w-full bg-[radial-gradient(at_30%_30%,hsl(258_95%_60%/0.45),transparent_55%),radial-gradient(at_70%_70%,hsl(218_95%_55%/0.45),transparent_55%),hsl(240_14%_8%)] p-12">
      <Card {...args} className="mx-auto h-[260px] w-[320px]">
        <Card.Header>
          <Card.Title>Glass Material</Card.Title>
          <Card.Description>
            Tune blur, tint, and glow from the controls panel.
          </Card.Description>
        </Card.Header>
      </Card>
    </div>
  ),
};

export const GlassPresets: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The three built-in glass presets: `subtle` (light frost, no glow), `medium` (default — balanced), `strong` (thick frost with prominent glow).",
      },
    },
  },
  render: () => (
    <div className="min-h-[260px] bg-[radial-gradient(at_30%_30%,hsl(258_95%_60%/0.45),transparent_55%),radial-gradient(at_70%_70%,hsl(218_95%_55%/0.45),transparent_55%),hsl(240_14%_8%)] p-10">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {(["subtle", "medium", "strong"] as const).map((preset) => (
          <div key={preset} className="flex flex-col items-center gap-2">
            <Card glass={preset} radius="xl" className="h-[180px] w-[240px]">
              <Card.Header>
                <Card.Title className="capitalize">{preset}</Card.Title>
              </Card.Header>
            </Card>
            <span className="text-xs text-muted-foreground capitalize">
              glass=&quot;{preset}&quot;
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const GlassOnAnyVariant: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The `glass` prop is variant-agnostic. Any base variant can carry the glass material — useful when you want the glass aesthetic with an `outlined` border, an `ai` brand tint, etc.",
      },
    },
  },
  render: () => (
    <div className="min-h-[260px] bg-[radial-gradient(at_30%_30%,hsl(258_95%_60%/0.45),transparent_55%),radial-gradient(at_70%_70%,hsl(218_95%_55%/0.45),transparent_55%),hsl(240_14%_8%)] p-10">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {(["elevated", "outlined", "ai", "ghost"] as const).map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-2">
            <Card
              variant={variant}
              glass
              radius="xl"
              className="h-[160px] w-full"
            >
              <Card.Header>
                <Card.Title className="capitalize">{variant}</Card.Title>
                <Card.Description>+ glass</Card.Description>
              </Card.Header>
            </Card>
            <span className="text-xs text-muted-foreground">
              variant=&quot;{variant}&quot; glass
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                       Animated Gradient Playground                          */
/* -------------------------------------------------------------------------- */

export const GradientPlayground: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Toggle `gradient` on/off in the controls panel and pick a palette (`brand`, `aurora`, `sunset`, `ocean`). Combine with `glass` to get a frosted-color glass card. Adjust `gradientSpeed` for the pan tempo, or set `sheen={false}` to mute the hover sweep.",
      },
    },
  },
  args: {
    variant: "elevated",
    radius: "xl",
    gradient: true,
    gradientSpeed: "normal",
    sheen: true,
  },
  render: (args) => (
    <div className="min-h-[420px] w-full bg-[radial-gradient(at_30%_30%,hsl(258_95%_60%/0.25),transparent_55%),radial-gradient(at_70%_70%,hsl(218_95%_55%/0.25),transparent_55%),hsl(240_14%_8%)] p-12">
      <Card {...args} className="mx-auto h-[260px] w-[340px]">
        <Card.Header>
          <Card.Title>Animated Gradient</Card.Title>
          <Card.Description className="!text-white/80">
            Hover for the sheen sweep. Pan continues in the background.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-white/70">
            Same motion family as the gradient and AI buttons — fully composable
            with the glass material.
          </p>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const GradientPresets: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The four built-in palettes. Each one ships its own complementary shadow tint so the glow under the card matches the dominant gradient hue.",
      },
    },
  },
  render: () => (
    <div className="min-h-[260px] bg-background p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(["brand", "aurora", "sunset", "ocean"] as const).map((preset) => (
          <div key={preset} className="flex flex-col items-center gap-2">
            <Card
              gradient={preset}
              radius="xl"
              className="h-[180px] w-full"
            >
              <Card.Header>
                <Card.Title className="capitalize">{preset}</Card.Title>
                <Card.Description className="!text-white/80">
                  Animated gradient
                </Card.Description>
              </Card.Header>
            </Card>
            <span className="text-xs text-muted-foreground">
              gradient=&quot;{preset}&quot;
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const GradientWithGlass: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "`gradient` and `glass` compose: the frosted overlay sits above the panning gradient, so the colors bleed through the glass for a colored-glass effect. The hover sheen still sweeps over the frost on top.",
      },
    },
  },
  render: () => (
    <div className="min-h-[260px] bg-background p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(["brand", "aurora", "sunset", "ocean"] as const).map((preset) => (
          <div key={preset} className="flex flex-col items-center gap-2">
            <Card
              gradient={preset}
              glass="strong"
              tint={0.18}
              radius="xl"
              className="h-[180px] w-full"
            >
              <Card.Header>
                <Card.Title className="capitalize">{preset}</Card.Title>
                <Card.Description className="!text-white/80">
                  Glass + gradient
                </Card.Description>
              </Card.Header>
            </Card>
            <span className="text-xs text-muted-foreground">
              gradient=&quot;{preset}&quot; glass=&quot;strong&quot;
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                      Gallery — full pattern showcase                        */
/* -------------------------------------------------------------------------- */

export const Gallery: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "VivUI's card gallery — 8 patterns covering glass, AI response, analytics, hover-expand, media, dashboards, stacks, and reasoning graphs.",
      },
    },
  },
  render: () => (
    <div className="min-h-[640px] w-full bg-background p-10">
      <div className="grid auto-rows-[220px] grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        <Cell label="Glassmorphism Card">
          <Card variant="glassmorphism" radius="xl" className="h-full w-full">
            <Card.Header>
              <Card.Title>Glassmorphism Card</Card.Title>
            </Card.Header>
          </Card>
        </Cell>

        <Cell label="AI Response Card">
          <Card variant="ai" radius="xl" className="h-full w-full">
            <Card.Header>
              <Card.Title>AI Response Card</Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-sm italic leading-relaxed text-muted-foreground/90">
                Frequent studies suggest a balanced &amp; coordinated fitness
                routine eliminates a number of cardiovascular risks.
              </p>
            </Card.Body>
          </Card>
        </Cell>

        <Cell label="Analytics">
          <Card variant="elevated" radius="xl" className="h-full w-full">
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title className="text-base">Analytics Card</Card.Title>
                <span className="text-muted-foreground">⋯</span>
              </div>
            </Card.Header>
            <Card.Body className="pt-2">
              <BarChart />
            </Card.Body>
          </Card>
        </Cell>

        <Cell label="Hover-Expand Card">
          <Card
            variant="elevated"
            radius="xl"
            hoverEffect="expand"
            className="h-full w-full"
          >
            <Card.CloseButton />
            <Card.Header>
              <Card.Title className="text-base">Hover-Expand</Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-xs text-muted-foreground">
                Extra shake spear floats write some shake size as eis sdes.
              </p>
              <Button size="sm" variant="secondary" className="mt-3">
                Reply slines
              </Button>
            </Card.Body>
          </Card>
        </Cell>

        <Cell label="Media Card">
          <Card variant="elevated" radius="xl" padding="md" className="h-full w-full">
            <Card.Media aspect="wide" position="top" bleed="md">
              <MediaArtwork />
            </Card.Media>
          </Card>
        </Cell>

        <Cell label="Interactive Dashboard">
          <Card variant="elevated" radius="xl" className="h-full w-full">
            <Card.Header>
              <Card.Title className="text-base">Interactive Dashboard</Card.Title>
            </Card.Header>
            <Card.Body className="grid grid-cols-2 gap-3 pt-3">
              <DashTile>
                <MiniBars short />
                <DashLines />
              </DashTile>
              <DashTile>
                <MiniBars />
                <DashLines short />
              </DashTile>
            </Card.Body>
          </Card>
        </Cell>

        <Cell label="Stack &amp; Cards">
          <CardStack layers={3} offset={6} hover layerRadius="rounded-2xl">
            <Card
              variant="glassmorphism"
              radius="xl"
              className="relative h-full w-full"
            >
              <div className="flex h-full items-center justify-center">
                <DiamondIcon />
              </div>
            </Card>
          </CardStack>
        </Cell>

        <Cell label="Reasoning/Thinking Card">
          <Card variant="elevated" radius="xl" className="h-full w-full">
            <Card.Header>
              <Card.Title className="text-base">Reasoning/Thinking</Card.Title>
            </Card.Header>
            <Card.Body className="flex items-center justify-center pt-3">
              <ReasoningGraph />
            </Card.Body>
          </Card>
        </Cell>
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                              Helper components                              */
/* -------------------------------------------------------------------------- */

function Cell({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex-1">{children}</div>
      <span className="text-center text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function MediaArtwork() {
  return (
    <div className="size-full bg-[radial-gradient(at_30%_30%,hsl(258_95%_72%/0.55),transparent_55%),radial-gradient(at_70%_70%,hsl(218_95%_60%/0.55),transparent_55%),hsl(258_30%_92%)] dark:bg-[radial-gradient(at_30%_30%,hsl(258_95%_60%/0.4),transparent_55%),radial-gradient(at_70%_70%,hsl(218_95%_55%/0.4),transparent_55%),hsl(240_15%_14%)]">
      <div className="flex size-full items-center justify-center">
        <svg viewBox="0 0 64 64" className="size-12 text-foreground/70">
          <path
            d="M8 48l16-20 12 14 8-10 12 16H8z"
            fill="currentColor"
            opacity="0.85"
          />
          <circle cx="20" cy="20" r="4" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function BarChart() {
  const heights = [40, 52, 28, 64, 44, 78, 36, 70, 56, 90];
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5 h-[110px]">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-brand/40 to-brand"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span>100</span>
        <span>200</span>
      </div>
    </div>
  );
}

function DashTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface-overlay p-2 space-y-1.5">
      {children}
    </div>
  );
}

function MiniBars({ short = false }: { short?: boolean }) {
  const bars = short ? [30, 50, 65] : [40, 60, 75, 50];
  return (
    <div className="flex items-end gap-1 h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm bg-brand"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function DashLines({ short = false }: { short?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="h-1 w-full rounded-full bg-muted" />
      <div className={`h-1 ${short ? "w-1/2" : "w-3/4"} rounded-full bg-muted`} />
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 80 80" className="size-16 text-foreground/40">
      <path
        d="M40 12l28 28-28 28-28-28 28-28z"
        stroke="currentColor"
        strokeWidth="2"
        fill="hsl(var(--viv-brand) / 0.10)"
      />
      <path
        d="M40 22l18 18-18 18-18-18 18-18z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="hsl(var(--viv-brand) / 0.06)"
        opacity="0.7"
      />
    </svg>
  );
}

function ReasoningGraph() {
  return (
    <svg viewBox="0 0 240 100" className="w-full max-w-[240px] text-foreground/80">
      {/* Edges */}
      <line x1="34" y1="50" x2="92" y2="22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
      <line x1="34" y1="50" x2="92" y2="78" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
      <line x1="120" y1="22" x2="178" y2="50" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
      <line x1="120" y1="78" x2="178" y2="50" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
      <line x1="206" y1="50" x2="232" y2="50" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" />
      {/* Nodes */}
      <Pill cx={20} cy={50} w={28} />
      <Pill cx={106} cy={22} w={28} />
      <Pill cx={106} cy={78} w={28} />
      <Pill cx={192} cy={50} w={28} />
      <circle cx={232} cy={50} r="4" fill="hsl(var(--viv-brand))" />
    </svg>
  );
}

function Pill({ cx, cy, w }: { cx: number; cy: number; w: number }) {
  return (
    <rect
      x={cx - w / 2}
      y={cy - 8}
      width={w}
      height={16}
      rx={8}
      fill="hsl(var(--viv-surface-overlay))"
      stroke="currentColor"
      strokeOpacity="0.4"
      strokeWidth="1.2"
    />
  );
}
