const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  astrologer: { type: mongoose.Schema.Types.ObjectId, ref: 'Astrologer', required: true },
  type: { type: String, enum: ['chat', 'call'], default: 'chat' },
  status: { type: String, enum: ['requested', 'active', 'completed', 'cancelled'], default: 'active' },
  durationMinutes: { type: Number, default: 15 },
  ratePerMinute: { type: Number, default: 25 },
  totalCost: { type: Number, default: 375 },
  messages: [
    {
      sender: { type: String, enum: ['user', 'astrologer', 'system'] },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  notes: { type: String, default: '' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model('Consultation', consultationSchema);
