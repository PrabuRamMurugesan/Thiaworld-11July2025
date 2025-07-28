const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,

  cartItems: [
    {
      name: String,
      weight: String,
      grossWeight: String,
      price: Number,
      makingCharges: Number,
      gst: Number,
    },
  ],

  totalProductPrice: Number,
  totalMaking: Number,
  totalGST: Number,
  grandTotal: Number,
  paymentType: String, // full, partial, emi, wallet

  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, default: "pending" }, // pending, paid, failed

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
