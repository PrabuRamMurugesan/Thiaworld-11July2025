// models/MetalRate.js

const mongoose = require("mongoose");

const MetalRateSchema = new mongoose.Schema(
  {
    metalType: { type: String, required: true }, // Gold, Silver, etc.
    carat: { type: String, required: true }, // 24K, 22K, 18K
    marketPrice: { type: Number, required: true }, // Original base price for the day
    ratePerGram: { type: Number, required: true }, // Price for this carat
    source: { type: String, enum: ["Manual", "MMTC-PAMP"], required: true },
    effectiveDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MetalRate", MetalRateSchema);
