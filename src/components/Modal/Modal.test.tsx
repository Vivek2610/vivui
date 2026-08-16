import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders compound parts inside the dialog when open", () => {
    render(
      <Modal defaultOpen>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Confirm action</Modal.Title>
            <Modal.Description>This cannot be undone.</Modal.Description>
          </Modal.Header>
          <Modal.Body>Body content</Modal.Body>
          <Modal.Footer>
            <button type="button">Confirm</button>
          </Modal.Footer>
          <Modal.CloseButton />
        </Modal.Content>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /confirm action/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/this cannot be undone/i)).toBeInTheDocument();
    expect(screen.getByText(/body content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^close$/i }),
    ).toBeInTheDocument();
  });

  it("wires title/description to dialog labelling", () => {
    render(
      <Modal defaultOpen>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Wired title</Modal.Title>
            <Modal.Description>Wired description</Modal.Description>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
    const title = screen.getByText(/wired title/i);
    const description = screen.getByText(/wired description/i);
    // Radix sets aria-labelledby/-describedby to the IDs of the title /
    // description elements automatically — verifying the wiring catches
    // accidental regressions if we ever stop forwarding to DialogPrimitive.
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
    expect(dialog.getAttribute("aria-describedby")).toBe(description.id);
  });

  it("closes via the CloseButton", async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal defaultOpen onOpenChange={onOpenChange}>
        <Modal.Content aria-describedby={undefined}>
          <Modal.Header>
            <Modal.Title>Closable</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
        </Modal.Content>
      </Modal>,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("flips data-glass when glass is enabled", () => {
    render(
      <Modal defaultOpen>
        <Modal.Content
          data-testid="content"
          glass="strong"
          aria-describedby={undefined}
        >
          <Modal.Header>
            <Modal.Title>Glassy</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByTestId("content")).toHaveAttribute("data-glass", "true");
  });

  it("flips data-gradient to the chosen preset", () => {
    render(
      <Modal defaultOpen>
        <Modal.Content
          data-testid="content"
          gradient="aurora"
          aria-describedby={undefined}
        >
          <Modal.Header>
            <Modal.Title>Aurora</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByTestId("content")).toHaveAttribute(
      "data-gradient",
      "aurora",
    );
  });

  it("does not dismiss on Escape when dismissible={false}", async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal defaultOpen onOpenChange={onOpenChange}>
        <Modal.Content dismissible={false} aria-describedby={undefined}>
          <Modal.Header>
            <Modal.Title>Locked</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
