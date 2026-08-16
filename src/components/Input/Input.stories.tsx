import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "filled", "glass", "underline"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Ask VivUI anything…",
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {};
export const Filled: Story = { args: { variant: "filled" } };
export const Glass: Story = { args: { variant: "glass" } };
export const Underline: Story = { args: { variant: "underline" } };
export const Invalid: Story = { args: { invalid: true, defaultValue: "wrong@" } };
export const Disabled: Story = { args: { disabled: true, value: "Read only" } };

export const WithAdornment: Story = {
  args: {
    placeholder: "Search components",
    startAdornment: <SearchIcon />,
    endAdornment: <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">⌘K</kbd>,
  },
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
