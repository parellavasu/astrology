const express = require('express');
const router = express.Router();
const BirthProfile = require('../models/BirthProfile');
const { auth } = require('../middleware/auth');

// Get all saved birth profiles for authenticated user
router.get('/', auth, async (req, res, next) => {
  try {
    const profiles = await BirthProfile.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: profiles.length, profiles });
  } catch (err) {
    next(err);
  }
});

// Create new birth profile
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, relation, gender, dob, tob, place, latitude, longitude, timezone } = req.body;

    if (!name || !dob || !tob || !place || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'All birth profile fields are required.' });
    }

    const profile = new BirthProfile({
      user: req.user._id,
      name,
      relation: relation || 'Myself',
      gender: gender || 'male',
      dob,
      tob,
      place,
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone || 5.5)
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Birth profile saved successfully.',
      profile
    });
  } catch (err) {
    next(err);
  }
});

// Delete birth profile
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const profile = await BirthProfile.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Birth profile not found.' });
    }
    res.json({ success: true, message: 'Birth profile removed.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
