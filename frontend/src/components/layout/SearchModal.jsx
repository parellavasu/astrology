import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Compass, Users, Sparkles, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const QUICK_TOPICS = [
  { name: 'Create Free Kundli', type: 'service', path: '/kundli', icon: Compass },
  { name: 'Kundli Milan (36 Gunas)', type: 'service', path: '/matching', icon: Sparkles },
  { name: 'Today\'s Panchang & Rahu Kalam', type: 'service', path: '/panchang', icon: Sparkles },
  { name: 'Marriage Muhurat Timings', type: 'service', path: '/muhurat', icon: Sparkles },
  { name: 'Talk to an Astrologer', type: 'service', path: '/astrologers', icon: Users },
  { name: 'Aries Horoscope', type: 'zodiac', path: '/horoscope/Aries', icon: Compass },
  { name: 'Taurus Horoscope', type: 'zodiac', path: '/horoscope/Taurus', icon: Compass },
  { name: 'Ask AstroAI Vedic Guide', type: 'service', path: '/ai-astrology', icon: Sparkles },
  { name: 'Vedic Gemstones (Ratna)', type: 'remedy', path: '/remedies', icon: Sparkles }
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ articles: [], astrologers: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length > 1) {
      setLoading(true);
      const timer = setTimeout(async () => {
        try {
          const [artRes, astroRes] = await Promise.all([
            api.get(`/articles?search=${encodeURIComponent(query)}&limit=4`),
            api.get(`/astrologers?search=${encodeURIComponent(query)}`)
          ]);
          setResults({
            articles: artRes.data.articles || [],
            astrologers: astroRes.data.astrologers || []
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setResults({ articles: [], astrologers: [] });
    }
  }, [query]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const filteredTopics = QUICK_TOPICS.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-5 h-5 text-orange-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, zodiac signs, astrologers, kundli services..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto space-y-6">
          {/* Quick Services & Tools */}
          <div>
            <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Services & Astrological Tools
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredTopics.slice(0, 6).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleNavigate(item.path)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-slate-800 group-hover:text-orange-950">{item.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Astrologers Match */}
          {results.astrologers.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Verified Astrologers
              </h5>
              <div className="space-y-2">
                {results.astrologers.map((astro) => (
                  <button
                    key={astro._id}
                    onClick={() => handleNavigate(`/astrologers/${astro._id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={astro.avatar} alt={astro.displayName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{astro.displayName}</p>
                        <p className="text-[11px] text-slate-500">{astro.specializations.slice(0, 2).join(', ')} • {astro.experienceYears} yrs</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-600">₹{astro.perMinuteRate}/min</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Match */}
          {results.articles.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Articles & Vedic Knowledge
              </h5>
              <div className="space-y-2">
                {results.articles.map((art) => (
                  <button
                    key={art._id}
                    onClick={() => handleNavigate(`/articles/${art.slug}`)}
                    className="w-full flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 hover:text-orange-600">{art.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{art.shortDescription}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
