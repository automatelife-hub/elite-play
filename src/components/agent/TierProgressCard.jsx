import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, CheckCircle, Sparkles, Crown, Award, Gem, Zap } from "lucide-react";

// XP thresholds: Bronze 0-999 | Silver 1000-4999 | Gold 5000-14999 | Platinum 15000-29999 | Elite 30000+
const TIER_CONFIG = {
  bronze: {
    name: "Bronze",
    icon: Award,
    gradient: "from-orange-900/60 to-orange-800/40",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    barColor: "bg-gradient-to-r from-orange-600 to-orange-400",
    xpMin: 0,
    xpMax: 999,
    benefits: ["Deal-based commissions", "Basic reporting tools", "Email support", "Marketing materials"],
  },
  silver: {
    name: "Silver",
    icon: Sparkles,
    gradient: "from-gray-700/60 to-gray-600/40",
    textColor: "text-gray-300",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-400/40",
    barColor: "bg-gradient-to-r from-gray-500 to-gray-300",
    xpMin: 1000,
    xpMax: 4999,
    benefits: ["Higher commissions", "Advanced analytics", "Priority support", "Custom landing pages"],
  },
  gold: {
    name: "Gold",
    icon: Crown,
    gradient: "from-yellow-900/60 to-yellow-800/40",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    barColor: "bg-gradient-to-r from-yellow-600 to-yellow-300",
    xpMin: 5000,
    xpMax: 14999,
    benefits: ["Premium commissions", "Full analytics suite", "Dedicated account manager", "API access"],
  },
  platinum: {
    name: "Platinum",
    icon: Gem,
    gradient: "from-cyan-900/60 to-cyan-800/40",
    textColor: "text-cyan-300",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/30",
    barColor: "bg-gradient-to-r from-cyan-600 to-cyan-300",
    xpMin: 15000,
    xpMax: 29999,
    benefits: ["Top-tier commissions", "White-glove support", "Custom deal structuring", "Revenue share boost"],
  },
  elite: {
    name: "Elite",
    icon: Zap,
    gradient: "from-purple-900/60 to-violet-800/40",
    textColor: "text-purple-300",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    barColor: "bg-gradient-to-r from-purple-600 via-violet-400 to-fuchsia-400",
    xpMin: 30000,
    xpMax: Infinity,
    benefits: ["Maximum commissions", "Exclusive deals", "Co-marketing budget", "Direct CTO access", "VIP events"],
  },
};

const TIER_ORDER = ["bronze", "silver", "gold", "platinum", "elite"];

function AnimatedXPBar({ value, barColor }) {
  return (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${barColor}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

export default function TierProgressCard({ agent, totalXp = 0 }) {
  const currentTierKey = agent?.tier || "bronze";
  const config = TIER_CONFIG[currentTierKey] || TIER_CONFIG.bronze;
  const tierIndex = TIER_ORDER.indexOf(currentTierKey);
  const nextTierKey = TIER_ORDER[tierIndex + 1] ?? null;
  const nextConfig = nextTierKey ? TIER_CONFIG[nextTierKey] : null;
  const isMaxTier = !nextTierKey;

  const xpIntoTier = totalXp - config.xpMin;
  const tierRange = nextConfig ? nextConfig.xpMin - config.xpMin : 1;
  const progressPct = isMaxTier ? 100 : Math.min((xpIntoTier / tierRange) * 100, 100);
  const xpToNext = nextConfig ? Math.max(nextConfig.xpMin - totalXp, 0) : 0;

  const CurrentIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Current Tier Banner */}
      <Card className={`bg-gradient-to-br ${config.gradient} border-2 ${config.borderColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <CurrentIcon className={`w-6 h-6 ${config.textColor}`} />
              </motion.div>
              <div>
                <CardTitle className="text-white text-2xl">{config.name} Tier</CardTitle>
                <p className="text-gray-400 text-sm">Your current status</p>
              </div>
            </div>
            <Badge className={`${config.bgColor} ${config.textColor} ${config.borderColor} text-base px-4 py-1.5 font-bold`}>
              {totalXp.toLocaleString()} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Animated XP progress bar */}
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {isMaxTier ? "MAX TIER" : `Progress to ${nextConfig.name}`}
            </span>
            <span className={config.textColor}>
              {isMaxTier ? "Elite ∞" : `${xpToNext.toLocaleString()} XP to go`}
            </span>
          </div>
          <AnimatedXPBar value={progressPct} barColor={config.barColor} />
          {!isMaxTier && (
            <div className="mt-1 flex justify-between text-xs text-gray-600">
              <span>{config.xpMin.toLocaleString()} XP</span>
              <span>{nextConfig.xpMin.toLocaleString()} XP</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Comparison Grid */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            All Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {TIER_ORDER.map((key) => {
              const tc = TIER_CONFIG[key];
              const TierIcon = tc.icon;
              const isCurrent = key === currentTierKey;
              const isUnlocked = TIER_ORDER.indexOf(key) <= tierIndex;

              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.03 }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? `${tc.borderColor} bg-gradient-to-br ${tc.gradient}`
                      : isUnlocked
                      ? "border-gray-700 bg-gray-800/40"
                      : "border-gray-800 bg-gray-900/40 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TierIcon className={`w-4 h-4 ${tc.textColor}`} />
                    <span className={`font-bold text-sm ${isCurrent ? tc.textColor : "text-white"}`}>
                      {tc.name}
                    </span>
                    {isCurrent && (
                      <Badge className={`${tc.bgColor} ${tc.textColor} text-[10px] px-1 py-0 ml-auto`}>
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {tc.xpMax === Infinity ? `${tc.xpMin.toLocaleString()}+ XP` : `${tc.xpMin.toLocaleString()}–${tc.xpMax.toLocaleString()} XP`}
                  </div>
                  <ul className="space-y-1">
                    {tc.benefits.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Max tier celebration */}
      {isMaxTier && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-violet-800/30 border-purple-500/40">
            <CardContent className="p-6 flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-purple-300 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Elite Status Achieved</h3>
                <p className="text-gray-400 text-sm">You are at the top of the network. Keep driving results.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
