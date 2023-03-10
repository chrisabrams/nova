import {
  describe,
  expect,
  it,
  paths,
  parseFromComponent,
  parseFromString,
} from "test/_.ts";
import { renderRoute } from "test/helpers/react.tsx";

import Presenter from "nova/ext/presenters/index.ts";
import Router from "nova/ext/presenters/router.tsx";
import ViewHelloData from "test/fixtures/test-app-1/app/pages/hello-data.tsx";
import ViewIndexPage from "test/fixtures/test-app-1/app/pages/index.tsx";
import ViewInterface from "nova/ext/presenters/view-interface.tsx";
import ViewModelHelloData from "test/fixtures/test-app-1/app/view-models/hello-data.ts";

describe("Router with Presenter", () => {
  it("should render a route from a presenter", () => {
    const router = Router.create("site");
    const presenter = Presenter.create("site");
    presenter.defineView("index", ViewIndexPage);
    router.setPresenter(presenter);

    router.route("/", "index");

    const doc = renderRoute(router, "/");
    const div = doc.querySelector("div")!;

    expect(div.textContent).to.equal("Hello world");
  });

  it("should get a route by path with index", () => {
    const router = Router.create("site");
    const presenter = Presenter.create("site");
    presenter.view("index", ViewIndexPage);
    router.setPresenter(presenter);

    router.route("/", "index");

    const route = router.getRoute("/");

    expect(route?.path).to.equal("/");
    expect(route?.Component.index).to.equal("index");
  });

  it("should render a route from a presenter with data", async () => {
    const router = Router.create("site");
    const presenter = Presenter.create("site");
    const view = presenter.view("index", ViewHelloData);
    view.viewModel(ViewModelHelloData);
    router.setPresenter(presenter);

    router.route("/", "index");

    await router.preloadView("index");

    const doc = renderRoute(router, "/");
    const div = doc.querySelector("div")!;

    expect(div.textContent).to.equal("Hello Dave");
  });
});
