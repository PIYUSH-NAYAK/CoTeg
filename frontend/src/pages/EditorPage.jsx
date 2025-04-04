import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "./Socket";
import { debounce } from "lodash";

const EditorPage = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Loading code...");
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", roomId);
    socket.emit("requestCode", roomId);

    socket.on("codeUpdate", (newCode) => {
      if (editorRef.current && !isUpdatingRef.current) {
        const editor = editorRef.current;
        const currentValue = editor.getValue();
        if (newCode !== currentValue) {
          const selection = editor.getSelection();
          editor.executeEdits("", [
            {
              range: editor.getModel().getFullModelRange(),
              text: newCode,
            },
          ]);
          editor.setSelection(selection);
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
      isUpdatingRef.current = true;
      setCode(newCode);
      socket.emit("sendCode", { roomId, code: newCode });
      setTimeout(() => (isUpdatingRef.current = false), 100);
    }
  }, 200);

  return (
    <div className="bg-gray-900 h-screen p-4">
      <div className="text-white text-2xl mb-4 font-semibold">
        Room ID: <span className="font-mono text-blue-400">{roomId}</span>
      </div>
      <div className="rounded-lg overflow-hidden border-2 border-gray-700">
        <Editor
          height="85vh"
          defaultLanguage="cpp"
          theme="vs-dark"
          value={code}
          onMount={(editor) => {
            editorRef.current = editor;
            editor.setValue(code);
          }}
          onChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default EditorPage;
