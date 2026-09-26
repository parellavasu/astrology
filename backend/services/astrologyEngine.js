/**
 * JyotirVeda Astronomical Vedic Astrology Engine
 * Implements Sidereal (Nirayana) Zodiac with Lahiri Ayanamsha (Chitra Paksha),
 * Jean Meeus astronomical algorithms for planetary longitudes,
 * Ascendant (Lagna) calculation via Local Sidereal Time,
 * Nakshatra & Pada mappings, D1 (Rashi) & D9 (Navamsha) charts,
 * Bhavas (12 Houses), and Vimshottari Dasha calculations.
 */

const ZODIAC_SIGNS = [
  { id: 1, name: 'Aries', sanskrit: 'Mesha', element: 'Fire', lord: 'Mars', symbol: '♈' },
  { id: 2, name: 'Taurus', sanskrit: 'Vrishabha', element: 'Earth', lord: 'Venus', symbol: '♉' },
  { id: 3, name: 'Gemini', sanskrit: 'Mithuna', element: 'Air', lord: 'Mercury', symbol: '♊' },
  { id: 4, name: 'Cancer', sanskrit: 'Karka', element: 'Water', lord: 'Moon', symbol: '♋' },
  { id: 5, name: 'Leo', sanskrit: 'Simha', element: 'Fire', lord: 'Sun', symbol: '♌' },
  { id: 6, name: 'Virgo', sanskrit: 'Kanya', element: 'Earth', lord: 'Mercury', symbol: '♍' },
  { id: 7, name: 'Libra', sanskrit: 'Tula', element: 'Air', lord: 'Venus', symbol: '♎' },
  { id: 8, name: 'Scorpio', sanskrit: 'Vrishchika', element: 'Water', lord: 'Mars', symbol: '♏' },
  { id: 9, name: 'Sagittarius', sanskrit: 'Dhanu', element: 'Fire', lord: 'Jupiter', symbol: '♐' },
  { id: 10, name: 'Capricorn', sanskrit: 'Makara', element: 'Earth', lord: 'Saturn', symbol: '♑' },
  { id: 11, name: 'Aquarius', sanskrit: 'Kumbha', element: 'Air', lord: 'Saturn', symbol: '♒' },
  { id: 12, name: 'Pisces', sanskrit: 'Meena', element: 'Water', lord: 'Jupiter', symbol: '♓' }
];

const NAKSHATRAS = [
  { id: 1, name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse Head' },
  { id: 2, name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: 'Yoni' },
  { id: 3, name: 'Krittika', lord: 'Sun', deity: 'Agni', symbol: 'Razor/Flame' },
  { id: 4, name: 'Rohini', lord: 'Moon', deity: 'Brahma', symbol: 'Cart/Chariot' },
  { id: 5, name: 'Mrigashira', lord: 'Mars', deity: 'Soma', symbol: 'Deer Head' },
  { id: 6, name: 'Ardra', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop' },
  { id: 7, name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', symbol: 'Bow & Quiver' },
  { id: 8, name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', symbol: 'Flower/Cow Udder' },
  { id: 9, name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', symbol: 'Coiled Serpent' },
  { id: 10, name: 'Magha', lord: 'Ketu', deity: 'Pitris', symbol: 'Royal Throne' },
  { id: 11, name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', symbol: 'Hammock/Couch' },
  { id: 12, name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', symbol: 'Four Legs of Bed' },
  { id: 13, name: 'Hasta', lord: 'Moon', deity: 'Savitr', symbol: 'Open Hand' },
  { id: 14, name: 'Chitra', lord: 'Mars', deity: 'Tvashtar', symbol: 'Bright Jewel' },
  { id: 15, name: 'Swati', lord: 'Rahu', deity: 'Vayu', symbol: 'Coral/Young Shoot' },
  { id: 16, name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', symbol: 'Triumphal Arch' },
  { id: 17, name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', symbol: 'Lotus Flower' },
  { id: 18, name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', symbol: 'Earring/Amulet' },
  { id: 19, name: 'Mula', lord: 'Ketu', deity: 'Nirriti', symbol: 'Tied Roots' },
  { id: 20, name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', symbol: 'Winnowing Basket' },
  { id: 21, name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', symbol: 'Elephant Tusk' },
  { id: 22, name: 'Shravana', lord: 'Moon', deity: 'Vishnu', symbol: 'Three Footprints' },
  { id: 23, name: 'Dhanishta', lord: 'Mars', deity: 'Ashta Vasus', symbol: 'Drum/Flute' },
  { id: 24, name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', symbol: 'Empty Circle/100 Flowers' },
  { id: 25, name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Two Front Legs of Funeral Bed' },
  { id: 26, name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Two Back Legs of Funeral Bed' },
  { id: 27, name: 'Revati', lord: 'Mercury', deity: 'Pushan', symbol: 'Fish/Pair of Fish' }
];

const DASHA_LORDS = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 }
];

function degToRad(deg) {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad) {
  return (rad * 180.0) / Math.PI;
}

function normalize360(deg) {
  let res = deg % 360;
  if (res < 0) res += 360;
  return res;
}

/**
 * Calculates Julian Day Number for given UTC Date & Time
 */
function getJulianDay(year, month, day, decimalHours) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + (decimalHours / 24.0) + b - 1524.5;
  return jd;
}

/**
 * Calculates Lahiri Ayanamsha (Chitra Paksha) for a given Julian Day
 * Reference: J2000.0 (JD 2451545.0) = 23° 51' 25.53" = 23.857092°
 * Precession rate: 50.29 arcseconds per Julian year = 0.0139694 deg/yr
 */
function getLahiriAyanamsha(jd) {
  const t = (jd - 2451545.0) / 36525.0; // centuries since J2000
  // Lahiri Ayanamsha polynomial approximation
  const ayanamsha = 23.857092 + (1.396971 * t) + (0.000308 * t * t);
  return ayanamsha;
}

/**
 * Calculates Greenwich Mean Sidereal Time (GMST) in degrees
 */
function getGMST(jd, decimalHours) {
  const d0 = Math.floor(jd - 0.5) + 0.5;
  const T0 = (d0 - 2451545.0) / 36525.0;
  let gmst0 = 100.46061837 + (36000.770053608 * T0) + (0.000387933 * T0 * T0) - ((T0 * T0 * T0) / 38710000);
  gmst0 = normalize360(gmst0);
  const gmst = normalize360(gmst0 + (360.98564724 * decimalHours) / 24.0);
  return gmst;
}

/**
 * Calculates Ascendant (Lagna) in degrees
 */
function calculateAscendant(jd, decimalHours, lat, lng, ayanamsha) {
  const gmst = getGMST(jd, decimalHours);
  const lst = normalize360(gmst + lng); // Local Sidereal Time (RAMC in degrees)
  const ramcRad = degToRad(lst);
  const latRad = degToRad(lat);
  const obliquityRad = degToRad(23.4392911); // Mean obliquity of ecliptic

  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(obliquityRad) + Math.tan(latRad) * Math.sin(obliquityRad);
  let ascendantTrop = radToDeg(Math.atan2(y, x));
  ascendantTrop = normalize360(ascendantTrop);

  // Convert to Sidereal via Lahiri Ayanamsha
  const ascendantSidereal = normalize360(ascendantTrop - ayanamsha);
  return ascendantSidereal;
}

/**
 * Astronomical ephemeris approximations for solar system bodies (Sidereal)
 */
function calculatePlanets(jd, ayanamsha) {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0
  const d = jd - 2451545.0;            // Julian days

  // 1. Sun
  const L0_sun = normalize360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M_sun = normalize360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C_sun = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M_sun))
              + (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M_sun))
              + 0.000289 * Math.sin(degToRad(3 * M_sun));
  const sunTrop = normalize360(L0_sun + C_sun);
  const sunSidereal = normalize360(sunTrop - ayanamsha);

  // 2. Moon
  const L0_moon = normalize360(218.3164477 + 481267.8812733 * T);
  const M_moon = normalize360(134.9633964 + 477198.8675055 * T);
  const D_moon = normalize360(297.8501921 + 445267.1114034 * T);
  const F_moon = normalize360(93.2720950 + 483202.0175233 * T);
  const moonPerturbations = 6.288774 * Math.sin(degToRad(M_moon))
                          + 1.274027 * Math.sin(degToRad(2 * D_moon - M_moon))
                          + 0.658314 * Math.sin(degToRad(2 * D_moon))
                          + 0.213618 * Math.sin(degToRad(2 * M_moon))
                          - 0.185116 * Math.sin(degToRad(M_sun))
                          - 0.114332 * Math.sin(degToRad(2 * F_moon));
  const moonTrop = normalize360(L0_moon + moonPerturbations);
  const moonSidereal = normalize360(moonTrop - ayanamsha);

  // 3. Rahu (Mean Lunar Node) - retrogrades
  const rahuTrop = normalize360(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const rahuSidereal = normalize360(rahuTrop - ayanamsha);

  // 4. Ketu (Opposite Rahu by 180 degrees)
  const ketuSidereal = normalize360(rahuSidereal + 180.0);

  // 5. Mars
  const M_mars = normalize360(19.37298 + 19140.30268 * T);
  const L0_mars = normalize360(355.433275 + 19140.299314 * T);
  const marsEquation = 10.691 * Math.sin(degToRad(M_mars)) + 0.623 * Math.sin(degToRad(2 * M_mars));
  const marsTrop = normalize360(L0_mars + marsEquation);
  const marsSidereal = normalize360(marsTrop - ayanamsha);

  // 6. Mercury
  const M_merc = normalize360(174.79472 + 149472.51529 * T);
  const L0_merc = normalize360(252.250906 + 149472.674111 * T);
  const mercEquation = 23.44 * Math.sin(degToRad(M_merc)) + 2.98 * Math.sin(degToRad(2 * M_merc));
  const mercTrop = normalize360(L0_merc + mercEquation);
  const mercSidereal = normalize360(mercTrop - ayanamsha);

  // 7. Jupiter
  const M_jup = normalize360(19.8950 + 3034.9057 * T);
  const L0_jup = normalize360(34.40438 + 3034.9067 * T);
  const jupEquation = 5.555 * Math.sin(degToRad(M_jup)) + 0.166 * Math.sin(degToRad(2 * M_jup));
  const jupTrop = normalize360(L0_jup + jupEquation);
  const jupSidereal = normalize360(jupTrop - ayanamsha);

  // 8. Venus
  const M_ven = normalize360(50.115 + 58517.8039 * T);
  const L0_ven = normalize360(181.979099 + 58517.815387 * T);
  const venEquation = 0.776 * Math.sin(degToRad(M_ven));
  const venTrop = normalize360(L0_ven + venEquation);
  const venSidereal = normalize360(venTrop - ayanamsha);

  // 9. Saturn
  const M_sat = normalize360(316.967 + 1222.1138 * T);
  const L0_sat = normalize360(49.94432 + 1222.11379 * T);
  const satEquation = 6.358 * Math.sin(degToRad(M_sat)) + 0.220 * Math.sin(degToRad(2 * M_sat));
  const satTrop = normalize360(L0_sat + satEquation);
  const satSidereal = normalize360(satTrop - ayanamsha);

  // Estimate retrograde status based on relative position to Sun
  const isRetrograde = (planetLong, sunLong, isOuter) => {
    if (!isOuter) return false;
    let diff = normalize360(planetLong - sunLong);
    return diff > 120 && diff < 240;
  };

  return [
    { name: 'Sun', sanskrit: 'Surya', long: sunSidereal, isRetrograde: false, speed: 0.985 },
    { name: 'Moon', sanskrit: 'Chandra', long: moonSidereal, isRetrograde: false, speed: 13.176 },
    { name: 'Mars', sanskrit: 'Mangal', long: marsSidereal, isRetrograde: isRetrograde(marsSidereal, sunSidereal, true), speed: 0.524 },
    { name: 'Mercury', sanskrit: 'Budha', long: mercSidereal, isRetrograde: Math.abs(normalize360(mercSidereal - sunSidereal) - 18) < 10, speed: 1.38 },
    { name: 'Jupiter', sanskrit: 'Guru', long: jupSidereal, isRetrograde: isRetrograde(jupSidereal, sunSidereal, true), speed: 0.083 },
    { name: 'Venus', sanskrit: 'Shukra', long: venSidereal, isRetrograde: Math.abs(normalize360(venSidereal - sunSidereal) - 40) < 6, speed: 1.2 },
    { name: 'Saturn', sanskrit: 'Shani', long: satSidereal, isRetrograde: isRetrograde(satSidereal, sunSidereal, true), speed: 0.033 },
    { name: 'Rahu', sanskrit: 'Rahu', long: rahuSidereal, isRetrograde: true, speed: -0.052 },
    { name: 'Ketu', sanskrit: 'Ketu', long: ketuSidereal, isRetrograde: true, speed: -0.052 }
  ];
}

/**
 * Format decimal degrees into { sign, signIndex, deg, min, sec, formatted }
 */
function formatDegree(totalDegrees) {
  const norm = normalize360(totalDegrees);
  const signIndex = Math.floor(norm / 30); // 0 to 11
  const sign = ZODIAC_SIGNS[signIndex];
  const remDeg = norm - signIndex * 30;
  const deg = Math.floor(remDeg);
  const remMin = (remDeg - deg) * 60;
  const min = Math.floor(remMin);
  const sec = Math.round((remMin - min) * 60);

  const formatted = `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toString().padStart(2, '0')}"`;
  return {
    sign: sign.name,
    sanskritSign: sign.sanskrit,
    signNumber: signIndex + 1,
    degreeInSign: remDeg,
    deg,
    min,
    sec,
    formatted,
    totalDegrees: norm
  };
}

/**
 * Calculate Nakshatra and Pada from longitude
 */
function getNakshatraInfo(longitude) {
  const norm = normalize360(longitude);
  const nakshatraIndex = Math.floor(norm / (360 / 27)); // 0 to 26
  const remDegrees = norm - nakshatraIndex * (360 / 27);
  const pada = Math.floor(remDegrees / (360 / 108)) + 1; // 1 to 4
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const fractionTraversed = remDegrees / (360 / 27);

  return {
    id: nakshatra.id,
    name: nakshatra.name,
    lord: nakshatra.lord,
    deity: nakshatra.deity,
    symbol: nakshatra.symbol,
    pada,
    fractionTraversed
  };
}

/**
 * Calculate Navamsha (D9) sign from sidereal longitude
 * Each sign (30 deg) is divided into 9 navamshas of 3 deg 20 min (3.3333 deg)
 */
function getNavamshaSign(totalDegrees) {
  const norm = normalize360(totalDegrees);
  const signIndex = Math.floor(norm / 30);
  const degInSign = norm % 30;
  const navIndex = Math.floor(degInSign / (30 / 9)); // 0 to 8

  // Navamsha starting signs:
  // Fire signs (Aries, Leo, Sag) start from Aries (0)
  // Earth signs (Taurus, Virgo, Cap) start from Capricorn (9)
  // Air signs (Gemini, Libra, Aqu) start from Libra (6)
  // Water signs (Cancer, Scorpio, Pis) start from Cancer (3)
  const elementStarts = [0, 9, 6, 3]; // 0=Aries, 9=Cap, 6=Libra, 3=Cancer
  const elementGroup = signIndex % 4;
  const startSign = elementStarts[elementGroup];
  const navSignIndex = (startSign + navIndex) % 12;

  return ZODIAC_SIGNS[navSignIndex];
}

/**
 * Determine House Number (1 to 12) from planet's sign relative to Ascendant's sign
 * Traditional Vedic Rashi-Bhava equal sign system
 */
function getHouseNumber(planetSignNumber, ascSignNumber) {
  let house = (planetSignNumber - ascSignNumber + 1);
  if (house <= 0) house += 12;
  return house;
}

/**
 * Calculate Vimshottari Dasha
 */
function calculateVimshottariDasha(moonNakshatra, dob) {
  const nakshatraLord = moonNakshatra.lord;
  const dashaIndex = DASHA_LORDS.findIndex(d => d.planet === nakshatraLord);
  const currentLord = DASHA_LORDS[dashaIndex];

  // Fraction traversed gives balance of first Dasha
  const remainingFraction = 1.0 - moonNakshatra.fractionTraversed;
  const firstDashaYearsRemaining = currentLord.years * remainingFraction;

  const birthDate = new Date(dob);
  const timeline = [];

  let currentDate = new Date(birthDate);
  const firstEndDate = new Date(currentDate.getTime() + firstDashaYearsRemaining * 365.25 * 24 * 3600 * 1000);
  timeline.push({
    planet: currentLord.planet,
    years: currentLord.years,
    startDate: birthDate.toISOString().split('T')[0],
    endDate: firstEndDate.toISOString().split('T')[0]
  });

  currentDate = firstEndDate;

  for (let i = 1; i < 9; i++) {
    const nextIdx = (dashaIndex + i) % 9;
    const nextLord = DASHA_LORDS[nextIdx];
    const nextEndDate = new Date(currentDate.getTime() + nextLord.years * 365.25 * 24 * 3600 * 1000);
    timeline.push({
      planet: nextLord.planet,
      years: nextLord.years,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: nextEndDate.toISOString().split('T')[0]
    });
    currentDate = nextEndDate;
  }

  // Find active Dasha for today
  const now = new Date();
  const activeDasha = timeline.find(t => new Date(t.startDate) <= now && new Date(t.endDate) >= now) || timeline[0];

  return {
    activeDasha,
    timeline
  };
}

/**
 * Generate 12 Houses (Bhavas) analysis based on Ascendant & Planetary Placements
 */
function generateHousesAnalysis(ascendantFormatted, planetaryPositions) {
  const houseSignificances = [
    { house: 1, name: 'Tanu Bhava', domain: 'Self, Physical Body, Vitality, Temperament, Appearance' },
    { house: 2, name: 'Dhana Bhava', domain: 'Wealth, Speech, Family Assets, Values, Food' },
    { house: 3, name: 'Sahaja Bhava', domain: 'Siblings, Courage, Communications, Short Journeys, Skills' },
    { house: 4, name: 'Bandhu/Sukh Bhava', domain: 'Mother, Inner Peace, Home, Land, Vehicles, Roots' },
    { house: 5, name: 'Putra Bhava', domain: 'Intellect, Children, Creativity, Past Life Merits (Purva Punya)' },
    { house: 6, name: 'Ari/Ripu Bhava', domain: 'Health, Overcoming Obstacles, Service, Daily Work, Debts' },
    { house: 7, name: 'Yuvati Bhava', domain: 'Marriage, Partnerships, Spouse, Public Relations, Trade' },
    { house: 8, name: 'Randhra Bhava', domain: 'Longevity, Transformation, Occult, Sudden Gains, Research' },
    { house: 9, name: 'Dharma Bhava', domain: 'Higher Wisdom, Fortune, Father, Guru, Long Pilgrimages' },
    { house: 10, name: 'Karma Bhava', domain: 'Career, Status, Achievements, Reputation, Public Contribution' },
    { house: 11, name: 'Labha Bhava', domain: 'Gains, Aspirations, Social Circles, Elder Siblings, Prosperity' },
    { house: 12, name: 'Vyaya Bhava', domain: 'Spiritual Liberation (Moksha), Foreign Travel, Isolation, Expenses' }
  ];

  const ascSignNum = ascendantFormatted.signNumber;

  return houseSignificances.map(h => {
    // Sign in this house
    const houseSignNum = ((ascSignNum + h.house - 2) % 12) + 1;
    const sign = ZODIAC_SIGNS[houseSignNum - 1];
    const occupants = planetaryPositions.filter(p => p.house === h.house).map(p => p.name);

    return {
      house: h.house,
      name: h.name,
      sign: sign.name,
      signSanskrit: sign.sanskrit,
      lord: sign.lord,
      occupants,
      domain: h.domain
    };
  });
}

/**
 * Generate deep Vedic interpretative synthesis
 */
function generateAstrologicalSynthesis(lagna, moonPlanet, sunPlanet, houses, planetaryPositions) {
  const moonSign = moonPlanet.sign;
  const sunSign = sunPlanet.sign;
  const ascSign = lagna.sign;
  const tenthHouse = houses.find(h => h.house === 10);
  const seventhHouse = houses.find(h => h.house === 7);
  const fifthHouse = houses.find(h => h.house === 5);
  const secondHouse = houses.find(h => h.house === 2);

  return {
    personality: `With ${ascSign} (${lagna.sanskritSign}) ascending, your primary life orientation is characterized by natural vitality and distinct purpose. Your Ascendant lord is ${ZODIAC_SIGNS[lagna.signNumber - 1].lord}. Moon in ${moonSign} reflects a mind that seeks emotional grounding through clarity, intuition, and thoughtful reflection.`,
    career: `Your 10th house of career (Karma Bhava) is seated in ${tenthHouse.sign}, ruled by ${tenthHouse.lord}. ${tenthHouse.occupants.length > 0 ? `With ${tenthHouse.occupants.join(', ')} influencing the 10th house, professional pursuits lean toward positions of leadership, strategic analysis, and creative execution.` : `Your professional success unfolds progressively through systematic discipline and master of specialized craft.`}`,
    finance: `The 2nd house of accumulated wealth is in ${secondHouse.sign} (Lord: ${secondHouse.lord}). Wealth generation is best sustained through patient long-term planning, diversified holdings, and ethical vocations.`,
    marriage: `Your 7th house of partnerships (Yuvati Bhava) lies in ${seventhHouse.sign} ruled by ${seventhHouse.lord}. Vedic wisdom suggests seeking partners whose communicative nature and core spiritual values align with your own.`,
    education: `The 5th house of intellect and creative perception rests in ${fifthHouse.sign}. You possess high assimilative intelligence and aptitude for deep inquiry.`,
    family: `The 4th house governing domestic peace and home environment emphasizes creating a sanctuary of warmth, stability, and cultural connection.`,
    spiritualPath: `With ${moonPlanet.nakshatra} as your Janma Nakshatra (governed by ${moonPlanet.nakshatraLord}), your spiritual path is nurtured through regular dhyana (meditation), ethical action, and alignment with your cosmic archetype.`
  };
}

/**
 * Primary Kundli Calculation Function
 */
function calculateKundli(details) {
  const { name, dob, tob, place, latitude, longitude, timezone = 5.5, gender } = details;

  const [yearStr, monthStr, dayStr] = dob.split('-');
  const [hourStr, minStr] = tob.split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  // Local decimal hours
  const localDecimalHours = hour + (minute / 60.0);
  // UTC decimal hours
  let utcDecimalHours = localDecimalHours - timezone;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  if (utcDecimalHours < 0) {
    utcDecimalHours += 24;
    utcDay -= 1;
    if (utcDay < 1) {
      utcMonth -= 1;
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear -= 1;
      }
      utcDay = 28; // safe approximation for boundary
    }
  } else if (utcDecimalHours >= 24) {
    utcDecimalHours -= 24;
    utcDay += 1;
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  const jd = getJulianDay(utcYear, utcMonth, utcDay, utcDecimalHours);
  const ayanamsha = getLahiriAyanamsha(jd);

  // 1. Calculate Ascendant (Lagna)
  const ascendantDeg = calculateAscendant(jd, utcDecimalHours, lat, lng, ayanamsha);
  const lagnaFormatted = formatDegree(ascendantDeg);
  const lagnaNakshatra = getNakshatraInfo(ascendantDeg);

  // 2. Calculate Planets
  const rawPlanets = calculatePlanets(jd, ayanamsha);
  const planetsFormatted = rawPlanets.map(p => {
    const formatted = formatDegree(p.long);
    const nakshatra = getNakshatraInfo(p.long);
    const navamshaSign = getNavamshaSign(p.long);
    const house = getHouseNumber(formatted.signNumber, lagnaFormatted.signNumber);

    return {
      name: p.name,
      sanskritName: p.sanskrit,
      totalDegrees: p.long,
      sign: formatted.sign,
      sanskritSign: formatted.sanskritSign,
      signNumber: formatted.signNumber,
      deg: formatted.deg,
      min: formatted.min,
      sec: formatted.sec,
      degreeFormatted: formatted.formatted,
      degreeInSign: formatted.degreeInSign,
      house,
      nakshatra: nakshatra.name,
      nakshatraLord: nakshatra.lord,
      pada: nakshatra.pada,
      isRetrograde: p.isRetrograde,
      navamshaSign: navamshaSign.name,
      navamshaSignNumber: navamshaSign.id
    };
  });

  const moonPlanet = planetsFormatted.find(p => p.name === 'Moon');
  const sunPlanet = planetsFormatted.find(p => p.name === 'Sun');

  // 3. Houses
  const houses = generateHousesAnalysis(lagnaFormatted, planetsFormatted);

  // 4. Dasha
  const dashaInfo = calculateVimshottariDasha(
    getNakshatraInfo(moonPlanet.totalDegrees),
    dob
  );

  // 5. Synthesis
  const synthesis = generateAstrologicalSynthesis(lagnaFormatted, moonPlanet, sunPlanet, houses, planetsFormatted);

  // 6. Chart representations
  // D1 Chart (Rasi) - Map houses 1 to 12 with their sign and occupants
  const d1Chart = houses.map(h => ({
    house: h.house,
    sign: h.sign,
    signNumber: ZODIAC_SIGNS.find(z => z.name === h.sign).id,
    planets: h.occupants
  }));

  // D9 Chart (Navamsha) - Map each house from Lagna Navamsha
  const lagnaNavamsha = getNavamshaSign(ascendantDeg);
  const d9Chart = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const navSignNum = ((lagnaNavamsha.id + houseNum - 2) % 12) + 1;
    const signObj = ZODIAC_SIGNS[navSignNum - 1];
    const occupants = planetsFormatted
      .filter(p => p.navamshaSignNumber === navSignNum)
      .map(p => p.name);

    return {
      house: houseNum,
      sign: signObj.name,
      signNumber: signObj.id,
      planets: occupants
    };
  });

  return {
    birthDetails: {
      name,
      gender,
      dob,
      tob,
      place,
      latitude: lat,
      longitude: lng,
      timezone,
      julianDay: jd.toFixed(4),
      ayanamsha: `${Math.floor(ayanamsha)}° ${Math.round((ayanamsha % 1) * 60)}' (Lahiri)`
    },
    basicInfo: {
      ascendant: lagnaFormatted.sign,
      ascendantSanskrit: lagnaFormatted.sanskritSign,
      ascendantDegree: lagnaFormatted.formatted,
      ascendantNakshatra: lagnaNakshatra.name,
      ascendantNakshatraPada: lagnaNakshatra.pada,
      moonSign: moonPlanet.sign,
      moonSignSanskrit: moonPlanet.sanskritSign,
      sunSign: sunPlanet.sign,
      sunSignSanskrit: sunPlanet.sanskritSign,
      nakshatra: moonPlanet.nakshatra,
      nakshatraLord: moonPlanet.nakshatraLord,
      nakshatraPada: moonPlanet.pada,
      currentMahadasha: dashaInfo.activeDasha.planet
    },
    planetaryPositions: planetsFormatted,
    houses,
    dasha: dashaInfo,
    charts: {
      d1: d1Chart,
      d9: d9Chart
    },
    analysis: synthesis
  };
}

module.exports = {
  calculateKundli,
  ZODIAC_SIGNS,
  NAKSHATRAS,
  DASHA_LORDS,
  getLahiriAyanamsha,
  calculatePlanets,
  calculateAscendant
};
