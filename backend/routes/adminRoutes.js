const express = require("express");
const router = express.Router();

const {
  updateGoldRate,
  getGoldRates,
} = require("../controllers/goldrateController");

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  createCmsPage,
  updateCmsPage,
  getCmsPages,
  deleteCmsPage,
} = require("../controllers/cmsPageController");

// Gold Rates
router.post("/goldrate/update", updateGoldRate);
router.get("/goldrate/all", getGoldRates);

// Products
router.post("/product/create", createProduct);
router.get("/product/all", getAllProducts);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

// CMS Pages
router.post("/cms/create", createCmsPage);
router.get("/cms/all", getCmsPages);
router.put("/cms/:id", updateCmsPage);
router.delete("/cms/:id", deleteCmsPage);

module.exports = router;
