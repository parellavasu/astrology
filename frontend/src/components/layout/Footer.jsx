import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Moon, Compass, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100/80 border-t border-slate-200 text-slate-600 text-sm mt-24">
      {/* Top Banner: Authentic Vedic Statement */}
      <div className="border-b border-slate-200 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ethical & Mathematically Accurate Vedic Jyotish
              </p>
              <p className="text-xs text-slate-500">
                Calculated using genuine Lahiri Ayanamsha (Chitra Paksha) ephemeris without fear-based superstition.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-xs text-orange-700 font-semibold">
            <span className="flex items-center"><Moon className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> 27 Nakshatras</span>
            <span className="flex items-center"><Compass className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> 12 Bhavas</span>
            <span className="flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> D1 & D9 Charts</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-serif font-bold text-slate-900">
                Jyotir<span className="text-orange-600">Veda</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              India's modern cosmic knowledge platform bringing traditional Vedic wisdom, planetary algorithms, and ethical guidance to life.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                <Globe className="w-3 h-3 mr-1 text-orange-600" /> Pan-India & Global Ephemeris
              </span>
            </div>
          </div>

          {/* Column 1: Astrology */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 font-serif">Astrology</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/kundli" className="hover:text-orange-600 transition-colors">Free Janam Kundli</Link></li>
              <li><Link to="/horoscope" className="hover:text-orange-600 transition-colors">Daily Horoscope</Link></li>
              <li><Link to="/matching" className="hover:text-orange-600 transition-colors">Kundli Matching (Gun Milan)</Link></li>
              <li><Link to="/panchang" className="hover:text-orange-600 transition-colors">Daily Panchang</Link></li>
              <li><Link to="/muhurat" className="hover:text-orange-600 transition-colors">Shubh Muhurat Timings</Link></li>
            </ul>
          </div>

          {/* Column 2: Consult */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 font-serif">Consult</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/astrologers" className="hover:text-orange-600 transition-colors">Talk to Astrologers</Link></li>
              <li><Link to="/astrologers" className="hover:text-orange-600 transition-colors">Live Chat Consultation</Link></li>
              <li><Link to="/ai-astrology" className="hover:text-orange-600 transition-colors">Ask AstroAI</Link></li>
              <li><Link to="/remedies" className="hover:text-orange-600 transition-colors">Vedic Remedies & Mantras</Link></li>
              <li><Link to="/kundli" className="hover:text-orange-600 transition-colors">Astrology Reports</Link></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 font-serif">Learn</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/articles" className="hover:text-orange-600 transition-colors">Astrology Articles</Link></li>
              <li><Link to="/horoscope" className="hover:text-orange-600 transition-colors">12 Zodiac Signs</Link></li>
              <li><Link to="/articles/demystifying-kundli-vedic-birth-charts" className="hover:text-orange-600 transition-colors">27 Nakshatras</Link></li>
              <li><Link to="/articles/ashtakoota-gun-milan-vedic-matchmaking" className="hover:text-orange-600 transition-colors">Gun Milan Guide</Link></li>
              <li><Link to="/articles/understanding-rahu-ketu-karmic-nodes" className="hover:text-orange-600 transition-colors">Planetary Transits</Link></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 font-serif">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-orange-600 transition-colors">About JyotirVeda</Link></li>
              <li><Link to="/" className="hover:text-orange-600 transition-colors">Contact Support</Link></li>
              <li><Link to="/" className="hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-orange-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-orange-600 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center space-y-3">
          <p className="text-[11px] text-slate-500 max-w-4xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> Astrology is an ancient spiritual tradition and philosophical discipline intended for personal introspection and self-discovery. Astrological interpretations provided on JyotirVeda should not be construed as legally binding predictions or medical, legal, psychiatric, or investment advice.
          </p>
          <p className="text-xs text-slate-600 font-medium">
            © {new Date().getFullYear()} JyotirVeda Technologies. All rights reserved. Crafted with precision & devotion.
          </p>
        </div>
      </div>
    </footer>
  );
}
