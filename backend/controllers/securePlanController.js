// controllers/securePlanController.js
const SecurePlanInterest = require("../models/securePlanModel");

const submitInterest = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      preferredPlan,
      message,
      totalPrice,
      downPayment,
      tenureMonths,
      interestRate,
    } = req.body;

    let monthlyInstallment = null;
    let totalPayable = null;
    let totalInterest = null;

    if (
      totalPrice !== undefined && downPayment !== undefined && tenureMonths !== undefined && interestRate !== undefined &&
      totalPrice !== "" && downPayment !== "" && tenureMonths !== "" && interestRate !== ""
    ) {
      const P = Number(totalPrice) - Number(downPayment);
      const R = Number(interestRate) / 12 / 100;
      const N = Number(tenureMonths);

      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      monthlyInstallment = emi.toFixed(2);
      totalPayable = (emi * N).toFixed(2);
      totalInterest = (emi * N - P).toFixed(2);
    }

    const newEntry = new SecurePlanInterest({
      name,
      mobile,
      email,
      preferredPlan,
      message,
      totalPrice,
      downPayment,
      tenureMonths,
      interestRate,
      monthlyInstallment,
      totalPayable,
      totalInterest,
    });

    await newEntry.save();
    res.status(201).json({ message: "Interest submitted successfully!" });

  } catch (err) {
    console.error("Error submitting interest:", err);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
};

const getAllSecurePlanEntries = async (req, res) => {
  try {
    const entries = await SecurePlanInterest.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
};

module.exports = {
  submitInterest,
  getAllSecurePlanEntries,
};
