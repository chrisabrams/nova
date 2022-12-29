import { ComponentType } from "react";

export interface NovaPresenterOptions {
  name: string;
}

export interface NovaViewDefinition {
  Component: ComponentType;
  name: string;
}
