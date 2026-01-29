// services/pricing.js
function chooseWeight(product) {
  const net = Number(product?.netWeight || 0);
  const gross = Number(product?.grossWeight || 0);
  return net > 0 ? net : gross;
}

/**
 * Enhanced 7-step pricing formula with stone value logic
 * 1. goldValue     = rate × weight
 * 2. makingValue   = goldValue × (makingPercent / 100)
 * 3. wastageValue  = goldValue × (wastagePercent / 100)
 * 4. stoneValue    = flat or % of goldValue
 * 5. actualPrice   = goldValue + makingValue + wastageValue + stoneValue
 * 6. discount      = (makingValue + stoneValue) × (discountPercent / 100)
 * 7. salePrice     = goldValue + (makingValue + stoneValue - discount) + wastageValue
 */
function computePriceBreakdown({ ratePerGram, product }) {
  const weight = chooseWeight(product);
  const rate = Number(ratePerGram || 0);
  const goldValue = rate * weight;

  // Support both flat and percentage for making charges
  // If makingCharges > 100, treat as flat amount; otherwise as percentage
  const makingRaw = Number(product?.makingCharge || product?.makingCharges || 0);
  const makingValue = makingRaw > 100 
    ? makingRaw  // Flat amount
    : goldValue * (makingRaw / 100);  // Percentage

  // Support both flat and percentage for wastage charges
  // If wastageCharge > 100, treat as flat amount; otherwise as percentage
  const wastageRaw = Number(product?.wastageCharge || product?.wastageCharges || 0);
  const wastageValue = wastageRaw > 100
    ? wastageRaw  // Flat amount
    : goldValue * (wastageRaw / 100);  // Percentage

  const stoneRaw = product?.stoneValue || 0;
  const discountPercent = Number(product?.discount || 0);

  // Detect if stone value is given as % or flat ₹
  const stoneValue =
    Number(stoneRaw) <= 1 ? goldValue * Number(stoneRaw) : Number(stoneRaw);

  // Actual price before discount
  const actualPrice = goldValue + makingValue + wastageValue + stoneValue;

  // Discount applied on (making + stone)
  const discount = (makingValue + stoneValue) * (discountPercent / 100);

  // Final sale price
  const salePrice =
    goldValue + (makingValue + stoneValue - discount) + wastageValue;

  return {
    goldValue,
    makingValue,
    wastageValue,
    stoneValue,
    discount,
    actualPrice: Math.round(actualPrice),
    salesPrice: Math.round(salePrice),
  };
}

function computePriceExplain({ ratePerGram, product }) {
  const weight = chooseWeight(product);
  const rate = Number(ratePerGram || 0);
  const goldValue = rate * weight;

  // Support both flat and percentage for making charges
  // If makingCharges > 100, treat as flat amount; otherwise as percentage
  const makingRaw = Number(product?.makingCharge || product?.makingCharges || 0);
  const makingValue = makingRaw > 100 
    ? makingRaw  // Flat amount
    : goldValue * (makingRaw / 100);  // Percentage

  // Support both flat and percentage for wastage charges
  // If wastageCharge > 100, treat as flat amount; otherwise as percentage
  const wastageRaw = Number(product?.wastageCharge || product?.wastageCharges || 0);
  const wastageValue = wastageRaw > 100
    ? wastageRaw  // Flat amount
    : goldValue * (wastageRaw / 100);  // Percentage

  const stoneRaw = product?.stoneValue || 0;
  const discountPercent = Number(product?.discount || 0);

  const stoneValue =
    Number(stoneRaw) <= 1 ? goldValue * Number(stoneRaw) : Number(stoneRaw);

  const actualPrice = goldValue + makingValue + wastageValue + stoneValue;
  const discount = (makingValue + stoneValue) * (discountPercent / 100);
  const salePrice =
    goldValue + (makingValue + stoneValue - discount) + wastageValue;

  return {
    purity: product?.purity,
    ratePerGram: rate,
    weight,
    makingRaw: makingRaw,
    wastageRaw: wastageRaw,
    discountPercent,
    goldValue,
    makingValue,
    wastageValue,
    stoneValue,
    discount,
    actualPrice: Math.round(actualPrice),
    salesPrice: Math.round(salePrice),
  };
}

// Legacy support
function computePrice({ ratePerGram, product }) {
  return computePriceBreakdown({ ratePerGram, product }).actualPrice;
}

module.exports = { computePrice, computePriceBreakdown, computePriceExplain };
