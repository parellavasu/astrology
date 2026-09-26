const mongoose = require('mongoose');

const horoscopeSchema = new mongoose.Schema({
  sign: { type: String, required: true }, // Aries, Taurus, etc.
  date: { type: String, required: true }, // YYYY-MM-DD
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'daily' },
  dayOffset: { type: String, enum: ['yesterday', 'today', 'tomorrow'], default: 'today' },
  overview: { type: String, required: true },
  love: { type: String, required: true },
  career: { type: String, required: true },
  finance: { type: String, required: true },
  family: { type: String, required: true },
  health: { type: String, required: true },
  luckyNumber: { type: Number, default: 7 },
  luckyColor: { type: String, default: 'Gold' },
  auspiciousTime: { type: String, default: '10:00 AM - 11:30 AM' },
  ratingStars: {
    love: { type: Number, default: 4 },
    career: { type: Number, default: 5 },
    finance: { type: Number, default: 4 }
  },
  createdAt: { type: Date, default: Date.now }
});

horoscopeSchema.index({ sign: 1, date: 1, period: 1 });

module.exports = mongoose.model('Horoscope', horoscopeSchema);
