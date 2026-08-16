import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Popup } from "./Popup";

describe("Popup", () => {
  it("renders compound parts when open", () => {
    render(
      <Popup defaultOpen>
        <Popup.Content>
          <Popup.Header>
            <Popup.Title>Quick action</Popup.Title>
            <Popup.Description>Choose one</Popup.Description>
          </Popup.Header>
          <Popup.Body>Body content</Popup.Body>
        </Popup.Content>
      </Popup>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/quick action/i)).toBeInTheDocument();
    expect(screen.getByText(/choose one/i)).toBeInTheDocument();
    expect(screen.getByText(/body content/i)).toBeInTheDocument();
  });

  it("auto-renders the close button by default", () => {
    render(
      <Popup defaultOpen>
        <Popup.Content aria-describedby={undefined}>
          <Popup.Header>
            <Popup.Title>Default close</Popup.Title>
          </Popup.Header>
        </Popup.Content>
      </Popup>,
    );
    expect(
      screen.getByRole("button", { name: /^close$/i }),
    ).toBeInTheDocument();
  });

  it("hides the close button when showCloseButton={false}", () => {
    render(
      <Popup defaultOpen>
        <Popup.Content showCloseButton={false} aria-describedby={undefined}>
          <Popup.Header>
            <Popup.Title>No close</Popup.Title>
          </Popup.Header>
        </Popup.Content>
      </Popup>,
    );
    expect(
      screen.queryByRole("button", { name: /^close$/i }),
    ).not.toBeInTheDocument();
  });

  it("flips data-glass when glass is enabled", () => {
    render(
      <Popup defaultOpen>
        <Popup.Content data-testid="content" glass aria-describedby={undefined}>
          <Popup.Header>
            <Popup.Title>Glassy</Popup.Title>
          </Popup.Header>
        </Popup.Content>
      </Popup>,
    );
    expect(screen.getByTestId("content")).toHaveAttribute("data-glass", "true");
  });
});
