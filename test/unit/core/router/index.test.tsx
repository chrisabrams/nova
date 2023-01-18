import { describe, expect, it } from "test/_.ts";
import { renderRoute } from "test/helpers/react.tsx";

import Presenter from "nova/ext/presenters/index.ts";
import Router from "nova/core/router/index.tsx";
import ViewIndexPage from "test/fixtures/test-app-1/app/pages/index.tsx";
import ViewInterface from "nova/ext/presenters/view-interface.tsx";

describe("Router", () => {
  it("should not initialize router - missing constructor arguments", () => {
    try {
      // @ts-expect-error Constructor is missing args
      const router = new Router();
    } catch (e) {
      expect(e).to.throw;
    }
  });

  it("should initialize a router", () => {
    const router = new Router({ name: "site" });

    expect(router.name).to.equal("site");
  });

  it("should create a router", () => {
    const router = Router.create("site");

    expect(router.name).to.equal("site");
  });

  it("should create a route with a component", () => {
    const router = Router.create("site");

    router.route("/", ViewIndexPage);

    expect(router.routes.length).to.equal(1);
  });

  it("should create a route with a view interface", () => {
    const router = Router.create("site");
    const viewInterface = ViewInterface.create(ViewIndexPage);

    router.route("/", viewInterface);

    expect(router.routes.length).to.equal(1);
  });

  it("should create a route with a presenter", () => {
    const router = Router.create("site");
    const presenter = Presenter.create("site");
    presenter.defineView("index", ViewIndexPage);

    router.route("/", "index");

    expect(router.routes.length).to.equal(1);
  });

  it("should render a route from a component", () => {
    const router = Router.create("site");

    router.route("/", ViewIndexPage);

    const doc = renderRoute(router, "/");
    const div = doc.querySelector("div")!;

    expect(div.textContent).to.equal("Hello world");
  });

  it("should render a route from a view interface", () => {
    const router = Router.create("site");
    const viewInterface = ViewInterface.create(ViewIndexPage);

    router.route("/", viewInterface);

    const doc = renderRoute(router, "/");
    const div = doc.querySelector("div")!;

    expect(div.textContent).to.equal("Hello world");
  });

  it("should get a route by path", () => {
    const router = Router.create("site");

    router.route("/", ViewIndexPage);

    const route = router.getRoute("/");

    expect(route?.path).to.equal("/");
    expect(route?.index).to.be.undefined;
  });
});
