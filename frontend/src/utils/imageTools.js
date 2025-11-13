// src/utils/imageTools.js
function apiOrigin() {
  const base =
    import.meta.env.VITE_API_URI || import.meta.env.VITE_API_URL || "";
  return base.replace(/\/api\/?$/, "");
}

// Accepts: array, a single filename, a pipe string, or a URL → returns a browser-usable src
// src/utils/imageTools.js
export function normalizeImages(raw) {
  if (!raw) return [];
  // raw can be ["a| b| c"] or ["a","b"] or "a|b"
  const s = Array.isArray(raw) ? raw.join("|") : String(raw);
  return s
    .split("|")
    .map(x => x.trim())
    .filter(Boolean);
}

export function pickFirstImageSrc(raw) {
  const arr = normalizeImages(raw);
  return arr.length ? arr[0] : "";
}






export function buildImgSrc(img) {
  if (!img) return "/default-product.jpg";
  if (/^https?:\/\//i.test(img)) return img;
  const base = import.meta.env.VITE_API_URI || "http://localhost:5001";
  if (img.startsWith("/uploads/")) return `${base}${img}`;
  return `${base}/uploads/${img}`;
}
