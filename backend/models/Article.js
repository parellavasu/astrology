const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: [
      'Vedic Astrology',
      'Zodiac Signs',
      'Kundli',
      'Marriage',
      'Career',
      'Nakshatra',
      'Planets',
      'Houses',
      'Dasha',
      'Panchang',
      'Remedies'
    ],
    required: true
  },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  readingTime: { type: String, default: '5 min read' },
  author: {
    name: { type: String, default: 'Acharya Vidyadhar' },
    role: { type: String, default: 'Principal Vedic Scholar' },
    avatar: { type: String, default: '' }
  },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
