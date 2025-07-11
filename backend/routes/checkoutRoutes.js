const express = require("express");
const router = express.Router();
const {
  submitOrder,
  updatePaymentStatus,
} = require("../controllers/checkoutController");

// POST: /api/checkout/submit
router.post("/submit", submitOrder);

// POST: /api/checkout/update-payment-status
router.post("/update-payment-status", updatePaymentStatus);

module.exports = router;
