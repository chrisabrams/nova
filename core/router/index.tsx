import { ComponentType, ReactNode } from "react";
import { matchRoutes, Route, Routes } from "react-router-dom";
import NovaViewInterface from "nova/ext/presenters/view-interface.tsx";
import type { NovaViewDefinition } from "nova/ext/presenters/types.ts";
import type { NovaRoute, NovaRouteOptions } from "./types.ts";
import type { NovaViewComponentType } from "nova/core/views/types.ts";

class NovaRouter {
  name: NovaRouteOptions["name"];
  routes: NovaRoute[] = [];

  constructor({ name, routes }: NovaRouteOptions) {
    this.name = name;

    if (routes?.length) {
      this.routes = routes;
    }
  }

  addRoutes(routes: NovaRoute[]) {
    this.routes = [...this.routes, ...routes];
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

  /**
   * Renders a list of routes conforming to what React Router DOM expects.
   * @returns
   */
  render() {
    return (
      <Routes>
        {this.routes.map(({ Element, path }, i) => {
          const key = `${this.name}-${i}`;

          let El: ReactNode;

          if (Element instanceof NovaViewInterface) {
            El = Element.render();
          } else {
            El = <Element />;
          }

          return <Route key={key} element={El} path={path} />;
        })}
      </Routes>
    );
  }

  replaceRoute(route: NovaRoute) {
    for (let j = 0, k = this.routes.length; j < k; j++) {
      const existingRoute = this.routes[j];

      if (route.id === existingRoute.id) {
        this.routes[j] = route;
        break;
      }
    }
  }

  replaceRoutes(routes: NovaRoute[]) {
    for (let i = 0, l = routes.length; i < l; i++) {
      const route = routes[i];

      this.replaceRoute(route);
    }
  }

  route(path: string, Component: ComponentType): void;
  route(path: string, viewInterface: NovaViewInterface): void;
  route(path: string, presenterView: string): void; // TODO: This should be a presenter view ID
  route(path: string, Arg: ComponentType | NovaViewInterface | string): void {
    let Element: NovaViewComponentType | NovaViewInterface =
      Arg as NovaViewComponentType;
    let name;

    if (Arg instanceof NovaViewInterface) {
      // Element = Arg.render();
      Element = Arg;
    } else {
      Element = Arg as NovaViewComponentType;
      // Element = <Arg />;
    }

    this.routes.push({
      Element,
      name,
      path,
    });
  }
}

export default NovaRouter;

export * from "./types.ts";
