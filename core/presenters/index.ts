import { ComponentType, ReactNode } from "react";
import ViewInterface from "./view-interface.tsx";
import type { NovaPresenterOptions, NovaViewDefinition } from "./types.ts";
import { getFromIndex } from "~/utils/object.ts";

class NovaPresenter {
  name: NovaPresenterOptions["name"];
  views: Record<string, NovaViewDefinition> = {};

  constructor({ name }: NovaPresenterOptions) {
    this.name = name;
  }

  static create(name: string) {
    return new NovaPresenter({ name });
  }

  defineView(name: string, Component: ComponentType) {
    this.views[name] = {
      Component,
      name,
    };

    return this;
  }

  getView(name: keyof typeof this.views) {
    return getFromIndex(this.views, name);
  }

  getViewComponent(name: keyof typeof this.views) {
    return getFromIndex(this.views, name).Component;
  }

  present(Component: ComponentType, props = {}) {
    return new ViewInterface(Component, props);
  }

  presentView(name: keyof typeof this.views, props = {}) {
    const view = this.getView(name);

    if (view) {
      return this.present(view.Component, props);
    }

    return null;
  }
}

export default NovaPresenter;
