// routes/securePlanRoutes.js
const express = require("express");
const router = express.Router();
const { submitInterest, getAllSecurePlanEntries } = require("../controllers/securePlanController");
const adminMiddleware = require("../middleware/adminMiddleware");

// User Form Submission
router.post("/submit", submitInterest);

// Admin Protected View All
router.get("/all", adminMiddleware, getAllSecurePlanEntries);

module.exports = router;
