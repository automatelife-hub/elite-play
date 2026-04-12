import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Flame, Zap, ChevronLeft, ChevronRight, LayoutGrid, List,
  ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, Minus, Snowflake,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useSlots } from '@/hooks/useSlots';
import LiveRTPTicker from '@/components/intel/LiveRTPTicker';
import SlotCard from '@/components/intel/SlotCard';
import SlotFilters from '@/components/intel/SlotFilters';
import SlotDetailModal from '@/components/intel/SlotDetailModal';

// ─── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 overflow-hidden animate-pulse" style={{ background: '#0D1424' }}>
      <div className="h-36 bg-white/5" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="flex gap-1">
          <div className="h-4 bg-white/5 rounded w-16" />
          <div className="h-4 bg-white/5 rounded w-16" />
        </div>
        <div className="h-8 bg-white/5 rounded" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 px-4 py-3 border-b border-white/5">
      <div className="h-4 bg-white/5 rounded w-5" />
      <div className="h-4 bg-white/5 rounded flex-1" />
      <div className="h-4 bg-white/5 rounded w-24 hidden sm:block" />
      <div className="h-4 bg-white/5 rounded w-16" />
      <div className="h-4 bg-white/5 rounded w-16" />
      <div className="h-4 bg-white/5 rounded w-16 hidden md:block" />
      <div className="h-4 bg-white/5 rounded w-16 hidden lg:block" />
      <div className="h-6 bg-white/5 rounded w-20" />
    </div>
  );
}

// ─── Hot Carousel ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Hot:    { color: '#F5C842', Icon: Flame },
  Normal: { color: '#3B82F6', Icon: Minus },
  Cold:   { color: '#ef4444', Icon: Snowflake },
};

function HotCarouselCard({ slot, onClick }) {
  const cfg = STATUS_CONFIG[slot.status] || STATUS_CONFIG.Normal;
  const delta = (slot.liveRtp - slot.rtp).toFixed(2);
  const up = Number(delta) > 0;
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(slot)}
      className="shrink-0 cursor-pointer rounded-xl border p-3 w-44"
      style={{
        background: 'linear-gradient(145deg, #0D1424, #080C14)',
        borderColor: cfg.color + '40',
        boxShadow: `0 0 16px ${cfg.color}15`,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
        style={{ background: cfg.color + '20' }}
      >
        <cfg.Icon className="w-4 h-4" style={{ color: cfg.color }} />
      </div>
      <div className="text-xs font-bold text-white line-clamp-2 mb-1 leading-tight">{slot.name}</div>
      <div className="text-[10px] text-gray-500 mb-2">{slot.provider}</div>
      <div className="text-base font-bold" style={{ color: cfg.color }}>{slot.liveRtp.toFixed(2)}%</div>
      <div className={`text-[10px] font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        {up ? '+' : ''}{delta}% vs base
      </div>
    </motion.div>
  );
}

// ─── Grid/Table Toggle ────────────────────────────────────────────────────────
function ViewToggle({ view, setView }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-white/10">
      {[{ v: 'grid', Icon: LayoutGrid }, { v: 'table', Icon: List }].map(({ v, Icon }) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={`px-3 py-1.5 transition-all ${
            view === v
              ? 'bg-blue-500/20 text-blue-300'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

// ─── Table Row ───────────────────────────────────────────────────────────────
function TableRow({ slot, rank, onClick }) {
  const cfg = STATUS_CONFIG[slot.status] || STATUS_CONFIG.Normal;
  const delta = (slot.liveRtp - slot.rtp).toFixed(2);
  const up = Number(delta) > 0;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: 'rgba(59,130,246,0.04)' }}
      onClick={() => onClick(slot)}
      className="cursor-pointer border-b border-white/5 transition-colors"
    >
      <td className="px-4 py-3 text-xs text-gray-600 w-8">{rank}</td>
      <td className="px-4 py-3">
        <div className="text-sm font-semibold text-white">{slot.name}</div>
      </td>
      <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">{slot.provider}</td>
      <td className="px-4 py-3 text-sm font-bold text-gray-300">{slot.rtp.toFixed(2)}%</td>
      <td className="px-4 py-3">
        <span className="text-sm font-bold" style={{ color: cfg.color }}>{slot.liveRtp.toFixed(2)}%</span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
          {up ? '+' : ''}{delta}%
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{
              background: i <= (slot.volatility === 'Low' ? 1 : slot.volatility === 'Med' ? 2 : 3)
                ? '#3B82F6' : 'rgba(59,130,246,0.2)'
            }} />
          ))}
          <span className="text-xs text-gray-500 ml-1">{slot.volatility}</span>
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{slot.maxWin.toLocaleString()}x</td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {slot.features.slice(0, 2).map(f => (
            <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15">
              {f}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit"
          style={{ background: cfg.color + '18', color: cfg.color, border: `1px solid ${cfg.color}35` }}
        >
          <cfg.Icon className="w-3 h-3" />
          {slot.status}
        </span>
      </td>
    </motion.tr>
  );
}

// ─── Sort Header Cell ─────────────────────────────────────────────────────────
function SortTh({ children, sortKey: sk, currentSort, currentDir, onSort, className = '' }) {
  const active = currentSort === sk;
  return (
    <th
      onClick={() => onSort(sk)}
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-blue-300 ${
        active ? 'text-blue-400' : 'text-gray-500'
      } ${className}`}
    >
      <div className="flex items-center gap-1">
        {children}
        {active
          ? (currentDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)
          : <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </div>
    </th>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        className="border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              p === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
        className="border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IntelligenceSlots() {
  const [view, setView] = useState('grid');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lastUpdated] = useState(Date.now());
  const carouselRef = useRef(null);

  React.useEffect(() => {
    document.title = "Slot Intelligence Suite — Live RTP Tracker & Hot Slots | Elite Play";
  }, []);

  const {
    slots, hotSlots, tickerSlots, loading,
    filters, updateFilter, resetFilters,
    sortKey, sortDir, handleSort,
    page, setPage, totalPages, totalResults, totalSlots,
    providers,
  } = useSlots({ pageSize: view === 'grid' ? 12 : 15 });

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Page Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.3)' }}>
                <Zap className="w-5 h-5 text-[#F5C842]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Slot Intelligence Hub</h1>
              <Badge className="hidden sm:flex items-center gap-1 text-[10px] font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE DATA
              </Badge>
            </div>
            <p className="text-sm text-gray-500">Real-time RTP tracking across {totalSlots} slots. Updated every 15 min.</p>
          </div>
        </motion.div>

        {/* ── Live RTP Ticker ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <LiveRTPTicker slots={tickerSlots} lastUpdated={lastUpdated} />
        </motion.div>

        {/* ── Hot Slots Today Carousel ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#F5C842]" />
              <span className="text-sm font-bold text-white">Hot Slots Today</span>
              <span className="text-xs text-gray-500">Top 10 by Live RTP</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => scrollCarousel(-1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shrink-0 w-44 h-36 rounded-xl bg-white/5 animate-pulse" />
                ))
              : hotSlots.map((slot, i) => (
                  <HotCarouselCard key={slot.id} slot={slot} onClick={setSelectedSlot} />
                ))
            }
          </div>
        </motion.div>

        {/* ── Filter Bar ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SlotFilters
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            providers={providers}
            totalResults={totalResults}
            totalSlots={totalSlots}
          />
        </motion.div>

        {/* ── View Toggle + Grid/Table ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </span>
            <ViewToggle view={view} setView={setView} />
          </div>

          {/* ── Grid View ── */}
          {view === 'grid' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                {loading
                  ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                  : slots.map(slot => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onClick={setSelectedSlot}
                        affiliateUrl="https://example.com/casino?ref=elite"
                      />
                    ))
                }
              </div>
              {!loading && slots.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Zap className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No slots match your filters.</p>
                </div>
              )}
            </>
          )}

          {/* ── Table View ── */}
          {view === 'table' && (
            <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: '#0D1424' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600 w-8">#</th>
                      <SortTh sortKey="name" currentSort={sortKey} currentDir={sortDir} onSort={handleSort}>Slot</SortTh>
                      <SortTh sortKey="provider" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden sm:table-cell">Provider</SortTh>
                      <SortTh sortKey="rtp" currentSort={sortKey} currentDir={sortDir} onSort={handleSort}>RTP%</SortTh>
                      <SortTh sortKey="liveRtp" currentSort={sortKey} currentDir={sortDir} onSort={handleSort}>Live RTP</SortTh>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600 hidden md:table-cell">Delta</th>
                      <SortTh sortKey="volatility" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden md:table-cell">Volatility</SortTh>
                      <SortTh sortKey="maxWin" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden lg:table-cell">Max Win</SortTh>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600 hidden lg:table-cell">Features</th>
                      <SortTh sortKey="status" currentSort={sortKey} currentDir={sortDir} onSort={handleSort}>Status</SortTh>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 10 }).map((_, i) => <tr key={i}><td colSpan={10}><SkeletonRow /></td></tr>)
                      : slots.map((slot, i) => (
                          <TableRow
                            key={slot.id}
                            slot={slot}
                            rank={(page - 1) * 15 + i + 1}
                            onClick={setSelectedSlot}
                          />
                        ))
                    }
                  </tbody>
                </table>
              </div>
              {!loading && slots.length === 0 && (
                <div className="text-center py-16 text-gray-500 text-sm">No slots match your filters.</div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
        </motion.div>

        {/* ── Affiliate CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-yellow-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.08), rgba(8,12,20,0.8))' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#F5C842]" />
              <h3 className="text-sm font-bold text-white">Play the hottest slots with elite rakeback deals</h3>
            </div>
            <p className="text-xs text-gray-500">Exclusive bonuses negotiated for Elite Play members. Up to 40% rakeback.</p>
          </div>
          <Button
            className="shrink-0 font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #F5C842, #d4a017)', color: '#000' }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Claim Elite Deal
          </Button>
        </motion.div>
      </div>

      {/* ── Slot Detail Modal ── */}
      {selectedSlot && (
        <SlotDetailModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          affiliateUrl="https://example.com/casino?ref=elite"
        />
      )}
    </div>
  );
}
