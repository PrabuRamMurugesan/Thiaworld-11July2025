const ProductReview = require('../models/ProductReview');
const Product = require('../models/Product');

// Create product review
exports.createReview = async (req, res) => {
  try {
    const { productId, userId, userName, rating, title, comment, images } = req.body;
    
    // Check if user already reviewed this product
    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new ProductReview({
      productId,
      userId,
      userName,
      rating,
      title,
      comment,
      images: images || [],
      verified: false // Will be set to true if user purchased the product
    });

    const savedReview = await review.save();

    // Update product's average rating
    await updateProductRating(productId);

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1 };
        break;
      case 'helpful':
        sortOptions = { helpful: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const reviews = await ProductReview.find({ 
      productId, 
      status: 'approved' 
    })
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name profileImage');

    const total = await ProductReview.countDocuments({ productId, status: 'approved' });

    // Calculate rating distribution
    const ratingStats = await ProductReview.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId), status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    ratingStats.forEach(stat => {
      ratingDistribution[stat._id] = stat.count;
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      },
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await ProductReview.find({ userId })
      .sort({ createdAt: -1 })
      .populate('productId', 'name images');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
};

// Mark review as helpful/not helpful
exports.voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, vote } = req.body; // vote: 'helpful' or 'notHelpful'

    const review = await ProductReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (vote === 'helpful') {
      if (!review.helpfulUsers.includes(userId)) {
        review.helpful += 1;
        review.helpfulUsers.push(userId);
        
        // Remove from notHelpful if user previously voted that way
        if (review.notHelpfulUsers.includes(userId)) {
          review.notHelpful -= 1;
          review.notHelpfulUsers = review.notHelpfulUsers.filter(id => id.toString() !== userId.toString());
        }
      }
    } else if (vote === 'notHelpful') {
      if (!review.notHelpfulUsers.includes(userId)) {
        review.notHelpful += 1;
        review.notHelpfulUsers.push(userId);
        
        // Remove from helpful if user previously voted that way
        if (review.helpfulUsers.includes(userId)) {
          review.helpful -= 1;
          review.helpfulUsers = review.helpfulUsers.filter(id => id.toString() !== userId.toString());
        }
      }
    }

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error voting on review', error: error.message });
  }
};

// Admin: Approve/reject review
exports.moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, response } = req.body;

    const review = await ProductReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    
    if (response && status === 'approved') {
      review.response = {
        text: response.text,
        respondedBy: response.respondedBy,
        respondedAt: new Date()
      };
    }

    const updatedReview = await review.save();

    // Update product rating if approved
    if (status === 'approved') {
      await updateProductRating(review.productId);
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error moderating review', error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await ProductReview.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.productId;
    await ProductReview.findByIdAndDelete(reviewId);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Helper function to update product's average rating
async function updateProductRating(productId) {
  try {
    const reviews = await ProductReview.find({ productId, status: 'approved' });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, { 
        averageRating: 0, 
        reviewCount: 0 
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, { 
      averageRating: averageRating.toFixed(1), 
      reviewCount: reviews.length 
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}
