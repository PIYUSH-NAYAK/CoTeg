import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "./Socket";
import { debounce } from "lodash";

const EditorPage = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", roomId);
    socket.emit("requestCode", roomId);

    socket.on("codeUpdate", (newCode) => {
      if (editorRef.current) {
        const editor = editorRef.current;
        if (newCode !== editor.getValue()) {
          editor.setValue(newCode);
        }
      }
    });

    socket.on("initialCode", (existingCode) => {
      setCode(existingCode);
      if (editorRef.current) {
        editorRef.current.setValue(existingCode);
      }
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("initialCode");
    };
  }, [roomId]);

  const handleCodeChange = debounce((newCode) => {
    if (newCode !== code) {
      setCode(newCode);
      socket.emit("sendCode", { roomId, code: newCode });
    }
  }, 300);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <Editor
        height="80vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onMount={(editor) => (editorRef.current = editor)}
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default EditorPage;
