// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true },
    slug: { type: String, unique: true },
    description: { type: String },
    longDescription: { type: String },
    category: { type: String, required: true },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    subCategory: { type: String },
    metalType: {
      type: String,
      enum: ["Gold", "Silver", "Diamond", "Platinum"],
    },
    metalColor: { type: String, enum: ["Yellow", "Rose", "White"] },
    purity: { type: String },
    netWeight: { type: Number },
    grossWeight: { type: Number },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    bestSelling: { type: Boolean, default: false },
    finalPrice: { type: Number },
    makingCharges: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    totalPayable: { type: Number },
    images: [{ type: String }],
    thumbnail: { type: String },
    videoUrl: { type: String },
    isCombo: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }, // <-- add this
    comboGroupId: { type: String },
    jewelleryType: {
      type: String,
      enum: [
        "Earrings",
        "Pendants",
        "Rings",
        "Bangles & Bracelets",
        "Mangalsutra",
        "Chain",
        "Necklace",
        "Nosepin",
        "Toe Rings",
      ],
      default: null,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Kids & Teens"],
      default: null,
    },

    occasion: {
      type: String,
      enum: [
        "Casual Wear",
        "Wedding",
        "Formal Wear",
        "Daily Wear",
        "Party Wear",
        "Traditional Wear",
      ],
      default: null,
    },
    tags: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isSecurePlanEnabled: { type: Boolean, default: false },
    isPartialPaymentEnabled: { type: Boolean, default: false },
    isVirtualTryOnEnabled: { type: Boolean, default: false },
    similarIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    aiRelatedTags: [{ type: String }],
    showInHomepage: { type: Boolean, default: false },
    priorityRanking: { type: Number, default: 99 },
    reviews: [
      {
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
