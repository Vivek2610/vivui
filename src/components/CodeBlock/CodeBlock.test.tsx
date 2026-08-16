import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "./CodeBlock";
import { tokenize, parseDiff, normalizeLanguage } from "./CodeBlock.tokenizer";

describe("CodeBlock", () => {
  it("renders source code with a filename label", () => {
    const { container } = render(
      <CodeBlock language="tsx" filename="App.tsx">
        {`const x = 1;`}
      </CodeBlock>,
    );
    expect(screen.getByText("App.tsx")).toBeInTheDocument();
    // Source content reaches the DOM (tokenizer doesn't strip it). Many
    // ancestors share the same textContent, so we read the <code> directly.
    const code = container.querySelector("code");
    expect(code?.textContent).toBe("const x = 1;");
  });

  it("renders line numbers when enabled", () => {
    render(
      <CodeBlock language="tsx" showLineNumbers>
        {`a\nb\nc`}
      </CodeBlock>,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("collapses past `maxLines` and exposes a Show More toggle", async () => {
    const long = Array.from({ length: 12 }, (_, i) => `line ${i + 1}`).join("\n");
    const user = userEvent.setup();
    render(
      <CodeBlock expandable maxLines={3} language="text">
        {long}
      </CodeBlock>,
    );
    const toggle = screen.getByRole("button", { name: /show more/i });
    expect(toggle).toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
  });

  it("switches active panel when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock.Tabs defaultValue="a">
        <CodeBlock.TabList>
          <CodeBlock.Tab value="a">A</CodeBlock.Tab>
          <CodeBlock.Tab value="b">B</CodeBlock.Tab>
        </CodeBlock.TabList>
        <CodeBlock.Panel value="a">
          <CodeBlock language="text">{"alpha"}</CodeBlock>
        </CodeBlock.Panel>
        <CodeBlock.Panel value="b">
          <CodeBlock language="text">{"bravo"}</CodeBlock>
        </CodeBlock.Panel>
      </CodeBlock.Tabs>,
    );
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.queryByText("bravo")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "B" }));
    expect(screen.getByText("bravo")).toBeInTheDocument();
  });
});

describe("CodeBlock tokenizer", () => {
  it("normalizes language aliases", () => {
    expect(normalizeLanguage("ts")).toBe("typescript");
    expect(normalizeLanguage("sh")).toBe("bash");
    expect(normalizeLanguage("anything-unknown")).toBe("text");
  });

  it("tags JS keywords / strings / comments", () => {
    const toks = tokenize(
      `// hi\nconst x = "hello";`,
      "javascript",
    );
    const types = toks.map((t) => t.type);
    expect(types).toContain("comment");
    expect(types).toContain("keyword");
    expect(types).toContain("string");
  });

  it("parses unified diff markers", () => {
    const lines = parseDiff(`+added\n-removed\n context`);
    expect(lines[0]).toEqual({ kind: "add", content: "added" });
    expect(lines[1]).toEqual({ kind: "remove", content: "removed" });
    expect(lines[2]?.kind).toBe("context");
  });
});
