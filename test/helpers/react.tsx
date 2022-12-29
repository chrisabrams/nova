import { StaticRouter } from "react-router-dom/server";

import { parseFromComponent } from "~/test/_.ts";
import Router from "~/core/router/index.tsx";

export function renderRoute(router: Router, path: string) {
  return parseFromComponent(
    <StaticRouter location={path}>{router.render()}</StaticRouter>
  );
}
