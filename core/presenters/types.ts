import { ComponentType } from "react";
import type { NovaViewComponentType } from "~/core/views/types.ts";
import NovaViewInterface from "./view-interface.tsx";
import ViewModel from "~/core/view-models/index.ts";

export interface NovaPresenterOptions {
  name: string;
}

export interface NovaViewDefinition {
  Component: NovaViewComponentType;
  getProps?: () => any;
  interface: NovaViewInterface;
  name: string;
  viewModel?: ViewModel;
  viewModelProps?: ReturnType<ViewModel["defineProps"]>;
}

export type NovaViewInterfaceProps = any;
