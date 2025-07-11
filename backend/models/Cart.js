// models/Cart.js

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String },
    productImage: { type: String },
    payNowAmount: { type: Number, required: true }, // Partial or Full
    quantity: { type: Number, default: 1 },
    isPartialPayment: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
