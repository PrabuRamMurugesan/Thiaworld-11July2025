const CheckoutOrder = require("../models/CheckoutOrder");

// ✅ 1. Save order submission
exports.submitOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      pincode,
      city,
      state,
      address,
      cartItems,
      totalProductPrice,
      totalMaking,
      totalGST,
      grandTotal,
      paymentType,
    } = req.body;

    const newOrder = new CheckoutOrder({
      name,
      phone,
      email,
      pincode,
      city,
      state,
      address,
      cartItems,
      totalProductPrice,
      totalMaking,
      totalGST,
      grandTotal,
      paymentType,
    });

    await newOrder.save();

    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error("Order Submission Failed:", err);
    res.status(500).json({ error: "Order submission failed" });
  }
};

// ✅ 2. Update payment status after Razorpay
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, status } = req.body;

    const order = await CheckoutOrder.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: status,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: "Payment update failed" });
  }
};
