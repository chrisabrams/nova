import Extension from "nova/extensions/v0.ts";
import { generateRoutes } from "./routes.ts";

const extension = Extension.create({
  desc: "Adds file-system driven page routes to a Nova application.",
  name: "nova-extension-pages",
  title: "Pages",
  version: "0.1.0",
})
  .extend("server", async ({ server }) => {
    const routes = await generateRoutes();

    server.router.addRoutes(routes);
  })
  .on("bundle", async ({ server }) => {
    const routes = await generateRoutes();

    server.router.replaceRoutes(routes);
  });

export default extension;
