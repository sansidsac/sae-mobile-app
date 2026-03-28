const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  geofence: {
    lat: {
      type: Number,
      required: true
    },
    long: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['in', 'out'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('UserLocation', userLocationSchema);
