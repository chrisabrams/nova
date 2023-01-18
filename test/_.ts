import chaiJSDOM from "chai-jsdom";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "std/testing/bdd.ts";
import { expect, use } from "chai";
import { join } from "std/path/mod.ts";
import { JSDOM } from "jsdom";
import { ReactElement } from "react";
import { render, screen } from "testing-library";
import { renderToString } from "react-dom/server";
import { DOMParser, initParser } from "deno-dom/deno-dom-wasm-noinit.ts";

import NovaConfig from "nova/core/config/index.ts";

await initParser();

// Chai helpers
use(chaiJSDOM);

// Setup JSDOM
const html = `
<!DOCTYPE html>
<html>
<head></head>
<body></body>
</html>
`;

const j = new JSDOM(html, {
  url: "http://localhost",
  pretendToBeVisual: true,
});

// Port JSDOM objects
globalThis.document = j.window.document;
globalThis.HTMLIFrameElement = j.window.HTMLIFrameElement;

Object.getOwnPropertyNames(j.window)
  .filter((k) => !k.startsWith("_") && !(k in globalThis))
  // @ts-expect-error TypeScript does not enjoy certain indexes
  .forEach((k) => (globalThis[k] = j.window[k]));

// @ts-expect-error React 18+ let it know this is not a real browser
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * `screen` does not recognize `globalThis.document` :/
 *
 * @see https://github.com/denoland/fresh/issues/427#issuecomment-1250958598
 */

// Common paths used for testing
const fixtures = join(Deno.cwd(), "test", "fixtures");
const paths = {
  fixtures: {
    root: fixtures,
    apps: {
      testApp1: join(fixtures, "test-app-1"),
    },
  },
};

export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  join,
  paths,
  render,
  screen,
};

export function parseFromComponent(Component: ReactElement) {
  const html = renderToString(Component);

  return parseFromString(html);
}

export function parseFromString(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html")!;

  return doc;
}

/**
 * TODO: Where to initialize global before/after methods?
 */
beforeEach(() => {
  // Reset app config
  NovaConfig.setAppConfig(null);
});
