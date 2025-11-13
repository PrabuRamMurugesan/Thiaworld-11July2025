// controllers/metalRateController.js

const MetalRate = require("../models/MetalRate");
const fetchMMTCPAMP = require("../utils/fetchMMTCPAMP");
const { computePrice } = require("../services/pricing");
const Product   = require("../models/Product"); // <-- ADD THIS

// 1️⃣ Create - Manual only
exports.createRate = async (req, res) => {
  try {
    const { metalType, source, marketPrice, effectiveDate } = req.body;

    if (!metalType || !source || !marketPrice || !effectiveDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (source === "MMTC-PAMP") {
      return res
        .status(400)
        .json({ message: "Use MMTC route for MMTC-PAMP rates" });
    }

    const price22K = marketPrice * 0.916; // 22K = 91.6% of 24K
    const price18K = marketPrice * 0.75; // 18K = 75% of 24K

    const baseData = {
      metalType,
      source,
      effectiveDate,
    };

    const rate24 = new MetalRate({
      ...baseData,
      carat: "24K",
      marketPrice,
      ratePerGram: marketPrice,
    });
    const rate22 = new MetalRate({
      ...baseData,
      carat: "22K",
      marketPrice,
      ratePerGram: price22K,
    });
    const rate18 = new MetalRate({
      ...baseData,
      carat: "18K",
      marketPrice,
      ratePerGram: price18K,
    });

    await rate24.save();
    await rate22.save();
    await rate18.save();
    exports.applyGoldRatesToProducts(
      { body: {} },
      {
        json() {},
        status() {
          return this;
        },
      }
    );
    res.json({
      message: "Manual 24K, 22K, 18K rates saved",
      rates: [rate24, rate22, rate18],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Get all
exports.getAllRates = async (req, res) => {
  try {
    const { metalType } = req.query;
    const query = metalType ? { metalType } : {};
    const rates = await MetalRate.find(query).sort({
      effectiveDate: -1,
      carat: -1,
    });
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Update
exports.updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await MetalRate.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 4️⃣ Delete
exports.deleteRate = async (req, res) => {
  try {
    const { id } = req.params;
    await MetalRate.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 5️⃣ MMTC fetch + ₹50 diff check
exports.fetchMMTCNow = async (req, res) => {
  try {
    const metalType = "Gold";
    const newRate = await fetchMMTCPAMP(metalType);
    if (!newRate) return res.status(400).json({ message: "MMTC fetch failed" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latest = await MetalRate.findOne({
      metalType,
      carat: "24K",
      effectiveDate: { $gte: today },
    }).sort({ createdAt: -1 });

    let update = false;
    if (!latest) {
      update = true;
    } else {
      const diff = Math.abs(newRate - latest.ratePerGram);
      if (diff >= 50) update = true;
    }

    if (!update) {
      return res.json({ message: "No significant change. Skipped." });
    }

    const price22K = newRate * 0.916; // 22K = 91.6% of 24K
    const price18K = newRate * 0.75; // 18K = 75% of 24K

    const base = {
      metalType,
      source: "MMTC-PAMP",
      effectiveDate: new Date(),
    };

    const rate24 = new MetalRate({
      ...base,
      carat: "24K",
      marketPrice: newRate,
      ratePerGram: newRate,
    });
    const rate22 = new MetalRate({
      ...base,
      carat: "22K",
      marketPrice: newRate,
      ratePerGram: price22K,
    });
    const rate18 = new MetalRate({
      ...base,
      carat: "18K",
      marketPrice: newRate,
      ratePerGram: price18K,
    });

    await rate24.save();
    await rate22.save();
    await rate18.save();

    res.json({
      message: "Inserted MMTC-PAMP rates due to ₹50+ change",
      rates: [rate24, rate22, rate18],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ NEW: Grouped GET - add at end of metalRateController.js

exports.getGroupedRates = async (req, res) => {
    try {
      const { metalType } = req.query;
      const query = metalType ? { metalType } : {};
  
      const rates = await MetalRate.find(query).sort({ effectiveDate: -1 });
  
      const grouped = {};
  
      rates.forEach(rate => {
        const key = `${rate.effectiveDate.toISOString().split('T')[0]}_${rate.source}`;
        if (!grouped[key]) {
          grouped[key] = {
            _id24: '',
            _id22: '',
            _id18: '',
            marketPrice: rate.marketPrice,
            rate24: null,
            rate22: null,
            rate18: null,
            source: rate.source,
            effectiveDate: rate.effectiveDate
          };
        }
        if (rate.carat === '24K') {
          grouped[key]._id24 = rate._id;
          grouped[key].rate24 = rate.ratePerGram;
        }
        if (rate.carat === '22K') {
          grouped[key]._id22 = rate._id;
          grouped[key].rate22 = rate.ratePerGram;
        }
        if (rate.carat === '18K') {
          grouped[key]._id18 = rate._id;
          grouped[key].rate18 = rate.ratePerGram;
        }
      });
  
      const groupedArray = Object.values(grouped);
  
      res.json(groupedArray);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.getLatestRates = async (req, res) => {
    try {
      const metalType = req.query.metalType || "Gold";

      // Grab the newest effectiveDate first, then pick three rows (24/22/18)
      const latestByDate = await MetalRate.find({ metalType })
        .sort({ effectiveDate: -1, createdAt: -1 })
        .limit(100); // safety window

      // Reduce into 24K / 22K / 18K shape
      const out = {};
      for (const r of latestByDate) {
        if (
          (r.carat === "24K" || r.carat === "22K" || r.carat === "18K") &&
          !out[r.carat]
        ) {
          out[r.carat] = {
            id: r._id,
            marketPrice: r.marketPrice,
            ratePerGram: r.ratePerGram,
            effectiveDate: r.effectiveDate,
            source: r.source,
          };
        }
      }
      if (!out["24K"] || !out["22K"] || !out["18K"]) {
        return res.status(404).json({ message: "Latest block incomplete" });
      }
      res.json({ metalType, rates: out });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
exports.applyGoldRatesToProducts = async (req, res) => {
  try {
    const dryRun = !!req.body?.dryRun;

    // ---------- Helper functions ----------
    function purityToCarat(purity) {
      if (!purity) return null;
      const p = String(purity).trim().toUpperCase().replace(/\s+/g, "");
      if (["24K", "24KT", "999", "24CARAT", "24CT"].includes(p)) return "24K";
      if (["22K", "22KT", "916", "22CARAT", "22CT"].includes(p)) return "22K";
      if (["18K", "18KT", "750", "18CARAT", "18CT"].includes(p)) return "18K";
      if (/^24/.test(p)) return "24K";
      if (/^22/.test(p)) return "22K";
      if (/^18/.test(p)) return "18K";
      return null;
    }

    function asNumber(n) {
      return Number(n || 0) || 0;
    }

    function chooseWeight(p) {
      const net = asNumber(p.netWeight);
      const gross = asNumber(p.grossWeight);
      return net > 0 ? net : gross;
    }

    // Supports percent makingCharges (0–100) or flat makingCharge
    function computePriceFromRate(ratePerGram, p) {
      const w = chooseWeight(p);
      const base = asNumber(ratePerGram) * w;

      const makingPct = asNumber(p.makingCharges);
      const makingFlat = asNumber(p.makingCharge);
      const making =
        makingFlat > 0
          ? makingFlat
          : makingPct > 0 && makingPct < 100
          ? (base * makingPct) / 100
          : 0;

      const wastageFlat = asNumber(p.wastageCharge);
      return Math.round(base + making + wastageFlat);
    }

    // ---------- Step 1: Load latest per-carat rates ----------
    const latestRates = await MetalRate.find({ metalType: "Gold" })
      .sort({ effectiveDate: -1, createdAt: -1 })
      .limit(100);

    const latest = {};
    for (const r of latestRates) {
      const c = purityToCarat(r.carat);
      if (c && !latest[c]) latest[c] = { ratePerGram: asNumber(r.ratePerGram) };
    }

    if (!latest["24K"] || !latest["22K"] || !latest["18K"]) {
      return res.status(400).json({ message: "Missing 24K/22K/18K rates" });
    }

    // ---------- Step 2: Process products in batches ----------
    const pageSize = 500;
    let page = 0,
      total = 0,
      updates = 0;

    while (true) {
      const batch = await Product.find({ metalType: /gold/i }) // ✅ Case-insensitive
        .select({
          _id: 1,
          metalType: 1,
          purity: 1,
          price: 1,
          netWeight: 1,
          grossWeight: 1,
          makingCharge: 1,
          makingCharges: 1,
          wastageCharge: 1,
        })
        .skip(page * pageSize)
        .limit(pageSize);

      if (!batch.length) break;
      total += batch.length;

      const bulk = [];

      for (const p of batch) {
        const isGold = String(p.metalType || "").toLowerCase() === "gold";
        if (!isGold) continue;

        const carat = purityToCarat(p.purity);
        const rate = latest[carat]?.ratePerGram;
        if (!rate) continue;

        const w = chooseWeight(p);
        if (!w) continue;

        const newPrice = computePriceFromRate(rate, p);
        if (Number(newPrice) === Number(p.price || 0)) continue;

        updates++;

        if (!dryRun) {
          bulk.push({
            updateOne: {
              filter: { _id: p._id },
              update: {
                $set: {
                  price: newPrice,
                  priceRateSnapshot: {
                    carat,
                    ratePerGram: rate,
                    at: new Date(),
                  },
                },
              },
            },
          });
        }
      }

      if (!dryRun && bulk.length) {
        await Product.bulkWrite(bulk, { ordered: false });
      }

      page++;
    }

    res.json({ ok: true, total, updates, dryRun });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
