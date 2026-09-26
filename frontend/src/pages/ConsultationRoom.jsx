import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Clock, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ConsultationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await api.get(`/consultations/${id}`);
        if (res.data.success) {
          setConsultation(res.data.consultation);
          setMessages(res.data.consultation.messages || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Consultation countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setSending(true);

    try {
      const res = await api.post(`/consultations/${id}/messages`, { text: userMsg });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleEndConsultation = async () => {
    try {
      await api.post(`/consultations/${id}/end`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Connecting to consultation session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-140px)] flex flex-col">
      {/* Session Top Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <img
            src={consultation?.astrologer?.avatar}
            alt={consultation?.astrologer?.displayName}
            className="w-10 h-10 rounded-full object-cover border border-orange-200"
          />
          <div>
            <h2 className="text-sm font-serif font-bold text-slate-900">
              {consultation?.astrologer?.displayName}
            </h2>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Live Astrological Consultation
            </span>
          </div>
        </div>

        {/* Timer & Conclude Button */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span className={secondsRemaining < 120 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>

          <button
            onClick={handleEndConsultation}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.sender === 'user';
          const isSystem = m.sender === 'system';

          if (isSystem) {
            return (
              <div key={idx} className="text-center my-3">
                <span className="text-[11px] text-orange-800 bg-orange-100/70 px-3 py-1 rounded-full border border-orange-200 font-medium">
                  {m.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-orange-600 text-white font-medium rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {!isUser && (
                  <p className="text-[10px] font-bold text-orange-700 mb-1">
                    {consultation?.astrologer?.displayName}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className={`text-[10px] block mt-1.5 text-right ${isUser ? 'text-orange-100' : 'text-slate-400'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-3">
        <input
          type="text"
          placeholder="Type your question about marriage, career, dosha, or remedies..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={sending || !inputText.trim()}
          className="vedic-btn-primary p-3 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
