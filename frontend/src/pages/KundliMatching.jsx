import React, { useState } from 'react';
import { 
  HeartHandshake, Sparkles, User, Calendar, Clock, MapPin, 
  ArrowRight, ShieldCheck, Printer, CheckCircle2, AlertTriangle, Info 
} from 'lucide-react';
import CityAutocomplete from '../components/common/CityAutocomplete';
import api from '../services/api';

export default function KundliMatching() {
  const [person1, setPerson1] = useState({
    name: '',
    gender: 'male',
    dob: '',
    tob: '',
    place: '',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5
  });

  const [person2, setPerson2] = useState({
    name: '',
    gender: 'female',
    dob: '',
    tob: '',
    place: '',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 5.5
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickPreset = () => {
    setPerson1({
      name: 'Aditya Sharma',
      gender: 'male',
      dob: '1995-11-18',
      tob: '06:45',
      place: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5
    });
    setPerson2({
      name: 'Priyanka Patel',
      gender: 'female',
      dob: '1997-04-22',
      tob: '14:20',
      place: 'Ahmedabad, India',
      latitude: 23.0225,
      longitude: 72.5714,
      timezone: 5.5
    });
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!person1.name || !person1.dob || !person1.tob || !person1.place) {
      setError('Please provide complete birth details for Person 1.');
      return;
    }
    if (!person2.name || !person2.dob || !person2.tob || !person2.place) {
      setError('Please provide complete birth details for Person 2.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/matching/calculate', {
        person1,
        person2,
        saveReport: true
      });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to compute Ashtakoota Gun Milan. Please verify birth details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <HeartHandshake className="w-3.5 h-3.5 text-orange-600" />
          <span>Ashtakoota Gun Milan (36 Gunas)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Discover Your Compatibility
        </h1>
        <p className="text-sm text-slate-600">
          Calculate the 8 classical Vedic Kootas to evaluate emotional resonance, biological affinity, and long-term marital harmony.
        </p>
      </div>

      {/* Preset Fill */}
      <div className="no-print max-w-4xl mx-auto mb-8 flex justify-end">
        <button
          type="button"
          onClick={handleQuickPreset}
          className="text-xs text-orange-700 hover:text-orange-800 bg-white border border-slate-200 shadow-2xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Load Sample Couple Data</span>
        </button>
      </div>

      {/* Form Grid: Person 1 and Person 2 */}
      {!result ? (
        <form onSubmit={handleMatch} className="max-w-5xl mx-auto space-y-8">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Person 1 Box */}
            <div className="vedic-card p-6 sm:p-8 space-y-5 bg-white shadow-sm">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">Person 1 (First Partner)</h3>
                  <p className="text-xs text-slate-500">Primary birth details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aditya Sharma"
                    value={person1.name}
                    onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={person1.dob}
                      onChange={(e) => setPerson1({ ...person1, dob: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Time</label>
                    <input
                      type="time"
                      value={person1.tob}
                      onChange={(e) => setPerson1({ ...person1, tob: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Place</label>
                  <CityAutocomplete
                    value={person1.place}
                    onChange={(val) => setPerson1(prev => ({ ...prev, place: val }))}
                    onSelectCity={(c) => {
                      setPerson1(prev => ({
                        ...prev,
                        place: `${c.name}, ${c.country}`,
                        latitude: c.lat,
                        longitude: c.lng,
                        timezone: c.tz
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Person 2 Box */}
            <div className="vedic-card p-6 sm:p-8 space-y-5 bg-white shadow-sm">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">Person 2 (Second Partner)</h3>
                  <p className="text-xs text-slate-500">Secondary birth details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Priyanka Patel"
                    value={person2.name}
                    onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={person2.dob}
                      onChange={(e) => setPerson2({ ...person2, dob: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Time</label>
                    <input
                      type="time"
                      value={person2.tob}
                      onChange={(e) => setPerson2({ ...person2, tob: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Birth Place</label>
                  <CityAutocomplete
                    value={person2.place}
                    onChange={(val) => setPerson2(prev => ({ ...prev, place: val }))}
                    onSelectCity={(c) => {
                      setPerson2(prev => ({
                        ...prev,
                        place: `${c.name}, ${c.country}`,
                        latitude: c.lat,
                        longitude: c.lng,
                        timezone: c.tz
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="vedic-btn-primary px-10 text-sm cursor-pointer"
            >
              {loading ? 'Evaluating 36 Gunas...' : 'Check Compatibility'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      ) : (
        /* Results View */
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="no-print flex justify-between items-center pb-4 border-b border-slate-200">
            <button
              onClick={() => setResult(null)}
              className="text-xs text-slate-600 hover:text-orange-700 font-medium cursor-pointer"
            >
              ← Test Another Compatibility Match
            </button>
            <button
              onClick={() => window.print()}
              className="vedic-btn-secondary text-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download Compatibility Report</span>
            </button>
          </div>

          {/* Overall Score Banner */}
          <div className="vedic-card p-6 sm:p-10 text-center space-y-6 bg-white shadow-sm">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Compatibility Analysis Result</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {result.person1.name} & {result.person2.name}
            </h2>

            {/* Score Ring / Gauge */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#EA580C"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * result.matchResult.totalScore) / 36}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-serif text-orange-600">
                    {result.matchResult.totalScore}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">/ 36 Gunas</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-base font-bold text-emerald-800 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs">
                  {result.matchResult.verdict}
                </span>
              </div>
            </div>

            {/* Comparison Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                <span className="text-slate-500 block">{result.person1.name}</span>
                <strong className="text-orange-700 block font-semibold">{result.person1.basicInfo.moonSign} Rashi</strong>
                <span className="text-slate-600">{result.person1.basicInfo.nakshatra} Nakshatra</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                <span className="text-slate-500 block">{result.person2.name}</span>
                <strong className="text-orange-700 block font-semibold">{result.person2.basicInfo.moonSign} Rashi</strong>
                <span className="text-slate-600">{result.person2.basicInfo.nakshatra} Nakshatra</span>
              </div>
            </div>

            {/* Summary Text */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {result.matchResult.summaryText}
            </p>
          </div>

          {/* Manglik Dosha Card */}
          <div className="vedic-card p-6 space-y-4 bg-white shadow-sm">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-5 h-5 text-orange-600 mr-2" />
              Manglik Dosha (Kuja Dosha) Assessment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">{result.person1.name}</p>
                <p className="text-slate-600">{result.matchResult.manglik.person1.description}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">{result.person2.name}</p>
                <p className="text-slate-600">{result.matchResult.manglik.person2.description}</p>
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800 flex items-center space-x-2">
              <Info className="w-4 h-4 shrink-0 text-orange-600" />
              <span>{result.matchResult.manglik.summary}</span>
            </div>
          </div>

          {/* 8 Kootas Detailed Breakdown Table */}
          <div className="vedic-card overflow-hidden bg-white shadow-sm">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-base font-serif font-bold text-slate-900">
                Ashtakoota 8 Kootas Breakdown
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {result.matchResult.kootas.map((k, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-orange-50/40 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{k.name}</span>
                      <span className="text-[11px] text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
                        {k.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{k.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-mono text-orange-600">
                      {k.obtainedPoints}
                    </span>
                    <span className="text-xs text-slate-500 font-mono"> / {k.maxPoints} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
