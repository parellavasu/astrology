import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = location.state?.returnUrl || '/dashboard';

  const handleQuickFill = (type) => {
    if (type === 'user') {
      setEmail('user@jyotirveda.com');
      setPassword('User@123');
    } else if (type === 'admin') {
      setEmail('admin@jyotirveda.com');
      setPassword('Admin@123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(returnUrl);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="vedic-card p-6 sm:p-10 space-y-6 shadow-xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto mb-2 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-600">Sign in to your JyotirVeda astrology account</p>
        </div>

        {/* Quick Demo Logins Bar */}
        <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200/80 space-y-2">
          <span className="text-[10px] text-orange-700 font-bold uppercase tracking-wider block text-center">
            One-Click Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-colors font-medium cursor-pointer shadow-xs"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-colors font-medium cursor-pointer shadow-xs"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full vedic-btn-primary py-2.5 text-sm flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
