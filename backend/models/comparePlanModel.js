const mongoose = require("mongoose");

const comparePlanSchema = new mongoose.Schema({
  planTitle: { type: String, required: true },
  totalPrice: Number,
  downPayment: Number,
  tenure: Number,
  interestRate: Number,
  monthlyEMI: Number,
  totalPayable: Number,
  totalInterest: Number,
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ComparePlanLog", comparePlanSchema);
