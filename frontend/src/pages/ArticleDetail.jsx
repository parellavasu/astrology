import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, Loader2 
} from 'lucide-react';
import api from '../services/api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/articles/${slug}`);
        if (res.data.success) {
          setArticle(res.data.article);
          setRelated(res.data.related || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading Vedic article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Article not found.</p>
        <Link to="/articles" className="text-orange-600 text-xs mt-2 block font-medium">← Back to Articles</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link to="/articles" className="inline-flex items-center text-xs text-slate-600 hover:text-orange-600 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Articles
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-orange-600" />
          <span>{article.category}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-200 pb-4 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-900">By {article.author?.name}</span>
            <span>•</span>
            <span className="text-orange-700 font-medium">{article.author?.role}</span>
          </div>

          <div className="flex items-center space-x-4 font-mono">
            <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-orange-600" /> {new Date(article.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-orange-600" /> {article.readingTime}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md h-72 sm:h-96 bg-slate-100">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="vedic-card p-6 sm:p-10 bg-white shadow-sm">
        <div className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 font-serif whitespace-pre-wrap">
          {article.content}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-sans font-medium">Topics:</span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800 font-sans font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-serif font-bold text-slate-900">
            Related Vedic Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel._id}
                to={`/articles/${rel.slug}`}
                className="vedic-card p-4 flex flex-col justify-between group hover:-translate-y-1 transition-all bg-white shadow-xs"
              >
                <div>
                  <span className="text-[10px] text-orange-700 font-bold uppercase">{rel.category}</span>
                  <h4 className="text-sm font-serif font-bold text-slate-800 group-hover:text-orange-600 line-clamp-2 mt-1">
                    {rel.title}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 mt-4 flex items-center group-hover:text-orange-600">
                  Read article <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
