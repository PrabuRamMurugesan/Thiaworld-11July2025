// controllers/razorpayController.js

const Razorpay = require("razorpay");

// ✅ Create a Razorpay instance using env keys
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Controller to create a new Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Creating Razorpay Order with Amount:", amount);

    if (!amount || isNaN(amount)) {
      return res
        .status(400)
        .json({ error: "Amount must be provided and be a number" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("❌ Razorpay createOrder failed:", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// ✅ You can add other Razorpay handlers here later if needed
// For now, only createOrder is exposed
