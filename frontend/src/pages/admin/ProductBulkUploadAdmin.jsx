import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * ProductBulkUploadAdmin.jsx
 * - Import CSV/XLSX and validate (dry run) or commit to DB
 * - Download server-side template
 * - Export current products to CSV (client-side)
 * - Export validation errors to CSV
 * - Clean UI with all labels, buttons, and states
 *
 * API endpoints expected:
 * GET  ${import.meta.env.VITE_API_URI}/products/bulk-template
 * POST ${import.meta.env.VITE_API_URI}/products/bulk-upload?dryRun=true|false  (multipart/form-data, file)
 * GET  ${import.meta.env.VITE_API_URI}/products/all  (for export)
 */

const COLS = [
  "name",
  "category",
  "price",
  "description",
  "longDescription",
  "metalType",
  "metalColor",
  "purity",
  "netWeight",
  "grossWeight",
  "discount",
  "makingCharges",
  "gst",
  "tags",
  "images",
  "isNewArrival",
  "isFeatured",
  "bestSelling",
  "showInHomepage",
  "priorityRanking",
];

const Section = ({ title, children, right }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 12,
      alignItems: "center",
      marginTop: 24,
    }}
  >
    <h4 style={{ margin: 0, fontWeight: 600 }}>{title}</h4>
    <div>{right}</div>
    <div style={{ gridColumn: "1 / -1" }}>{children}</div>
  </div>
);

const Line = () => (
  <div style={{ borderTop: "1px solid #e9ecef", margin: "16px 0" }} />
);

const Button = ({ children, variant = "primary", style, ...rest }) => {
  const colors = {
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#0dcaf0",
    light: "#f8f9fa",
    dark: "#212529",
    outline: "#0d6efd",
  };
  const isOutline = variant.startsWith("outline");
  const baseKey = isOutline ? variant.replace("outline-", "") : variant;
  const baseColor = colors[baseKey] || colors.primary;
  const bg = isOutline ? "transparent" : baseColor;
  const bd = baseColor;
  const fg = isOutline ? bd : "#fff";

  return (
    <button
      {...rest}
      style={{
        background: bg,
        border: `1px solid ${bd}`,
        color: fg,
        padding: "8px 14px",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const Pill = ({ children, tone = "info" }) => {
  const map = {
    info: "#0dcaf0",
    success: "#198754",
    danger: "#dc3545",
    warning: "#ffc107",
    secondary: "#6c757d",
  };
  const color = map[tone] || map.info;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: color + "22",
        color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
};

const Alert = ({ children, tone = "danger", onClose }) => {
  const map = {
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#0dcaf0",
    success: "#198754",
  };
  const color = map[tone] || map.danger;
  return (
    <div
      style={{
        padding: "10px 12px",
        background: color + "22",
        border: `1px solid ${color}55`,
        borderRadius: 12,
        color: "#222",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 14 }}>{children}</div>
      {onClose ? (
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
};

const Table = ({ columns, rows, dense }) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #e9ecef",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#f8f9fa" }}>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  borderBottom: "1px solid #e9ecef",
                  padding: dense ? "6px 8px" : "10px 12px",
                  fontSize: 13,
                  color: "#495057",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.length ? (
            rows.map((r, idx) => (
              <tr key={idx} style={{ borderTop: "1px solid #f1f3f5" }}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      padding: dense ? "6px 8px" : "10px 12px",
                      fontSize: 13,
                      color: "#212529",
                      verticalAlign: "top",
                      whiteSpace: c.nowrap ? "nowrap" : "normal",
                    }}
                  >
                    {typeof c.render === "function"
                      ? c.render(r, idx)
                      : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: 16, textAlign: "center", color: "#6c757d" }}
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

function toCSV(rows, headerOrder) {
  const h = headerOrder || (rows.length ? Object.keys(rows[0]) : []);
  const esc = (s) => {
    if (s === null || s === undefined) return "";
    const str = String(s);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const lines = [h.map(esc).join(",")];
  for (const row of rows) {
    lines.push(h.map((k) => esc(row[k])).join(","));
  }
  return lines.join("\n");
}

function downloadBlob(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  // append to body to make sure click works in some environments
  document.body.appendChild(a);
  a.click();
  // cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 800);
}

export default function ProductBulkUploadAdmin() {
  const [file, setFile] = useState(null);
  const [dryRun, setDryRun] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState("");

  const apiBase = import.meta.env.VITE_API_URI;

  // errors table state; will sync with result.errors when result changes
  const [errors, setErrors] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  useEffect(() => {
    setErrors(
      Array.isArray(result?.errors)
        ? result.errors.map((e, i) => ({ row: e.row ?? i + 1, ...e }))
        : []
    );
    // reset undo stack when a new result arrives
    setUndoStack([]);
  }, [result]);

  const summaryList = useMemo(() => {
    const s = result?.summary || {};
    return [
      { k: "Total rows", v: s.totalRows ?? "-" },
      { k: "Inserted", v: s.inserted ?? "-" },
      { k: "Updated", v: s.updated ?? "-" },
      { k: "Failed", v: s.failed ?? "-" },
      {
        k: "Mode",
        v: s.dryRun ? "Dry Run (no DB writes)" : "Live (committed)",
      },
    ];
  }, [result]);

  const sampleColumns = [
    { key: "row", label: "Row", align: "right", nowrap: true },
    {
      key: "action",
      label: "Action",
      render: (r) => (
        <Pill tone={r.action === "upsert" ? "success" : "info"}>
          {r.action}
        </Pill>
      ),
    },
    { key: "name", label: "Name" },
  ];

  const handleTemplateDownload = async () => {
    try {
      setError("");
      const url = `${apiBase}/products/bulk-template`;
      const resp = await axios.get(url, { responseType: "blob" });
      downloadBlob(
        resp.data,
        "thiaworld-products-template.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (e) {
      setError(
        e?.response?.data?.error || e.message || "Template download failed"
      );
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a CSV/XLSX file.");
      return;
    }
    // client-side size check: 25 MB
    if (file.size > 25 * 1024 * 1024) {
      setError("File too large. Maximum allowed size is 25 MB.");
      return;
    }
    setError("");
    setBusy(true);
    setProgress(0);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = `${apiBase}/products/bulk-upload?dryRun=${Boolean(dryRun)}`;
      const resp = await axios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      setResult(resp.data || null);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleExportProducts = async () => {
    try {
      setExportError("");
      setExportBusy(true);
      const url = `${apiBase}/products/all`;
      const resp = await axios.get(url);
      const data = Array.isArray(resp.data) ? resp.data : [];
      // Map to flat CSV structure using known columns + some extra fields if present
      const rows = data.map((p) => {
        const flat = {};
        COLS.forEach((c) => {
          let val = p[c];
          if (Array.isArray(val)) val = val.join("|");
          flat[c] = val ?? "";
        });
        // useful extras if present on your model
        flat.slug = p.slug ?? "";
        flat.id = p._id ?? "";
        flat.createdAt = p.createdAt ?? "";
        flat.updatedAt = p.updatedAt ?? "";
        return flat;
      });
      const csv = toCSV(rows, [
        "id",
        "slug",
        ...COLS,
        "createdAt",
        "updatedAt",
      ]);
      downloadBlob(
        csv,
        "thiaworld-products-export.csv",
        "text/csv;charset=utf-8"
      );
    } catch (e) {
      setExportError(e?.response?.data?.error || e.message || "Export failed");
    } finally {
      setExportBusy(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
    setDryRun(true);
    setErrors([]);
    setUndoStack([]);
  };

  // ---- Error table columns + handlers ----
  const handleAdd = () => {
    const newError = {
      row: (errors.length ? Math.max(...errors.map((x) => x.row || 0)) : 0) + 1,
      reason: "New Error",
      details: "Details here",
      rate: "N/A",
    };
    setUndoStack((u) => [...u, errors]);
    setErrors((prev) => [...prev, newError]);
  };

  const handleEdit = (index) => {
    const current = errors[index];
    const newReason = window.prompt("Enter new reason:", current?.reason ?? "");
    if (newReason !== null) {
      setUndoStack((u) => [...u, errors]);
      const updated = [...errors];
      updated[index] = { ...updated[index], reason: newReason };
      setErrors(updated);
    }
  };

  const handleDelete = (index) => {
    setUndoStack((u) => [...u, errors]);
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const last = undoStack[undoStack.length - 1];
      setUndoStack((u) => u.slice(0, -1));
      setErrors(last);
    }
  };

  const handleExportErrors = () => {
    if (!errors?.length) return;
    // Build rows normalized to keys for stable CSV headers
    const headerOrder = ["row", "reason", "details", "rate"];
    const rows = errors.map((e) => ({
      row: e.row ?? "",
      reason: e.reason ?? "",
      details: e.details ?? "",
      rate: e.rate ?? "",
    }));
    const csv = toCSV(rows, headerOrder);
    downloadBlob(csv, "product-import-errors.csv", "text/csv;charset=utf-8");
  };

  const errorColumns = [
    { key: "row", label: "Row", align: "right", nowrap: true },
    { key: "reason", label: "Reason" },
    { key: "details", label: "Details" },
    { key: "rate", label: "Rate" },
    {
      key: "actions",
      label: "Actions",
      render: (_item, index) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline-primary" onClick={() => handleEdit(index)}>
            Edit
          </Button>
          <Button variant="outline-danger" onClick={() => handleDelete(index)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 12px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e9ecef",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Bulk Products — Import & Export</h3>
            <div style={{ color: "#6c757d", fontSize: 14, marginTop: 6 }}>
              Import CSV/XLSX, validate first, then commit. You can also export
              current products to CSV.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="outline-primary" onClick={handleTemplateDownload}>
              Download Template
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleExportProducts}
              disabled={exportBusy}
            >
              {exportBusy ? "Exporting..." : "Export Products (CSV)"}
            </Button>
          </div>
        </div>

        <Line />

        {error && (
          <Alert tone="danger" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {exportError && (
          <div style={{ marginTop: 12 }}>
            <Alert tone="danger" onClose={() => setExportError("")}>
              {exportError}
            </Alert>
          </div>
        )}

        <Section title="1) Prepare your file">
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 14, color: "#495057" }}>
              The file must include at least these required columns: <b>name</b>
              , <b>category</b>, <b>price</b>.
            </div>
            <div style={{ fontSize: 14, color: "#495057" }}>
              Optional columns supported:{" "}
              {COLS.filter(
                (c) => !["name", "category", "price"].includes(c)
              ).join(", ")}
              . Multiple tags/images can be pipe or comma separated.
            </div>
          </div>
        </Section>

        <Section
          title="2) Choose file"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <label style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  style={{ marginRight: 8, transform: "translateY(1px)" }}
                />
                Dry run (validate only)
              </label>
            </div>
          }
        >
          <div
            style={{
              border: "1px dashed #ced4da",
              padding: 16,
              borderRadius: 12,
              background: "#f8f9fa",
              display: "grid",
              gap: 12,
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 600 }}>File (CSV or Excel)</label>
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={(e) => {
                  setError("");
                  setFile(e.target.files?.[0] || null);
                }}
              />
              <div style={{ fontSize: 12, color: "#6c757d" }}>
                Max size 25 MB. Supported: .csv, .xls, .xlsx
              </div>
            </div>

            {busy ? (
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 14 }}>Uploading...</div>
                <div
                  style={{
                    height: 10,
                    background: "#e9ecef",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "#0d6efd",
                      transition: "width .2s",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button onClick={handleUpload} disabled={!file || busy}>
                  {dryRun ? "Validate File (Dry Run)" : "Upload & Commit"}
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            )}
          </div>
        </Section>

        {result && (
          <>
            <Section
              title="3) Summary"
              right={
                result?.errors?.length ? (
                  <Button
                    variant="outline-danger"
                    onClick={handleExportErrors}
                    disabled={!errors?.length}
                  >
                    Export Errors (CSV)
                  </Button>
                ) : (
                  <Pill tone="success">No validation errors</Pill>
                )
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 10,
                }}
              >
                {summaryList.map((item) => (
                  <div
                    key={item.k}
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#6c757d" }}>
                      {item.k}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {item.v}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="4) Sample of processed rows (first 10)">
              <Table columns={sampleColumns} rows={result.sample || []} dense />
            </Section>

            {errors?.length ? (
              <Section title={`5) Errors (${errors.length})`}>
                <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
                  <Button variant="outline-success" onClick={handleAdd}>
                    ➕ Add
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                  >
                    ↩️ Undo
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={handleExportErrors}
                    disabled={!errors?.length}
                  >
                    ⬇️ Export Errors (CSV)
                  </Button>
                </div>

                <Table columns={errorColumns} rows={errors} />
              </Section>
            ) : null}

            {!result.summary?.dryRun ? (
              <div style={{ marginTop: 16 }}>
                <Alert tone="success">
                  Bulk upload committed successfully.
                </Alert>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <Alert tone="info">
                  This was a dry run. Fix any errors, toggle off “Dry run,” then
                  upload again to commit.
                </Alert>
              </div>
            )}
          </>
        )}

        <Line />

        <Section title="Tips">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "#495057",
              fontSize: 14,
            }}
          >
            <li>
              Use unique slugs or unique names to update existing items. If the
              slug or name matches, that row will update; otherwise it inserts.
            </li>
            <li>
              Use pipe or comma to separate multiple tags/images. Example:
              rings|bridal|festival
            </li>
            <li>
              Do a dry run first to catch missing required fields: name,
              category, price.
            </li>
            <li>
              Weights and numeric fields accept integers or floats. Booleans
              accept true/false, yes/no, 1/0.
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
