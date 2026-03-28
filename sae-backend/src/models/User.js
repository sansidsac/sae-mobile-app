const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  clg_name: {
    type: String,
    trim: true,
    required: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
