import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import socket from "../pages/Socket"; // Import socket instance
import { debounce } from "lodash"; // Debounce for performance optimization

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState("// Start coding...");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.once("connect", () => {
      socket.emit("joinRoom", roomId);
      socket.emit("requestCode", roomId); // Request latest code
    });

    socket.on("codeUpdate", (newCode) => {
      setCode((prevCode) => (newCode !== prevCode ? newCode : prevCode));
    });

    socket.on("initialCode", (existingCode) => {
      setCode(existingCode); // Set the latest code when joining
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("initialCode");
    };
  }, [roomId]);

  const handleCodeChange = debounce((newCode) => {
    if (newCode !== code) {
      setCode(newCode);
      socket.emit("codeChange", { roomId, code: newCode });
    }
  }, 300); // Debounce to prevent excessive calls

  return (
    <Editor
      height="90vh"
      theme="vs-dark"
      defaultLanguage="javascript"
      value={code}
      onChange={handleCodeChange}
    />
  );
};

export default CodeEditor;
