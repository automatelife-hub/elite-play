import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Users, DollarSign, Crown, Award, Sparkles } from "lucide-react";

export default function Leaderboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);

      // Check access: approved agents, managers, VIPs, or admins
      if (user.role !== 'admin' && !user.is_agent) {
        setLoading(false);
        return;
      }

      const agents = await base44.entities.Agent.filter({ agent_email: user.email });
      if (agents.length > 0) {
        const agent = agents[0];
        const hasManagerTag = agent.internal_tags?.includes('Manager');
        const hasVIPTag = agent.internal_tags?.includes('VIP');
        
        if (agent.status !== 'approved' && !hasManagerTag && !hasVIPTag && user.role !== 'admin') {
          setLoading(false);
          return;
        }
      } else if (user.role !== 'admin') {
        setLoading(false);
        return;
      }

      const allAgents = await base44.entities.Agent.filter({ status: 'approved' });
      setAgents(allAgents);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const tierIcons = {
    bronze: Award,
    silver: Sparkles,
    gold: Crown
  };

  const getTierIcon = (tier) => tierIcons[tier] || Award;

  const tierColors = {
    bronze: "text-orange-400",
    silver: "text-gray-300",
    gold: "text-yellow-400"
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-br from-orange-600 to-orange-800";
    return "bg-gray-700";
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const byPlayers = [...agents].sort((a, b) => 
    (b.referred_players_count || 0) - (a.referred_players_count || 0)
  ).slice(0, 20);

  const byRevenue = [...agents].sort((a, b) => 
    (b.total_revenue_generated || 0) - (a.total_revenue_generated || 0)
  ).slice(0, 20);

  const byCommissions = [...agents].sort((a, b) => 
    (b.total_paid_out || 0) - (a.total_paid_out || 0)
  ).slice(0, 20);

  const renderLeaderboard = (rankedAgents, metricKey, metricLabel, icon) => (
    <div className="space-y-2">
      {rankedAgents.map((agent, idx) => {
        const rank = idx + 1;
        const TierIcon = getTierIcon(agent.tier || 'bronze');
        const isCurrentUser = currentUser?.agent_id === agent.id;
        
        return (
          <Card 
            key={agent.id} 
            className={`bg-gray-900 border-gray-800 ${isCurrentUser ? 'ring-2 ring-cyan-500' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${getMedalColor(rank)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {rank <= 3 ? (
                    <span className="text-2xl">{getMedalIcon(rank)}</span>
                  ) : (
                    <span className="text-lg">{rank}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">
                      {agent.agent_name}
                      {isCurrentUser && <span className="text-cyan-400 ml-2">(You)</span>}
                    </h3>
                    <TierIcon className={`w-4 h-4 ${tierColors[agent.tier]} flex-shrink-0`} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      {icon}
                      <span className="text-white font-semibold">
                        {metricKey === 'revenue' || metricKey === 'commissions' 
                          ? `$${(agent[metricKey] || 0).toLocaleString()}`
                          : (agent[metricKey] || 0).toLocaleString()
                        }
                      </span>
                      {metricLabel}
                    </span>
                  </div>
                </div>

                {agent.internal_tags && agent.internal_tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {agent.internal_tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Access denied check
  if (agents.length === 0 && !currentUser) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-400">Agent leaderboard is only available to approved agents, managers, and administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Agent Leaderboard</h1>
          <p className="text-gray-400">Top performing agents across all metrics</p>
        </div>

        {/* Leaderboards */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800 grid w-full grid-cols-3">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-green-500/20">
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-500/20">
              <Users className="w-4 h-4 mr-2" />
              Players
            </TabsTrigger>
            <TabsTrigger value="commissions" className="data-[state=active]:bg-purple-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Commissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            {renderLeaderboard(
              byRevenue.map(a => ({ ...a, revenue: a.total_revenue_generated })),
              'revenue',
              'revenue',
              <DollarSign className="w-4 h-4 text-green-400" />
            )}
          </TabsContent>

          <TabsContent value="players">
            {renderLeaderboard(
              byPlayers.map(a => ({ ...a, players: a.referred_players_count })),
              'players',
              'players',
              <Users className="w-4 h-4 text-blue-400" />
            )}
          </TabsContent>

          <TabsContent value="commissions">
            {renderLeaderboard(
              byCommissions.map(a => ({ ...a, commissions: a.total_paid_out })),
              'commissions',
              'earned',
              <TrendingUp className="w-4 h-4 text-purple-400" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}