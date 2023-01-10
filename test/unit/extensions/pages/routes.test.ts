import { describe, expect, it, paths } from "~/test/_.ts";
import { generateRoutes } from "~/extensions/pages/routes.ts";

import ViewHelloDataPage from "~/test/fixtures/app/pages/hello-data.tsx";
import ViewIndexPage from "~/test/fixtures/app/pages/index.tsx";
import ViewPostPage from "~/test/fixtures/app/pages/posts/index.tsx";
import ViewPostsPage from "~/test/fixtures/app/pages/posts/[slug].tsx";
import ViewOtherPage from "~/test/fixtures/app/pages/other/[...what].tsx";

describe("Bootstrap Routes", () => {
  it("should not generate a list of routes - missing views folder", async () => {
    const routes = await generateRoutes();

    expect(routes.length).to.equal(0);
  });

  it("should generate a list of routes", async () => {
    const routes = await generateRoutes({ basePath: paths.fixtures });

    expect(routes.length).to.equal(5);

    const routesToCheck = [
      { component: ViewHelloDataPage, config: undefined, path: "/hello-data" },
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
