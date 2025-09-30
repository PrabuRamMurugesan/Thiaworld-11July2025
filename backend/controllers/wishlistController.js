const Wishlist = require("../models/Wishlist");

// GET /api/wishlist  -> list user's wishlist with basic product fields
exports.list = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: "Login required" });
    const items = await Wishlist.aggregate([
      { $match: { userId: req.user._id } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          productId: 1,
          createdAt: 1,
          "product._id": 1,
          "product.name": 1,
          "product.price": 1,
          "product.images": 1,
          "product.category": 1,
          "product.purity": 1,
        },
      },
    ]);
    res.json({ ok: true, items });
  } catch (e) {
    console.error("wishlist.list", e);
    res.status(500).json({ message: "Failed to load wishlist" });
  }
};

// POST /api/wishlist/toggle  { productId }
exports.toggle = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: "Login required" });
    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ message: "productId required" });

    const exists = await Wishlist.findOne({ userId: req.user._id, productId });
    if (exists) {
      await Wishlist.deleteOne({ _id: exists._id });
      return res.json({ ok: true, wished: false });
    }
    await Wishlist.create({ userId: req.user._id, productId });
    res.status(201).json({ ok: true, wished: true });
  } catch (e) {
    // handle unique index race
    if (e.code === 11000) return res.json({ ok: true, wished: true });
    console.error("wishlist.toggle", e);
    res.status(500).json({ message: "Failed to update wishlist" });
  }
};

// DELETE /api/wishlist/:productId
exports.remove = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: "Login required" });
    const { productId } = req.params;
    await Wishlist.deleteOne({ userId: req.user._id, productId });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// POST /api/wishlist/bulk  { productIds: string[] }  // optional: import guest localStorage after login
exports.bulkAdd = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: "Login required" });
    const ids = Array.isArray(req.body.productIds) ? req.body.productIds : [];
    const docs = ids.map((id) => ({ userId: req.user._id, productId: id }));
    if (!docs.length) return res.json({ ok: true, added: 0 });
    await Wishlist.bulkWrite(
      docs.map((d) => ({
        updateOne: { filter: d, update: { $setOnInsert: d }, upsert: true },
      }))
    );
    res.json({ ok: true });
  } catch (e) {
    console.error("wishlist.bulkAdd", e);
    res.status(500).json({ message: "Failed to bulk add" });
  }
};
