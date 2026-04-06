import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function RtpDelta({ slot }) {
  const delta = (slot.liveRtp - slot.rtp).toFixed(2);
  const isUp = delta > 0;
  return (
    <div className="flex items-center gap-3 px-6 py-2 shrink-0 border-r border-white/5">
      <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{slot.name}</span>
      <span className="text-xs text-gray-400">{slot.provider}</span>
      <span className={`text-sm font-bold ${slot.status === 'Hot' ? 'text-[#F5C842]' : slot.status === 'Cold' ? 'text-red-400' : 'text-blue-400'}`}>
        {slot.liveRtp.toFixed(2)}%
      </span>
      <span className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isUp ? '+' : ''}{delta}%
      </span>
    </div>
  );
}

export default function LiveRTPTicker({ slots = [], lastUpdated }) {
  const trackRef = useRef(null);
  const [tickerWidth, setTickerWidth] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      setTickerWidth(trackRef.current.scrollWidth / 2);
    }
  }, [slots]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setMinutes(Math.floor((Date.now() - lastUpdated) / 60000));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (!slots.length) return null;

  const doubled = [...slots, ...slots]; // seamless loop

  return (
    <div className="relative overflow-hidden rounded-lg border border-blue-500/20 bg-[#0D1424]" style={{ height: 44 }}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0D1424, transparent)' }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0D1424, transparent)' }} />

      {/* "LIVE RTP" label */}
      <div className="absolute left-0 top-0 h-full flex items-center z-20 px-3 bg-[#0D1424] border-r border-blue-500/20">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Live RTP</span>
        </div>
      </div>

      {/* Scrolling track */}
      <motion.div
        ref={trackRef}
        className="flex items-center h-full pl-24"
        animate={{ x: tickerWidth > 0 ? [-0, -tickerWidth] : 0 }}
        transition={{
          duration: tickerWidth / 40,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {doubled.map((slot, i) => (
          <RtpDelta key={`${slot.id}-${i}`} slot={slot} />
        ))}
      </motion.div>

      {/* Timestamp */}
      <div className="absolute right-0 top-0 h-full flex items-center z-20 px-3 bg-[#0D1424] border-l border-blue-500/20">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{minutes > 0 ? `${minutes}m ago` : 'just now'}</span>
        </div>
      </div>
    </div>
  );
}
