import { ComponentType } from "react";
import { NovaViewComponentType } from "nova/core/views/types.ts";
import type { NovaViewInterfaceProps } from "./types.ts";
import NovaViewModel from "nova/core/view-models/index.ts";

// TODO: What is the correct default type for props?
class NovaViewInterface {
  Component: NovaViewComponentType;
  props: NovaViewInterfaceProps = {};
  viewModel?: NovaViewModel;

  constructor(Component: NovaViewComponentType, viewModel?: NovaViewModel) {
    this.Component = Component;
    this.viewModel = viewModel;
  }

  static create(Component: NovaViewComponentType, viewModel?: NovaViewModel) {
    return new NovaViewInterface(Component, viewModel);
  }

  render() {
    const Component = this.Component!;
    const props = this.viewModel?.props || {};

    return <Component {...props} />;
  }

  setViewModel(viewModel: NovaViewModel) {
    this.viewModel = viewModel;
  }
}

export default NovaViewInterface;
