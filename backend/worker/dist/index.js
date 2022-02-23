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
    const ptyProcess = pty.spawn("sh", [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: "/usr/src/react-app",
    });
    ptyProcess.on("data", (data) => ws.send(data));
    ws.onopen = (event) => {
        ptyProcess.write("pwd");
    };
    ws.on("message", (message) => {
        console.log("rcvd: %s", message);
        if (message == "CONNECTED") {
            ptyProcess.write("npm install && npm start\r");
            ws.send("npm install && npm start\r");
        }
        else {
            console.log("else");
            ptyProcess.write(message);
        }
    });
});
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
//# sourceMappingURL=index.js.map