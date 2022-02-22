import React from "react";
import MonacoEditor from "@monaco-editor/react";

const Editor = () => {
  const handleEditorChange = (value: string | undefined, event: any) => {
    console.log(value);
  };

  return (
    <MonacoEditor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  );
};

export default Editor;
