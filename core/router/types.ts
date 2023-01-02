import { RouteObject } from "react-router-dom";
import type { ReactNode } from "react";
import type { NovaViewDefinition } from "../presenters/types.ts";
import type { NovaViewConfig, NovaViewComponentType } from "../views/types.ts";
import Presenter from "~/core/presenters/index.ts";
import NovaViewInterface from "../presenters/view-interface.tsx";

export type NovaRoute = RouteObject & {
  config?: NovaViewConfig;
  Component: NovaViewComponentType;
  Element: NovaViewComponentType | NovaViewInterface;
  name?: string;
  path: string;
  view: NovaViewDefinition;
};

export interface NovaRouteOptions {
  name: string;
  presenter?: Presenter;
  routes?: NovaRoute[];
}
