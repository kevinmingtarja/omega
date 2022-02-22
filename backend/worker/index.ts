import * as express from "express";
import * as http from "http";
import * as pty from "node-pty";
import * as WebSocket from "ws";

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  const ptyProcess = pty.spawn("sh", [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.cwd(),
  });

  ptyProcess.on("data", (data) => ws.send(data));

  ws.on("message", (message: string) => {
    console.log("rcvd: %s", message);
    ptyProcess.write(message);
  });
});

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server!.address() as WebSocket.AddressInfo).port
    } :)`
  );
});
