import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import socket from "../pages/Socket";
import { debounce } from "lodash";

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState("// Start coding...");

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", roomId);
    socket.emit("requestCode", roomId);

    socket.on("codeUpdate", (newCode) => {
      setCode((prev) => (newCode !== prev ? newCode : prev));
    });

    socket.on("initialCode", setCode);

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
  }, 300);

  return (
    <div className="p-4 bg-gray-900 h-screen">
      <div className="text-white text-xl mb-2">Room ID: <span className="font-mono">{roomId}</span></div>
      <div className="rounded-lg overflow-hidden border-2 border-gray-700">
        <Editor
          height="85vh"
          theme="vs-dark"
          defaultLanguage="cpp"
          value={code}
          onChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default CodeEditor;