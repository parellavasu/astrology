const express = require('express');
const router = express.Router();
const { calculateKundli } = require('../services/astrologyEngine');
const Kundli = require('../models/Kundli');
const { optionalAuth, auth } = require('../middleware/auth');

// Calculate Kundli (immediate calculation for guest or authenticated user)
router.post('/calculate', optionalAuth, async (req, res, next) => {
  try {
    const { name, dob, tob, place, latitude, longitude, timezone = 5.5, gender = 'male', saveToProfile } = req.body;

    if (!name || !dob || !tob || !place || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, date of birth, time of birth, and birth place coordinates.'
      });
    }

    const calculatedData = calculateKundli({
      name,
      dob,
      tob,
      place,
      latitude,
      longitude,
      timezone: Number(timezone),
      gender
    });

    let savedKundliId = null;

    // If user is authenticated and wishes to save, save to MongoDB
    if (req.user && saveToProfile) {
      const kundliDoc = new Kundli({
        user: req.user._id,
        name,
        gender,
        dob,
        tob,
        place,
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone: Number(timezone),
        basicInfo: calculatedData.basicInfo,
        planetaryPositions: calculatedData.planetaryPositions,
        houses: calculatedData.houses,
        dasha: calculatedData.dasha,
        charts: calculatedData.charts,
        analysis: calculatedData.analysis
      });
      await kundliDoc.save();
      savedKundliId = kundliDoc._id;
    }

    res.json({
      success: true,
      data: calculatedData,
      savedKundliId
    });
  } catch (err) {
    next(err);
  }
});

// Save Kundli explicitly
router.post('/save', auth, async (req, res, next) => {
  try {
    const { kundliData, birthProfileId } = req.body;
    if (!kundliData) {
      return res.status(400).json({ success: false, message: 'Kundli data is required to save.' });
    }

    const { birthDetails, basicInfo, planetaryPositions, houses, dasha, charts, analysis } = kundliData;

    const kundli = new Kundli({
      user: req.user._id,
      birthProfile: birthProfileId || null,
      name: birthDetails.name,
      gender: birthDetails.gender,
      dob: birthDetails.dob,
      tob: birthDetails.tob,
      place: birthDetails.place,
      latitude: birthDetails.latitude,
      longitude: birthDetails.longitude,
      timezone: birthDetails.timezone,
      basicInfo,
      planetaryPositions,
      houses,
      dasha,
      charts,
      analysis
    });

    await kundli.save();

    res.status(201).json({
      success: true,
      message: 'Kundli saved to your profile successfully.',
      kundliId: kundli._id
    });
  } catch (err) {
    next(err);
  }
});

// Get user's saved Kundlis
router.get('/my-kundlis', auth, async (req, res, next) => {
  try {
    const kundlis = await Kundli.find({ user: req.user._id })
      .select('name gender dob tob place basicInfo createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      kundlis
    });
  } catch (err) {
    next(err);
  }
});

// Get single saved Kundli by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const kundli = await Kundli.findById(req.params.id);
    if (!kundli) {
      return res.status(404).json({ success: false, message: 'Kundli not found.' });
    }

    res.json({
      success: true,
      data: {
        birthDetails: {
          name: kundli.name,
          gender: kundli.gender,
          dob: kundli.dob,
          tob: kundli.tob,
          place: kundli.place,
          latitude: kundli.latitude,
          longitude: kundli.longitude,
          timezone: kundli.timezone
        },
        basicInfo: kundli.basicInfo,
        planetaryPositions: kundli.planetaryPositions,
        houses: kundli.houses,
        dasha: kundli.dasha,
        charts: kundli.charts,
        analysis: kundli.analysis,
        createdAt: kundli.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete saved Kundli
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const kundli = await Kundli.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!kundli) {
      return res.status(404).json({ success: false, message: 'Kundli not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Kundli removed successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
