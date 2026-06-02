const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  pointsHistory: [{
    type: {
      type: String,
      enum: ['earned', 'redeemed', 'expired', 'adjusted']
    },
    points: Number,
    description: String,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  rewards: [{
    rewardId: String,
    name: String,
    description: String,
    pointsRequired: Number,
    redeemed: {
      type: Boolean,
      default: false
    },
    redeemedAt: Date,
    expiresAt: Date
  }],
  referralCode: {
    type: String,
    unique: true
  },
  referrals: [{
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pointsEarned: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Tier thresholds and benefits
const tierThresholds = {
  bronze: { minPoints: 0, multiplier: 1, benefits: ['Basic support', 'Birthday bonus'] },
  silver: { minPoints: 1000, multiplier: 1.1, benefits: ['Priority support', 'Free shipping on orders over ₹5000', 'Birthday bonus'] },
  gold: { minPoints: 5000, multiplier: 1.2, benefits: ['VIP support', 'Free shipping', 'Exclusive offers', 'Birthday bonus'] },
  platinum: { minPoints: 15000, multiplier: 1.3, benefits: ['Dedicated support', 'Free shipping', 'Exclusive offers', 'Early access', 'Birthday bonus'] },
  diamond: { minPoints: 50000, multiplier: 1.5, benefits: ['Personal shopper', 'Free express shipping', 'Exclusive offers', 'Early access', 'VIP events', 'Birthday bonus'] }
};

loyaltyProgramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-update tier based on points
  let newTier = 'bronze';
  for (const [tier, config] of Object.entries(tierThresholds)) {
    if (this.points >= config.minPoints) {
      newTier = tier;
    }
  }
  this.tier = newTier;
  
  next();
});

loyaltyProgramSchema.methods.calculateTierMultiplier = function() {
  return tierThresholds[this.tier].multiplier;
};

loyaltyProgramSchema.methods.getTierBenefits = function() {
  return tierThresholds[this.tier].benefits;
};

loyaltyProgramSchema.methods.addPoints = function(points, description, orderId = null) {
  this.points += points;
  this.pointsHistory.push({
    type: 'earned',
    points,
    description,
    orderId,
    timestamp: new Date()
  });
  return this.save();
};

loyaltyProgramSchema.methods.redeemPoints = function(points, description) {
  if (this.points < points) {
    throw new Error('Insufficient points');
  }
  this.points -= points;
  this.pointsHistory.push({
    type: 'redeemed',
    points: -points,
    description,
    timestamp: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);
module.exports.tierThresholds = tierThresholds;
