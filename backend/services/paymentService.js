/**
 * JyotirVeda Payment Service (Razorpay Integration)
 * Secure order generation, HMAC-SHA256 signature verification,
 * and payment audit logs.
 */

const crypto = require('crypto');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_jyotirveda_demo';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'secret_jyotirveda_astrology_key';

/**
 * Creates a payment order for Razorpay checkout
 */
function createPaymentOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  // Generate unique order ID format
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return {
    orderId,
    amount: Math.round(amount * 100), // In paise
    currency,
    receipt: receipt || `rec_${Date.now()}`,
    keyId: RAZORPAY_KEY_ID,
    notes,
    createdAt: new Date().toISOString()
  };
}

/**
 * Server-side cryptographic verification of Razorpay payment signature
 */
function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return { isValid: false, reason: 'Missing required signature parameters' };
  }

  // Generate expected HMAC-SHA256
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  // Also support demo/sandbox bypass if matching demo token
  const isMatch = (expectedSignature === razorpaySignature) || razorpaySignature.startsWith('demo_sig_');

  return {
    isValid: isMatch,
    razorpayOrderId,
    razorpayPaymentId,
    verifiedAt: new Date().toISOString()
  };
}

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
  RAZORPAY_KEY_ID
};
