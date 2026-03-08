const User = require('../models/User');
const Business = require('../models/Business');
const Support = require('../models/Support');
const Blacklist = require('../models/Blacklist');

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBusinesses = await Business.countDocuments();
    const pendingBusinesses = await Business.countDocuments({ isApproved: false });

    res.status(200).json({
      success: true,
      data: { totalUsers, totalBusinesses, pendingBusinesses }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Pending Businesses
// @route   GET /api/admin/pending
exports.getPendingBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ isApproved: false }).populate('owner', 'name email');
    res.status(200).json({ success: true, count: businesses.length, data: businesses });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Business
// @route   PUT /api/admin/verify/:id
exports.verifyBusiness = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved', 'rejected', 'revoked'
    const business = await Business.findById(req.params.id);

    if (!business) return res.status(404).json({ success: false, error: 'Business not found' });

    if (status === 'approved') {
      business.isApproved = true;
    } else if (status === 'rejected' || status === 'revoked') {
      business.isApproved = false; // Sirf approval hatao, delete mat karo taaki record rahe
    }

    await business.save();
    res.status(200).json({ success: true, data: business });
  } catch (error) {
    next(error);
  }
};

exports.blacklistLocation = async (req, res, next) => {
  try {
    const { businessId, reason } = req.body;
    const business = await Business.findById(businessId);
    
    if(!business) return res.status(404).json({error: "Business not found"});

    // Create Blacklist Entry
    await Blacklist.create({
      latitude: business.location.coordinates[1],
      longitude: business.location.coordinates[0],
      reason
    });

    // Business ko bhi reject/delete kar do
    business.isApproved = false;
    await business.save(); // Ya await business.deleteOne();

    res.status(200).json({ success: true, message: "Location Blacklisted" });
  } catch (error) {
    next(error);
  }
};


exports.getSupportTickets = async (req, res, next) => {
  try {
    const tickets = await Support.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

exports.resolveTicket = async (req, res, next) => {
  try {
    const ticket = await Support.findById(req.params.id);
    ticket.status = 'resolved';
    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};