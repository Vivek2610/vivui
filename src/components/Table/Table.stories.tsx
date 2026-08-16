import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Table, type TableProps } from "./Table";
import { Card } from "../Card/Card";
import { Badge } from "../Badge/Badge";

/**
 * Story args = Table's surface props PLUS feature toggles that control
 * which compound parts the demo renders. None of the toggles are part
 * of the Table component's own API — every compound part (Toolbar,
 * Search, FilterPill, sortable Heads, Pagination) is independently
 * opt-in. The toggles just make that obvious from the controls panel.
 */
type StoryArgs = Pick<
  TableProps,
  "glass" | "blur" | "tint" | "radius" | "density"
> & {
  showToolbar?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  sortable?: boolean;
  showPagination?: boolean;
};

const meta = {
  title: "Layout/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "VivUI's data-grid primitive. Toolbar + sortable header + selected/expandable rows + pagination — every piece is an independent compound part, so any of them can be omitted to ship a leaner table. The outer surface is a neutral frame with a `glass` toggle that drops the tint low enough for a wrapping `<Card gradient>` to bleed through every row.",
      },
    },
  },
  argTypes: {
    glass: {
      control: "select",
      options: [false, true, "subtle", "medium", "strong"],
      description:
        "Toggle frosted-glass surface. `true` = `medium`. Lower default tints than Card so colored backdrops read through.",
    },
    blur: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl", "3xl"],
      if: { arg: "glass", truthy: true },
    },
    tint: {
      control: { type: "range", min: 0, max: 1, step: 0.02 },
      if: { arg: "glass", truthy: true },
    },
    radius: { control: "select", options: ["sm", "md", "lg", "xl", "2xl"] },
    density: {
      control: "select",
      options: ["compact", "comfortable", "spacious"],
    },
    showToolbar: {
      control: "boolean",
      description: "Render the top toolbar (search + filter row).",
    },
    showSearch: {
      control: "boolean",
      if: { arg: "showToolbar", truthy: true },
      description: "Render `Table.Search` inside the toolbar.",
    },
    showFilter: {
      control: "boolean",
      if: { arg: "showToolbar", truthy: true },
      description: "Render the filter icon button + `All Filters` pill.",
    },
    sortable: {
      control: "boolean",
      description: "Enable sort indicators on every header cell.",
    },
    showPagination: {
      control: "boolean",
      description: "Render `Table.Pagination` at the bottom.",
    },
  },
  args: {
    glass: false,
    radius: "xl",
    density: "comfortable",
    showToolbar: true,
    showSearch: true,
    showFilter: true,
    sortable: true,
    showPagination: true,
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/* -------------------------------------------------------------------------- */
/*                              Mock data                                      */
/* -------------------------------------------------------------------------- */

type Row = {
  name: string;
  status: "Success" | "Warning" | "Processing";
  role: string;
  lastActive: string;
};

const ROWS: Row[] = [
  { name: "Ava Chen", status: "Success", role: "AI Engineer", lastActive: "16 mons" },
  { name: "Liam Patel", status: "Warning", role: "Data Scientist", lastActive: "10 days" },
  { name: "Aiden Smith", status: "Success", role: "AI Engineer", lastActive: "18 days" },
  { name: "Ava Chen", status: "Processing", role: "AI Engineer", lastActive: "12 days" },
  // index 4 is the selected row in the reference design
  { name: "Liam Patel", status: "Warning", role: "Data Scientist", lastActive: "18 days" },
  { name: "Lila Rivera", status: "Processing", role: "AI Engineer", lastActive: "19 days" },
  { name: "Avva Greson", status: "Success", role: "AI Engineer", lastActive: "14 days" },
  { name: "Liam Mhart", status: "Processing", role: "AI Engineer", lastActive: "10 days" },
  { name: "Aura Moson", status: "Success", role: "AI Engineer", lastActive: "10 days" },
  { name: "Ava Chen", status: "Warning", role: "AI Engineer", lastActive: "14 days" },
  { name: "Liam Patel", status: "Warning", role: "Data Scientist", lastActive: "14 days" },
  { name: "Liam Patel", status: "Processing", role: "AI Engineer", lastActive: "14 days" },
];

const STATUS_VARIANT: Record<Row["status"], "success" | "warning" | "info"> = {
  Success: "success",
  Warning: "warning",
  Processing: "info",
};

/* -------------------------------------------------------------------------- */
/*                            DataGrid demo block                              */
/* -------------------------------------------------------------------------- */

type DataGridDemoProps = Pick<
  TableProps,
  "glass" | "blur" | "tint" | "radius" | "density" | "className"
> & {
  showToolbar?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  sortable?: boolean;
  showPagination?: boolean;
};

function DataGridDemo({
  glass,
  blur,
  tint,
  radius = "xl",
  density = "comfortable",
  className,
  showToolbar = true,
  showSearch = true,
  showFilter = true,
  sortable = true,
  showPagination = true,
}: DataGridDemoProps) {
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<"asc" | "desc" | null>("asc");
  const [selected, setSelected] = React.useState<Set<number>>(new Set([4]));
  const [expanded, setExpanded] = React.useState(true);

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const cycleSort = () =>
    setSort((s) => (s === "asc" ? "desc" : s === "desc" ? null : "asc"));

  const head = ROWS.slice(0, 4);
  const tail = ROWS.slice(4);

  return (
    <Table
      glass={glass}
      blur={blur}
      tint={tint}
      radius={radius}
      density={density}
      className={className}
    >
      {showToolbar ? (
        <Table.Toolbar>
          {showSearch ? <Table.Search placeholder="Search..." /> : null}
          {!showSearch && !showFilter ? (
            // Keep the toolbar from collapsing into a 0-height row when
            // both search and filter are off — fill with a soft hint.
            <span className="text-xs text-muted-foreground">Toolbar</span>
          ) : null}
          {showFilter ? (
            <>
              <Table.IconButton aria-label="Filter">
                <FilterIcon />
              </Table.IconButton>
              <Table.FilterPill>All Filters</Table.FilterPill>
            </>
          ) : null}
        </Table.Toolbar>
      ) : null}

      <Table.Element>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-10">
              <input
                type="checkbox"
                className="size-3.5 cursor-pointer accent-brand"
                aria-label="Select all"
              />
            </Table.Head>
            <Table.Head
              sortable={sortable}
              sort={sortable ? sort : null}
              onClick={sortable ? cycleSort : undefined}
            >
              User
            </Table.Head>
            <Table.Head sortable={sortable}>Status</Table.Head>
            <Table.Head sortable={sortable}>Role</Table.Head>
            <Table.Head>Last active</Table.Head>
            <Table.Head className="w-16">Action</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {head.map((r, i) => (
            <UserRow
              key={`h-${i}`}
              row={r}
              index={i}
              selected={selected.has(i)}
              onToggle={toggle}
            />
          ))}

          {/* Expandable row — the "▾ Expandable row" line in the reference. */}
          <Table.Row expanded={expanded}>
            <Table.Cell />
            <Table.Cell>
              <span className="inline-flex items-center gap-2">
                <Table.ExpandToggle
                  expanded={expanded}
                  onClick={() => setExpanded((e) => !e)}
                />
                <span className="text-sm font-medium">Expandable row</span>
              </span>
            </Table.Cell>
            <Table.Cell>
              <Badge variant="success">Success</Badge>
            </Table.Cell>
            <Table.Cell />
            <Table.Cell className="text-muted-foreground">13 days</Table.Cell>
            <Table.Cell>
              <Table.ActionButton />
            </Table.Cell>
          </Table.Row>

          {tail.map((r, idx) => {
            const i = 4 + idx;
            return (
              <UserRow
                key={`t-${i}`}
                row={r}
                index={i}
                selected={selected.has(i)}
                onToggle={toggle}
              />
            );
          })}
        </Table.Body>
      </Table.Element>

      {showPagination ? (
        <Table.Pagination
          page={page}
          totalPages={11}
          onPageChange={setPage}
          rangeLabel={<>Page {page} - 11</>}
        />
      ) : null}
    </Table>
  );
}

function UserRow({
  row,
  index,
  selected,
  onToggle,
}: {
  row: Row;
  index: number;
  selected: boolean;
  onToggle: (i: number) => void;
}) {
  return (
    <Table.Row selected={selected}>
      <Table.Cell>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(index)}
          className="size-3.5 cursor-pointer accent-brand"
          aria-label={`Select ${row.name}`}
        />
      </Table.Cell>
      <Table.Cell>
        <span className="inline-flex items-center gap-3 font-medium">
          <Avatar name={row.name} />
          <span>{row.name}</span>
        </span>
      </Table.Cell>
      <Table.Cell>
        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
      </Table.Cell>
      <Table.Cell className="text-foreground/90">{row.role}</Table.Cell>
      <Table.Cell className="text-muted-foreground">{row.lastActive}</Table.Cell>
      <Table.Cell>
        <Table.ActionButton />
      </Table.Cell>
    </Table.Row>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Stories                                      */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Solid surface with every compound part wired up. Use the controls panel to flip individual features off — `showToolbar`, `showSearch`, `showFilter`, `sortable`, `showPagination` are all independent toggles. None of them are part of the Table component's own API; they just demonstrate that each compound part is independently opt-in.",
      },
    },
  },
  render: (args) => (
    <div className="min-h-[640px] w-full bg-background p-8">
      <DataGridDemo {...args} />
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    showToolbar: false,
    showSearch: false,
    showFilter: false,
    sortable: false,
    showPagination: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Bare data grid — every optional compound part has been removed. The Table is just a frame around the `<table>` element with rows and cells. Add any subset back via the controls panel: `showToolbar`, `showSearch`, `showFilter`, `sortable`, `showPagination`.",
      },
    },
  },
  render: (args) => (
    <div className="min-h-[480px] w-full bg-background p-8">
      <DataGridDemo {...args} />
    </div>
  ),
};

export const Glass: Story = {
  args: { glass: "strong", tint: 0.1 },
  parameters: {
    docs: {
      description: {
        story:
          "Glass surface against a colored backdrop. Notice how the radial gradients in the canvas bleed through every row — that's `backdrop-filter: blur` doing its work. With `glass=\"strong\"` and `tint=0.1` the table reads as a colored-glass panel.",
      },
    },
  },
  render: (args) => (
    <div className="min-h-[640px] w-full bg-[radial-gradient(at_25%_25%,hsl(258_95%_60%/0.45),transparent_55%),radial-gradient(at_75%_75%,hsl(218_95%_55%/0.45),transparent_55%),hsl(240_14%_8%)] p-8">
      <DataGridDemo {...args} />
    </div>
  ),
};

export const GlassInGradientCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**The composition the prop was designed for.** The `<Card gradient>` underneath provides the animated panning gradient, and `<Table glass>` sits on top with a frosted overlay so the gradient is blurred and tinted through every row. Hover the card and you'll see the sheen sweep over the table too. Toggle the controls panel's `glass` to `false` to see the same table opaquely on a solid surface — same data, totally different mood. Note the table radius is set to match the card so the rounded corners line up exactly — relying on `overflow:hidden` alone isn't enough because `backdrop-filter` creates its own stacking context that some browsers don't clip cleanly.",
      },
    },
  },
  args: { glass: "strong", tint: 0.1 },
  render: (args) => (
    <div className="min-h-[640px] w-full bg-background p-8">
      <Card
        gradient="aurora"
        gradientSpeed="slow"
        radius="2xl"
        padding="none"
        className="overflow-hidden"
      >
        <DataGridDemo
          {...args}
          radius="2xl"
          className="border-0 shadow-none"
        />
      </Card>
    </div>
  ),
};

export const GradientPalettes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drop the same glass table into each gradient palette — `brand`, `aurora`, `sunset`, `ocean`. The frost picks up the dominant hue and the data stays perfectly legible because the tint sits on top of the gradient. The inner table is given `radius=\"2xl\"` to match the card so the rounded corners are real geometry on both layers, not just a hopeful overflow clip.",
      },
    },
  },
  render: () => (
    <div className="min-h-[640px] w-full bg-background p-8 space-y-8">
      {(["brand", "aurora", "sunset", "ocean"] as const).map((preset) => (
        <Card
          key={preset}
          gradient={preset}
          gradientSpeed="slow"
          radius="2xl"
          padding="none"
          className="overflow-hidden"
        >
          <CompactDemo glass="strong" tint={0.1} radius="2xl" />
        </Card>
      ))}
    </div>
  ),
};

export const Density: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three vertical-padding tiers. `compact` is great for dense list views, `comfortable` (default) matches the reference, `spacious` gives a more editorial feel.",
      },
    },
  },
  render: () => (
    <div className="min-h-[640px] w-full bg-background p-8 space-y-6">
      {(["compact", "comfortable", "spacious"] as const).map((d) => (
        <div key={d} className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            density=&quot;{d}&quot;
          </p>
          <CompactDemo density={d} />
        </div>
      ))}
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*                              Helpers                                        */
/* -------------------------------------------------------------------------- */

function CompactDemo({
  glass,
  tint,
  density,
  radius,
}: {
  glass?: TableProps["glass"];
  tint?: number;
  density?: TableProps["density"];
  /**
   * Override the table's corner radius. Pass the parent's radius when
   * embedding inside a rounded card so both layers' rounded corners
   * are real geometry (not just an overflow clip on `backdrop-filter`).
   */
  radius?: TableProps["radius"];
}) {
  return (
    <Table
      glass={glass}
      tint={tint}
      density={density}
      radius={radius ?? "xl"}
      className={glass ? "border-0 shadow-none" : undefined}
    >
      <Table.Element>
        <Table.Header>
          <Table.Row>
            <Table.Head>User</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Role</Table.Head>
            <Table.Head>Last active</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ROWS.slice(0, 5).map((r, i) => (
            <Table.Row key={i} selected={i === 1}>
              <Table.Cell>
                <span className="inline-flex items-center gap-3 font-medium">
                  <Avatar name={r.name} />
                  <span>{r.name}</span>
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
              </Table.Cell>
              <Table.Cell className="text-foreground/90">{r.role}</Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {r.lastActive}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Element>
    </Table>
  );
}

const AVATAR_PALETTE: Array<[string, string]> = [
  ["#fb7185", "#e11d48"],
  ["#60a5fa", "#2563eb"],
  ["#34d399", "#059669"],
  ["#fbbf24", "#ea580c"],
  ["#a78bfa", "#7c3aed"],
  ["#22d3ee", "#0891b2"],
  ["#f472b6", "#db2777"],
  ["#4ade80", "#15803d"],
];

function avatarFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const tuple =
    AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0]!;
  const [a, b] = tuple;
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return { initials, gradient: `linear-gradient(135deg, ${a}, ${b})` };
}

function Avatar({ name }: { name: string }) {
  const { initials, gradient } = avatarFor(name);
  return (
    <span
      aria-label={name}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]"
      style={{ background: gradient }}
    >
      {initials}
    </span>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <path
        d="M4 5h16M7 12h10M10 19h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
