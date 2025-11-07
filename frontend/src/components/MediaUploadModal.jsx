// src/components/MediaUploadModal.jsx
import React, { useRef, useState } from "react";

export default function MediaUploadModal({ onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  // 🔹 Handle drag & drop (folders or files)
  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const items = e.dataTransfer.items;
    if (items) {
      traverseFileTree(items);
    } else {
      const list = Array.from(e.dataTransfer.files || []);
      setFiles((prev) => prev.concat(list));
    }
  }

  // 🔹 Recursively read folders and files
  function traverseFileTree(items) {
    const allFiles = [];
    let pending = items.length;

    function readEntries(entry) {
      if (entry.isFile) {
        entry.file((file) => {
          allFiles.push(file);
          if (--pending === 0) setFiles((prev) => prev.concat(allFiles));
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        dirReader.readEntries((entries) => {
          pending += entries.length;
          entries.forEach(readEntries);
          if (--pending === 0) setFiles((prev) => prev.concat(allFiles));
        });
      }
    }

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry) readEntries(entry);
    }
  }

  // 🔹 Handle file/folder picker
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
        <h3 className="text-2xl  text-center">Upload files or folders</h3>

        <div
          className="flex flex-col items-center  justify-center m-4 p-3"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{
            border: "2px dashed gray",
            borderRadius: 8,
            padding: 0,
            textAlign: "center",
            background: dragOver ? "#f4f8ff" : "white",
            marginBottom: 12,
          }}
        >
          Drag & drop files or folders here
          <div style={{ margin: "8px 0" }}>or</div>
          {/* 🔹 Allows both file & folder upload */}
          <div className="border p-2 rounded text-center bg-[#c5d1e6] ">
            <input
              ref={inputRef}
              type="file"
              multiple
              webkitdirectory="true"
              directory="true"
              accept="image/*,video/*,.pdf"
              onChange={onPick}
            />
          </div>
        </div>

        {files.length > 0 && (
          <div
            className="mx-4"
            style={{
              maxHeight: 200,
              overflow: "auto",
              border: "1px solid #eee",
              padding: 8,
              borderRadius: 6,
              background: "#f9f9f9",
            }}
          >
            {files.map((f, i) => (
              <div
                className="px-4"
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
                  {f.webkitRelativePath || f.name}
                </div>
                <div style={{ color: "#666" }}>
                  {Math.round(f.size / 1024)} KB
                </div>
                <button
                  className="text-white bg-red-500 p-2 rounded "
                  onClick={() => removeAt(i)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 m-2 p-2 ">
          <button
            className="text-white bg-blue-500 p-1 px-3 rounded "
            onClick={submit}
            disabled={!files.length}
          >
            Upload
          </button>
          <button
            className="text-white bg-red-500 p-1 px-3 rounded"
            onClick={onClose}
          >
            Close
          </button>
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
