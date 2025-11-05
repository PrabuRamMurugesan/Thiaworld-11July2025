// controllers/mediaController.js
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const slugify = require("slugify");
const Media = require("../models/Media");
const {
  processImage,
  processVideo,
  ensureDirSync,
} = require("../services/mediaProcessor");

/* =========================
   ENV / CONSTANTS (kept)
   ========================= */
const UPLOAD_ROOT =
  process.env.UPLOAD_ROOT || path.join(__dirname, "..", "uploads");

// Single source of truth for public URLs (prod overrides in .env)
const BASE_ASSETS_URL =
  process.env.BASE_ASSETS_URL ||
  process.env.VITE_API_URL || // legacy fallback name (if present)
  process.env.VITE_API_URI || // legacy fallback name (if present)
  "http://localhost:5001";

// Back-compat constants (do not remove; used by older code paths)
const BASE_ASSETS_URL_FALLBACK =
  process.env.BASE_ASSETS_URL ||
  process.env.VITE_API_URL ||
  process.env.VITE_API_URI ||
  "http://localhost:5001";

const UPLOAD_ROOT_FALLBACK =
  process.env.UPLOAD_ROOT || path.join(process.cwd(), "uploads");

/* ==========================================
   HELPERS (kept + added flattening utilities)
   ========================================== */
function isImage(mime) {
  return /^image\/(jpeg|png|webp|gif|svg\+xml|bmp|tiff)$/i.test(mime);
}
function isVideo(mime) {
  return /^video\//i.test(mime);
}

// Original dated subfolder (kept for compatibility)
function todayRelFolderOriginal() {
  const now = new Date();
  return path.join(
    "thia",
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0")
  );
}

// Multer storage (kept). We will later FLATTEN final outputs to /uploads root.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const relFolder = todayRelFolderOriginal();
    const absFolder = path.join(UPLOAD_ROOT_FALLBACK, relFolder);
    ensureDirSync(absFolder);
    cb(null, absFolder);
  },
  filename: (req, file, cb) => {
    const base = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = slugify(base, { lower: true, strict: true }) || "media";
    const stamp = Date.now();
    cb(null, `${safe}-${stamp}${ext}`);
  },
});

const uploadMulter = multer({
  storage,
  limits: {
    fileSize: 800 * 1024 * 1024, // 800MB per file
    files: 50,
  },
}).array("files", 50);

// URL/Path flattening helpers
function relFromPublicUrl(u) {
  const bases = [
    `${BASE_ASSETS_URL}/uploads/`,
    `${BASE_ASSETS_URL_FALLBACK}/uploads/`,
  ];
  for (const b of bases) {
    if (u && typeof u === "string" && u.startsWith(b)) return u.slice(b.length);
  }
  if (u && !/^https?:\/\//i.test(u)) return u.replace(/^\/?uploads\/?/i, "");
  return null;
}

function absFromPublicUrl(u) {
  const rel = relFromPublicUrl(u);
  if (!rel) return null;
  const safeRel = rel.replace(/\//g, path.sep);
  return path.join(UPLOAD_ROOT, safeRel);
}

function moveToRootIfNeeded(fromAbs) {
  if (!fromAbs) return null;
  // already at root?
  const rel = path.relative(UPLOAD_ROOT, fromAbs);
  if (!rel || rel === "" || (!rel.includes(path.sep) && !rel.includes("/"))) {
    return fromAbs;
  }
  const toAbs = path.join(UPLOAD_ROOT, path.basename(fromAbs));
  try {
    ensureDirSync(UPLOAD_ROOT);
    if (fs.existsSync(fromAbs)) {
      if (!fs.existsSync(toAbs)) fs.renameSync(fromAbs, toAbs);
    }
    return toAbs;
  } catch {
    return fromAbs;
  }
}

function toFlatPublicUrl(absAtRoot) {
  const file = path.basename(absAtRoot);
  return `${BASE_ASSETS_URL}/uploads/${file}`;
}

function flattenProcessedOutputs(proc) {
  if (!proc || !proc.canonical || !proc.canonical.url) return proc;

  // canonical
  const cAbs = absFromPublicUrl(proc.canonical.url);
  const cRoot = moveToRootIfNeeded(cAbs);
  const cUrl = cRoot ? toFlatPublicUrl(cRoot) : proc.canonical.url;

  // variants
  const outVariants = [];
  for (const v of proc.variants || []) {
    if (!v || !v.url) continue;
    const vAbs = absFromPublicUrl(v.url);
    const vRoot = moveToRootIfNeeded(vAbs);
    outVariants.push({
      ...v,
      url: vRoot ? toFlatPublicUrl(vRoot) : v.url,
    });
  }

  // poster (video)
  let posterUrl = proc.posterUrl || null;
  if (posterUrl) {
    const pAbs = absFromPublicUrl(proc.posterUrl);
    const pRoot = moveToRootIfNeeded(pAbs);
    posterUrl = pRoot ? toFlatPublicUrl(pRoot) : proc.posterUrl;
  }

  return {
    ...proc,
    canonical: { ...proc.canonical, url: cUrl },
    variants: outVariants,
    posterUrl,
  };
}

function buildDocFromProcessed(proc, userId) {
  const fileUrl = proc?.canonical?.url || "";
  const filename = fileUrl ? path.basename(fileUrl) : "";
  return {
    type: proc.type || "image",
    url: fileUrl,
    filename,
    folder: "", // flattened
    variants: proc.variants || [],
    width: proc?.canonical?.width,
    height: proc?.canonical?.height,
    size: proc?.canonical?.size,
    mime: proc?.canonical?.mime || "image/webp",
    uploadedBy: userId || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/* =========================
   CONTROLLERS (kept + fixes)
   ========================= */

// GET /api/media
exports.listMedia = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "40", 10), 1),
      200
    );
    const search = (req.query.search || "").trim();
    const type = (req.query.type || "").trim();
    const q = { deleted: { $ne: true } };

    if (search) {
      q.$or = [
        { filename: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }
    if (type) q.type = type;

    const total = await Media.countDocuments(q);
    const items = await Media.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      ok: true,
      page,
      limit,
      total,
      items,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};

// POST /api/media/upload
exports.uploadMedia = (req, res) => {
  uploadMulter(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });

    try {
      const results = [];

      for (const f of req.files || []) {
        const relFolder = path.relative(
          UPLOAD_ROOT_FALLBACK,
          path.dirname(f.path)
        );
        const baseNameNoExt = path.parse(f.filename).name;

        let processed;
        if (isImage(f.mimetype)) {
          processed = await processImage({
            srcAbsPath: f.path,
            relFolder,
            baseNameNoExt,
            uploadsRootAbs: UPLOAD_ROOT_FALLBACK,
            baseUrl: BASE_ASSETS_URL_FALLBACK,
          });
        } else if (isVideo(f.mimetype)) {
          processed = await processVideo({
            srcAbsPath: f.path,
            relFolder,
            baseNameNoExt,
            uploadsRootAbs: UPLOAD_ROOT_FALLBACK,
            baseUrl: BASE_ASSETS_URL_FALLBACK,
          });
        } else {
          // Unknown type: just move to root and expose raw file
          const moved = moveToRootIfNeeded(path.resolve(f.path));
          processed = {
            type: "file",
            canonical: {
              url: moved
                ? toFlatPublicUrl(moved)
                : `${BASE_ASSETS_URL}/uploads/${f.filename}`,
              size: f.size,
              mime: f.mimetype,
              label: "file",
            },
            variants: [],
          };
        }

        // FLATTEN to /uploads root and fix URLs to BASE_ASSETS_URL
        const flat = flattenProcessedOutputs(processed);
        const docData = buildDocFromProcessed(flat, req.user?._id);

        const doc = await Media.create(docData);
        results.push(doc);
      }

      return res.json({ ok: true, items: results });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  });
};

// PUT /api/media/:id
exports.updateMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};

    const doc = await Media.findById(id);
    if (!doc) return res.status(404).json({ ok: false, error: "Not found" });

    // allow edits on a few fields
    if (typeof payload.title === "string") doc.title = payload.title.trim();
    if (Array.isArray(payload.tags))
      doc.tags = payload.tags.map((t) => String(t).trim()).filter(Boolean);
    if (typeof payload.description === "string")
      doc.description = payload.description.trim();

    doc.updatedAt = new Date();
    await doc.save();

    return res.json({ ok: true, item: doc });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};

// PUT /api/media/:id/replace
exports.replaceMedia = async (req, res) => {
  const single = multer({ storage }).single("file");
  single(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });

    try {
      const id = req.params.id;
      const doc = await Media.findById(id);
      if (!doc) return res.status(404).json({ ok: false, error: "Not found" });

      const relFolder = path.relative(
        UPLOAD_ROOT_FALLBACK,
        path.dirname(req.file.path)
      );
      const baseNameNoExt = path.parse(req.file.filename).name;

      let processed;
      if (isImage(req.file.mimetype)) {
        processed = await processImage({
          srcAbsPath: req.file.path,
          relFolder,
          baseNameNoExt,
          uploadsRootAbs: UPLOAD_ROOT_FALLBACK,
          baseUrl: BASE_ASSETS_URL_FALLBACK,
        });
      } else if (isVideo(req.file.mimetype)) {
        processed = await processVideo({
          srcAbsPath: req.file.path,
          relFolder,
          baseNameNoExt,
          uploadsRootAbs: UPLOAD_ROOT_FALLBACK,
          baseUrl: BASE_ASSETS_URL_FALLBACK,
        });
      } else {
        const moved = moveToRootIfNeeded(path.resolve(req.file.path));
        processed = {
          type: "file",
          canonical: {
            url: moved
              ? toFlatPublicUrl(moved)
              : `${BASE_ASSETS_URL}/uploads/${req.file.filename}`,
            size: req.file.size,
            mime: req.file.mimetype,
            label: "file",
          },
          variants: [],
        };
      }

      const flat = flattenProcessedOutputs(processed);

      // Old file cleanup (best-effort)
      try {
        const rel = relFromPublicUrl(doc.url);
        if (rel) {
          const abs = path.join(UPLOAD_ROOT, rel);
          if (fs.existsSync(abs)) fs.unlinkSync(abs);
        }
        for (const v of doc.variants || []) {
          const vRel = relFromPublicUrl(v.url);
          if (vRel) {
            const vAbs = path.join(UPLOAD_ROOT, vRel);
            if (fs.existsSync(vAbs)) fs.unlinkSync(vAbs);
          }
        }
      } catch {}

      // Update document with new flattened data
      doc.type = flat.type || doc.type;
      doc.url = flat.canonical?.url || doc.url;
      doc.filename = doc.url ? path.basename(doc.url) : doc.filename;
      doc.folder = ""; // flattened
      doc.variants = Array.isArray(flat.variants) ? flat.variants : [];
      doc.width = flat?.canonical?.width ?? doc.width;
      doc.height = flat?.canonical?.height ?? doc.height;
      doc.size = flat?.canonical?.size ?? doc.size;
      doc.mime = flat?.canonical?.mime ?? doc.mime;
      doc.updatedAt = new Date();

      await doc.save();

      return res.json({ ok: true, item: doc });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  });
};

// DELETE /api/media/:id  (?hard=true for physical delete)
exports.deleteMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const hard = String(req.query.hard || "false").toLowerCase() === "true";

    const doc = await Media.findById(id);
    if (!doc) return res.status(404).json({ ok: false, error: "Not found" });

    if (hard) {
      try {
        const rel = relFromPublicUrl(doc.url);
        if (rel) {
          const abs = path.join(UPLOAD_ROOT, rel);
          if (fs.existsSync(abs)) fs.unlinkSync(abs);
        }
        for (const v of doc.variants || []) {
          const vRel = relFromPublicUrl(v.url);
          if (vRel) {
            const vAbs = path.join(UPLOAD_ROOT, vRel);
            if (fs.existsSync(vAbs)) fs.unlinkSync(vAbs);
          }
        }
      } catch {}

      await doc.deleteOne();
      return res.json({ ok: true, deleted: "hard" });
    }

    // soft delete
    doc.deleted = true;
    doc.deletedAt = new Date();
    await doc.save();
    return res.json({ ok: true, deleted: "soft" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
