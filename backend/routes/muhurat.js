const express = require('express');
const router = express.Router();
const { getMuhuratByCategory } = require('../services/panchangEngine');

// Get auspicious muhurat by category
router.get('/:category', (req, res, next) => {
  try {
    const { category } = req.params;
    const { month, year, place } = req.query;

    const data = getMuhuratByCategory(category, month, year, place);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
});

// Get all categories summary
router.get('/', (req, res, next) => {
  try {
    const categories = [
      { id: 'marriage', title: 'Marriage Muhurat (Vivah)', count: '5 Auspicious Dates', icon: 'HeartHandshake' },
      { id: 'griha_pravesh', title: 'Griha Pravesh (House Warming)', count: '3 Auspicious Dates', icon: 'Home' },
      { id: 'vehicle_purchase', title: 'Vehicle Purchase', count: '3 Auspicious Dates', icon: 'Car' },
      { id: 'property_purchase', title: 'Property Purchase & Registry', count: '2 Auspicious Dates', icon: 'Building2' },
      { id: 'business_opening', title: 'Business Opening (Vyapar Arambh)', count: '3 Auspicious Dates', icon: 'Briefcase' },
      { id: 'naming_ceremony', title: 'Naming Ceremony (Namakaran)', count: '2 Auspicious Dates', icon: 'Baby' },
      { id: 'religious_ceremonies', title: 'Religious Pujas & Havan', count: '2 Major Dates', icon: 'Flame' }
    ];

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
