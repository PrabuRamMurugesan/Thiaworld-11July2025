const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String }, // optional
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String },
    message: { type: String, required: true }, // maps from "comment"
    rating: { type: Number, min: 1, max: 5, required: true },
    verified: { type: Boolean, default: false },
    media: [{ type: String }], // keep for future uploads
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
