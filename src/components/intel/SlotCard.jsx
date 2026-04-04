import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Minus, ExternalLink, Play, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  Hot:    { color: '#F5C842', bg: 'rgba(245,200,66,0.12)', border: 'rgba(245,200,66,0.35)', Icon: Flame,    label: 'HOT' },
  Normal: { color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)', Icon: Minus,    label: 'NORMAL' },
  Cold:   { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  Icon: Snowflake, label: 'COLD' },
};

const VOLATILITY_DOTS = { Low: 1, Med: 2, High: 3 };

function VolatilityDots({ level }) {
  const count = VOLATILITY_DOTS[level] || 2;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: i <= count ? '#3B82F6' : 'rgba(59,130,246,0.2)' }}
        />
      ))}
      <span className="text-[10px] text-gray-500 ml-1">{level}</span>
    </div>
  );
}

export default function SlotCard({ slot, onClick, affiliateUrl }) {
  const cfg = STATUS_CONFIG[slot.status] || STATUS_CONFIG.Normal;
  const { Icon } = cfg;
  const rtpDelta = (slot.liveRtp - slot.rtp).toFixed(2);
  const deltaUp = rtpDelta > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      onClick={() => onClick?.(slot)}
      className="cursor-pointer rounded-xl border overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, #0D1424 0%, #080C14 100%)',
        borderColor: cfg.border,
        boxShadow: `0 0 0 1px ${cfg.border}, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Status glow bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }}
      />

      {/* Thumbnail */}
      <div
        className="relative h-36 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0D1424, #141E35)' }}
      >
        {slot.thumbnail ? (
          <img src={slot.thumbnail} alt={slot.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <Zap className="w-10 h-10" style={{ color: cfg.color }} />
          </div>
        )}
        {/* RTP Badge overlay */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 rounded-md px-2 py-0.5"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <Icon className="w-3 h-3" style={{ color: cfg.color }} />
          <span className="text-xs font-bold" style={{ color: cfg.color }}>
            {slot.liveRtp.toFixed(2)}%
          </span>
        </div>
        {/* Provider badge */}
        <div className="absolute bottom-2 left-2 rounded px-2 py-0.5 text-[10px] text-gray-400 bg-black/60 backdrop-blur-sm border border-white/5">
          {slot.provider}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">{slot.name}</h3>
          <span
            className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <VolatilityDots level={slot.volatility} />
          <span className={`font-semibold ${deltaUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {deltaUp ? '+' : ''}{rtpDelta}% vs base
          </span>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1">
          {slot.features.slice(0, 3).map(f => (
            <span
              key={f}
              className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Max Win */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
          <span className="text-gray-500">Max Win</span>
          <span className="text-white font-semibold">{slot.maxWin.toLocaleString()}x</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-[11px] border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
            onClick={e => { e.stopPropagation(); onClick?.(slot); }}
          >
            <Play className="w-3 h-3 mr-1" />
            Demo
          </Button>
          <Button
            size="sm"
            className="flex-1 h-7 text-[11px] font-bold"
            style={{ background: 'linear-gradient(135deg, #F5C842, #d4a017)', color: '#000' }}
            onClick={e => {
              e.stopPropagation();
              if (affiliateUrl) window.open(affiliateUrl, '_blank');
            }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Play
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
