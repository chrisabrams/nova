import { compile as compileMDX } from "@mdx-js/mdx";
import { expandGlob } from "std/fs/expand_glob.ts";
import { importer, readTextFile } from "nova/utils/import.ts";
import { tseval } from "nova/utils/eval.ts";
import type { NovaRoute } from "nova/core/router/types.ts";
import type { NovaViewDefinition } from "nova/ext/presenters/types.ts";
import type { GenerateRoutesOptions } from "./types.ts";

export async function generateRoutes({
  basePath = Deno.cwd(),
  dirs = ["pages"],
}: GenerateRoutesOptions = {}) {
  const globPath = `${basePath}/app/{${dirs.join(",")}}/**/[a-z[]*.{mdx,tsx}`;
  const routes: NovaRoute[] = [];

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

    let component: any;
    let config: any;

    if (file.path.endsWith(".mdx")) {
      try {
        // console.log("file.path", file.path);
        const mdxSource = await readTextFile(file.path);
        const compiled = await compileMDX(mdxSource, {
          // baseUrl: file.path,
          outputFormat: "program",
          remarkPlugins: [],
          // useDynamicImport: true,
        });
        console.log("compiled", compiled);
        const evaled = await tseval(file.path, compiled.value as string);

        component = evaled.default;
      } catch (e) {
        console.error("Error compiling MDX");
        console.error(e);
        console.error(e.message);
        component = null;
      }
    } else {
      const importedFile = await importer(file.path);
      component = importedFile.default;
      config = importedFile.config;
    }

    routes.push({
      // Component: component,
      config,
      Element: component,
      id: file.path,
      path,
      // view: {} as NovaViewDefinition,
    });
  }

  return routes;
}
