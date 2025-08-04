const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
require("./cronJobs/fetchMMTCJob");
const contactRoutes = require("./routes/contactRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes"); // to be active in lanch
const razorpayRoutes = require("./routes/razorpayRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const productRoutes = require("./routes/productRoutes");
const metalRateRoutes = require("./routes/metalRateRoutes");

const path = require("path");

const app = express();
const exportRoutes = require("./routes/exportRoutes");

const PORT = process.env.PORT || 5000; // ✅ Use PORT from environment variables

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.THIAWORLD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to bbshealthcare (Default DB)"))
  .catch((err) => console.error("❌ Main DB error:", err));

app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/goldrate", metalRateRoutes);
app.use("/api/products", productRoutes); // ✅ this must be exact
app.use("/api/auth", authRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Backend is working");
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
