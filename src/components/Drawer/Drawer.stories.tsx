import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer, type DrawerContentProps } from "./Drawer";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Badge } from "../Badge/Badge";

type StoryArgs = Pick<
  DrawerContentProps,
  | "side"
  | "size"
  | "glass"
  | "blur"
  | "tint"
  | "glow"
  | "gradient"
  | "gradientSpeed"
  | "sheen"
  | "dismissible"
  | "withOverlay"
> & {
  showFooter?: boolean;
  showCloseButton?: boolean;
};

const meta = {
  title: "Overlays/Drawer",
  component: Drawer.Content,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["left", "right", "top", "bottom"],
      description: "Edge the drawer slides in from.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description:
        "Resolves to width on left/right drawers, height on top/bottom drawers.",
    },
    glass: {
      control: "select",
      options: [false, true, "subtle", "medium", "strong"],
    },
    blur: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl", "3xl"],
      if: { arg: "glass", truthy: true },
    },
    tint: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      if: { arg: "glass", truthy: true },
    },
    glow: { control: "boolean", if: { arg: "glass", truthy: true } },
    gradient: {
      control: "select",
      options: [false, true, "brand", "aurora", "sunset", "ocean"],
    },
    gradientSpeed: {
      control: "select",
      options: ["slow", "normal", "fast"],
      if: { arg: "gradient", truthy: true },
    },
    sheen: { control: "boolean", if: { arg: "gradient", truthy: true } },
    dismissible: { control: "boolean" },
    withOverlay: { control: "boolean" },
    showFooter: {
      control: "boolean",
      description: "Story-only: render Drawer.Footer.",
    },
    showCloseButton: {
      control: "boolean",
      description: "Story-only: render Drawer.CloseButton.",
    },
  },
  args: {
    side: "right",
    size: "md",
    glass: false,
    gradient: false,
    dismissible: true,
    withOverlay: true,
    showFooter: true,
    showCloseButton: true,
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                     */
/* -------------------------------------------------------------------------- */

function DrawerDemo({
  showFooter,
  showCloseButton,
  ...contentProps
}: StoryArgs) {
  const [open, setOpen] = React.useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Open {contentProps.side ?? "right"} Drawer</Button>
      <Drawer.Content {...contentProps}>
        <Drawer.Header>
          <div className="flex items-center gap-2">
            <Drawer.Title>Edit project</Drawer.Title>
            <Badge variant="brand" size="sm">
              Pro
            </Badge>
          </div>
          <Drawer.Description>
            Update your project details. Changes are saved when you press Save.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Project name
              <Input placeholder="vivui" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Description
              <Input placeholder="A futuristic UI library" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Owner
              <Input placeholder="alice@vivui.dev" />
            </label>
            <p className="text-xs text-muted-foreground">
              Tip — drawer body auto-scrolls when content overflows. Try
              resizing the viewport.
            </p>
          </div>
        </Drawer.Body>
        {showFooter ? (
          <Drawer.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </Drawer.Footer>
        ) : null}
        {showCloseButton ? <Drawer.CloseButton /> : null}
      </Drawer.Content>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Stories                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  render: (args) => <DrawerDemo {...args} />,
};

/**
 * Side gallery — opens four buttons that each pop a drawer from a
 * different edge. Confirms the slide-in direction matches the side
 * prop and the inside-facing corners are the rounded ones.
 */
export const SideGallery: Story = {
  render: () => {
    const [side, setSide] =
      React.useState<DrawerContentProps["side"]>("right");
    const [open, setOpen] = React.useState(false);
    const sides: DrawerContentProps["side"][] = ["left", "right", "top", "bottom"];
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {sides.map((s) => (
          <Button
            key={s}
            variant="outline"
            onClick={() => {
              setSide(s);
              setOpen(true);
            }}
          >
            From {s}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Content side={side} size="md">
            <Drawer.Header>
              <Drawer.Title>From {side}</Drawer.Title>
              <Drawer.Description>
                Slide-in motion picks the matching edge automatically.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-muted-foreground">
                The corner facing the page is rounded; the corner touching
                the viewport edge stays flush.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Drawer.Footer>
            <Drawer.CloseButton />
          </Drawer.Content>
        </Drawer>
      </div>
    );
  },
};

export const Glass: Story = {
  args: { glass: "medium", glow: true, side: "right", size: "lg" },
  render: (args) => <DrawerDemo {...args} />,
};

export const Gradient: Story = {
  args: { gradient: "aurora", sheen: true, side: "right", size: "md" },
  render: (args) => <DrawerDemo {...args} />,
};

export const GradientWithGlass: Story = {
  args: {
    gradient: "brand",
    glass: "medium",
    blur: "2xl",
    tint: 0.18,
    side: "right",
    size: "lg",
  },
  render: (args) => <DrawerDemo {...args} />,
};

/**
 * Bottom sheet — typical mobile pattern. Defaults `size="md"` so it
 * occupies ~320px from the bottom.
 */
export const BottomSheet: Story = {
  args: { side: "bottom", size: "md", glass: "medium", glow: true },
  render: (args) => <DrawerDemo {...args} />,
};

/**
 * Top notification drawer — useful for system-wide announcements that
 * need to be acknowledged.
 */
export const TopNotification: Story = {
  args: { side: "top", size: "sm", glass: "subtle" },
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show notification</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Content side="top" size="sm" glass="subtle">
            <Drawer.Header>
              <Drawer.Title>Scheduled maintenance</Drawer.Title>
              <Drawer.Description>
                We&apos;ll be performing routine maintenance from 02:00–02:30
                UTC tonight. Some features may be unavailable.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Got it
              </Button>
            </Drawer.Footer>
            <Drawer.CloseButton />
          </Drawer.Content>
        </Drawer>
      </>
    );
  },
};

/**
 * Full-width drawer — fills the entire viewport on its anchored axis.
 * Good for immersive editor flows.
 */
export const FullSize: Story = {
  args: { size: "full", side: "right", glass: "medium" },
  render: (args) => <DrawerDemo {...args} />,
};
