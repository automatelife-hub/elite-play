import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Zap, Link as LinkIcon } from "lucide-react";
import { startOfMonth, startOfWeek } from "date-fns";

export default function RealtimePerformance({ players, commissions, agentDeals, referralLinks }) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const weekStart = startOfWeek(now);

  // This month's revenue
  const thisMonthRevenue = players
    .filter(p => p.last_activity_date && new Date(p.last_activity_date) >= monthStart)
    .reduce((sum, p) => sum + (p.monthly_revenue || 0), 0);

  // This week's new players
  const thisWeekPlayers = players.filter(p => {
    if (!p.signup_date) return false;
    const signupDate = new Date(p.signup_date);
    return signupDate >= weekStart;
  }).length;

  // This month's commissions
  const thisMonthCommissions = commissions
    .filter(c => c.period_start && new Date(c.period_start) >= monthStart)
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  // Active deals count
  const activeDeals = agentDeals.filter(d => d.status === 'approved').length;

  // Active referral links
  const activeLinks = referralLinks.filter(l => l.active).length;

  return (
    <Card className="glass-card border-emerald-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          Real-Time Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* This Month Revenue */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <DollarSign className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              ${thisMonthRevenue.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">This Month Revenue</div>
          </div>

          {/* This Week Players */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{thisWeekPlayers}</div>
            <div className="text-xs text-gray-400">New This Week</div>
          </div>

          {/* This Month Commissions */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <TrendingUp className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              ${thisMonthCommissions.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Commissions MTD</div>
          </div>

          {/* Active Deals */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
              {activeDeals}
            </Badge>
            <div className="text-xs text-gray-400 mt-1">Active Deals</div>
          </div>

          {/* Active Links */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <LinkIcon className="w-5 h-5 text-cyan-400 mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{activeLinks}</div>
            <div className="text-xs text-gray-400">Tracking Links</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}