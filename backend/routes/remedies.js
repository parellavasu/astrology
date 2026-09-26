const express = require('express');
const router = express.Router();

const REMEDIES_DATABASE = [
  {
    id: 'mantra-surya',
    category: 'Mantra',
    title: 'Surya Gayatri Mantra',
    sanskrit: 'ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात्॥',
    transliteration: 'Om Adityaya Vidmahe Martandaya Dhimahi Tannah Suryah Prachodayat',
    rulingPlanet: 'Sun (Surya)',
    purpose: 'Awakening clarity of soul purpose, vitality, and inner confidence.',
    bestTime: 'Sunday morning at sunrise during Brahma Muhurat.',
    instructions: 'Chant 108 times facing East with pure water arghya offered toward the rising sun.',
    disclaimer: 'Mantras serve as contemplative sound resonance for internal steadiness and devotion.'
  },
  {
    id: 'mantra-chandra',
    category: 'Mantra',
    title: 'Chandra Bija Mantra',
    sanskrit: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः॥',
    transliteration: 'Om Shram Shreem Shrom Sah Chandramase Namah',
    rulingPlanet: 'Moon (Chandra)',
    purpose: 'Calming emotional turbulence, enhancing memory, and restful sleep.',
    bestTime: 'Monday evening or on Full Moon (Purnima).',
    instructions: 'Chant with a crystal (Sphatika) mala, focusing your breath in the heart center.',
    disclaimer: 'Traditional tool for emotional balancing and peaceful reflection.'
  },
  {
    id: 'gemstone-yellow-sapphire',
    category: 'Gemstone Information',
    title: 'Yellow Sapphire (Pukhraj)',
    rulingPlanet: 'Jupiter (Brihaspati)',
    element: 'Ether / Akasha',
    recommendedSigns: ['Sagittarius', 'Pisces', 'Aries', 'Leo', 'Cancer'],
    metal: 'Gold or Brass',
    finger: 'Index finger of the right hand',
    purpose: 'Traditionally linked with wisdom, ethical discernment, philosophical clarity, and progeny.',
    cautions: 'Consult a qualified astrologer before wearing. Must be unheated, untreated, and eye-clean.',
    disclaimer: 'Gemstones are subtle vibrational conductors in Vedic mineralogy; they complement honest effort.'
  },
  {
    id: 'gemstone-blue-sapphire',
    category: 'Gemstone Information',
    title: 'Blue Sapphire (Neelam)',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Air / Vayu',
    recommendedSigns: ['Capricorn', 'Aquarius', 'Taurus', 'Libra'],
    metal: 'Silver or White Gold',
    finger: 'Middle finger of the right hand',
    purpose: 'Promotes disciplined perseverance, structural focus, and karmic rectification.',
    cautions: 'Requires a mandatory 3-day trial period under your pillow to check energetic resonance.',
    disclaimer: 'Vedic Jyotish counsels deep reverence and caution when exploring Saturnian gems.'
  },
  {
    id: 'rudraksha-five-mukhi',
    category: 'Rudraksha Information',
    title: '5 Mukhi Rudraksha (Pancha Mukhi)',
    deity: 'Lord Shiva (Kalagni Rudra)',
    rulingPlanet: 'Jupiter (Brihaspati)',
    purpose: 'Harmonizes the thyroid and blood circulation; promotes mental peace, intellect, and spiritual focus.',
    wearingDay: 'Thursday morning after bathing and chanting Om Hreem Namah.',
    disclaimer: 'Natural sacred beads of Elaeocarpus ganitrus revered across Indian spiritual lineages.'
  },
  {
    id: 'rudraksha-seven-mukhi',
    category: 'Rudraksha Information',
    title: '7 Mukhi Rudraksha (Sapta Mukhi)',
    deity: 'Goddess Mahalakshmi',
    rulingPlanet: 'Venus (Shukra)',
    purpose: 'Invokes prosperity, removes financial inertia, and refines creative intuition.',
    wearingDay: 'Friday morning with Om Hoom Namah chanting.',
    disclaimer: 'Traditional emblem of auspicious abundance and artistic expression.'
  },
  {
    id: 'charity-dana',
    category: 'Charity',
    title: 'Nishkama Karma Dana (Sacred Charity)',
    rulingPlanet: 'Saturn and Rahu mitigation',
    purpose: 'The highest Vedic remedy is self-effacing service (Seva) and sharing resources with those in need.',
    recommendation: 'Feeding stray animals, donating warm blankets to elderly destitute individuals on Saturdays, and supporting children’s education.',
    disclaimer: 'Vedic philosophy places charity above material rituals for dissolving karmic burdens.'
  },
  {
    id: 'meditation-trataka',
    category: 'Meditation',
    title: 'Chandra Dhyana & Trataka',
    purpose: 'Stabilizes the nervous system, cultivates serene concentration, and balances lunar prana.',
    practice: 'Sit comfortably with a straight spine. Gaze gently at the full moon or a ghee lamp flame for 3–5 minutes, followed by eyes closed visualization at the Ajna chakra.',
    disclaimer: 'Mindfulness practice beneficial for inner peace regardless of horoscope.'
  }
];

// Get remedies with category filter
router.get('/', (req, res) => {
  const { category } = req.query;
  let results = REMEDIES_DATABASE;
  if (category && category !== 'All') {
    results = results.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
  }
  res.json({
    success: true,
    count: results.length,
    remedies: results
  });
});

module.exports = router;
