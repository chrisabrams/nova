import { describe, expect, it, paths } from "~/test/_.ts";
import Presenter from "~/core/presenters/index.ts";
import ViewIndexPage from "~/test/fixtures/src/views/index.tsx";

describe("Presenter", () => {
  it("should not create a presenter - missing constructor args", () => {
    try {
      // @ts-expect-error Constructor is missing args
      const presenter = new Presenter();
    } catch (e) {
      expect(e).to.throw;
    }
  });

  it("should initialize a presenter", () => {
    const presenter = new Presenter({ name: "test" });

    expect(presenter.name).to.equal("test");
  });

  it("should create a presenter", () => {
    const presenter = Presenter.create("test");

    expect(presenter.name).to.equal("test");
  });

  it("should define a view", () => {
    const presenter = new Presenter({ name: "test" });

    presenter.defineView("index", ViewIndexPage);
  });

  it("should get a view", () => {
    const presenter = new Presenter({ name: "test" });

    presenter.defineView("index", ViewIndexPage);

    const view = presenter.getView("index");

    expect(view?.name == "index");
  });
});
