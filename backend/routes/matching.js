const express = require('express');
const router = express.Router();
const { calculateKundli } = require('../services/astrologyEngine');
const { calculateAshtakoota } = require('../services/ashtakootaEngine');
const KundliMatch = require('../models/KundliMatch');
const { optionalAuth, auth } = require('../middleware/auth');

// Calculate Ashtakoota compatibility
router.post('/calculate', optionalAuth, async (req, res, next) => {
  try {
    const { person1, person2, saveReport } = req.body;

    if (!person1 || !person2) {
      return res.status(400).json({
        success: false,
        message: 'Birth details for both Person 1 and Person 2 are required.'
      });
    }

    // 1. Calculate individual Kundlis
    const p1Kundli = calculateKundli({
      name: person1.name,
      dob: person1.dob,
      tob: person1.tob,
      place: person1.place,
      latitude: Number(person1.latitude),
      longitude: Number(person1.longitude),
      timezone: Number(person1.timezone || 5.5),
      gender: person1.gender || 'male'
    });

    const p2Kundli = calculateKundli({
      name: person2.name,
      dob: person2.dob,
      tob: person2.tob,
      place: person2.place,
      latitude: Number(person2.latitude),
      longitude: Number(person2.longitude),
      timezone: Number(person2.timezone || 5.5),
      gender: person2.gender || 'female'
    });

    // 2. Compute 36-point Ashtakoota Milan & Manglik
    const matchResult = calculateAshtakoota(p1Kundli, p2Kundli);

    let savedMatchId = null;

    if (req.user && saveReport) {
      const matchDoc = new KundliMatch({
        user: req.user._id,
        person1: {
          name: person1.name,
          dob: person1.dob,
          tob: person1.tob,
          place: person1.place,
          nakshatra: p1Kundli.basicInfo.nakshatra,
          moonSign: p1Kundli.basicInfo.moonSign
        },
        person2: {
          name: person2.name,
          dob: person2.dob,
          tob: person2.tob,
          place: person2.place,
          nakshatra: p2Kundli.basicInfo.nakshatra,
          moonSign: p2Kundli.basicInfo.moonSign
        },
        totalScore: matchResult.totalScore,
        maxScore: matchResult.maxScore,
        percentage: matchResult.percentage,
        verdict: matchResult.verdict,
        kootas: matchResult.kootas,
        manglik: matchResult.manglik,
        summaryText: matchResult.summaryText
      });
      await matchDoc.save();
      savedMatchId = matchDoc._id;
    }

    res.json({
      success: true,
      data: {
        matchResult,
        person1: {
          name: person1.name,
          basicInfo: p1Kundli.basicInfo,
          birthDetails: p1Kundli.birthDetails
        },
        person2: {
          name: person2.name,
          basicInfo: p2Kundli.basicInfo,
          birthDetails: p2Kundli.birthDetails
        },
        savedMatchId
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get user's saved match reports
router.get('/my-matches', auth, async (req, res, next) => {
  try {
    const matches = await KundliMatch.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      matches
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
