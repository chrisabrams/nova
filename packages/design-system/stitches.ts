import type * as Stitches from "@stitches/react";
import type { VariantProps } from "@stitches/react";
import { createStitches } from "@stitches/react";

import { base } from "./themes/index.ts";
import utils from "./utils/index.ts";

const {
  config,
  createTheme,
  css,
  globalCss,
  getCssText,
  keyframes,
  styled,
  theme,
} = createStitches({
  prefix: "cky",
  media: {
    mobile: "(min-width: 320px)",
    tablet: "(min-width: 768px)",
    desktop: "(min-width: 1200px)",
  },
  theme: base,
  utils,
});

export default styled;

export {
  config,
  createTheme,
  css,
  globalCss,
  getCssText,
  keyframes,
  theme,
  VariantProps,
};

export type CSS = Stitches.CSS<typeof config>;
