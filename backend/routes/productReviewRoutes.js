const express = require('express');
const router = express.Router();
const productReviewController = require('../controllers/productReviewController');

// Create review
router.post('/', productReviewController.createReview);

// Get product reviews
router.get('/product/:productId', productReviewController.getProductReviews);

// Get user reviews
router.get('/user/:userId', productReviewController.getUserReviews);

// Vote on review
router.put('/:reviewId/vote', productReviewController.voteReview);

// Moderate review (admin)
router.put('/:reviewId/moderate', productReviewController.moderateReview);

// Delete review
router.delete('/:reviewId', productReviewController.deleteReview);

module.exports = router;
