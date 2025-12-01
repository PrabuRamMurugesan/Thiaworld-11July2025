
const Lead = require("../models/Lead.js");

exports.saveLead = async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.json({ message: "Lead saved" });
  } catch (err) {
    console.error("Lead Save Error:", err);
    res.status(500).json({ error: "Lead save failed" });
  }
};
