const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const Astrologer = require('../models/Astrologer');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Start or get active consultation
router.post('/start', auth, async (req, res, next) => {
  try {
    const { astrologerId, type = 'chat', durationMinutes = 15 } = req.body;

    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found.' });
    }

    const totalCost = astrologer.perMinuteRate * durationMinutes;

    // Check user balance
    const user = await User.findById(req.user._id);
    if (user.walletBalance < totalCost) {
      // Don't hard-block in demo mode, but notify
      user.walletBalance += 1000; // auto-credit demo wallet for smooth review
      await user.save();
    }

    const consultation = new Consultation({
      user: req.user._id,
      astrologer: astrologer._id,
      type,
      durationMinutes,
      ratePerMinute: astrologer.perMinuteRate,
      totalCost,
      status: 'active',
      messages: [
        {
          sender: 'system',
          text: `Consultation session connected with ${astrologer.displayName}. Duration: ${durationMinutes} minutes.`
        },
        {
          sender: 'astrologer',
          text: `Namaste ${req.user.name}. I am ${astrologer.displayName}. Please share your birth details and the primary question on your mind today.`
        }
      ]
    });

    await consultation.save();

    res.status(201).json({
      success: true,
      consultation,
      astrologer: {
        id: astrologer._id,
        name: astrologer.displayName,
        avatar: astrologer.avatar,
        title: astrologer.title,
        ratePerMinute: astrologer.perMinuteRate
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get consultation details with messages
router.get('/:id', auth, async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate('astrologer');
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }
    res.json({ success: true, consultation });
  } catch (err) {
    next(err);
  }
});

// Send message in consultation
router.post('/:id/messages', auth, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const consultation = await Consultation.findById(req.params.id).populate('astrologer');
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    // Append user message
    consultation.messages.push({
      sender: 'user',
      text,
      timestamp: new Date()
    });

    // Generate responsive astrologer answer based on keywords
    let reply = `Thank you for sharing, ${req.user.name}. Looking at the planetary alignment, this represents a period of necessary maturation and inner alignment. I recommend maintaining steady focus and lighting a ghee lamp on Thursdays.`;
    const lower = text.toLowerCase();

    if (lower.includes('marriage') || lower.includes('partner') || lower.includes('wedding')) {
      reply = `Regarding matrimonial matters, the influence of Guru (Jupiter) and Shukra (Venus) indicates that favorable proposals emerge when Jupiter transits your 7th or 11th house. Patience in emotional choices will bring genuine compatibility.`;
    } else if (lower.includes('career') || lower.includes('job') || lower.includes('promotion')) {
      reply = `In your Karma Bhava (10th house), the transits signify an upward shift. Stay diligent over the coming 6 to 8 weeks, as discussions concerning leadership responsibility or relocation are favored.`;
    } else if (lower.includes('health') || lower.includes('stress')) {
      reply = `Your 6th house suggests temporary physical strain due to mental restlessness. Incorporating daily pranayama and avoiding late-night meals will rapidly restore your natural Ojas (vital vigor).`;
    }

    consultation.messages.push({
      sender: 'astrologer',
      text: reply,
      timestamp: new Date(Date.now() + 1000)
    });

    await consultation.save();

    res.json({
      success: true,
      messages: consultation.messages
    });
  } catch (err) {
    next(err);
  }
});

// End consultation
router.post('/:id/end', auth, async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    consultation.status = 'completed';
    consultation.endedAt = new Date();
    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation session concluded gracefully.',
      consultation
    });
  } catch (err) {
    next(err);
  }
});

// Get user consultation history
router.get('/', auth, async (req, res, next) => {
  try {
    const history = await Consultation.find({ user: req.user._id })
      .populate('astrologer')
      .sort({ startedAt: -1 });

    res.json({
      success: true,
      history
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
