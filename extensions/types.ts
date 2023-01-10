import Router from "nova/core/router/index.tsx";
import WebServer from "nova/core/server/web-server.tsx";

export type NovaExtensionAction<T> = (
  props: T extends NovaExtensionActionType ? NovaExtensionActionServer : unknown
) => Promise<void> | void;

export type NovaExtensionActionList = NovaExtensionActionListItem[];

export interface NovaExtensionActionListItem {
  action: NovaExtensionAction<NovaExtensionActionType>;
  type: NovaExtensionActionType;
}

export type NovaExtensionActionType = "server";

export interface NovaExtensionMetadata {
  desc: string;
  name: string;
  title: string;
  version: string;
}

export interface NovaExtensionActionServer {
  server: WebServer;
}
