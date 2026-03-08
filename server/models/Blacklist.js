const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  reason: { type: String, required: true }, // Kyu block kiya?
  blockedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blacklist', BlacklistSchema);