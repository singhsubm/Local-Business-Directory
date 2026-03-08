const Review = require('../models/Review');
const Business = require('../models/Business');

// @desc    Get reviews for a business
// @route   GET /api/businesses/:businessId/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId })
      .populate({
        path: 'user',
        select: 'name' // Sirf naam chahiye reviewer ka
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Review
// @route   POST /api/businesses/:businessId/reviews
// @access  Private (Logged in user only)
exports.addReview = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;
    req.body.user = req.user.id;

    const business = await Business.findById(req.params.businessId);

    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    // Check if user is the owner (Owner apne business pe review nahi de sakta)
    if (business.owner.toString() === req.user.id) {
        return res.status(400).json({ success: false, error: 'You cannot review your own business' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    // Duplicate review check
    if(error.code === 11000) {
        return res.status(400).json({ success: false, error: 'You have already reviewed this business' });
    }
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    // Allow if user is owner of review OR user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};