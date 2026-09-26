import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Star, MessageSquare, Phone, 
  CheckCircle2, Search, Loader2 
} from 'lucide-react';
import api from '../services/api';

const SPECIALIZATIONS = [
  'All', 'Vedic Astrology', 'KP Astrology', 'Nadi Astrology', 
  'Vastu', 'Tarot', 'Numerology', 'Marriage', 'Career'
];

export default function AstrologersPage() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [search, setSearch] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true);
      try {
        let url = `/astrologers?`;
        if (selectedSpec !== 'All') url += `specialization=${encodeURIComponent(selectedSpec)}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (onlineOnly) url += `isOnline=true&`;

        const res = await api.get(url);
        if (res.data.success) {
          setAstrologers(res.data.astrologers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, [selectedSpec, search, onlineOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <Users className="w-3.5 h-3.5 text-orange-600" />
          <span>Certified Vedic Scholars</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Talk to an Astrologer
        </h1>
        <p className="text-sm text-slate-600">
          Seek genuine guidance from verified Vedic scholars, KP experts, and Vastu consultants via live chat and audio calls.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="vedic-card p-5 mb-10 space-y-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search astrologer by name, skill, or language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50/70 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Online Only Toggle */}
          <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer self-start md:self-auto font-medium">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <span>Show Online Astrologers Only</span>
          </label>
        </div>

        {/* Specialization Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSpec === spec
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:text-orange-800 hover:bg-orange-50 border border-slate-200 shadow-2xs'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Astrologers Cards Grid */}
      {loading ? (
        <div className="vedic-card p-16 flex flex-col items-center justify-center space-y-3 bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading verified astrologers...</p>
        </div>
      ) : astrologers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astrologers.map((astro) => (
            <div
              key={astro._id}
              className="vedic-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all bg-white shadow-sm"
            >
              <div>
                {/* Profile Top Row */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={astro.avatar}
                      alt={astro.displayName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    {astro.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online now" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <Link
                        to={`/astrologers/${astro._id}`}
                        className="text-base font-serif font-bold text-slate-900 hover:text-orange-600 transition-colors"
                      >
                        {astro.displayName}
                      </Link>
                      {astro.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-sky-600" title="Verified Acharya" />
                      )}
                    </div>
                    <p className="text-xs text-orange-700 font-semibold">{astro.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="flex items-center text-xs font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1 text-amber-500" />
                        {astro.rating}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">({astro.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Specializations & Languages */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {astro.specializations.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 text-[10px] border border-orange-200/80 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    <strong className="text-slate-800">Languages:</strong> {astro.languages.join(', ')}
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    <strong className="text-slate-800">Experience:</strong> {astro.experienceYears} Years • {astro.consultationsCount}+ consultations
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {astro.bio}
                </p>
              </div>

              {/* Bottom Price & Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Consultation Rate</span>
                  <span className="text-base font-bold text-orange-600">₹{astro.perMinuteRate} <span className="text-xs font-normal text-slate-500">/ min</span></span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/astrologers/${astro._id}?action=chat`}
                    className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                    title="Live Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/astrologers/${astro._id}?action=call`}
                    className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-700 transition-all cursor-pointer shadow-2xs"
                    title="Audio Consultation"
                  >
                    <Phone className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="vedic-card p-12 text-center text-slate-500 bg-white">
          No astrologers found matching your filter criteria.
        </div>
      )}
    </div>
  );
}
