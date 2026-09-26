import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Compass, Download, Sparkles, Calendar, Clock, 
  MapPin, Printer, ArrowLeft, Bot, CheckCircle2, Bookmark 
} from 'lucide-react';
import VedicChart from '../components/charts/VedicChart';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function KundliResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [kundli, setKundli] = useState(null);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart', 'planets', 'houses', 'analysis', 'dasha'
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check location state or sessionStorage
    const stateData = location.state?.kundliData;
    if (stateData) {
      setKundli(stateData);
    } else {
      const stored = sessionStorage.getItem('jyotirveda_active_kundli');
      if (stored) {
        try {
          setKundli(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [location.state]);

  const handleSaveToProfile = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/kundli/result' } });
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/kundli/save', { kundliData: kundli });
      if (res.data.success) {
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving Kundli:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!kundli) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Compass className="w-12 h-12 text-orange-600 mx-auto animate-pulse" />
        <h2 className="text-2xl font-serif font-bold text-slate-900">No Kundli Active</h2>
        <p className="text-sm text-slate-600">Please enter your birth details to generate your Vedic birth chart.</p>
        <Link to="/kundli" className="vedic-btn-primary inline-flex">
          Go to Kundli Generator
        </Link>
      </div>
    );
  }

  const { birthDetails, basicInfo, planetaryPositions, houses, charts, analysis, dasha } = kundli;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Controls Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <Link to="/kundli" className="inline-flex items-center text-xs text-slate-600 hover:text-orange-600 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Generate Another Chart
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveToProfile}
            disabled={saving || isSaved}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-orange-400 hover:text-orange-700 shadow-2xs'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4 text-orange-600" />}
            <span>{isSaved ? 'Saved to Profile' : 'Save Kundli'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="vedic-btn-primary text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download Kundli PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Title & User Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Janam Kundli Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900">
              {birthDetails.name}’s Vedic Birth Chart
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Lahiri Ayanamsha: <strong className="text-orange-700">{birthDetails.ayanamsha}</strong> • Julian Day: {birthDetails.julianDay}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Lagna (Ascendant)</span>
              <span className="text-sm font-bold text-orange-700">{basicInfo.ascendant}</span>
              <span className="text-[10px] text-slate-500 block">({basicInfo.ascendantSanskrit})</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Rashi (Moon Sign)</span>
              <span className="text-sm font-bold text-orange-700">{basicInfo.moonSign}</span>
              <span className="text-[10px] text-slate-500 block">({basicInfo.moonSignSanskrit})</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Nakshatra</span>
              <span className="text-sm font-bold text-orange-700">{basicInfo.nakshatra}</span>
              <span className="text-[10px] text-slate-500 block">Pada {basicInfo.nakshatraPada} ({basicInfo.nakshatraLord})</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Mahadasha</span>
              <span className="text-sm font-bold text-emerald-700">{basicInfo.currentMahadasha}</span>
              <span className="text-[10px] text-slate-500 block">Vimshottari Dasha</span>
            </div>
          </div>
        </div>

        {/* Birth Details Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 text-orange-600 mr-1.5" /> Date: {birthDetails.dob}</span>
          <span className="flex items-center"><Clock className="w-3.5 h-3.5 text-orange-600 mr-1.5" /> Time: {birthDetails.tob}</span>
          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 text-orange-600 mr-1.5" /> Place: {birthDetails.place}</span>
          <span className="font-mono text-slate-500">Lat: {birthDetails.latitude}° | Long: {birthDetails.longitude}° | TZ: UTC+{birthDetails.timezone}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="no-print flex items-center space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
        {[
          { id: 'chart', label: 'Birth Charts (D1 / D9)' },
          { id: 'planets', label: 'Planetary Positions' },
          { id: 'houses', label: '12 Houses (Bhavas)' },
          { id: 'analysis', label: 'Life Domain Analysis' },
          { id: 'dasha', label: 'Vimshottari Dasha' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Birth Charts */}
      {activeTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <VedicChart d1Chart={charts.d1} d9Chart={charts.d9} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="vedic-card p-6 space-y-4 bg-white shadow-sm">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center">
                <Sparkles className="w-4 h-4 text-orange-600 mr-2" />
                Chart Core Significations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your <strong>D1 (Rashi) Chart</strong> signifies bodily incarnation, karma, vitality, and external worldly accomplishments.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your <strong>D9 (Navamsha) Chart</strong> reflects the inner spiritual core, marital harmony, and the fruits of your planetary promises in the second half of life.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ascendant Degree:</span>
                  <strong className="text-orange-700 font-mono">{basicInfo.ascendantDegree}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lagna Nakshatra:</span>
                  <strong className="text-orange-700">{basicInfo.ascendantNakshatra} (Pada {basicInfo.ascendantNakshatraPada})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sun Sign:</span>
                  <strong className="text-orange-700">{basicInfo.sunSign} ({basicInfo.sunSignSanskrit})</strong>
                </div>
              </div>
            </div>

            {/* AstroAI Inquire Card */}
            <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-900 text-xs font-semibold">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>Ask AstroAI About This Chart</span>
              </div>
              <p className="text-xs text-slate-600">
                Explore deep questions regarding your {basicInfo.ascendant} Lagna or {basicInfo.currentMahadasha} Mahadasha with our Vedic AI assistant.
              </p>
              <Link
                to="/ai-astrology"
                state={{ chartContext: kundli }}
                className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Inquire with AstroAI →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planetary Positions Table */}
      {activeTab === 'planets' && (
        <div className="vedic-card overflow-hidden bg-white shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-slate-900">
              Sidereal Planetary Longitudes & Nakshatra Placements
            </h3>
            <span className="text-xs text-orange-700 font-mono font-semibold">Nirayana System (Lahiri)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Planet</th>
                  <th className="py-3.5 px-4">Sanskrit</th>
                  <th className="py-3.5 px-4">Sign (Rashi)</th>
                  <th className="py-3.5 px-4">Degree</th>
                  <th className="py-3.5 px-4">House (Bhava)</th>
                  <th className="py-3.5 px-4">Nakshatra</th>
                  <th className="py-3.5 px-4">Pada</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planetaryPositions.map((p) => (
                  <tr key={p.name} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{p.sanskritName}</td>
                    <td className="py-3.5 px-4 font-semibold text-orange-700">{p.sign} ({p.sanskritSign})</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{p.degreeFormatted}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">House {p.house}</td>
                    <td className="py-3.5 px-4 text-slate-700">{p.nakshatra} ({p.nakshatraLord})</td>
                    <td className="py-3.5 px-4 text-slate-500">Pada {p.pada}</td>
                    <td className="py-3.5 px-4">
                      {p.isRetrograde ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Retrograde (Vakri)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Direct (Marga)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: 12 Houses (Bhavas) */}
      {activeTab === 'houses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((h) => (
            <div key={h.house} className="vedic-card p-5 space-y-3 bg-white shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  House {h.house} • {h.name}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {h.sign} ({h.signSanskrit})
                </span>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">House Lord</p>
                <p className="text-sm font-bold text-slate-900">{h.lord}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">Resident Planets</p>
                <p className="text-xs font-medium text-indigo-900">
                  {h.occupants.length > 0 ? h.occupants.join(', ') : 'No occupant planets'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Domains:</strong> {h.domain}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Life Domain Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vedic-card p-6 space-y-2.5 bg-white shadow-xs">
              <h4 className="text-sm font-bold text-orange-700 uppercase tracking-wider">
                Personality & Vital Temperament (1st House)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysis.personality}
              </p>
            </div>

            <div className="vedic-card p-6 space-y-2.5 bg-white shadow-xs">
              <h4 className="text-sm font-bold text-sky-700 uppercase tracking-wider">
                Career, Public Dharma & Vocation (10th House)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysis.career}
              </p>
            </div>

            <div className="vedic-card p-6 space-y-2.5 bg-white shadow-xs">
              <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Accumulated Wealth & Prosperity (2nd House)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysis.finance}
              </p>
            </div>

            <div className="vedic-card p-6 space-y-2.5 bg-white shadow-xs">
              <h4 className="text-sm font-bold text-rose-700 uppercase tracking-wider">
                Marriage & Partnerships (7th House)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysis.marriage}
              </p>
            </div>

            <div className="vedic-card p-6 space-y-2.5 bg-white shadow-xs">
              <h4 className="text-sm font-bold text-violet-700 uppercase tracking-wider">
                Intellect, Higher Education & Purva Punya (5th House)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysis.education}
              </p>
            </div>

            <div className="vedic-card p-6 space-y-2.5 bg-white shadow-xs">
              <h4 className="text-sm font-bold text-orange-700 uppercase tracking-wider">
                Spiritual Path & Nakshatra Guidance
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysis.spiritualPath}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Vimshottari Dasha */}
      {activeTab === 'dasha' && (
        <div className="vedic-card p-6 sm:p-8 space-y-6 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                120-Year Vimshottari Dasha Progression
              </h3>
              <p className="text-xs text-slate-500">
                Calculated from Janma Nakshatra ({basicInfo.nakshatra}) balance at birth.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-xs">
              Current Active: {dasha.activeDasha.planet} Mahadasha
            </div>
          </div>

          <div className="space-y-3">
            {dasha.timeline.map((period, idx) => {
              const isActive = period.planet === dasha.activeDasha.planet;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                    isActive
                      ? 'bg-orange-50/70 border-orange-300 text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">
                      {period.planet.slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {period.planet} Mahadasha
                        {isActive && <span className="ml-2 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">ACTIVE NOW</span>}
                      </p>
                      <p className="text-[11px] text-slate-500">Duration: {period.years} Years</p>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-600">
                    <span>{period.startDate}</span>
                    <span className="mx-2 text-slate-400">→</span>
                    <span>{period.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
