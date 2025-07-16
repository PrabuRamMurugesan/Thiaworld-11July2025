const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const db = "thiaworld";
const collections = [
  "appointments",
  "carts",
  "checkoutorders",
  "cmspages",
  "compareplanlogs",
  "contacts",
  "goldrates",
  "metalrates",
  "orders",
  "products",
  "secureplaninterests",
];

const exportDir = path.join(__dirname, "exports");

async function exportCollections() {
  // Ensure the export folder exists
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  // Connect to MongoDB
  await mongoose.connect(`mongodb://localhost:27017/${db}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  for (const coll of collections) {
    try {
      const Model = mongoose.connection.collection(coll);
      const data = await Model.find({}).toArray();
      const filePath = path.join(exportDir, `${coll}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Exported ${coll} (${data.length} records)`);
    } catch (err) {
      console.error(`❌ Failed to export ${coll}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("🎉 All collections exported to ./exports folder");
}

exportCollections();
