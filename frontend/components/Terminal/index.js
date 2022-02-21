import React, { useEffect } from "react";
import { Terminal as XtermTerminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { SerializeAddon } from "xterm-addon-serialize";

const Terminal = () => {
  useEffect(() => {
    const terminal = new XtermTerminal({
      screenKeys: true,
      useStyle: true,
      cursorBlink: true,
      fullscreenWin: true,
      maximizeWin: true,
      screenReaderMode: true,
      cols: 128,
      convertEol: true,
    });

    const socket = new WebSocket("ws://localhost:8999");
    const attachAddon = new AttachAddon(socket);
    const serializeAddon = new SerializeAddon();

    terminal.open(document.getElementById("terminal"));
    terminal.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");

    terminal.loadAddon(attachAddon);
    terminal.loadAddon(serializeAddon);
  }, []);

  return (
    <>
      <div id="terminal" />
    </>
  );
};

export default Terminal;
