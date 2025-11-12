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

export async function uploadMedia(files = [], onProgress) {
  const CHUNK_SIZE = 100; // Number of files per batch
  const CONCURRENCY = 5; // Number of batches to upload in parallel

  if (!files.length) throw new Error("No files selected for upload.");
  const totalBatches = Math.ceil(files.length / CHUNK_SIZE);
  let uploadedCount = 0;

  console.log(
    `🚀 Starting upload of ${files.length} files in ${totalBatches} batches (up to ${CONCURRENCY} at a time)`
  );

  async function uploadBatch(batchIndex) {
    const start = batchIndex * CHUNK_SIZE;
    const batch = files.slice(start, start + CHUNK_SIZE);
    const fd = new FormData();
    batch.forEach((f) => fd.append("files", f));

    try {
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || data.ok === false)
        throw new Error(data.error || "Upload failed");

      uploadedCount += batch.length;
      if (onProgress) onProgress(batch.length);

      console.log(
        `✅ Batch ${batchIndex + 1}/${totalBatches} uploaded (${
          batch.length
        } files)`
      );
      return data.items?.length || 0;
    } catch (err) {
      console.error(`❌ Batch ${batchIndex + 1} failed:`, err);
      return 0;
    }
  }

  const queue = [...Array(totalBatches).keys()];
  const running = [];

  while (queue.length > 0 || running.length > 0) {
    while (queue.length > 0 && running.length < CONCURRENCY) {
      const next = queue.shift();
      const p = uploadBatch(next).then(() => {
        running.splice(running.indexOf(p), 1);
      });
      running.push(p);
    }
    await Promise.race(running);
  }

  console.log(`🎉 Upload complete: ${uploadedCount}/${files.length} files`);
  return { ok: true, count: uploadedCount };
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
