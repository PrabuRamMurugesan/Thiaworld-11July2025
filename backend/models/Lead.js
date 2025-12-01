const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  brand: String, // thia / bbscart / health
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lead", leadSchema);
