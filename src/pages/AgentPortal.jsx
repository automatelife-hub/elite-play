import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
"@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { Users, TrendingUp, DollarSign, Link as LinkIcon, Plus, Search, Copy, Wallet, Calendar, CheckCircle, Clock, Bell, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import PerformanceCharts from "../components/agent/PerformanceCharts";
import PaymentRequestDialog from "../components/agent/PaymentRequestDialog";
import NotificationBell from "../components/agent/NotificationBell";
import ReportGenerator from "../components/agent/ReportGenerator";
import TierProgressCard from "../components/agent/TierProgressCard";
import SupportTicketForm from "../components/agent/SupportTicketForm";
import SupportTicketList from "../components/agent/SupportTicketList";

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
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentRequest, setShowPaymentRequest] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);

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

      // Allow access for admins OR approved agents
      if (!currentUser.is_agent && currentUser.role !== 'admin') {
        toast.error("Access denied. Agent status required.");
        return;
      }

      const [agentData, agentPlayers, allSites, agentCommissions, agentReferralLinks, tickets] = await Promise.all([
        base44.entities.Agent.filter({ agent_email: currentUser.email }),
        currentUser.agent_id ?
          base44.entities.AgentPlayer.filter({ agent_id: currentUser.agent_id }) :
          [],
        base44.entities.Site.list(),
        currentUser.agent_id ?
          base44.entities.AgentCommission.filter({ agent_id: currentUser.agent_id }) :
          [],
        currentUser.agent_id ?
          base44.entities.AgentReferralLink.filter({ agent_id: currentUser.agent_id }) :
          [],
        currentUser.agent_id ?
          base44.entities.SupportTicket.filter({ agent_id: currentUser.agent_id }) :
          []
      ]);

      if (agentData.length > 0) {
        setAgent(agentData[0]);
        
        // Auto-generate referral links if they don't exist
        if (agentReferralLinks.length === 0 && agentData[0].tracking_code) {
          await generateReferralLinks(agentData[0].id, agentData[0].tracking_code, allSites);
        }
      }
      setPlayers(agentPlayers);
      setSites(allSites);
      setCommissions(agentCommissions);
      setReferralLinks(agentReferralLinks);
      setSupportTickets(tickets);
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
      // Allow admins OR approved agents with agent_id
      if (!user.agent_id && user.role !== 'admin') {
        toast.error("You must be an approved agent to submit players.");
        return;
      }
      
      await base44.entities.AgentPlayer.create({
        ...newPlayer,
        agent_id: user.agent_id,
        signup_date: new Date().toISOString().split('T')[0],
        status: "pending",
        rev_share: agent?.commission_rate ? `${agent.commission_rate}%` : "TBD"
      });

      toast.success("Player submitted for approval");
      setShowAddPlayer(false);
      setNewPlayer({
        site_id: "",
        player_username: "",
        player_email: "",
        platform: "poker"
      });
      await loadData();
    } catch (error) {
      console.error("Error adding player:", error);
      toast.error("Failed to submit player");
    }
  };

  const generateReferralLinks = async (agentId, trackingCode, sitesArray) => {
    try {
      const linksToCreate = sitesArray.map(site => ({
        agent_id: agentId,
        site_id: site.id,
        referral_code: trackingCode,
        custom_url: `${site.affiliate_url}?ref=${trackingCode}`,
        created_date: new Date().toISOString().split('T')[0]
      }));
      
      await Promise.all(linksToCreate.map(link => 
        base44.entities.AgentReferralLink.create(link)
      ));
      
      await loadData();
    } catch (error) {
      console.error("Error generating referral links:", error);
    }
  };

  const copyTrackingLink = (siteId) => {
    const referralLink = referralLinks.find(link => link.site_id === siteId);
    
    if (referralLink) {
      navigator.clipboard.writeText(referralLink.custom_url);
      
      // Track click
      base44.entities.AgentReferralLink.update(referralLink.id, {
        clicks: (referralLink.clicks || 0) + 1
      });
      
      toast.success("Tracking link copied!");
    } else {
      const site = sites.find((s) => s.id === siteId);
      if (site && agent) {
        const trackingLink = `${site.affiliate_url}?ref=${agent.tracking_code}`;
        navigator.clipboard.writeText(trackingLink);
        toast.success("Tracking link copied!");
      } else {
        toast.error("Could not generate tracking link.");
      }
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.player_username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === "all" || player.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || player.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    denied: "bg-red-500/20 text-red-400 border-red-500/30",
    active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };

  const totalRevenue = players.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const activePlayers = players.filter((p) => p.status === "active" || p.status === "approved").length;
  const monthlyRevenue = players.reduce((sum, p) => sum + (p.monthly_revenue || 0), 0);
  const totalCommission = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const pendingCommission = commissions.filter(c => c.payout_status === "pending").reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const totalClicks = referralLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const totalConversions = referralLinks.reduce((sum, l) => sum + (l.conversions || 0), 0);

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>);

  }

  // Allow access for admins OR agents
  if (!user?.is_agent && user?.role !== 'admin') {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Agent Access Required</h1>
          <p className="text-gray-400">This portal is only accessible to approved agents or administrators.</p>
        </div>
      </div>);

  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agent Portal</h1>
            <p className="text-gray-400">
              Welcome back, {agent?.agent_name || user.full_name}
              {user.role === 'admin' && !user.is_agent &&
              <Badge className="ml-3 bg-red-500/20 text-red-400 border-red-500/30">
                  Admin View
                </Badge>
              }
            </p>
            {agent?.tracking_code &&
            <div className="mt-2">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Tracking Code: {agent.tracking_code}
                </Badge>
              </div>
            }
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell players={players} commissions={commissions} />
            <Button
              onClick={() => setShowPaymentRequest(true)}
              disabled={pendingCommission < 100}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Request Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-400" />
                Active Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activePlayers}</div>
              <p className="text-xs text-gray-500 mt-1">of {players.length} total</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">${monthlyRevenue.toFixed(2)} this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Wallet className="w-4 h-4 mr-2 text-yellow-400" />
                Commission Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalCommission.toFixed(2)}</div>
              <p className="text-xs text-yellow-400 mt-1">${pendingCommission.toFixed(2)} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">{totalConversions} of {totalClicks} clicks</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tier" className="data-[state=active]:bg-yellow-500/20">
              My Tier
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-yellow-500/20">
              Players
            </TabsTrigger>
            <TabsTrigger value="commissions" className="data-[state=active]:bg-yellow-500/20">
              Commissions
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-yellow-500/20">
              Reports
            </TabsTrigger>
            <TabsTrigger value="offerings" className="data-[state=active]:bg-yellow-500/20">
              Tracking Links
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-yellow-500/20">
              Support
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Performance Charts */}
              <PerformanceCharts players={players} commissions={commissions} />

              <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowAddPlayer(true)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold justify-start"
                    disabled={!user.agent_id && user.role !== 'admin'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Player
                  </Button>
                  <Button
                    onClick={() => {
                      const link = referralLinks[0];
                      if (link) copyTrackingLink(link.site_id);
                    }}
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Primary Link
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 justify-start"
                    onClick={() => toast.info("Marketing materials coming soon!")}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Download Marketing Kit
                  </Button>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {players
                      .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
                      .slice(0, 5)
                      .map((player) => {
                        const site = sites.find(s => s.id === player.site_id);
                        return (
                          <div key={player.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {player.player_username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-white font-medium">{player.player_username}</div>
                                <div className="text-xs text-gray-400">{site?.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-semibold">${(player.total_revenue || 0).toFixed(2)}</div>
                              <div className="text-xs text-gray-400">total revenue</div>
                            </div>
                          </div>
                        );
                      })}
                    {players.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No players yet. Start by submitting your first player!
                      </div>
                    )}
                    </div>
                    </CardContent>
                    </Card>
                    </div>
                    </div>
                    </TabsContent>

                    {/* Tier Tab */}
                    <TabsContent value="tier">
                    <TierProgressCard
                      agent={agent}
                      playersCount={players.length}
                      totalRevenue={totalRevenue}
                    />
                    </TabsContent>

                    {/* Players Tab */}
          <TabsContent value="players">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Your Players</CardTitle>
                  <Button
                    onClick={() => setShowAddPlayer(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
                    disabled={!user.agent_id && user.role !== 'admin'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Player
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white" />

                  </div>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="poker">Poker</SelectItem>
                      <SelectItem value="casino">Casino</SelectItem>
                      <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Players Table */}
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Site</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Username</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Platform</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Revenue</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Rev Share</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Joined</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => {
                      const site = sites.find((s) => s.id === player.site_id);
                      return (
                        <tr key={player.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white">{site?.name || 'Unknown'}</td>
                          <td className="py-3 px-4 text-white">{player.player_username}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-gray-300 border-gray-600 capitalize">
                              {player.platform}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-green-400 font-semibold">
                            ${(player.total_revenue || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-white">{player.rev_share || 'TBD'}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {player.signup_date ? format(new Date(player.signup_date), 'MMM dd, yyyy') : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={statusColors[player.status]} variant="outline">
                              {player.status}
                            </Badge>
                          </td>
                        </tr>);

                    })}
                  </tbody>
                </table>

                  {filteredPlayers.length === 0 &&
                  <div className="text-center py-12 text-gray-500">
                      No players found matching your filters
                    </div>
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions">
            <div className="space-y-6">
              {/* Commission Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                      <Wallet className="w-4 h-4 mr-2 text-green-400" />
                      Total Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">${totalCommission.toFixed(2)}</div>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                      Pending Payout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400">${pendingCommission.toFixed(2)}</div>
                    <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-400" />
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      ${(monthlyRevenue * (agent?.commission_rate || 0) / 100).toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current period</p>
                  </CardContent>
                </Card>
              </div>

              {/* Commission History */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Commission History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Period</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Player</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Revenue</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Rate</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Commission</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Paid Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissions.length > 0 ? (
                          commissions
                            .sort((a, b) => new Date(b.period_end) - new Date(a.period_end))
                            .map((commission) => {
                              const player = players.find(p => p.id === commission.player_id);
                              const site = sites.find(s => s.id === commission.site_id);
                              return (
                                <tr key={commission.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                  <td className="py-3 px-4 text-white text-sm">
                                    {format(new Date(commission.period_start), 'MMM dd')} - {format(new Date(commission.period_end), 'MMM dd, yyyy')}
                                  </td>
                                  <td className="py-3 px-4 text-white">
                                    <div>{player?.player_username || 'Unknown'}</div>
                                    <div className="text-xs text-gray-400">{site?.name}</div>
                                  </td>
                                  <td className="py-3 px-4 text-gray-300">${commission.revenue_generated.toFixed(2)}</td>
                                  <td className="py-3 px-4 text-gray-300">{commission.commission_rate}%</td>
                                  <td className="py-3 px-4 text-green-400 font-semibold">${commission.commission_amount.toFixed(2)}</td>
                                  <td className="py-3 px-4">
                                    <Badge className={
                                      commission.payout_status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                      commission.payout_status === 'processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                      commission.payout_status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                    } variant="outline">
                                      {commission.payout_status}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-gray-400 text-sm">
                                    {commission.payout_date ? format(new Date(commission.payout_date), 'MMM dd, yyyy') : '-'}
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-gray-500">
                              No commission history yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Info */}
              <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Automated Payout Schedule</h3>
                      <p className="text-gray-300 text-sm mb-2">
                        Commissions are automatically processed on the 1st of each month for the previous month's earnings.
                      </p>
                      <p className="text-gray-400 text-xs">
                        Payment method: {agent?.payment_method || 'Not set'} • Minimum payout: $50
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportGenerator
              players={players}
              commissions={commissions}
              sites={sites}
              agent={agent}
            />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Support Tickets</CardTitle>
                    <Button
                      onClick={() => setShowSupportForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Ticket
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="text-2xl font-bold text-blue-400">{supportTickets.filter(t => t.status === 'open').length}</div>
                      <div className="text-sm text-gray-400">Open</div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <div className="text-2xl font-bold text-yellow-400">{supportTickets.filter(t => t.status === 'in_progress').length}</div>
                      <div className="text-sm text-gray-400">In Progress</div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400">{supportTickets.filter(t => t.status === 'resolved').length}</div>
                      <div className="text-sm text-gray-400">Resolved</div>
                    </div>
                    <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/30">
                      <div className="text-2xl font-bold text-gray-400">{supportTickets.length}</div>
                      <div className="text-sm text-gray-400">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <SupportTicketList tickets={supportTickets} sites={sites} />
            </div>
          </TabsContent>

          {/* Offerings Tab */}
          <TabsContent value="offerings">
            <div className="space-y-6">
              {/* Poker Sites */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    ♠️ Poker Sites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {sites.filter((s) => s.type === 'poker' || s.type.includes('poker')).map((site) => {
                      const linkData = referralLinks.find(l => l.site_id === site.id);
                      return (
                        <div key={site.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            {site.logo_url &&
                              <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-1" />
                            }
                            <div>
                              <h3 className="font-semibold text-white">{site.name}</h3>
                              <p className="text-sm text-gray-400">{site.bonus_offer || 'No bonus available'}</p>
                              {linkData && (
                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                  <span>{linkData.clicks || 0} clicks</span>
                                  <span>•</span>
                                  <span>{linkData.conversions || 0} conversions</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => copyTrackingLink(site.id)}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Casino Sites */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    🎰 Casino Sites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {sites.filter((s) => s.type === 'casino' || s.type.includes('casino')).map((site) => {
                      const linkData = referralLinks.find(l => l.site_id === site.id);
                      return (
                        <div key={site.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            {site.logo_url &&
                              <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-1" />
                            }
                            <div>
                              <h3 className="font-semibold text-white">{site.name}</h3>
                              <p className="text-sm text-gray-400">{site.bonus_offer || 'No bonus available'}</p>
                              {linkData && (
                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                  <span>{linkData.clicks || 0} clicks</span>
                                  <span>•</span>
                                  <span>{linkData.conversions || 0} conversions</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => copyTrackingLink(site.id)}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Sportsbetting Sites */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    ⚽ Sportsbetting Sites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {sites.filter((s) => s.type === 'sportsbetting' || s.type.includes('sportsbetting')).map((site) => {
                      const linkData = referralLinks.find(l => l.site_id === site.id);
                      return (
                        <div key={site.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            {site.logo_url &&
                              <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-1" />
                            }
                            <div>
                              <h3 className="font-semibold text-white">{site.name}</h3>
                              <p className="text-sm text-gray-400">{site.bonus_offer || 'No bonus available'}</p>
                              {linkData && (
                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                  <span>{linkData.clicks || 0} clicks</span>
                                  <span>•</span>
                                  <span>{linkData.conversions || 0} conversions</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => copyTrackingLink(site.id)}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Player Dialog */}
      <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Submit New Player</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPlayer}>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-300">Platform *</Label>
                <Select
                  value={newPlayer.platform}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, platform: value })}>

                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
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
                <Select
                  value={newPlayer.site_id}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, site_id: value })}
                  required>

                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.
                    filter((s) => s.type === newPlayer.platform || s.type.includes(newPlayer.platform)).
                    map((site) =>
                    <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                    )}
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
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required />

              </div>

              <div>
                <Label htmlFor="player_email" className="text-gray-300">Player Email (Optional)</Label>
                <Input
                  id="player_email"
                  type="email"
                  value={newPlayer.player_email}
                  onChange={(e) => setNewPlayer({ ...newPlayer, player_email: e.target.value })}
                  placeholder="player@example.com"
                  className="bg-gray-800 border-gray-700 text-white mt-1" />

              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddPlayer(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800">

                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold">

                Submit Player
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Request Dialog */}
      <PaymentRequestDialog
        open={showPaymentRequest}
        onOpenChange={setShowPaymentRequest}
        pendingAmount={pendingCommission}
        agentId={user?.agent_id}
      />

      {/* Support Ticket Form */}
      <SupportTicketForm
        open={showSupportForm}
        onOpenChange={setShowSupportForm}
        sites={sites}
        agentId={user?.agent_id}
        onTicketCreated={loadData}
      />
    </div>);

}