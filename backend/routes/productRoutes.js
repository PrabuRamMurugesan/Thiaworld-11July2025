// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const Product = require("../models/productModel");
const upload = require("../middleware/upload");

router.post("/add", productController.addProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

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

router.get("/:id", productController.getProductById);  // ✅ Place dynamic route last
router.get("/", productController.getAllProducts);    // ✅ Keep as last catch-all


// Add this new route
router.post(
  "/upload-images",
  upload.array("images"),
  productController.uploadProductImages
);

module.exports = router;
