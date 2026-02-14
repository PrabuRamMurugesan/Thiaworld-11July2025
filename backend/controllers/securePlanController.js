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
      monthlyInstallment,
    } = req.body;

    // Validate required fields
    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    let monthlyInstallment_val = null;
    let totalPayable = null;
    let totalInterest = null;

    // If EMI values provided, use them; otherwise calculate
    if (monthlyInstallment) {
      monthlyInstallment_val = monthlyInstallment;
    } else if (
      totalPrice !== undefined && downPayment !== undefined && tenureMonths !== undefined && interestRate !== undefined &&
      totalPrice !== "" && downPayment !== "" && tenureMonths !== "" && interestRate !== ""
    ) {
      const P = Number(totalPrice) - Number(downPayment);
      const R = Number(interestRate) / 12 / 100;
      const N = Number(tenureMonths);

      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      monthlyInstallment_val = emi.toFixed(2);
      totalPayable = (emi * N).toFixed(2);
      totalInterest = (emi * N - P).toFixed(2);
    }

    const newEntry = new SecurePlanInterest({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : "",
      preferredPlan: preferredPlan || "",
      message: message || "",
      totalPrice: totalPrice ? Number(totalPrice) : null,
      downPayment: downPayment ? Number(downPayment) : null,
      tenureMonths: tenureMonths ? Number(tenureMonths) : null,
      interestRate: interestRate ? Number(interestRate) : null,
      monthlyInstallment: monthlyInstallment_val ? Number(monthlyInstallment_val) : null,
      totalPayable: totalPayable ? Number(totalPayable) : null,
      totalInterest: totalInterest ? Number(totalInterest) : null,
    });

    console.log("[SecurePlan] Saving entry:", newEntry);
    await newEntry.save();
    console.log("[SecurePlan] Entry saved successfully with ID:", newEntry._id);
    
    res.status(201).json({ message: "Interest submitted successfully!", id: newEntry._id });

  } catch (err) {
    console.error("[SecurePlan] Error submitting interest:", err);
    res.status(500).json({ error: err.message || "Server Error. Please try again later." });
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
