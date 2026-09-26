const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true, unique: true },
  itemType: {
    type: String,
    enum: ['consultation', 'kundli_pdf', 'compatibility_report', 'gemstone_recommendation', 'annual_horoscope_report', 'wallet_recharge'],
    required: true
  },
  itemName: { type: String, required: true },
  amount: { type: Number, required: true }, // in INR
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  receipt: { type: String, default: '' },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
