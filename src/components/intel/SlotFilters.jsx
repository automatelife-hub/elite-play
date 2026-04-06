import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ALL_FEATURES } from '@/hooks/useSlots';

const VOLATILITY_OPTIONS = ['Low', 'Med', 'High'];

function ToggleChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
        active
          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-semibold'
          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/30 hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function SlotFilters({ filters, updateFilter, resetFilters, providers, totalResults, totalSlots }) {
  const [open, setOpen] = useState(false);

  const activeFilterCount = [
    filters.providers.length > 0,
    filters.volatility.length > 0,
    filters.features.length > 0,
    filters.rtpRange[0] !== 80 || filters.rtpRange[1] !== 99,
  ].filter(Boolean).length;

  const toggleArrayFilter = (key, value) => {
    const arr = filters[key];
    updateFilter(key, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0D1424] overflow-hidden">
      {/* Search bar + toggle row */}
      <div className="flex items-center gap-3 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search slots or providers..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
            open || activeFilterCount > 0
              ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/30'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="px-3 pb-2 text-xs text-gray-500">
        Showing <span className="text-white font-semibold">{totalResults}</span> of <span className="text-white font-semibold">{totalSlots}</span> slots
      </div>

      {/* Expanded filter panel */}
      {open && (
        <div className="border-t border-white/5 p-4 space-y-4">
          {/* Provider multi-select */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Provider</div>
            <div className="flex flex-wrap gap-1.5">
              {providers.map(p => (
                <ToggleChip
                  key={p}
                  label={p}
                  active={filters.providers.includes(p)}
                  onClick={() => toggleArrayFilter('providers', p)}
                />
              ))}
            </div>
          </div>

          {/* RTP Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">RTP Range</span>
              <span className="text-xs text-blue-300 font-semibold">
                {filters.rtpRange[0]}% – {filters.rtpRange[1]}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">80%</span>
              <div className="relative flex-1 h-1.5 rounded-full bg-white/10">
                <div
                  className="absolute top-0 h-full rounded-full bg-blue-500"
                  style={{
                    left: `${((filters.rtpRange[0] - 80) / 19) * 100}%`,
                    width: `${((filters.rtpRange[1] - filters.rtpRange[0]) / 19) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={80}
                  max={99}
                  step={0.5}
                  value={filters.rtpRange[0]}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    if (v < filters.rtpRange[1]) updateFilter('rtpRange', [v, filters.rtpRange[1]]);
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  style={{ zIndex: 2 }}
                />
                <input
                  type="range"
                  min={80}
                  max={99}
                  step={0.5}
                  value={filters.rtpRange[1]}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    if (v > filters.rtpRange[0]) updateFilter('rtpRange', [filters.rtpRange[0], v]);
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  style={{ zIndex: 2 }}
                />
              </div>
              <span className="text-xs text-gray-600">99%</span>
            </div>
          </div>

          {/* Volatility */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Volatility</div>
            <div className="flex gap-2">
              {VOLATILITY_OPTIONS.map(v => (
                <ToggleChip
                  key={v}
                  label={v}
                  active={filters.volatility.includes(v)}
                  onClick={() => toggleArrayFilter('volatility', v)}
                />
              ))}
            </div>
          </div>

          {/* Feature Tags */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Features</div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_FEATURES.map(f => (
                <ToggleChip
                  key={f}
                  label={f}
                  active={filters.features.includes(f)}
                  onClick={() => toggleArrayFilter('features', f)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
