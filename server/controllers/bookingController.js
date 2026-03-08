const Booking = require('../models/Booking');
const Business = require('../models/Business');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
  try {
    const { 
      businessId, 
      date, 
      time, 
      problem, 
      // 🟢 New Fields Extract karo
      contactName,
      contactPhone, 
      contactEmail, 
      alternatePhone 
    } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    if (business.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: 'Owner cannot book own business' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      business: businessId,
      date,
      time,
      problem,
      // 🟢 Save New Fields
      contactName,
      contactPhone,
      contactEmail,
      alternatePhone
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};


// @desc    Get bookings for a specific business (For Owner Dashboard)
// @route   GET /api/bookings/business/:businessId
// @access  Private (Owner)
exports.getBusinessBookings = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.businessId);

    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const bookings = await Booking.find({ business: req.params.businessId })
      .populate('user', 'name email')
      .populate('business', 'name image address')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings (For Customer Dashboard)
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('business', 'name image address phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Update Status (Accept/Reject)
// @route   PUT /api/bookings/:id
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'confirmed' or 'rejected'
    const booking = await Booking.findById(req.params.id);

    if(!booking) return res.status(404).json({error: "Booking not found"});

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    // only owner can delete
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
