// backend/routes/goldrate.js
const express = require("express");
const router = express.Router();
const metalRate = require("../controllers/metalRateController");

// GET /api/goldrate/latest
router.get("/latest", metalRate.getLatestRates);

// POST /api/goldrate/apply-to-products
router.post("/apply-to-products", metalRate.applyGoldRatesToProducts);

module.exports = router;
