import { create } from "@storybook/theming/create";
import type { ThemeVars } from "@storybook/theming";

const vivShared = {
  brandTitle: "VivUI",
  brandUrl: "https://vivui.dev",
  brandTarget: "_self",
  fontBase: '"Inter", system-ui, sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',
  colorPrimary: "hsl(258, 95%, 70%)",
  colorSecondary: "hsl(258, 95%, 70%)",
  appBorderRadius: 12,
  inputBorderRadius: 8,
} as const;

export const vivDarkTheme: ThemeVars = create({
  ...vivShared,
  base: "dark",
  appBg: "hsl(240, 14%, 6%)",
  appContentBg: "hsl(240, 14%, 6%)",
  appBorderColor: "hsl(240, 8%, 18%)",
  textColor: "hsl(240, 6%, 96%)",
  textInverseColor: "hsl(240, 14%, 6%)",
  textMutedColor: "hsl(240, 6%, 64%)",
  barTextColor: "hsl(240, 6%, 64%)",
  barSelectedColor: "hsl(258, 95%, 70%)",
  barHoverColor: "hsl(258, 95%, 70%)",
  barBg: "hsl(240, 12%, 9%)",
  inputBg: "hsl(240, 10%, 14%)",
  inputBorder: "hsl(240, 8%, 18%)",
  inputTextColor: "hsl(240, 6%, 96%)",
});

export const vivLightTheme: ThemeVars = create({
  ...vivShared,
  base: "light",
  appBg: "hsl(240, 20%, 99%)",
  appContentBg: "hsl(240, 20%, 99%)",
  appBorderColor: "hsl(240, 10%, 90%)",
  textColor: "hsl(240, 12%, 10%)",
  textInverseColor: "hsl(240, 20%, 99%)",
  textMutedColor: "hsl(240, 7%, 32%)",
  barTextColor: "hsl(240, 7%, 32%)",
  barSelectedColor: "hsl(252, 87%, 64%)",
  barHoverColor: "hsl(252, 87%, 64%)",
  barBg: "hsl(0, 0%, 100%)",
  inputBg: "hsl(0, 0%, 100%)",
  inputBorder: "hsl(240, 10%, 90%)",
  inputTextColor: "hsl(240, 12%, 10%)",
});

export function docsThemeFor(themeName?: string): ThemeVars {
  return themeName === "light" ? vivLightTheme : vivDarkTheme;
}
