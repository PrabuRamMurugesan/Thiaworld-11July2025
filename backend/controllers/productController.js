const Product = require("../models/Product");
const mongoose = require("mongoose");

// 🔹 ADD NEW PRODUCT
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    newProduct.finalPrice = calculateFinalPrice(req.body);
    newProduct.totalPayable = newProduct.finalPrice + (req.body.makingCharges || 0) + (req.body.gst || 0);
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// 🔹 UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        finalPrice: calculateFinalPrice(req.body),
        totalPayable: (req.body.finalPrice || 0) + (req.body.makingCharges || 0) + (req.body.gst || 0),
      },
      { new: true }
    );
    res.status(200).json({ message: "Product updated", product: updated });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// 🔹 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// 🔹 GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { category, purity, metalType, name, sort } = req.query;
    const filter = {};

    if (category) filter.category = { $in: category.split(",") };
    if (purity) filter.purity = { $in: purity.split(",") };
    if (metalType) filter.metalType = { $in: metalType.split(",") };
    if (name) filter.name = { $regex: name, $options: "i" };

    let query = Product.find(filter);

    if (sort === "priceLowToHigh") query = query.sort({ price: 1 });
    if (sort === "priceHighToLow") query = query.sort({ price: -1 });
    if (sort === "latest") query = query.sort({ createdAt: -1 });

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// 🔹 GET SINGLE PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("Get By ID Error:", err);
    res.status(500).json({ error: "Failed to get product" });
  }
};

// 🔹 GET PRODUCTS BY COMBO GROUP
const getComboProducts = async (req, res) => {
  try {
    const products = await Product.find({ comboGroupId: req.params.groupId });
    res.status(200).json(products);
  } catch (err) {
    console.error("Combo Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch combo products" });
  }
};

// 🔹 GET RELATED PRODUCTS
const getRelatedProducts = async (req, res) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) return res.status(404).json({ error: "Product not found" });

    const related = await Product.find({
      _id: { $ne: current._id },
      category: current.category,
      metalType: current.metalType,
    }).limit(6);

    res.status(200).json(related);
  } catch (err) {
    console.error("Related Error:", err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
};

// 🔹 SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  try {
    const term = req.params.term;
    const results = await Product.find({
      $or: [
        { name: new RegExp(term, "i") },
        { category: new RegExp(term, "i") },
        { metalType: new RegExp(term, "i") },
        { tags: { $in: [term] } },
      ],
    });
    res.status(200).json(results);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
// ✅ Add inside productController.js



// 🔹 CALCULATE FINAL PRICE (before saving)
// const calculateFinalPrice = (data) => {
//   if (!data.price || !data.discount) return data.price;
//   return Math.round(data.price - (data.price * data.discount) / 100);
// };
// ✅ REPLACE your existing calculateFinalPrice helper with this:

const calculateFinalPrice = (data) => {
  const metal = data.metalType || data.category;

  if (metal === "Gold") {
    // Example: suppose you pass 24K rate manually in price field
    const rate = data.price; // price field stores base rate/gm
    const purity = parseInt(data.purity) || 24;
    const derivedRate = rate * (purity / 24);
    return Math.round((data.netWeight || 0) * derivedRate);
  }

  if (metal === "Platinum") {
    // Same logic: use price as base 100% rate per gram
    const rate = data.price;
    const purity = parseInt(data.purity) || 100;
    const derivedRate = rate * (purity / 100);
    return Math.round((data.netWeight || 0) * derivedRate);
  }

  if (metal === "Diamond" || metal === "Silver") {
    // For Diamond & Silver, use the given price directly
    return data.price;
  }

  return data.price; // fallback
};
const getGoldProducts = async (req, res) => {
  try {
    console.log("🚀 Fetching gold products...");
    const goldProducts = await Product.find({
      metalType: { $regex: /gold/i }, // case-insensitive
      isPublished: true,
    });

    console.log(`✅ Found ${goldProducts.length} gold products`);
    res.status(200).json(goldProducts);
  } catch (error) {
    console.error("❌ Error in getGoldProducts:", error.message);
    res.status(500).json({ message: "Server error fetching gold products" });
  }
};
// 👇 Add this function below other product handlers
// ✅ Fetch Silver Products (filtered by metalType)
const getSilverProducts = async (req, res) => {
    try {
      const silverProducts = await Product.find({
        metalType: "Silver",
        isPublished: true,
      });
      res.json(silverProducts);
    } catch (error) {
      console.error("❌ Error fetching silver products:", error);
      res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Add at bottom of controller
const getDiamondProducts = async (req, res) => {
  try {
    const diamondProducts = await Product.find({
      metalType: "Diamond",
      isPublished: true,
      visibility: "catalog",
    }).sort({ createdAt: -1 });

    console.log("💎 Fetching diamond products...");
    res.status(200).json(diamondProducts);
  } catch (error) {
    console.error("❌ Error fetching diamond products:", error.message);
    res.status(500).json({ message: "Server Error: Unable to fetch diamond products." });
  }
};

const getPlatinumProducts = async (req, res) => {
  try {
    const platinumProducts = await Product.find({
      metalType: "Platinum",
      isPublished: true,
      visibility: "catalog",
    }).sort({ createdAt: -1 });

    console.log("🔷 Fetching platinum products...");
    res.status(200).json(platinumProducts);
  } catch (error) {
    console.error("❌ Error fetching platinum products:", error.message);
    res
      .status(500)
      .json({ message: "Server Error: Unable to fetch platinum products." });
  }
};
const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded." });
    }

    const imagePaths = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const updated = await Product.findByIdAndUpdate(
      productId,
      { $set: { images: imagePaths } },
      { new: true, runValidators: false } // 🔥 this avoids category validation error
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Images uploaded and product updated",
      images: imagePaths,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// controllers/productController.js
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      isNewArrival: true,
      isPublished: true,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching new arrivals:", error.message);
    res.status(500).json({ error: "Failed to get product" });
  }
};
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isPublished: true,
      isFeatured: true,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: "Failed to get featured products" });
  }
};
 const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isPublished: true,
      bestSelling: true,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    res.status(500).json({ error: "Failed to get best selling products" });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getComboProducts,
  getRelatedProducts,
  searchProducts,
  getBestSellingProducts,
  getGoldProducts,
  getSilverProducts,
  getDiamondProducts,
  getPlatinumProducts,
  uploadProductImages,
  getNewArrivals,
  getFeaturedProducts,
};
