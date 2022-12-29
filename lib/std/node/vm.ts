import * as vm from "std/node/vm.ts";

// Deno does not have this defined, but is needed for JSDOM
const isContext = () => false;

export default {
  ...vm,
  isContext,
};
