import bootstrapExtensions from "nova/core/bootstrap/extensions.ts";
import { Command } from "cliffy/command/mod.ts";
import { NovaWebServer } from "nova/core/server/index.tsx";
import serveStatic from "nova/core/server/middleware/static.ts";

const command = new Command()
  .description("Start development server.")
  .action(action);

export default command;

async function action() {
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

  await bootstrapExtensions({ server });
  await server.start();
}
