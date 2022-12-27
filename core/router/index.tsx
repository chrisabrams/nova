import type { NovaRoute, NovaRouteOptions } from "./types.ts";

class NovaRouter {
  name: NovaRouteOptions["name"];
  routes: NovaRoute[] = [];

  constructor({ name, routes }: NovaRouteOptions) {
    this.name = name;

    if (routes && routes.length) {
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
}

export default NovaRouter;

export * from "./types.ts";
