import React from 'react';
import { Star, ShieldCheck, Award, Heart } from 'lucide-react';

export default function TrustSection() {
  const testimonials = [
    {
      name: 'Rohan Mehra',
      location: 'Bengaluru',
      text: 'The mathematical precision of the Kundli and D9 Navamsha chart is unmatched. It matched my ancestral family horoscope down to the exact degree and Nakshatra Pada.',
      rating: 5,
      service: 'Janam Kundli'
    },
    {
      name: 'Dr. Sunita Rao',
      location: 'Hyderabad',
      text: 'The 36 Guna Ashtakoota matching was so clear and mature. No fear-mongering about Manglik Dosha, just thoughtful spiritual explanations that gave our families genuine confidence.',
      rating: 5,
      service: 'Kundli Matching'
    },
    {
      name: 'Vikram Sengupta',
      location: 'Kolkata',
      text: 'Consulted Acharya Ramanuj Shastri regarding an international corporate offer. His insight regarding Saturn’s transit and Jupiter’s aspect was remarkably accurate.',
      rating: 5,
      service: 'Astrologer Consultation'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 pb-12 border-b border-slate-200">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">100% Verified</p>
              <p className="text-xs text-slate-500">Vedic Scholars & Acharyas</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Lahiri Ayanamsha</p>
              <p className="text-xs text-slate-500">Accurate Sidereal Ephemeris</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Confidential</p>
              <p className="text-xs text-slate-500">100% Private Consultations</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">4.92 / 5.0</p>
              <p className="text-xs text-slate-500">Over 15,000 Happy Seekers</p>
            </div>
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Trusted by Devotees & Families Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Real experiences from seekers who found clarity and spiritual balance with JyotirVeda.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="vedic-card p-6 flex flex-col justify-between space-y-4 bg-white">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-500">{t.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
