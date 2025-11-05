// src/utils/mediaAPI.js
const API_BASE =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URI
    : import.meta.env.VITE_API_URI;

async function json(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

export async function listMedia({
  page = 1,
  limit = 40,
  search = "",
  type = "",
} = {}) {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (search) qs.set("search", search.trim());
  if (type) qs.set("type", type);
  const res = await fetch(`${API_BASE}/media?${qs.toString()}`, {
    credentials: "include",
  });
  return json(res);
}

export async function uploadMedia(files = []) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const res = await fetch(`${API_BASE}/media/upload`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  return json(res);
}

export async function updateMedia(id, payload) {
  const res = await fetch(`${API_BASE}/api/media/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload || {}),
  });
  return json(res);
}

export async function replaceMedia(id, file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/api/media/${id}/replace`, {
    method: "PUT",
    body: fd,
    credentials: "include",
  });
  return json(res);
}

export async function deleteMedia(id, { hard = false } = {}) {
  const res = await fetch(
    `${API_BASE}/api/media/${id}?hard=${hard ? "true" : "false"}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return json(res);
}
