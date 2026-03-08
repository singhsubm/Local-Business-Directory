const Business = require('../models/Business');
const User = require('../models/User'); // ✅ Needed for Role Upgrade
const Blacklist = require('../models/Blacklist');
const uploadToCloudinary = require('../utils/cloudinary');
const cloudinary = require("cloudinary").v2;


const extractPublicId = (url) => {
  return url.split("/").pop().split(".")[0];
};


// @desc    Get all businesses (with Filters, Search & Toggle)
// @route   GET /api/businesses
exports.getBusinesses = async (req, res, next) => {
  try {
    let query;

    // 1. Basic Filters extraction
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'type'];
    removeFields.forEach(param => delete reqQuery[param]);

    // 2. Start Query Construction
    let queryObj = { ...reqQuery };

    // 🟢 3. SEARCH LOGIC (Name, Category, City)
    if (req.query.search) {
      const keyword = req.query.search;
      queryObj.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 🟢 4. TOGGLE LOGIC (Shop vs Individual)
    if (req.query.type) {
      queryObj.listingType = req.query.type;
    }

    // Initialize Find
    query = Business.find(queryObj).populate('owner', 'name email');

    // 5. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default: Newest first
    }

    // Execute
    const businesses = await query;

    res.status(200).json({ success: true, count: businesses.length, data: businesses });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Single Business
// @route   GET /api/businesses/:id
exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name email');

    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    res.status(200).json({ success: true, data: business });
  } catch (err) {
    next(err);
  }
};

// @desc    Create New Business (FIXED: Auto-Upgrade Role)
// @route   POST /api/businesses
exports.createBusiness = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    // 🟢 1. GET USER ROLE & CURRENT LISTINGS
    const userRole = req.user.role;
    const existingBusinesses = await Business.find({ owner: req.user.id });

    const shopCount = existingBusinesses.filter(b => b.listingType === 'shop').length;
    const individualCount = existingBusinesses.filter(b => b.listingType === 'individual').length;

    const newListingType = req.body.listingType || 'shop'; // Default fallback

    // 🟢 2. APPLY RESTRICTIONS (BUT ALLOW 'USER' TO PASS)

    // Note: We REMOVED the block for 'user'. They are allowed to proceed.

    // Case A: Individual Professional (Max 1 Listing Only)
    if (userRole === 'professional') {
      if (existingBusinesses.length >= 1) {
        return res.status(400).json({ success: false, error: "Individual Professionals can only list 1 service profile." });
      }
      // Professional sirf 'individual' list kar sakta hai, 'shop' nahi
      if (newListingType === 'shop') {
        return res.status(400).json({ success: false, error: "Individual Professionals cannot list a Shop. Please upgrade to Business account." });
      }
    }

    // Case B: Shop Owner (Business) (1 Shop + 3 Individuals)
    if (userRole === 'business') {
      if (newListingType === 'shop' && shopCount >= 1) {
        return res.status(400).json({ success: false, error: "You can only list 1 Shop." });
      }
      if (newListingType === 'individual' && individualCount >= 3) {
        return res.status(400).json({ success: false, error: "You can only add up to 3 Individual Workers." });
      }
    }

    // 🟢 3. PARSING LOGIC
    if (req.body.location && typeof req.body.location === 'string') {
      try { req.body.location = JSON.parse(req.body.location); } catch (e) { }
    }
    if (req.body.individualDetails && typeof req.body.individualDetails === 'string') {
      try { req.body.individualDetails = JSON.parse(req.body.individualDetails); } catch (e) { }
    }
    if (req.body.shopDetails && typeof req.body.shopDetails === "string") {
      try { req.body.shopDetails = JSON.parse(req.body.shopDetails); } catch (e) { }
    }


    // 🟢 4. IMAGE UPLOAD LOGIC
    if (req.files && req.files.image && req.files.image.length > 0) {
      const file = req.files.image[0];
      const result = await uploadToCloudinary(file.buffer);
      req.body.image = result.secure_url;
    } else if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      req.body.image = result.secure_url;
    }

    // 🟢 5. CREATE ENTRY
    const business = await Business.create(req.body);

    // 🟢 6. AUTO-UPGRADE ROLE (The Fix)
    // Agar user pehle normal 'user' tha, ab wo Business/Pro ban gaya hai.
    if (userRole === 'user') {
      const newRole = newListingType === 'shop' ? 'business' : 'professional';
      await User.findByIdAndUpdate(req.user.id, { role: newRole });
    }

    res.status(201).json({ success: true, data: business });

  } catch (err) {
    console.error("Create Business Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Business name or phone already exists' });
    }
    next(err);
  }
};

// @desc    Update Business (Details + Gallery)
// @route   PUT /api/businesses/:id
exports.updateBusiness = async (req, res, next) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) return res.status(404).json({ error: "Business not found" });

    // Security check
    if (business.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const deletedImages = JSON.parse(req.body.deletedImages || "[]");
    const deletedVideos = JSON.parse(req.body.deletedVideos || "[]");

    // 🔥 CLOUDINARY DELETE
    for (const url of deletedImages) {
      await cloudinary.uploader.destroy(extractPublicId(url));
    }

    for (const url of deletedVideos) {
      await cloudinary.uploader.destroy(extractPublicId(url), {
        resource_type: "video",
      });
    }

    // 🔥 ALWAYS REMOVE FROM MONGO (even if no new uploads)
    business.galleryImages = business.galleryImages.filter(
      img => !deletedImages.includes(img)
    );

    business.galleryVideos = business.galleryVideos.filter(
      vid => !deletedVideos.includes(vid)
    );

    // TEXT FIELDS
    const fieldsToUpdate = { ...req.body };

    if (typeof fieldsToUpdate.location === "string")
      fieldsToUpdate.location = JSON.parse(fieldsToUpdate.location);

    if (typeof fieldsToUpdate.individualDetails === "string")
      fieldsToUpdate.individualDetails = JSON.parse(fieldsToUpdate.individualDetails);
    if (req.body.shopDetails && typeof req.body.shopDetails === "string") {
      fieldsToUpdate.shopDetails = JSON.parse(fieldsToUpdate.shopDetails);
    }


    // FILE UPLOADS
    if (req.files) {

      // MAIN IMAGE
      if (req.files.image) {
        const result = await uploadToCloudinary(
          req.files.image[0].buffer || req.files.image[0].path
        );
        fieldsToUpdate.image = result.secure_url;
      }

      // GALLERY IMAGES
      if (req.files.galleryImages) {
        const imgResults = await Promise.all(
          req.files.galleryImages.map(file =>
            uploadToCloudinary(file.buffer || file.path)
          )
        );

        const newImgUrls = imgResults.map(r => r.secure_url);

        const allowed = 10 - business.galleryImages.length;

        fieldsToUpdate.galleryImages = [
          ...business.galleryImages,
          ...newImgUrls.slice(0, allowed)
        ];
      } else {
        fieldsToUpdate.galleryImages = business.galleryImages;
      }

      // GALLERY VIDEOS
      if (req.files.galleryVideos) {
        const vidResults = await Promise.all(
          req.files.galleryVideos.map(file =>
            uploadToCloudinary(file.buffer || file.path, "video")
          )
        );

        const newVidUrls = vidResults.map(r => r.secure_url);

        const allowed = 3 - business.galleryVideos.length;

        fieldsToUpdate.galleryVideos = [
          ...business.galleryVideos,
          ...newVidUrls.slice(0, allowed)
        ];
      } else {
        fieldsToUpdate.galleryVideos = business.galleryVideos;
      }
    } else {
      fieldsToUpdate.galleryImages = business.galleryImages;
      fieldsToUpdate.galleryVideos = business.galleryVideos;
    }

    // FINAL DB UPDATE
    business = await Business.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: business });

  } catch (err) {
    next(err);
  }
};


// @desc    Get Businesses within Radius
exports.getBusinessesInRadius = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.query;

    // Earth Radius = 6378 km
    const radius = distance / 6378;

    const businesses = await Business.find({
      location: {
        $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius] }
      }
    });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's businesses
// @route   GET /api/businesses/me
exports.getMyBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ owner: req.user.id });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Business
// @route   DELETE /api/businesses/:id
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: `Not authorized to delete` });
    }

    await business.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};