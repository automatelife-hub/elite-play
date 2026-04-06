import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Crown, Shield, Star, Zap, Trophy, Award } from 'lucide-react';

const TIER_CONFIG = {
  bronze:   { label: 'Bronze',   color: '#CD7F32', glow: 'rgba(205,127,50,0.5)',   Icon: Shield,  xpRequired: 0,     xpMax: 1000  },
  silver:   { label: 'Silver',   color: '#C0C0C0', glow: 'rgba(192,192,192,0.5)', Icon: Star,    xpRequired: 1000,  xpMax: 5000  },
  gold:     { label: 'Gold',     color: '#F5C842', glow: 'rgba(245,200,66,0.5)',   Icon: Trophy,  xpRequired: 5000,  xpMax: 15000 },
  platinum: { label: 'Platinum', color: '#E5E4E2', glow: 'rgba(229,228,226,0.5)', Icon: Zap,     xpRequired: 15000, xpMax: 30000 },
  elite:    { label: 'Elite',    color: '#C8A951', glow: 'rgba(200,169,81,0.6)',   Icon: Crown,   xpRequired: 30000, xpMax: 50000 },
};

export default function XPProgressBar({ xp = 0, tier = 'bronze', prevXp = null, compact = false }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.bronze;
  const progress = Math.min(((xp - cfg.xpRequired) / (cfg.xpMax - cfg.xpRequired)) * 100, 100);
  const controls = useAnimation();
  const [showGain, setShowGain] = useState(false);
  const [gainAmount, setGainAmount] = useState(0);
  const isGaining = useRef(false);

  useEffect(() => {
    if (prevXp !== null && xp > prevXp && !isGaining.current) {
      isGaining.current = true;
      setGainAmount(xp - prevXp);
      setShowGain(true);
      controls.start({
        boxShadow: [
          `0 0 8px ${cfg.glow}`,
          `0 0 32px ${cfg.glow}`,
          `0 0 64px ${cfg.glow}`,
          `0 0 16px ${cfg.glow}`,
          `0 0 8px ${cfg.glow}`,
        ],
        transition: { duration: 1.2, ease: 'easeInOut' },
      });
      setTimeout(() => {
        setShowGain(false);
        isGaining.current = false;
      }, 2000);
    }
  }, [xp, prevXp]);

  const TierIcon = cfg.Icon;
  const xpToNext = cfg.xpMax - xp;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.color + '22', border: `1px solid ${cfg.color}55` }}
        >
          <TierIcon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span style={{ color: cfg.color }} className="font-semibold">{cfg.label}</span>
            <span className="text-gray-500">{xp.toLocaleString()} XP</span>
          </div>
          <motion.div animate={controls} className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})` }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative select-none">
      <div className="flex items-center gap-3 mb-2">
        {/* Tier icon with glow */}
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.color + '18', border: `1px solid ${cfg.color}44`, boxShadow: `0 0 12px ${cfg.glow}` }}
          animate={{ boxShadow: [`0 0 8px ${cfg.glow}`, `0 0 20px ${cfg.glow}`, `0 0 8px ${cfg.glow}`] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TierIcon className="w-5 h-5" style={{ color: cfg.color }} />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              <span className="text-xs text-gray-500 font-medium">{xp.toLocaleString()} XP</span>
            </div>
            {tier !== 'elite' && (
              <span className="text-xs text-gray-600">{xpToNext.toLocaleString()} to next tier</span>
            )}
          </div>

          {/* XP bar */}
          <motion.div
            animate={controls}
            className="h-2.5 rounded-full overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              style={{ background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})` }}
            >
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* XP gain toast */}
      <AnimatePresence>
        {showGain && (
          <motion.div
            className="absolute -top-8 right-0 text-sm font-bold px-2 py-0.5 rounded-full pointer-events-none"
            style={{ color: cfg.color, background: cfg.color + '22', border: `1px solid ${cfg.color}44` }}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            +{gainAmount.toLocaleString()} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
