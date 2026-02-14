const Maintenance = require("../models/maintenanceModel");

exports.getAll = async (req, res) => {
  try {
    const items = await Maintenance.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching maintenance items", err);
    res.status(500).json({ error: "Unable to load maintenance guide" });
  }
};

// simple admin helpers (optional)
exports.create = async (req, res) => {
  try {
    const doc = await Maintenance.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating maintenance item", err);
    res.status(500).json({ error: "Failed to create" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Maintenance.findByIdAndUpdate(id, req.body, { new: true });
    res.json(doc);
  } catch (err) {
    console.error("Error updating maintenance item", err);
    res.status(500).json({ error: "Failed to update" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Maintenance.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting maintenance item", err);
    res.status(500).json({ error: "Failed to delete" });
  }
};
