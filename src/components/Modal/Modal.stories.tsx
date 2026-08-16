import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, type ModalContentProps } from "./Modal";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";

/**
 * Storybook controls reflect the public surface of <Modal.Content>. We
 * type the meta against ModalContentProps so the controls panel is
 * driven by the API a consumer would actually use.
 */
type StoryArgs = Pick<
  ModalContentProps,
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
  /** Story-only control: render Modal.Footer with Cancel/Confirm. */
  showFooter?: boolean;
  /** Story-only control: render Modal.CloseButton. */
  showCloseButton?: boolean;
};

const meta = {
  title: "Overlays/Modal",
  component: Modal.Content,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
    },
    glass: {
      control: "select",
      options: [false, true, "subtle", "medium", "strong"],
      description: "Frosted-glass material on the modal surface.",
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
    glow: {
      control: "boolean",
      if: { arg: "glass", truthy: true },
    },
    gradient: {
      control: "select",
      options: [false, true, "brand", "aurora", "sunset", "ocean"],
      description: "Animated multi-color gradient surface.",
    },
    gradientSpeed: {
      control: "select",
      options: ["slow", "normal", "fast"],
      if: { arg: "gradient", truthy: true },
    },
    sheen: {
      control: "boolean",
      if: { arg: "gradient", truthy: true },
    },
    dismissible: {
      control: "boolean",
      description: "Backdrop click + Escape close the modal.",
    },
    withOverlay: {
      control: "boolean",
      description: "Render the dim overlay behind the modal.",
    },
    showFooter: {
      control: "boolean",
      description: "Story-only: render Modal.Footer.",
    },
    showCloseButton: {
      control: "boolean",
      description: "Story-only: render Modal.CloseButton.",
    },
  },
  args: {
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

/**
 * Wraps the trigger + Modal in a shared open-state shell. Storybook
 * stories without a stable open state are awkward to interact with —
 * a useState hook here keeps the API consistent with how a real app
 * would wire this up.
 */
function ModalDemo({
  showFooter,
  showCloseButton,
  ...contentProps
}: StoryArgs) {
  const [open, setOpen] = React.useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal.Content {...contentProps}>
        <Modal.Header>
          <div className="flex items-center gap-2">
            <Modal.Title>Confirm publish</Modal.Title>
            <Badge variant="brand" size="sm">
              v1.4.0
            </Badge>
          </div>
          <Modal.Description>
            Your changes will be deployed to production immediately.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted-foreground">
            Once you publish, the new build will be served to all users. You
            can roll back any version from the deployment history.
          </p>
        </Modal.Body>
        {showFooter ? (
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Publish now</Button>
          </Modal.Footer>
        ) : null}
        {showCloseButton ? <Modal.CloseButton /> : null}
      </Modal.Content>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Stories                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  render: (args) => <ModalDemo {...args} />,
};

export const Glass: Story = {
  args: { glass: "medium", glow: true },
  render: (args) => <ModalDemo {...args} />,
};

export const Gradient: Story = {
  args: { gradient: "aurora", sheen: true },
  render: (args) => <ModalDemo {...args} />,
};

export const GradientWithGlass: Story = {
  args: { gradient: "brand", glass: "medium", blur: "2xl", tint: 0.18 },
  render: (args) => <ModalDemo {...args} />,
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = React.useState<ModalContentProps["size"]>("md");
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(["sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
          <Button
            key={s}
            variant="outline"
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            Open {s}
          </Button>
        ))}
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Content size={size}>
            <Modal.Header>
              <Modal.Title>Modal — size = {size}</Modal.Title>
              <Modal.Description>
                Modal sizes scale max-width: sm → md → lg → xl → 2xl.
              </Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted-foreground">
                Resize the viewport or pick a different size to see how the
                modal adapts. Content gets a 1rem viewport gutter on all sides.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Modal.Footer>
            <Modal.CloseButton />
          </Modal.Content>
        </Modal>
      </div>
    );
  },
};

/**
 * Demonstrates that a non-dismissible modal stays open on Escape and on
 * backdrop clicks — useful for irreversible flows where the user must
 * make an explicit choice (e.g. payment confirmation, account deletion).
 */
export const NonDismissible: Story = {
  args: { dismissible: false, showCloseButton: true },
  render: (args) => <ModalDemo {...args} />,
};

/**
 * Modal without a backdrop overlay — useful for non-blocking flows
 * where the underlying page should remain interactive (e.g. a
 * floating form that doesn't need to dim the rest of the UI).
 */
export const WithoutOverlay: Story = {
  args: { withOverlay: false, glass: "medium", glow: true },
  render: (args) => <ModalDemo {...args} />,
};

export const ConfirmDanger: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Content size="sm">
            <Modal.Header>
              <Modal.Title>Delete project?</Modal.Title>
              <Modal.Description>
                This action cannot be undone. All deployments, environment
                variables, and team members will be permanently removed.
              </Modal.Description>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Yes, delete project
              </Button>
            </Modal.Footer>
            <Modal.CloseButton />
          </Modal.Content>
        </Modal>
      </>
    );
  },
};

/**
 * Pairs a Modal with a richer body composed of nested Cards — shows
 * how the surface vocabulary is consistent across the system.
 */
export const RichContent: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open with rich content</Button>
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Content size="lg" glass="medium">
            <Modal.Header>
              <Modal.Title>Pick a workspace plan</Modal.Title>
              <Modal.Description>
                Switch any time. Pricing is per active member, prorated.
              </Modal.Description>
            </Modal.Header>
            <Modal.Body className="grid gap-3 sm:grid-cols-2">
              <Card variant="outlined" padding="sm" interactive>
                <Card.Header>
                  <Card.Title>Free</Card.Title>
                  <Card.Description>Hobby projects, no card.</Card.Description>
                </Card.Header>
                <Card.Body>
                  <p className="text-2xl font-display font-semibold">$0</p>
                </Card.Body>
              </Card>
              <Card variant="ai" padding="sm" interactive>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <Card.Title>Pro</Card.Title>
                    <Badge variant="brand" size="sm">
                      Most popular
                    </Badge>
                  </div>
                  <Card.Description>
                    Unlimited deploys, branch previews.
                  </Card.Description>
                </Card.Header>
                <Card.Body>
                  <p className="text-2xl font-display font-semibold">
                    $19{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      / mo
                    </span>
                  </p>
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Maybe later
              </Button>
              <Button onClick={() => setOpen(false)}>Continue with Pro</Button>
            </Modal.Footer>
            <Modal.CloseButton />
          </Modal.Content>
        </Modal>
      </>
    );
  },
};
