import { RouteObject } from "react-router-dom";
import type {
  NovaViewConfig,
  NovaViewComponentType,
} from "nova/core/views/types.ts";
import NovaViewInterface from "nova/ext/presenters/view-interface.tsx";

export type NovaRoute = RouteObject & {
  config?: NovaViewConfig;
  Element: NovaViewComponentType | NovaViewInterface;
  name?: string;
  path: string;
};

export interface NovaRouteOptions {
  name: string;
  routes?: NovaRoute[];
}
