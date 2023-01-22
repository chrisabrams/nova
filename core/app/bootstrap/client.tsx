import { hydrateRoot } from "react-dom/client";
// This comes from the app; add a configuration option to change which file is loaded in the future.
import App from "~/app/index.tsx";
import { BrowserRouter } from "react-router-dom";
import NovaRouter from "nova/core/router/index.tsx";
import type { RouteResourcePath } from "nova/ext/pages/types.ts";

const router = NovaRouter.create("app");
// @ts-expect-error Ignore this window object.
const routes: RouteResourcePath[] = window["nova"]["routeResourcePaths"];

for (let i = 0, l = routes.length; i < l; i++) {
  const { localpath, routepath } = routes[i];
  // if (localpath.includes(".mdx")) continue;
  const module = await import(localpath);
  const { default: Component } = module;

  router.route(routepath, Component);
}

hydrateRoot(
  document,

  <App>
    <BrowserRouter>{router.render()}</BrowserRouter>
  </App>
);
