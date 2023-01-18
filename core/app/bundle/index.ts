import { debounce } from "std/async/debounce.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.16.10/mod.js";
import * as importMapPlugin from "esbuild-plugin-import-map";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import mdx from "@mdx-js/esbuild";
import NovaConfig from "nova/core/config/index.ts";
import NovaSocketServer from "nova/core/server/socket-server.ts";
import { NovaMiddlewareProps } from "nova/core/server/types.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));

const importMapApp = await NovaConfig.getImportMap();

const defaultImportMapBrowser = {
  imports: {
    react: "https://esm.sh/react?dev",
    "react-dom": "https://esm.sh/react-dom?dev",
    "react-dom/client": "https://esm.sh/react-dom/client?dev",
    "react/jsx-runtime": "https://esm.sh/react/jsx-runtime",
    "react/jsx-dev-runtime": "https://esm.sh/react@18.2.0/jsx-dev-runtime",
    "react-router": "https://esm.sh/react-router@6.6.1?dev&external=react",
    "react-router-dom":
      "https://esm.sh/react-router-dom@6.6.1?dev&external=react,react-router",
    "websocket/": "https://deno.land/x/websocket@v0.1.4/",
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

export default async function ({ ee }: Pick<NovaMiddlewareProps, "ee">) {
  const cwd = Deno.cwd();
  // console.log("cwd", cwd);
  const es = await esbuild.build({
    absWorkingDir: cwd,
    alias: {
      "~": cwd,
    },
    banner: {
      // js: `console.log('banner loaded');(() => {const es = new EventSource("/esbuild"); es.onopen = () => {console.log('es on open')}; es.onerror = (e) => {console.error(e)}; es.onmessage = () => {console.log('es on message:', arguments); location.reload()}})();`,
      js: `
(() => {
  const ws = new WebSocket("ws://127.0.0.1:8001");

  ws.addEventListener("open", (event) => {
    // ws.send("Hello Server!");
  });

  // Listen for messages
  ws.addEventListener("message", (event) => {
    location.reload()
    console.log("Message from server ", event.data);
  });
})();
      `,
    },
    bundle: true,
    color: true,
    // drop: ['console', 'debugger'],
    entryPoints: ["nova/core/app/bootstrap/client.tsx"],
    external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
    format: "esm",
    incremental: true,
    jsx: "automatic",
    jsxDev: true,
    // metafile: true,
    outdir: "dist",
    plugins: [
      localPathPlugin(localPathModuleMap),
      importMapPlugin.plugin(),
      mdx({ allowDangerousRemoteMdx: true }),
    ],
    watch: true,
    write: true,
  });

  let lastRebuild = 0;

  // TODO: Why doesn't debounce work here?
  const onBundle = debounce(async () => {
    const currentRebuild = Date.now();

    if (currentRebuild - lastRebuild < 25) {
      return;
    }

    lastRebuild = currentRebuild;

    const t0 = performance.now();
    await es.rebuild();
    const t1 = performance.now();

    console.log(`Bundle rebuilt in ${t1 - t0}ms.`);

    ee.emit("bundled");
  }, 25);

  ee.on("bundle", onBundle);
}
