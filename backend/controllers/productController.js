// controllers/productController.js
const Product = require("../models/Product");
const mongoose = require("mongoose");
const {
  computePrice,
  computePriceBreakdown,
  computePriceExplain,
} = require("../services/pricing");
const {
  getLatestBlockCached,
  purityToCarat,
} = require("../services/goldRates");
// ===== Bulk upload deps =====
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const slugify = require("slugify");

// 🔹 ADD NEW PRODUCT
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    newProduct.finalPrice = calculateFinalPrice(req.body);
    newProduct.totalPayable =
      (newProduct.finalPrice || 0) +
      (req.body.makingCharges || 0) +
      (req.body.gst || 0);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// 🔹 UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const computedFinal = calculateFinalPrice(req.body);
    const payload = {
      ...req.body,
      finalPrice: computedFinal,
      totalPayable:
        (computedFinal || 0) +
        (req.body.makingCharges || 0) +
        (req.body.gst || 0),
    };

    const updated = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    res.status(200).json({ message: "Product updated", product: updated });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// 🔹 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// 🔹 GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { category, purity, metalType, name, sort } = req.query;
    const filter = {};

    if (category) filter.category = { $in: category.split(",") };
    if (purity) filter.purity = { $in: purity.split(",") };
    if (metalType) filter.metalType = { $in: metalType.split(",") };
    if (name) filter.name = { $regex: name, $options: "i" };

    let query = Product.find(filter);

    if (sort === "priceLowToHigh") query = query.sort({ price: 1 });
    if (sort === "priceHighToLow") query = query.sort({ price: -1 });
    if (sort === "latest") query = query.sort({ createdAt: -1 });

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// 🔹 GET SINGLE PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: "Not found" });

    // Apply only if metal is Gold (case-insensitive)
    if (String(p.metalType || "").toLowerCase() === "gold") {
      const latest = await getLatestBlockCached();
      if (latest) {
        const carat = purityToCarat(p.purity);
        const rate = latest[carat]?.ratePerGram;

        if (rate) {
          // ✅ Compute breakdown and explanation
          const b = computePriceBreakdown({ ratePerGram: rate, product: p });
          const explain = computePriceExplain({
            ratePerGram: rate,
            product: p,
          });

          // ✅ Assign display fields
          p.displayActual = explain.actualPrice;
          p.displaySale = explain.salesPrice;
          p.displayPrice = explain.salesPrice;
          p.breakdown = b;

          // ✅ Include rate source
          p.priceSource = {
            carat,
            ratePerGram: rate,
            effectiveDate: latest[carat].effectiveDate,
            source: latest[carat].source,
          };

          // ✅ Optional debug info
          if (String(req.query.debug) === "1") {
            p.debugPricing = explain;
          }
        }
      }
    }

    res.json(p);
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// 🔹 GET PRODUCTS BY COMBO GROUP
const getComboProducts = async (req, res) => {
  try {
    const products = await Product.find({ comboGroupId: req.params.groupId });
    res.status(200).json(products);
  } catch (err) {
    console.error("Combo Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch combo products" });
  }
};

// 🔹 GET RELATED PRODUCTS
const getRelatedProducts = async (req, res) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) return res.status(404).json({ error: "Product not found" });

    const related = await Product.find({
      _id: { $ne: current._id },
      category: current.category,
      metalType: current.metalType,
    }).limit(6);

    res.status(200).json(related);
  } catch (err) {
    console.error("Related Error:", err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
};

// 🔹 SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  try {
    const term = req.params.term;
    const results = await Product.find({
      $or: [
        { name: new RegExp(term, "i") },
        { category: new RegExp(term, "i") },
        { metalType: new RegExp(term, "i") },
        { tags: { $in: [term] } },
      ],
    });
    res.status(200).json(results);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

// ===== PRICE HELPER (kept consistent with your code) =====
const calculateFinalPrice = (data) => {
  const metal = data.metalType || data.category;

  if (metal === "Gold") {
    const rate = data.price;
    const purity = parseInt(data.purity) || 24;
    const derivedRate = rate * (purity / 24);
    return Math.round((data.netWeight || 0) * derivedRate);
  }

  if (metal === "Platinum") {
    const rate = data.price;
    const purity = parseInt(data.purity) || 100;
    const derivedRate = rate * (purity / 100);
    return Math.round((data.netWeight || 0) * derivedRate);
  }

  if (metal === "Diamond" || metal === "Silver") {
    return data.price;
  }

  return data.price;
};

// ===== EXTRA LIST ENDPOINTS (as in your file) =====
// 🔹 GET GOLD PRODUCTS (compute-on-read)
const getGoldProducts = async (req, res) => {
  try {
    // 1) Fetch all gold products (case-insensitive)
    const items = await Product.find({ metalType: /gold/i }).lean();

    // 2) Get latest gold rate block (cached)
    const latest = await getLatestBlockCached();

    if (latest) {
      for (const p of items) {
        const carat = purityToCarat(p.purity);
        const rate = latest[carat]?.ratePerGram;
        if (!rate) continue;

        // ✅ Compute using breakdown helper
        const b = computePriceBreakdown({ ratePerGram: rate, product: p });

        // ✅ Compute explanation (for debug and traceability)
        const explain = computePriceExplain({ ratePerGram: rate, product: p });

        // ✅ Assign computed display fields
        p.displayActual = explain.actualPrice;
        p.displaySale = explain.salesPrice;
        p.displayPrice = explain.salesPrice; // used by UI
        p.breakdown = b;

        // ✅ Rate source info
        p.priceSource = {
          carat,
          ratePerGram: rate,
          effectiveDate: latest[carat].effectiveDate,
          source: latest[carat].source,
        };

        // ✅ Optional debug info (only if ?debug=1)
        if (String(req.query.debug) === "1") {
          p.debugPricing = explain;
        }
      }
    }

    // 3) Send enriched items
    res.json({ items });
  } catch (err) {
    console.error("getGoldProducts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getSilverProducts = async (req, res) => {
  try {
    const { name, category, purity, sort } = req.query;

    const filter = {
      metalType: { $regex: /silver/i }, // case-insensitive
      isPublished: true,
    };
    if (category) filter.category = { $in: String(category).split(",") };
    if (purity) filter.purity = { $in: String(purity).split(",") };
    if (name) filter.name = { $regex: String(name), $options: "i" };

    let q = Product.find(filter);

    if (sort === "priceLowHigh") q = q.sort({ price: 1 });
    if (sort === "priceHighLow") q = q.sort({ price: -1 });
    if (sort === "newest") q = q.sort({ createdAt: -1 });

    const items = await q;
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Error fetching silver products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const getDiamondProducts = async (req, res) => {
  try {
    const { name, category, purity, sort } = req.query;

    const filter = {
      metalType: { $regex: /diamond/i },
      isPublished: { $in: [true, "true", 1] },
    };

    if (category) filter.category = { $in: String(category).split(",") };
    if (name) filter.name = { $regex: String(name), $options: "i" };

    // accept purity as "VVS1" type strings OR numeric scales if you use numbers
    // if your diamond purity is textual (VVS1, VS, SI), this block still works (string branch).
    let orPurity = null;
    if (purity) {
      const list = String(purity).split(",");
      const nums = list.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
      orPurity = [];
      if (list.length) orPurity.push({ purity: { $in: list } }); // strings
      if (nums.length) orPurity.push({ purity: { $in: nums } }); // numbers
    }

    let q = Product.find(orPurity ? { ...filter, $or: orPurity } : filter);

    if (sort === "priceLowHigh") q = q.sort({ price: 1 });
    if (sort === "priceHighLow") q = q.sort({ price: -1 });
    if (sort === "newest") q = q.sort({ createdAt: -1 });

    const items = await q;
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Error fetching diamond products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// PLATINUM
const getPlatinumProducts = async (req, res) => {
  try {
    const { name, category, purity, sort } = req.query;

    const filter = {
      metalType: { $regex: /platinum/i },
      isPublished: { $in: [true, "true", 1] },
    };

    if (category) filter.category = { $in: String(category).split(",") };
    if (name) filter.name = { $regex: String(name), $options: "i" };

    // handle purity as "950" or 950
    let orPurity = null;
    if (purity) {
      const list = String(purity).split(",");
      const nums = list.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
      orPurity = [];
      if (list.length) orPurity.push({ purity: { $in: list } }); // strings
      if (nums.length) orPurity.push({ purity: { $in: nums } }); // numbers
    }

    let q = Product.find(orPurity ? { ...filter, $or: orPurity } : filter);

    if (sort === "priceLowHigh") q = q.sort({ price: 1 });
    if (sort === "priceHighLow") q = q.sort({ price: -1 });
    if (sort === "newest")       q = q.sort({ createdAt: -1 });

    const items = await q;
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Error fetching platinum products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded." });
    }

    const imagePaths = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const updated = await Product.findByIdAndUpdate(
      productId,
      { $set: { images: imagePaths } },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Images uploaded and product updated",
      images: imagePaths,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      isNewArrival: true,
      isPublished: true,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching new arrivals:", error.message);
    res.status(500).json({ error: "Failed to get product" });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isPublished: true,
      isFeatured: true,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: "Failed to get featured products" });
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isPublished: true,
      bestSelling: true,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    res.status(500).json({ error: "Failed to get best selling products" });
  }
};

// ===== BULK UPLOAD (CSV/XLSX) =====

// flexible header mapping → model fields
const FIELD_MAP = {
  name: "name",
  category: "category",
  categoryname: "category", // CSV: categoryName → category
  price: "price",
  sku: "sku", // <-- add this
  ispublished: "isPublished",

  slug: "slug",
  shortdescription: "description", // CSV: shortDescription → description
  description: "description",
  longdescription: "longDescription",
  metaltype: "metalType",
  metalcolor: "metalColor",
  purity: "purity",
  metalcarat: "purity", // CSV: metalCarat (e.g., 22) → purity
  netweight: "netWeight",
  grossweight: "grossWeight",
  discount: "discount",
  makingcharges: "makingCharges",
  gst: "gst",
  tags: "tags",
  images: "images",
  isnewarrival: "isNewArrival",
  isfeatured: "isFeatured",
  bestselling: "bestSelling",
  showinhomepage: "showInHomepage",
  priorityranking: "priorityRanking",
  ispartialpaymentenabled: "isPartialPaymentEnabled",
  issecureplanenabled: "isSecurePlanEnabled",
  isvirtualtryonenabled: "isVirtualTryOnEnabled",

};


function normalizeRow(raw) {
  const rec = {};
  const imgs = [];

  // map known columns and collect image-like columns
  for (const key of Object.keys(raw)) {
    const val = raw[key];
    if (val === undefined || val === null || val === "") continue;

    const clean = String(key).trim();
    const lk = clean.toLowerCase().replace(/\s+/g, "");

    // gather various image columns: image, image1, image2, images[0], imageUrl, etc.
    if (/^images?(\[\d+\]|\d+)?$/.test(lk) || /^imageurl$/.test(lk)) {
      imgs.push(String(val).trim());
      continue;
    }

    const mapped = FIELD_MAP[lk];
    if (mapped) rec[mapped] = val;
  }

  // attach collected images if "images" was not provided
  if (!rec.images && imgs.length) rec.images = imgs;

  // split list fields
  if (typeof rec.tags === "string") {
    rec.tags = rec.tags
      .split(/[,|]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (typeof rec.images === "string") {
    rec.images = rec.images
      .split(/[,|]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // numeric coercion
  [
    "price",
    "discount",
    "makingCharges",
    "gst",
    "netWeight",
    "grossWeight",
    "priorityRanking",
  ].forEach((n) => {
    if (rec[n] !== undefined && rec[n] !== null && rec[n] !== "") {
      rec[n] = Number(rec[n]);
    }
  });

  // booleans
[
  "isNewArrival",
  "isFeatured",
  "bestSelling",
  "showInHomepage",
  "isPublished",
  "isPartialPaymentEnabled",
  "isSecurePlanEnabled",
  "isVirtualTryOnEnabled",
].forEach((b) => {
 if (typeof rec[b] === "string") {
    const s = rec[b].trim();
    // true tokens: TRUE/true/Yes/1/On/Y
    if (/^(1|true|yes|on|y)$/i.test(s)) rec[b] = true;
    // false tokens: FALSE/false/No/0/Off/N  (optional; if not matched above, stays false)
   else if (/^(0|false|no|off|n)$/i.test(s)) rec[b] = false;
    else rec[b] = false; // fallback
  }
});


  // fallbacks for missing category
  if (!rec.category && raw.categoryName)
    rec.category = String(raw.categoryName).trim();
  if (!rec.category && rec.metalType) rec.category = rec.metalType;

  // slug
  if (!rec.slug && rec.name) {
    rec.slug = slugify(rec.name, { lower: true, strict: true });
  }

  return rec;
}

function upsertFilter(doc) {
  return doc.slug ? { slug: doc.slug } : { name: doc.name };
}

const bulkUploadProducts = async (req, res) => {
  try {
    const dryRun = String(req.query.dryRun || "false").toLowerCase() === "true";
    if (!req.file) return res.status(400).json({ error: "file is required" });

    // Parse from memory buffer (no filesystem dependency)
    let workbook;
    try {
      if (req.file.buffer) {
        workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      } else if (req.file.path) {
        // fallback if disk storage is ever used
        workbook = XLSX.readFile(req.file.path);
      } else {
        return res.status(400).json({ error: "Invalid upload payload" });
      }
    } catch (e) {
      return res
        .status(400)
        .json({ error: "Unable to read spreadsheet. Use CSV/XLS/XLSX." });
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      return res.status(400).json({ error: "No rows found in file" });
    }

    const errors = [];
    const results = [];
    const ops = [];
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];
      const rowNum = i + 2; // header is row 1
      const doc = normalizeRow(raw);

      const missing = [];
      if (!doc.name) missing.push("name");
      if (!doc.category) missing.push("category");
      if (doc.price === undefined || doc.price === null || doc.price === "")
        missing.push("price");

      if (missing.length) {
        failed++;
        errors.push({
          row: rowNum,
          reason: `Missing required: ${missing.join(", ")}`,
        });
        continue;
      }

      doc.finalPrice = calculateFinalPrice(doc);
      doc.totalPayable =
        (doc.finalPrice || 0) + (doc.makingCharges || 0) + (doc.gst || 0);

      if (dryRun) {
        results.push({
          row: rowNum,
          action: "validate",
          ok: true,
          name: doc.name,
        });
        continue;
      }

      ops.push({
        updateOne: {
          filter: upsertFilter(doc),
          update: { $set: doc },
          upsert: true,
        },
      });
      results.push({ row: rowNum, action: "upsert", name: doc.name });
    }

    let inserted = 0;
    let updated = 0;

    if (!dryRun && ops.length) {
      const bulk = await Product.bulkWrite(ops, { ordered: false });
      inserted = bulk.upsertedCount || 0;
      updated = bulk.modifiedCount || 0;
    }

    return res.json({
      summary: {
        totalRows: rows.length,
        inserted,
        updated,
        failed,
        dryRun,
      },
      errors,
      sample: results.slice(0, 10),
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Bulk upload failed" });
  }
};
exports.getPublicProducts = async (req, res) => {
  try {
    // 1) load products from DB with only fields we need for price
    const items = await Product.find(/* your filters */)
      .select({
        name: 1,
        price: 1,
        metalType: 1,
        purity: 1,
        netWeight: 1,
        grossWeight: 1,
        makingCharge: 1,
        wastageCharge: 1,
        images: 1,
      })
      .lean();

    // 2) get latest 24K/22K/18K block once
    const latest = await getLatestBlockCached();

    // 3) attach displayPrice on gold items
    if (latest) {
      for (const p of items) {
        if (String(p.metalType || "").toLowerCase() !== "gold") continue;
        const carat = purityToCarat(p.purity);
        const rate = latest[carat]?.ratePerGram;
        if (!rate) continue;

        p.displayPrice = computePrice({ ratePerGram: rate, product: p });
        p.priceSource = {
          carat,
          ratePerGram: rate,
          effectiveDate: latest[carat].effectiveDate,
          source: latest[carat].source,
        };
      }
    }

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getBulkTemplate = async (req, res) => {
  const header = [
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
    "isPartialPaymentEnabled",
    "isSecurePlanEnabled",
    "isVirtualTryOnEnabled",
  ];
  const ws = XLSX.utils.aoa_to_sheet([header]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=thiaworld-products-template.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buf);
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getComboProducts,
  getRelatedProducts,
  searchProducts,
  getBestSellingProducts,
  getGoldProducts,
  getSilverProducts,
  getDiamondProducts,
  getPlatinumProducts,
  uploadProductImages,
  getNewArrivals,
  getFeaturedProducts,

  // bulk
  bulkUploadProducts,
  getBulkTemplate,
};
