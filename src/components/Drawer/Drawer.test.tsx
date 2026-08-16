import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("renders compound parts when open", () => {
    render(
      <Drawer defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit project</Drawer.Title>
            <Drawer.Description>Update details</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>Body content</Drawer.Body>
          <Drawer.Footer>
            <button type="button">Save</button>
          </Drawer.Footer>
          <Drawer.CloseButton />
        </Drawer.Content>
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/edit project/i)).toBeInTheDocument();
    expect(screen.getByText(/update details/i)).toBeInTheDocument();
    expect(screen.getByText(/body content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save/i }),
    ).toBeInTheDocument();
  });

  it.each(["left", "right", "top", "bottom"] as const)(
    "stamps data-side=%s on the content",
    (side) => {
      render(
        <Drawer defaultOpen>
          <Drawer.Content
            data-testid="content"
            side={side}
            aria-describedby={undefined}
          >
            <Drawer.Header>
              <Drawer.Title>Hello</Drawer.Title>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>,
      );
      expect(screen.getByTestId("content")).toHaveAttribute(
        "data-side",
        side,
      );
    },
  );

  it("closes via the CloseButton", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Content aria-describedby={undefined}>
          <Drawer.Header>
            <Drawer.Title>Closable</Drawer.Title>
          </Drawer.Header>
          <Drawer.CloseButton />
        </Drawer.Content>
      </Drawer>,
    );
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("flips data-glass and data-gradient", () => {
    render(
      <Drawer defaultOpen>
        <Drawer.Content
          data-testid="content"
          glass="medium"
          gradient="brand"
          aria-describedby={undefined}
        >
          <Drawer.Header>
            <Drawer.Title>Surfaced</Drawer.Title>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer>,
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveAttribute("data-glass", "true");
    expect(content).toHaveAttribute("data-gradient", "brand");
  });
});
