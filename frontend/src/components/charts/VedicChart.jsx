import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';

const PLANET_ABBR = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke'
};

export default function VedicChart({ d1Chart = [], d9Chart = [], title = "Vedic Birth Chart" }) {
  const [chartType, setChartType] = useState('d1'); // 'd1' or 'd9'
  const [style, setStyle] = useState('north'); // 'north' or 'south'
  const [selectedHouse, setSelectedHouse] = useState(null);

  const activeChart = chartType === 'd1' ? d1Chart : d9Chart;

  // Helper to get house data
  const getHouse = (num) => {
    return activeChart.find(h => h.house === num) || { house: num, signNumber: num, planets: [] };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-orange-700 font-medium">
              {chartType === 'd1' ? 'D1 Rashi Chart (Physical & Karmic)' : 'D9 Navamsha Chart (Spiritual & Destiny)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* D1 / D9 Switcher */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setChartType('d1')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                chartType === 'd1' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              D1 (Rashi)
            </button>
            <button
              onClick={() => setChartType('d9')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                chartType === 'd9' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              D9 (Navamsha)
            </button>
          </div>

          {/* North / South Style Switcher */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setStyle('north')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                style === 'north' ? 'bg-indigo-700 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              North Indian
            </button>
            <button
              onClick={() => setStyle('south')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                style === 'south' ? 'bg-indigo-700 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              South Indian
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas / SVG Container */}
      <div className="flex flex-col items-center justify-center p-2 bg-[#FFFDF9] rounded-xl border border-orange-100">
        {style === 'north' ? (
          <div className="relative w-full max-w-[420px] aspect-square">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm select-none">
              {/* Outer boundary */}
              <rect x="10" y="10" width="380" height="380" fill="#FFFDF9" stroke="#EA580C" strokeWidth="2.5" rx="6" />

              {/* Diagonal X lines */}
              <line x1="10" y1="10" x2="390" y2="390" stroke="#C2410C" strokeWidth="1.5" strokeOpacity="0.85" />
              <line x1="390" y1="10" x2="10" y2="390" stroke="#C2410C" strokeWidth="1.5" strokeOpacity="0.85" />

              {/* Inner Diamond (Kendra) */}
              <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#C2410C" strokeWidth="1.8" />

              {/* House 1 (Top Diamond) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(1))}>
                <text x="200" y="55" fill="#C2410C" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {getHouse(1).signNumber}
                </text>
                <text x="200" y="32" fill="#1E3A8A" fontSize="11" fontWeight="700" textAnchor="middle">
                  Lagna (1)
                </text>
                <text x="200" y="90" fill="#1E3A8A" fontSize="14" fontWeight="800" textAnchor="middle">
                  {getHouse(1).planets.map(p => PLANET_ABBR[p] || p).join('  ')}
                </text>
              </g>

              {/* House 2 (Top Left Upper Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(2))}>
                <text x="135" y="45" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(2).signNumber}</text>
                <text x="110" y="80" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(2).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 12 (Top Right Upper Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(12))}>
                <text x="265" y="45" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(12).signNumber}</text>
                <text x="290" y="80" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(12).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 4 (Left Diamond) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(4))}>
                <text x="80" y="195" fill="#C2410C" fontSize="12" fontWeight="bold" textAnchor="middle">{getHouse(4).signNumber}</text>
                <text x="105" y="200" fill="#1E3A8A" fontSize="14" fontWeight="800" textAnchor="middle">
                  {getHouse(4).planets.map(p => PLANET_ABBR[p] || p).join('  ')}
                </text>
              </g>

              {/* House 3 (Left Upper Outer Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(3))}>
                <text x="45" y="135" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(3).signNumber}</text>
                <text x="75" y="120" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(3).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 5 (Left Lower Outer Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(5))}>
                <text x="45" y="265" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(5).signNumber}</text>
                <text x="75" y="280" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(5).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 7 (Bottom Diamond) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(7))}>
                <text x="200" y="345" fill="#C2410C" fontSize="12" fontWeight="bold" textAnchor="middle">{getHouse(7).signNumber}</text>
                <text x="200" y="310" fill="#1E3A8A" fontSize="14" fontWeight="800" textAnchor="middle">
                  {getHouse(7).planets.map(p => PLANET_ABBR[p] || p).join('  ')}
                </text>
              </g>

              {/* House 6 (Bottom Left Lower Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(6))}>
                <text x="135" y="355" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(6).signNumber}</text>
                <text x="110" y="320" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(6).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 8 (Bottom Right Lower Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(8))}>
                <text x="265" y="355" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(8).signNumber}</text>
                <text x="290" y="320" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(8).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 10 (Right Diamond) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(10))}>
                <text x="320" y="195" fill="#C2410C" fontSize="12" fontWeight="bold" textAnchor="middle">{getHouse(10).signNumber}</text>
                <text x="295" y="200" fill="#1E3A8A" fontSize="14" fontWeight="800" textAnchor="middle">
                  {getHouse(10).planets.map(p => PLANET_ABBR[p] || p).join('  ')}
                </text>
              </g>

              {/* House 11 (Right Upper Outer Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(11))}>
                <text x="355" y="135" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(11).signNumber}</text>
                <text x="325" y="120" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(11).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>

              {/* House 9 (Right Lower Outer Triangle) */}
              <g className="cursor-pointer hover:opacity-80" onClick={() => setSelectedHouse(getHouse(9))}>
                <text x="355" y="265" fill="#C2410C" fontSize="11" fontWeight="bold" textAnchor="middle">{getHouse(9).signNumber}</text>
                <text x="325" y="280" fill="#1E3A8A" fontSize="13" fontWeight="800" textAnchor="middle">
                  {getHouse(9).planets.map(p => PLANET_ABBR[p] || p).join(' ')}
                </text>
              </g>
            </svg>
          </div>
        ) : (
          /* South Indian Box Chart */
          <div className="w-full max-w-[420px] aspect-square grid grid-cols-4 grid-rows-4 gap-1 p-2 bg-orange-50/50 border-2 border-orange-500/50 rounded-xl">
            {(() => {
              const cellMap = [
                { r: 0, c: 0, sign: 12 }, { r: 0, c: 1, sign: 1 }, { r: 0, c: 2, sign: 2 }, { r: 0, c: 3, sign: 3 },
                { r: 1, c: 0, sign: 11 }, { center: true }, { center: true }, { r: 1, c: 3, sign: 4 },
                { r: 2, c: 0, sign: 10 }, { center: true }, { center: true }, { r: 2, c: 3, sign: 5 },
                { r: 3, c: 0, sign: 9 }, { r: 3, c: 1, sign: 8 }, { r: 3, c: 2, sign: 7 }, { r: 3, c: 3, sign: 6 }
              ];

              return cellMap.map((cell, idx) => {
                if (cell.center) {
                  if (idx === 5) {
                    return (
                      <div key={idx} className="col-span-2 row-span-2 bg-white border border-orange-200 flex flex-col items-center justify-center p-2 text-center rounded-lg shadow-xs">
                        <Sparkles className="w-5 h-5 text-orange-600 mb-1" />
                        <span className="text-xs font-serif font-bold text-slate-900">JyotirVeda</span>
                        <span className="text-[10px] text-orange-700 font-semibold uppercase tracking-wider">{chartType.toUpperCase()} Chart</span>
                      </div>
                    );
                  }
                  return null;
                }

                const houseObj = activeChart.find(h => h.signNumber === cell.sign) || { house: '', planets: [] };

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHouse(houseObj)}
                    className="p-1.5 bg-white border border-orange-200/90 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer flex flex-col justify-between transition-colors min-h-[70px] rounded-md shadow-2xs"
                  >
                    <div className="flex justify-between items-center text-[10px] text-orange-700 font-bold">
                      <span>{cell.sign}</span>
                      {houseObj.house && <span className="text-slate-500 font-normal">H{houseObj.house}</span>}
                    </div>
                    <div className="text-[11px] font-bold text-indigo-900 flex flex-wrap gap-1">
                      {houseObj.planets?.map(p => (
                        <span key={p} className="bg-orange-100/80 text-indigo-950 px-1 py-0.5 rounded text-[10px] font-bold">{PLANET_ABBR[p] || p}</span>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Selected House Detail Banner */}
      {selectedHouse && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-orange-800 font-bold mr-1.5">House {selectedHouse.house} ({selectedHouse.sign || `Sign ${selectedHouse.signNumber}`}):</span>
            <span className="text-slate-700">
              {selectedHouse.planets?.length > 0 ? `Occupants: ${selectedHouse.planets.join(', ')}` : 'No resident planets'}
            </span>
          </div>
          <button onClick={() => setSelectedHouse(null)} className="text-slate-500 hover:text-slate-800 ml-2 font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Chart Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-600">
        <span><strong className="text-orange-700">Su</strong> = Surya (Sun)</span>
        <span><strong className="text-orange-700">Mo</strong> = Chandra (Moon)</span>
        <span><strong className="text-orange-700">Ma</strong> = Mangal (Mars)</span>
        <span><strong className="text-orange-700">Me</strong> = Budha (Mercury)</span>
        <span><strong className="text-orange-700">Ju</strong> = Guru (Jupiter)</span>
        <span><strong className="text-orange-700">Ve</strong> = Shukra (Venus)</span>
        <span><strong className="text-orange-700">Sa</strong> = Shani (Saturn)</span>
        <span><strong className="text-orange-700">Ra</strong> = Rahu</span>
        <span><strong className="text-orange-700">Ke</strong> = Ketu</span>
      </div>
    </div>
  );
}
