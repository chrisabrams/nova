import type { NovaSocketServerOptions } from "./types.ts";
import { WebSocketClient, WebSocketServer } from "websocket/mod.ts";

class NovaSocketServer {
  public port = 8001;
  public wss: WebSocketServer;

  constructor({ port }: NovaSocketServerOptions) {
    if (port) {
      this.port = port;
    }

    this.wss = new WebSocketServer(this.port);

    this.initialize();
  }

  broadcastAll(message: any) {
    this.wss.clients.forEach((ws: WebSocketClient) => {
      ws.send(JSON.stringify(message));
    });
  }

  initialize() {
    this.wss.on("connection", (ws: WebSocketClient) => {
      // console.log("ws on connection");
      ws.on("message", (message: string) => {
        // console.log("ws on message", message);
      });
    });
  }
}

export default NovaSocketServer;
