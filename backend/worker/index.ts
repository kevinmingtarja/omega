import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as pty from "node-pty";
import * as WebSocket from "ws";
import { streamToString, getAllFiles } from "./files";

const app = express();
app.use(cors());
app.use(bodyParser.text({ type: "*/*" })); // Needed to parse text body

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

app.get("/files", async (req: express.Request, res: express.Response) => {
  const files = getAllFiles("./", {});
  res.status(200).send(files);
});

app.get("/file", async (req: express.Request, res: express.Response) => {
  const fileName = req.query.file;
  console.log(fileName);

  const filePath = "/usr/src/react-app/" + fileName;
  const readStream = fs.createReadStream(filePath);

  const fileContents = await streamToString(readStream);

  res.status(200).send(fileContents);
});

app.post("/file", (req: express.Request, res: express.Response) => {
  const fileName = req.query.file;

  const filePath = "/usr/src/react-app/" + fileName;
  fs.writeFile(filePath, req.body, (err) => console.log(err));

  res.status(200).send();
});

wss.on("connection", (ws: WebSocket) => {
  const ptyProcess = pty.spawn("sh", [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: "/usr/src/react-app",
  });

  // Install dependencies and start the app
  ptyProcess.write("npm install && npm start\r");

  // Send output of pty to the client
  ptyProcess.on("data", (data) => ws.send(data));

  ws.on("message", (message: string) => {
    // console.log("rcvd: %s", message);
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
