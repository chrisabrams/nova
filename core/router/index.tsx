import { ElementType } from "react";
import Presenter from "~/core/presenters/index.ts";
import ViewInterface from "~/core/presenters/view-interface.tsx";
import type { NovaRoute, NovaRouteOptions } from "./types.ts";

class NovaRouter {
  name: NovaRouteOptions["name"];
  routes: NovaRoute[] = [];

  constructor({ name, routes }: NovaRouteOptions) {
    this.name = name;

    if (routes?.length) {
      this.routes = routes;
    }
  }

  static create(name: string) {
    return new NovaRouter({ name });
  }

  render() {
    return (
      <>
        {this.routes.map(({ component, path }) => {
          // React Router or such
        })}
      </>
    );
  }

  route(path: string, Component: ElementType): void;
  route(path: string, viewInterface: ViewInterface): void;
  route(path: string, Arg: ElementType | ViewInterface): void {
    const Component = Arg instanceof ViewInterface ? Arg.render() : <Arg />;

    this.routes.push({ component: Component, path });
  }
}

export default NovaRouter;

export * from "./types.ts";
