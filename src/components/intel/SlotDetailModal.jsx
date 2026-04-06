import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Flame, Snowflake, Minus, ExternalLink, TrendingUp, TrendingDown,
  Zap, BarChart3, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const STATUS_CONFIG = {
  Hot:    { color: '#F5C842', bg: 'rgba(245,200,66,0.12)', border: 'rgba(245,200,66,0.35)', Icon: Flame,    label: 'HOT',    desc: 'Live RTP significantly above base — unusually generous right now.' },
  Normal: { color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)', Icon: Minus,    label: 'NORMAL', desc: 'Live RTP tracking close to advertised base rate.' },
  Cold:   { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  Icon: Snowflake, label: 'COLD',   desc: 'Live RTP below base — the slot is paying out less than average.' },
};

const DAYS = ['7d ago', '6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Today'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-blue-500/20 bg-[#0D1424] px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-blue-300 font-bold">{payload[0].value.toFixed(2)}% RTP</p>
    </div>
  );
}

export default function SlotDetailModal({ slot, onClose, affiliateUrl }) {
  if (!slot) return null;

  const cfg = STATUS_CONFIG[slot.status] || STATUS_CONFIG.Normal;
  const { Icon } = cfg;
  const rtpDelta = (slot.liveRtp - slot.rtp).toFixed(2);
  const deltaUp = Number(rtpDelta) > 0;

  const chartData = slot.rtpHistory.map((v, i) => ({ day: DAYS[i], rtp: v }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border"
          style={{
            background: 'linear-gradient(145deg, #0D1424 0%, #080C14 100%)',
            borderColor: cfg.border,
            boxShadow: `0 0 0 1px ${cfg.border}, 0 32px 80px rgba(0,0,0,0.7)`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-white/5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                >
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-500">{slot.provider}</span>
              </div>
              <h2 className="text-xl font-bold text-white truncate">{slot.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Key stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Live RTP', value: `${slot.liveRtp.toFixed(2)}%`, color: cfg.color },
                { label: 'Base RTP', value: `${slot.rtp.toFixed(2)}%`, color: '#94a3b8' },
                { label: 'Delta', value: `${deltaUp ? '+' : ''}${rtpDelta}%`, color: deltaUp ? '#34d399' : '#f87171' },
                { label: 'Max Win', value: `${slot.maxWin.toLocaleString()}x`, color: '#F5C842' },
              ].map(stat => (
                <div key={stat.label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Status explanation */}
            <div
              className="flex items-start gap-3 rounded-lg p-3"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
              <p className="text-sm" style={{ color: cfg.color }}>{cfg.desc}</p>
            </div>

            {/* RTP 7-day chart */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">7-Day RTP Trend</span>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={slot.rtp} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" label={{ value: 'Base', fill: '#4b5563', fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="rtp"
                      stroke={cfg.color}
                      strokeWidth={2}
                      dot={{ fill: cfg.color, r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: cfg.color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Volatility
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map(i => {
                    const filled = i <= (slot.volatility === 'Low' ? 1 : slot.volatility === 'Med' ? 2 : 3);
                    return (
                      <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: filled ? '#3B82F6' : 'rgba(59,130,246,0.15)' }} />
                    );
                  })}
                  <span className="text-xs text-white ml-1">{slot.volatility}</span>
                </div>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xs text-gray-500 mb-2">Features</div>
                <div className="flex flex-wrap gap-1">
                  {slot.features.map(f => (
                    <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              className="w-full h-11 font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #F5C842, #d4a017)', color: '#000' }}
              onClick={() => affiliateUrl && window.open(affiliateUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Play at Casino →
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
