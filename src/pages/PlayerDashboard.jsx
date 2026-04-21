import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Zap, TrendingUp, Gift, Target, BarChart3,
  ArrowRight, DollarSign, Star, Users
} from 'lucide-react';
import { db } from '@/api/supabaseClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const TIER_COLORS = {
  bronze:   { bg: 'rgba(205,127,50,0.12)',  border: 'rgba(205,127,50,0.35)',  text: '#CD7F32' },
  silver:   { bg: 'rgba(192,192,192,0.12)', border: 'rgba(192,192,192,0.35)', text: '#C0C0C0' },
  gold:     { bg: 'rgba(200,169,81,0.12)',  border: 'rgba(200,169,81,0.35)',  text: '#C8A951' },
  platinum: { bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.35)',  text: '#60A5FA' },
  elite:    { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)', text: '#A78BFA' },
};

const XP_THRESHOLDS = {
  bronze:   { min: 0,     max: 999,   next: 'silver',   nextXp: 1000  },
  silver:   { min: 1000,  max: 4999,  next: 'gold',     nextXp: 5000  },
  gold:     { min: 5000,  max: 14999, next: 'platinum', nextXp: 15000 },
  platinum: { min: 15000, max: 29999, next: 'elite',    nextXp: 30000 },
  elite:    { min: 30000, max: null,  next: null,        nextXp: null  },
};

function QuickLinkCard({ icon: Icon, title, subtitle, to, color }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl p-4 cursor-pointer transition-all"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: color + '18', border: `1px solid ${color}33` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="text-xs text-gray-500">{subtitle}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600" />
        </div>
      </motion.div>
    </Link>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
        style={{ background: color + '18', border: `1px solid ${color}33` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </motion.div>
  );
}

export default function PlayerDashboard() {
  const [user, setUser] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Dashboard — Elite Play';
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const u = await db.auth.me();
        setUser(u);
        if (!u) { setLoading(false); return; }

        const [xpRows, coinsRows, userStats] = await Promise.all([
          db.entities.UserXpTotals.filter({ user_id: u.id }),
          db.entities.UserDarkCoinBalances.filter({ user_id: u.id }),
          db.entities.UserStats.filter({ user_email: u.email }),
        ]);

        const totalXp = Number(xpRows[0]?.total_xp) || 0;
        const tier = xpRows[0]?.tier || 'bronze';
        const darkCoins = Number(coinsRows[0]?.balance) || 0;
        const totalEarnings = userStats.reduce((sum, s) => sum + (Number(s.commission_earned) || 0), 0);

        setGamification({ totalXp, tier, darkCoins, totalEarnings });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setGamification({ totalXp: 0, tier: 'bronze', darkCoins: 0, totalEarnings: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #080C14 0%, #0D1424 60%, #080C14 100%)' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#C8A951' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(160deg, #080C14 0%, #0D1424 60%, #080C14 100%)' }}>
        <div className="text-center max-w-sm">
          <BarChart3 className="w-14 h-14 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Your Dashboard</h2>
          <p className="text-gray-400 text-sm mb-6">Track your XP, earnings, and gamification progress.</p>
          <Link to={createPageUrl('Affiliate')}>
            <button className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tier = gamification?.tier || 'bronze';
  const tierColors = TIER_COLORS[tier] || TIER_COLORS.bronze;
  const thresholds = XP_THRESHOLDS[tier];
  const totalXp = gamification?.totalXp || 0;
  const xpProgress = thresholds.nextXp
    ? Math.min(100, Math.round(((totalXp - thresholds.min) / (thresholds.nextXp - thresholds.min)) * 100))
    : 100;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #080C14 0%, #0D1424 60%, #080C14 100%)' }}>

      {/* Header */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, ${tierColors.text} 0%, transparent 70%)` }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-0.5">
                Welcome back, {user.full_name || 'Player'}
              </h1>
              <p className="text-xs text-gray-500">Your Elite Play overview</p>
            </div>
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: tierColors.bg, border: `1px solid ${tierColors.border}` }}
              animate={{ boxShadow: [`0 0 10px ${tierColors.text}18`, `0 0 22px ${tierColors.text}30`, `0 0 10px ${tierColors.text}18`] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Crown className="w-3.5 h-3.5" style={{ color: tierColors.text }} />
              <span className="text-xs font-bold" style={{ color: tierColors.text }}>{tierLabel} Tier</span>
            </motion.div>
          </div>

          {/* XP progress bar */}
          <div className="mt-5 max-w-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Zap className="w-3 h-3" style={{ color: tierColors.text }} />
                {totalXp.toLocaleString()} XP
              </span>
              {thresholds.nextXp && (
                <span className="text-xs text-gray-600">
                  {(thresholds.nextXp - totalXp).toLocaleString()} XP to {thresholds.next?.charAt(0).toUpperCase()}{thresholds.next?.slice(1)}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${tierColors.text}, ${tierColors.text}99)` }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Zap}        label="Total XP"       value={totalXp.toLocaleString()}                     color="#C8A951" />
          <StatCard icon={Gift}       label="Dark Coins"     value={(gamification?.darkCoins || 0).toLocaleString()} color="#F5C842" />
          <StatCard icon={DollarSign} label="Commissions"    value={`$${(gamification?.totalEarnings || 0).toFixed(2)}`} color="#34D399" />
          <StatCard icon={Star}       label="Tier"           value={tierLabel}                                      color={tierColors.text} />
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Access</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <QuickLinkCard
              icon={Crown}
              title="Gamification Hub"
              subtitle="XP, missions, badges & tier roadmap"
              to={createPageUrl('GamificationHub')}
              color="#C8A951"
            />
            <QuickLinkCard
              icon={Target}
              title="Operator Deals"
              subtitle="Browse affiliate offers & bonuses"
              to={createPageUrl('OperatorDeals')}
              color="#F97316"
            />
            <QuickLinkCard
              icon={TrendingUp}
              title="My Stats"
              subtitle="Rake, hands played & earnings history"
              to={createPageUrl('Stats')}
              color="#60A5FA"
            />
            <QuickLinkCard
              icon={BarChart3}
              title="Intelligence Suite"
              subtitle="Slot RTPs, poker traffic & analysis"
              to={createPageUrl('IntelligenceSlots')}
              color="#A78BFA"
            />
            <QuickLinkCard
              icon={Users}
              title="Leaderboard"
              subtitle="See top-ranked agents"
              to={createPageUrl('Leaderboard')}
              color="#34D399"
            />
            {!user.is_agent && (
              <QuickLinkCard
                icon={Star}
                title="Become an Agent"
                subtitle="Earn 40% commissions on referrals"
                to={createPageUrl('BecomeAgent')}
                color="#FB7185"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
