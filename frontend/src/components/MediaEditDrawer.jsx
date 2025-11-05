// src/components/MediaEditDrawer.jsx
import React, { useRef, useState } from "react";
import { updateMedia, replaceMedia } from "../utils/mediaAPI";

export default function MediaEditDrawer({ item, onClose, onSaved }) {
  const [title, setTitle] = useState(item.title || "");
  const [altText, setAltText] = useState(item.altText || "");
  const [description, setDescription] = useState(item.description || "");
  const [tags, setTags] = useState((item.tags || []).join(", "));
  const [busy, setBusy] = useState(false);

  const fileRef = useRef(null);

  async function saveMeta() {
    setBusy(true);
    try {
      await updateMedia(item.id, {
        title,
        altText,
        description,
        tags: tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      onSaved();
    } catch (e) {
      alert(`Save failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function doReplace() {
    const f = fileRef.current?.files?.[0];
    if (!f) return alert("Pick a file first");
    setBusy(true);
    try {
      await replaceMedia(item.id, f);
      onSaved();
    } catch (e) {
      alert(`Replace failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  const previewUrl =
    item.type === "video" ? item.posterUrl || item.url : item.url;

  return (
    <div style={drawerBackdrop}>
      <div style={drawer}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, flex: 1 }}>Edit media</h3>
          <button onClick={onClose}>Close</button>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                width: "100%",
                aspectRatio: "1/1",
                background: "#fafafa",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={previewUrl}
                alt={item.filename}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              {item.filename}
            </div>
          </div>

          <div>
            <label style={lbl}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={txt}
            />

            <label style={lbl}>Alt text</label>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              style={txt}
            />

            <label style={lbl}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...txt, height: 64 }}
            />

            <label style={lbl}>Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={txt}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={saveMeta} disabled={busy}>
                Save
              </button>
            </div>

            <hr style={{ margin: "16px 0" }} />

            <div style={{ fontWeight: 600, marginBottom: 6 }}>Replace file</div>
            <input ref={fileRef} type="file" accept="image/*,video/*" />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={doReplace} disabled={busy}>
                Replace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const drawerBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 9999,
};
const drawer = {
  width: 720,
  maxWidth: "95vw",
  background: "#fff",
  height: "100vh",
  padding: 16,
  boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
};
const lbl = {
  display: "block",
  fontSize: 12,
  color: "#555",
  marginTop: 10,
  marginBottom: 4,
};
const txt = {
  width: "100%",
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ccc",
};
