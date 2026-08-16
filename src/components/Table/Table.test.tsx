import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table } from "./Table";

describe("Table", () => {
  it("renders compound parts", () => {
    render(
      <Table data-testid="table">
        <Table.Element>
          <Table.Header>
            <Table.Row>
              <Table.Head>User</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ava Chen</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Element>
      </Table>,
    );
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /user/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /ava chen/i }),
    ).toBeInTheDocument();
  });

  it("marks selected rows with data-selected", () => {
    render(
      <Table>
        <Table.Element>
          <Table.Body>
            <Table.Row selected data-testid="row">
              <Table.Cell>Liam Patel</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Element>
      </Table>,
    );
    expect(screen.getByTestId("row")).toHaveAttribute("data-selected", "true");
  });

  it("forwards aria-sort on sortable heads", () => {
    render(
      <Table>
        <Table.Element>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable sort="asc">
                User
              </Table.Head>
              <Table.Head sortable>Status</Table.Head>
            </Table.Row>
          </Table.Header>
        </Table.Element>
      </Table>,
    );
    const heads = screen.getAllByRole("columnheader");
    expect(heads[0]).toHaveAttribute("aria-sort", "ascending");
    expect(heads[1]).toHaveAttribute("aria-sort", "none");
  });

  it("flips data-glass when glass is enabled", () => {
    render(
      <Table data-testid="table" glass="strong" tint={0.1}>
        <Table.Element>
          <Table.Body>
            <Table.Row>
              <Table.Cell>A</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Element>
      </Table>,
    );
    expect(screen.getByTestId("table")).toHaveAttribute("data-glass", "true");
  });
});
