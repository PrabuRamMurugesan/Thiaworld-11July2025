require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

(async () => {
  await mongoose.connect(process.env.THIAWORLD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const all = await Product.find({});
  let fixed = 0;

  for (const p of all) {
    if (!Array.isArray(p.images)) continue;
    if (p.images.length === 1 && p.images[0].includes("|")) {
      const parts = p.images[0]
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      p.images = parts;
      await p.save();
      fixed++;
      console.log(`Fixed ${p._id}:`, parts);
    }
  }

  console.log(`✅ Fixed products: ${fixed}`);
  await mongoose.disconnect();
})();
