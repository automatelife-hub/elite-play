import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy, Star, Zap, Flame, Shield, Crown, Target, TrendingUp,
  Users, DollarSign, Award, Lock, Globe, Swords, Rocket, Eye,
  Heart, Clock, BarChart3, CheckCircle2, Sparkles, Gift, Medal
} from 'lucide-react';

const BADGES = [
  // Earned
  { id: 'b01', icon: Star,       color: '#F5C842', rarity: 'common',    label: 'First Steps',       desc: 'Create your Elite Play account',     earned: true  },
  { id: 'b02', icon: Target,     color: '#60A5FA', rarity: 'common',    label: 'First Link',        desc: 'Click your first affiliate link',    earned: true  },
  { id: 'b03', icon: DollarSign, color: '#34D399', rarity: 'common',    label: 'First Dollar',      desc: 'Earn your first $1 in commissions',  earned: true  },
  { id: 'b04', icon: Flame,      color: '#F97316', rarity: 'uncommon',  label: '7-Day Streak',      desc: 'Log in 7 days in a row',             earned: true  },
  { id: 'b05', icon: Users,      color: '#A78BFA', rarity: 'uncommon',  label: 'Recruiter',         desc: 'Refer your first player',            earned: true  },
  { id: 'b06', icon: Shield,     color: '#CD7F32', rarity: 'common',    label: 'Bronze Initiate',   desc: 'Reach Bronze tier',                  earned: true  },
  // Locked
  { id: 'b07', icon: Star,       color: '#C0C0C0', rarity: 'uncommon',  label: 'Silver Ascent',     desc: 'Reach Silver tier (1000 XP)',        earned: false },
  { id: 'b08', icon: Trophy,     color: '#F5C842', rarity: 'rare',      label: 'Gold Rush',         desc: 'Reach Gold tier (5000 XP)',          earned: false },
  { id: 'b09', icon: Zap,        color: '#E5E4E2', rarity: 'epic',      label: 'Platinum Storm',    desc: 'Reach Platinum tier (15000 XP)',     earned: false },
  { id: 'b10', icon: Crown,      color: '#C8A951', rarity: 'legendary', label: 'Elite Overlord',    desc: 'Reach Elite tier (30000 XP)',        earned: false },
  { id: 'b11', icon: Swords,     color: '#F43F5E', rarity: 'rare',      label: 'Shark Tank',        desc: 'Recruit 10 active players',          earned: false },
  { id: 'b12', icon: Globe,      color: '#06B6D4', rarity: 'rare',      label: 'Global Reach',      desc: 'Refer players from 5 countries',     earned: false },
  { id: 'b13', icon: Rocket,     color: '#8B5CF6', rarity: 'epic',      label: 'Rocket Affiliate',  desc: 'Earn $1000 in a single month',       earned: false },
  { id: 'b14', icon: Flame,      color: '#EF4444', rarity: 'epic',      label: 'On Fire',           desc: 'Maintain a 30-day login streak',     earned: false },
  { id: 'b15', icon: BarChart3,  color: '#10B981', rarity: 'uncommon',  label: 'Data Driven',       desc: 'View analytics 20 days in a row',    earned: false },
  { id: 'b16', icon: Heart,      color: '#EC4899', rarity: 'common',    label: 'Community Love',    desc: 'Leave 5 reviews',                    earned: false },
  { id: 'b17', icon: Clock,      color: '#F59E0B', rarity: 'rare',      label: 'Night Owl',         desc: 'Log in after midnight 10 times',     earned: false },
  { id: 'b18', icon: Medal,      color: '#C8A951', rarity: 'epic',      label: 'Top 10',            desc: 'Reach top 10 on the leaderboard',    earned: false },
  { id: 'b19', icon: Sparkles,   color: '#7C3AED', rarity: 'legendary', label: 'Shooting Star',     desc: 'Earn 5000 XP in a single week',      earned: false },
  { id: 'b20', icon: Gift,       color: '#F97316', rarity: 'uncommon',  label: 'Deal Maker',        desc: 'Claim 10 affiliate deals',           earned: false },
  { id: 'b21', icon: Eye,        color: '#0EA5E9', rarity: 'common',    label: 'Explorer',          desc: 'Visit 10 different pages',           earned: false },
  { id: 'b22', icon: CheckCircle2, color: '#22C55E', rarity: 'uncommon', label: 'Mission Master',  desc: 'Complete 50 missions',               earned: false },
  { id: 'b23', icon: TrendingUp, color: '#F5C842', rarity: 'rare',      label: 'Bull Market',       desc: 'Increase commissions 3 months straight', earned: false },
  { id: 'b24', icon: Award,      color: '#A78BFA', rarity: 'legendary', label: 'Legend',            desc: 'Earn all other badges',              earned: false },
];

const RARITY_CONFIG = {
  common:    { label: 'Common',    color: '#9CA3AF', glow: 'rgba(156,163,175,0.2)' },
  uncommon:  { label: 'Uncommon',  color: '#34D399', glow: 'rgba(52,211,153,0.25)' },
  rare:      { label: 'Rare',      color: '#60A5FA', glow: 'rgba(96,165,250,0.3)'  },
  epic:      { label: 'Epic',      color: '#A78BFA', glow: 'rgba(167,139,250,0.35)'},
  legendary: { label: 'Legendary', color: '#F5C842', glow: 'rgba(245,200,66,0.4)'  },
};

function BadgeCard({ badge, onClick }) {
  const rCfg = RARITY_CONFIG[badge.rarity];
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      whileHover={{ scale: badge.earned ? 1.08 : 1.04, y: badge.earned ? -2 : 0 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(badge)}
      className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer"
      style={{
        background: badge.earned ? badge.color + '12' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${badge.earned ? badge.color + '40' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: badge.earned ? `0 0 12px ${rCfg.glow}` : 'none',
        filter: badge.earned ? 'none' : 'grayscale(1)',
      }}
    >
      {/* Rarity dot */}
      <div
        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
        style={{ background: rCfg.color, boxShadow: `0 0 4px ${rCfg.color}` }}
      />

      {/* Badge icon */}
      <motion.div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: badge.earned ? badge.color + '22' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${badge.earned ? badge.color + '55' : 'rgba(255,255,255,0.08)'}`,
        }}
        animate={badge.earned ? {
          boxShadow: [`0 0 4px ${badge.color}40`, `0 0 16px ${badge.color}60`, `0 0 4px ${badge.color}40`]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {badge.earned ? (
          <BadgeIcon className="w-4.5 h-4.5" style={{ color: badge.color }} />
        ) : (
          <Lock className="w-3.5 h-3.5 text-gray-700" />
        )}
      </motion.div>

      <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: badge.earned ? '#e5e7eb' : '#4b5563' }}>
        {badge.label}
      </span>
    </motion.div>
  );
}

function BadgeModal({ badge, onClose }) {
  if (!badge) return null;
  const rCfg = RARITY_CONFIG[badge.rarity];
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} />
      <motion.div
        className="relative rounded-2xl p-6 max-w-xs w-full text-center"
        style={{
          background: '#0D1424',
          border: `1px solid ${badge.earned ? badge.color + '50' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: badge.earned ? `0 0 40px ${rCfg.glow}` : 'none',
        }}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: badge.earned ? badge.color + '22' : 'rgba(255,255,255,0.04)',
            border: `2px solid ${badge.earned ? badge.color + '55' : 'rgba(255,255,255,0.1)'}`,
            filter: badge.earned ? 'none' : 'grayscale(1)',
          }}
          animate={badge.earned ? {
            boxShadow: [`0 0 10px ${badge.color}40`, `0 0 30px ${badge.color}70`, `0 0 10px ${badge.color}40`]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {badge.earned ? (
            <BadgeIcon className="w-8 h-8" style={{ color: badge.color }} />
          ) : (
            <Lock className="w-8 h-8 text-gray-600" />
          )}
        </motion.div>

        <div className="text-[10px] font-bold mb-1 px-2 py-0.5 rounded-full inline-block" style={{ background: rCfg.color + '22', color: rCfg.color }}>
          {rCfg.label}
        </div>
        <h3 className="text-base font-bold text-white mt-2 mb-1">{badge.label}</h3>
        <p className="text-xs text-gray-400">{badge.desc}</p>

        {badge.earned && (
          <motion.div
            className="mt-3 text-xs font-semibold flex items-center justify-center gap-1"
            style={{ color: badge.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Unlocked
          </motion.div>
        )}
        {!badge.earned && (
          <div className="mt-3 text-xs text-gray-600">Complete the requirement to unlock this badge</div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function BadgesGallery() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const earned = BADGES.filter(b => b.earned).length;

  const filtered = filter === 'all' ? BADGES
    : filter === 'earned' ? BADGES.filter(b => b.earned)
    : filter === 'locked' ? BADGES.filter(b => !b.earned)
    : BADGES.filter(b => b.rarity === filter);

  const handleClick = (badge) => {
    setSelected(badge);
    if (badge.earned) {
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 }, colors: [badge.color, '#ffffff'] });
    }
  };

  const filters = [
    { key: 'all',       label: 'All' },
    { key: 'earned',    label: `Earned (${earned})` },
    { key: 'locked',    label: 'Locked' },
    { key: 'legendary', label: 'Legendary' },
    { key: 'epic',      label: 'Epic' },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" style={{ color: '#F5C842' }} />
          <h3 className="text-sm font-semibold text-white">Achievements</h3>
          <span className="text-[10px] text-gray-500">{earned}/{BADGES.length} unlocked</span>
        </div>
        {/* Filter chips */}
        <div className="flex items-center gap-1 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all"
              style={{
                background: filter === f.key ? 'rgba(245,200,66,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === f.key ? '#F5C842' : '#6b7280',
                border: `1px solid ${filter === f.key ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badge grid */}
      <motion.div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((badge, i) => (
            <motion.div
              key={badge.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
            >
              <BadgeCard badge={badge} onClick={handleClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Badge detail modal */}
      <AnimatePresence>
        {selected && <BadgeModal badge={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
