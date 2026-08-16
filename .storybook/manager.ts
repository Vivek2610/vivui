import { addons } from "@storybook/manager-api";

import { vivDarkTheme } from "./viv-themes";

addons.setConfig({
  theme: vivDarkTheme,
  enableShortcuts: false,
  sidebar: {
    showRoots: true,
  },
});
