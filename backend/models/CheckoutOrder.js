const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  pincode: String,
  city: String,
  state: String,
  address: String,
});

const orderSchema = new mongoose.Schema({
  shipping: addressSchema,
  billing: addressSchema,
  cartItems: [
    {
      productId: String,
      productName: String,
      payNowAmount: Number,
      quantity: Number,
      productImage: String,
    },
  ],
  totalProductPrice: Number,
  totalGST: Number,
  grandTotal: Number,
  paymentType: String,
  paymentStatus: {
    type: String,
    default: "pending",
  },
  razorpay_payment_id: String,
  razorpay_order_id: String,
});

module.exports = mongoose.model("Order", orderSchema);
