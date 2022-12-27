import { ElementType } from "react";
import ViewInterface from "./view-interface.tsx";
import type { NovaPresenterOptions, NovaViewDefinition } from "./types.ts";

class NovaPresenter {
  name: NovaPresenterOptions["name"];
  views: Record<string, NovaViewDefinition> = {};

  constructor({ name }: NovaPresenterOptions) {
    this.name = name;
  }

  static create(name: string) {
    return new NovaPresenter({ name });
  }

  defineView(name: string, Component: ElementType) {
    this.views[name] = {
      Component,
      name,
    };

    return this;
  }

  present(Component: ElementType, props = {}) {
    return new ViewInterface(Component, props);
  }
}

export default NovaPresenter;
