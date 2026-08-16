import * as React from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** What the user has chosen ("system" allowed). */
  theme: ThemeMode;
  /** What's actually rendering right now ("light" | "dark"). */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme on first mount (used until storage / system is read). */
  defaultTheme?: ThemeMode;
  /** localStorage key. */
  storageKey?: string;
  /** When true, applies `data-theme` to <html>. Otherwise, applies it to a wrapper div. */
  attribute?: "html" | "wrapper";
  /** Disable reading/writing localStorage (useful for SSR-only contexts). */
  disableStorage?: boolean;
}

const MEDIA = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

/**
 * VivUI ThemeProvider — SSR-safe theme management.
 *
 * Strategy:
 *   1. On first render (server), we render with `defaultTheme`.
 *   2. On hydration, we read localStorage / system preference and update.
 *   3. To avoid a flash, ship `<VivUIScript />` into <head> in your Next.js
 *      root layout — it sets data-theme before React hydrates.
 *   4. Listens to OS-level theme changes when in "system" mode.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vivui-theme",
  attribute = "html",
  disableStorage = false,
}: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(() =>
    defaultTheme === "system" ? "light" : defaultTheme,
  );

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    if (disableStorage) return;
    try {
      const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        setThemeState(stored);
      }
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [storageKey, disableStorage]);

  // Apply DOM attribute + listen to system changes
  React.useEffect(() => {
    const applied = resolveTheme(theme);
    setResolvedTheme(applied);

    if (attribute === "html" && typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", applied);
      document.documentElement.style.colorScheme = applied;
    }

    if (theme !== "system") return;
    const media = window.matchMedia(MEDIA);
    const onChange = () => {
      const next: ResolvedTheme = media.matches ? "dark" : "light";
      setResolvedTheme(next);
      if (attribute === "html") {
        document.documentElement.setAttribute("data-theme", next);
        document.documentElement.style.colorScheme = next;
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, attribute]);

  const setTheme = React.useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      if (!disableStorage) {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          // ignore
        }
      }
    },
    [storageKey, disableStorage],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  if (attribute === "wrapper") {
    return (
      <ThemeContext.Provider value={value}>
        <div data-theme={resolvedTheme} style={{ colorScheme: resolvedTheme }}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be used inside <ThemeProvider />.");
  }
  return ctx;
}

/**
 * VivUIScript — drop into <head> (Next.js root layout) to apply
 * the persisted theme *before* React hydrates, eliminating FOUC.
 *
 * Example (Next.js app/layout.tsx):
 *   import { VivUIScript } from "@vivui/react";
 *   <head><VivUIScript /></head>
 */
export function VivUIScript({
  storageKey = "vivui-theme",
  defaultTheme = "system",
}: {
  storageKey?: string;
  defaultTheme?: ThemeMode;
} = {}): React.ReactElement {
  const code = `
(function(){try{
  var k='${storageKey}',d='${defaultTheme}',
      v=localStorage.getItem(k)||d,
      sys=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',
      r=v==='system'?sys:v;
  document.documentElement.setAttribute('data-theme',r);
  document.documentElement.style.colorScheme=r;
}catch(e){}})();
  `.trim();
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
