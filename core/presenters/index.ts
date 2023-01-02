import { ComponentType, ReactNode } from "react";
import NovaViewInterface from "./view-interface.tsx";
import type {
  NovaPresenterOptions,
  NovaViewDefinition,
  NovaViewInterfaceProps,
} from "./types.ts";
import { getFromIndex } from "~/utils/object.ts";
import ViewModel from "~/core/view-models/index.ts";
import { NovaViewComponentType } from "~/core/views/types.ts";
import NovaViewModel from "../view-models/index.ts";

class NovaPresenter {
  name: NovaPresenterOptions["name"];
  views: Record<string, NovaViewDefinition> = {};

  constructor({ name }: NovaPresenterOptions) {
    this.name = name;
  }

  static create(name: string) {
    return new NovaPresenter({ name });
  }

  defineView(name: string, Component: NovaViewComponentType) {
    const viewInterface = new NovaViewInterface(Component);

    const view: NovaViewDefinition = (this.views[name] = {
      Component,
      name,
      interface: viewInterface,
    });

    /**
     * Once a view is defined, the following methods are available:
     */
    return {
      preloadProps: () => {
        return this.getViewProps(view);
      },
      viewModel: (viewModel: ViewModel) => {
        view.viewModel = viewModel;
        view.interface.setViewModel(viewModel);
      },
      viewModelProps: (
        viewModelProps: ReturnType<ViewModel["defineProps"]>
      ) => {
        view.viewModelProps = viewModelProps;
      },
    };
  }

  getView(name: keyof typeof this.views) {
    const view = getFromIndex(this.views, name);

    if (view) {
      return view;
    }

    return null;
  }

  getViewComponent(name: keyof typeof this.views) {
    return getFromIndex(this.views, name).Component;
  }

  async getViewProps(view: NovaViewDefinition): Promise<NovaViewInterfaceProps>;
  async getViewProps(
    name: keyof typeof this.views
  ): Promise<NovaViewInterfaceProps>;
  async getViewProps(Arg: NovaViewDefinition | keyof typeof this.views) {
    let view: NovaViewDefinition = Arg as NovaViewDefinition;

    if (typeof Arg === "string") {
      const v = this.getView(Arg);

      if (v) {
        view = v;
      }
    }

    const props = await view.viewModel?.getProps();

    return props;
  }

  implementView(
    Component: NovaViewComponentType,
    viewModel?: NovaViewModel
  ): ReactNode;
  implementView(
    name: keyof typeof this.views,
    viewModel?: NovaViewModel
  ): ReactNode;
  implementView(
    Arg: NovaViewComponentType | keyof typeof this.views,
    viewModel?: NovaViewModel
  ) {
    let Component: NovaViewComponentType = Arg as NovaViewComponentType;

    if (typeof Arg === "string") {
      const view = this.getView(Arg);

      if (view) {
        Component = view.Component;
      }
    }

    const viewInterface = new NovaViewInterface(Component, viewModel);

    return viewInterface.render();
  }

  /**
   * Prepares the view before it is presented. Responsible for fetching data
   * needed by the view.
   */
  async prepareView(
    view: NovaViewDefinition,
    _props: NovaViewInterfaceProps = {}
  ) {
    const props = await this.getViewProps(view);

    return {
      Component: view.Component,
      props: { ...props, ..._props },
    };
  }

  presentView(
    view: NovaViewDefinition,
    props?: NovaViewInterfaceProps
  ): ReactNode | null;
  presentView(
    name: keyof typeof this.views,
    props?: NovaViewInterfaceProps
  ): ReactNode | null;
  presentView(
    Arg: NovaViewDefinition | keyof typeof this.views,
    _props: NovaViewInterfaceProps = {}
  ) {
    let view: NovaViewDefinition | undefined;

    if (typeof Arg === "string") {
      const v = this.getView(Arg);

      if (v) {
        view = v;
      }
    } else {
      view = Arg;
    }

    if (view) {
      // const { Component, props } = await this.prepareView(view, _props);
      const { Component, viewModel } = view;

      return this.implementView(Component, viewModel);
    }

    return null;
  }

  /**
   * View method is an alias of defineView.
   *
   * @alias defineView
   */
  view(name: string, Component: NovaViewComponentType) {
    return this.defineView(name, Component);
  }
}

export default NovaPresenter;
