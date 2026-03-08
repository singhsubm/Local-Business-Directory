const express = require('express');
const reviewRouter = require('./reviewRoutes');
const multer = require('multer');
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  getBusinessesInRadius,
  getMyBusinesses,
  deleteBusiness
} = require('../controllers/businessController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Multer Setup (Memory Storage)
const upload = multer(); 

const router = express.Router();

// 🟢 Configure Upload Fields (Gallery + Main Image)
const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },           // Main Image
    { name: 'galleryImages', maxCount: 10 },  // Gallery Pics
    { name: 'galleryVideos', maxCount: 3 }    // Gallery Videos
]);

// Helper Routes
router.route('/me').get(protect, getMyBusinesses);
router.route('/radius').get(getBusinessesInRadius);

// Main Routes
router.route('/')
  .get(getBusinesses)
  // 🟢 FIXED: Added 'user' and 'professional' here. 
  // Ab normal user (customer) bhi list create kar payega aur controller uska role upgrade kar dega.
  .post(protect, authorize('user', 'business', 'professional', 'admin'), uploadFields, createBusiness); 

// Single Business Operations
router.route('/:id')
  .get(getBusiness)
  // 🟢 FIXED: Added 'professional' here too.
  // Taaki Individual Professional apni details update kar sake.
  .put(protect, authorize('business', 'professional', 'admin'), uploadFields, updateBusiness) 
  .delete(protect, authorize('business', 'professional', 'admin'), deleteBusiness);

// Review Re-routing
router.use('/:businessId/reviews', reviewRouter);

module.exports = router;