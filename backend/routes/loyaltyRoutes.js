const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');

// Get or create loyalty program
router.get('/user/:userId', loyaltyController.getOrCreateLoyaltyProgram);

// Add points
router.post('/user/:userId/points', loyaltyController.addPoints);

// Redeem points
router.post('/user/:userId/redeem', loyaltyController.redeemPoints);

// Get tier information
router.get('/user/:userId/tier', loyaltyController.getTierInfo);

// Process referral
router.post('/referral', loyaltyController.processReferral);

// Get available rewards
router.get('/user/:userId/rewards', loyaltyController.getAvailableRewards);

// Get points history
router.get('/user/:userId/history', loyaltyController.getPointsHistory);

module.exports = router;
