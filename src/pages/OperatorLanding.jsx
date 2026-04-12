/**
 * OperatorLanding.jsx — SEO-ready, conversion-optimized landing pages
 * for the top 5 poker operators: GGPoker, PokerStars, ACR, Bovada, BetOnline.
 *
 * Route: /OperatorLanding?operator=ggpoker
 * (or linked from OperatorDeals with a "Get Deal" CTA)
 */

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase, db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Star,
  Shield,
  Trophy,
  Zap,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Users,
  Clock,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { createTrackingLink, buildOutboundUrl, OPERATOR_BASE_URLS } from "@/utils/affiliateTracking";
import { createPageUrl } from "@/utils";

// ---------------------------------------------------------------------------
// Operator static content
// ---------------------------------------------------------------------------
const OPERATOR_DATA = {
  ggpoker: {
    name: "GGPoker",
    slug: "ggpoker",
    tagline: "The World's Biggest Poker Room",
    headline: "Get the Best GGPoker Deal — Exclusive Hybrid Offer",
    description:
      "GGPoker is the #1 online poker room by traffic. Home to the WSOP Online, GGPoker offers massive guarantees, daily tournaments, and the innovative GGCare feature. Our exclusive deal gives you more than the standard offer.",
    logo: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=120&h=60&fit=crop",
    color: "from-yellow-600 to-yellow-800",
    accentColor: "yellow",
    deal: {
      type: "Hybrid (RevShare + CPA)",
      headline: "30% Revenue Share + $100 CPA",
      subline: "First deposit ≥ $50",
      tags: ["30% RevShare", "$100 per FTD", "Monthly Payouts", "Crypto OK"],
    },
    features: [
      { icon: Trophy,  text: "WSOP Online Official Partner" },
      { icon: Users,   text: "1M+ monthly active players" },
      { icon: Shield,  text: "Licensed in Isle of Man" },
      { icon: Zap,     text: "Instant play — no download required" },
      { icon: DollarSign, text: "Support for BTC, ETH, USDT" },
      { icon: Globe,   text: "Available in 100+ countries" },
    ],
    bonuses: [
      { label: "Welcome Bonus", value: "100% up to $600" },
      { label: "Fish Buffet",   value: "Up to 60% cashback" },
      { label: "Daily Missions", value: "Free tickets daily" },
    ],
    cta: "Claim Your GGPoker Deal",
    seoKeywords: "GGPoker affiliate, GGPoker bonus, best GGPoker deal, GGPoker review 2026",
    trafficSources: ["seo", "social", "email", "referral"],
  },
  pokerstars: {
    name: "PokerStars",
    slug: "pokerstars",
    tagline: "The World's Largest Poker Site",
    headline: "PokerStars Exclusive — Up to 35% Revenue Share",
    description:
      "PokerStars has been the industry leader for over 20 years, hosting hundreds of tournaments daily and the prestigious EPT series. Our revenue share deal scales with your traffic volume.",
    logo: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=120&h=60&fit=crop",
    color: "from-red-700 to-red-900",
    accentColor: "red",
    deal: {
      type: "Revenue Share (Tiered)",
      headline: "25%–35% Revenue Share",
      subline: "Negative carryover waived after 3 months",
      tags: ["Tiered RevShare", "No Neg Carryover*", "Monthly Payouts", "Bank Transfer"],
    },
    features: [
      { icon: Trophy,  text: "EPT & WCOOP host" },
      { icon: Users,   text: "Most-downloaded poker app globally" },
      { icon: Shield,  text: "UK, Malta & Kahnawake licensed" },
      { icon: Clock,   text: "24/7 live support" },
      { icon: Globe,   text: "Available in 130+ countries" },
      { icon: Star,    text: "Stars Rewards loyalty program" },
    ],
    bonuses: [
      { label: "Welcome Offer",   value: "100% up to $600" },
      { label: "Stars Rewards",   value: "Chests with every hand" },
      { label: "Spin & Go",       value: "Jackpots up to 10,000x" },
    ],
    cta: "Get PokerStars Deal",
    seoKeywords: "PokerStars affiliate, PokerStars revenue share, PokerStars bonus code 2026",
    trafficSources: ["seo", "social", "email"],
  },
  "acr-poker": {
    name: "ACR Poker",
    slug: "acr-poker",
    tagline: "America's Card Room — US Players Welcome",
    headline: "ACR Poker — 27% Instant Rakeback for US Players",
    description:
      "Americas Cardroom is one of the last major poker sites accepting US players. The weekly guaranteed tournament schedule is unmatched in the US market. Our 27% instant rakeback deal is among the best in the industry.",
    logo: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=120&h=60&fit=crop",
    color: "from-blue-700 to-blue-900",
    accentColor: "blue",
    deal: {
      type: "Instant Rakeback",
      headline: "27% Instant Rakeback",
      subline: "Paid weekly — no vesting period",
      tags: ["27% Rakeback", "US Players OK", "Weekly Payouts", "Bitcoin"],
    },
    features: [
      { icon: Globe,   text: "Accepts US players" },
      { icon: DollarSign, text: "Bitcoin & altcoin deposits" },
      { icon: Trophy,  text: "$10M+ weekly guarantees" },
      { icon: Zap,     text: "No VPN required for USA" },
      { icon: Clock,   text: "Rakeback paid every Sunday" },
      { icon: Shield,  text: "Curaçao licensed" },
    ],
    bonuses: [
      { label: "Welcome Bonus",   value: "200% up to $1,000" },
      { label: "Instant Rake",    value: "27% back every hand" },
      { label: "Jackpot SNGs",    value: "Win up to $1M instantly" },
    ],
    cta: "Start Earning Rakeback",
    seoKeywords: "ACR Poker affiliate, Americas Cardroom rakeback, US poker affiliate 2026",
    trafficSources: ["seo", "social", "direct"],
  },
  bovada: {
    name: "Bovada",
    slug: "bovada",
    tagline: "USA's #1 Online Casino & Poker Room",
    headline: "Bovada Poker — 25% RevShare for US Traffic",
    description:
      "Bovada is the go-to destination for US players across poker, casino, and sports. Strong brand recognition, crypto-first payouts, and a loyal US player base make Bovada one of the highest-converting offers.",
    logo: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=120&h=60&fit=crop",
    color: "from-amber-600 to-orange-800",
    accentColor: "orange",
    deal: {
      type: "Revenue Share",
      headline: "25% Revenue Share",
      subline: "Crypto payouts preferred — fast settlement",
      tags: ["25% RevShare", "US Focused", "Crypto Payouts", "Monthly"],
    },
    features: [
      { icon: Globe,   text: "US-focused traffic — high conversion" },
      { icon: DollarSign, text: "Bitcoin & USDT payouts" },
      { icon: Trophy,  text: "Poker + Casino + Sports" },
      { icon: Users,   text: "2M+ registered users" },
      { icon: Shield,  text: "Kahnawake licensed" },
      { icon: Star,    text: "Strong brand loyalty in USA" },
    ],
    bonuses: [
      { label: "Poker Welcome",   value: "100% up to $500" },
      { label: "Casino Bonus",    value: "100% up to $3,000" },
      { label: "Sports Bonus",    value: "50% up to $250" },
    ],
    cta: "Promote Bovada Now",
    seoKeywords: "Bovada affiliate, Bovada revenue share, promote Bovada USA poker 2026",
    trafficSources: ["seo", "social", "email"],
  },
  betonline: {
    name: "BetOnline",
    slug: "betonline",
    tagline: "Poker, Casino & Sports — All in One",
    headline: "BetOnline Hybrid Deal — RevShare + CPA",
    description:
      "BetOnline is a full-service US-friendly gambling platform with strong poker, casino, and sportsbetting verticals. The hybrid affiliate deal maximizes earnings across all traffic types.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=60&fit=crop",
    color: "from-green-700 to-teal-900",
    accentColor: "green",
    deal: {
      type: "Hybrid",
      headline: "25% RevShare + $75 CPA",
      subline: "US & Canada traffic — Bitcoin payouts",
      tags: ["Hybrid Deal", "US/CA Traffic", "$75 per FTD", "Bitcoin OK"],
    },
    features: [
      { icon: Globe,   text: "US & Canada accepted" },
      { icon: DollarSign, text: "Bitcoin, credit & bank wire" },
      { icon: Trophy,  text: "Poker + Casino + Sports verticals" },
      { icon: Users,   text: "1.5M+ registered players" },
      { icon: Zap,     text: "Fast affiliate payouts" },
      { icon: Shield,  text: "Panama-licensed operator" },
    ],
    bonuses: [
      { label: "Poker Bonus",  value: "200% up to $2,000" },
      { label: "Casino Offer", value: "100% up to $1,000" },
      { label: "Sports Match", value: "50% up to $1,000" },
    ],
    cta: "Get BetOnline Deal",
    seoKeywords: "BetOnline affiliate, BetOnline revenue share CPA, US poker affiliate 2026",
    trafficSources: ["seo", "social", "email"],
  },
};

const ACCENT_CLASSES = {
  yellow: { badge: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30", btn: "bg-yellow-500 hover:bg-yellow-400 text-black", icon: "text-yellow-400" },
  red:    { badge: "bg-red-500/20 text-red-300 border-red-400/30",         btn: "bg-red-600 hover:bg-red-500 text-white",          icon: "text-red-400"    },
  blue:   { badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",      btn: "bg-blue-600 hover:bg-blue-500 text-white",         icon: "text-blue-400"   },
  orange: { badge: "bg-orange-500/20 text-orange-300 border-orange-400/30", btn: "bg-orange-500 hover:bg-orange-400 text-black",    icon: "text-orange-400" },
  green:  { badge: "bg-green-500/20 text-green-300 border-green-400/30",   btn: "bg-green-600 hover:bg-green-500 text-white",       icon: "text-green-400"  },
};

export default function OperatorLanding() {
  const [searchParams]   = useSearchParams();
  const operatorSlug     = searchParams.get("operator") || "ggpoker";
  const operator         = OPERATOR_DATA[operatorSlug];

  const [user, setUser]             = useState(null);
  const [trackingLink, setTrackingLink] = useState(null);
  const [generatingLink, setGeneratingLink] = useState(false);

  const accent = operator ? ACCENT_CLASSES[operator.accentColor] || ACCENT_CLASSES.yellow : ACCENT_CLASSES.yellow;

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Generate a unique tracking link for authenticated agents
  const handleGetDeal = useCallback(async () => {
    if (!operator) return;

    setGeneratingLink(true);
    try {
      if (user?.is_agent && user?.agent_id) {
        // Create personalised tracking link
        const link = await createTrackingLink({
          operatorSlug:  operator.slug,
          baseUrl:       OPERATOR_BASE_URLS[operator.slug] || `https://${operator.slug}.com/ref/`,
          trafficSource: "direct",
          agentId:       user.agent_id,
          label:         `${operator.name} — Direct`,
        });
        setTrackingLink(link);
        toast.success("Your personal tracking link is ready!");
      } else {
        // Non-agent: open operator site with a generic sub_id placeholder
        window.open(`${OPERATOR_BASE_URLS[operator.slug] || '#'}ref=eliteplay`, '_blank', 'noopener');
      }
    } catch (err) {
      console.error("Failed to generate tracking link:", err);
      // Fallback: open the operator site anyway
      window.open(OPERATOR_BASE_URLS[operator.slug] || '#', '_blank', 'noopener');
    } finally {
      setGeneratingLink(false);
    }
  }, [operator, user]);

  const handleOutboundClick = () => {
    if (trackingLink) {
      const url = buildOutboundUrl(trackingLink.sub_id, operator.slug, null, user?.id);
      window.open(url, '_blank', 'noopener');
    }
  };

  if (!operator) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Operator Not Found</h1>
          <p className="text-slate-400 mb-6">Available operators: ggpoker, pokerstars, acr-poker, bovada, betonline</p>
          <Link to={createPageUrl("OperatorDeals")}>
            <Button className="bg-cyan-600 hover:bg-cyan-500">View All Operators</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className={`relative py-16 bg-gradient-to-br ${operator.color} border-b border-white/10`}>
        <div className="absolute inset-0 bg-gray-950/60" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <Badge className={`mb-4 ${accent.badge}`}>{operator.tagline}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {operator.headline}
              </h1>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl">{operator.description}</p>

              {/* Deal highlight */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{operator.deal.type}</p>
                <p className="text-2xl font-bold text-white">{operator.deal.headline}</p>
                <p className="text-slate-300 text-sm mt-1">{operator.deal.subline}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {operator.deal.tags.map((tag) => (
                    <Badge key={tag} className={`text-xs ${accent.badge}`}>{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {trackingLink ? (
                <div className="space-y-3">
                  <div className="bg-slate-800/80 border border-slate-600 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Your personal tracking link</p>
                    <p className="font-mono text-sm text-cyan-300 break-all">{trackingLink.full_url}</p>
                    <p className="text-xs text-slate-500 mt-1">Sub ID: {trackingLink.sub_id}</p>
                  </div>
                  <Button onClick={handleOutboundClick} className={`w-full sm:w-auto ${accent.btn} font-bold py-3 px-8 text-lg`}>
                    Open {operator.name} <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGetDeal}
                  disabled={generatingLink}
                  className={`w-full sm:w-auto ${accent.btn} font-bold py-3 px-8 text-lg`}
                >
                  {generatingLink ? "Generating link…" : operator.cta}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}

              {!user && (
                <p className="text-xs text-slate-400 mt-2">
                  <Link to={createPageUrl("Affiliate")} className="text-cyan-400 hover:underline">Sign up as an agent</Link>
                  {" "}to get a personalised tracking link.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Features grid */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Why {operator.name}?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {operator.features.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                <Icon className={`w-5 h-5 flex-shrink-0 ${accent.icon}`} />
                <span className="text-slate-200 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Player bonuses */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Player Bonuses</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {operator.bonuses.map((bonus, i) => (
              <Card key={i} className="bg-slate-800/60 border-slate-700">
                <CardContent className="p-5 text-center">
                  <p className="text-slate-400 text-sm mb-2">{bonus.label}</p>
                  <p className="text-xl font-bold text-white">{bonus.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust & compliance */}
        <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">Compliance & Trust</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> All affiliate links use encrypted SubID tracking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Operator commissions reconciled monthly</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> No paid API integrations — manual reconciliation until board-approved</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> GDPR-compliant click tracking (hashed IPs only)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Other operators */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Other Top Operators</h2>
          <div className="flex flex-wrap gap-3">
            {Object.values(OPERATOR_DATA)
              .filter(op => op.slug !== operatorSlug)
              .map(op => (
                <Link key={op.slug} to={`${createPageUrl("OperatorLanding")}?operator=${op.slug}`}>
                  <Badge className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 cursor-pointer py-1.5 px-3 text-sm">
                    {op.name} <ChevronRight className="w-3 h-3 ml-1 inline" />
                  </Badge>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
