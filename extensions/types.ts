import Router from "nova/core/router/index.tsx";
import WebServer from "nova/core/server/web-server.tsx";

export type NovaExtensionAction<T> = (
  props: T extends NovaExtensionActionType ? NovaExtensionActionProps : unknown
) => Promise<void> | void;

export type NovaExtensionActionList = NovaExtensionActionListItem[];

export interface NovaExtensionActionListItem {
  action: NovaExtensionAction<NovaExtensionActionType>;
  type: NovaExtensionActionType;
}

export type NovaExtensionActionType = "server";

export type NovaExtensionEvent<T> = (
  props: T extends NovaExtensionEventKind ? NovaExtensionActionProps : unknown
) => Promise<void> | void;

export type NovaExtensionEventKind = "bundle";

export type NovaExtensionEventList = NovaExtensionEventListItem[];

export interface NovaExtensionEventListItem {
  action: NovaExtensionAction<NovaExtensionActionType>;
  kind: NovaExtensionEventKind;
}

export interface NovaExtensionMetadata {
  desc: string;
  name: string;
  title: string;
  version: string;
}

export interface NovaExtensionActionProps {
  server: WebServer;
}
