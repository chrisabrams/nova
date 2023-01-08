import { ComponentType } from "react";
import { deepmerge } from "deepmerge-ts";
import { EventEmitter } from "std/node/events.ts";
import { serve } from "std/http/server.ts";
import {
  ReactDOMServerReadableStream,
  renderToReadableStream,
  renderToString,
} from "react-dom/server";
import bundle from "./middleware/bundle.ts";
import NovaSocketServer from "./socket-server.ts";
import { join } from "std/path/mod.ts";
import type { NovaMiddleware, NovaWebServerOptions } from "./types.ts";
import liveReload from "./middleware/live-reload.ts";

class NovaWebServer {
  public appPath = join(Deno.cwd(), "app");
  private clients: any[] = [];
  public dev = false;
  public distDir = "dist";
  public distPath = join(Deno.cwd(), "dist");
  private ee: EventEmitter = new EventEmitter();
  private middleware: NovaMiddleware[] = [];
  public port = 8000;
  public wss?: NovaSocketServer;

  constructor({ dev, port }: NovaWebServerOptions) {
    if (typeof dev == "boolean") {
      this.dev = dev;
    }

    if (port) {
      this.port = port;
    }

    this.initialize();
  }

  async createStream() {
    const App = await this.getAppComponent();

    const stream = await renderToReadableStream(<App />, {
      bootstrapModules: [join(this.distDir, "client.js")],
    });

    return stream;
  }

  /**
   *
   * @see https://github.com/denoland/deno/issues/6946
   */
  async getAppComponent(): Promise<ComponentType> {
    let appIndex;

    try {
      appIndex = join(this.appPath, "index.tsx");
      const { default: App } = await import(`${appIndex}#${Date.now()}`); // #Date.now() is a hack to force Deno to re-import the file

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
        wss: this.wss,
      });

      if (result && result.status != 418) {
        return result;
      }

      // data = deepmerge(data, result);
    }

    const stream = await this.createStream();

    return this.responseApp(stream);
  }

  async initialize() {
    if (this.dev) {
      await this.createStream();

      this.wss = new NovaSocketServer({ port: 8001 });

      this.use(bundle());
      this.use(liveReload());

      this.ee.on("bundle", async () => {
        await this.createStream();

        this.wss?.broadcastAll({
          rebuild: true,
        });
      });
    }
  }

  responseApp(stream: ReactDOMServerReadableStream) {
    return new Response(stream, {
      headers: { "content-type": "text/html" },
      status: 200,
    });
  }

  async start() {
    console.log(
      `Nova webserver running. Access it at: http://localhost:${this.port}/`
    );

    await serve(this.handler.bind(this));
  }

  use(m: NovaMiddleware) {
    this.middleware.push(m);
  }
}

export default NovaWebServer;
