import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Popup, type PopupContentProps } from "./Popup";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

type StoryArgs = Pick<
  PopupContentProps,
  | "size"
  | "placement"
  | "glass"
  | "blur"
  | "tint"
  | "glow"
  | "gradient"
  | "gradientSpeed"
  | "sheen"
  | "dismissible"
  | "withOverlay"
  | "showCloseButton"
> & {
  showFooter?: boolean;
};

const meta = {
  title: "Overlays/Popup",
  component: Popup.Content,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    placement: {
      control: "select",
      options: [
        "center",
        "top",
        "bottom",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
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
    withOverlay: {
      control: "boolean",
      description:
        "Render a dim backdrop. Off by default — popups usually coexist with the page.",
    },
    showCloseButton: {
      control: "boolean",
      description: "Render the built-in top-right close button.",
    },
    showFooter: {
      control: "boolean",
      description: "Story-only: render Popup.Footer.",
    },
  },
  args: {
    size: "sm",
    placement: "center",
    glass: false,
    gradient: false,
    dismissible: true,
    withOverlay: false,
    showCloseButton: true,
    showFooter: false,
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                     */
/* -------------------------------------------------------------------------- */

function PopupDemo({ showFooter, ...contentProps }: StoryArgs) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popup open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Popup
      </Button>
      <Popup.Content {...contentProps}>
        <Popup.Header>
          <Popup.Title>Quick action</Popup.Title>
          <Popup.Description>
            Use a popup for short, lightweight prompts.
          </Popup.Description>
        </Popup.Header>
        <Popup.Body>
          <Input placeholder="Type something..." />
        </Popup.Body>
        {showFooter ? (
          <Popup.Footer>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </Popup.Footer>
        ) : null}
      </Popup.Content>
    </Popup>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Stories                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  render: (args) => <PopupDemo {...args} />,
};

/**
 * The "Glass Popup Window" reference: a frosted glass panel with the
 * close button visible and a search/input bar inside. Pairs naturally
 * with `withOverlay={false}` so the underlying page stays visible
 * through the glass.
 */
export const GlassWindow: Story = {
  args: {
    glass: "medium",
    glow: true,
    blur: "2xl",
    tint: 0.22,
    showCloseButton: true,
    withOverlay: false,
    size: "md",
  },
  render: (args) => <PopupDemo {...args} />,
};

export const Gradient: Story = {
  args: { gradient: "aurora", showCloseButton: true },
  render: (args) => <PopupDemo {...args} />,
};

export const GradientWithGlass: Story = {
  args: { gradient: "brand", glass: "medium", blur: "2xl", tint: 0.18 },
  render: (args) => <PopupDemo {...args} />,
};

/**
 * Anchored popups — useful for floating confirmations / inline
 * notifications that shouldn't take over the screen. The reference
 * pattern is "saved-to-clipboard" toasts and "feature unlocked"
 * banners that live in a corner.
 */
export const TopRightAnchor: Story = {
  args: { placement: "top-right", glass: "medium", glow: true, withOverlay: false },
  render: (args) => <PopupDemo {...args} />,
};

export const BottomCenterToast: Story = {
  args: { placement: "bottom", size: "md", withOverlay: false, showCloseButton: true },
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Popup open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Popup.Content
          placement="bottom"
          size="md"
          withOverlay={false}
          glass="medium"
          glow
          showCloseButton
        >
          <Popup.Header>
            <Popup.Title>Build complete</Popup.Title>
            <Popup.Description>
              Your project deployed in 12.4s. View build logs to inspect the
              output.
            </Popup.Description>
          </Popup.Header>
          <Popup.Footer>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              View logs
            </Button>
          </Popup.Footer>
        </Popup.Content>
      </Popup>
    );
  },
};

/**
 * With a backdrop overlay, the popup behaves like a small modal — handy
 * for quick irreversible confirmations that still want to dim the page.
 */
export const WithOverlay: Story = {
  args: { withOverlay: true, glass: "medium" },
  render: (args) => <PopupDemo {...args} />,
};
