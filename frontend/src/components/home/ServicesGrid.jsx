import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, HeartHandshake, Calendar, Clock, 
  Users, FileText, Sparkles, ArrowRight 
} from 'lucide-react';

const SERVICES = [
  {
    title: 'Vedic Kundli',
    desc: 'Generate your mathematically accurate birth chart with D1 Rasi, D9 Navamsha, planetary positions, and Nakshatra Padas.',
    icon: Compass,
    path: '/kundli',
    cta: 'Generate Chart',
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    title: 'Kundli Matching',
    desc: 'Calculate traditional 36-point Ashtakoota compatibility (Gun Milan) and evaluate Manglik Dosha for marriage harmony.',
    icon: HeartHandshake,
    path: '/matching',
    cta: 'Check Compatibility',
    color: 'bg-rose-100 text-rose-600 border-rose-200'
  },
  {
    title: 'Daily Horoscope',
    desc: 'Read comprehensive Vedic daily, weekly, and monthly horoscopes covering career, love, finance, and lucky attributes.',
    icon: Sparkles,
    path: '/horoscope',
    cta: 'Read Predictions',
    color: 'bg-amber-100 text-amber-600 border-amber-200'
  },
  {
    title: 'Daily Panchang',
    desc: 'Discover precise Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, Yamaganda, and auspicious Abhijit Muhurat for your city.',
    icon: Calendar,
    path: '/panchang',
    cta: 'View Panchang',
    color: 'bg-sky-100 text-sky-600 border-sky-200'
  },
  {
    title: 'Shubh Muhurat',
    desc: 'Find auspicious windows for marriage, Griha Pravesh, vehicle purchases, property investments, and business inaugurations.',
    icon: Clock,
    path: '/muhurat',
    cta: 'Find Muhurat',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200'
  },
  {
    title: 'Talk to an Astrologer',
    desc: 'Connect directly with verified Vedic scholars for confidential one-on-one live chat and audio consultations.',
    icon: Users,
    path: '/astrologers',
    cta: 'Consult Astrologer',
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200'
  },
  {
    title: 'AstroAI Guidance',
    desc: 'Ask our context-aware Vedic intelligence questions regarding your birth chart, 10th house career, or running Mahadasha.',
    icon: Sparkles,
    path: '/ai-astrology',
    cta: 'Ask AstroAI',
    color: 'bg-violet-100 text-violet-600 border-violet-200'
  },
  {
    title: 'Vedic Remedies',
    desc: 'Explore classical mantras, gemstone recommendations, Rudraksha guidelines, and selfless charity for karmic balance.',
    icon: FileText,
    path: '/remedies',
    cta: 'Explore Remedies',
    color: 'bg-teal-100 text-teal-600 border-teal-200'
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-16 sm:py-20 relative bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Comprehensive Vedic Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Everything You Need to Explore Your Stars
          </h2>
          <p className="text-sm text-slate-600">
            From precision algorithmic birth charts to direct scholar consultations, explore our complete suite of Vedic astrological tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="vedic-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200 bg-white"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 shadow-xs ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={s.path}
                    className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700 group/link"
                  >
                    <span>{s.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
