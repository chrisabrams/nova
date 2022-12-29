import { ComponentType, ReactNode } from "react";
import Presenter from "~/core/presenters/index.ts";
import ViewInterface from "~/core/presenters/view-interface.tsx";
import type { NovaRoute, NovaRouteOptions } from "./types.ts";
import { Route, Routes } from "react-router-dom";

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
   * Renders a list of routes conforming to what React Router DOM expects.
   * @returns
   */
  render() {
    return (
      <Routes>
        {this.routes.map(({ component, path }, i) => {
          const key = `${this.name}-${i}`;

          return <Route key={key} path={path} element={component} />;
        })}
      </Routes>
    );
  }

  route(path: string, Component: ComponentType): void;
  route(path: string, viewInterface: ViewInterface): void;
  route(path: string, presenterView: string): void;
  route(path: string, Arg: ComponentType | ViewInterface | string): void {
    let Component;

    if (this.presenter && typeof Arg === "string") {
      const View = this.presenter.getViewComponent(Arg);

      Component = <View />;
    } else {
      Component = Arg instanceof ViewInterface ? Arg.render() : <Arg />;
    }

    this.routes.push({ component: Component, path });
  }

  setPresenter(presenter: Presenter) {
    this.presenter = presenter;
  }
}

export default NovaRouter;

export * from "./types.ts";
