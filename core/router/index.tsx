import { ComponentType, ReactNode } from "react";
import { matchRoutes } from "react-router";
import { Route, Routes } from "react-router-dom";
import Presenter from "~/core/presenters/index.ts";
import NovaViewInterface from "~/core/presenters/view-interface.tsx";
import { NovaViewDefinition } from "../presenters/types.ts";
import { NovaViewComponentType } from "../views/types.ts";
import type { NovaRoute, NovaRouteOptions } from "./types.ts";

class NovaRouter {
  name: NovaRouteOptions["name"];
  presenter?: Presenter = undefined;
  routes: NovaRoute[] = [];

  constructor({ name, presenter, routes }: NovaRouteOptions) {
    this.name = name;

    if (presenter) {
      this.presenter = presenter;
    }

    if (routes?.length) {
      this.routes = routes;
    }
  }

  static create(name: string) {
    return new NovaRouter({ name });
  }

  /**
   * Get a route from the location.
   */
  getRoute(location: string) {
    const routes = matchRoutes(this.routes, location);

    if (routes) {
      const route = routes[0];

      return route.route;
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

    const props = await view.viewModel?.getProps();

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

export default NovaRouter;

export * from "./types.ts";
