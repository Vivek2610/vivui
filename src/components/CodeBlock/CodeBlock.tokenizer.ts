/**
 * VivUI — minimal syntax tokenizer.
 *
 * This module provides a zero-dependency tokenizer used by `<CodeBlock>`
 * to render premium syntax highlighting without dragging in PrismJS,
 * Shiki, or highlight.js. The grammar is intentionally lossy — we
 * highlight the patterns that read as "code" at a glance (keywords,
 * strings, comments, numbers, function calls, JSX tags, properties)
 * and leave the rest as plain `text` tokens.
 *
 * Supported languages:
 *   • js, ts, jsx, tsx, javascript, typescript
 *   • bash, shell, sh, zsh
 *   • css
 *   • html, xml
 *   • json
 *   • text / plain  (no highlighting)
 *
 * Token types map 1:1 to color slots in the renderer (see CodeBlock.tsx
 * `TOKEN_COLORS`). Adding a new type means adding a slot there too.
 */

/** Canonical token kinds. */
export type TokenType =
  | "keyword"
  | "boolean"
  | "null"
  | "string"
  | "template"
  | "regex"
  | "comment"
  | "number"
  | "operator"
  | "punctuation"
  | "function"
  | "class"
  | "constant"
  | "variable"
  | "property"
  | "tag"
  | "attribute"
  | "selector"
  | "rule"
  | "command"
  | "flag"
  | "path"
  | "text";

export interface Token {
  type: TokenType;
  value: string;
}

export type SupportedLanguage =
  | "js"
  | "javascript"
  | "ts"
  | "typescript"
  | "jsx"
  | "tsx"
  | "bash"
  | "shell"
  | "sh"
  | "zsh"
  | "css"
  | "html"
  | "xml"
  | "json"
  | "text"
  | "plain";

/**
 * Resolve a free-form language label into a canonical key the tokenizer
 * knows about. Unknown languages fall through to `text`.
 */
export function normalizeLanguage(lang?: string): SupportedLanguage {
  const l = (lang ?? "text").toLowerCase().trim();
  if (l === "js" || l === "javascript" || l === "mjs") return "javascript";
  if (l === "ts" || l === "typescript") return "typescript";
  if (l === "jsx") return "jsx";
  if (l === "tsx") return "tsx";
  if (l === "bash" || l === "shell" || l === "sh" || l === "zsh") return "bash";
  if (l === "css" || l === "scss" || l === "sass") return "css";
  if (l === "html" || l === "xml" || l === "svg") return "html";
  if (l === "json") return "json";
  return "text";
}

/* -------------------------------------------------------------------------- */
/*                              Pattern banks                                  */
/* -------------------------------------------------------------------------- */

/**
 * A pattern is `[regex, token-type]` or a function that returns one.
 * Regexes MUST be sticky-friendly — i.e. anchored with `^` because the
 * tokenizer only inspects the head of the remaining input. The first
 * matching pattern in the array wins.
 */
type Pattern = [RegExp, TokenType];

const JS_KEYWORDS = new Set([
  "abstract", "any", "as", "async", "await", "break", "case", "catch",
  "class", "const", "continue", "debugger", "declare", "default",
  "delete", "do", "else", "enum", "export", "extends", "finally", "for",
  "from", "function", "get", "if", "implements", "import", "in",
  "infer", "instanceof", "interface", "is", "keyof", "let", "namespace",
  "new", "of", "package", "private", "protected", "public", "readonly",
  "require", "return", "satisfies", "set", "static", "super", "switch",
  "this", "throw", "try", "type", "typeof", "var", "void", "while",
  "with", "yield",
]);

const JS_BOOLEANS = new Set(["true", "false"]);
const JS_NULLISH = new Set(["null", "undefined", "NaN", "Infinity"]);

/**
 * JS / TS / JSX / TSX patterns — order matters. Comments and strings
 * are scanned first so keywords inside them aren't picked up.
 */
const jsPatterns: Pattern[] = [
  // Comments first — block, then line.
  [/^\/\*[\s\S]*?\*\//, "comment"],
  [/^\/\/[^\n]*/, "comment"],
  // Template literals (no nested ${} parsing — close enough visually).
  [/^`(?:\\.|[^`\\])*`/, "template"],
  // Strings.
  [/^"(?:\\.|[^"\\])*"/, "string"],
  [/^'(?:\\.|[^'\\])*'/, "string"],
  // Regex (best-effort — only after operators / punctuation contexts;
  // we keep it simple by requiring an unescaped slash run).
  [/^\/(?![*/])(?:\\.|\[[^\]]*\]|[^/\\\n])+\/[gimsuyd]*/, "regex"],
  // Numbers (hex / bin / oct / float / int).
  [/^0[xX][0-9a-fA-F_]+n?/, "number"],
  [/^0[bB][01_]+n?/, "number"],
  [/^0[oO][0-7_]+n?/, "number"],
  [/^[0-9][0-9_]*\.?[0-9_]*(?:[eE][+-]?[0-9_]+)?n?/, "number"],
  // JSX tag opener — `<Tag` or `</Tag` (uppercase = component, else tag).
  [/^<\/?[A-Za-z][\w.-]*/, "tag"],
  // JSX attribute name followed by `=`.
  [/^[a-zA-Z_$][\w-]*(?==)/, "attribute"],
  // Identifiers — keyword vs function vs constant vs variable.
  [/^[A-Za-z_$][\w$]*/, "variable"],
  // Operators.
  [/^(?:===|!==|==|!=|<=|>=|=>|\+\+|--|\*\*|&&|\|\||\?\?|<<|>>|>>>|[+\-*/%&|^!~<>?=])/,
    "operator"],
  // Punctuation.
  [/^[{}()[\];,.:]/, "punctuation"],
  // Whitespace handled at the loop level.
];

const cssPatterns: Pattern[] = [
  [/^\/\*[\s\S]*?\*\//, "comment"],
  [/^"(?:\\.|[^"\\])*"/, "string"],
  [/^'(?:\\.|[^'\\])*'/, "string"],
  // @-rules
  [/^@[a-zA-Z-]+/, "keyword"],
  // Selectors (class, id, pseudo) — best-effort up to `{`.
  [/^[.#][\w-]+/, "selector"],
  [/^&[\w:-]*/, "selector"],
  [/^::?[\w-]+/, "selector"],
  // Property name followed by `:`.
  [/^[a-zA-Z-]+(?=\s*:)/, "property"],
  // Hex colors.
  [/^#[0-9a-fA-F]{3,8}\b/, "constant"],
  // Numbers + units.
  [/^-?\d+\.?\d*(?:px|rem|em|%|vh|vw|s|ms|deg|turn|fr)?/, "number"],
  [/^[A-Za-z_-][\w-]*/, "variable"],
  [/^[{}();,]/, "punctuation"],
  [/^[:>+~*]/, "operator"],
];

const htmlPatterns: Pattern[] = [
  [/^<!--[\s\S]*?-->/, "comment"],
  [/^<!DOCTYPE[^>]*>/i, "keyword"],
  [/^<\/?[A-Za-z][\w-]*/, "tag"],
  [/^"(?:\\.|[^"\\])*"/, "string"],
  [/^'(?:\\.|[^'\\])*'/, "string"],
  [/^[a-zA-Z_:][\w-:]*(?==)/, "attribute"],
  [/^=/, "operator"],
  [/^\/?>/, "tag"],
  [/^[{},;]/, "punctuation"],
  [/^[^<>"\s][^<>"=\s]*/, "text"],
];

const jsonPatterns: Pattern[] = [
  [/^"(?:\\.|[^"\\])*"(?=\s*:)/, "property"],
  [/^"(?:\\.|[^"\\])*"/, "string"],
  [/^-?\d+\.?\d*(?:[eE][+-]?\d+)?/, "number"],
  [/^(?:true|false)\b/, "boolean"],
  [/^null\b/, "null"],
  [/^[{}[\]:,]/, "punctuation"],
];

const bashPatterns: Pattern[] = [
  [/^#[^\n]*/, "comment"],
  [/^"(?:\\.|[^"\\])*"/, "string"],
  [/^'(?:\\.|[^'\\])*'/, "string"],
  // Variables `$FOO`, `${FOO}`.
  [/^\$\{[^}]+\}/, "variable"],
  [/^\$[A-Za-z_][\w]*/, "variable"],
  // Long flags `--foo` and short flags `-f`.
  [/^--?[A-Za-z][\w-]*/, "flag"],
  // Pipes / redirects.
  [/^(?:&&|\|\||>>|<<|[|&;<>])/, "operator"],
  // Paths (heuristic: starts with / or ./ or ~/).
  [/^(?:\.{1,2}\/|~\/|\/)[\w./-]+/, "path"],
  // Numbers.
  [/^-?\d+/, "number"],
  // Words — first word on a line is the command.
  [/^[A-Za-z_][\w-]*/, "variable"],
  [/^[(){}[\],]/, "punctuation"],
];

/* -------------------------------------------------------------------------- */
/*                              Tokenizer core                                 */
/* -------------------------------------------------------------------------- */

/**
 * Run the appropriate pattern bank against the input and emit a flat
 * array of tokens. Whitespace is preserved verbatim as `text` tokens
 * so the renderer can faithfully reconstruct the original source
 * (including significant indentation).
 */
export function tokenize(
  source: string,
  language: SupportedLanguage,
): Token[] {
  if (language === "text" || language === "plain") {
    return [{ type: "text", value: source }];
  }

  const patterns = pickPatterns(language);
  const tokens: Token[] = [];
  let i = 0;
  let isFirstCommandWord = language === "bash";

  while (i < source.length) {
    const ch = source[i]!;

    // Newlines reset the "first word on a line" tracking for bash.
    if (ch === "\n") {
      tokens.push({ type: "text", value: "\n" });
      i++;
      isFirstCommandWord = language === "bash";
      continue;
    }

    // Whitespace (other than newline) is preserved as a single `text` run.
    if (ch === " " || ch === "\t") {
      let j = i;
      while (j < source.length && (source[j] === " " || source[j] === "\t"))
        j++;
      tokens.push({ type: "text", value: source.slice(i, j) });
      i = j;
      continue;
    }

    let matched = false;
    for (const [regex, baseType] of patterns) {
      const m = source.slice(i).match(regex);
      if (!m || m.index !== 0) continue;

      let value = m[0];
      let type: TokenType = baseType;

      // Identifier post-processing — JS family promotes keywords / booleans
      // / functions / classes / constants. We do this here (rather than as
      // a dozen extra regexes) because identifying them requires lookahead
      // at the source we just consumed.
      if (
        baseType === "variable" &&
        (language === "javascript" ||
          language === "typescript" ||
          language === "jsx" ||
          language === "tsx")
      ) {
        if (JS_KEYWORDS.has(value)) type = "keyword";
        else if (JS_BOOLEANS.has(value)) type = "boolean";
        else if (JS_NULLISH.has(value)) type = "null";
        else if (/^[A-Z_][A-Z0-9_]*$/.test(value)) type = "constant";
        else if (/^[A-Z]/.test(value)) type = "class";
        else if (source[i + value.length] === "(") type = "function";
        else if (
          // Property after a `.` reads as a property access.
          tokens.length > 0 &&
          tokens[tokens.length - 1]!.type === "punctuation" &&
          tokens[tokens.length - 1]!.value === "."
        ) {
          type = source[i + value.length] === "(" ? "function" : "property";
        }
      }

      // Bash: first word on a line is the command, subsequent words are args.
      if (language === "bash" && baseType === "variable") {
        if (isFirstCommandWord) {
          type = "command";
          isFirstCommandWord = false;
        } else {
          type = "text";
        }
      }

      tokens.push({ type, value });
      i += value.length;
      matched = true;
      break;
    }

    if (!matched) {
      // Unknown char — emit a single text token so we don't infinite-loop.
      tokens.push({ type: "text", value: ch });
      i++;
    }
  }

  return tokens;
}

function pickPatterns(language: SupportedLanguage): Pattern[] {
  switch (language) {
    case "javascript":
    case "typescript":
    case "jsx":
    case "tsx":
      return jsPatterns;
    case "css":
      return cssPatterns;
    case "html":
    case "xml":
      return htmlPatterns;
    case "json":
      return jsonPatterns;
    case "bash":
      return bashPatterns;
    default:
      return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Lines                                      */
/* -------------------------------------------------------------------------- */

/**
 * Group a flat token stream into per-line buckets. Newlines are
 * dropped — each line becomes its own array of tokens — so the
 * renderer can wrap each line in a `<span data-line>` for line numbers,
 * highlights, and diff backgrounds.
 */
export function tokensToLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    if (t.value === "\n") {
      lines.push([]);
      continue;
    }
    if (t.value.includes("\n")) {
      // Multi-line tokens (e.g. block comments, template literals) get
      // split so each line still gets the same color.
      const parts = t.value.split("\n");
      parts.forEach((part, idx) => {
        if (part.length > 0) {
          lines[lines.length - 1]!.push({ type: t.type, value: part });
        }
        if (idx < parts.length - 1) lines.push([]);
      });
      continue;
    }
    lines[lines.length - 1]!.push(t);
  }
  // Trim trailing empty line if the source ended with `\n`.
  if (lines.length > 1 && lines[lines.length - 1]!.length === 0) {
    lines.pop();
  }
  return lines;
}

/* -------------------------------------------------------------------------- */
/*                            Diff helpers                                     */
/* -------------------------------------------------------------------------- */

export type DiffLineKind = "add" | "remove" | "context";

export interface DiffLine {
  kind: DiffLineKind;
  /** Original line content, sans leading +/- marker. */
  content: string;
}

/**
 * Parse a unified-diff-style code string. Lines starting with `+` are
 * additions, `-` removals; everything else is context. The leading
 * marker is preserved on the rendered line (it's part of the visual
 * language of a diff) but stripped here for re-tokenization.
 *
 * Lines with `+++`, `---`, or `@@` headers are treated as context (we
 * don't render full git diff metadata in this lightweight viewer).
 */
export function parseDiff(source: string): DiffLine[] {
  return source.split("\n").map<DiffLine>((line) => {
    if (
      line.startsWith("+++") ||
      line.startsWith("---") ||
      line.startsWith("@@")
    ) {
      return { kind: "context", content: line };
    }
    if (line.startsWith("+")) return { kind: "add", content: line.slice(1) };
    if (line.startsWith("-")) return { kind: "remove", content: line.slice(1) };
    return { kind: "context", content: line };
  });
}
