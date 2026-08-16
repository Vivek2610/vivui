import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders compound parts", () => {
    render(
      <Card data-testid="card">
        <Card.Header>
          <Card.Title>Hello</Card.Title>
          <Card.Description>World</Card.Description>
        </Card.Header>
        <Card.Body>Body text</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hello/i })).toBeInTheDocument();
    expect(screen.getByText(/world/i)).toBeInTheDocument();
    expect(screen.getByText(/body text/i)).toBeInTheDocument();
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
  });
});
