import { NovaWebServer } from "nova/core/server/index.tsx";
import serveStatic from "nova/core/server/middleware/static.ts";

const server = new NovaWebServer({ dev: true });

/*
server.use((req: any, data: any) => {
  if (req.url === "/favicon.ico") {
    return new Response(null, {
      status: 404,
    });
  }
});
*/

server.use(serveStatic("dist"));

await server.start();
