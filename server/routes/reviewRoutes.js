const express = require('express');
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// mergeParams: true zaroori hai taaki businessId mil sake
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, authorize('user', 'admin'), addReview); // Sirf 'user' review de sakta hai

router.route('/:id')
  .delete(protect, deleteReview);

module.exports = router;