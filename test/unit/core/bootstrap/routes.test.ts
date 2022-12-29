import { describe, expect, it, paths } from "~/test/_.ts";
import { generateRoutes } from "~/core/bootstrap/routes.ts";

import ViewIndexPage from "~/test/fixtures/src/views/index.tsx";
import ViewPostPage from "~/test/fixtures/src/views/posts/index.tsx";
import ViewPostsPage from "~/test/fixtures/src/views/posts/[slug].tsx";
import ViewOtherPage from "~/test/fixtures/src/views/other/[...what].tsx";

describe("Bootstrap Routes", () => {
  it("should not generate a list of routes - missing views folder", async () => {
    const routes = await generateRoutes();

    expect(routes.length).to.equal(0);
  });

  it("should generate a list of routes", async () => {
    const routes = await generateRoutes({ basePath: paths.fixtures });

    expect(routes.length).to.equal(4);

    const routesToCheck = [
      { component: ViewIndexPage, config: { id: "homepage" }, path: "/" },
      { component: ViewOtherPage, config: undefined, path: "/other/*" },
      { component: ViewPostPage, config: { id: "post" }, path: "/posts/:slug" },
      { component: ViewPostsPage, config: { id: "posts" }, path: "/posts" },
    ];

    for (let i = 0, l = routes.length; i < l; i++) {
      const route = routes[i];
      const routeToCheck = routesToCheck[i];

      /* TODO: Figure out proper way to check
      expect(route.component.toString()).to.eql(
        routeToCheck.component.toString()
      );
      */
      expect(route.config).to.eql(routeToCheck.config);
      expect(route.path).to.equal(routeToCheck.path);
    }
  });
});
