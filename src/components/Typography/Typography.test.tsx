import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading, Text, Code, Kbd } from "./Typography";

describe("Typography", () => {
  describe("Heading", () => {
    it("renders the correct semantic level", () => {
      render(<Heading level={3}>Title</Heading>);
      expect(screen.getByRole("heading", { level: 3, name: /title/i })).toBeInTheDocument();
    });

    it("respects the `as` override", () => {
      render(
        <Heading level={2} as="div" data-testid="heading">
          Title
        </Heading>,
      );
      const el = screen.getByTestId("heading");
      expect(el.tagName).toBe("DIV");
    });

    it("applies the gradient variant class", () => {
      render(<Heading variant="gradient">Title</Heading>);
      const el = screen.getByText(/title/i);
      // class-variance-authority appends our gradient utility classes;
      // we only assert one of the stable ones (animation).
      expect(el.className).toContain("animate-viv-gradient-pan");
    });
  });

  describe("Text", () => {
    it("renders a paragraph by default", () => {
      render(<Text>Body</Text>);
      const el = screen.getByText(/body/i);
      expect(el.tagName).toBe("P");
    });

    it("respects the `as` override", () => {
      render(
        <Text as="span" data-testid="text">
          Inline
        </Text>,
      );
      expect(screen.getByTestId("text").tagName).toBe("SPAN");
    });
  });

  describe("Code (inline)", () => {
    it("renders a <code> element", () => {
      render(<Code>npm</Code>);
      const el = screen.getByText("npm");
      expect(el.tagName).toBe("CODE");
    });
  });

  describe("Kbd", () => {
    it("renders a <kbd> element", () => {
      render(<Kbd>Ctrl</Kbd>);
      const el = screen.getByText("Ctrl");
      expect(el.tagName).toBe("KBD");
    });
  });
});
