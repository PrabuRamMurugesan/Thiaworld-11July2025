// models/Media.js
const mongoose = require("mongoose");

/**
 * Roles & Access
 * - ROLES: who can own/manage media
 * - ACCESS_LEVELS: visibility defaults
 * - ACL entries: optional per-item overrides
 */
const ROLES = ["admin", "manager", "staff", "vendor", "editor", "viewer"];
const ACCESS_LEVELS = ["public", "private", "restricted"];

/**
 * Variants for processed outputs
 *  - images: webp, thumb
 *  - videos: webm, poster
 */
const VariantSchema = new mongoose.Schema(
  {
    label: { type: String }, // 'webp' | 'thumb' | 'webm' | 'poster' | custom
    url: { type: String, required: true }, // public URL
    width: { type: Number },
    height: { type: Number },
    size: { type: Number }, // bytes
    mime: { type: String }, // 'image/webp', 'video/webm'
    quality: { type: Number }, // for images (webp)
  },
  { _id: false }
);

/**
 * Optional per-item ACL override.
 * If present and accessLevel === 'restricted', enforce these.
 */
const AclEntrySchema = new mongoose.Schema(
  {
    role: { type: String, enum: ROLES, required: true }, // e.g., 'staff'
    canView: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
  },
  { _id: false }
);

const MediaSchema = new mongoose.Schema(
  {
    // Identity
    filename: { type: String, required: true, index: true }, // stored canonical name (e.g., .webp / .webm)
    originalName: { type: String }, // client original filename
    type: { type: String, index: true }, // 'image' | 'video' | 'document' | 'audio' | 'other'
    status: { type: String, index: true, default: "ready" }, // 'ready' | 'processing' | 'failed' | 'deleted' | 'quarantined'

    // Storage / CDN
    storageProvider: { type: String, index: true, default: "local" }, // 'local' | 'do-spaces' | 's3' | 'r2' ...
    bucket: { type: String }, // for object storage providers
    folder: { type: String, index: true }, // e.g., 'thia/2025/11'
    path: { type: String }, // provider key without '/uploads' prefix
    url: { type: String, required: true }, // canonical public URL
    size: { type: Number, default: 0 }, // bytes (canonical)
    mime: { type: String, default: "" },

    // Technical integrity (optional, helpful for dedup/health)
    etag: { type: String },
    checksum: { type: String, index: true }, // SHA256/MD5
    cacheControl: { type: String }, // e.g., 'public, max-age=31536000, immutable'
    signed: { type: Boolean, default: false },
    signedUrlTTL: { type: Number }, // seconds
    expiresAt: { type: Date }, // optional expiry

    // Image/Video properties
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number }, // videos
    posterUrl: { type: String }, // videos
    variants: { type: [VariantSchema], default: [] }, // derived outputs

    // SEO & metadata (lightweight)
    title: { type: String },
    altText: { type: String },
    description: { type: String },
    tags: { type: [String], index: true }, // e.g., ['gold', 'anklet']

    // Ownership & Roles
    uploadedBy: { type: String, index: true }, // user id/email
    uploaderRole: { type: String, enum: ROLES, index: true, default: "staff" },

    // Access control
    accessLevel: {
      type: String,
      enum: ACCESS_LEVELS,
      index: true,
      default: "public",
    },
    acl: { type: [AclEntrySchema], default: [] }, // only used when accessLevel='restricted'

    // Relationships & usage (optional; can be filled by other services)
    linkedProducts: { type: [String], index: true }, // product ids/SKUs using this media
    linkedCategories: { type: [String], index: true },
    linkedCollections: { type: [String], index: true },
    referenceCount: { type: Number, index: true, default: 0 },
    lastReferencedAt: { type: Date, index: true },

    // Lifecycle
    deleted: { type: Boolean, index: true, default: false },
    deletedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

/** Practical indexes for speed */
MediaSchema.index({ type: 1, createdAt: -1 });
MediaSchema.index({ uploadedBy: 1, createdAt: -1 });
MediaSchema.index({ deleted: 1, recycleBinUntil: 1 }, { sparse: true });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ accessLevel: 1 });
MediaSchema.index({ referenceCount: -1 });
MediaSchema.index({ lastReferencedAt: -1 });

/**
 * Convenience helpers (optional to use in controllers)
 * - hasRolePermission: evaluate ACL for a given role/action
 */
MediaSchema.methods.hasRolePermission = function (
  role,
  action /* 'view'|'edit'|'delete' */
) {
  // Public: everyone can view
  if (this.accessLevel === "public" && action === "view") return true;

  // Private: only admins/managers (and uploader) can view/edit/delete by default
  if (this.accessLevel === "private") {
    if (role === "admin" || role === "manager") return true;
    // Uploader can edit/delete their own items (basic policy; tweak as needed)
    if (
      String(this.uploaderRole) === role &&
      (action === "view" || action === "edit")
    )
      return true;
    return false;
  }

  // Restricted: use ACL entries
  if (this.accessLevel === "restricted") {
    const entry = (this.acl || []).find((e) => e.role === role);
    if (!entry) return false;
    if (action === "view") return !!entry.canView;
    if (action === "edit") return !!entry.canEdit;
    if (action === "delete") return !!entry.canDelete;
    return false;
  }

  // Fallback deny
  return false;
};

const Model = mongoose.model("Media", MediaSchema);

/** Export model + role constants without breaking existing imports */
module.exports = Model;
module.exports.ROLES = ROLES;
module.exports.ACCESS_LEVELS = ACCESS_LEVELS;
