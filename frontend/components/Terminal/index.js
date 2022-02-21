import React, { useEffect } from "react";
import { Terminal as XtermTerminal } from "xterm";

const Terminal = () => {
  useEffect(() => {
    var terminal = new XtermTerminal();
    terminal.open(document.getElementById("terminal"));
    terminal.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
  }, []);

  return (
    <>
      <div id="terminal" />
    </>
  );
};

export default Terminal;
