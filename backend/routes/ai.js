const express = require('express');
const router = express.Router();
const { generateAstroAIResponse } = require('../services/aiAstrologyService');
const Kundli = require('../models/Kundli');
const { optionalAuth } = require('../middleware/auth');

// Ask AstroAI
router.post('/ask', optionalAuth, async (req, res, next) => {
  try {
    const { query, kundliId, chartContext } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a question for AstroAI.' });
    }

    let activeContext = chartContext;

    // If kundliId passed, fetch from DB
    if (!activeContext && kundliId) {
      const kundli = await Kundli.findById(kundliId);
      if (kundli) {
        activeContext = {
          basicInfo: kundli.basicInfo,
          houses: kundli.houses,
          planetaryPositions: kundli.planetaryPositions,
          dasha: kundli.dasha
        };
      }
    }

    const aiResult = generateAstroAIResponse(query, activeContext);

    res.json({
      success: true,
      data: aiResult
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
