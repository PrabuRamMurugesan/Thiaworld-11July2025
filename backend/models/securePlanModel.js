const mongoose = require("mongoose");

const securePlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  preferredPlan: { type: String },
  message: { type: String },

  // EMI-specific fields
  totalPrice: { type: Number },
  downPayment: { type: Number },
  tenureMonths: { type: Number },
  monthlyInstallment: { type: Number },
  totalPayable: { type: Number },
  totalInterest: { type: Number },
  interestRate: { type: Number },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SecurePlanInterest", securePlanSchema);