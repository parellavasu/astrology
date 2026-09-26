const express = require('express');
const router = express.Router();
const { searchCities } = require('../services/geoService');

router.get('/search', (req, res) => {
  const { q } = req.query;
  const results = searchCities(q);
  res.json({ success: true, count: results.length, cities: results });
});

module.exports = router;
