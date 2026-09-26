import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto shadow-sm">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl font-serif font-bold text-orange-600">404</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Cosmic Path Not Found</h1>
        <p className="text-xs text-slate-600">
          The celestial coordinates you are navigating toward do not exist in this sector of the astrological cosmos.
        </p>
      </div>

      <div className="pt-2">
        <Link to="/" className="vedic-btn-primary inline-flex items-center space-x-2 text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Sacred Home</span>
        </Link>
      </div>
    </div>
  );
}
