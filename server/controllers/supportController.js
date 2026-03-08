const SupportTicket = require('../models/Support');

// @desc    Create New Ticket
// @route   POST /api/support
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, message, role } = req.body;

    const ticket = await SupportTicket.create({
      user: req.user.id,
      subject,
      message,
      role: role || 'user' // 'user' or 'business'
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Get My Tickets
// @route   GET /api/support/me
exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
};