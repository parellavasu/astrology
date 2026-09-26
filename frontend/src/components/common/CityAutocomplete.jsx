import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function CityAutocomplete({ value, onChange, onSelectCity, placeholder = "Enter Birth City (e.g. New Delhi, Mumbai)", error }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const res = await api.get(`/cities/search?q=${encodeURIComponent(query)}`);
          if (res.data.success) {
            setSuggestions(res.data.cities || []);
            setIsOpen(true);
          }
        } catch (err) {
          console.error('City search error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city) => {
    const formatted = `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`;
    setQuery(formatted);
    onChange(formatted);
    if (onSelectCity) {
      onSelectCity(city);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-600">
          <MapPin className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border ${
            error ? 'border-rose-500' : 'border-slate-300 focus:border-orange-500'
          } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs transition-all duration-200`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-orange-600" /> : <Search className="w-4 h-4 opacity-50" />}
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl py-1 divide-y divide-slate-100">
          {suggestions.map((city, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(city)}
              className="px-3.5 py-2.5 hover:bg-orange-50/80 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="text-sm font-medium text-slate-800 group-hover:text-orange-950">
                  {city.name}
                  <span className="text-xs text-slate-500 font-normal ml-1.5">
                    ({city.state ? `${city.state}, ` : ''}{city.country})
                  </span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {city.lat > 0 ? `${city.lat.toFixed(2)}°N` : `${Math.abs(city.lat).toFixed(2)}°S`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
