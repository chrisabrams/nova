import { debounce } from "std/async/debounce.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.16.10/mod.js";
import * as importMapPlugin from "esbuild-plugin-import-map";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import {
  generateEntrypointsFromRouteResourcePaths,
  extractResourceRoutePathsFromFilepaths,
} from "nova/ext/pages/routes.ts";
import { importer } from "nova/utils/import.ts";
import mdx from "@mdx-js/esbuild";
import { NovaMiddlewareProps } from "nova/core/server/types.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const cwd = Deno.cwd();
const root = join(__dirname, "..", "..", "..");

// const importMapApp = await NovaConfig.getImportMap();

const defaultImportMapBrowser = {
  imports: {
    "@stitches/react": "https://esm.sh/@stitches/react@1.2.8?external=react",
    react: "https://esm.sh/react@18.2.0?dev",
    "react-dom": "https://esm.sh/react-dom@18.2.0?dev&external=react",
    "react-dom/client":
      "https://esm.sh/react-dom@18.2.0/client?dev&external=react",
    "react/jsx-runtime":
      "https://esm.sh/react@18.2.0/jsx-runtime?external=react",
    "react/jsx-dev-runtime":
      "https://esm.sh/react@18.2.0/jsx-dev-runtime?external=react",
    "react-router-dom":
      "https://esm.sh/react-router-dom@6.6.1?dev&external=react",
  },
};

// importMapPlugin.load([defaultImportMapBrowser, importMapApp]);
importMapPlugin.load([defaultImportMapBrowser]);

// TODO: Automatically resolve paths from the import map
const localPathModuleMap = {
  "~": join(cwd),
  cky: join(root, "packages", "design-system"),
  $dist: join(cwd, "dist"), // TODO: Need to make this dynamic from config.
  nova: root,
};

function localPathPlugin(moduleMap: typeof localPathModuleMap) {
  return {
    name: "filterPathPlugin",
    setup(build: any) {
      for (const [key, val] of Object.entries(moduleMap)) {
        const k = key.replace("$", "\\$");
        const r = new RegExp(`^${k}/`);

        build.onResolve({ filter: r }, (args: any) => {
          try {
            const absPath = join(val, args.path.replace(r, ""));

            // console.log("absPath", absPath);
            // console.log("args", args);
            return { path: absPath };
          } catch (e) {
            console.error("Could not resolve local path:", args.path);
            console.error(e);

            return { path: args.path };
          }
        });
      }
    },
  };
}

// Mark all paths starting with "http://" or "https://" as external
/*build.onResolve({ filter: /^https?:\/\// }, args => {
  return { path: args.path, external: true }
})*/

export default async function ({
  ee,
}: Pick<NovaMiddlewareProps, "ee" | "router">) {
  const cwd = Deno.cwd();

  await Deno.remove(join(cwd, "dist"), { recursive: true }); // TODO: Make this dynamic from config

  const routeResourcePaths = await extractResourceRoutePathsFromFilepaths();

  const entryPoints = [
    "nova/core/app/bootstrap/client.tsx",
    ...(await generateEntrypointsFromRouteResourcePaths(routeResourcePaths)),
  ];
  // console.log("entryPoints", entryPoints);

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
    entryNames: "routes/[name]-[hash]",
    entryPoints,
    external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
    format: "esm",
    incremental: true,
    jsx: "automatic",
    jsxDev: true,
    metafile: true,
    outdir: "dist",
    plugins: [
      localPathPlugin(localPathModuleMap),
      importMapPlugin.plugin(),
      mdx({ allowDangerousRemoteMdx: true }),
    ],
    watch: true,
    write: true,
  });

  const generateEntrypointsFile = async () => {
    const outputPaths: string[] = [];
    let i = 0;

    for (const [key, val] of Object.entries(es.metafile.outputs)) {
      // Skip the client file
      if (i) {
        // outputPaths.push(key.replace("dist/", "$dist/"));
        outputPaths.push(key.replace("dist/", "/dist/"));
      }

      i++;
    }

    const rrp = routeResourcePaths.map(({ routepath }, i) => ({
      localpath: outputPaths[i],
      routepath,
    }));

    await Deno.writeTextFile(
      join(localPathModuleMap.$dist, "entrypoints.js"),
      `
window.nova = {
  routeResourcePaths: ${JSON.stringify(rrp)}
};
`
    );
  };

  const generateMetafile = async () => {
    await Deno.writeTextFile(
      join(localPathModuleMap.$dist, "meta.json"),
      JSON.stringify(es.metafile)
    );
  };

  await generateEntrypointsFile();
  await generateMetafile();

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
    await generateEntrypointsFile();
    await generateMetafile();
    const t1 = performance.now();

    console.log(`Bundle rebuilt in ${t1 - t0}ms.`);

    ee.emit("bundled");
  }, 25);

  ee.on("bundle", onBundle);
}
