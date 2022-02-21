"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const pty = require("node-pty");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
    let ptyProcess = pty.spawn("bash", ["--login"], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
    });
    ptyProcess.on("data", (data) => ws.send(data));
    ws.on("message", (message) => {
        console.log("received: %s", message);
        ptyProcess.write(message);
        // if (m.input) {
        //   ptyProcess.write(message);
        // } else if (m.resize) {
        //   ptyProcess.resize(m.resize[0], m.resize[1]);
        // }
    });
});
//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
//# sourceMappingURL=index.js.map