const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: role === 'admin' ? 'user' : (role || 'user') // protect admin role
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to JyotirVeda.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        walletBalance: user.walletBalance
      }
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Welcome back to JyotirVeda.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        walletBalance: user.walletBalance
      }
    });
  } catch (err) {
    next(err);
  }
});

// Current User
router.get('/me', auth, async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        avatar: req.user.avatar,
        walletBalance: req.user.walletBalance,
        createdAt: req.user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  // Return simulated confirmation for security
  res.json({
    success: true,
    message: `If an account exists for ${email}, a password reset verification link has been dispatched.`
  });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password required.' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    user.password = newPassword;
    await user.save();
  }
  res.json({
    success: true,
    message: 'Your password has been successfully reset. Please log in with your new credentials.'
  });
});

module.exports = router;
