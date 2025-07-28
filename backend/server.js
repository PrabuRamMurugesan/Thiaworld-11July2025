const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();
require("./cronJobs/fetchMMTCJob");

const contactRoutes = require('./routes/contactRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes'); // to be active in lanch
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

// DB Connection
//mongoose
  //.connect('mongodb://127.0.0.1:27017/thiaworld', { // ✅ Update MongoDB connection string
    //useNewUrlParser: true,
    //useUnifiedTopology: true
 // })
  //.then(() => console.log("✅ MongoDB connected"))
  //.catch((err) => console.error("❌ MongoDB connection error:", err));

const mongoURI = process.env.MONGO_URI; // or whatever key you use in .env

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api', appointmentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/goldrate", metalRateRoutes);
app.use('/api', authRoutes);//to be active in lanch
app.use("/api/products", productRoutes); // ✅ this must be exact

// app.use('/api/contact', require('./routes/contactRoutes'));
// app.use('/api/appointments', require('./routes/appointmentRoutes'));
// app.use('/api/checkout', require('./routes/checkoutRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/home/videos', require('./routes/videoRoutes'));
// app.use('/api/banners', require('./routes/bannerRoutes'));
// app.use('/api/testimonials', require('./routes/testimonialRoutes'));
// app.use('/api/home', require('./routes/contentRoutes'));
// app.use('/api/contact', require('./routes/contactRoutes'));cks

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use("/api/export", exportRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use("/api/razorpay", razorpayRoutes);

app.use("/api/products", productRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

