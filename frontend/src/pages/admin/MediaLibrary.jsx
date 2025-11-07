// src/pages/admin/MediaLibrary.jsx
import Swal from "sweetalert2";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { listMedia, uploadMedia, deleteMedia } from "../../utils/mediaAPI";
import MediaGridItem from "../../components/MediaGridItem";
import MediaUploadModal from "../../components/MediaUploadModal";
import MediaEditDrawer from "../../components/MediaEditDrawer";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import CopyButton from "../../components/CopyButton";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaRegListAlt,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [view, setView] = useState("medium");
  const [menuOpen, setMenuOpen] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const lastRefreshedAt = useRef(null);
  const sidebarWidth = collapsed ? 70 : 240;

  const viewOptions = [
    { id: "details", label: "Details", icon: <FaRegListAlt /> },
    { id: "list", label: "List", icon: <FaThList /> },
    { id: "small", label: "Small icons", icon: <FaTh size={10} /> },
    { id: "medium", label: "Medium icons", icon: <FaTh size={14} /> },
    { id: "large", label: "Large icons", icon: <FaThLarge size={20} /> },
    { id: "extra", label: "Extra large icons", icon: <FaThLarge size={28} /> },
  ];

  const sortOptions = [
    { id: "filename", label: "Name" },
    { id: "type", label: "Type" },
    { id: "size", label: "Size" },
    { id: "date", label: "Date Modified" },
  ];

  // 🧩 Load items (with backend sort)
  async function load() {
    setLoading(true);
    try {
      const data = await listMedia({
        page,
        limit,
        search,
        type,
        sortField: sortBy,
        sortOrder,
      });
      let loaded = data.items || [];

      // Fallback: frontend sort
      loaded = [...loaded].sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === "number" || valA instanceof Date) {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return 0;
      });

      setItems(loaded);
      setTotal(data.total || 0);
      lastRefreshedAt.current = new Date();
    } catch (e) {
      Swal.fire("Error", `Failed to load media: ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  // 🔁 Load whenever key filters change
  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [page, type, sortBy, sortOrder]);

  // 🔍 Debounced search
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
    const ids = toDelete === "bulk" ? Array.from(selected) : [toDelete];
    if (!ids.length) return;

    try {
      for (const id of ids) {
        await deleteMedia(id, { hard });
      }
      await Swal.fire({
        title: "Deleted!",
        text: `${ids.length} item(s) successfully deleted.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "swal-popup-top" },
      });
      setToDelete(null);
      clearSelection();
      load();
    } catch (e) {
      Swal.fire({
        title: "Delete Failed",
        text: e.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        customClass: { popup: "swal-popup-top" },
      });
    }
  }

  async function onUpload(files) {
    try {
      const resp = await uploadMedia(files);
      Swal.fire({
        title: "Upload Successful!",
        text: `Uploaded ${resp.count} file(s).`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setShowUpload(false);
      setPage(1);
      load();
    } catch (e) {
      Swal.fire("Upload Failed", e.message || "Something went wrong.", "error");
    }
  }

  const getThumbSize = () => {
    switch (view) {
      case "small":
        return 80;
      case "medium":
        return 140;
      case "large":
        return 200;
      case "extra":
        return 280;
      default:
        return 140;
    }
  };

  const getGridColumns = () => {
    switch (view) {
      case "small":
        return "repeat(auto-fill, minmax(100px, 1fr))";
      case "medium":
        return "repeat(auto-fill, minmax(160px, 1fr))";
      case "large":
        return "repeat(auto-fill, minmax(220px, 1fr))";
      case "extra":
        return "repeat(auto-fill, minmax(280px, 1fr))";
      case "list":
        return "repeat(auto-fill, minmax(320px, 1fr))";
      default:
        return "repeat(auto-fill, minmax(180px, 1fr))";
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div>
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div
        className="flex-grow-1"
        style={{ width: `calc(100% - ${sidebarWidth}px)` }}
      >
        <AdminHeader />

        <main className="p-4">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center mb-4 justify-center gap-3 relative">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                Media Library
              </h2>
              <div style={{ fontSize: 12, color: "#555B6E" }}>
                {lastRefreshedAt.current
                  ? `Updated ${lastRefreshedAt.current.toLocaleTimeString()}`
                  : ""}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                {/* Upload */}
                <button
                  onClick={() => setShowUpload(true)}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 6,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "0.2s ease-in-out",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#1E40AF")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#2563EB")
                  }
                >
                  Upload
                </button>

                {/* Search */}
                <input
                  className="border-2 rounded-xl p-2"
                  placeholder="Search filename"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: 220 }}
                />

                {/* Type Filter */}
                <select
                  className="border border-gray-300 rounded-lg text-gray-800 text-[14px] px-3 py-[6px] leading-tight 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">All types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                  <option value="audio">Audio</option>
                  <option value="other">Other</option>
                </select>

                {/* Sort Menu */}
                <div className="relative">
                  <button
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                    className="flex items-center border px-3 py-2 rounded-lg bg-white hover:bg-gray-100"
                  >
                    <span className="mr-1">Sort by </span>
                    <IoMdArrowDropdown />
                  </button>
                  {sortMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`flex items-center w-full px-3 py-2 hover:bg-gray-100 text-left ${
                            sortBy === option.id
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setSortBy(option.id);
                            setSortMenuOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                      <div className="border-t my-1" />
                      <button
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                        onClick={() =>
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          )
                        }
                      >
                        {sortOrder === "asc" ? (
                          <>
                            <FaSortAlphaUp className="mr-2" /> Ascending
                          </>
                        ) : (
                          <>
                            <FaSortAlphaDown className="mr-2" /> Descending
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* View Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center border px-3 py-2 rounded-lg bg-white hover:bg-gray-100"
                  >
                    <span className="mr-1">View</span>
                    <IoMdArrowDropdown />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      {viewOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`flex items-center w-full px-3 py-2 hover:bg-gray-100 text-left ${
                            view === option.id
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setView(option.id);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b pb-4 mb-4 flex items-center justify-center gap-3 relative">
              <CopyButton
                text={Array.from(selected)
                  .map((id) => {
                    const it = items.find((x) => String(x.id) === String(id));
                    return it ? it.url : "";
                  })
                  .filter(Boolean)
                  .join("\n")}
                disabled={!selected.size}
                label={
                  <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    Copy URLs
                  </span>
                }
              />
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setToDelete("bulk")}
                disabled={!selected.size}
              >
                Delete selected
              </button>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition active:scale-95 "
                onClick={clearSelection}
              >
                Clear selection
              </button>
              <div
                className="absolute right-0 mr-6 flex items-center gap-2 text-gray-700 
              font-medium bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300"
              >
                Total: {total}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div>Loading…</div>
            ) : items.length === 0 ? (
              <div style={{ padding: 24, color: "#666" }}>
                No media found. Click “Upload” to add files.
              </div>
            ) : view === "details" ? (
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Preview</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-2 border text-center">
                        <img
                          src={it.url}
                          alt=""
                          className="w-10 h-10 object-cover mx-auto rounded"
                        />
                      </td>
                      <td className="p-2 border">{it.filename}</td>
                      <td className="p-2 border">{it.type}</td>
                      <td className="p-2 border">{it.size} KB</td>
                      <td className="p-2 border">
                        {new Date(it.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridColumns(),
                  gap: 12,
                }}
              >
                {items.map((it) => (
                  <MediaGridItem
                    key={it.id}
                    item={it}
                    size={getThumbSize()}
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

            {/* Modals & Drawers */}
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
                  toDelete === "bulk"
                    ? "Delete selected items?"
                    : "Delete this item?"
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
        </main>
      </div>
    </div>
  );
}
