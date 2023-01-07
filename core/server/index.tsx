import { ComponentType } from "react";
import { deepmerge } from "deepmerge-ts";
import { serve } from "std/http/server.ts";
import {
  ReactDOMServerReadableStream,
  renderToReadableStream,
} from "react-dom/server";
import bundle from "nova/core/app/bundle/index.ts";
import { join } from "std/path/mod.ts";

class NovaWebServer {
  public appPath = join(Deno.cwd(), "app");
  public distDir = "dist";
  public distPath = join(Deno.cwd(), "dist");
  middleware: any[] = [];
  public port = 8000;

  async createStream() {
    const App = await this.getAppComponent();
    const stream = await renderToReadableStream(<App />, {
      bootstrapModules: [join(this.distDir, "client.js")],
    });

    return stream;
  }

  async getAppComponent(): Promise<ComponentType> {
    let appIndex;

    try {
      appIndex = join(this.appPath, "index.tsx");
      const { default: App } = await import(appIndex);

      return App;
    } catch (e) {
      console.error("Error loading app component at: ", appIndex);
      throw new Error(e);
    }
  }

  async handler(req: any) {
    let data: any = {};

    for (let i = 0, l = this.middleware.length; i < l; i++) {
      const m = this.middleware[i];
      const result: Response | undefined = await m(req, data);

      if (result && result.status != 418) {
        return result;
      }

      // data = deepmerge(data, result);
    }

    const stream = await this.createStream();

    return new Response(stream, {
      headers: { "content-type": "text/html" },
      status: 200,
    });
  }

  async start() {
    await bundle();

    console.log(
      `Nova webserver running. Access it at: http://localhost:${this.port}/`
    );

    await serve(this.handler.bind(this));
  }

  use(m: any) {
    this.middleware.push(m);
  }
}

export default NovaWebServer;
