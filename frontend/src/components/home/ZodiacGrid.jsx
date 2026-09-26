import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Flame, Droplets, Wind, Mountain } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', sanskrit: 'Mesha', dates: 'Mar 21 - Apr 19', element: 'Fire', lord: 'Mars', symbol: '♈', desc: 'Courageous, pioneering spirit driven by decisive action and passion.' },
  { name: 'Taurus', sanskrit: 'Vrishabha', dates: 'Apr 20 - May 20', element: 'Earth', lord: 'Venus', symbol: '♉', desc: 'Steadfast, patient builder who cherishes beauty, peace, and tangible security.' },
  { name: 'Gemini', sanskrit: 'Mithuna', dates: 'May 21 - Jun 20', element: 'Air', lord: 'Mercury', symbol: '♊', desc: 'Intellectually versatile, communicative, and curious about life\'s nuances.' },
  { name: 'Cancer', sanskrit: 'Karka', dates: 'Jun 21 - Jul 22', element: 'Water', lord: 'Moon', symbol: '♋', desc: 'Deeply intuitive, nurturing soul rooted in emotional depth and domestic warmth.' },
  { name: 'Leo', sanskrit: 'Simha', dates: 'Jul 23 - Aug 22', element: 'Fire', lord: 'Sun', symbol: '♌', desc: 'Noble, magnanimous leader radiating vitality, confidence, and creative fire.' },
  { name: 'Virgo', sanskrit: 'Kanya', dates: 'Aug 23 - Sep 22', element: 'Earth', lord: 'Mercury', symbol: '♍', desc: 'Analytical, conscientious mind dedicated to practical service and mastery.' },
  { name: 'Libra', sanskrit: 'Tula', dates: 'Sep 23 - Oct 22', element: 'Air', lord: 'Venus', symbol: '♎', desc: 'Harmonious diplomat seeking balance, fair counsel, and artistic elegance.' },
  { name: 'Scorpio', sanskrit: 'Vrishchika', dates: 'Oct 23 - Nov 21', element: 'Water', lord: 'Mars', symbol: '♏', desc: 'Transformative, penetrating presence possessing boundless willpower and focus.' },
  { name: 'Sagittarius', sanskrit: 'Dhanu', dates: 'Nov 22 - Dec 21', element: 'Fire', lord: 'Jupiter', symbol: '♐', desc: 'Philosophical seeker inspired by truth, higher wisdom, and noble exploration.' },
  { name: 'Capricorn', sanskrit: 'Makara', dates: 'Dec 22 - Jan 19', element: 'Earth', lord: 'Saturn', symbol: '♑', desc: 'Disciplined strategist committed to enduring legacy, duty, and resilience.' },
  { name: 'Aquarius', sanskrit: 'Kumbha', dates: 'Jan 20 - Feb 18', element: 'Air', lord: 'Saturn', symbol: '♒', desc: 'Visionary humanitarian focused on progressive ideas and societal upliftment.' },
  { name: 'Pisces', sanskrit: 'Meena', dates: 'Feb 19 - Mar 20', element: 'Water', lord: 'Jupiter', symbol: '♓', desc: 'Compassionate mystic connected to spiritual flow, empathy, and cosmic oneness.' }
];

export default function ZodiacGrid() {
  const getElementBadge = (element) => {
    switch (element) {
      case 'Fire': return <span className="inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full"><Flame className="w-3 h-3 mr-1 text-orange-600" /> Fire</span>;
      case 'Earth': return <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full"><Mountain className="w-3 h-3 mr-1 text-emerald-600" /> Earth</span>;
      case 'Air': return <span className="inline-flex items-center text-[10px] font-semibold text-sky-800 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full"><Wind className="w-3 h-3 mr-1 text-sky-600" /> Air</span>;
      case 'Water': return <span className="inline-flex items-center text-[10px] font-semibold text-indigo-800 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-full"><Droplets className="w-3 h-3 mr-1 text-indigo-600" /> Water</span>;
      default: return null;
    }
  };

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>The 12 Rashis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Explore Your Zodiac Sign
          </h2>
          <p className="text-sm text-slate-600">
            Discover the cosmic archetype, planetary rulership, and daily guidance written for your sign.
          </p>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ZODIAC_SIGNS.map((sign) => (
            <div
              key={sign.name}
              className="vedic-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl font-serif text-orange-700 group-hover:scale-110 group-hover:border-orange-400 group-hover:bg-orange-100 transition-all shadow-xs">
                    {sign.symbol}
                  </div>
                  {getElementBadge(sign.element)}
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {sign.name}
                    </h3>
                    <span className="text-xs text-orange-700 font-medium">({sign.sanskrit})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{sign.dates}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
                  {sign.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Lord: <strong className="text-slate-800 font-semibold">{sign.lord}</strong></span>
                <Link
                  to={`/horoscope/${sign.name}`}
                  className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700 group/link"
                >
                  <span>Horoscope</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
