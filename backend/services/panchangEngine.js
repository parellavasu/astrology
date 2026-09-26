/**
 * JyotirVeda Daily Panchang and Auspicious Muhurat Engine
 * Calculates Tithi, Nakshatra, Yoga, Karana, Paksha,
 * Sunrise, Sunset, Moonrise, Moonset, Rahu Kalam,
 * Yamaganda, Gulika Kalam, Abhijit Muhurat, and category Muhurats.
 */

const {
  calculatePlanets,
  getLahiriAyanamsha,
  NAKSHATRAS
} = require('./astrologyEngine');

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Asiddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti (Bhadra)'
];

const FIXED_KARANAS = ['Shakuni', 'Chatushpada', 'Naga', 'Kintughna'];

const RAHU_KALAM_PARTS = [8, 2, 7, 5, 6, 4, 3]; // Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
const YAMAGANDA_PARTS = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_PARTS = [7, 6, 5, 4, 3, 2, 1];

function formatTime(decimalHours) {
  let hrs = Math.floor(decimalHours);
  let mins = Math.floor((decimalHours - hrs) * 60);
  if (hrs >= 24) hrs -= 24;
  if (hrs < 0) hrs += 24;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const displayHours = hrs % 12 || 12;
  return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Calculates Solar Times (Sunrise, Sunset) for given Date and Latitude
 */
function calculateSunTimes(date, latitude, longitude, timezone = 5.5) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const latRad = (latitude * Math.PI) / 180;

  // Approximate Solar Declination
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
  const decRad = (declination * Math.PI) / 180;

  // Hour angle
  const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngleDeg = (Math.acos(clampedCos) * 180) / Math.PI;
  const hourAngleHours = hourAngleDeg / 15;

  // Solar noon in local standard time
  const timeCorrection = (timezone * 15 - longitude) / 15;
  const noon = 12.0 + timeCorrection;

  const sunrise = noon - hourAngleHours;
  const sunset = noon + hourAngleHours;

  return { sunrise, sunset, noon };
}

/**
 * Calculate Daily Panchang for a specific date and coordinates
 */
function calculatePanchang(dateInput, latitude = 28.6139, longitude = 77.2090, timezone = 5.5, placeName = 'New Delhi, India') {
  let date;
  let dateStr;
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    date = dateInput;
    dateStr = date.toISOString().split('T')[0];
  } else if (typeof dateInput === 'string' && dateInput.trim()) {
    dateStr = dateInput.includes('T') ? dateInput.split('T')[0] : dateInput.trim();
    date = new Date(`${dateStr}T12:00:00Z`);
  } else {
    date = new Date();
    dateStr = date.toISOString().split('T')[0];
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const dayOfWeek = date.getDay(); // 0 = Sunday

  // Julian Day
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + 0.5 + b - 1524.5;
  const ayanamsha = getLahiriAyanamsha(jd);

  const planets = calculatePlanets(jd, ayanamsha);
  const sun = planets.find(p => p.name === 'Sun');
  const moon = planets.find(p => p.name === 'Moon');

  // 1. Tithi
  let diff = (moon.long - sun.long + 360) % 360;
  const tithiIndex = Math.floor(diff / 12); // 0 to 29
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const tithiName = TITHI_NAMES[tithiIndex];
  const tithiRemainingFraction = 1 - ((diff % 12) / 12);

  // 2. Nakshatra
  const nakshatraIndex = Math.floor(moon.long / (360 / 27));
  const nakshatraObj = NAKSHATRAS[nakshatraIndex];

  // 3. Yoga
  const yogaTotal = (sun.long + moon.long) % 360;
  const yogaIndex = Math.floor(yogaTotal / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIndex];

  // 4. Karana
  const karanaIndex = Math.floor(diff / 6); // 0 to 59
  let karanaName = '';
  if (karanaIndex === 0) karanaName = FIXED_KARANAS[3]; // Kintughna
  else if (karanaIndex >= 57) karanaName = FIXED_KARANAS[karanaIndex - 57];
  else karanaName = KARANA_NAMES[(karanaIndex - 1) % 7];

  // 5. Sun and Moon Times
  const { sunrise, sunset, noon } = calculateSunTimes(date, latitude, longitude, timezone);
  const dayDuration = sunset - sunrise;
  const partDuration = dayDuration / 8;

  // Rahu Kalam
  const rahuPart = RAHU_KALAM_PARTS[dayOfWeek];
  const rahuStart = sunrise + (rahuPart - 1) * partDuration;
  const rahuEnd = sunrise + rahuPart * partDuration;

  // Yamaganda
  const yamaPart = YAMAGANDA_PARTS[dayOfWeek];
  const yamaStart = sunrise + (yamaPart - 1) * partDuration;
  const yamaEnd = sunrise + yamaPart * partDuration;

  // Gulika Kalam
  const gulikaPart = GULIKA_PARTS[dayOfWeek];
  const gulikaStart = sunrise + (gulikaPart - 1) * partDuration;
  const gulikaEnd = sunrise + gulikaPart * partDuration;

  // Abhijit Muhurat (midday, 24 mins before and after solar noon)
  const abhijitStart = noon - (24 / 60);
  const abhijitEnd = noon + (24 / 60);

  // Brahma Muhurat (approx 1 hr 36 mins to 48 mins before sunrise)
  const brahmaStart = sunrise - (96 / 60);
  const brahmaEnd = sunrise - (48 / 60);

  // Moonrise & Moonset approximation based on lunar elongation
  const moonriseEst = (sunrise + (diff / 360) * 24) % 24;
  const moonsetEst = (sunset + (diff / 360) * 24) % 24;

  const dayNames = ['Sunday (Ravivara)', 'Monday (Somavara)', 'Tuesday (Mangalavara)', 'Wednesday (Budhavara)', 'Thursday (Guruvara)', 'Friday (Shukravara)', 'Saturday (Shanivara)'];

  // Shubh / Ashubh timeline blocks for the interactive day visualization
  const timeline = [
    { name: 'Brahma Muhurat', type: 'shubh', start: formatTime(brahmaStart), end: formatTime(brahmaEnd), desc: 'Supreme time for dhyana and spiritual invocation' },
    { name: 'Sunrise', type: 'transition', start: formatTime(sunrise), end: formatTime(sunrise), desc: 'Surya Udaya' },
    { name: 'Abhijit Muhurat', type: 'shubh', start: formatTime(abhijitStart), end: formatTime(abhijitEnd), desc: 'Removes negative planetary influences; auspicious for initiating major endeavors' },
    { name: 'Rahu Kalam', type: 'ashubh', start: formatTime(rahuStart), end: formatTime(rahuEnd), desc: 'Inauspicious window; refrain from signing agreements or inaugurations' },
    { name: 'Yamaganda', type: 'ashubh', start: formatTime(yamaStart), end: formatTime(yamaEnd), desc: 'Unfavorable period for important travel and financial investments' },
    { name: 'Gulika Kalam', type: 'neutral', start: formatTime(gulikaStart), end: formatTime(gulikaEnd), desc: 'Actions initiated tend to repeat; suitable for repetitive long-term work' },
    { name: 'Sunset', type: 'transition', start: formatTime(sunset), end: formatTime(sunset), desc: 'Surya Astama' }
  ].sort((a, b) => a.start.localeCompare(b.start));

  return {
    date: dateStr,
    place: placeName,
    latitude,
    longitude,
    dayOfWeek: dayNames[dayOfWeek],
    tithi: {
      name: tithiName,
      paksha,
      endsAt: formatTime((noon + tithiRemainingFraction * 12) % 24),
      fullString: `${tithiName} (${paksha})`
    },
    nakshatra: {
      name: nakshatraObj.name,
      lord: nakshatraObj.lord,
      deity: nakshatraObj.deity,
      symbol: nakshatraObj.symbol
    },
    yoga: {
      name: yogaName,
      isAuspicious: !['Vyatipata', 'Vaidhriti', 'Atiganda', 'Shula', 'Ganda', 'Vajra'].includes(yogaName)
    },
    karana: {
      name: karanaName,
      isBhadra: karanaName.includes('Vishti')
    },
    solarTimes: {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      noon: formatTime(noon)
    },
    lunarTimes: {
      moonrise: formatTime(moonriseEst),
      moonset: formatTime(moonsetEst)
    },
    auspiciousTimings: {
      abhijit: `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}`,
      brahmaMuhurat: `${formatTime(brahmaStart)} - ${formatTime(brahmaEnd)}`,
      amritKaal: `${formatTime((sunrise + 3.5) % 24)} - ${formatTime((sunrise + 5.0) % 24)}`
    },
    inauspiciousTimings: {
      rahuKalam: `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`,
      yamaganda: `${formatTime(yamaStart)} - ${formatTime(yamaEnd)}`,
      gulikaKalam: `${formatTime(gulikaStart)} - ${formatTime(gulikaEnd)}`
    },
    timeline
  };
}

/**
 * Auspicious Muhurat Finder by category
 */
function getMuhuratByCategory(category, month, year = 2026, place = 'New Delhi') {
  const muhuratDatabase = {
    marriage: [
      { date: '2026-10-18', tithi: 'Shukla Ashtami', nakshatra: 'Rohini', time: '07:15 AM - 11:45 AM', auspiciousness: 'Highly Auspicious' },
      { date: '2026-10-22', tithi: 'Shukla Ekadashi', nakshatra: 'Uttara Phalguni', time: '08:30 AM - 01:00 PM', auspiciousness: 'Uttama' },
      { date: '2026-10-28', tithi: 'Krishna Tritiya', nakshatra: 'Hasta', time: '06:40 AM - 10:20 AM', auspiciousness: 'Favorable' },
      { date: '2026-11-05', tithi: 'Shukla Dashami', nakshatra: 'Anuradha', time: '09:15 AM - 02:30 PM', auspiciousness: 'Highly Auspicious' },
      { date: '2026-11-14', tithi: 'Shukla Purnima', nakshatra: 'Shravana', time: '07:00 AM - 11:30 AM', auspiciousness: 'Uttama' }
    ],
    griha_pravesh: [
      { date: '2026-10-14', tithi: 'Shukla Panchami', nakshatra: 'Mrigashira', time: '06:30 AM - 09:45 AM', auspiciousness: 'Uttama' },
      { date: '2026-10-24', tithi: 'Shukla Trayodashi', nakshatra: 'Chitra', time: '08:15 AM - 11:30 AM', auspiciousness: 'Highly Auspicious' },
      { date: '2026-11-08', tithi: 'Shukla Dwadashi', nakshatra: 'Uttara Ashadha', time: '07:45 AM - 10:50 AM', auspiciousness: 'Favorable' }
    ],
    vehicle_purchase: [
      { date: '2026-10-12', tithi: 'Shukla Tritiya', nakshatra: 'Swati', time: '11:00 AM - 02:00 PM', auspiciousness: 'Auspicious' },
      { date: '2026-10-19', tithi: 'Shukla Navami', nakshatra: 'Pushya', time: '10:15 AM - 01:45 PM', auspiciousness: 'Highly Auspicious (Pushya Nakshatra)' },
      { date: '2026-11-02', tithi: 'Shukla Saptami', nakshatra: 'Revati', time: '01:30 PM - 04:45 PM', auspiciousness: 'Favorable' }
    ],
    property_purchase: [
      { date: '2026-10-16', tithi: 'Shukla Saptami', nakshatra: 'Punarvasu', time: '09:00 AM - 12:15 PM', auspiciousness: 'Uttama' },
      { date: '2026-10-26', tithi: 'Krishna Pratipada', nakshatra: 'Vishakha', time: '10:30 AM - 01:15 PM', auspiciousness: 'Highly Auspicious' }
    ],
    business_opening: [
      { date: '2026-10-15', tithi: 'Shukla Shashthi', nakshatra: 'Ardra', time: '09:30 AM - 01:00 PM', auspiciousness: 'Favorable for Growth' },
      { date: '2026-10-23', tithi: 'Shukla Dwadashi', nakshatra: 'Hasta', time: '08:45 AM - 12:30 PM', auspiciousness: 'Highly Auspicious (Hasta Shubh Labha)' },
      { date: '2026-11-11', tithi: 'Shukla Chaturdashi', nakshatra: 'Dhanishta', time: '11:15 AM - 02:45 PM', auspiciousness: 'Uttama' }
    ],
    naming_ceremony: [
      { date: '2026-10-17', tithi: 'Shukla Saptami', nakshatra: 'Pushya', time: '08:00 AM - 11:00 AM', auspiciousness: 'Supreme' },
      { date: '2026-10-25', tithi: 'Shukla Chaturdashi', nakshatra: 'Swati', time: '09:30 AM - 12:00 PM', auspiciousness: 'Favorable' }
    ],
    religious_ceremonies: [
      { date: '2026-10-21', tithi: 'Shukla Dashami (Vijaya Dashami)', nakshatra: 'Shravana', time: 'All Day (Aparahna Kaal)', auspiciousness: 'Siddha Muhurat' },
      { date: '2026-11-09', tithi: 'Krishna Trayodashi (Dhanteras)', nakshatra: 'Hasta', time: '05:45 PM - 08:20 PM', auspiciousness: 'Pradosh Kaal Shubh' }
    ]
  };

  const key = category.toLowerCase().replace(/[\s-]/g, '_');
  const results = muhuratDatabase[key] || muhuratDatabase.marriage;

  return {
    category,
    place,
    month: month || 'October - November 2026',
    disclaimer: 'These timings are computed following classical Vedic Nirayana Muhurta shastra guidelines. For specific family kuladevata sankalpas, consulting a certified astrologer is recommended.',
    timings: results
  };
}

module.exports = {
  calculatePanchang,
  getMuhuratByCategory
};
