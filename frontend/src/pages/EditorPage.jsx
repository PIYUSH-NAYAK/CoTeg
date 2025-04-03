import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "./Socket";
import { debounce } from "lodash";

const EditorPage = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false); // Prevents infinite loop

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", roomId);
    socket.emit("requestCode", roomId);

    socket.on("codeUpdate", (newCode) => {
      if (editorRef.current && !isUpdatingRef.current) {
        const editor = editorRef.current;
        const currentValue = editor.getValue();

        if (newCode !== currentValue) {
          const selection = editor.getSelection(); // Save cursor position

          editor.executeEdits("", [
            {
              range: editor.getModel().getFullModelRange(),
              text: newCode,
            },
          ]);

          editor.setSelection(selection); // Restore cursor position
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
    if (editorRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true; // Prevents feedback loop
      setCode(newCode);
      socket.emit("sendCode", { roomId, code: newCode });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, 200);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <Editor
        height="80vh"
        defaultLanguage="cpp"  // Changed to C++
        theme="vs-dark"
        value={code}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.setValue(code);
        }}
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default EditorPage;
