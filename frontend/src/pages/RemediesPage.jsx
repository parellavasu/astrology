import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Loader2, Info 
} from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  'All', 'Mantra', 'Gemstone Information', 'Rudraksha Information', 'Charity', 'Meditation'
];

export default function RemediesPage() {
  const [remedies, setRemedies] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemedies = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/remedies${selectedCat !== 'All' ? `?category=${encodeURIComponent(selectedCat)}` : ''}`);
        if (res.data.success) {
          setRemedies(res.data.remedies);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRemedies();
  }, [selectedCat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Upachaya & Daiva Vyapashraya</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Traditional Vedic Remedies
        </h1>
        <p className="text-sm text-slate-600">
          Classical Vedic tools for harmonizing planetary energies through sacred mantras, meditation, selfless charity, and mineralogy.
        </p>
      </div>

      {/* Ethical Disclaimer Box */}
      <div className="max-w-4xl mx-auto mb-10 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start space-x-3 text-xs text-orange-900 leading-relaxed font-medium">
        <Info className="w-4 h-4 shrink-0 text-orange-600 mt-0.5" />
        <span>
          <strong>Ethical Foundation:</strong> Vedic remedies (Upayas) are contemplative and spiritual disciplines designed to cultivate inner awareness, humility, and positive karma. They do not substitute medical treatments, legal remedies, or sincere personal effort.
        </span>
      </div>

      {/* Categories Switcher */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCat === cat
                ? 'bg-orange-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 shadow-2xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Remedies Grid */}
      {loading ? (
        <div className="vedic-card p-16 flex flex-col items-center justify-center space-y-3 bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading Vedic remedies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remedies.map((r) => (
            <div key={r.id} className="vedic-card p-6 flex flex-col justify-between space-y-4 bg-white shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {r.category}
                  </span>
                  {r.rulingPlanet && (
                    <span className="text-[11px] text-slate-500 font-mono font-medium">
                      {r.rulingPlanet}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-slate-900">{r.title}</h3>

                {/* Sanskrit Verse if Mantra */}
                {r.sanskrit && (
                  <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200 space-y-1">
                    <p className="text-sm font-serif font-bold text-orange-950 text-center">{r.sanskrit}</p>
                    <p className="text-[10px] text-slate-600 italic text-center font-mono">{r.transliteration}</p>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  <p><strong className="text-slate-500">Purpose:</strong> {r.purpose}</p>
                  {r.instructions && <p><strong className="text-slate-500">How to Practice:</strong> {r.instructions}</p>}
                  {r.bestTime && <p><strong className="text-slate-500">Auspicious Time:</strong> {r.bestTime}</p>}
                  {r.metal && <p><strong className="text-slate-500">Metal & Finger:</strong> {r.metal}, {r.finger}</p>}
                  {r.recommendation && <p><strong className="text-slate-500">Guideline:</strong> {r.recommendation}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 italic">
                {r.disclaimer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
