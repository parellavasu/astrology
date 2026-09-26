import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Calendar, Clock, MapPin, User, ArrowRight, ShieldCheck } from 'lucide-react';
import CityAutocomplete from '../components/common/CityAutocomplete';
import api from '../services/api';

export default function KundliGenerator() {
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

  const handleQuickFill = (preset) => {
    if (preset === 'delhi') {
      setFormData({
        name: 'Aditya Sharma',
        gender: 'male',
        dob: '1995-11-18',
        tob: '06:45',
        place: 'New Delhi, India',
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: 5.5
      });
    } else if (preset === 'mumbai') {
      setFormData({
        name: 'Ananya Deshmukh',
        gender: 'female',
        dob: '1998-07-24',
        tob: '15:30',
        place: 'Mumbai, India',
        latitude: 19.0760,
        longitude: 72.8777,
        timezone: 5.5
      });
    }
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.tob) errs.tob = 'Time of birth is required';
    if (!formData.place.trim()) errs.place = 'Birth city is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
        sessionStorage.setItem('jyotirveda_active_kundli', JSON.stringify(res.data.data));
        navigate('/kundli/result', { state: { kundliData: res.data.data } });
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An error occurred while calculating the ephemeris. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <Compass className="w-3.5 h-3.5 text-orange-600" />
          <span>Vedic Ephemeris Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Vedic Janam Kundli Generator
        </h1>
        <p className="text-sm text-slate-600">
          Enter exact birth coordinates to compute your Lagna, Moon Sign (Rashi), Nakshatra, Bhavas, and D1/D9 chart matrices.
        </p>
      </div>

      {/* Preset Fill Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-orange-50/60 border border-orange-200/80 rounded-xl text-xs">
        <span className="text-slate-700 font-medium flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 mr-1.5" />
          Quick Demo Presets:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('delhi')}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-700 font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Aditya (New Delhi, 1995)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('mumbai')}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-700 font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Ananya (Mumbai, 1998)
          </button>
        </div>
      </div>

      {/* Main Generator Form */}
      <div className="vedic-card p-6 sm:p-10 bg-white shadow-md">
        {errors.form && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Aditya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
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
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
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
                onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
              />
              {errors.tob && <p className="text-[11px] text-rose-500 font-medium">{errors.tob}</p>}
            </div>

            {/* Birth Place */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                Birth Place (Search City for Latitude/Longitude)
              </label>
              <CityAutocomplete
                value={formData.place}
                onChange={(val) => setFormData(prev => ({ ...prev, place: val }))}
                onSelectCity={(city) => {
                  setFormData(prev => ({
                    ...prev,
                    place: `${city.name}, ${city.country}`,
                    latitude: city.lat,
                    longitude: city.lng,
                    timezone: city.tz
                  }));
                }}
                error={errors.place}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full confidentiality. Your birth data is never shared.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto vedic-btn-primary px-8 text-sm cursor-pointer"
            >
              {loading ? 'Computing Sidereal Chart...' : 'Generate Complete Kundli'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
