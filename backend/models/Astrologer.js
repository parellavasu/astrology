const mongoose = require('mongoose');

const astrologerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  displayName: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, required: true },
  title: { type: String, default: 'Senior Vedic Astrologer' },
  specializations: [{ type: String }], // e.g. ['Vedic Astrology', 'Vastu', 'Kundli Milan', 'Career Astrologer', 'Tarot']
  languages: [{ type: String }],       // e.g. ['English', 'Hindi', 'Sanskrit', 'Telugu']
  experienceYears: { type: Number, required: true, default: 10 },
  rating: { type: Number, default: 4.9 },
  reviewCount: { type: Number, default: 120 },
  consultationsCount: { type: Number, default: 850 },
  perMinuteRate: { type: Number, required: true, default: 25 }, // INR
  isVerified: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: true },
  availability: {
    days: [{ type: String }],
    hours: { type: String, default: '10:00 AM - 08:00 PM IST' }
  },
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Astrologer', astrologerSchema);
