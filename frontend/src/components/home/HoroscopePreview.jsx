import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Heart, Briefcase, DollarSign, Users, 
  Hash, Palette, Clock, ArrowRight, Loader2 
} from 'lucide-react';
import api from '../../services/api';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function HoroscopePreview() {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [dayOffset, setDayOffset] = useState('today'); // 'yesterday', 'today', 'tomorrow'
  const [period, setPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/horoscope/${selectedSign}?period=${period}&dayOffset=${dayOffset}`);
        if (res.data.success) {
          setHoroscope(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching horoscope preview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [selectedSign, dayOffset, period]);

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Planetary Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Today's Horoscope
          </h2>
          <p className="text-sm text-slate-600">
            Tune into your daily planetary transit vibrations across relationships, career, and wellbeing.
          </p>
        </div>

        {/* Horizontal Zodiac Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {SIGNS.map((sign) => {
            const isSelected = selectedSign === sign;
            return (
              <button
                key={sign}
                onClick={() => setSelectedSign(sign)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white font-bold shadow-xs scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-900 hover:bg-orange-50/50 shadow-2xs'
                }`}
              >
                {sign}
              </button>
            );
          })}
        </div>

        {/* Time Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          {/* Day Offset (Yesterday / Today / Tomorrow) */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            {['yesterday', 'today', 'tomorrow'].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDayOffset(d);
                  setPeriod('daily');
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  dayOffset === d && period === 'daily'
                    ? 'bg-white text-orange-700 border border-orange-200/60 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Period Tabs (Weekly / Monthly / Yearly) */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
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

        {/* Content Box */}
        {loading ? (
          <div className="vedic-card p-12 flex flex-col items-center justify-center space-y-3 bg-white">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            <p className="text-xs text-slate-500">Consulting cosmic planetary ephemeris...</p>
          </div>
        ) : horoscope ? (
          <div className="vedic-card p-6 sm:p-10 space-y-8 bg-white">
            {/* Sign & Overview */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                    {horoscope.sign} Horoscope
                  </h3>
                  <span className="text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-semibold">
                    Lord: {horoscope.lord}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Element: {horoscope.element} • Mode: {period.toUpperCase()} ({dayOffset.toUpperCase()})
                </p>
              </div>

              {/* Lucky Indicators */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <Hash className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-slate-500">Lucky No:</span>
                  <strong className="text-slate-800">{horoscope.luckyNumber}</strong>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <Palette className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-slate-500">Lucky Color:</span>
                  <strong className="text-slate-800">{horoscope.luckyColor}</strong>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-slate-500">Shubh Time:</span>
                  <strong className="text-slate-800">{horoscope.auspiciousTime}</strong>
                </div>
              </div>
            </div>

            {/* Main Overview */}
            <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-200/70">
              <h4 className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-2">
                Overview & Planetary Mood
              </h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
                "{horoscope.overview}"
              </p>
            </div>

            {/* 4 Pillars Grid (Love, Career, Finance, Family) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Love */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <Heart className="w-4 h-4" />
                  <span>Love & Bonds</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {horoscope.love}
                </p>
              </div>

              {/* Career */}
              <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  <span>Career & Karma</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {horoscope.career}
                </p>
              </div>

              {/* Finance */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>Wealth & Gains</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {horoscope.finance}
                </p>
              </div>

              {/* Family */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Family & Roots</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {horoscope.family}
                </p>
              </div>
            </div>

            {/* Full Horoscope Link */}
            <div className="pt-2 text-right">
              <Link
                to={`/horoscope/${horoscope.sign}`}
                className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700 group"
              >
                <span>Read in-depth {horoscope.sign} astrological forecast</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
