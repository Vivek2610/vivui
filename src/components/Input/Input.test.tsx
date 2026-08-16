import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("accepts text input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);
    await user.type(input, "vivui");
    expect(input).toHaveValue("vivui");
  });

  it("sets aria-invalid when invalid prop is true", () => {
    render(<Input invalid placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders adornments", () => {
    render(
      <Input
        placeholder="x"
        startAdornment={<span data-testid="start">$</span>}
        endAdornment={<span data-testid="end">USD</span>}
      />,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });
});
