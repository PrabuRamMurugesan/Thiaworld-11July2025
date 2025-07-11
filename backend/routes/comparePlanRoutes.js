const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const { saveComparePlan, getAllComparePlans } = require("../controllers/comparePlanController");

router.post("/save", saveComparePlan);
router.get("/all", adminMiddleware, getAllComparePlans);

module.exports = router;
