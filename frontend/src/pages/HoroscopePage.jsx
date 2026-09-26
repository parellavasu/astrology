import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Heart, Briefcase, DollarSign, Users, Hash, 
  Palette, Clock, Loader2 
} from 'lucide-react';
import api from '../services/api';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function HoroscopePage() {
  const { sign: routeSign } = useParams();
  const navigate = useNavigate();

  const [sign, setSign] = useState(routeSign || 'Aries');
  const [period, setPeriod] = useState('daily');
  const [dayOffset, setDayOffset] = useState('today');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (routeSign && SIGNS.map(s => s.toLowerCase()).includes(routeSign.toLowerCase())) {
      const match = SIGNS.find(s => s.toLowerCase() === routeSign.toLowerCase());
      setSign(match);
    }
  }, [routeSign]);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/horoscope/${sign}?period=${period}&dayOffset=${dayOffset}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [sign, period, dayOffset]);

  const handleSignSelect = (s) => {
    setSign(s);
    navigate(`/horoscope/${s}`, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Vedic Planetary Transits</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Vedic Horoscope Predictions
        </h1>
        <p className="text-sm text-slate-600">
          Deep daily, weekly, monthly, and yearly forecasts rooted in planetary transits and Moon sign astrology.
        </p>
      </div>

      {/* 12 Sign Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {SIGNS.map((s) => (
          <button
            key={s}
            onClick={() => handleSignSelect(s)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer ${
              sign === s
                ? 'bg-orange-600 text-white font-bold shadow-xs scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 shadow-2xs'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Time Range Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
          {['yesterday', 'today', 'tomorrow'].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDayOffset(d);
                setPeriod('daily');
              }}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                dayOffset === d && period === 'daily'
                  ? 'bg-white text-orange-700 border border-orange-200/60 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-white text-orange-700 border border-orange-200/60 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Forecast Card */}
      {loading ? (
        <div className="vedic-card p-16 flex flex-col items-center justify-center space-y-3 bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading Vedic ephemeris alignment...</p>
        </div>
      ) : data ? (
        <div className="vedic-card p-6 sm:p-10 space-y-8 bg-white shadow-sm">
          {/* Sign Title & Lucky Badges */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {data.sign} ({data.sanskritSign})
                </h2>
                <span className="text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full font-semibold">
                  Ruling Lord: {data.lord}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Element: {data.element} • Horizon: {period.toUpperCase()} ({dayOffset.toUpperCase()})
              </p>
            </div>

            {/* Lucky metrics */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-xs">
                <Hash className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-slate-500">Lucky No:</span>
                <strong className="text-slate-800">{data.luckyNumber}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-xs">
                <Palette className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-slate-500">Lucky Color:</span>
                <strong className="text-slate-800">{data.luckyColor}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-slate-500">Shubh Time:</span>
                <strong className="text-slate-800">{data.auspiciousTime}</strong>
              </div>
            </div>
          </div>

          {/* Overview Box */}
          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200/80">
            <h3 className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-2">
              General Overview & Astrological Climate
            </h3>
            <p className="text-base text-slate-800 leading-relaxed font-serif">
              "{data.overview}"
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4" />
                <span>Love & Romantic Affinity</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {data.love}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>Career & Professional Dharma</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {data.career}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>Finance & Material Assets</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {data.finance}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Family, Domestic Peace & Wellbeing</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {data.family}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
