const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true
  },
  contactName: { type: String, required: true }, // User ka naam bhi le lete hain safety ke liye
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  alternatePhone: { type: String }, // Optional
  date: {
    type: String, // YYYY-MM-DD format easiest rehta hai
    required: [true, 'Please select a date']
  },
  time: {
    type: String, // e.g. "10:00 AM"
    required: [true, 'Please select a time']
  },
  problem: {
    type: String,
    required: [true, 'Please describe your issue']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);