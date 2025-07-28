// controllers/metalRateController.js

const MetalRate = require("../models/MetalRate");
const fetchMMTCPAMP = require("../utils/fetchMMTCPAMP");

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

    const price22K = marketPrice * (22 / 24);
    const price18K = marketPrice * (18 / 24);

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

    const price22K = newRate * (22 / 24);
    const price18K = newRate * (18 / 24);

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
  