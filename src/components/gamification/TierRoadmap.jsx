import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Trophy, Zap, Crown, Check, Lock, ChevronRight } from 'lucide-react';

const TIERS = [
  {
    key: 'bronze',
    label: 'Bronze',
    color: '#CD7F32',
    bg: 'rgba(205,127,50,0.08)',
    border: 'rgba(205,127,50,0.3)',
    glow: 'rgba(205,127,50,0.25)',
    Icon: Shield,
    xpRequired: 0,
    rewards: [
      'Basic dashboard access',
      'Affiliate tracking links',
      'Weekly XP missions',
      'Community leaderboard',
    ],
  },
  {
    key: 'silver',
    label: 'Silver',
    color: '#C0C0C0',
    bg: 'rgba(192,192,192,0.08)',
    border: 'rgba(192,192,192,0.3)',
    glow: 'rgba(192,192,192,0.2)',
    Icon: Star,
    xpRequired: 1000,
    rewards: [
      'Enhanced analytics suite',
      'Priority support (24h SLA)',
      'Exclusive Silver deals',
      'Daily bonus missions',
    ],
  },
  {
    key: 'gold',
    label: 'Gold',
    color: '#F5C842',
    bg: 'rgba(245,200,66,0.08)',
    border: 'rgba(245,200,66,0.35)',
    glow: 'rgba(245,200,66,0.3)',
    Icon: Trophy,
    xpRequired: 5000,
    rewards: [
      'Exclusive operator deals',
      'Early access to new rooms',
      'Dark Coins 2× multiplier',
      'Custom bonus codes',
    ],
  },
  {
    key: 'platinum',
    label: 'Platinum',
    color: '#E5E4E2',
    bg: 'rgba(229,228,226,0.06)',
    border: 'rgba(229,228,226,0.3)',
    glow: 'rgba(229,228,226,0.2)',
    Icon: Zap,
    xpRequired: 15000,
    rewards: [
      'Custom rakeback negotiations',
      'Dedicated account manager',
      'Platinum-only deal vault',
      'Streak multiplier ×3',
    ],
  },
  {
    key: 'elite',
    label: 'Elite',
    color: '#C8A951',
    bg: 'rgba(200,169,81,0.1)',
    border: 'rgba(200,169,81,0.4)',
    glow: 'rgba(200,169,81,0.35)',
    Icon: Crown,
    xpRequired: 30000,
    rewards: [
      'Revenue share on referrals',
      'Custom bonus code creator',
      'Elite concierge support',
      'Exclusive affiliate tiers',
    ],
  },
];

function TierCard({ tier, currentTier, index }) {
  const tiers = TIERS.map(t => t.key);
  const currentIndex = tiers.indexOf(currentTier);
  const isUnlocked = index <= currentIndex;
  const isCurrent = tier.key === currentTier;
  const { Icon } = tier;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="relative rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: isCurrent ? tier.bg : isUnlocked ? tier.bg : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isCurrent ? tier.border : isUnlocked ? tier.border + '99' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isCurrent ? `0 0 24px ${tier.glow}` : 'none',
        opacity: isUnlocked ? 1 : 0.55,
      }}
    >
      {/* Current badge */}
      {isCurrent && (
        <motion.div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: tier.color, color: '#080C14' }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          CURRENT TIER
        </motion.div>
      )}

      {/* Icon + label */}
      <div className="flex items-center gap-2.5">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isUnlocked ? tier.color + '22' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isUnlocked ? tier.color + '55' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: isCurrent ? `0 0 16px ${tier.glow}` : 'none',
          }}
          animate={isCurrent ? { boxShadow: [`0 0 8px ${tier.glow}`, `0 0 24px ${tier.glow}`, `0 0 8px ${tier.glow}`] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {isUnlocked ? (
            <Icon className="w-5 h-5" style={{ color: tier.color }} />
          ) : (
            <Lock className="w-4 h-4 text-gray-600" />
          )}
        </motion.div>
        <div>
          <div className="text-sm font-bold" style={{ color: isUnlocked ? tier.color : '#6b7280' }}>
            {tier.label}
          </div>
          <div className="text-[10px] text-gray-600">{tier.xpRequired.toLocaleString()} XP required</div>
        </div>
      </div>

      {/* Rewards */}
      <div className="space-y-1.5">
        {tier.rewards.map((reward, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs">
            {isUnlocked ? (
              <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
            ) : (
              <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-700" />
            )}
            <span className={isUnlocked ? 'text-gray-300' : 'text-gray-600'}>{reward}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TierRoadmap({ currentTier = 'bronze' }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Crown className="w-4 h-4" style={{ color: '#C8A951' }} />
        <h3 className="text-sm font-semibold text-white">VIP Tier Roadmap</h3>
      </div>

      {/* Progress line (desktop horizontal) */}
      <div className="hidden lg:flex items-center gap-1 mb-4">
        {TIERS.map((tier, i) => {
          const tiers = TIERS.map(t => t.key);
          const currentIndex = tiers.indexOf(currentTier);
          const isUnlocked = i <= currentIndex;
          const isCurrent = tier.key === currentTier;
          return (
            <React.Fragment key={tier.key}>
              <div
                className="flex flex-col items-center gap-1"
                style={{ opacity: isUnlocked ? 1 : 0.4 }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: isUnlocked ? tier.color + '25' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${isCurrent ? tier.color : isUnlocked ? tier.color + '80' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: isCurrent ? `0 0 12px ${tier.glow}` : 'none',
                  }}
                >
                  {React.createElement(tier.Icon, { className: 'w-3.5 h-3.5', style: { color: isUnlocked ? tier.color : '#6b7280' } })}
                </div>
                <span className="text-[9px] font-semibold" style={{ color: isUnlocked ? tier.color : '#6b7280' }}>{tier.label}</span>
              </div>
              {i < TIERS.length - 1 && (
                <div
                  className="flex-1 h-0.5 rounded-full"
                  style={{ background: i < TIERS.indexOf(TIERS.find(t => t.key === currentTier)) ? TIERS[i].color + '60' : 'rgba(255,255,255,0.06)' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TIERS.map((tier, i) => (
          <TierCard key={tier.key} tier={tier} currentTier={currentTier} index={i} />
        ))}
      </div>
    </div>
  );
}
