import { describe, expect, it, paths, render, screen } from "~/test/_.ts";
import Presenter from "~/core/presenters/index.ts";
import Router from "~/core/router/index.tsx";
import ViewIndexPage from "~/test/fixtures/src/views/index.tsx";
import ViewInterface from "~/core/presenters/view-interface.tsx";

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

  /*
  it("should render a route", () => {
    const router = Router.create("site");

    router.route("/", ViewIndexPage);

    const { asFragment, container, getByTestId } = render(
      <div>
        <div data-testid="yo">Hello world</div>
      </div>
    );

    console.log(container.querySelectorAll("*"));
  });
  */
});
