// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

require("./cronJobs/fetchMMTCJob");

// Routes
const contactRoutes = require("./routes/contactRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes"); // to be active in launch
const razorpayRoutes = require("./routes/razorpayRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const productRoutes = require("./routes/productRoutes");
const metalRateRoutes = require("./routes/metalRateRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const exportRoutes = require("./routes/exportRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const goldrateRoutes = require("./routes/goldrate");
const adminAuthRoutes = require("./routes/adminAuthRoutes");

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// If you’re behind Nginx/HTTPS, this lets secure cookies work correctly
app.set("trust proxy", 1);

// ---- Body parsers ----
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ---- CORS (single block, credentials enabled) ----
const allowedOrigins = [
  process.env.CLIENT_URL_DEV || "http://localhost:5173",
  "https://thiaworld.bbscart.com",
  "https://bbscart.com",
  "https://www.bbscart.com",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // tools/curl with no Origin
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Pincode",
      "X-Guest-Key",
    ],
  })
);

// ---- Cookies ----
app.use(cookieParser());

// ---- DB ----
mongoose
  .connect(process.env.THIAWORLD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to bbshealthcare (Default DB)"))
  .catch((err) => console.error("❌ Main DB error:", err));

// ---- Routes ----
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/goldrate", metalRateRoutes);
app.use("/api/products", productRoutes); // ✅ this must be exact
app.use("/api/auth", authRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/goldrate", goldrateRoutes);
app.use("/api/admin", adminAuthRoutes);

// Health check (useful for curl and Nginx)
app.get("/api/health", (_req, res) => res.status(200).send("OK"));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root
app.get("/", (_req, res) => res.send("Backend is working"));

// ---- Start ----
const PORT = Number(process.env.PORT || 5001); // keep 5001 to match your Nginx
const HOST = process.env.HOST || "127.0.0.1";
app.listen(PORT, HOST, () =>
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
);
