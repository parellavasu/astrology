const mongoose = require('mongoose');

const birthProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relation: { 
    type: String, 
    enum: ['Myself', 'Partner', 'Mother', 'Father', 'Child', 'Custom Profile'], 
    default: 'Myself' 
  },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  dob: { type: String, required: true }, // YYYY-MM-DD
  tob: { type: String, required: true }, // HH:MM
  place: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: Number, default: 5.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BirthProfile', birthProfileSchema);
