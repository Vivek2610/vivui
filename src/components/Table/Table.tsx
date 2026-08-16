import * as React from "react";
import { cn } from "../../utils/cn";
import {
  tableContainerVariants,
  type TableContainerVariants,
} from "./Table.variants";

/**
 * Table — VivUI's data-grid primitive.
 *
 * Composability is the whole point: the outer surface is a neutral
 * frame with an optional `glass` material that lowers tint defaults
 * (vs. `Card`) so a wrapping `<Card gradient>` reads cleanly through
 * the frost. Drop a `<Table glass>` inside a gradient card and the
 * table becomes a colored-glass panel with the gradient bleeding
 * through every row.
 *
 *   <Card gradient="aurora" padding="none">
 *     <Table glass>
 *       <Table.Toolbar>…</Table.Toolbar>
 *       <Table.Element>
 *         <Table.Header>…</Table.Header>
 *         <Table.Body>…</Table.Body>
 *       </Table.Element>
 *       <Table.Pagination page={1} totalPages={11} />
 *     </Table>
 *   </Card>
 *
 * Compound parts (intentionally mirrors the layout in the reference
 * design): Toolbar • Search • IconButton • FilterPill • Element •
 * Header • Body • Row • Head • Cell • ExpandToggle • ActionButton •
 * Pagination.
 */

/* -------------------------------------------------------------------------- */
/*                              Glass material                                 */
/* -------------------------------------------------------------------------- */

export type TableGlassPreset = "subtle" | "medium" | "strong";
export type TableGlassBlur =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

interface ResolvedTableGlass {
  enabled: boolean;
  blur: TableGlassBlur;
  tint: number;
}

/**
 * Lower tint defaults than `Card`'s glass — a table stretched across a
 * gradient card needs to read through the frost without the rows
 * dominating the colored backdrop. `strong` here is roughly the same
 * opacity as `Card.glass="medium"`.
 */
const TABLE_GLASS_PRESETS: Record<
  TableGlassPreset,
  Omit<ResolvedTableGlass, "enabled">
> = {
  subtle: { blur: "md", tint: 0.42 },
  medium: { blur: "xl", tint: 0.22 },
  strong: { blur: "2xl", tint: 0.12 },
};

const BLUR_CLASS: Record<TableGlassBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

function resolveTableGlass(props: {
  glass?: boolean | TableGlassPreset;
  blur?: TableGlassBlur;
  tint?: number;
}): ResolvedTableGlass {
  let preset: TableGlassPreset | null = null;
  if (props.glass === true) preset = "medium";
  else if (typeof props.glass === "string") preset = props.glass;

  if (!preset) return { enabled: false, blur: "none", tint: 0 };

  const defaults = TABLE_GLASS_PRESETS[preset];
  return {
    enabled: true,
    blur: props.blur ?? defaults.blur,
    tint: props.tint ?? defaults.tint,
  };
}

/* -------------------------------------------------------------------------- */
/*                          Density propagation                                */
/* -------------------------------------------------------------------------- */

type Density = "compact" | "comfortable" | "spacious";

const DensityContext = React.createContext<Density>("comfortable");

const DENSITY_PADDING: Record<Density, { head: string; cell: string }> = {
  compact: { head: "py-1.5", cell: "py-1.5" },
  comfortable: { head: "py-2.5", cell: "py-3" },
  spacious: { head: "py-3", cell: "py-4" },
};

/* -------------------------------------------------------------------------- */
/*                                  Root                                       */
/* -------------------------------------------------------------------------- */

export interface TableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    TableContainerVariants {
  /**
   * Toggle a frosted-glass surface. `true` = `"medium"`. Disabled by
   * default — the table renders on the surface token. When enabled
   * with a colored backdrop (e.g. inside a `<Card gradient>`), the
   * frost lets the underlying color bleed through.
   */
  glass?: boolean | TableGlassPreset;
  /** Override frost amount (`sm` → `3xl`). */
  blur?: TableGlassBlur;
  /** Surface tint opacity (0–1). Lower = more see-through. */
  tint?: number;
}

const TableRoot = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      className,
      radius,
      density,
      glass,
      blur,
      tint,
      children,
      ...props
    },
    ref,
  ) => {
    const g = resolveTableGlass({ glass, blur, tint });
    const dens: Density = density ?? "comfortable";

    return (
      <DensityContext.Provider value={dens}>
        <div
          ref={ref}
          data-glass={g.enabled || undefined}
          data-density={dens}
          className={cn(
            tableContainerVariants({ radius, density: dens }),
            // Solid surface fallback — used when glass is disabled.
            !g.enabled && [
              "bg-surface border border-border/60",
              "shadow-viv-sm",
            ],
            // Glass frame — same multi-layer inset highlights as Card so
            // the edge of the table reads as actual glass against any
            // colored backdrop. tint drops on hover are owned by rows,
            // so this layer is purely structural.
            g.enabled && [
              "border border-white/30 dark:border-white/12",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_1px_0_0_0_rgba(255,255,255,0.18),0_10px_28px_-8px_rgba(0,0,0,0.18)]",
              "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_1px_0_0_0_rgba(255,255,255,0.06),0_10px_28px_-6px_rgba(0,0,0,0.45)]",
            ],
            className,
          )}
          {...props}
        >
          {g.enabled ? (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 z-0 rounded-[inherit]",
                BLUR_CLASS[g.blur],
                "backdrop-saturate-[140%]",
              )}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 42%, rgba(255,255,255,0.08) 100%), hsl(var(--viv-surface) / ${g.tint})`,
              }}
            />
          ) : null}
          <div className={cn("relative", g.enabled && "z-10")}>{children}</div>
        </div>
      </DensityContext.Provider>
    );
  },
);
TableRoot.displayName = "Table";

/* -------------------------------------------------------------------------- */
/*                                Toolbar                                      */
/* -------------------------------------------------------------------------- */

const TableToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 px-3 py-2.5",
      "border-b border-border/30",
      className,
    )}
    {...props}
  />
));
TableToolbar.displayName = "Table.Toolbar";

/* -------------------------------------------------------------------------- */
/*                                Search                                       */
/* -------------------------------------------------------------------------- */

export interface TableSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Class name for the surrounding pill (the input itself is the inner). */
  containerClassName?: string;
}

const TableSearch = React.forwardRef<HTMLInputElement, TableSearchProps>(
  (
    { className, containerClassName, placeholder = "Search…", ...props },
    ref,
  ) => (
    <label
      className={cn(
        "flex flex-1 items-center gap-2 h-9 px-4 cursor-text rounded-full",
        "bg-surface-overlay/70 dark:bg-surface-overlay/40",
        "border border-border/40",
        "focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/20",
        "transition-colors duration-fast",
        containerClassName,
      )}
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent text-sm outline-none",
          "placeholder:text-muted-foreground/70",
          // Hide the native search clear button on Webkit so the pill stays clean.
          "[&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
        {...props}
      />
    </label>
  ),
);
TableSearch.displayName = "Table.Search";

/* -------------------------------------------------------------------------- */
/*                            Toolbar buttons                                  */
/* -------------------------------------------------------------------------- */

const TableIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "size-9 inline-flex items-center justify-center rounded-full shrink-0",
      "bg-surface-overlay/70 dark:bg-surface-overlay/40",
      "border border-border/40 text-muted-foreground",
      "hover:bg-surface hover:text-foreground hover:border-foreground/20",
      "transition-colors duration-fast viv-focus-ring",
      className,
    )}
    {...props}
  />
));
TableIconButton.displayName = "Table.IconButton";

const TableFilterPill = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center gap-1.5 h-9 px-3.5 shrink-0 rounded-full",
      "bg-surface-overlay/70 dark:bg-surface-overlay/40",
      "border border-border/40 text-sm text-foreground",
      "hover:bg-surface hover:border-foreground/20",
      "transition-colors duration-fast viv-focus-ring",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon className="size-3.5 text-muted-foreground" />
  </button>
));
TableFilterPill.displayName = "Table.FilterPill";

/* -------------------------------------------------------------------------- */
/*                            Table element                                    */
/* -------------------------------------------------------------------------- */

/**
 * `Table.Element` is the actual `<table>`, wrapped in an x-axis scroll
 * container so wide grids don't blow out the surface frame on small
 * screens. Header/Body/Row/Cell/Head go inside.
 */
const TableElement = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom border-collapse text-sm",
        className,
      )}
      {...props}
    />
  </div>
));
TableElement.displayName = "Table.Element";

/* -------------------------------------------------------------------------- */
/*                            Header / Body                                    */
/* -------------------------------------------------------------------------- */

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b [&_tr]:border-border/40", className)}
    {...props}
  />
));
TableHeader.displayName = "Table.Header";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-b-0", className)}
    {...props}
  />
));
TableBody.displayName = "Table.Body";

/* -------------------------------------------------------------------------- */
/*                                  Row                                        */
/* -------------------------------------------------------------------------- */

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the row with a brand-tinted background. */
  selected?: boolean;
  /** Mark the row as expanded (for `Table.ExpandToggle` rows). */
  expanded?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, expanded, ...props }, ref) => (
    <tr
      ref={ref}
      data-selected={selected || undefined}
      data-expanded={expanded || undefined}
      className={cn(
        "border-b border-border/30 transition-colors duration-fast",
        selected
          ? "bg-brand-subtle/70 hover:bg-brand-subtle dark:bg-brand-subtle/40 dark:hover:bg-brand-subtle/55"
          : "hover:bg-surface-overlay/50 dark:hover:bg-surface-overlay/40",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "Table.Row";

/* -------------------------------------------------------------------------- */
/*                                  Head                                       */
/* -------------------------------------------------------------------------- */

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Render a sort indicator and turn the cell into a clickable target. */
  sortable?: boolean;
  /** Current sort direction (or `null` for unsorted but sortable). */
  sort?: "asc" | "desc" | null;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sort, children, onClick, ...props }, ref) => {
    const density = React.useContext(DensityContext);
    const ariaSort: React.AriaAttributes["aria-sort"] =
      sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={sortable ? ariaSort : undefined}
        onClick={onClick}
        className={cn(
          "px-4 align-middle text-left text-xs font-medium text-muted-foreground",
          DENSITY_PADDING[density].head,
          sortable &&
            "cursor-pointer select-none transition-colors hover:text-foreground",
          className,
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5">
          {children}
          {sortable ? <SortIcon sort={sort ?? null} /> : null}
        </span>
      </th>
    );
  },
);
TableHead.displayName = "Table.Head";

/* -------------------------------------------------------------------------- */
/*                                  Cell                                       */
/* -------------------------------------------------------------------------- */

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const density = React.useContext(DensityContext);
  return (
    <td
      ref={ref}
      className={cn(
        "px-4 align-middle text-sm",
        DENSITY_PADDING[density].cell,
        className,
      )}
      {...props}
    />
  );
});
TableCell.displayName = "Table.Cell";

/* -------------------------------------------------------------------------- */
/*                            ExpandToggle                                     */
/* -------------------------------------------------------------------------- */

export interface TableExpandToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expanded?: boolean;
}

const TableExpandToggle = React.forwardRef<
  HTMLButtonElement,
  TableExpandToggleProps
>(({ className, expanded, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={expanded ? "Collapse row" : "Expand row"}
    aria-expanded={expanded}
    className={cn(
      "size-5 inline-flex items-center justify-center rounded-md",
      "text-muted-foreground hover:bg-surface-overlay/60 hover:text-foreground",
      "transition-colors duration-fast",
      className,
    )}
    {...props}
  >
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-3 transition-transform duration-fast",
        !expanded && "-rotate-90",
      )}
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
));
TableExpandToggle.displayName = "Table.ExpandToggle";

/* -------------------------------------------------------------------------- */
/*                            ActionButton                                     */
/* -------------------------------------------------------------------------- */

const TableActionButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Row actions"
    className={cn(
      "size-7 inline-flex items-center justify-center rounded-md",
      "text-muted-foreground hover:bg-surface-overlay/60 hover:text-foreground",
      "transition-colors duration-fast viv-focus-ring",
      className,
    )}
    {...props}
  >
    <svg viewBox="0 0 24 24" className="size-4">
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" />
    </svg>
  </button>
));
TableActionButton.displayName = "Table.ActionButton";

/* -------------------------------------------------------------------------- */
/*                              Pagination                                     */
/* -------------------------------------------------------------------------- */

export interface TablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  /** Fires when the user clicks any of the step buttons. */
  onPageChange?: (page: number) => void;
  /**
   * Custom left-side label. Defaults to `Page {page} - {totalPages}`
   * with a small chevron, matching the reference design.
   */
  rangeLabel?: React.ReactNode;
}

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    { className, page, totalPages, onPageChange, rangeLabel, ...props },
    ref,
  ) => {
    const goTo = (p: number) => {
      const next = Math.max(1, Math.min(totalPages, p));
      if (next !== page) onPageChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-3 px-3 py-2.5",
          "border-t border-border/30",
          className,
        )}
        {...props}
      >
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {rangeLabel ?? (
            <>
              Page {page} - {totalPages}
            </>
          )}
          <ChevronDownIcon className="size-3" />
        </div>
        <div className="flex items-center gap-1">
          <PaginationStep
            onClick={() => goTo(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            <DoubleChevronLeftIcon />
          </PaginationStep>
          <PaginationStep
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </PaginationStep>
          <span
            aria-current="page"
            className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-brand px-2 text-xs font-semibold text-brand-foreground"
          >
            {page}
          </span>
          <PaginationStep
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </PaginationStep>
          <PaginationStep
            onClick={() => goTo(totalPages)}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            <DoubleChevronRightIcon />
          </PaginationStep>
        </div>
      </div>
    );
  },
);
TablePagination.displayName = "Table.Pagination";

function PaginationStep({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "size-7 inline-flex items-center justify-center rounded-md",
        "text-muted-foreground hover:bg-surface-overlay/60 hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-30",
        "transition-colors duration-fast",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Icons                                      */
/* -------------------------------------------------------------------------- */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <path
        d="M11 6l-6 6 6 6M19 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
      <path
        d="M13 6l6 6-6 6M5 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SortIcon({ sort }: { sort: "asc" | "desc" | null }) {
  return (
    <svg viewBox="0 0 24 24" className="size-3 shrink-0">
      <path
        d="M7 10l5-5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={sort === "asc" ? 1 : 0.35}
      />
      <path
        d="M7 14l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={sort === "desc" ? 1 : 0.35}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Compound assembly                                  */
/* -------------------------------------------------------------------------- */

type TableComponent = typeof TableRoot & {
  Toolbar: typeof TableToolbar;
  Search: typeof TableSearch;
  IconButton: typeof TableIconButton;
  FilterPill: typeof TableFilterPill;
  Element: typeof TableElement;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
  ExpandToggle: typeof TableExpandToggle;
  ActionButton: typeof TableActionButton;
  Pagination: typeof TablePagination;
};

export const Table = TableRoot as TableComponent;
Table.Toolbar = TableToolbar;
Table.Search = TableSearch;
Table.IconButton = TableIconButton;
Table.FilterPill = TableFilterPill;
Table.Element = TableElement;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.ExpandToggle = TableExpandToggle;
Table.ActionButton = TableActionButton;
Table.Pagination = TablePagination;

// Flat exports for tree-shaking precision and direct imports.
export {
  TableToolbar,
  TableSearch,
  TableIconButton,
  TableFilterPill,
  TableElement,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableExpandToggle,
  TableActionButton,
  TablePagination,
};
