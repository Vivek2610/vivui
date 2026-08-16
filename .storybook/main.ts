import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: [
    "../docs/**/*.mdx",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",   // controls, actions, viewport, backgrounds, docs
    "@storybook/addon-links",
    "@storybook/addon-interactions", // play() functions for interaction tests
    "@storybook/addon-a11y",         // accessibility audit panel
    "@storybook/addon-themes",       // dark/light theme switcher in toolbar
  ],
  docs: {
    autodocs: "tag",                 // any story tagged 'autodocs' gets a docs page
    defaultName: "Documentation",
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
};

export default config;
