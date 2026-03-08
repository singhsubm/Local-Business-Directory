const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  // --- CORE FIELDS ---
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, default: 'no-photo.jpg' },
  category: { type: String, required: true },

  // Shop vs Individual
  listingType: {
    type: String,
    enum: ['shop', 'individual'],
    required: true
  },

  rating: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },

  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  showMap: { type: Boolean, default: true },

  galleryImages: [{ type: String }],
  galleryVideos: [{ type: String }],

  // --- 👤 INDIVIDUAL SPECIFIC FIELDS (Updated) ---
  individualDetails: {
    // Basic
    hasVehicle: { type: Boolean, default: false },
    hasTools: { type: Boolean, default: false },
    visitingCharge: { type: Number, default: 0 },
    //status
    status: { type: Boolean, default: true }, // true = available, false = unavailable

    // New Fields
    experience: { type: Number, default: 0, min: 0, max: 50 }, // in years
    serviceRadius: { type: Number, enum: [5, 10, 20, 50], default: 5 }, // in km
    availability: { type: String, enum: ['Morning', 'Evening', 'Full Day'], default: 'Full Day' },
    isEmergencyAvailable: { type: Boolean, default: false },

    // Arrays
    paymentModes: [{ type: String }], // e.g. ['UPI', 'Cash']
    languages: [{ type: String }],    // e.g. ['Hindi', 'English']
    skills: [{ type: String }]        // e.g. ['AC Repair', 'Wiring']
  },

  // --- 🏪 SHOP SPECIFIC FIELDS (New) ---
  shopDetails: {
    // Operations
    status: { type: Boolean, default: true }, // true = open, false = closed
    openingTime: { type: String }, // "09:00"
    closingTime: { type: String }, // "21:00"
    offDays: [{ type: String }],   // ['Monday', 'Sunday']

    // Booking Logic
    avgServiceTime: { type: String, enum: ['30 min', '45 min', '60 min'], default: '30 min' },
    maxCustomers: { type: Number },
    walkInAllowed: { type: Boolean, default: true },

    // Monetization
    priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', 'N/A'], default: 'N/A' },
    onlinePayment: { type: Boolean, default: true },
    cancellationPolicy: { type: String, enum: ['Flexible', 'Strict'], default: 'Flexible' },

    // Marketing
    topServices: [{ type: String }] // ['Haircut', 'Facial']
  },

  // --- 📅 BOOKING SYSTEM (Common) ---
  bookingType: {
    type: String,
    enum: ['none', 'time_slot', 'seat_booking'],
    default: 'none'
  },
  availableSlots: [{ type: String }],
  seatLayout: [{
    id: String,
    type: String,
    row: Number,
    col: Number,
    isBooked: Boolean
  }],
  totalSeats: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);