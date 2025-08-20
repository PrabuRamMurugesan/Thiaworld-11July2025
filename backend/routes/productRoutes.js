// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const productController = require("../controllers/productController");
const uploadImages = require("../middleware/upload"); // existing images upload

// ===== bulk upload storage (CSV/XLSX) =====
// Use in-memory storage to avoid filesystem path errors (ENOENT) on Windows/Linux
const uploadBulk = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// CRUD
router.post("/add", productController.addProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

// Lists
router.get("/all", productController.getAllProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/featured", productController.getFeaturedProducts);
router.get("/best-selling", productController.getBestSellingProducts);

router.get("/gold", productController.getGoldProducts);
router.get("/silver", productController.getSilverProducts);
router.get("/diamond", productController.getDiamondProducts);
router.get("/platinum", productController.getPlatinumProducts);

router.get("/combo/:comboGroupId", productController.getComboProducts);
router.get("/related/:id", productController.getRelatedProducts);

// Images
router.post(
  "/upload-images",
  uploadImages.array("images"),
  productController.uploadProductImages
);

// ===== bulk upload endpoints =====
router.post(
  "/bulk-upload",
  uploadBulk.single("file"),
  productController.bulkUploadProducts
);
router.get("/bulk-template", productController.getBulkTemplate);

// Keep :id last
router.get("/:id", productController.getProductById);

module.exports = router;
