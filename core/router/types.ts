import type { ElementType } from "react";
import type { NovaViewConfig } from "../views/types.ts";

export interface NovaRoute {
  config?: NovaViewConfig;
  component: JSX.Element | ElementType; // TODO: Come back and double check this
  path: string;
}

export interface NovaRouteOptions {
  name: string;
  routes?: NovaRoute[];
}
