import React from 'react';
import { Flame, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function MiniRtpBar({ rtp, baseRtp }) {
  const pct = Math.max(0, Math.min(100, ((rtp - 80) / 20) * 100));
  const delta = rtp - baseRtp;
  const isHot = delta > 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: isHot ? 'linear-gradient(90deg, #F5C842, #ff9f0a)' : 'linear-gradient(90deg, #3B82F6, #60a5fa)' }}
        />
      </div>
      <span className="text-xs font-bold w-12 text-right" style={{ color: isHot ? '#F5C842' : '#60a5fa' }}>
        {rtp.toFixed(1)}%
      </span>
    </div>
  );
}

export default function HotSlotsWidget({ slots = [], onSlotClick }) {
  const topSlots = slots.slice(0, 3);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0D1424, #080C14)', borderColor: 'rgba(245,200,66,0.2)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'rgba(245,200,66,0.1)', background: 'rgba(245,200,66,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#F5C842]" />
          <span className="text-sm font-bold text-white">Hot Slots Now</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <Link
          to={createPageUrl('IntelligenceSlots')}
          className="flex items-center gap-0.5 text-[11px] text-[#F5C842] hover:text-yellow-300 transition-colors"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Slot list */}
      <div className="p-3 space-y-2">
        {topSlots.map((slot, i) => (
          <motion.button
            key={slot.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSlotClick?.(slot)}
            className="w-full text-left rounded-lg p-2.5 hover:bg-white/5 transition-all group"
            style={{ border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 text-[10px] font-bold"
                  style={{ background: 'rgba(245,200,66,0.15)', color: '#F5C842' }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-white truncate group-hover:text-[#F5C842] transition-colors">
                  {slot.name}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-[#F5C842] transition-colors shrink-0" />
            </div>
            <MiniRtpBar rtp={slot.liveRtp} baseRtp={slot.rtp} />
            <div className="text-[10px] text-gray-600 mt-1">{slot.provider}</div>
          </motion.button>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-3 pb-3">
        <Link to={createPageUrl('IntelligenceSlots')}>
          <button
            className="w-full py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.08))',
              border: '1px solid rgba(245,200,66,0.25)',
              color: '#F5C842',
            }}
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Slot Intelligence Hub
          </button>
        </Link>
      </div>
    </div>
  );
}
