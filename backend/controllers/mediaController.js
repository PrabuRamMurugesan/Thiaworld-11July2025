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

// === Added code block (from user snippet) ===
const UPLOAD_ROOT =
  process.env.UPLOAD_ROOT || path.join(__dirname, "..", "uploads");
const BASE_ASSETS_URL = process.env.BASE_ASSETS_URL || "http://localhost:5001";

// e.g., thia/2025/11
function todayRelFolder() {
  const d = new Date();
  return path.join(
    "thia",
    String(d.getFullYear()),
    String(d.getMonth() + 1).padStart(2, "0")
  );
}

const storageForSnippet = multer.diskStorage({
  destination: (req, file, cb) => {
    const rel = todayRelFolder();
    const abs = path.join(UPLOAD_ROOT, rel);
    fs.mkdirSync(abs, { recursive: true });
    cb(null, abs);
  },
  filename: (req, file, cb) => {
    const base =
      (file.originalname || "file").split(".").slice(0, -1).join(".") || "file";
    cb(null, `${base}-${Date.now()}.webp`); // consistent webp naming
  },
});

const upload = multer({ storage: storageForSnippet }).array("files", 20);

// when you save URLs, always build like this:
function toPublicUrl(absPath) {
  // absPath = e.g., E:\...\backend\uploads\thia\2025\11\file.webp
  const relFromRoot = absPath
    .replace(UPLOAD_ROOT + path.sep, "")
    .replace(/\\/g, "/");
  return `${BASE_ASSETS_URL}/uploads/${relFromRoot}`;
}
// === End of added code block ===

// Retain existing constants (keep both for compatibility)
const BASE_ASSETS_URL_FALLBACK =
  process.env.BASE_ASSETS_URL ||
  process.env.VITE_API_URI ||
  "https://thiaworld.bbscart.com";
const UPLOAD_ROOT_FALLBACK =
  process.env.UPLOAD_ROOT || path.join(process.cwd(), "uploads");

// Keep your original multer setup (used in current uploadMedia)
function todayRelFolderOriginal() {
  const now = new Date();
  return path.join(
    "thia",
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0")
  );
}

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

function isImage(mime) {
  return /^image\/(jpeg|png|webp|gif|svg\+xml)$/i.test(mime);
}
function isVideo(mime) {
  return /^video\//i.test(mime);
}

exports.uploadMedia = (req, res) => {
  uploadMulter(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });
    const results = [];

    for (const f of req.files || []) {
      try {
        const relFolder = path.relative(
          UPLOAD_ROOT_FALLBACK,
          path.dirname(f.path)
        );
        const relKey = path.join(relFolder, path.parse(f.filename).name);
        const baseNameNoExt = path.parse(f.filename).name;
        const uploadsRootAbs = UPLOAD_ROOT_FALLBACK;

        let processed;
        if (isImage(f.mimetype)) {
          processed = await processImage({
            srcAbsPath: f.path,
            relFolder,
            baseNameNoExt,
            uploadsRootAbs,
            baseUrl: BASE_ASSETS_URL_FALLBACK,
          });
        } else if (isVideo(f.mimetype)) {
          processed = await processVideo({
            srcAbsPath: f.path,
            relFolder,
            baseNameNoExt,
            uploadsRootAbs,
            baseUrl: BASE_ASSETS_URL_FALLBACK,
          });
        } else {
          const relOut = path.join(relFolder, f.filename);
          processed = {
            type: "other",
            canonical: {
              url: `${BASE_ASSETS_URL_FALLBACK}/uploads/${relOut.replace(
                /\\/g,
                "/"
              )}`,
              size: f.size,
              mime: f.mimetype,
              label: "original",
            },
            variants: [],
          };
        }

        if (processed.type === "image" || processed.type === "video") {
          try {
            fs.unlinkSync(f.path);
          } catch (e) {}
        }

        const doc = await Media.create({
          filename: `${baseNameNoExt}.${
            processed.type === "video"
              ? "webm"
              : processed.type === "image"
              ? "webp"
              : path.extname(f.filename).slice(1)
          }`,
          originalName: f.originalname,
          type: processed.type,
          status: "ready",
          storageProvider: "local",
          folder: relFolder,
          path: relKey,
          url: processed.canonical.url,
          size: processed.canonical.size || f.size || 0,
          mime: processed.canonical.mime || f.mimetype,
          width: processed.canonical.width || null,
          height: processed.canonical.height || null,
          duration: processed.duration || null,
          posterUrl: processed.posterUrl || null,
          variants: processed.variants || [],
          uploadedBy: (req.user && (req.user.email || req.user.id)) || "system",
        });

        results.push({
          id: String(doc._id),
          url: doc.url,
          filename: doc.filename,
          type: doc.type,
          posterUrl: doc.posterUrl || null,
        });
      } catch (e) {
        console.error("Upload process error:", e);
        results.push({ error: e.message, originalName: f.originalname });
      }
    }

    res.json({ ok: true, count: results.length, items: results });
  });
};

// keep all other exports unchanged (listMedia, updateMedia, replaceMedia, deleteMedia)
exports.listMedia = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit || "40", 10), 1),
    100
  );
  const search = (req.query.search || "").trim();
  const type = (req.query.type || "").trim();

  const q = { deleted: { $ne: true } };
  if (search)
    q.filename = {
      $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  if (type) q.type = type;

  const [items, total] = await Promise.all([
    Media.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Media.countDocuments(q),
  ]);

  res.json({
    ok: true,
    page,
    limit,
    total,
    items: items.map((i) => ({
      id: i._id,
      filename: i.filename,
      url: i.url,
      type: i.type,
      posterUrl: i.posterUrl || null,
      size: i.size,
      mime: i.mime,
      createdAt: i.createdAt,
      variants: i.variants || [],
    })),
  });
};

exports.updateMedia = async (req, res) => {
  const { id } = req.params;
  const { filename, title, altText, description, tags } = req.body || {};
  const doc = await Media.findById(id);
  if (!doc || doc.deleted)
    return res.status(404).json({ ok: false, error: "Not found" });

  if (filename && typeof filename === "string") {
    doc.filename = filename.trim();
  }
  if (title !== undefined) doc.title = title;
  if (altText !== undefined) doc.altText = altText;
  if (description !== undefined) doc.description = description;
  if (Array.isArray(tags)) doc.tags = tags;

  await doc.save();
  res.json({ ok: true, item: doc });
};


exports.replaceMedia = async (req, res) => {
  // Replace file and re-process
  const { id } = req.params;
  const doc = await Media.findById(id);
  if (!doc || doc.deleted)
    return res.status(404).json({ ok: false, error: "Not found" });

  const single = multer({
    storage: multer.diskStorage({
      destination: (reqx, file, cb) => {
        const relFolder = doc.folder || todayRelFolder();
        const absFolder = path.join(UPLOAD_ROOT, relFolder);
        ensureDirSync(absFolder);
        cb(null, absFolder);
      },
      filename: (reqx, file, cb) => {
        const base = path.parse(file.originalname).name;
        const safe = slugify(base, { lower: true, strict: true }) || "media";
        const stamp = Date.now();
        cb(
          null,
          `${safe}-${stamp}${path.extname(file.originalname).toLowerCase()}`
        );
      },
    }),
  }).single("file");

  single(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });

    try {
      const f = req.file;
      const relFolder = path.relative(UPLOAD_ROOT, path.dirname(f.path));
      const baseNameNoExt = path.parse(f.filename).name;

      let processed;
      if (isImage(f.mimetype)) {
        processed = await processImage({
          srcAbsPath: f.path,
          relFolder,
          baseNameNoExt,
          uploadsRootAbs: UPLOAD_ROOT,
          baseUrl: BASE_ASSETS_URL,
        });
      } else if (isVideo(f.mimetype)) {
        processed = await processVideo({
          srcAbsPath: f.path,
          relFolder,
          baseNameNoExt,
          uploadsRootAbs: UPLOAD_ROOT,
          baseUrl: BASE_ASSETS_URL,
        });
      } else {
        const relOut = path.join(relFolder, f.filename);
        processed = {
          type: "other",
          canonical: {
            url: `${BASE_ASSETS_URL}/uploads/${relOut.replace(/\\/g, "/")}`,
            size: f.size,
            mime: f.mimetype,
            label: "original",
          },
          variants: [],
        };
      }

      // Remove previous variant files (best effort)
      for (const v of doc.variants || []) {
        try {
          const rel = v.url.split("/uploads/")[1];
          if (rel) fs.unlinkSync(path.join(UPLOAD_ROOT, rel));
        } catch (e) {}
      }
      try {
        const rel = doc.url.split("/uploads/")[1];
        if (rel) fs.unlinkSync(path.join(UPLOAD_ROOT, rel));
      } catch (e) {}

      // Remove uploaded temp if processed
      if (processed.type === "image" || processed.type === "video") {
        try {
          fs.unlinkSync(f.path);
        } catch (e) {}
      }

      // Update doc
      doc.type = processed.type;
      doc.folder = relFolder;
      doc.path = path.join(relFolder, baseNameNoExt);
      doc.url = processed.canonical.url;
      doc.size = processed.canonical.size || f.size || 0;
      doc.mime = processed.canonical.mime || f.mimetype;
      doc.width = processed.canonical.width || null;
      doc.height = processed.canonical.height || null;
      doc.duration = processed.duration || null;
      doc.posterUrl = processed.posterUrl || null;
      doc.variants = processed.variants || [];
      await doc.save();

      res.json({ ok: true, item: doc });
    } catch (e) {
      console.error("Replace error:", e);
      res.status(500).json({ ok: false, error: e.message });
    }
  });
};

exports.deleteMedia = async (req, res) => {
  const { id } = req.params;
  const hard = String(req.query.hard || "").toLowerCase() === "true";
  const doc = await Media.findById(id);
  if (!doc) return res.status(404).json({ ok: false, error: "Not found" });

  if (hard) {
    // delete files
    for (const v of doc.variants || []) {
      try {
        const rel = v.url.split("/uploads/")[1];
        if (rel) fs.unlinkSync(path.join(UPLOAD_ROOT, rel));
      } catch {}
    }
    try {
      const rel = doc.url.split("/uploads/")[1];
      if (rel) fs.unlinkSync(path.join(UPLOAD_ROOT, rel));
    } catch {}

    await doc.deleteOne();
    return res.json({ ok: true, deleted: "hard" });
  }

  // soft delete
  doc.deleted = true;
  doc.deletedAt = new Date();
  await doc.save();
  res.json({ ok: true, deleted: "soft" });
};
