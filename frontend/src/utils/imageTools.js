// src/utils/imageTools.js
function apiOrigin() {
  const base =
    import.meta.env.VITE_API_URI || import.meta.env.VITE_API_URL || "";
  return base.replace(/\/api\/?$/, "");
}

// Accepts: array, a single filename, a pipe string, or a URL → returns a browser-usable src
export function normalizeImages(images) {
  if (!images) return [];
  if (typeof images === "string") {
    return images
      .split(/[|,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(images)) {
    // handle ["img1|img2|img3"]
    if (images.length === 1 && images[0].includes("|")) {
      return images[0]
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return images.filter(Boolean);
  }
  return [];
}

export function pickFirstImageSrc(images) {
  const arr = normalizeImages(images);
  return arr.length ? arr[0] : null;
}

export function buildImgSrc(img) {
  if (!img) return "/default-product.jpg";
  if (/^https?:\/\//i.test(img)) return img;
  const base = import.meta.env.VITE_API_URL || "http://localhost:5001";
  if (img.startsWith("/uploads/")) return `${base}${img}`;
  return `${base}/uploads/${img}`;
}
