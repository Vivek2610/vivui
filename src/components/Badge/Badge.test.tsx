import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders dot when withDot is true", () => {
    const { container } = render(<Badge withDot>Live</Badge>);
    const dot = container.querySelector("span[aria-hidden='true']");
    expect(dot).toBeTruthy();
  });
});
