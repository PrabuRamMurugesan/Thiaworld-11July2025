const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/thiaworld";

const categories = {
  Gold: ["Necklace", "Rings", "Earrings", "Bangles", "Chains", "Pendants"],
  Silver: ["Necklace", "Rings", "Earrings", "Bracelets", "Chains", "Pendants"],
  Diamond: ["Necklace", "Rings", "Earrings", "Bangles", "Pendants"],
  Platinum: ["Necklace", "Rings", "Earrings", "Chains", "Pendants"],
};

const imageSets = {
  Gold: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
  ],
  Silver: [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
    "https://images.unsplash.com/photo-1597045566677-8cfd2b59dc8e?w=400",
  ],
  Diamond: [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
  ],
  Platinum: [
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
  ],
};

const productNames = {
  Necklace: ["Gold Necklace Set", "Designer Necklace", "Classic Chain Necklace", "Temple Necklace", "American Diamond Necklace"],
  Rings: ["Diamond Ring", "Gold Band Ring", "Solitaire Ring", "Stackable Ring", "Statement Ring"],
  Earrings: ["Gold Jhumka", "Diamond Studs", "Silver Drop Earrings", "Chandbali Earrings", "Hoop Earrings"],
  Bangles: ["Gold Bangle Set", "Diamond Bangles", "Silver Bangles", "Traditional Bangles", "Designer Bangles"],
  Bracelets: ["Silver Bracelet", "Gold Bracelet", "Chain Bracelet", "Tennis Bracelet", "Cuff Bracelet"],
  Chains: ["Gold Chain", "Silver Chain", "Rope Chain", "Figaro Chain", "Curb Chain"],
  Pendants: ["Gold Pendant", "Diamond Pendant", "Silver Pendant", "Om Pendant", "Cross Pendant"],
};

const descriptions = [
  "Elegant handcrafted jewelry piece perfect for occasions.",
  "Premium quality with intricate design details.",
  "Lightweight and comfortable for daily wear.",
  "Stunning piece that complements any outfit.",
  "Exclusive design with superior craftsmanship.",
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 100) * 100;
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const products = [];

    for (const [metalType, subCats] of Object.entries(categories)) {
      for (const subCat of subCats) {
        const names = productNames[subCat] || [`${metalType} ${subCat}`];
        const name = randomPick(names);
        const basePrice = randomPrice(
          metalType === "Gold" ? 15000 : metalType === "Diamond" ? 25000 : metalType === "Platinum" ? 30000 : 3000,
          metalType === "Gold" ? 150000 : metalType === "Diamond" ? 300000 : metalType === "Platinum" ? 500000 : 50000
        );
        const discount = Math.random() > 0.5 ? randomPick([5, 10, 15, 20, 25, 30]) : 0;
        const finalPrice = discount ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

        const product = {
          name: `${metalType} ${name}`,
          category: subCat,
          metalType,
          price: basePrice,
          discount,
          finalPrice,
          makingCharges: randomPick([500, 1000, 1500, 2000]),
          gst: Math.round(finalPrice * 0.03),
          totalPayable: finalPrice + randomPick([500, 1000, 1500, 2000]) + Math.round(finalPrice * 0.03),
          description: randomPick(descriptions),
          purity: metalType === "Gold" ? randomPick(["22K", "18K", "24K"]) : metalType === "Silver" ? "925" : metalType === "Platinum" ? randomPick(["950", "900"]) : null,
          netWeight: parseFloat((Math.random() * 20 + 2).toFixed(2)),
          images: imageSets[metalType],
          tags: [metalType, subCat, "New Arrival"],
          isPublished: true,
          isNewArrival: Math.random() > 0.3,
          isFeatured: Math.random() > 0.4,
          bestSelling: Math.random() > 0.5,
          soldCount: Math.floor(Math.random() * 100),
          isAvailable: true,
          showInHomepage: Math.random() > 0.5,
          priorityRanking: Math.floor(Math.random() * 100),
          slug: generateSlug(`${metalType}-${name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
        };

        product.totalPayable = product.totalPayable;
        products.push(product);
      }
    }

    // Add Bridal tag to some gold & diamond products
    for (const p of products) {
      if ((p.metalType === "Gold" || p.metalType === "Diamond") && Math.random() > 0.5) {
        p.tags.push("Bridal");
      }
    }

    const result = await Product.insertMany(products);
    console.log(`Inserted ${result.length} products across all categories`);
    console.log("\nCategories breakdown:");
    const counts = {};
    for (const p of result) {
      for (const tag of p.tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    for (const [tag, count] of Object.entries(counts).sort()) {
      console.log(`  ${tag}: ${count} products`);
    }

    await mongoose.disconnect();
    console.log("\nDone. Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
