import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Users, DollarSign, CheckCircle, Sparkles, Crown, Award } from "lucide-react";

const TIER_CONFIG = {
  bronze: {
    name: "Bronze",
    icon: Award,
    color: "from-orange-600 to-orange-800",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    requirements: {
      players: 0,
      revenue: 0
    },
    benefits: [
      "Deal-based commissions",
      "Basic reporting tools",
      "Email support",
      "Marketing materials"
    ]
  },
  silver: {
    name: "Silver",
    icon: Sparkles,
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-300",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/30",
    requirements: {
      players: 10,
      revenue: 5000
    },
    benefits: [
      "Higher deal commissions",
      "Advanced analytics",
      "Priority email support",
      "Custom landing pages",
      "Monthly strategy calls"
    ]
  },
  gold: {
    name: "Gold",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    requirements: {
      players: 25,
      revenue: 15000
    },
    benefits: [
      "Premium deal commissions",
      "Full analytics suite",
      "Dedicated account manager",
      "Custom promotional deals",
      "Weekly strategy sessions",
      "API access"
    ]
  }
};

const TIER_ORDER = ['bronze', 'silver', 'gold'];

export default function TierProgressCard({ agent, playersCount, totalRevenue, averageCommissionRate }) {
  const currentTier = agent?.tier || 'bronze';
  const currentTierConfig = TIER_CONFIG[currentTier];
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);
  const nextTier = TIER_ORDER[currentTierIndex + 1];
  const nextTierConfig = nextTier ? TIER_CONFIG[nextTier] : null;

  const playersProgress = nextTierConfig 
    ? Math.min((playersCount / nextTierConfig.requirements.players) * 100, 100)
    : 100;
  
  const revenueProgress = nextTierConfig
    ? Math.min((totalRevenue / nextTierConfig.requirements.revenue) * 100, 100)
    : 100;

  const playersRemaining = nextTierConfig 
    ? Math.max(nextTierConfig.requirements.players - playersCount, 0)
    : 0;
  
  const revenueRemaining = nextTierConfig
    ? Math.max(nextTierConfig.requirements.revenue - totalRevenue, 0)
    : 0;

  const isMaxTier = !nextTier;
  const canAdvance = nextTierConfig && playersCount >= nextTierConfig.requirements.players && totalRevenue >= nextTierConfig.requirements.revenue;

  const CurrentTierIcon = currentTierConfig.icon;

  return (
    <div className="space-y-6">
      {/* Current Tier Status */}
      <Card className={`bg-gradient-to-br ${currentTierConfig.color} border-2 ${currentTierConfig.borderColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${currentTierConfig.bgColor} rounded-xl flex items-center justify-center`}>
                <CurrentTierIcon className={`w-6 h-6 ${currentTierConfig.textColor}`} />
              </div>
              <div>
                <CardTitle className="text-white text-2xl">
                  {currentTierConfig.name} Tier
                </CardTitle>
                <p className="text-gray-300 text-sm">Your current status</p>
              </div>
            </div>
            <Badge className={`${currentTierConfig.bgColor} ${currentTierConfig.textColor} ${currentTierConfig.borderColor} text-lg px-4 py-2`}>
              {averageCommissionRate ? `${averageCommissionRate.toFixed(1)}%` : `${currentTierConfig.commissionRate}%`} Avg Commission
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
              <Users className="w-5 h-5 text-white" />
              <div>
                <div className="text-white font-semibold">{playersCount} Players</div>
                <div className="text-gray-300 text-xs">Total referred</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
              <div>
                <div className="text-white font-semibold">${totalRevenue.toFixed(0)}</div>
                <div className="text-gray-300 text-xs">Total revenue</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Progress */}
      {!isMaxTier && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              Progress to {nextTierConfig.name} Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canAdvance ? (
              <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Congratulations!</h3>
                <p className="text-gray-300">
                  You've met all requirements for {nextTierConfig.name} tier. Contact support to upgrade your account.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Players Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">Players</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {playersCount} / {nextTierConfig.requirements.players}
                    </span>
                  </div>
                  <Progress value={playersProgress} className="h-3" />
                  {playersRemaining > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {playersRemaining} more player{playersRemaining !== 1 ? 's' : ''} needed
                    </p>
                  )}
                </div>

                {/* Revenue Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">Revenue</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      ${totalRevenue.toFixed(0)} / ${nextTierConfig.requirements.revenue}
                    </span>
                  </div>
                  <Progress value={revenueProgress} className="h-3" />
                  {revenueRemaining > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ${revenueRemaining.toFixed(0)} more revenue needed
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Tiers Benefits */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Tier Benefits Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {TIER_ORDER.map((tierKey) => {
              const tierConfig = TIER_CONFIG[tierKey];
              const TierIcon = tierConfig.icon;
              const isCurrent = tierKey === currentTier;
              
              return (
                <div
                  key={tierKey}
                  className={`p-4 rounded-lg border-2 ${
                    isCurrent 
                      ? `${tierConfig.borderColor} bg-gradient-to-br ${tierConfig.color}/10` 
                      : 'border-gray-800 bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TierIcon className={`w-5 h-5 ${tierConfig.textColor}`} />
                      <h4 className={`font-bold ${isCurrent ? tierConfig.textColor : 'text-white'}`}>
                        {tierConfig.name}
                      </h4>
                    </div>
                    {isCurrent && (
                      <Badge className={`${tierConfig.bgColor} ${tierConfig.textColor} ${tierConfig.borderColor} text-xs`}>
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-3 text-sm text-gray-400">
                    <div>• {tierConfig.requirements.players}+ players</div>
                    <div>• ${tierConfig.requirements.revenue}+ revenue</div>
                  </div>

                  <div className={`text-sm text-gray-400 mb-3`}>
                    Based on approved deals
                  </div>

                  <ul className="space-y-2">
                    {tierConfig.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {isMaxTier && (
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Crown className="w-12 h-12 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Maximum Tier Achieved!</h3>
                <p className="text-gray-300">
                  You're at the highest tier with the best commission rates and benefits. Keep up the excellent work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}