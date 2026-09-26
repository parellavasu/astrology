import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bot, Sparkles, Send, Loader2, Info 
} from 'lucide-react';
import api from '../services/api';

const SAMPLE_PROMPTS = [
  "What does my Moon sign indicate about my emotional nature?",
  "What does my 10th house represent for my career?",
  "What is the significance of my Janma Nakshatra?",
  "What does my current Vimshottari Dasha traditionally signify?",
  "What does my Navamsha (D9) chart reveal about marriage?",
  "Which Vedic remedies are recommended for planetary balance?"
];

export default function AstroAIPage() {
  const location = useLocation();
  const [chartContext, setChartContext] = useState(location.state?.chartContext || null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Namaste. I am **AstroAI**, your Vedic astrological companion.

You can ask me questions about your birth chart, 10th house career prospects, Moon sign, Nakshatra, or current Dasha period. How may I assist your astrological exploration today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chartContext) {
      const stored = sessionStorage.getItem('jyotirveda_active_kundli');
      if (stored) {
        try {
          setChartContext(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [chartContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMessage = {
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        query: q,
        chartContext
      });

      if (res.data.success) {
        const aiMessage = {
          role: 'assistant',
          text: res.data.data.answer,
          related: res.data.data.relatedTopics,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I encountered an unexpected disruption in calculating your response. Please rephrase or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-slate-900 flex items-center">
              <span>Ask AstroAI</span>
              <span className="ml-2 text-[10px] font-sans font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                Vedic AI Assistant
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              {chartContext
                ? `Analyzing chart: ${chartContext.birthDetails?.name} (${chartContext.basicInfo?.ascendant} Lagna, ${chartContext.basicInfo?.moonSign} Rashi)`
                : 'General Vedic Astrology Knowledge Mode'}
            </p>
          </div>
        </div>

        {chartContext && (
          <span className="hidden sm:inline-flex items-center text-xs text-emerald-800 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
            Chart Synced
          </span>
        )}
      </div>

      {/* Mandatory Ethical Disclaimer Banner */}
      <div className="mb-3 px-3 py-2 bg-orange-50 border border-orange-200 rounded-xl flex items-center space-x-2 text-[11px] text-orange-800 font-medium">
        <Info className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        <span>
          Astrology interpretations are traditional/spiritual guidance and not deterministic predictions or legal/financial/medical advice.
        </span>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-orange-600 text-white font-medium rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center space-x-1.5 text-orange-700 font-serif font-bold text-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AstroAI Vedic Insight</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap space-y-2">{m.text}</div>

                {/* Related Suggested Queries */}
                {m.related && m.related.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
                      Explore Further:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.related.map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => handleAsk(topic)}
                          className="text-[11px] text-orange-700 hover:text-orange-950 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer font-medium"
                        >
                          {topic} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span className={`text-[10px] block mt-2 text-right ${isUser ? 'text-orange-100' : 'text-slate-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-orange-600 p-2 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consulting Parashara and Jaimini sutras...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="my-2 flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
        {SAMPLE_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(p)}
            className="text-[11px] text-slate-700 hover:text-orange-800 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 px-3 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer font-medium shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Ask a question about your birth chart, 10th house, Dasha..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="vedic-btn-primary p-3 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
