// routes/razorpayRoutes.js

const express = require("express");
const router = express.Router();

// ✅ Import only the handlers you have defined
const { createOrder } = require("../controllers/razorpayController");

// ✅ Main route for creating an order
router.post("/create-order", createOrder);

// ✅ Export the router
module.exports = router;
