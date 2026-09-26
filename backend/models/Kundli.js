const mongoose = require('mongoose');

const kundliSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  birthProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'BirthProfile' },
  name: { type: String, required: true },
  gender: { type: String, default: 'male' },
  dob: { type: String, required: true },
  tob: { type: String, required: true },
  place: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: Number, default: 5.5 },
  basicInfo: { type: Object, required: true },
  planetaryPositions: [{ type: Object }],
  houses: [{ type: Object }],
  dasha: { type: Object },
  charts: {
    d1: [{ type: Object }],
    d9: [{ type: Object }]
  },
  analysis: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kundli', kundliSchema);
