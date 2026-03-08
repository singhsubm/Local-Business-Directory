
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment']
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// User ko ek business par 1 hi review allow karenge
ReviewSchema.index({ business: 1, user: 1 }, { unique: true });

// --- STATIC METHOD TO CALCULATE AVERAGE RATING ---
// Ye method apne aap chalega jab bhi review save ya delete hoga
ReviewSchema.statics.getAverageRating = async function(businessId) {
  const obj = await this.aggregate([
    {
      $match: { business: businessId }
    },
    {
      $group: {
        _id: '$business',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    // Business Model ko update karo
    await this.model('Business').findByIdAndUpdate(businessId, {
      rating: obj[0] ? obj[0].averageRating.toFixed(1) : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.business);
});

module.exports = mongoose.model('Review', ReviewSchema);