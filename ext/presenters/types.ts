import { ComponentType } from "react";
import type { NovaRoute, NovaRouteOptions } from "nova/core/router/types.ts";
import type { NovaViewComponentType } from "nova/core/views/types.ts";
import NovaViewInterface from "./view-interface.tsx";
import NovaPresenter from "./index.ts";
import ViewModel from "nova/core/view-models/index.ts";

export interface NovaPresenterOptions {
  name: string;
}

export type NovaPresenterRoute = NovaRoute & {
  Component: NovaViewComponentType;
  view: NovaViewDefinition;
};

export interface NovaPresenterRouteOptions extends NovaRouteOptions {
  presenter?: NovaPresenter;
}

export interface NovaViewDefinition {
  Component: NovaViewComponentType;
  getProps?: () => any;
  interface: NovaViewInterface;
  name: string;
  viewModel?: ViewModel;
  // viewModelProps?: ReturnType<ViewModel["getProps"]>;
}

export type NovaViewInterfaceProps = any;
