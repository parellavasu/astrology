const express = require('express');
const router = express.Router();
const { calculatePanchang } = require('../services/panchangEngine');

// Get daily panchang
router.get('/', (req, res, next) => {
  try {
    const { date, latitude, longitude, timezone, place } = req.query;

    const todayStr = date || new Date().toISOString().split('T')[0];
    const lat = latitude ? parseFloat(latitude) : 28.6139;
    const lng = longitude ? parseFloat(longitude) : 77.2090;
    const tz = timezone ? parseFloat(timezone) : 5.5;
    const placeName = place || 'New Delhi, India';

    const panchangData = calculatePanchang(todayStr, lat, lng, tz, placeName);

    res.json({
      success: true,
      data: panchangData
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
