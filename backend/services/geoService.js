/**
 * JyotirVeda Geographic Directory Service
 * Comprehensive city coordinate and timezone directory
 * for accurate Vedic Ascendant and Ephemeris calculations.
 */

const CITIES = [
  { name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: 'Surat', state: 'Gujarat', country: 'India', lat: 21.1702, lng: 72.8311, tz: 5.5 },
  { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', lat: 26.4499, lng: 80.3319, tz: 5.5 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', lat: 21.1458, lng: 79.0882, tz: 5.5 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', lat: 22.7196, lng: 75.8577, tz: 5.5 },
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', lat: 23.2599, lng: 77.4126, tz: 5.5 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', lat: 17.6868, lng: 83.2185, tz: 5.5 },
  { name: 'Patna', state: 'Bihar', country: 'India', lat: 25.5941, lng: 85.1376, tz: 5.5 },
  { name: 'Vadodara', state: 'Gujarat', country: 'India', lat: 22.3072, lng: 73.1812, tz: 5.5 },
  { name: 'Ludhiana', state: 'Punjab', country: 'India', lat: 30.9010, lng: 75.8573, tz: 5.5 },
  { name: 'Agra', state: 'Uttar Pradesh', country: 'India', lat: 27.1767, lng: 78.0081, tz: 5.5 },
  { name: 'Nashik', state: 'Maharashtra', country: 'India', lat: 19.9975, lng: 73.7898, tz: 5.5 },
  { name: 'Faridabad', state: 'Haryana', country: 'India', lat: 28.4089, lng: 77.3178, tz: 5.5 },
  { name: 'Meerut', state: 'Uttar Pradesh', country: 'India', lat: 28.9845, lng: 77.7064, tz: 5.5 },
  { name: 'Rajkot', state: 'Gujarat', country: 'India', lat: 22.3039, lng: 70.8022, tz: 5.5 },
  { name: 'Kalyan', state: 'Maharashtra', country: 'India', lat: 19.2403, lng: 73.1305, tz: 5.5 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', lat: 34.0837, lng: 74.7973, tz: 5.5 },
  { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', lat: 11.0168, lng: 76.9558, tz: 5.5 },
  { name: 'Kochi', state: 'Kerala', country: 'India', lat: 9.9312, lng: 76.2673, tz: 5.5 },
  { name: 'Chandigarh', state: 'Punjab/Haryana', country: 'India', lat: 30.7333, lng: 76.7794, tz: 5.5 },
  { name: 'Guwahati', state: 'Assam', country: 'India', lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: 'Bhubaneswar', state: 'Odisha', country: 'India', lat: 20.2961, lng: 85.8245, tz: 5.5 },
  { name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', lat: 8.5241, lng: 76.9366, tz: 5.5 },
  { name: 'Dehradun', state: 'Uttarakhand', country: 'India', lat: 30.3165, lng: 78.0322, tz: 5.5 },
  { name: 'Ujjain', state: 'Madhya Pradesh', country: 'India', lat: 23.1765, lng: 75.7885, tz: 5.5 },
  { name: 'Haridwar', state: 'Uttarakhand', country: 'India', lat: 29.9457, lng: 78.1642, tz: 5.5 },
  { name: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', lat: 26.7922, lng: 82.1998, tz: 5.5 },
  { name: 'Rameshwaram', state: 'Tamil Nadu', country: 'India', lat: 9.2876, lng: 79.3129, tz: 5.5 },
  { name: 'Puri', state: 'Odisha', country: 'India', lat: 19.8135, lng: 85.8312, tz: 5.5 },
  { name: 'Tirupati', state: 'Andhra Pradesh', country: 'India', lat: 13.6288, lng: 79.4192, tz: 5.5 },
  { name: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 1.0 },
  { name: 'New York', state: 'NY', country: 'United States', lat: 40.7128, lng: -74.0060, tz: -4.0 },
  { name: 'San Francisco', state: 'CA', country: 'United States', lat: 37.7749, lng: -122.4194, tz: -7.0 },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, tz: 4.0 },
  { name: 'Singapore', state: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 8.0 },
  { name: 'Toronto', state: 'Ontario', country: 'Canada', lat: 43.6532, lng: -79.3832, tz: -4.0 },
  { name: 'Sydney', state: 'NSW', country: 'Australia', lat: -33.8688, lng: 151.2093, tz: 10.0 }
];

function searchCities(query) {
  if (!query || query.trim().length === 0) return CITIES.slice(0, 10);
  const q = query.toLowerCase().trim();
  return CITIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q) ||
    c.country.toLowerCase().includes(q)
  ).slice(0, 15);
}

module.exports = {
  CITIES,
  searchCities
};
