import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Clock, Calendar, ArrowRight, 
  Search, Loader2 
} from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  'All', 'Kundli', 'Marriage', 'Planets', 'Panchang', 'Vedic Astrology', 'Career', 'Remedies'
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let url = `/articles?`;
        if (selectedCat !== 'All') url += `category=${encodeURIComponent(selectedCat)}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;

        const res = await api.get(url);
        if (res.data.success) {
          setArticles(res.data.articles);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCat, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-orange-600" />
          <span>Vedic Editorial Magazine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Astrology Articles & Insights
        </h1>
        <p className="text-sm text-slate-600">
          Explore scholarly perspectives on Vedic Jyotish, Nakshatras, relationship compatibility, and cosmic philosophy.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="vedic-card p-5 mb-10 space-y-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50/70 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-orange-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:text-orange-800 hover:bg-orange-50 border border-slate-200 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="vedic-card p-16 flex flex-col items-center justify-center space-y-3 bg-white shadow-sm">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading Vedic articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art._id}
              className="vedic-card overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200 bg-white shadow-sm"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-800 bg-white/95 backdrop-blur-md border border-orange-200 shadow-xs">
                      {art.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-orange-600" /> {art.readingTime}</span>
                    <span>•</span>
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-orange-600" /> {new Date(art.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {art.shortDescription}
                  </p>
                </div>
              </div>

              {/* Author & Read CTA */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500 font-medium">By {art.author?.name}</span>
                <Link
                  to={`/articles/${art.slug}`}
                  className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700 group/link"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="vedic-card p-12 text-center text-slate-500 bg-white shadow-sm">
          No articles found for this category or search query.
        </div>
      )}
    </div>
  );
}
