import { compile as compileMDX } from "@mdx-js/mdx";
import { expandGlob } from "std/fs/expand_glob.ts";
import { importer, readTextFile } from "nova/utils/import.ts";
import { join } from "std/path/mod.ts";
import { tseval } from "nova/utils/eval.ts";
import type { NovaRoute } from "nova/core/router/types.ts";
import type { NovaViewDefinition } from "nova/ext/presenters/types.ts";
import type { GenerateRoutesOptions, RouteResourcePath } from "./types.ts";

export async function extractResourceRoutePathsFromFilepaths({
  basePath = Deno.cwd(),
  dirs = ["pages"],
}: GenerateRoutesOptions = {}) {
  const globPath = `${basePath}/app/{${dirs.join(",")}}/**/[a-z[]*.{mdx,tsx}`;
  const routeResourcePaths: RouteResourcePath[] = [];

  for await (const file of expandGlob(globPath)) {
    let path = file.path
      // .replace(/\/app\/(pages)|index|\.(mdx|tsx)$/g, "")
      .replace(
        new RegExp(`\/app\/(${dirs.join("|")})|index|\.(mdx|tsx)$`, "g"),
        ""
      )
      .replace(/\[\.{3}.+\]/, "*")
      .replace(/\[(.+)\]/, ":$1")
      .replace(basePath, "");

    // TODO: Figure out why above reg exps don't account for this
    if (path.length > 1 && path.endsWith("/")) {
      // path.slice(0, -1);
      path = path.replace(/\/$/, "");
    }

    routeResourcePaths.push({
      filepath: file.path,
      localpath: file.path.endsWith(".mdx")
        ? file.path
            .replace(join(basePath, "app"), "$dist")
            .replace(/\.mdx$/, ".mdx.tsx")
        : file.path.replace(basePath, "~"),
      routepath: path,
    });
  }

  return routeResourcePaths;
}

export function extractResourceRoutePathsFromRoutes(routes: NovaRoute[] = []) {
  return routes.map((route) => ({
    filepath: route.id,
    routepath: route.path,
  }));
}

export async function generateEntrypointsFromRouteResourcePaths(
  routeResourcePaths: RouteResourcePath[] = []
) {
  const rrp = routeResourcePaths.length
    ? routeResourcePaths
    : await extractResourceRoutePathsFromFilepaths();
  const entrypoints = rrp.map(({ localpath }) => localpath);

  return entrypoints;
}

export async function generateRoutes({
  basePath = Deno.cwd(),
  dirs = ["pages"],
}: GenerateRoutesOptions = {}) {
  const routeResourcePaths = await extractResourceRoutePathsFromFilepaths({
    basePath,
    dirs,
  });
  const routes: NovaRoute[] = [];

  for (let i = 0, l = routeResourcePaths.length; i < l; i++) {
    const { filepath, routepath } = routeResourcePaths[i];

    let component: any;
    let config: any;

    if (filepath.endsWith(".mdx")) {
      try {
        // console.log("file.path", file.path);
        const mdxSource = await readTextFile(filepath);
        // console.log("mdxSource", mdxSource);
        const compiled = await compileMDX(mdxSource, {
          // baseUrl: file.path,
          outputFormat: "program",
          remarkPlugins: [],
          // useDynamicImport: true,
        });
        // console.log("compiled", compiled);
        const evaled = await tseval(filepath, compiled.value as string);

        component = evaled.default;
      } catch (e) {
        console.error("Error compiling MDX:", filepath);
        console.error(e);
        console.error(e.message);
        component = null;
      }
    } else {
      const importedFile = await importer(filepath);
      component = importedFile.default;
      config = importedFile.config;
    }

    routes.push({
      // Component: component,
      config,
      Element: component,
      id: filepath,
      path: routepath,
      // view: {} as NovaViewDefinition,
    });
  }

  return routes;
}
