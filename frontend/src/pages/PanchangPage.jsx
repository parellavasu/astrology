import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Sun, Moon, Sparkles, 
  ShieldAlert, ShieldCheck, Loader2 
} from 'lucide-react';
import CityAutocomplete from '../components/common/CityAutocomplete';
import api from '../services/api';

export default function PanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState({
    name: 'New Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    tz: 5.5
  });

  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanchang = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/panchang?date=${date}&latitude=${city.lat}&longitude=${city.lng}&timezone=${city.tz}&place=${encodeURIComponent(city.name)}`
        );
        if (res.data.success) {
          setPanchang(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchang();
  }, [date, city]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-orange-600" />
          <span>Vedic Calendar of Five Limbs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Daily Vedic Panchang
        </h1>
        <p className="text-sm text-slate-600">
          Accurate calculations of Tithi, Nakshatra, Yoga, Karana, and auspicious/inauspicious Kaal timings.
        </p>
      </div>

      {/* Date & Location Controls Card */}
      <div className="vedic-card p-6 mb-10 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white shadow-xs transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
              Select Location (City)
            </label>
            <CityAutocomplete
              value={city.name}
              onChange={() => {}}
              onSelectCity={(c) => {
                setCity({
                  name: `${c.name}, ${c.country}`,
                  lat: c.lat,
                  lng: c.lng,
                  tz: c.tz
                });
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="vedic-card p-16 flex flex-col items-center justify-center space-y-3 bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs text-slate-500">Computing Panchang for {city.name}...</p>
        </div>
      ) : panchang ? (
        <div className="space-y-8">
          {/* Main Info Hero Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
                  {panchang.dayOfWeek}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {panchang.tithi.fullString}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Location: {panchang.place} • Coordinates: {panchang.latitude.toFixed(2)}°N, {panchang.longitude.toFixed(2)}°E
                </p>
              </div>

              {/* Sun & Moon Times */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-3">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sunrise / Sunset</span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {panchang.solarTimes.sunrise} / {panchang.solarTimes.sunset}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Moonrise / Moonset</span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {panchang.lunarTimes.moonrise} / {panchang.lunarTimes.moonset}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Limbs (Pancha Anga) Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/70">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">1. Tithi</span>
                <h3 className="text-sm font-bold text-orange-800">{panchang.tithi.name}</h3>
                <span className="text-[11px] text-slate-600">Ends around {panchang.tithi.endsAt}</span>
              </div>

              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/70">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">2. Nakshatra</span>
                <h3 className="text-sm font-bold text-orange-800">{panchang.nakshatra.name}</h3>
                <span className="text-[11px] text-slate-600">Lord: {panchang.nakshatra.lord}</span>
              </div>

              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/70">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">3. Yoga</span>
                <h3 className="text-sm font-bold text-orange-800">{panchang.yoga.name}</h3>
                <span className="text-[11px] text-slate-600">{panchang.yoga.isAuspicious ? 'Auspicious' : 'Inauspicious'}</span>
              </div>

              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/70">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">4. Karana</span>
                <h3 className="text-sm font-bold text-orange-800">{panchang.karana.name}</h3>
                <span className="text-[11px] text-slate-600">{panchang.karana.isBhadra ? 'Bhadra (Avoid Shubh Work)' : 'General Karana'}</span>
              </div>
            </div>
          </div>

          {/* Auspicious & Inauspicious Kaal Windows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shubh Kaal */}
            <div className="vedic-card p-6 space-y-4 bg-white shadow-sm">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 text-emerald-700 font-serif font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Auspicious Timings (Shubh Kaal)</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div>
                    <strong className="text-slate-900 block">Abhijit Muhurat</strong>
                    <span className="text-slate-600">Supreme midday auspicious window</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {panchang.auspiciousTimings.abhijit}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div>
                    <strong className="text-slate-900 block">Brahma Muhurat</strong>
                    <span className="text-slate-600">Pre-dawn spiritual invocation</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {panchang.auspiciousTimings.brahmaMuhurat}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div>
                    <strong className="text-slate-900 block">Amrit Kaal</strong>
                    <span className="text-slate-600">Auspicious execution period</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {panchang.auspiciousTimings.amritKaal}
                  </span>
                </div>
              </div>
            </div>

            {/* Ashubh Kaal */}
            <div className="vedic-card p-6 space-y-4 bg-white shadow-sm">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 text-rose-700 font-serif font-bold">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Inauspicious Windows (Ashubh Kaal)</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                  <div>
                    <strong className="text-slate-900 block">Rahu Kalam</strong>
                    <span className="text-slate-600">Refrain from new beginnings or signing deeds</span>
                  </div>
                  <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
                    {panchang.inauspiciousTimings.rahuKalam}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                  <div>
                    <strong className="text-slate-900 block">Yamaganda</strong>
                    <span className="text-slate-600">Unfavorable for financial investments</span>
                  </div>
                  <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
                    {panchang.inauspiciousTimings.yamaganda}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                  <div>
                    <strong className="text-slate-900 block">Gulika Kalam</strong>
                    <span className="text-slate-600">Suitable for repetitive or routine efforts</span>
                  </div>
                  <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {panchang.inauspiciousTimings.gulikaKalam}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline-Based Day View */}
          <div className="vedic-card p-6 space-y-4 bg-white shadow-sm">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 text-orange-600 mr-2" />
              Day Timeline (Shubh & Ashubh Intervals)
            </h3>

            <div className="space-y-2.5 pt-2">
              {panchang.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs transition-colors ${
                    item.type === 'shubh'
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : item.type === 'ashubh'
                        ? 'bg-rose-50/60 border-rose-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-orange-700 text-[11px] min-w-[70px]">
                      {item.start}
                    </span>
                    <div>
                      <strong className="block text-slate-900">{item.name}</strong>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    item.type === 'shubh'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.type === 'ashubh'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
