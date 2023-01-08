import { NovaMiddlewareProps } from "nova/core/server/types.ts";

function liveReload() {
  return ({ req }: NovaMiddlewareProps) => {
    const url = new URL(req.url);

    if (url.pathname === "/esbuild") {
      /**
       * Below is code that is meant to manage server-sent events
       * however there is an error that is not surfacing :/
       */
      // console.log("hit the juice");
      /*
      // @ts-expect-error Making new method
      req.write = (data) => {
        // @ts-expect-error Where is this type?
        req.w.write(new TextEncoder().encode(data));
        // @ts-expect-error Where is this type?
        req.w.flush();
      };

      // @ts-expect-error From new method
      req.write(
        "HTTP/1.1 200 OK\r\nConnection: keep-alive\r\nCache-Control: no-cache\r\nContent-Type: text/event-stream\r\n\r\n"
      );

      clients.push(req);
      */
      /*
      const msg = "data: update\n\n";
      let timerId: number | undefined;
      const body = new ReadableStream({
        start(controller) {
          timerId = setInterval(() => {
            console.log("enqueue");
            controller.enqueue(msg);
          }, 1000);
        },
        cancel() {
          if (typeof timerId === "number") {
            clearInterval(timerId);
          }
        },
      });

      const res = new Response(body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "cache-control": "no-cache",
          "content-type": "text/event-stream",
          Connection: "keep-alive",
        },
        status: 200,
      });

      clients.push(res);

      return res;
      */
      /*
      const res = new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "cache-control": "no-cache",
          "content-type": "text/event-stream",
          Connection: "keep-alive",
        },
        status: 200,
      });

      clients.push(res);

      return res;
      */
    }
  };
}

export default liveReload;
