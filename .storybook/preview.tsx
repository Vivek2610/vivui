import * as React from "react";
import type { Preview } from "@storybook/react";
import { DocsContainer } from "@storybook/blocks";
import type { DocsContainerProps } from "@storybook/blocks";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "../src/styles/globals.css";
import "./storybook.css";
import { docsThemeFor } from "./viv-themes";

function readActiveTheme(context: DocsContainerProps["context"]): string {
  return (
    (context.globals?.theme as string | undefined) ??
    (typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme")
      : null) ??
    "dark"
  );
}

/** DocsContainer is not a decorator — use context + data-theme, not preview hooks. */
function VivDocsContainer({ children, context }: DocsContainerProps) {
  const [themeName, setThemeName] = React.useState(() => readActiveTheme(context));

  React.useEffect(() => {
    setThemeName(readActiveTheme(context));

    const onThemeChange = () => setThemeName(readActiveTheme(context));
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [context.globals?.theme]);

  return (
    <DocsContainer context={context} theme={docsThemeFor(themeName)}>
      {children}
    </DocsContainer>
  );
}

function withVivUILayout(
  Story: React.ComponentType,
  context: { viewMode?: string },
) {
  if (context.viewMode === "docs") {
    return (
      <div className="inline-flex items-center justify-center font-sans text-foreground antialiased">
        <Story />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-8 font-sans text-foreground antialiased">
      <Story />
    </div>
  );
}

const preview: Preview = {
  // Tell Storybook the default global theme so context.globals.theme is
  // never undefined on first render — keeps VivDocsContainer in sync.
  initialGlobals: {
    theme: "dark",
  },
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "transparent",
      values: [
        { name: "transparent", value: "transparent" },
        { name: "viv-bg", value: "hsl(240 20% 99%)" },
        { name: "viv-dark", value: "hsl(240 14% 6%)" },
        {
          name: "gradient",
          value:
            "radial-gradient(at 0% 0%, hsl(258 95% 70% / 0.20), transparent 50%), radial-gradient(at 100% 100%, hsl(210 95% 65% / 0.20), transparent 50%), hsl(240 14% 6%)",
        },
      ],
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Design Tokens", "Theming", "Accessibility", "Motion"],
          "Primitives",
          "Layout",
          "Feedback",
          "Overlay",
          "Forms",
        ],
      },
    },
    docs: {
      toc: true,
      container: VivDocsContainer,
      story: {
        inline: true,
      },
      canvas: {
        layout: "centered",
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
    withVivUILayout,
  ],
};

export default preview;
