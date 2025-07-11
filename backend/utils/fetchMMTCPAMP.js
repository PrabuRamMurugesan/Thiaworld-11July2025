// utils/fetchMMTCPAMP.js

/**
 * Simulates calling MMTC-PAMP's live rate API.
 * Replace with your real HTTP request.
 */
const fetchMMTCPAMP = async (metalType) => {
  // Simulated prices:
  const prices = {
    Gold: 6500, // example INR/gram for 24K
    Silver: 80,
    Platinum: 3500,
    Diamond: 12000,
  };
  return prices[metalType] || null;
};

module.exports = fetchMMTCPAMP;
