import { createTheme } from "@stitches/react";

import colors from "./common/colors.ts";
import fontSizes from "./common/font-sizes.ts";
import lineHeights from "./common/line-heights.ts";
import radii from "./common/radii.ts";
import sizes from "./common/sizes.ts";
import space from "./common/space.ts";

const themeColors = {
  banner: {
    backgroundColorInfo: "rgb(184, 234, 255)",
    textColorInfo: "rgb(1, 67, 97)",
  },
  body: {
    backgroundColorPrimary: "$colors$white",
    linkColorPrimary: "$colors$primary400",
    textColorPrimary: "$colors$black",
    textColorSecondary: "$colors$white",
  },
  box: {
    footerBackgroundColor: "$colors$gray100",
    paperBackgroundColor: "$colors$white",
    paperBorderColor: "$colors$gray200",
  },
  button: {
    errorBackgroundColor: "#ff0f0f",
  },
  container: {
    backgroundColor: "rgba(245, 246, 247, 1)",
  },
  footer: {
    backgroundColor: "$colors$black",
  },
};

const baseTheme = {
  borderWidths: radii,
  colors,
  fonts: {
    inter: "Inter, Helvetica, Arial, sans-serif",
  },
  fontSizes,
  lineHeights,
  radii,
  space,
  sizes,

  ...themeColors,
};

const base = baseTheme;

export { base };
