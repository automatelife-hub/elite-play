import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Target, Zap, Calendar, RefreshCw, CheckCircle2, Clock,
  TrendingUp, Users, DollarSign, Star, Flame, Award
} from 'lucide-react';

const MISSIONS = [
  // Daily
  { id: 'd1', type: 'daily',   icon: Target,     title: 'First Click',         desc: 'Click any affiliate link today',               xp: 50,   progress: 1,  max: 1,  completed: true  },
  { id: 'd2', type: 'daily',   icon: Zap,        title: 'Lightning Login',     desc: 'Log in before 9 AM',                           xp: 25,   progress: 1,  max: 1,  completed: true  },
  { id: 'd3', type: 'daily',   icon: TrendingUp, title: 'Check Stats',         desc: 'View your earnings dashboard',                  xp: 30,   progress: 0,  max: 1,  completed: false },
  { id: 'd4', type: 'daily',   icon: Star,       title: 'Rate a Room',         desc: 'Leave a review for any poker room',             xp: 60,   progress: 0,  max: 1,  completed: false },
  // Weekly
  { id: 'w1', type: 'weekly',  icon: Users,      title: 'Referral Drive',      desc: 'Refer 3 new players this week',                 xp: 300,  progress: 1,  max: 3,  completed: false },
  { id: 'w2', type: 'weekly',  icon: DollarSign, title: 'Commission Chaser',   desc: 'Earn $50+ in affiliate commissions',            xp: 500,  progress: 23, max: 50, completed: false },
  { id: 'w3', type: 'weekly',  icon: Flame,      title: '7-Day Streak',        desc: 'Log in every day this week',                    xp: 400,  progress: 5,  max: 7,  completed: false },
  { id: 'w4', type: 'weekly',  icon: Award,      title: 'Deal Hunter',         desc: 'Claim 2 new affiliate deals',                   xp: 250,  progress: 0,  max: 2,  completed: false },
  // Monthly
  { id: 'm1', type: 'monthly', icon: Trophy,     title: 'Top Earner',          desc: 'Reach top 10 on the monthly leaderboard',       xp: 1500, progress: 0,  max: 1,  completed: false },
  { id: 'm2', type: 'monthly', icon: Users,      title: 'Network Builder',     desc: 'Refer 20 new players this month',               xp: 2000, progress: 7,  max: 20, completed: false },
  { id: 'm3', type: 'monthly', icon: DollarSign, title: 'High Roller',         desc: 'Generate $500 in commissions',                  xp: 3000, progress: 87, max: 500, completed: false },
  { id: 'm4', type: 'monthly', icon: Calendar,   title: 'Consistency King',    desc: 'Log in 25 days this month',                     xp: 1200, progress: 12, max: 25, completed: false },
];

const TYPE_CONFIG = {
  daily:   { label: 'Daily',   color: '#60A5FA', icon: Zap,      resetLabel: 'Resets in 4h' },
  weekly:  { label: 'Weekly',  color: '#F5C842', icon: Calendar, resetLabel: 'Resets in 3d' },
  monthly: { label: 'Monthly', color: '#C8A951', icon: Award,    resetLabel: 'Resets in 18d' },
};

function MissionCard({ mission, onClaim }) {
  const cfg = TYPE_CONFIG[mission.type];
  const pct = Math.min((mission.progress / mission.max) * 100, 100);
  const { icon: MIcon } = mission;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl p-3.5 flex flex-col gap-2.5 relative"
      style={{
        background: mission.completed ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${mission.completed ? cfg.color + '55' : 'rgba(255,255,255,0.07)'}`,
        opacity: mission.completed ? 0.8 : 1,
      }}
    >
      {/* Completed overlay checkmark */}
      {mission.completed && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <CheckCircle2 className="w-4 h-4" style={{ color: cfg.color }} />
        </motion.div>
      )}

      {/* Icon + title */}
      <div className="flex items-start gap-2.5 pr-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.color + '18', border: `1px solid ${cfg.color}33` }}
        >
          <MIcon className="w-4 h-4" style={{ color: cfg.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-white leading-tight">{mission.title}</div>
          <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{mission.desc}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-gray-500">{mission.progress}/{mission.max}</span>
          <span className="font-semibold" style={{ color: cfg.color }}>+{mission.xp} XP</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            style={{ background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})` }}
          />
        </div>
      </div>

      {/* Claim button (when complete but not claimed) */}
      {pct >= 100 && !mission.completed && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onClaim(mission)}
          className="w-full text-[11px] font-bold py-1.5 rounded-lg mt-0.5"
          style={{ background: cfg.color, color: '#080C14' }}
        >
          Claim {mission.xp} XP
        </motion.button>
      )}
    </motion.div>
  );
}

function Trophy({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export default function MissionsCenter() {
  const [tab, setTab] = useState('daily');
  const [missions, setMissions] = useState(MISSIONS);
  const btnRef = useRef(null);

  const filtered = missions.filter(m => m.type === tab);
  const completed = filtered.filter(m => m.completed).length;
  const cfg = TYPE_CONFIG[tab];

  const handleClaim = (mission) => {
    setMissions(prev => prev.map(m => m.id === mission.id ? { ...m, completed: true } : m));

    // Confetti burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: [cfg.color, '#ffffff', '#C8A951'],
    });
  };

  const tabs = ['daily', 'weekly', 'monthly'];

  return (
    <div className="space-y-3">
      {/* Header + tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color: '#F5C842' }} />
          <h3 className="text-sm font-semibold text-white">Missions Center</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: cfg.color + '22', color: cfg.color }}>
            {completed}/{filtered.length} done
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{cfg.resetLabel}</span>
        </div>
      </div>

      {/* Tab row */}
      <div className="flex rounded-lg overflow-hidden border border-white/08 w-fit">
        {tabs.map(t => {
          const tcfg = TYPE_CONFIG[t];
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: tab === t ? tcfg.color + '22' : 'transparent',
                color: tab === t ? tcfg.color : '#6b7280',
                borderRight: t !== 'monthly' ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {tcfg.label}
            </button>
          );
        })}
      </div>

      {/* Mission cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5"
        >
          {filtered.map(m => (
            <MissionCard key={m.id} mission={m} onClaim={handleClaim} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
