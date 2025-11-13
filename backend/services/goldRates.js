// backend/services/goldRates.js
// Fetch newest 24K/22K/18K once, reuse for a few seconds.

const MetalRate = require("../models/MetalRate"); // adjust if your model path differs

let cache = { at: 0, data: null };
const TTL_MS = 10 * 1000; // 10s cache to reduce DB hits

async function loadLatestBlock() {
  const rows = await MetalRate.find({ metalType: "Gold" })
    .sort({ effectiveDate: -1, createdAt: -1 })
    .limit(120);

  const out = {};
  for (const r of rows) {
    const c = String(r.carat || "").toUpperCase();
    if ((c === "24K" || c === "22K" || c === "18K") && !out[c]) {
      out[c] = {
        ratePerGram: r.ratePerGram,
        marketPrice: r.marketPrice,
        source: r.source,
        effectiveDate: r.effectiveDate,
      };
    }
  }
  if (!out["24K"] || !out["22K"] || !out["18K"]) return null;
  return out;
}

async function getLatestBlockCached() {
  const now = Date.now();
  if (cache.data && now - cache.at < TTL_MS) return cache.data;
  const data = await loadLatestBlock();
  cache = { at: now, data };
  return data;
}

function purityToCarat(purity) {
  if (!purity) return null;
  const p = String(purity).toUpperCase().replace(/\s+/g, "");
  if (p.endsWith("KT")) return p.slice(0, -1);
  if (p === "24" || p === "24K") return "24K";
  if (p === "22" || p === "22K") return "22K";
  if (p === "18" || p === "18K") return "18K";
  return p; // already like "22K"
}

module.exports = { getLatestBlockCached, purityToCarat };
