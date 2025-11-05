// src/components/MediaUploadModal.jsx
import React, { useRef, useState } from "react";

export default function MediaUploadModal({ onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const list = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => prev.concat(list));
  }

  function onPick(e) {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => prev.concat(list));
  }

  function removeAt(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit() {
    if (!files.length) return;
    await onUpload(files);
  }

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0 }}>Upload files</h3>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{
            border: "2px dashed #bbb",
            borderRadius: 8,
            padding: 16,
            textAlign: "center",
            background: dragOver ? "#f4f8ff" : "white",
            marginBottom: 12,
          }}
        >
          Drag & drop files here
          <div style={{ margin: 8 }}>or</div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
            onChange={onPick}
          />
        </div>

        {files.length > 0 && (
          <div
            style={{
              maxHeight: 200,
              overflow: "auto",
              border: "1px solid #eee",
              padding: 8,
              borderRadius: 6,
            }}
          >
            {files.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {f.name}
                </div>
                <div style={{ color: "#666" }}>
                  {Math.round(f.size / 1024)} KB
                </div>
                <button onClick={() => removeAt(i)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={submit} disabled={!files.length}>
            Upload
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
const modalStyle = {
  width: 560,
  background: "#fff",
  borderRadius: 10,
  padding: 16,
  boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
};
