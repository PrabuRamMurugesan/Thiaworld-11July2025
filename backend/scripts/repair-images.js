// // backend/scripts/repair-images.js
// const { MongoClient } = require("mongodb");

// (async () => {
//   // ✅ Local MongoDB connection
//   const uri = "mongodb://localhost:27017/thiaworld"; // Local DB name = thiaworld
//   const client = await MongoClient.connect(uri);
//   const db = client.db("thiaworld");
//   const col = db.collection("products");

//   const cursor = col.find({ images: { $type: "array" } });
//   let fixed = 0;

//   while (await cursor.hasNext()) {
//     const doc = await cursor.next();
//     const val = doc.images?.[0];

//     // ✅ Check if first element is a string containing multiple URLs
//     if (typeof val === "string" && (val.includes("|") || val.includes(","))) {
//       const parts = val
//         .split(/[|,]/) // handle both "|" and ","
//         .map((s) => s.trim())
//         .filter(Boolean);

//       await col.updateOne(
//         { _id: doc._id },
//         { $set: { images: parts, image: parts[0] || null } }
//       );
//       console.log(`✅ Fixed product: ${doc._id}`);
//       fixed++;
//     }
//   }

//   console.log("✅ Total products fixed:", fixed);
//   await client.close();
// })();
// backend/scripts/repair-images.js
const { MongoClient } = require("mongodb");

(async () => {
  const uri = "mongodb://localhost:27017/thiaworld"; 
  const dbName = "thiaworld"; // or thiaworld, whichever holds the products
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  const col = db.collection("products");

  const cursor = col.find({ images: { $type: "array" } });
  let fixed = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const val = doc.images?.[0];
    if (typeof val === "string" && val.includes("|")) {
      const parts = val
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) =>
          s.startsWith("http") ? s.split("/").pop().split("?")[0] : s
        );
      await col.updateOne(
        { _id: doc._id },
        { $set: { images: parts, image: parts[0] || null } }
      );
      fixed++;
    }
  }

  console.log("Fixed products:", fixed);
  await client.close();
})();
