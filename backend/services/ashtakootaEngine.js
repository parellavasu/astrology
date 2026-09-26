/**
 * JyotirVeda Ashtakoota 36-Point Vedic Compatibility Engine
 * Calculates the classical 8 Kootas (Gun Milan):
 * 1. Varna (1 pt)
 * 2. Vashya (2 pts)
 * 3. Tara (3 pts)
 * 4. Yoni (4 pts)
 * 5. Graha Maitri (5 pts)
 * 6. Gana (6 pts)
 * 7. Bhakoot (7 pts)
 * 8. Nadi (8 pts)
 * Plus Manglik Dosha detection and holistic astrological recommendations.
 */

const { calculateKundli, ZODIAC_SIGNS, NAKSHATRAS } = require('./astrologyEngine');

// 1. Varna mappings: Brahmin (4), Kshatriya (3), Vaishya (2), Shudra (1)
const VARNA_MAP = {
  Cancer: 4, Scorpio: 4, Pisces: 4,       // Brahmin (Water)
  Aries: 3, Leo: 3, Sagittarius: 3,      // Kshatriya (Fire)
  Taurus: 2, Virgo: 2, Capricorn: 2,     // Vaishya (Earth)
  Gemini: 1, Libra: 1, Aquarius: 1       // Shudra (Air)
};

// 2. Vashya mappings
const VASHYA_MAP = {
  Aries: 'Chatushpada', Taurus: 'Chatushpada',
  Gemini: 'Manava', Cancer: 'Jalachara', Leo: 'Vanachara',
  Virgo: 'Manava', Libra: 'Manava', Scorpio: 'Keeta',
  Sagittarius: 'Manava', Capricorn: 'Jalachara',
  Aquarius: 'Manava', Pisces: 'Jalachara'
};

// 4. Yoni animal assignments for 27 Nakshatras
const NAKSHATRA_YONI = [
  'Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent',
  'Dog', 'Cat', 'Sheep', 'Cat', 'Rat',
  'Rat', 'Cow', 'Buffalo', 'Tiger', 'Buffalo',
  'Tiger', 'Deer', 'Deer', 'Dog', 'Monkey',
  'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion',
  'Cow', 'Elephant'
];

const YONI_ENEMIES = {
  Horse: 'Buffalo', Buffalo: 'Horse',
  Elephant: 'Lion', Lion: 'Elephant',
  Sheep: 'Monkey', Monkey: 'Sheep',
  Serpent: 'Mongoose', Mongoose: 'Serpent',
  Dog: 'Hare', Hare: 'Dog',
  Cat: 'Rat', Rat: 'Cat',
  Cow: 'Tiger', Tiger: 'Cow',
  Deer: 'Dog'
};

// 6. Gana assignments (Deva, Manushya, Rakshasa)
const NAKSHATRA_GANA = [
  'Deva', 'Manushya', 'Rakshasa', 'Manushya', 'Deva',
  'Manushya', 'Deva', 'Deva', 'Rakshasa', 'Rakshasa',
  'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Deva',
  'Rakshasa', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya',
  'Manushya', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya',
  'Manushya', 'Deva'
];

// 8. Nadi assignments (Adi=1, Madhya=2, Antya=3)
const NAKSHATRA_NADI = [
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya',
  'Adi', 'Adi', 'Madhya', 'Antya', 'Antya',
  'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya',
  'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya',
  'Antya', 'Antya', 'Madhya', 'Adi', 'Adi',
  'Madhya', 'Antya'
];

// Planetary friendships (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)
const PLANET_RELATIONS = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], neutrals: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], neutrals: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], neutrals: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], neutrals: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], neutrals: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], neutrals: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] }
};

function getPlanetaryFriendshipScore(p1, p2) {
  if (p1 === p2) return 5;
  const rel1 = PLANET_RELATIONS[p1];
  const rel2 = PLANET_RELATIONS[p2];

  if (!rel1 || !rel2) return 3;

  const p1ToP2 = rel1.friends.includes(p2) ? 2 : rel1.neutrals.includes(p2) ? 1 : 0;
  const p2ToP1 = rel2.friends.includes(p1) ? 2 : rel2.neutrals.includes(p1) ? 1 : 0;
  const total = p1ToP2 + p2ToP1;

  if (total === 4) return 5;       // Mutual friends
  if (total === 3) return 4;       // One friend, one neutral
  if (total === 2) return 3;       // Mutual neutral or one friend, one enemy
  if (total === 1) return 1;       // One neutral, one enemy
  return 0;                        // Mutual enemies
}

/**
 * Check Manglik Dosha
 * Mars in houses 1, 2, 4, 7, 8, 12 causes Kuja Dosha
 */
function checkManglik(kundli) {
  const mars = kundli.planetaryPositions.find(p => p.name === 'Mars');
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = manglikHouses.includes(mars.house);

  return {
    isManglik,
    marsHouse: mars.house,
    description: isManglik
      ? `Mars is positioned in the ${mars.house}th house (${mars.sign}). Traditionally indicates Manglik influence requiring conscious communication and balancing.`
      : `Mars is placed favorably in the ${mars.house}th house (${mars.sign}). No Manglik Dosha detected.`
  };
}

/**
 * Calculate Ashtakoota Gun Milan
 */
function calculateAshtakoota(person1Kundli, person2Kundli) {
  const p1 = person1Kundli.basicInfo;
  const p2 = person2Kundli.basicInfo;

  const p1MoonSign = p1.moonSign;
  const p2MoonSign = p2.moonSign;

  const p1NakshatraIndex = NAKSHATRAS.findIndex(n => n.name === p1.nakshatra);
  const p2NakshatraIndex = NAKSHATRAS.findIndex(n => n.name === p2.nakshatra);

  const p1SignIndex = ZODIAC_SIGNS.findIndex(z => z.name === p1MoonSign);
  const p2SignIndex = ZODIAC_SIGNS.findIndex(z => z.name === p2MoonSign);

  // 1. Varna (Max 1 pt) - Ego & spiritual orientation
  const v1 = VARNA_MAP[p1MoonSign] || 1;
  const v2 = VARNA_MAP[p2MoonSign] || 1;
  const varnaScore = (v1 >= v2) ? 1 : 0;
  const varnaDesc = varnaScore === 1
    ? 'Excellent spiritual harmony and mutual respect between both temperaments.'
    : 'Different spiritual approaches; can be harmonized through mutual patience.';

  // 2. Vashya (Max 2 pts) - Magnetic attraction & mutual influence
  const vashya1 = VASHYA_MAP[p1MoonSign];
  const vashya2 = VASHYA_MAP[p2MoonSign];
  let vashyaScore = 0;
  if (vashya1 === vashya2) vashyaScore = 2;
  else if (
    (vashya1 === 'Manava' && vashya2 === 'Chatushpada') ||
    (vashya1 === 'Chatushpada' && vashya2 === 'Manava')
  ) vashyaScore = 1;
  else vashyaScore = 0.5;
  const vashyaDesc = vashyaScore >= 1.5
    ? 'Strong mutual attraction and natural willingness to cooperate.'
    : 'Moderate influence; active communication balances decision-making.';

  // 3. Tara (Max 3 pts) - Health, destiny and longevity
  const diff1 = ((p2NakshatraIndex - p1NakshatraIndex + 27) % 9) + 1;
  const diff2 = ((p1NakshatraIndex - p2NakshatraIndex + 27) % 9) + 1;
  const badTaras = [3, 5, 7]; // Vipat, Pratyak, Naidhana
  const p1Good = !badTaras.includes(diff1);
  const p2Good = !badTaras.includes(diff2);
  let taraScore = 0;
  if (p1Good && p2Good) taraScore = 3;
  else if (p1Good || p2Good) taraScore = 1.5;
  else taraScore = 0;
  const taraDesc = taraScore === 3
    ? 'Both birth stars share auspicious energetic alignment promoting mutual vitality.'
    : taraScore === 1.5
      ? 'Favorable destiny rhythm with mild occasional variances.'
      : 'Tara differences can be balanced with mindful wellness routines.';

  // 4. Yoni (Max 4 pts) - Biological and intimate harmony
  const yoni1 = NAKSHATRA_YONI[p1NakshatraIndex] || 'Cow';
  const yoni2 = NAKSHATRA_YONI[p2NakshatraIndex] || 'Cow';
  let yoniScore = 2;
  if (yoni1 === yoni2) yoniScore = 4;
  else if (YONI_ENEMIES[yoni1] === yoni2) yoniScore = 0;
  else yoniScore = 3;
  const yoniDesc = yoniScore >= 3
    ? `Harmonious physiological compatibility (${yoni1} and ${yoni2}).`
    : yoniScore === 2
      ? `Neutral affinity (${yoni1} and ${yoni2}) fostering friendship.`
      : `Different energetic archetypes (${yoni1} and ${yoni2}) requiring empathy.`;

  // 5. Graha Maitri (Max 5 pts) - Mental friendship between Rashi lords
  const lord1 = ZODIAC_SIGNS[p1SignIndex].lord;
  const lord2 = ZODIAC_SIGNS[p2SignIndex].lord;
  const maitriScore = getPlanetaryFriendshipScore(lord1, lord2);
  const maitriDesc = maitriScore >= 4
    ? `High intellectual compatibility. Planetary lords (${lord1} & ${lord2}) are harmonious.`
    : maitriScore >= 3
      ? `Cordial mental understanding between lords (${lord1} & ${lord2}).`
      : `Divergent viewpoints between ${lord1} and ${lord2}; celebrated by shared goals.`;

  // 6. Gana (Max 6 pts) - Temperament and behavioral affinity
  const gana1 = NAKSHATRA_GANA[p1NakshatraIndex] || 'Manushya';
  const gana2 = NAKSHATRA_GANA[p2NakshatraIndex] || 'Manushya';
  let ganaScore = 0;
  if (gana1 === gana2) ganaScore = 6;
  else if ((gana1 === 'Deva' && gana2 === 'Manushya') || (gana1 === 'Manushya' && gana2 === 'Deva')) ganaScore = 5;
  else if (gana1 === 'Deva' && gana2 === 'Rakshasa') ganaScore = 1;
  else ganaScore = 0;
  const ganaDesc = ganaScore >= 5
    ? `Identical or complementary life temperaments (${gana1} and ${gana2}).`
    : ganaScore >= 1
      ? `Mild differences in natural temperament; easily bridged with emotional presence.`
      : `Contrasting approaches to daily life (${gana1} & ${gana2}); grounded in mutual respect.`;

  // 7. Bhakoot (Max 7 pts) - Emotional longevity and family prosperity
  const rashiDist = ((p2SignIndex - p1SignIndex + 12) % 12) + 1;
  const badBhakootDistances = [2, 6, 8, 12]; // 2-12, 6-8
  let bhakootScore = 7;
  if (badBhakootDistances.includes(rashiDist) || badBhakootDistances.includes(14 - rashiDist)) {
    // If same lord or friendly lords, dosha is mitigated
    if (lord1 === lord2 || maitriScore >= 4) {
      bhakootScore = 7;
    } else {
      bhakootScore = 0;
    }
  }
  const bhakootDesc = bhakootScore === 7
    ? 'Constructive emotional resonance and shared prosperity.'
    : 'Bhakoot variance suggests conscious financial alignment and transparent communication.';

  // 8. Nadi (Max 8 pts) - Genetic & Pranic health
  const nadi1 = NAKSHATRA_NADI[p1NakshatraIndex] || 'Adi';
  const nadi2 = NAKSHATRA_NADI[p2NakshatraIndex] || 'Antya';
  let nadiScore = 8;
  if (nadi1 === nadi2) {
    // Same Nadi exception if different Nakshatra or different Charan
    if (p1.nakshatra !== p2.nakshatra) {
      nadiScore = 8; // Mitigated
    } else {
      nadiScore = 0;
    }
  }
  const nadiDesc = nadiScore === 8
    ? `Balanced biological constitution (${nadi1} & ${nadi2}) indicating vibrant vitality.`
    : `Both charts possess ${nadi1} Nadi. Traditional wisdom recommends mindful health care.`;

  const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

  // Manglik analysis
  const manglikP1 = checkManglik(person1Kundli);
  const manglikP2 = checkManglik(person2Kundli);
  const manglikMatch = (manglikP1.isManglik === manglikP2.isManglik)
    ? 'Manglik statuses balance each other harmoniously.'
    : (manglikP1.isManglik || manglikP2.isManglik)
      ? 'One partner exhibits Manglik influence. Traditional Vedic astrology suggests simple remedies for equilibrium.'
      : 'Neither partner is Manglik. No dosha mitigation required.';

  // Verdict category
  let verdict = '';
  let verdictColor = '';
  if (totalScore >= 28) {
    verdict = 'Uttama (Excellent Compatibility)';
    verdictColor = 'emerald';
  } else if (totalScore >= 18) {
    verdict = 'Madhyama (Good / Favorable Compatibility)';
    verdictColor = 'amber';
  } else {
    verdict = 'Adhama (Challenging / Needs Remedies)';
    verdictColor = 'rose';
  }

  const kootas = [
    { name: 'Varna', maxPoints: 1, obtainedPoints: varnaScore, category: 'Ego & Spiritual Harmony', description: varnaDesc },
    { name: 'Vashya', maxPoints: 2, obtainedPoints: vashyaScore, category: 'Mutual Attraction & Influence', description: vashyaDesc },
    { name: 'Tara', maxPoints: 3, obtainedPoints: taraScore, category: 'Health & Destiny Rhythm', description: taraDesc },
    { name: 'Yoni', maxPoints: 4, obtainedPoints: yoniScore, category: 'Intimacy & Biological Affinity', description: yoniDesc },
    { name: 'Graha Maitri', maxPoints: 5, obtainedPoints: maitriScore, category: 'Mental Friendship & Values', description: maitriDesc },
    { name: 'Gana', maxPoints: 6, obtainedPoints: ganaScore, category: 'Temperament & Behavior', description: ganaDesc },
    { name: 'Bhakoot', maxPoints: 7, obtainedPoints: bhakootScore, category: 'Emotional Bond & Prosperity', description: bhakootDesc },
    { name: 'Nadi', maxPoints: 8, obtainedPoints: nadiScore, category: 'Pranic Energy & Offspring', description: nadiDesc }
  ];

  return {
    totalScore,
    maxScore: 36,
    percentage: Math.round((totalScore / 36) * 100),
    verdict,
    verdictColor,
    kootas,
    manglik: {
      person1: manglikP1,
      person2: manglikP2,
      summary: manglikMatch
    },
    summaryText: `Based on traditional Ashtakoota Gun Milan, this alliance receives ${totalScore} out of 36 Gunas (${Math.round((totalScore / 36) * 100)}%). In classical Vedic Jyotish, a score above 18 points is considered auspicious and supportive of long-term companionship when grounded in mutual love, open communication, and shared values.`
  };
}

module.exports = {
  calculateAshtakoota,
  checkManglik
};
