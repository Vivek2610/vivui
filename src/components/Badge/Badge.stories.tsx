import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "soft", "outline", "glass", "success", "warning", "danger", "info"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    withDot: { control: "boolean" },
    pulse: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "Beta" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Brand: Story = { args: { variant: "brand", children: "AI" } };
export const Soft: Story = { args: { variant: "soft", children: "New" } };
export const Glass: Story = { args: { variant: "glass", children: "Preview" } };
export const Live: Story = {
  args: { variant: "success", withDot: true, pulse: true, children: "Live" },
};

export const StatusGrid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" withDot>Online</Badge>
      <Badge variant="warning" withDot>Pending</Badge>
      <Badge variant="danger" withDot>Failed</Badge>
      <Badge variant="info" withDot>Synced</Badge>
    </div>
  ),
};
