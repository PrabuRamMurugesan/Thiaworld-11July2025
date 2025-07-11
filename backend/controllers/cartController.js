// controllers/cartController.js

const Cart = require("../models/Cart");

// ✅ Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      productName,
      productImage,
      payNowAmount,
      quantity,
      isPartialPayment,
    } = req.body;

    // Check if same product already in cart
    const existing = await Cart.findOne({ userId, productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = new Cart({
      userId,
      productId,
      productName,
      productImage,
      payNowAmount,
      quantity,
      isPartialPayment,
    });

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// ✅ Get Cart for a User
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// ✅ Remove Cart Item
exports.removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
