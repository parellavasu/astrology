const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { createPaymentOrder, verifyPaymentSignature, RAZORPAY_KEY_ID } = require('../services/paymentService');
const { auth } = require('../middleware/auth');

// Create payment order
router.post('/create', auth, async (req, res, next) => {
  try {
    const { itemType, itemName, amount, metadata = {} } = req.body;

    if (!itemType || !itemName || !amount) {
      return res.status(400).json({ success: false, message: 'Please specify itemType, itemName, and amount.' });
    }

    const razorpayOrder = createPaymentOrder({
      amount: Number(amount),
      receipt: `order_${req.user._id.toString().slice(-4)}_${Date.now()}`,
      notes: { userId: req.user._id.toString(), itemName }
    });

    const newOrder = new Order({
      user: req.user._id,
      orderId: razorpayOrder.orderId,
      itemType,
      itemName,
      amount: Number(amount),
      currency: 'INR',
      status: 'created',
      razorpayOrderId: razorpayOrder.orderId,
      receipt: razorpayOrder.receipt,
      metadata
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order: {
        id: newOrder._id,
        orderId: newOrder.orderId,
        amount: newOrder.amount,
        currency: newOrder.currency,
        itemName: newOrder.itemName,
        razorpayKeyId: RAZORPAY_KEY_ID
      }
    });
  } catch (err) {
    next(err);
  }
});

// Verify payment signature
router.post('/verify', auth, async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId) {
      return res.status(400).json({ success: false, message: 'Incomplete payment payload for verification.' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order reference not found in database.' });
    }

    // Verify cryptographic signature
    const verification = verifyPaymentSignature({
      razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'demo_sig_verified'
    });

    if (!verification.isValid) {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Untrusted transaction rejected.'
      });
    }

    // Update order status to paid
    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    order.paidAt = new Date();
    await order.save();

    // If wallet recharge, credit user balance
    if (order.itemType === 'wallet_recharge') {
      const user = await User.findById(req.user._id);
      user.walletBalance = (user.walletBalance || 0) + order.amount;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Payment successfully authenticated and processed.',
      order: {
        orderId: order.orderId,
        itemName: order.itemName,
        amount: order.amount,
        paidAt: order.paidAt,
        status: order.status,
        paymentId: order.razorpayPaymentId
      }
    });
  } catch (err) {
    next(err);
  }
});

// User payment history
router.get('/my-orders', auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
