import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Search, Menu, X, Compass, ChevronDown, LayoutDashboard, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Kundli', path: '/kundli' },
    { name: 'Horoscope', path: '/horoscope' },
    { name: 'Matching', path: '/matching' },
    { name: 'Panchang', path: '/panchang' },
    { name: 'Muhurat', path: '/muhurat' },
    { name: 'Astrologers', path: '/astrologers' },
    { name: 'AstroAI', path: '/ai-astrology' },
    { name: 'Articles', path: '/articles' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'py-3.5 bg-white/80 backdrop-blur-sm border-b border-slate-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-xl sm:text-2xl font-serif font-bold tracking-tight leading-none">
                <span className="text-slate-900">Jyotir</span>
                <span className="text-orange-600">Veda</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-sans mt-0.5 font-medium">
                Vedic Wisdom Platform
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-orange-700 bg-orange-50 border border-orange-200 font-semibold'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Auth & CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition-all cursor-pointer"
              aria-label="Search astrology platform"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Auth Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-orange-300 text-slate-800 text-sm shadow-xs cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate font-medium">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-2 divide-y divide-slate-100 z-50">
                    <div className="px-4 py-2">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                      <p className="text-[11px] text-orange-600 mt-1 font-semibold">
                        Wallet: ₹{user?.walletBalance || 0}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5 text-orange-600" />
                        My Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 font-semibold"
                        >
                          <Compass className="w-4 h-4 mr-2.5 text-indigo-600" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Create Free Kundli CTA */}
            <Link
              to="/kundli"
              className="vedic-btn-primary text-xs sm:text-sm font-semibold"
            >
              Create Free Kundli
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-orange-600"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-orange-600 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-white/95 backdrop-blur-xl z-50 overflow-y-auto px-6 py-6 border-t border-slate-200 flex flex-col justify-between shadow-2xl">
          <div className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-orange-700 border border-orange-200 font-semibold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl bg-slate-50 text-slate-800 font-semibold border border-slate-200"
                >
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold border border-rose-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold border border-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl bg-orange-600 text-white font-bold"
                >
                  Register
                </Link>
              </div>
            )}
            <Link
              to="/kundli"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full vedic-btn-primary flex items-center justify-center"
            >
              Create Free Kundli
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
