const LoyaltyProgram = require('../models/LoyaltyProgram');
const User = require('../models/User');
const { tierThresholds } = require('../models/LoyaltyProgram');

// Generate unique referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create or get loyalty program for user
exports.getOrCreateLoyaltyProgram = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let loyaltyProgram = await LoyaltyProgram.findOne({ userId });
    
    if (!loyaltyProgram) {
      loyaltyProgram = new LoyaltyProgram({
        userId,
        referralCode: generateReferralCode()
      });
      await loyaltyProgram.save();
    }

    res.json(loyaltyProgram);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loyalty program', error: error.message });
  }
};

// Add points to user's account
exports.addPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points, description, orderId } = req.body;
    
    const loyaltyProgram = await LoyaltyProgram.findOne({ userId });
    if (!loyaltyProgram) {
      return res.status(404).json({ message: 'Loyalty program not found' });
    }

    await loyaltyProgram.addPoints(points, description, orderId);
    res.json(loyaltyProgram);
  } catch (error) {
    res.status(500).json({ message: 'Error adding points', error: error.message });
  }
};

// Redeem points
exports.redeemPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points, description } = req.body;
    
    const loyaltyProgram = await LoyaltyProgram.findOne({ userId });
    if (!loyaltyProgram) {
      return res.status(404).json({ message: 'Loyalty program not found' });
    }

    await loyaltyProgram.redeemPoints(points, description);
    res.json(loyaltyProgram);
  } catch (error) {
    if (error.message === 'Insufficient points') {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    res.status(500).json({ message: 'Error redeeming points', error: error.message });
  }
};

// Get tier information
exports.getTierInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const loyaltyProgram = await LoyaltyProgram.findOne({ userId });
    if (!loyaltyProgram) {
      return res.status(404).json({ message: 'Loyalty program not found' });
    }

    const currentTier = loyaltyProgram.tier;
    const tierInfo = tierThresholds[currentTier];
    const nextTier = Object.entries(tierThresholds).find(([tier, config]) => 
      config.minPoints > loyaltyProgram.points
    );

    res.json({
      currentTier,
      points: loyaltyProgram.points,
      tierInfo,
      nextTier: nextTier ? { name: nextTier[0], minPoints: nextTier[1].minPoints } : null,
      pointsToNextTier: nextTier ? nextTier[1].minPoints - loyaltyProgram.points : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tier info', error: error.message });
  }
};

// Process referral
exports.processReferral = async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;
    
    const referrerProgram = await LoyaltyProgram.findOne({ referralCode });
    if (!referrerProgram) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Add points to referrer
    await referrerProgram.addPoints(500, 'Referral bonus', null);
    
    // Add referral record
    referrerProgram.referrals.push({
      referredUserId: newUserId,
      pointsEarned: 500,
      timestamp: new Date()
    });
    await referrerProgram.save();

    // Create loyalty program for new user with bonus
    const newProgram = new LoyaltyProgram({
      userId: newUserId,
      referralCode: generateReferralCode(),
      points: 100, // Sign-up bonus
      pointsHistory: [{
        type: 'earned',
        points: 100,
        description: 'Sign-up bonus',
        timestamp: new Date()
      }]
    });
    await newProgram.save();

    res.json({ message: 'Referral processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing referral', error: error.message });
  }
};

// Get available rewards
exports.getAvailableRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const loyaltyProgram = await LoyaltyProgram.findOne({ userId });
    if (!loyaltyProgram) {
      return res.status(404).json({ message: 'Loyalty program not found' });
    }

    // Define available rewards based on tier
    const rewards = [
      {
        id: 'discount-500',
        name: '₹500 Discount',
        description: 'Get ₹500 off on your next purchase',
        pointsRequired: 500,
        available: loyaltyProgram.points >= 500
      },
      {
        id: 'discount-1000',
        name: '₹1000 Discount',
        description: 'Get ₹1000 off on your next purchase',
        pointsRequired: 1000,
        available: loyaltyProgram.points >= 1000
      },
      {
        id: 'free-shipping',
        name: 'Free Shipping',
        description: 'Free shipping on your next order',
        pointsRequired: 300,
        available: loyaltyProgram.points >= 300
      },
      {
        id: 'exclusive-gift',
        name: 'Exclusive Gift',
        description: 'Receive an exclusive jewelry piece',
        pointsRequired: 5000,
        available: loyaltyProgram.points >= 5000
      }
    ];

    res.json({
      rewards,
      userPoints: loyaltyProgram.points,
      userTier: loyaltyProgram.tier
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};

// Get points history
exports.getPointsHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    const loyaltyProgram = await LoyaltyProgram.findOne({ userId });
    if (!loyaltyProgram) {
      return res.status(404).json({ message: 'Loyalty program not found' });
    }

    const history = loyaltyProgram.pointsHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};
