import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "VivUI's signature button. 11 variants, 9 sizes, 3 shapes, polymorphism via `asChild`, loading state, and motion-first animations including a sheen sweep on `ai` and a JS-based magnetic hover on `magnetic`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "outline",
        "soft",
        "glass",
        "link",
        "danger",
        "ai",
        "magnetic",
        "gradient",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "icon-sm", "icon", "icon-lg", "fab"],
    },
    shape: { control: "select", options: ["pill", "rounded", "square"] },
    fullWidth: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    asChild: { control: "boolean" },
    magneticStrength: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      if: { arg: "variant", eq: "magnetic" },
    },
    children: { control: "text" },
  },
  args: {
    children: "Get started",
    variant: "primary",
    size: "md",
    shape: "pill",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/*                          Single-variant stories                             */
/* -------------------------------------------------------------------------- */

export const Primary: Story = {
  args: { children: "Primary Button" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary Button" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost Button" },
};

export const AIAction: Story = {
  args: {
    variant: "ai",
    children: "AI Action Button",
    leftIcon: <SparkleIcon />,
    trailingChip: <ArrowUpRightIcon />,
  },
};

export const MagneticHover: Story = {
  args: {
    variant: "magnetic",
    children: "Magnetic Hover Button",
    leftIcon: <CursorIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Move your cursor near the button — it tracks pointer position via JS and translates with a spring ease.",
      },
    },
  },
};

export const GlowingGradient: Story = {
  args: { variant: "gradient", children: "Glowing gradient Button" },
};

export const IconButton: Story = {
  args: {
    variant: "secondary",
    size: "icon",
    shape: "rounded",
    "aria-label": "Open menu",
    children: <GridIcon />,
  },
};

export const FloatingActionButton: Story = {
  args: {
    variant: "primary",
    size: "fab",
    "aria-label": "Create new",
    children: <PlusIcon />,
  },
};

export const Loading: Story = { args: { isLoading: true, children: "Saving" } };

export const Danger: Story = { args: { variant: "danger", children: "Delete" } };

export const Outline: Story = { args: { variant: "outline", children: "Outline" } };

export const Soft: Story = { args: { variant: "soft", children: "Soft" } };

export const Glass: Story = {
  args: { variant: "glass", children: "Open console" },
  parameters: { backgrounds: { default: "gradient" } },
};

export const Link: Story = { args: { variant: "link", children: "Read the docs" } };

/* -------------------------------------------------------------------------- */
/*                       Gallery — matches the design grid                     */
/* -------------------------------------------------------------------------- */

export const Gallery: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The full VivUI button gallery — primary, secondary, ghost, AI action, magnetic, glowing gradient, icon, and floating action. Cells size to content and bottom-align so every label sits on the same baseline.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[320px] w-full items-center justify-center bg-background p-10">
      <div className="flex max-w-[1200px] flex-wrap items-end justify-center gap-x-8 gap-y-10">
        <ButtonCell label="Primary Button">
          <Button>Primary Button</Button>
        </ButtonCell>
        <ButtonCell label="Secondary Button">
          <Button variant="secondary">Secondary Button</Button>
        </ButtonCell>
        <ButtonCell label="Ghost Button">
          <Button variant="ghost">Ghost Button</Button>
        </ButtonCell>
        <ButtonCell label="AI Action Button">
          <Button
            variant="ai"
            leftIcon={<SparkleIcon />}
            trailingChip={<ArrowUpRightIcon />}
          >
            AI Action Button
          </Button>
        </ButtonCell>
        <ButtonCell label="Magnetic Hover Button">
          <Button variant="magnetic" leftIcon={<CursorIcon />}>
            Magnetic Hover Button
          </Button>
        </ButtonCell>
        <ButtonCell label="Glowing gradient Button">
          <Button variant="gradient">Glowing gradient Button</Button>
        </ButtonCell>
        <ButtonCell label="Icon Button">
          <Button
            variant="secondary"
            size="icon"
            shape="rounded"
            aria-label="Grid view"
          >
            <GridIcon />
          </Button>
        </ButtonCell>
        <ButtonCell label="Floating Action Button">
          <Button variant="primary" size="fab" aria-label="Create new">
            <PlusIcon />
          </Button>
        </ButtonCell>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-3">
      <Button {...args} size="xs">
        XS
      </Button>
      <Button {...args} size="sm">
        SM
      </Button>
      <Button {...args} size="md">
        MD
      </Button>
      <Button {...args} size="lg">
        LG
      </Button>
      <Button {...args} size="xl">
        XL
      </Button>
    </div>
  ),
};

export const AllShapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} shape="pill">
        Pill
      </Button>
      <Button {...args} shape="rounded">
        Rounded
      </Button>
      <Button {...args} shape="square">
        Square
      </Button>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                              Helper components                              */
/* -------------------------------------------------------------------------- */

function ButtonCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  // Fixed-height button slot (h-16 = 64px) so the FAB (56px), pill (40px),
  // and icon (40px) buttons all sit on the same vertical baseline. The
  // parent flex container uses `items-end`, so labels drop to the same Y
  // across every cell regardless of how rows wrap.
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-16 items-center justify-center">{children}</div>
      <span className="text-xs leading-none text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <path
        d="M12 3l1.7 4.6 4.6 1.7-4.6 1.7L12 15.6l-1.7-4.6L5.7 9.3l4.6-1.7L12 3z"
        fill="currentColor"
      />
      <path
        d="M19 14l.85 2.3L22 17.15l-2.15.85L19 20.3l-.85-2.3L16 17.15l2.15-.85L19 14z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3">
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <path
        d="M5.5 3.5l4 14 2.4-5.6 5.6-2.4-12-6z"
        fill="currentColor"
      />
      <path
        d="M13 13l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
