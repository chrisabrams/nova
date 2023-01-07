import * as esbuild from "https://deno.land/x/esbuild@v0.16.10/mod.js";
import * as importMapPlugin from "esbuild-plugin-import-map";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import NovaConfig from "nova/core/config/index.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));

const importMapApp = await NovaConfig.getImportMap();

const defaultImportMapBrowser = {
  imports: {
    react: "https://esm.sh/react?dev",
    "react-dom": "https://esm.sh/react-dom?dev",
    "react-dom/client": "https://esm.sh/react-dom/client?dev",
    "react/jsx-runtime": "https://esm.sh/react/jsx-runtime",
    "react-router": "https://esm.sh/react-router@6.6.1?dev&external=react",
    "react-router-dom":
      "https://esm.sh/react-router-dom@6.6.1?dev&external=react,react-router",
  },
};

importMapPlugin.load([defaultImportMapBrowser, importMapApp]);

// TODO: Automatically resolve paths from the import map
const localPathModuleMap = {
  nova: join(__dirname, "..", "..", ".."),
};

function localPathPlugin(moduleMap: typeof localPathModuleMap) {
  return {
    name: "filterPathPlugin",
    setup(build: any) {
      for (const [key, val] of Object.entries(moduleMap)) {
        build.onResolve({ filter: new RegExp(`^${key}/`) }, (args: any) => {
          const absPath = join(
            val,
            args.path.replace(new RegExp(`^${key}/`), "")
          );
          // console.log("absPath", absPath);
          // console.log("args", args);
          return { path: absPath };
        });
      }
    },
  };
}

// Mark all paths starting with "http://" or "https://" as external
/*build.onResolve({ filter: /^https?:\/\// }, args => {
  return { path: args.path, external: true }
})*/

export default async function () {
  const cwd = Deno.cwd();
  // console.log("cwd", cwd);
  const output = await esbuild.build({
    absWorkingDir: cwd,
    alias: {
      "~": cwd,
    },
    bundle: true,
    // entryPoints: ["./app/client.tsx"],
    entryPoints: ["nova/core/app/bootstrap/client.tsx"],
    external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
    format: "esm",
    jsx: "automatic",
    outdir: "dist",
    plugins: [localPathPlugin(localPathModuleMap), importMapPlugin.plugin()],
    write: true,
  });

  /*const indexJs = new TextDecoder().decode(output.outputFiles[0].contents);

  return indexJs;*/
}
