import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Crosshair, Database, Radio } from "lucide-react";
import { createPageUrl } from "@/utils";
import GIAMascot from "@/components/ui/GIAMascot";
import MissionButton from "@/components/ui/MissionButton";
import TacticalBadge from "@/components/ui/TacticalBadge";

// ─── Static intel feed data ───────────────────────────────────────────────────

const FEED_ITEMS = [
  { id: 'F-001', time: '00:00:12', msg: 'GIA SYSTEMS ONLINE — ALL CHANNELS SECURE' },
  { id: 'F-002', time: '00:00:08', msg: 'NEW EXTRACTION: 3 ELITE POKER SITES VERIFIED' },
  { id: 'F-003', time: '00:00:03', msg: 'BONUS INTELLIGENCE UPDATED — MISSION GOLD TIER' },
];

const STATS = [
  { value: '50+',   label: 'TARGETS REVIEWED',    color: '#00D9FF' },
  { value: '$2M+',  label: 'EXTRACTIONS TRACKED',  color: '#FFD700' },
  { value: '5.0★',  label: 'GIA RATING',           color: '#00FF41' },
  { value: '24/7',  label: 'TACTICAL SUPPORT',     color: '#00D9FF' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [tick, setTick] = useState(0);

  // blinking cursor effect for the live feed
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0A0E27' }}
    >
      {/* ── Tactical grid background ── */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,217,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,217,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Radar pulse rings ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-500/10"
            style={{
              width:  `${i * 300}px`,
              height: `${i * 300}px`,
              animation: `ping ${i * 1.5 + 1}s ease-out infinite`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.3 / i,
            }}
          />
        ))}
      </div>

      {/* ── Floating card suits ── */}
      <div className="absolute top-20 left-10 text-cyan-400/15 text-6xl animate-pulse">♠</div>
      <div className="absolute top-40 right-16 text-yellow-400/15 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>♦</div>
      <div className="absolute bottom-32 left-20 text-green-400/15 text-5xl animate-pulse" style={{ animationDelay: '2s' }}>♣</div>
      <div className="absolute bottom-20 right-32 text-cyan-400/10 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>♥</div>

      {/* ── Main content ── */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Classification banner */}
        <div className="flex justify-center mb-6">
          <TacticalBadge level="topSecret" glow>
            ◈ TOP SECRET / BRIEF-2026-OMEGA ◈
          </TacticalBadge>
        </div>

        {/* GIA Mascot */}
        <div className="flex justify-center mb-6">
          <GIAMascot
            size="large"
            status="active"
            showMessage={true}
            message="GIA ONLINE — INTELLIGENCE READY"
          />
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 leading-tight"
          style={{
            fontFamily: "'Orbitron', 'Exo 2', sans-serif",
            color: '#00D9FF',
            textShadow: '0 0 20px rgba(0,217,255,0.6), 0 0 60px rgba(0,71,171,0.4)',
            letterSpacing: '4px',
          }}
        >
          GAMBLE INTEL
        </h1>
        <p
          className="text-lg md:text-xl mb-2 tracking-widest"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            color: 'rgba(0,217,255,0.7)',
            letterSpacing: '6px',
          }}
        >
          YOUR INTELLIGENCE ADVANTAGE IN iGAMING
        </p>
        <p className="text-sm text-gray-500 mb-8 tracking-wider" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          EXPERT REVIEWS • EXCLUSIVE BONUSES • AI-POWERED INSIGHTS
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link to={createPageUrl("Reviews")}>
            <MissionButton variant="primary" size="lg">
              <Shield className="w-5 h-5" />
              VIEW TOP SITES
            </MissionButton>
          </Link>
          <Link to={createPageUrl("PokerAdvisor")}>
            <MissionButton variant="gold" size="lg">
              <Crosshair className="w-5 h-5" />
              GIA ADVISOR
            </MissionButton>
          </Link>
          <Link to={createPageUrl("Guides")}>
            <MissionButton variant="secondary" size="lg">
              <Database className="w-5 h-5" />
              INTEL GUIDES
            </MissionButton>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center p-4"
              style={{
                border: '1px solid rgba(0,217,255,0.2)',
                background: 'rgba(0,217,255,0.03)',
              }}
            >
              <div
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: s.color,
                  textShadow: `0 0 10px ${s.color}`,
                }}
              >
                {s.value}
              </div>
              <div
                className="text-xs tracking-widest"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: 'rgba(0,217,255,0.5)',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Live Intel Feed */}
        <div
          className="max-w-2xl mx-auto text-left"
          style={{
            border: '1px solid rgba(0,217,255,0.25)',
            background: 'rgba(10,14,39,0.8)',
            padding: '12px 16px',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-3 h-3 text-green-400 animate-pulse" />
            <span
              className="text-xs tracking-widest"
              style={{ fontFamily: "'Share Tech Mono', monospace", color: '#00FF41' }}
            >
              LIVE INTEL FEED
            </span>
          </div>
          {FEED_ITEMS.map((item) => (
            <div key={item.id} className="flex gap-3 mb-1">
              <span
                className="text-xs shrink-0"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: 'rgba(0,217,255,0.4)' }}
              >
                -{item.time}
              </span>
              <span
                className="text-xs"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: '#00D9FF' }}
              >
                {item.msg}
              </span>
            </div>
          ))}
          <div
            className="text-xs mt-2"
            style={{ fontFamily: "'Share Tech Mono', monospace", color: 'rgba(0,217,255,0.3)' }}
          >
            ▸ AWAITING NEXT TRANSMISSION{tick % 2 === 0 ? '_' : ' '}
          </div>
        </div>
      </div>
    </section>
  );
}
