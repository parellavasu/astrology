import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function HeroSection({ onScrollToForm }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Dawn Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-sky-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Authentic Vedic Jyotish & Sidereal Ephemeris</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
              Discover the Story Written in Your{' '}
              <span className="vedic-gradient-text drop-shadow-xs">Stars</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore your Vedic birth chart, understand your planetary influences, and discover meaningful insights based on your birth details.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToForm}
                className="w-full sm:w-auto vedic-btn-primary group"
              >
                <span>Create Free Kundli</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/horoscope"
                className="w-full sm:w-auto vedic-btn-secondary"
              >
                Explore Horoscope
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Lahiri Ayanamsha Precision</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>4.9/5 Rating (12,000+ Consultations)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>100% Free Kundli PDF</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Vedic Celestial Wheel SVG */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-[340px] sm:w-[420px] aspect-square flex items-center justify-center select-none">
              {/* Outer Golden/Saffron Concentric Rings */}
              <div className="absolute inset-0 rounded-full border border-orange-200/80 animate-[spin_120s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-orange-300/80 animate-[spin_90s_linear_infinite_reverse]" />
              <div className="absolute inset-12 rounded-full border border-indigo-200/80" />

              {/* Central Luminous Vedic Mandala SVG */}
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB923C" />
                    <stop offset="50%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Central Soft Glow */}
                <circle cx="200" cy="200" r="160" fill="url(#sunGlow)" />

                {/* 12 Radiant Rays (Bhavas / Rashis) */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 200 + 70 * Math.cos(angle);
                  const y1 = 200 + 70 * Math.sin(angle);
                  const x2 = 200 + 175 * Math.cos(angle);
                  const y2 = 200 + 175 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#FB923C"
                      strokeWidth="1.2"
                      strokeOpacity="0.6"
                    />
                  );
                })}

                {/* Concentric Geometries */}
                <circle cx="200" cy="200" r="175" fill="none" stroke="url(#saffronGrad)" strokeWidth="1.8" />
                <circle cx="200" cy="200" r="145" fill="none" stroke="#EA580C" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="200" r="105" fill="none" stroke="#3B82F6" strokeWidth="1.2" strokeOpacity="0.4" />

                {/* Sacred 12 Point Star / Octagram Geometry */}
                <polygon
                  points="200,60 300,100 340,200 300,300 200,340 100,300 60,200 100,100"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                />
                <polygon
                  points="200,75 325,200 200,325 75,200"
                  fill="rgba(255, 247, 237, 0.75)"
                  stroke="#FB923C"
                  strokeWidth="1.5"
                />

                {/* Center Sun Symbol */}
                <circle cx="200" cy="200" r="32" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
                <circle cx="200" cy="200" r="12" fill="#FEF08A" />

                {/* 12 Zodiac Symbols on Perimeter */}
                {[
                  { sym: '♈', label: 'Mesha' }, { sym: '♉', label: 'Vrish' },
                  { sym: '♊', label: 'Mith' }, { sym: '♋', label: 'Karka' },
                  { sym: '♌', label: 'Simha' }, { sym: '♍', label: 'Kanya' },
                  { sym: '♎', label: 'Tula' }, { sym: '♏', label: 'Vrish' },
                  { sym: '♐', label: 'Dhanu' }, { sym: '♑', label: 'Makar' },
                  { sym: '♒', label: 'Kumbh' }, { sym: '♓', label: 'Meen' }
                ].map((item, idx) => {
                  const angle = ((idx * 30 - 90) * Math.PI) / 180;
                  const x = 200 + 160 * Math.cos(angle);
                  const y = 200 + 160 * Math.sin(angle);
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="14" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="1.5" />
                      <text
                        x={x}
                        y={y + 5}
                        fill="#C2410C"
                        fontSize="14"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {item.sym}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Orbiting Planetary Indicators */}
              <div className="absolute top-6 left-12 px-2.5 py-1 rounded-full bg-white border border-orange-200 shadow-xs text-xs text-orange-800 font-semibold font-mono">
                Surya ☉
              </div>
              <div className="absolute bottom-8 right-10 px-2.5 py-1 rounded-full bg-white border border-indigo-200 shadow-xs text-xs text-indigo-900 font-semibold font-mono">
                Chandra ☽
              </div>
              <div className="absolute top-1/2 right-2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-white border border-emerald-200 shadow-xs text-xs text-emerald-800 font-semibold font-mono">
                Guru ♃
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
