import { basename, join } from "std/path/mod.ts";
import { contentType } from "std/media_types/mod.ts";
import { NovaMiddlewareProps } from "nova/core/server/types.ts";

// TODO: Support absolute paths for basePath in the future
function serveStatic(basePath: string) {
  return async ({ req }: NovaMiddlewareProps) => {
    const url = new URL(req.url);
    const r = new RegExp(`^/${basePath}`);

    // If the request path doesn't start with the base path, return
    if (!r.test(url.pathname)) {
      return;
    }

    const filePath = join(Deno.cwd(), url.pathname);
    const cwdWithSlash = join(Deno.cwd(), "/");
    const base = basename(filePath);
    const fileExt = base.split(".").pop()!;

    // Request path is the app root
    if (filePath == cwdWithSlash) {
      return new Response(null, { status: 418 }); // Why can't this be 100?
    }

    let fileSize;

    try {
      fileSize = (await Deno.stat(filePath)).size;
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return new Response(null, { status: 404 });
      }

      return new Response(null, { status: 500 });
    }

    const body = (await Deno.open(filePath)).readable;

    // const fileExt = filePath.split("/").pop()?.split(".").pop()!;

    return new Response(body, {
      headers: {
        "content-length": fileSize.toString(),
        "content-type": contentType(fileExt) || "text/plain",
      },
    });
  };
}

export default serveStatic;
