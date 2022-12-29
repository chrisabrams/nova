import type { ReactNode } from "react";
import type { NovaViewConfig } from "../views/types.ts";
import Presenter from "~/core/presenters/index.ts";

export interface NovaRoute {
  config?: NovaViewConfig;
  component: ReactNode;
  path: string;
}

export interface NovaRouteOptions {
  name: string;
  presenter?: Presenter;
  routes?: NovaRoute[];
}
