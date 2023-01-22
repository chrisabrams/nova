import { EventEmitter } from "std/node/events.ts";
import NovaRouter from "nova/core/router/index.tsx";
import NovaSocketServer from "./socket-server.ts";

export type NovaMiddleware = (
  middlewareProps: NovaMiddlewareProps
) => Promise<Response | void> | Response | void;

export interface NovaMiddlewareProps {
  data: Record<string, unknown>;
  ee: EventEmitter;
  req: Request;
  router: NovaRouter;
  wss?: NovaSocketServer;
}

export interface NovaSocketServerOptions {
  port?: number;
}

export interface NovaWebServerOptions {
  dev?: boolean;
  port?: number;
  router?: NovaRouter;
}
