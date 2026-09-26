const express = require('express');
const router = express.Router();
const Horoscope = require('../models/Horoscope');
const { ZODIAC_SIGNS } = require('../services/astrologyEngine');

// Helper to generate dynamic Vedic horoscope if not pre-seeded
function generateDynamicHoroscope(sign, period = 'daily', dayOffset = 'today') {
  const signObj = ZODIAC_SIGNS.find(z => z.name.toLowerCase() === sign.toLowerCase()) || ZODIAC_SIGNS[0];
  const lord = signObj.lord;
  const element = signObj.element;

  const themes = {
    Aries: {
      today: {
        overview: 'Mars infuses your day with decisive dynamic energy. Prudence in discussions brings notable progress.',
        love: 'Express your sentiments with warmth rather than impatience. Your companion values your direct honesty.',
        career: 'A strategic project receives positive momentum. Your proactive initiative sets a high standard.',
        finance: 'Auspicious time for reviewing investments. Avoid impulsive acquisitions.',
        family: 'Domestic tranquility is restored through shared laughter and mindful active listening.',
        health: 'High vitality; channel surplus physical energy into brisk morning exercises or yoga.',
        luckyNumber: 9,
        luckyColor: 'Coral Red',
        auspiciousTime: '08:30 AM - 10:15 AM'
      },
      weekly: {
        overview: 'The weekly transit highlights career advancement and fruitful networking opportunities.',
        love: 'Mid-week brings a gentle romantic harmony. Deepen emotional presence.',
        career: 'Collaborative ventures yield tangible breakthroughs. Leaders acknowledge your competence.',
        finance: 'Consistent cash inflows stabilize your balance sheet.',
        family: 'Family elders offer encouraging blessings and practical advice.',
        health: 'Prioritize balanced sleep cycles and proper hydration.',
        luckyNumber: 3,
        luckyColor: 'Saffron Gold',
        auspiciousTime: 'Morning Hora'
      }
    },
    Taurus: {
      today: {
        overview: 'Venus bestows aesthetic discernment and calm fortitude. Steadfast focus resolves prior uncertainties.',
        love: 'Intimacy deepens through shared culinary pleasures and peaceful surroundings.',
        career: 'Meticulous attention to detail prevents costly oversights. Colleagues rely on your measured guidance.',
        finance: 'Solid wealth indicators; long-term savings plans demonstrate healthy resilience.',
        family: 'A heartwarming domestic celebration or gathering brings comforting contentment.',
        health: 'Protect your throat and neck; herbal teas with tulsi provide soothing balance.',
        luckyNumber: 6,
        luckyColor: 'Silken Ivory',
        auspiciousTime: '10:00 AM - 11:45 AM'
      }
    }
  };

  const base = themes[signObj.name] || themes.Aries;
  const data = (period === 'weekly' && base.weekly) ? base.weekly : (base.today || base.weekly);

  return {
    sign: signObj.name,
    sanskritSign: signObj.sanskrit,
    element,
    lord,
    period,
    dayOffset,
    overview: data.overview || `${lord} harmonizes with your 1st house today, bringing intellectual clarity and purposeful productivity across all your ongoing endeavors.`,
    love: data.love || `Venus and Moon create gentle emotional resonance. Compassionate dialog bridges any lingering differences with your partner.`,
    career: data.career || `Professional momentum accelerates. Your systematic approach to complex problems wins commendation from peers and management.`,
    finance: data.finance || `Planetary positions favor conservative growth. Steady financial governance shields you from unforeseen fluctuations.`,
    family: data.family || `Harmony prevails at home. Reconnecting with elder relatives yields auspicious blessings and ancestral guidance.`,
    health: data.health || `Good physical stamina. Practice pranayama to maintain emotional equilibrium and mental focus throughout the day.`,
    luckyNumber: data.luckyNumber || ((signObj.id * 3) % 9) + 1,
    luckyColor: data.luckyColor || (element === 'Fire' ? 'Amber Gold' : element === 'Earth' ? 'Emerald Green' : element === 'Air' ? 'Celestial Blue' : 'Pearl White'),
    auspiciousTime: data.auspiciousTime || '09:15 AM - 11:00 AM',
    ratingStars: {
      love: 4,
      career: 5,
      finance: 4
    }
  };
}

// Get horoscope for specific sign
router.get('/:sign', async (req, res, next) => {
  try {
    const { sign } = req.params;
    const { period = 'daily', dayOffset = 'today', date } = req.query;

    const todayStr = date || new Date().toISOString().split('T')[0];

    // Try finding in DB
    let horoscope = await Horoscope.findOne({
      sign: new RegExp(`^${sign}$`, 'i'),
      period,
      dayOffset
    });

    if (!horoscope) {
      horoscope = generateDynamicHoroscope(sign, period, dayOffset);
    }

    res.json({
      success: true,
      data: horoscope
    });
  } catch (err) {
    next(err);
  }
});

// Get daily overview for all 12 signs
router.get('/', async (req, res, next) => {
  try {
    const { period = 'daily', dayOffset = 'today' } = req.query;

    const allSigns = ZODIAC_SIGNS.map(z => generateDynamicHoroscope(z.name, period, dayOffset));

    res.json({
      success: true,
      signs: allSigns
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
