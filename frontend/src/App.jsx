import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SearchModal from './components/layout/SearchModal';

import Home from './pages/Home';
import KundliGenerator from './pages/KundliGenerator';
import KundliResult from './pages/KundliResult';
import KundliMatching from './pages/KundliMatching';
import HoroscopePage from './pages/HoroscopePage';
import PanchangPage from './pages/PanchangPage';
import MuhuratPage from './pages/MuhuratPage';
import AstrologersPage from './pages/AstrologersPage';
import AstrologerDetail from './pages/AstrologerDetail';
import ConsultationRoom from './pages/ConsultationRoom';
import AstroAIPage from './pages/AstroAIPage';
import RemediesPage from './pages/RemediesPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetail from './pages/ArticleDetail';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentResult from './pages/PaymentResult';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800">
          <Header onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kundli" element={<KundliGenerator />} />
              <Route path="/kundli/result" element={<KundliResult />} />
              <Route path="/kundli/:id" element={<KundliResult />} />
              <Route path="/matching" element={<KundliMatching />} />
              <Route path="/horoscope" element={<HoroscopePage />} />
              <Route path="/horoscope/:sign" element={<HoroscopePage />} />
              <Route path="/panchang" element={<PanchangPage />} />
              <Route path="/muhurat" element={<MuhuratPage />} />
              <Route path="/astrologers" element={<AstrologersPage />} />
              <Route path="/astrologers/:id" element={<AstrologerDetail />} />
              <Route path="/consultation/:id" element={<ConsultationRoom />} />
              <Route path="/ai-astrology" element={<AstroAIPage />} />
              <Route path="/remedies" element={<RemediesPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/result" element={<PaymentResult />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />

          {/* Global Search Dialog Modal */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
