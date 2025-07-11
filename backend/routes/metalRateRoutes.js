// routes/metalRateRoutes.js

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/metalRateController");

// Manual create
router.post("/create", ctrl.createRate);

// Get all
router.get("/all", ctrl.getAllRates);

// Update
router.put("/update/:id", ctrl.updateRate);

// Delete
router.delete("/delete/:id", ctrl.deleteRate);

// MMTC auto-fetch + ₹50 check
router.get("/fetch-mmtc-now", ctrl.fetchMMTCNow);
router.get("/grouped", ctrl.getGroupedRates);

module.exports = router;
