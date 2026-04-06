import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Target, Award, Gift, TrendingUp, Users, DollarSign } from 'lucide-react';
import { db } from '@/api/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import XPProgressBar from '@/components/gamification/XPProgressBar';
import TierRoadmap from '@/components/gamification/TierRoadmap';
import MissionsCenter from '@/components/gamification/MissionsCenter';
import BadgesGallery from '@/components/gamification/BadgesGallery';
import LuckyWheel from '@/components/gamification/LuckyWheel';

// ─── Mock data (will be replaced with real Supabase queries) ─────────────────
const MOCK_USER_GAMIFICATION = {
  xp: 1340,
  tier: 'silver',
  prevXp: null,
  darkCoins: 320,
  weeklyStreak: 5,
  rank: 42,
  totalEarnings: 287.50,
  activeReferrals: 3,
};

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: color + '18', border: `1px solid ${color}33` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="text-lg font-bold text-white leading-tight">{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] mt-1" style={{ color }}>{sub}</div>}
    </motion.div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl p-4 md:p-5"
      style={{ background: '#0D1424', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GamificationHub() {
  const [user, setUser] = useState(null);
  const [gamification, setGamification] = useState(MOCK_USER_GAMIFICATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Gamification Hub — Earn XP, Unlock Rewards & Climb Tiers | Elite Play";
  }, []);

  useEffect(() => {
    db.auth.me()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Live XP demo: increment XP after 3s to show gain animation
  useEffect(() => {
    const t = setTimeout(() => {
      setGamification(prev => ({ ...prev, prevXp: prev.xp, xp: prev.xp + 75 }));
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const tier = gamification.tier;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #080C14 0%, #0D1424 60%, #080C14 100%)' }}
    >
      {/* ── Hero header ───────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(200,169,81,0.08) 0%, rgba(8,12,20,0) 60%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #C8A951 0%, transparent 70%)' }} />
          <div className="absolute top-10 right-1/4 w-48 h-48 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #60A5FA 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* Title row */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Crown className="w-5 h-5" style={{ color: '#C8A951' }} />
                </motion.div>
                <h1 className="text-xl font-bold text-white">Gamification Hub</h1>
              </div>
              <p className="text-xs text-gray-500 max-w-md">
                Level up, complete missions, earn badges, and climb the leaderboard. Every action earns XP.
              </p>
            </div>
            {/* Current tier badge */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: 'rgba(200,169,81,0.1)',
                border: '1px solid rgba(200,169,81,0.3)',
                boxShadow: '0 0 20px rgba(200,169,81,0.15)',
              }}
              animate={{ boxShadow: ['0 0 12px rgba(200,169,81,0.1)', '0 0 24px rgba(200,169,81,0.25)', '0 0 12px rgba(200,169,81,0.1)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Crown className="w-3.5 h-3.5" style={{ color: '#C8A951' }} />
              <span className="text-xs font-bold" style={{ color: '#C8A951' }}>{tierLabel} Tier</span>
            </motion.div>
          </div>

          {/* XP Bar */}
          <div className="max-w-lg">
            <XPProgressBar xp={gamification.xp} tier={gamification.tier} prevXp={gamification.prevXp} />
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Zap}        label="Dark Coins"       value={gamification.darkCoins.toLocaleString()}   color="#F5C842" sub="+100 this week"        />
          <StatCard icon={Target}     label="Weekly Streak"    value={`${gamification.weeklyStreak} days`}         color="#F97316" sub="Keep it going!"         />
          <StatCard icon={TrendingUp} label="Global Rank"      value={`#${gamification.rank}`}                     color="#60A5FA" sub="Top 12% this month"     />
          <StatCard icon={DollarSign} label="Total Earned"     value={`$${gamification.totalEarnings.toFixed(2)}`} color="#34D399" sub="All-time commissions"   />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList
            className="rounded-xl mb-4 h-auto p-1 flex-wrap gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {[
              { value: 'overview', label: 'Overview', icon: Crown },
              { value: 'tiers',    label: 'VIP Tiers', icon: Crown },
              { value: 'missions', label: 'Missions',  icon: Target },
              { value: 'badges',   label: 'Badges',    icon: Award  },
              { value: 'wheel',    label: 'Lucky Wheel', icon: Gift },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg data-[state=active]:text-white data-[state=inactive]:text-gray-500"
                style={{ '--tw-ring-color': 'transparent' }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4 mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              <Section delay={0}>
                <TierRoadmap currentTier={gamification.tier} />
              </Section>
              <Section delay={0.05}>
                <div className="flex justify-center">
                  <LuckyWheel />
                </div>
              </Section>
            </div>
            <Section delay={0.1}>
              <MissionsCenter />
            </Section>
            <Section delay={0.15}>
              <BadgesGallery />
            </Section>
          </TabsContent>

          {/* VIP Tiers */}
          <TabsContent value="tiers" className="mt-0">
            <Section>
              <TierRoadmap currentTier={gamification.tier} />
            </Section>
          </TabsContent>

          {/* Missions */}
          <TabsContent value="missions" className="mt-0">
            <Section>
              <MissionsCenter />
            </Section>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="mt-0">
            <Section>
              <BadgesGallery />
            </Section>
          </TabsContent>

          {/* Lucky Wheel */}
          <TabsContent value="wheel" className="mt-0">
            <Section>
              <div className="flex flex-col items-center py-4">
                <LuckyWheel />
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
