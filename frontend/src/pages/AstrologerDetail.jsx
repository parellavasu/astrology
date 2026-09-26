import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, CheckCircle2, MessageSquare, Phone, 
  ArrowLeft, Loader2, Send 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AstrologerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [astrologer, setAstrologer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAstro = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/astrologers/${id}`);
        if (res.data.success) {
          setAstrologer(res.data.astrologer);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAstro();
  }, [id]);

  const handleStartConsultation = async (type = 'chat') => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/astrologers/${id}` } });
      return;
    }

    setStartingChat(true);
    try {
      const res = await api.post('/consultations/start', {
        astrologerId: astrologer._id,
        type,
        durationMinutes: 15
      });
      if (res.data.success) {
        navigate(`/consultation/${res.data.consultation._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStartingChat(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post(`/astrologers/${id}/reviews`, {
        rating: newRating,
        comment: newComment
      });
      if (res.data.success) {
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        <p className="text-xs text-slate-500">Loading astrologer profile...</p>
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Astrologer profile not found.</p>
        <Link to="/astrologers" className="text-orange-600 text-xs mt-2 block font-medium">← Back to Astrologers</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link to="/astrologers" className="inline-flex items-center text-xs text-slate-600 hover:text-orange-600 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Astrologers
      </Link>

      {/* Main Profile Header Card */}
      <div className="vedic-card p-6 sm:p-10 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="relative">
              <img
                src={astrologer.avatar}
                alt={astrologer.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-orange-200 shadow-sm"
              />
              {astrologer.isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {astrologer.displayName}
                </h1>
                {astrologer.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-sky-600" />
                )}
              </div>
              <p className="text-sm font-semibold text-orange-700">{astrologer.title}</p>
              <div className="flex items-center space-x-3 text-xs text-slate-600">
                <span className="flex items-center font-bold text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 mr-1 text-amber-500" />
                  {astrologer.rating}
                </span>
                <span>•</span>
                <span className="text-slate-500">{astrologer.reviewCount} Reviews</span>
                <span>•</span>
                <span className="text-slate-500">{astrologer.experienceYears} Years Exp</span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="w-full md:w-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Consultation Fee</span>
              <span className="text-xl font-bold text-orange-600">
                ₹{astrologer.perMinuteRate} <span className="text-xs font-normal text-slate-500">/ min</span>
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStartConsultation('chat')}
                disabled={startingChat}
                className="flex-1 vedic-btn-primary text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start Live Chat</span>
              </button>
              <button
                onClick={() => handleStartConsultation('call')}
                disabled={startingChat}
                className="flex-1 vedic-btn-secondary text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Audio Call</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center font-medium">100% Private & Confidential Session</p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-1">Languages</span>
            <strong className="text-slate-800">{astrologer.languages.join(', ')}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Availability</span>
            <strong className="text-slate-800">{astrologer.availability.hours}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">Consultations Done</span>
            <strong className="text-orange-700 font-mono font-bold">{astrologer.consultationsCount}+ Sessions</strong>
          </div>
        </div>
      </div>

      {/* About & Expertise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="vedic-card p-6 space-y-3 bg-white shadow-sm">
            <h3 className="text-base font-serif font-bold text-slate-900">About Acharya</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {astrologer.bio}
            </p>
          </div>

          {/* Client Reviews Section */}
          <div className="vedic-card p-6 space-y-6 bg-white shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-serif font-bold text-slate-900">Client Reviews</h3>
              <span className="text-xs text-orange-700 font-mono font-semibold">{reviews.length} Verified Feedbacks</span>
            </div>

            {/* Submit Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Rate Your Experience</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`w-6 h-6 flex items-center justify-center cursor-pointer text-lg ${
                          star <= newRating ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows="2"
                  placeholder="Share a thoughtful review of your consultation..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="vedic-btn-primary px-4 py-1.5 text-xs inline-flex items-center cursor-pointer"
                  >
                    <span>Submit Review</span>
                    <Send className="w-3 h-3 ml-1.5" />
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-500">
                Please <Link to="/login" className="text-orange-600 underline font-medium">log in</Link> to share a consultation review.
              </p>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{r.userName}</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Specializations */}
        <div className="space-y-6">
          <div className="vedic-card p-6 space-y-3 bg-white shadow-sm">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Core Specializations
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {astrologer.specializations.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="vedic-card p-6 space-y-3 bg-white shadow-sm">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Specific Astrological Skills
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {astrologer.skills?.map((sk, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                  <span>{sk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
