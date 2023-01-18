import { ComponentType, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import Presenter from "nova/ext/presenters/index.ts";
import NovaViewInterface from "nova/ext/presenters/view-interface.tsx";
import { NovaViewDefinition } from "nova/ext/presenters/types.ts";
import { NovaViewComponentType } from "nova/core/views/types.ts";
import type { NovaPresenterRoute, NovaPresenterRouteOptions } from "./types.ts";
import NovaRouter from "nova/core/router/index.tsx";
import type { NovaRoute } from "nova/core/router/types.ts";

class NovaPresenterRouter extends NovaRouter {
  presenter?: Presenter = undefined;
  routes: NovaPresenterRoute[] = [];

  constructor({ name, presenter, routes }: NovaPresenterRouteOptions) {
    super({ name });

    if (presenter) {
      this.presenter = presenter;
    }
  }

  static create(name: string) {
    return new NovaPresenterRouter({ name });
  }

  getRoute(location: string) {
    const route = super.getRoute(location);

    if (route) {
      return route as NovaPresenterRoute;
    }

    return null;
  }

  async preloadView(presenterView: string) {
    if (!this.presenter) {
      throw new Error("No presenter defined for router.");
    }

    const view = this.presenter.getView(presenterView);

    if (!view) {
      throw new Error(`View "${presenterView}" not found.`);
    }

    const props = await view.viewModel?.loadProps();

    return props;
  }

  /**
   * Renders a list of routes conforming to what React Router DOM expects.
   * @returns
   */
  render() {
    return (
      <Routes>
        {this.routes.map(({ Element, path, view }, i) => {
          const key = `${this.name}-${i}`;

          let El: ReactNode;

          if (this.presenter && view) {
            El = this.presenter.presentView(view);
          } else if (Element instanceof NovaViewInterface) {
            El = Element.render();
          } else {
            El = <Element />;
          }

          return <Route key={key} element={El} path={path} />;
        })}
      </Routes>
    );
  }

  route(path: string, Component: ComponentType): void;
  route(path: string, viewInterface: NovaViewInterface): void;
  route(path: string, presenterView: string): void; // TODO: This should be a presenter view ID
  route(path: string, Arg: ComponentType | NovaViewInterface | string): void {
    let Component: NovaViewComponentType = () => <></>;
    let Element: NovaViewComponentType | NovaViewInterface =
      Arg as NovaViewComponentType;
    let name;
    let view: NovaViewDefinition = {} as NovaViewDefinition;

    if (this.presenter && typeof Arg === "string") {
      const v = this.presenter.getView(Arg);

      if (v) {
        const IndexedComponent: NovaViewComponentType = Object.assign(
          v.Component,
          { index: v.name }
        );
        Component = IndexedComponent;
        // const ViewComponent = view.Component;

        // Element = <IndexedElement />;
        Element = v.Component;
        name = v.name;
        view = v;
      }
    } else if (Arg instanceof NovaViewInterface) {
      // Element = Arg.render();
      Element = Arg;
    } else {
      Element = Arg as NovaViewComponentType;
      // Element = <Arg />;
    }

    this.routes.push({
      Component,
      Element,
      name,
      path,
      view,
    });
  }

  setPresenter(presenter: Presenter) {
    this.presenter = presenter;
  }
}

export default NovaPresenterRouter;

export * from "./types.ts";
