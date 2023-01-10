import { expandGlob } from "std/fs/expand_glob.ts";
import type { NovaRoute } from "nova/core/router/types.ts";
import type { NovaViewDefinition } from "nova/core/presenters/types.ts";

interface GenerateRoutesOptions {
  basePath?: string;
}

export async function generateRoutes({
  basePath = Deno.cwd(),
}: GenerateRoutesOptions = {}) {
  const globPath = `${basePath}/app/pages/**/[a-z[]*.tsx`;
  const routes: NovaRoute[] = [];

  for await (const file of expandGlob(globPath)) {
    let path = file.path
      .replace(/\/app\/pages|index|\.tsx$/g, "")
      .replace(/\[\.{3}.+\]/, "*")
      .replace(/\[(.+)\]/, ":$1")
      .replace(basePath, "");

    // TODO: Figure out why above reg exps don't account for this
    if (path.length > 1 && path.endsWith("/")) {
      // path.slice(0, -1);
      path = path.replace(/\/$/, "");
    }

    const importedFile = await import(file.path);
    const component = importedFile.default;

    routes.push({
      Component: component,
      config: importedFile.config,
      Element: component,
      path,
      view: {} as NovaViewDefinition,
    });
  }

  return routes;
}
