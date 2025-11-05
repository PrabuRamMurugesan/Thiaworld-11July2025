// src/pages/admin/MediaLibrary.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { listMedia, uploadMedia, deleteMedia } from "../../utils/mediaAPI";
import MediaGridItem from "../../components/MediaGridItem";
import MediaUploadModal from "../../components/MediaUploadModal";
import MediaEditDrawer from "../../components/MediaEditDrawer";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import CopyButton from "../../components/CopyButton";

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selected, setSelected] = useState(() => new Set());

  const lastRefreshedAt = useRef(null);

  async function load() {
    setLoading(true);
    try {
      const data = await listMedia({ page, limit, search, type });
      setItems(data.items || []);
      setTotal(data.total || 0);
      lastRefreshedAt.current = new Date();
    } catch (e) {
      alert(`Failed to load media: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [page, type]);
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function onDeleteConfirmed(hard = false) {
    const ids = toDelete ? [toDelete] : Array.from(selected);
    if (!ids.length) return;

    try {
      for (const id of ids) {
        await deleteMedia(id, { hard });
      }
      alert(`Deleted ${ids.length} item(s)`);
      setToDelete(null);
      clearSelection();
      load();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  }

  async function onUpload(files) {
    try {
      const resp = await uploadMedia(files);
      alert(`Uploaded ${resp.count} file(s)`);
      setShowUpload(false);
      setPage(1);
      load();
    } catch (e) {
      alert(`Upload failed: ${e.message}`);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Media Library</h2>
        <div style={{ fontSize: 12, color: "#666" }}>
          {lastRefreshedAt.current
            ? `Updated ${lastRefreshedAt.current.toLocaleTimeString()}`
            : ""}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setShowUpload(true)}>Upload</button>
          <input
            placeholder="Search filename"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="audio">Audio</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <CopyButton
          text={Array.from(selected)
            .map((id) => {
              const it = items.find((x) => String(x.id) === String(id));
              return it ? it.url : "";
            })
            .filter(Boolean)
            .join("\n")}
          disabled={!selected.size}
          label="Copy URLs"
        />
        <button
          onClick={() => setToDelete(null) || setToDelete("bulk")}
          disabled={!selected.size}
        >
          Delete selected
        </button>
        <button
          onClick={() => {
            clearSelection();
          }}
        >
          Clear selection
        </button>
        <div style={{ marginLeft: "auto" }}>Total: {total}</div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          {items.length === 0 ? (
            <div style={{ padding: 24, color: "#666" }}>
              No media found. Click “Upload” to add files.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {items.map((it) => (
                <MediaGridItem
                  key={it.id}
                  item={it}
                  selected={selected.has(String(it.id))}
                  onSelect={() => toggleSelect(String(it.id))}
                  onEdit={() => setEditing(it)}
                  onDelete={() => setToDelete(String(it.id))}
                />
              ))}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </>
      )}

      {showUpload && (
        <MediaUploadModal
          onClose={() => setShowUpload(false)}
          onUpload={onUpload}
        />
      )}

      {editing && (
        <MediaEditDrawer
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {!!toDelete && (
        <ConfirmDialog
          title={
            toDelete === "bulk" ? "Delete selected items?" : "Delete this item?"
          }
          message={
            toDelete === "bulk"
              ? "This will delete all selected items."
              : "This will delete the chosen item."
          }
          confirmText="Delete"
          onCancel={() => setToDelete(null)}
          onConfirm={() => onDeleteConfirmed(false)}
          extraActionLabel="Hard delete"
          onExtraAction={() => onDeleteConfirmed(true)}
        />
      )}
    </div>
  );
}
