const mongoose = require('mongoose');

const kundliMatchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  person1: {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    tob: { type: String, required: true },
    place: { type: String, required: true },
    nakshatra: String,
    moonSign: String
  },
  person2: {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    tob: { type: String, required: true },
    place: { type: String, required: true },
    nakshatra: String,
    moonSign: String
  },
  totalScore: { type: Number, required: true },
  maxScore: { type: Number, default: 36 },
  percentage: { type: Number, required: true },
  verdict: { type: String, required: true },
  kootas: [{ type: Object }],
  manglik: { type: Object },
  summaryText: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KundliMatch', kundliMatchSchema);
