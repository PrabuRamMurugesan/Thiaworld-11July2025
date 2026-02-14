const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    link: { type: String }, // optional URL to a full article
  },
  { timestamps: true }
);

module.exports = mongoose.models.Maintenance || mongoose.model("Maintenance", maintenanceSchema);
