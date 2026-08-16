import * as React from "react";
import { cn } from "../../utils/cn";
import {
  tokenize,
  tokensToLines,
  parseDiff,
  normalizeLanguage,
  type Token,
  type TokenType,
  type SupportedLanguage,
} from "./CodeBlock.tokenizer";
import {
  codeBlockVariants,
  type CodeBlockVariants,
} from "./CodeBlock.variants";

/**
 * VivUI <CodeBlock /> — the premium, AI-native code surface.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Why a custom component (and not Shiki / PrismJS)?
 *   • Zero runtime dependencies — keeps the package light.
 *   • Full control over the visual language — gradient borders, AI
 *     shimmer, terminal chrome, diff backgrounds, expand/collapse and
 *     the floating-AI-card variant share one renderer.
 *   • Server-renderable — no async highlighter setup; the tokenizer
 *     runs on a string at render time.
 *
 * The underlying tokenizer is intentionally lossy (see tokenizer.ts).
 * It produces a flat token stream which the renderer groups by line
 * so each line can carry its own modifiers (highlight, diff state,
 * line number, etc.).
 *
 * ────────────────────────────────────────────────────────────────────────
 * Compound API:
 *
 *   <CodeBlock language="tsx" filename="App.tsx" copyable showLineNumbers>
 *     {`const greet = "hello";`}
 *   </CodeBlock>
 *
 *   <CodeBlock.Tabs defaultValue="react">
 *     <CodeBlock.TabList>
 *       <CodeBlock.Tab value="react">React</CodeBlock.Tab>
 *       <CodeBlock.Tab value="ts">TypeScript</CodeBlock.Tab>
 *       <CodeBlock.Tab value="cli">CLI</CodeBlock.Tab>
 *     </CodeBlock.TabList>
 *     <CodeBlock.Panel value="react"><CodeBlock language="tsx">…</CodeBlock></CodeBlock.Panel>
 *   </CodeBlock.Tabs>
 *
 *   <CodeBlock.LivePreview>
 *     <CodeBlock.Preview><Button>Click</Button></CodeBlock.Preview>
 *     <CodeBlock language="tsx">{`<Button>Click</Button>`}</CodeBlock>
 *   </CodeBlock.LivePreview>
 *
 *   <CodeBlock.AIAnswer
 *     question="How do I render a button?"
 *     status="ready"
 *   >
 *     <CodeBlock variant="ai" language="tsx">…</CodeBlock>
 *   </CodeBlock.AIAnswer>
 *
 *   <CodeBlock.Markdown>
 *     ## Heading
 *     Some prose with `inline` and a block:
 *     ```tsx
 *     const x = 1;
 *     ```
 *   </CodeBlock.Markdown>
 */

/* -------------------------------------------------------------------------- */
/*                          Token color palette                                */
/* -------------------------------------------------------------------------- */

/**
 * Per-token-type Tailwind classes — tuned for both dark (charcoal terminal,
 * deep frosted surfaces) and light themes (soft pastels with high
 * contrast). Colors are dual-stop: a richer hue in dark mode, muted in
 * light mode. Inspired by GitHub's "dimmed" + JetBrains' "Darcula".
 */
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:
    "text-[hsl(280_85%_70%)] dark:text-[hsl(280_95%_78%)]",
  boolean:
    "text-[hsl(28_95%_55%)] dark:text-[hsl(28_95%_65%)]",
  null: "text-[hsl(28_95%_55%)] dark:text-[hsl(28_95%_65%)]",
  string:
    "text-[hsl(150_60%_38%)] dark:text-[hsl(150_70%_70%)]",
  template:
    "text-[hsl(150_60%_38%)] dark:text-[hsl(150_70%_70%)]",
  regex:
    "text-[hsl(330_80%_55%)] dark:text-[hsl(330_85%_72%)]",
  comment:
    "italic text-[hsl(240_8%_50%)] dark:text-[hsl(240_8%_58%)]",
  number:
    "text-[hsl(28_95%_55%)] dark:text-[hsl(28_95%_65%)]",
  operator:
    "text-[hsl(195_85%_42%)] dark:text-[hsl(195_95%_70%)]",
  punctuation:
    "text-[hsl(240_6%_45%)] dark:text-[hsl(240_8%_70%)]",
  function:
    "text-[hsl(218_85%_55%)] dark:text-[hsl(218_95%_75%)]",
  class:
    "text-[hsl(180_70%_40%)] dark:text-[hsl(180_80%_70%)]",
  constant:
    "text-[hsl(28_95%_55%)] dark:text-[hsl(28_95%_65%)]",
  variable: "text-foreground/90",
  property:
    "text-[hsl(218_85%_55%)] dark:text-[hsl(218_95%_75%)]",
  tag: "text-[hsl(330_80%_55%)] dark:text-[hsl(330_85%_72%)]",
  attribute:
    "text-[hsl(258_85%_60%)] dark:text-[hsl(258_95%_78%)]",
  selector:
    "text-[hsl(330_80%_55%)] dark:text-[hsl(330_85%_72%)]",
  rule: "text-[hsl(218_85%_55%)] dark:text-[hsl(218_95%_75%)]",
  command:
    "text-[hsl(150_60%_38%)] dark:text-[hsl(150_85%_72%)] font-semibold",
  flag:
    "text-[hsl(258_85%_60%)] dark:text-[hsl(258_95%_78%)]",
  path:
    "text-[hsl(195_85%_42%)] dark:text-[hsl(195_95%_70%)] underline decoration-dotted underline-offset-4",
  text: "text-foreground/90",
};

/* -------------------------------------------------------------------------- */
/*                                   Types                                     */
/* -------------------------------------------------------------------------- */

export interface CodeBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    CodeBlockVariants {
  /** The source code to render. Whitespace is preserved verbatim. */
  children?: string;
  /** Language key — drives syntax highlighting. Defaults to `text`. */
  language?: string;
  /** Optional filename label rendered in the toolbar. */
  filename?: string;
  /** Show macOS-style window dots ("traffic lights") on the left. Defaults: standard/ai = true, terminal = true, others = false. */
  windowControls?: boolean;
  /** Render line numbers in a left gutter. */
  showLineNumbers?: boolean;
  /** Highlight specific 1-indexed lines (e.g. `[2, 4, 5]`). */
  highlightLines?: number[];
  /** Render a copy-to-clipboard button in the toolbar. */
  copyable?: boolean;
  /**
   * Treat children as a unified diff (`+` add / `-` remove / context).
   * The leading marker is stripped before highlighting and re-attached
   * to the rendered line. Mutually exclusive with `highlightLines`
   * (diff backgrounds win).
   */
  diff?: boolean;
  /** Collapse to `maxLines` until the user expands. */
  expandable?: boolean;
  /** Lines to show when `expandable` is true and the block is collapsed. */
  maxLines?: number;
  /** AI shimmer loading state — overlays a moving brand bar. */
  loading?: boolean;
  /**
   * AI typing cursor — appended after the last visible token. Use with
   * `loading` to mimic streaming generation.
   */
  cursor?: boolean;
  /** Optional content rendered to the right of the toolbar (badges, etc.). */
  toolbarTrailing?: React.ReactNode;
  /** Optional shell prompt for the terminal variant (default: `$`). */
  prompt?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Toolbar bits                                 */
/* -------------------------------------------------------------------------- */

function WindowControls(): React.ReactElement {
  // Three "traffic light" dots — close, minimize, fullscreen.
  return (
    <span aria-hidden="true" className="flex items-center gap-1.5">
      <span className="size-3 rounded-full bg-[hsl(0_75%_60%)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
      <span className="size-3 rounded-full bg-[hsl(38_95%_55%)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
      <span className="size-3 rounded-full bg-[hsl(140_55%_50%)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
    </span>
  );
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * CopyButton — copies the given text to the clipboard with a 2-second
 * "Copied" confirmation. Falls back to a no-op if the Clipboard API
 * is unavailable (Safari sandboxed iframes, etc.).
 */
function CopyButton({ text, className }: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Swallow — clipboard might be blocked. UI just won't flip.
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy code"}
      className={cn(
        "relative inline-flex h-7 items-center gap-1.5 rounded-md px-2",
        "text-[11px] font-medium text-foreground/70",
        "border border-white/10 bg-white/5",
        "transition-[transform,background-color,border-color,color] duration-fast ease-viv-out",
        "hover:text-foreground hover:bg-white/10 hover:border-white/20",
        "active:scale-[0.96]",
        "viv-focus-ring",
        copied && "text-brand border-brand/40 bg-brand/15",
        className,
      )}
    >
      <span aria-hidden="true" className="relative inline-flex size-3.5">
        <CopyIcon
          className={cn(
            "absolute inset-0 transition-opacity duration-fast",
            copied ? "opacity-0" : "opacity-100",
          )}
        />
        <CheckIcon
          className={cn(
            "absolute inset-0 transition-opacity duration-fast",
            copied ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-3.5", className)}>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 15V6a2 2 0 0 1 2-2h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-3.5", className)}>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "size-3.5 transition-transform duration ease-viv-out",
        open && "rotate-180",
        className,
      )}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LanguageBadge({ language }: { language: string }): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-md px-1.5",
        "border border-white/10 bg-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.06em]",
        "text-foreground/60",
      )}
    >
      {language}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Renderer                                    */
/* -------------------------------------------------------------------------- */

interface RenderedLine {
  number: number;
  tokens: Token[];
  /** Diff state (only set when `diff` mode is on). */
  diff?: "add" | "remove" | "context";
  /** True when `highlightLines` includes this line number. */
  highlight?: boolean;
}

/**
 * Convert raw `children` + `diff` mode into a flat list of rendered
 * lines. Diff mode tokenizes each line independently so the line color
 * (background) wraps the syntax tokens.
 */
function buildLines(
  source: string,
  language: SupportedLanguage,
  diff: boolean,
  highlightLines: number[] | undefined,
): RenderedLine[] {
  const highlight = new Set(highlightLines ?? []);

  if (diff) {
    const diffLines = parseDiff(source);
    return diffLines.map<RenderedLine>((line, idx) => ({
      number: idx + 1,
      tokens: tokenize(line.content, language),
      diff: line.kind,
      highlight: highlight.has(idx + 1),
    }));
  }

  const tokens = tokenize(source, language);
  const grouped = tokensToLines(tokens);
  return grouped.map<RenderedLine>((line, idx) => ({
    number: idx + 1,
    tokens: line,
    highlight: highlight.has(idx + 1),
  }));
}

/* -------------------------------------------------------------------------- */
/*                              CodeBlock root                                  */
/* -------------------------------------------------------------------------- */

const CodeBlockRoot = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      children = "",
      language: languageProp = "text",
      filename,
      windowControls,
      showLineNumbers = false,
      highlightLines,
      copyable = true,
      diff = false,
      expandable = false,
      maxLines = 8,
      loading = false,
      cursor = false,
      toolbarTrailing,
      prompt = "$",
      variant = "standard",
      radius,
      density,
      className,
      ...props
    },
    ref,
  ) => {
    const language = normalizeLanguage(languageProp);
    const isTerminal = variant === "terminal";

    // Lines are computed once per source change. For diff mode we feed
    // each diff line through the tokenizer separately so the leading
    // `+`/`-` doesn't leak into the highlighted body.
    const lines = React.useMemo(
      () => buildLines(children, language, diff, highlightLines),
      [children, language, diff, highlightLines],
    );

    const [expanded, setExpanded] = React.useState(false);

    // When Storybook Controls (or callers) mutate source / expand knobs,
    // reset collapse state — otherwise we'd keep showing stale slices.
    React.useEffect(() => {
      setExpanded(false);
    }, [children, expandable, maxLines]);
    const collapsed = expandable && !expanded && lines.length > maxLines;
    const visibleLines = collapsed ? lines.slice(0, maxLines) : lines;

    // Window controls default: visible on standard / ai / terminal.
    const showWindowControls =
      windowControls ?? (variant === "standard" || variant === "ai" || isTerminal);

    // Toolbar visibility — hide entirely if there's literally nothing
    // to put in it. Improves the "ghost" / "markdown" embed look.
    const hasToolbar =
      showWindowControls ||
      Boolean(filename) ||
      copyable ||
      Boolean(toolbarTrailing) ||
      (isTerminal && !filename);

    return (
      <div
        ref={ref}
        data-variant={variant}
        data-language={language}
        data-loading={loading || undefined}
        className={cn(
          codeBlockVariants({ variant, radius, density }),
          // Pulse the AI border softly when loading.
          loading && variant === "ai" && "animate-viv-glow-breathe",
          className,
        )}
        {...props}
      >
        {/* z-0 — AI variant gets a panning gradient strip behind the glass. */}
        {variant === "ai" ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-0 h-px",
              "bg-[linear-gradient(90deg,transparent,hsl(258_95%_70%/0.8),hsl(190_95%_60%/0.8),hsl(258_95%_70%/0.8),transparent)]",
              "bg-[length:200%_100%] animate-viv-gradient-pan opacity-90",
            )}
          />
        ) : null}

        {/* z-2 — subtle noise texture for that premium "not flat" feel. */}
        <span
          aria-hidden="true"
          className={cn(
            "viv-noise pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-[0.05] mix-blend-overlay",
            isTerminal && "opacity-[0.08]",
          )}
        />

        {/* z-3 — AI shimmer overlay (only when `loading`). */}
        {loading ? (
          <span
            aria-hidden="true"
            className={cn(
              "viv-shimmer-bar pointer-events-none absolute inset-0 z-[3] rounded-[inherit] opacity-80",
            )}
          />
        ) : null}

        <div className="relative z-10">
          {hasToolbar ? (
            <CodeBlockToolbar
              variant={variant}
              filename={filename}
              language={language}
              isTerminal={isTerminal}
              showWindowControls={showWindowControls}
              copyable={copyable}
              copyText={children}
              trailing={toolbarTrailing}
            />
          ) : null}

          <div
            className={cn(
              "relative",
              hasToolbar && "border-t border-white/8 dark:border-white/8",
              isTerminal && "border-white/8",
            )}
          >
            <CodeBlockContent
              lines={visibleLines}
              showLineNumbers={showLineNumbers}
              isTerminal={isTerminal}
              prompt={prompt}
              cursor={cursor}
              diff={diff}
            />

            {/* Soft fade-out gradient when collapsed — tells the user
                more code is hidden without rendering it. */}
            {collapsed ? (
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 h-16",
                  "bg-gradient-to-t from-[hsl(var(--viv-surface)/0.95)] via-[hsl(var(--viv-surface)/0.6)] to-transparent",
                  "dark:from-[hsl(240_14%_8%/0.98)] dark:via-[hsl(240_14%_8%/0.6)]",
                  isTerminal && "from-[hsl(225_22%_7%/0.98)] via-[hsl(225_22%_7%/0.6)]",
                )}
              />
            ) : null}
          </div>

          {expandable && lines.length > maxLines ? (
            <CodeBlockExpandToggle
              expanded={expanded}
              onToggle={() => setExpanded((v) => !v)}
              hiddenCount={lines.length - maxLines}
            />
          ) : null}
        </div>
      </div>
    );
  },
);
CodeBlockRoot.displayName = "CodeBlock";

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                    */
/* -------------------------------------------------------------------------- */

interface CodeBlockToolbarProps {
  variant: CodeBlockProps["variant"];
  filename?: string;
  language: SupportedLanguage;
  isTerminal: boolean;
  showWindowControls: boolean;
  copyable: boolean;
  copyText: string;
  trailing?: React.ReactNode;
}

function CodeBlockToolbar({
  variant,
  filename,
  language,
  isTerminal,
  showWindowControls,
  copyable,
  copyText,
  trailing,
}: CodeBlockToolbarProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2",
        "text-foreground/60",
        // Terminals use a darker bar so the body reads as the "screen".
        isTerminal && "bg-[hsl(225_22%_5%/0.6)] text-white/60",
      )}
    >
      {showWindowControls ? <WindowControls /> : null}
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        {filename ? (
          <span
            className={cn(
              "max-w-[60%] truncate text-[12px] font-medium",
              "text-foreground/70",
              isTerminal && "text-white/70",
            )}
          >
            {filename}
          </span>
        ) : isTerminal ? (
          <span className="text-[12px] font-medium text-white/55">
            ~/projects · {language}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {trailing}
        {!filename && !isTerminal && variant !== "ghost" ? (
          <LanguageBadge language={language} />
        ) : null}
        {copyable ? <CopyButton text={copyText} /> : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Content                                    */
/* -------------------------------------------------------------------------- */

interface CodeBlockContentProps {
  lines: RenderedLine[];
  showLineNumbers: boolean;
  isTerminal: boolean;
  prompt: string;
  cursor: boolean;
  diff: boolean;
}

function CodeBlockContent({
  lines,
  showLineNumbers,
  isTerminal,
  prompt,
  cursor,
  diff,
}: CodeBlockContentProps): React.ReactElement {
  // Total number of digits in the largest line number — used to fix
  // the gutter width so single/double/triple-digit files don't reflow.
  const gutterWidth = String(lines.length).length;

  return (
    <pre
      className={cn(
        "relative overflow-x-auto text-[13px] leading-[var(--cb-line-height,1.75rem)]",
        "px-0 py-3",
      )}
      style={{ tabSize: 2 }}
    >
      <code className="grid">
        {lines.map((line, idx) => (
          <CodeLine
            key={idx}
            line={line}
            showLineNumbers={showLineNumbers}
            gutterWidth={gutterWidth}
            isTerminal={isTerminal}
            prompt={prompt}
            cursor={cursor && idx === lines.length - 1}
            diff={diff}
          />
        ))}
      </code>
    </pre>
  );
}

interface CodeLineProps {
  line: RenderedLine;
  showLineNumbers: boolean;
  gutterWidth: number;
  isTerminal: boolean;
  prompt: string;
  cursor: boolean;
  diff: boolean;
}

function CodeLine({
  line,
  showLineNumbers,
  gutterWidth,
  isTerminal,
  prompt,
  cursor,
  diff,
}: CodeLineProps): React.ReactElement {
  // Diff backgrounds — soft tints; the `+` / `-` markers sit in the gutter.
  const diffBg =
    line.diff === "add"
      ? "bg-[hsl(150_75%_45%/0.12)] dark:bg-[hsl(150_70%_40%/0.18)] [--cb-marker:hsl(150_75%_45%)]"
      : line.diff === "remove"
        ? "bg-[hsl(0_80%_60%/0.12)] dark:bg-[hsl(0_75%_55%/0.16)] [--cb-marker:hsl(0_80%_60%)]"
        : "";

  const diffMarker =
    line.diff === "add" ? "+" : line.diff === "remove" ? "-" : " ";

  return (
    <span
      data-line={line.number}
      data-diff={line.diff}
      data-highlight={line.highlight || undefined}
      className={cn(
        "relative flex min-h-[var(--cb-line-height,1.75rem)] items-center",
        // Active-line highlight — a brand-tinted band with a vertical edge.
        line.highlight &&
          "bg-[hsl(258_95%_70%/0.08)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-brand",
        diffBg,
      )}
    >
      {/* Gutter — line numbers and (optionally) diff markers. */}
      {(showLineNumbers || diff) && (
        <span
          aria-hidden="true"
          className={cn(
            "sticky left-0 z-10 flex shrink-0 select-none items-center gap-1",
            "pl-4 pr-3 text-[11px] tabular-nums",
            "text-foreground/35 dark:text-foreground/30",
            isTerminal && "text-white/35",
          )}
        >
          {diff ? (
            <span
              className="inline-block w-3 text-center font-bold"
              style={{ color: "var(--cb-marker, currentColor)" }}
            >
              {diffMarker}
            </span>
          ) : null}
          {showLineNumbers ? (
            <span
              className="inline-block text-right"
              style={{ minWidth: `${gutterWidth}ch` }}
            >
              {line.number}
            </span>
          ) : null}
        </span>
      )}

      {/* Terminal prompt — rendered before each line of a terminal block. */}
      {isTerminal && !showLineNumbers ? (
        <span
          aria-hidden="true"
          className="select-none pl-4 pr-3 text-[hsl(150_85%_72%)]"
        >
          {prompt}
        </span>
      ) : null}

      <span
        className={cn(
          "min-w-0 flex-1 whitespace-pre",
          !showLineNumbers && !isTerminal && !diff && "pl-4",
          "pr-4",
        )}
      >
        {line.tokens.map((tok, i) => (
          <span key={i} className={TOKEN_COLORS[tok.type]}>
            {tok.value}
          </span>
        ))}
        {/* AI typing caret — sits at the end of the last visible line. */}
        {cursor ? (
          <span
            aria-hidden="true"
            className={cn(
              "ml-0.5 inline-block align-middle",
              "h-[1.05em] w-[2px] -translate-y-[1px]",
              "bg-brand shadow-[0_0_8px_hsl(var(--viv-brand)/0.7)]",
              "animate-viv-caret-blink",
            )}
          />
        ) : null}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Expand toggle                                  */
/* -------------------------------------------------------------------------- */

interface CodeBlockExpandToggleProps {
  expanded: boolean;
  onToggle(): void;
  hiddenCount: number;
}

function CodeBlockExpandToggle({
  expanded,
  onToggle,
  hiddenCount,
}: CodeBlockExpandToggleProps): React.ReactElement {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "border-t border-white/8 dark:border-white/8",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 px-3",
          "text-[12px] font-medium text-foreground/70",
          "transition-colors duration-fast ease-viv-out",
          "hover:text-brand",
          "viv-focus-ring",
        )}
      >
        <span>
          {expanded ? "Show less" : `Show more (+${hiddenCount} lines)`}
        </span>
        <ChevronIcon open={expanded} />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Tabs                                       */
/* -------------------------------------------------------------------------- */

interface TabsContextValue {
  value: string;
  setValue(next: string): void;
  registerTab(value: string): void;
  tabValues: string[];
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error(
      "CodeBlock.Tab/.TabList/.Panel must be used inside <CodeBlock.Tabs>",
    );
  }
  return ctx;
}

export interface CodeBlockTabsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial tab value (uncontrolled mode). */
  defaultValue?: string;
  /** Controlled tab value. */
  value?: string;
  /** Called on tab change in either mode. */
  onValueChange?(value: string): void;
}

/**
 * Multi-tab container for showing the same idea in different languages
 * (React / TypeScript / CLI). The `<CodeBlock.Tabs>` itself is just a
 * frame + tab bar; each `<CodeBlock.Panel>` lazily renders its content
 * only when active.
 */
const CodeBlockTabs = React.forwardRef<HTMLDivElement, CodeBlockTabsProps>(
  (
    { defaultValue, value: valueProp, onValueChange, className, children, ...props },
    ref,
  ) => {
    const tabValuesRef = React.useRef<string[]>([]);
    const [internal, setInternal] = React.useState<string | undefined>(
      defaultValue,
    );
    const value = valueProp ?? internal ?? "";

    const setValue = React.useCallback(
      (next: string) => {
        if (valueProp === undefined) setInternal(next);
        onValueChange?.(next);
      },
      [valueProp, onValueChange],
    );

    const registerTab = React.useCallback((tabValue: string) => {
      if (!tabValuesRef.current.includes(tabValue)) {
        tabValuesRef.current = [...tabValuesRef.current, tabValue];
      }
    }, []);

    const ctxValue = React.useMemo<TabsContextValue>(
      () => ({
        value,
        setValue,
        registerTab,
        tabValues: tabValuesRef.current,
      }),
      [value, setValue, registerTab],
    );

    return (
      <TabsContext.Provider value={ctxValue}>
        <div
          ref={ref}
          data-vivui-tabs=""
          className={cn(
            "group/codeblock-tabs relative overflow-hidden isolate font-mono",
            "rounded-2xl border border-white/10",
            "bg-[hsl(var(--viv-surface)/0.65)] dark:bg-[hsl(240_14%_8%/0.85)]",
            "backdrop-blur-xl backdrop-saturate-150",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_10px_28px_-8px_rgba(0,0,0,0.18)]",
            "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_44px_-10px_rgba(0,0,0,0.55)]",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
CodeBlockTabs.displayName = "CodeBlock.Tabs";

const CodeBlockTabList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      "flex items-center gap-1 px-2 pt-2",
      "border-b border-white/8 dark:border-white/8",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
CodeBlockTabList.displayName = "CodeBlock.TabList";

export interface CodeBlockTabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
}

const CodeBlockTab = React.forwardRef<HTMLButtonElement, CodeBlockTabProps>(
  ({ value, icon, className, children, onClick, ...props }, ref) => {
    const { value: active, setValue, registerTab } = useTabs();

    React.useEffect(() => {
      registerTab(value);
    }, [registerTab, value]);

    const isActive = active === value;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        onClick={(e) => {
          setValue(value);
          onClick?.(e);
        }}
        className={cn(
          "relative inline-flex h-9 items-center gap-1.5 rounded-md px-3",
          "text-[12px] font-medium",
          "text-foreground/55 hover:text-foreground/85",
          "transition-colors duration-fast ease-viv-out",
          "viv-focus-ring",
          isActive && [
            "text-foreground",
            // Active underline — animates in via a focused brand bar.
            "after:absolute after:bottom-[-1px] after:left-2 after:right-2 after:h-[2px]",
            "after:bg-[linear-gradient(90deg,hsl(218_95%_60%),hsl(258_95%_70%),hsl(190_95%_60%))]",
            "after:rounded-full",
          ],
          className,
        )}
        {...props}
      >
        {icon ? (
          <span aria-hidden="true" className="inline-flex">
            {icon}
          </span>
        ) : null}
        {children}
      </button>
    );
  },
);
CodeBlockTab.displayName = "CodeBlock.Tab";

export interface CodeBlockPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Render the panel content even when inactive (default: false / lazy). */
  forceMount?: boolean;
}

const CodeBlockPanel = React.forwardRef<HTMLDivElement, CodeBlockPanelProps>(
  ({ value, forceMount, className, children, ...props }, ref) => {
    const { value: active } = useTabs();
    const isActive = active === value;
    if (!isActive && !forceMount) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        hidden={!isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "relative",
          // Strip the embedded code block's outer chrome so it sits
          // flush inside the tabs frame. The `[&>div]` targets the
          // CodeBlockRoot wrapper which would otherwise re-add a
          // border + radius.
          "[&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none [&>div]:bg-transparent",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CodeBlockPanel.displayName = "CodeBlock.Panel";

/* -------------------------------------------------------------------------- */
/*                              Live Preview                                   */
/* -------------------------------------------------------------------------- */

export interface CodeBlockLivePreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** `vertical` stacks preview above code; `horizontal` is split side-by-side. */
  orientation?: "vertical" | "horizontal";
}

/**
 * Split layout — a live preview pane stacked or side-by-side with a code
 * block. Use `<CodeBlock.Preview>` for the preview and `<CodeBlock>` for
 * the source. The wrapper provides the chrome.
 */
const CodeBlockLivePreview = React.forwardRef<
  HTMLDivElement,
  CodeBlockLivePreviewProps
>(({ orientation = "horizontal", className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group/livepreview relative overflow-hidden isolate",
      "rounded-2xl border border-white/10",
      "bg-[hsl(var(--viv-surface)/0.65)] dark:bg-[hsl(240_14%_8%/0.85)]",
      "backdrop-blur-xl backdrop-saturate-150",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_10px_28px_-8px_rgba(0,0,0,0.18)]",
      "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_18px_44px_-10px_rgba(0,0,0,0.55)]",
      "grid",
      orientation === "horizontal"
        ? "grid-cols-1 md:grid-cols-2 [&>*+*]:border-l-0 md:[&>*+*]:border-l md:[&>*+*]:border-t-0 [&>*+*]:border-t [&>*+*]:border-white/10"
        : "grid-cols-1 [&>*+*]:border-t [&>*+*]:border-white/10",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
CodeBlockLivePreview.displayName = "CodeBlock.LivePreview";

export interface CodeBlockPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional label rendered top-left of the preview pane. */
  label?: React.ReactNode;
}

/**
 * Preview pane — renders an arbitrary React subtree on a checker
 * background that signals "this is what users see". Pairs with a sibling
 * `<CodeBlock>` inside `<CodeBlock.LivePreview>`.
 */
const CodeBlockPreview = React.forwardRef<HTMLDivElement, CodeBlockPreviewProps>(
  ({ label = "Preview", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-[180px] items-center justify-center p-6",
        // Faint isometric grid that reads as "live canvas" rather than
        // "background". 24px squares in dark mode, lighter in light.
        "bg-[radial-gradient(circle_at_1px_1px,hsl(var(--viv-fg)/0.06)_1px,transparent_0)] bg-[size:24px_24px]",
        "dark:bg-[radial-gradient(circle_at_1px_1px,hsl(var(--viv-fg)/0.10)_1px,transparent_0)]",
        className,
      )}
      {...props}
    >
      {label ? (
        <span
          className={cn(
            "absolute left-3 top-3 z-10 inline-flex items-center gap-1.5",
            "rounded-md border border-white/10 bg-white/5 px-2 py-0.5",
            "text-[10px] font-semibold uppercase tracking-[0.06em] text-foreground/55",
          )}
        >
          <span className="size-1.5 rounded-full bg-success animate-viv-pulse-glow" />
          {label}
        </span>
      ) : null}
      <div className="relative z-0 flex w-full items-center justify-center">
        {children}
      </div>
    </div>
  ),
);
CodeBlockPreview.displayName = "CodeBlock.Preview";

/* -------------------------------------------------------------------------- */
/*                              Floating AI Answer                             */
/* -------------------------------------------------------------------------- */

export interface CodeBlockAIAnswerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The user's question / prompt rendered at the top of the card. */
  question?: React.ReactNode;
  /** AI assistant name (defaults to "VivUI Copilot"). */
  agentName?: string;
  /** Streaming state — drives the shimmer + thinking dots. */
  status?: "thinking" | "streaming" | "ready";
  /** Render an avatar instead of the default sparkle bubble. */
  avatar?: React.ReactNode;
}

/**
 * A "floating AI answer card" — the conversational pattern from VivUI
 * Copilot, v0, Raycast AI, etc. Wraps a question + an answer (typically
 * a `<CodeBlock variant="ai">`) in a frosted card with a soft brand
 * gradient halo and a status pill.
 */
const CodeBlockAIAnswer = React.forwardRef<HTMLDivElement, CodeBlockAIAnswerProps>(
  (
    {
      question,
      agentName = "VivUI Copilot",
      status = "ready",
      avatar,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-status={status}
      className={cn(
        "group/aianswer relative overflow-hidden isolate",
        "rounded-3xl border border-white/10",
        "bg-[hsl(var(--viv-surface)/0.55)] dark:bg-[hsl(240_14%_7%/0.78)]",
        "backdrop-blur-2xl backdrop-saturate-150",
        // Multi-stop ambient shadow — lavender + cyan + pink.
        "shadow-[0_0_0_1px_hsl(258_95%_70%/0.16),0_30px_60px_-20px_hsl(258_95%_65%/0.4),0_10px_30px_-10px_hsl(190_95%_60%/0.3)]",
        "dark:shadow-[0_0_0_1px_hsl(258_95%_70%/0.22),0_30px_60px_-20px_hsl(258_95%_65%/0.55),0_10px_30px_-10px_hsl(190_95%_60%/0.35)]",
        className,
      )}
      {...props}
    >
      {/* z-0 — soft animated gradient orb in the top-right. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-24 -top-24 z-0 size-72 rounded-full",
          "bg-[radial-gradient(circle,hsl(258_95%_70%/0.45)_0%,hsl(218_95%_60%/0.3)_30%,transparent_70%)]",
          "blur-2xl",
        )}
      />
      {/* z-0 — secondary cyan blob bottom-left. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-24 -left-16 z-0 size-72 rounded-full",
          "bg-[radial-gradient(circle,hsl(190_95%_60%/0.35)_0%,hsl(258_95%_70%/0.18)_40%,transparent_75%)]",
          "blur-2xl",
        )}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              "bg-[linear-gradient(135deg,hsl(218_95%_60%),hsl(258_95%_70%),hsl(190_95%_60%))]",
              "shadow-[0_0_18px_-4px_hsl(258_95%_70%/0.6)]",
              "text-white",
            )}
          >
            {avatar ?? <SparkIcon />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-foreground">
                {agentName}
              </span>
              <AIStatusPill status={status} />
            </div>
            {question ? (
              <p className="mt-1 text-sm text-muted-foreground">{question}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  ),
);
CodeBlockAIAnswer.displayName = "CodeBlock.AIAnswer";

function AIStatusPill({
  status,
}: {
  status: NonNullable<CodeBlockAIAnswerProps["status"]>;
}): React.ReactElement {
  const config = {
    thinking: {
      label: "Thinking",
      dot: "bg-warning animate-viv-pulse-glow",
      text: "text-warning",
      bg: "bg-warning/10 border-warning/25",
    },
    streaming: {
      label: "Streaming",
      dot: "bg-info animate-viv-pulse-glow",
      text: "text-info",
      bg: "bg-info/10 border-info/25",
    },
    ready: {
      label: "Ready",
      dot: "bg-success",
      text: "text-success",
      bg: "bg-success/10 border-success/25",
    },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-full border px-1.5",
        "text-[10px] font-semibold uppercase tracking-[0.06em]",
        config.bg,
        config.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

function SparkIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Markdown                                     */
/* -------------------------------------------------------------------------- */

export interface CodeBlockMarkdownProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Markdown style scaffold — applies VivUI's prose treatment to whatever
 * children you render inside (this isn't a Markdown *parser*; it just
 * styles native HTML / React children to match the system).
 *
 * Pair with `<CodeBlock variant="markdown">` for inline code blocks
 * inside the prose flow.
 */
const CodeBlockMarkdown = React.forwardRef<
  HTMLDivElement,
  CodeBlockMarkdownProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Prose-style typographic ramp tuned to VivUI's display font.
      "max-w-prose space-y-4 text-foreground",
      "[&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight",
      "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
      "[&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
      "[&_h4]:font-display [&_h4]:text-lg [&_h4]:font-semibold",
      "[&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground/85",
      "[&_a]:font-medium [&_a]:text-brand [&_a]:underline-offset-4 [&_a:hover]:underline",
      "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
      "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
      "[&_blockquote]:border-l-2 [&_blockquote]:border-brand/50 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
      "[&_strong]:font-semibold",
      // Inline `<code>` style — picks up the same look as the `<Code>` primitive.
      "[&_code:not(pre_code)]:rounded-md [&_code:not(pre_code)]:bg-surface-overlay",
      "[&_code:not(pre_code)]:px-[0.4em] [&_code:not(pre_code)]:py-[0.15em]",
      "[&_code:not(pre_code)]:text-[0.875em] [&_code:not(pre_code)]:font-mono",
      "[&_code:not(pre_code)]:border [&_code:not(pre_code)]:border-border/60",
      className,
    )}
    {...props}
  />
));
CodeBlockMarkdown.displayName = "CodeBlock.Markdown";

/* -------------------------------------------------------------------------- */
/*                          Compound assembly                                  */
/* -------------------------------------------------------------------------- */

type CodeBlockComponent = typeof CodeBlockRoot & {
  Tabs: typeof CodeBlockTabs;
  TabList: typeof CodeBlockTabList;
  Tab: typeof CodeBlockTab;
  Panel: typeof CodeBlockPanel;
  LivePreview: typeof CodeBlockLivePreview;
  Preview: typeof CodeBlockPreview;
  AIAnswer: typeof CodeBlockAIAnswer;
  Markdown: typeof CodeBlockMarkdown;
};

export const CodeBlock = CodeBlockRoot as CodeBlockComponent;
CodeBlock.Tabs = CodeBlockTabs;
CodeBlock.TabList = CodeBlockTabList;
CodeBlock.Tab = CodeBlockTab;
CodeBlock.Panel = CodeBlockPanel;
CodeBlock.LivePreview = CodeBlockLivePreview;
CodeBlock.Preview = CodeBlockPreview;
CodeBlock.AIAnswer = CodeBlockAIAnswer;
CodeBlock.Markdown = CodeBlockMarkdown;

// Flat re-exports for tree-shaking precision.
export {
  CodeBlockTabs,
  CodeBlockTabList,
  CodeBlockTab,
  CodeBlockPanel,
  CodeBlockLivePreview,
  CodeBlockPreview,
  CodeBlockAIAnswer,
  CodeBlockMarkdown,
};
