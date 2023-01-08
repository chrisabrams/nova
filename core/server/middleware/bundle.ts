import bundle from "nova/core/app/bundle/index.ts";
import { NovaMiddlewareProps } from "nova/core/server/types.ts";

function bundleMiddleware() {
  return async ({ ee, wss }: NovaMiddlewareProps) => {
    await bundle({ ee, wss });
  };
}

export default bundleMiddleware;
