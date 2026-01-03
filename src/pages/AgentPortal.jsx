import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, DollarSign, Plus, Search, Copy, Wallet, CheckCircle, Clock, CreditCard, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import PerformanceCharts from "../components/agent/PerformanceCharts";
import TierProgressCard from "../components/agent/TierProgressCard";
import AchievementBadges from "../components/agent/AchievementBadges";

export default function AgentPortal() {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [sites, setSites] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [referralLinks, setReferralLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [agentDeals, setAgentDeals] = useState([]);

  const [newPlayer, setNewPlayer] = useState({
    site_id: "",
    player_username: "",
    player_email: "",
    platform: "poker"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (!currentUser.is_agent && currentUser.role !== 'admin') {
        toast.error("Access denied. Agent status required.");
        return;
      }

      const [agentData, agentPlayers, allSites, agentCommissions, agentReferralLinks, deals] = await Promise.all([
        base44.entities.Agent.filter({ agent_email: currentUser.email }),
        currentUser.agent_id ? base44.entities.AgentPlayer.filter({ agent_id: currentUser.agent_id }) : [],
        base44.entities.Site.list(),
        currentUser.agent_id ? base44.entities.AgentCommission.filter({ agent_id: currentUser.agent_id }) : [],
        currentUser.agent_id ? base44.entities.AgentReferralLink.filter({ agent_id: currentUser.agent_id }) : [],
        currentUser.agent_id ? base44.entities.AgentDeal.filter({ agent_id: currentUser.agent_id }) : []
      ]);

      if (agentData.length > 0) {
        setAgent(agentData[0]);
      }
      setPlayers(agentPlayers);
      setSites(allSites);
      setCommissions(agentCommissions);
      setReferralLinks(agentReferralLinks);
      setAgentDeals(deals);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load agent data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.AgentPlayer.create({
        ...newPlayer,
        agent_id: user.agent_id,
        signup_date: new Date().toISOString().split('T')[0],
        status: "pending"
      });

      toast.success("Player submitted for approval");
      setShowAddPlayer(false);
      setNewPlayer({ site_id: "", player_username: "", player_email: "", platform: "poker" });
      await loadData();
    } catch (error) {
      toast.error("Failed to submit player");
    }
  };

  const totalRevenue = players.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const activePlayers = players.filter((p) => p.status === "active" || p.status === "approved").length;
  const monthlyRevenue = players.reduce((sum, p) => sum + (p.monthly_revenue || 0), 0);
  const totalCommission = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const pendingCommission = commissions.filter(c => c.payout_status === "pending").reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!user?.is_agent && user?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Agent Access Required</h1>
        <p className="text-gray-400">This portal is only accessible to approved agents.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Agent Dashboard</h1>
        <p className="text-gray-400">Welcome back, {agent?.agent_name || user.full_name}</p>
      </div>

      {/* 12-Column Grid Stats */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Main Stats - Glassmorphism Cards */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 glass-card hover:border-emerald-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{activePlayers}</div>
            <div className="text-sm text-gray-400">Active Players</div>
            <div className="text-xs text-gray-500 mt-1">of {players.length} total</div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-3 glass-card hover:border-emerald-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <ArrowUp className="w-3 h-3 mr-1" />
                +24%
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">${totalRevenue.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
            <div className="text-xs text-gray-500 mt-1">${monthlyRevenue.toFixed(0)} this month</div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-3 glass-card hover:border-emerald-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                Pending
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">${totalCommission.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Total Earned</div>
            <div className="text-xs text-yellow-400 mt-1">${pendingCommission.toFixed(0)} pending</div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-3 glass-card hover:border-emerald-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {referralLinks.reduce((sum, l) => sum + (l.clicks || 0), 0) > 0 
                ? ((referralLinks.reduce((sum, l) => sum + (l.conversions || 0), 0) / referralLinks.reduce((sum, l) => sum + (l.clicks || 0), 0)) * 100).toFixed(1) 
                : 0}%
            </div>
            <div className="text-sm text-gray-400">Conversion Rate</div>
          </CardContent>
        </Card>

        {/* Achievements Banner */}
        {user?.agent_id && (
          <div className="col-span-12">
            <AchievementBadges agentId={user.agent_id} />
          </div>
        )}

        {/* Performance Charts - 8 columns */}
        <div className="col-span-12 lg:col-span-8">
          <PerformanceCharts players={players} commissions={commissions} />
        </div>

        {/* Quick Actions - 4 columns */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowAddPlayer(true)}
                className="w-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-400 border border-emerald-500/30 justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Player
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-700 text-gray-300 hover:bg-slate-800 justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Tracking Link
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-700 text-gray-300 hover:bg-slate-800 justify-start"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </CardContent>
          </Card>

          <TierProgressCard
            agent={agent}
            playersCount={players.length}
            totalRevenue={totalRevenue}
            averageCommissionRate={agentDeals.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.commission_rate, 0) / Math.max(agentDeals.filter(d => d.status === 'approved').length, 1)}
          />
        </div>

        {/* Players Table - Full Width */}
        <div className="col-span-12">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Your Players</CardTitle>
                <Button
                  onClick={() => setShowAddPlayer(true)}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
                  />
                </div>
              </div>

              {/* Players Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Player</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Site</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Platform</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Revenue</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players
                      .filter(p => p.player_username.toLowerCase().includes(searchTerm.toLowerCase()))
                      .slice(0, 10)
                      .map((player) => {
                        const site = sites.find(s => s.id === player.site_id);
                        return (
                          <tr key={player.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {player.player_username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-white font-medium">{player.player_username}</div>
                                  <div className="text-xs text-gray-500">{player.player_email || '-'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-300">{site?.name || 'Unknown'}</td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className="text-gray-300 border-gray-600 capitalize">
                                {player.platform}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-emerald-400 font-semibold">${(player.total_revenue || 0).toFixed(2)}</div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Badge className={
                                player.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                player.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              }>
                                {player.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {players.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No players yet. Add your first player to get started!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Player Dialog */}
      <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
        <DialogContent className="glass-card text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl">Submit New Player</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPlayer}>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-300">Platform *</Label>
                <Select value={newPlayer.platform} onValueChange={(value) => setNewPlayer({ ...newPlayer, platform: value })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poker">Poker</SelectItem>
                    <SelectItem value="casino">Casino</SelectItem>
                    <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Site *</Label>
                <Select value={newPlayer.site_id} onValueChange={(value) => setNewPlayer({ ...newPlayer, site_id: value })} required>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.filter(s => s.type === newPlayer.platform || s.type.includes(newPlayer.platform)).map((site) => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="player_username" className="text-gray-300">Player Username *</Label>
                <Input
                  id="player_username"
                  value={newPlayer.player_username}
                  onChange={(e) => setNewPlayer({ ...newPlayer, player_username: e.target.value })}
                  placeholder="Username on the site"
                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="player_email" className="text-gray-300">Player Email (Optional)</Label>
                <Input
                  id="player_email"
                  type="email"
                  value={newPlayer.player_email}
                  onChange={(e) => setNewPlayer({ ...newPlayer, player_email: e.target.value })}
                  placeholder="player@example.com"
                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddPlayer(false)} className="border-slate-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                Submit Player
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}