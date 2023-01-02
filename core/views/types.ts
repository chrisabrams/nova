import { ComponentType } from "react";
import NovaViewModel from "~/core/view-models/index.ts";

export interface NovaViewComponentType {
  (props: any): JSX.Element; // TODO: Fix this type
  index?: number;
}

export interface NovaViewConfig {
  id?: string;
}

/*
export type NovaViewProps = ReturnType<
  NovaViewModel["defineProps"]
>["getProps"];
*/
export type NovaViewProps<T> = Awaited<T>;
