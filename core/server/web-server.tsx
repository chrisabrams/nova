import { EventEmitter } from "std/node/events.ts";
import { serve } from "std/http/server.ts";
import {
  ReactDOMServerReadableStream,
  renderToReadableStream,
} from "react-dom/server";
import bundle from "nova/core/app/bundle/index.ts";
import NovaSocketServer from "./socket-server.ts";
import { importer } from "nova/utils/import.ts";
import { join } from "std/path/mod.ts";
import type { NovaMiddleware, NovaWebServerOptions } from "./types.ts";
import liveReload from "./middleware/live-reload.ts";
import NovaRouter from "nova/core/router/index.tsx";
import { readTextFile } from "nova/utils/import.ts";
import { StaticRouter } from "react-router-dom/server";

class NovaWebServer {
  public appPath = join(Deno.cwd(), "app");
  public dev = false;
  public distDir = "dist";
  public distPath = join(Deno.cwd(), "dist");
  public ee: EventEmitter = new EventEmitter();
  private middleware: NovaMiddleware[] = [];
  public port = 8000;
  public router: NovaRouter;
  public wss?: NovaSocketServer;

  constructor({ dev, port, router }: NovaWebServerOptions) {
    if (typeof dev == "boolean") {
      this.dev = dev;
    }

    if (port) {
      this.port = port;
    }

    if (router) {
      this.router = router;
    } else {
      this.router = new NovaRouter({ name: "app" });
    }

    this.initialize();
  }

  async createStream(url: URL) {
    const App = await this.getAppComponent();
    const location = url.pathname;
    const meta = JSON.parse(
      await readTextFile(join(this.distDir, "meta.json"))
    );

    const bootstrapModules: string[] = ["dist/entrypoints.js"];
    for (const [key, value] of Object.entries(meta.outputs)) {
      bootstrapModules.push(key); // TODO: Make sure dist is toggeable in the future.

      break; // The first one is the client
    }

    const stream = await renderToReadableStream(
      <StaticRouter location={location}>
        <App>{this.router.render()}</App>
      </StaticRouter>,
      {
        // bootstrapModules: [join(this.distDir, "client.js")],
        bootstrapModules,
      }
    );

    return stream;
  }

  /**
   *
   * @see https://github.com/denoland/deno/issues/6946
   */
  async getAppComponent() {
    let appIndex;

    try {
      appIndex = join(this.appPath, "index.tsx");
      const { default: App } = await importer(appIndex);

      return App;
    } catch (e) {
      console.error("Error loading app component at: ", appIndex);
      throw new Error(e);
    }
  }

  async handler(req: Request) {
    let data: any = {};

    // Run middleware
    for (let i = 0, l = this.middleware.length; i < l; i++) {
      const m = this.middleware[i];
      const result = await m({
        data,
        ee: this.ee,
        req,
        router: this.router,
        wss: this.wss,
      });

      if (result && result.status != 418) {
        return result;
      }

      // data = deepmerge(data, result);
    }

    const stream = await this.createStream(new URL(req.url));

    return this.responseApp(stream);
  }

  initialize() {
    if (this.dev) {
      // await this.createStream();

      this.wss = new NovaSocketServer({ port: 8001 });
      bundle({ ee: this.ee, router: this.router });

      // this.use(bundle());
      // this.use(liveReload());

      this.ee.on("bundled", () => {
        // await this.createStream();

        this.wss?.broadcastAll({
          rebuild: true,
        });
      });

      this.watchChanges();
    }
  }

  responseApp(stream: ReactDOMServerReadableStream) {
    return new Response(stream, {
      headers: { "content-type": "text/html" },
      status: 200,
    });
  }

  async start() {
    console.log(`Nova webserver running:`);

    await serve(this.handler.bind(this));
  }

  use(m: NovaMiddleware) {
    this.middleware.push(m);
  }

  async watchChanges() {
    const notifiers = new Map<string, number>();
    const watcher = Deno.watchFs(Deno.cwd());

    for await (const event of watcher) {
      const dataString = JSON.stringify(event);

      // Is event duplicate? (Some OS's send duplicate events)
      if (notifiers.has(dataString)) {
        continue;
      }

      // Set event to be ignored for 25ms
      notifiers.set(
        dataString,
        setTimeout(() => {
          notifiers.delete(dataString);
        }, 25)
      );

      const path = event.paths[0];
      if (path.endsWith(".mdx.tsx") || path.includes("/dist")) {
        continue;
      }

      this.ee.emit("bundle");
    }
  }
}

export default NovaWebServer;
