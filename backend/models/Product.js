// const mongoose = require("mongoose");

// // ✅ Reviews remain same
// const reviewSchema = new mongoose.Schema({
//   user: { type: String, required: true },
//   rating: { type: Number, default: 0 },
//   comment: { type: String },
//   date: { type: Date, default: Date.now },
// });

// // ✅ Custom Attribute: your advanced flexible pair
// const customAttributeSchema = new mongoose.Schema({
//   key: String,
//   value: String,
// });

// // ✅ Advanced Attributes: your new global system
// const attributeSchema = new mongoose.Schema({
//   name: String,
//   values: [String],
//   visible: Boolean,
//   global: Boolean,
// });

// // ✅ Unified Product Schema
// const productSchema = new mongoose.Schema(
//   {
//     productId: String,
//     sku: { type: String, unique: true },
//     type: { type: String, default: "simple" },
//     name: { type: String, required: true },
//     shortDescription: String,
//     description: String,
//     isPublished: { type: Boolean, default: true },
//     isFeatured: { type: Boolean, default: false },
//     visibility: { type: String, default: "catalog" },

//     saleStartDate: Date,
//     saleEndDate: Date,

//     taxStatus: { type: String, default: "taxable" },
//     taxClass: { type: String, default: "standard" },

//     inStock: { type: Boolean, default: true },
//     stockQty: { type: Number, default: 0 },
//     lowStockQty: { type: Number, default: 0 },
//     allowBackorders: { type: Boolean, default: false },
//     soldIndividually: { type: Boolean, default: false },

//     weight: Number,
//     length: Number,
//     width: Number,
//     height: Number,

//     allowReviews: { type: Boolean, default: true },
//     purchaseNote: String,

//     salePrice: Number,
//     regularPrice: Number,

//     categories: [String],
//     tags: [String],
//     shippingClass: String,

//     images: [String],

//     downloadLimit: Number,
//     downloadExpiryDays: Number,

//     parentProductId: String,
//     groupedProducts: [String],
//     upsells: [String],
//     crossSells: [String],

//     externalUrl: String,
//     buttonText: String,
//     position: Number,

//     attributes: [attributeSchema],
//     customAttributes: [customAttributeSchema],

//     meta_lastEditor: String,
//     meta_template: String,
//     meta_pageview: Number,
//     meta_posVisibility: Boolean,

//     makingCharges: { type: Number, default: 0 },
//     makingChargesDiscount: { type: Number, default: 0 },

//     metalType: String, // Gold, Silver, Diamond
//     metalCarat: String, // 24K, 22K, etc.
//     autoUpdatePrice: { type: Boolean, default: false },

//     isCombo: { type: Boolean, default: false },
//     comboGroupId: String,

//     isSecurePlanEnabled: { type: Boolean, default: false },
//     isPartialPaymentEnabled: { type: Boolean, default: false },

//     price: { type: Number, required: true },
//     discount: { type: Number, default: 0 },
//     gst: { type: Number, default: 3 },

//     reviews: [reviewSchema],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);
