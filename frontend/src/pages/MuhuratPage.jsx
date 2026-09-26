import React, { useState, useEffect } from 'react';
import { 
  Clock, HeartHandshake, Home, Car, Building2, Briefcase, 
  Baby, Flame, Calendar, Info, Loader2 
} from 'lucide-react';
import CityAutocomplete from '../components/common/CityAutocomplete';
import api from '../services/api';

const CATEGORIES = [
  { id: 'marriage', title: 'Marriage (Vivah)', icon: HeartHandshake, desc: 'Auspicious wedding dates evaluated for planetary harmony.' },
  { id: 'griha_pravesh', title: 'Griha Pravesh', icon: Home, desc: 'House warming ceremonies welcoming positive Vastu energy.' },
  { id: 'vehicle_purchase', title: 'Vehicle Purchase', icon: Car, desc: 'Buying car or bike during favorable Nakshatra alignments.' },
  { id: 'property_purchase', title: 'Property Purchase', icon: Building2, desc: 'Land and house registration under stable Earth signs.' },
  { id: 'business_opening', title: 'Business Opening', icon: Briefcase, desc: 'Commercial shop and startup inaugurations for steady wealth.' },
  { id: 'naming_ceremony', title: 'Naming (Namakaran)', icon: Baby, desc: 'Bestowing sacred name during auspicious lunar asterisms.' },
  { id: 'religious_ceremonies', title: 'Religious Havans', icon: Flame, desc: 'Vedic rituals, Pujas, and planetary shantis.' }
];

export default function MuhuratPage() {
  const [selectedCategory, setSelectedCategory] = useState('marriage');
  const [location, setLocation] = useState('New Delhi, India');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuhurat = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/muhurat/${selectedCategory}?place=${encodeURIComponent(location)}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMuhurat();
  }, [selectedCategory, location]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>Shubh Muhurat Shastra</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Auspicious Timings & Muhurat
        </h1>
        <p className="text-sm text-slate-600">
          Find scientifically calculated traditional timings for significant personal, matrimonial, and commercial milestones.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-xs scale-105 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-orange-200 hover:bg-orange-50/30 shadow-2xs font-medium'
              }`}
            >
              <Icon className="w-5 h-5 mb-1.5 text-orange-600" />
              <span className="text-xs leading-tight">{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Results View */}
      {loading ? (
        <div className="vedic-card p-16 flex flex-col items-center justify-center space-y-3 bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs text-slate-500">Calculating Muhurat alignments...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Category Banner */}
          <div className="vedic-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow-sm">
            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
                Selected Event
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 capitalize">
                {selectedCategory.replace('_', ' ')} Muhurat
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Period: {data.month} • Place: {location}
              </p>
            </div>

            <div className="max-w-xs w-full">
              <label className="text-[11px] text-slate-500 block mb-1 font-medium">Filter by Location</label>
              <CityAutocomplete
                value={location}
                onChange={() => {}}
                onSelectCity={(c) => setLocation(`${c.name}, ${c.country}`)}
              />
            </div>
          </div>

          {/* Timings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.timings.map((t, idx) => (
              <div key={idx} className="vedic-card p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all bg-white shadow-sm">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-orange-700 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                      {t.date}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {t.auspiciousness}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p><strong className="text-slate-500">Tithi:</strong> {t.tithi}</p>
                    <p><strong className="text-slate-500">Nakshatra:</strong> {t.nakshatra}</p>
                    <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Favorable Window:</span>
                      <strong className="text-orange-800 font-mono font-bold">{t.time}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Traditional Disclaimer Box */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start space-x-3 text-xs text-orange-900 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 text-orange-600 mt-0.5" />
            <span>
              <strong>Note on Traditional Muhurta:</strong> {data.disclaimer}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
