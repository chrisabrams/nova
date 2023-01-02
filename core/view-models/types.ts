import type { NovaViewInterfaceProps } from "../presenters/types.ts";

export type NovaViewModelHandler<T> =
  | ((props: NovaViewModelHandlerProps) => Promise<T>)
  | ((props: NovaViewModelHandlerProps) => T);

export interface NovaViewModelOptions {
  name: string;
  props: NovaViewInterfaceProps;
}

export interface NovaViewModelHandlerProps {
  ctx: any;
}

export type NovaViewModelProps = Record<string, any>;

/*
export interface NovaViewModelProps {
  props: Record<string, any>;
}
*/
