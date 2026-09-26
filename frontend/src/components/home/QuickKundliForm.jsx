import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Clock, User, ArrowRight, Info } from 'lucide-react';
import CityAutocomplete from '../common/CityAutocomplete';
import api from '../../services/api';

export default function QuickKundliForm({ formRef }) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dob: '',
    tob: '',
    place: '',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.tob) errs.tob = 'Exact time of birth is required';
    if (!formData.place.trim()) errs.place = 'Birth city is required for exact coordinates';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({
      ...prev,
      place: `${city.name}, ${city.country}`,
      latitude: city.lat,
      longitude: city.lng,
      timezone: city.tz
    }));
    if (errors.place) setErrors(prev => ({ ...prev, place: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/kundli/calculate', {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        tob: formData.tob,
        place: formData.place,
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone,
        saveToProfile: true
      });

      if (res.data.success) {
        // Save result in sessionStorage for instant retrieval
        sessionStorage.setItem('jyotirveda_active_kundli', JSON.stringify(res.data.data));
        navigate('/kundli/result', { state: { kundliData: res.data.data } });
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Failed to generate Kundli. Please review birth coordinates.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={formRef} id="quick-kundli" className="relative -mt-6 sm:-mt-10 mb-20 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Instant Sidereal Calculation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Create Your Free Kundli
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Your birth details are used to calculate your personalized Vedic birth chart.
            </p>
          </div>

          {errors.form && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
              {errors.form}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Sharma"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border ${
                    errors.name ? 'border-rose-500' : 'border-slate-300 focus:border-orange-500 focus:bg-white'
                  } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs transition-all`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        formData.gender === g
                          ? 'bg-orange-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  max="2030-12-31"
                  onChange={(e) => {
                    setFormData({ ...formData, dob: e.target.value });
                    if (errors.dob) setErrors({ ...errors, dob: null });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border ${
                    errors.dob ? 'border-rose-500' : 'border-slate-300 focus:border-orange-500 focus:bg-white'
                  } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs transition-all`}
                />
                {errors.dob && <p className="text-[11px] text-rose-500 font-medium">{errors.dob}</p>}
              </div>

              {/* Time of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                  Exact Time of Birth
                </label>
                <input
                  type="time"
                  value={formData.tob}
                  onChange={(e) => {
                    setFormData({ ...formData, tob: e.target.value });
                    if (errors.tob) setErrors({ ...errors, tob: null });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border ${
                    errors.tob ? 'border-rose-500' : 'border-slate-300 focus:border-orange-500 focus:bg-white'
                  } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs transition-all`}
                />
                {errors.tob && <p className="text-[11px] text-rose-500 font-medium">{errors.tob}</p>}
              </div>

              {/* Birth Place */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Birth Place (City / District)</label>
                <CityAutocomplete
                  value={formData.place}
                  onChange={(val) => setFormData(prev => ({ ...prev, place: val }))}
                  onSelectCity={handleCitySelect}
                  error={errors.place}
                />
              </div>
            </div>

            {/* Note & Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Degrees, Nakshatra Pada, Bhavas, and D9 Navamsha chart are computed instantly.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto vedic-btn-primary px-8 text-sm cursor-pointer"
              >
                {loading ? 'Calculating Ephemeris...' : 'Generate My Kundli'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
