import type { ElementType } from "react";
import type { NovaViewConfig } from "../views/types.ts";

export interface NovaRoute {
  config?: NovaViewConfig;
  component: ElementType;
  path: string;
}

export interface NovaRouteOptions {
  name: string;
  routes?: NovaRoute[];
}
