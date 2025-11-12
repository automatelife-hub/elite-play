
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
import { Users, TrendingUp, DollarSign, Link as LinkIcon, Plus, Search, Copy } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AgentPortal() {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

      const [agentData, agentPlayers, allSites] = await Promise.all([
      base44.entities.Agent.filter({ agent_email: currentUser.email }),
      currentUser.agent_id ?
      base44.entities.AgentPlayer.filter({ agent_id: currentUser.agent_id }) :
      [], // If admin doesn't have an agent_id, show no players initially
      base44.entities.Site.list()]
      );

      if (agentData.length > 0) {
        setAgent(agentData[0]);
      }
      setPlayers(agentPlayers);
      setSites(allSites);
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
      if (!user.agent_id) {
        toast.error("Admin cannot add players directly without an associated agent ID.");
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

  const copyTrackingLink = (siteId) => {
    const site = sites.find((s) => s.id === siteId);
    if (site && agent) {
      const trackingLink = `${site.affiliate_url}?ref=${agent.tracking_code}`;
      navigator.clipboard.writeText(trackingLink);
      toast.success("Tracking link copied!");
    } else if (site && user?.role === 'admin') {
      // Admins might want to copy a generic link if they don't have an agent tracking code
      const trackingLink = `${site.affiliate_url}`; // No ref code for generic admin link
      navigator.clipboard.writeText(trackingLink);
      toast.success("Generic tracking link copied! (Admin View)");
    } else
    {
      toast.error("Could not generate tracking link.");
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
        <div className="mb-8">
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                Commission Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {agent?.commission_rate || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Your rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="players" className="data-[state=active]:bg-yellow-500/20">
              Tracking Links
            </TabsTrigger>
            <TabsTrigger value="offerings" className="data-[state=active]:bg-yellow-500/20">
              Our Offerings
            </TabsTrigger>
          </TabsList>

          {/* Players Tab */}
          <TabsContent value="players">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Your Players</CardTitle>
                  <Button
                    onClick={() => setShowAddPlayer(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
                    disabled={user.role === 'admin' && !user.is_agent} // Disable for admins without agent_id
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
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Rev Share</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date Created</th>
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
                    {sites.filter((s) => s.type === 'poker' || s.type.includes('poker')).map((site) =>
                    <div key={site.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          {site.logo_url &&
                        <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-1" />
                        }
                          <div>
                            <h3 className="font-semibold text-white">{site.name}</h3>
                            <p className="text-sm text-gray-400">{site.bonus_offer || 'No bonus available'}</p>
                          </div>
                        </div>
                        <Button
                        onClick={() => copyTrackingLink(site.id)}
                        variant="outline" className="bg-sky-600 text-slate-50 px-4 py-2 text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-10 border-gray-700 hover:bg-gray-700">


                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    )}
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
                    {sites.filter((s) => s.type === 'casino' || s.type.includes('casino')).map((site) =>
                    <div key={site.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          {site.logo_url &&
                        <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-1" />
                        }
                          <div>
                            <h3 className="font-semibold text-white">{site.name}</h3>
                            <p className="text-sm text-gray-400">{site.bonus_offer || 'No bonus available'}</p>
                          </div>
                        </div>
                        <Button
                        onClick={() => copyTrackingLink(site.id)}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-700">

                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    )}
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
                    {sites.filter((s) => s.type === 'sportsbetting' || s.type.includes('sportsbetting')).map((site) =>
                    <div key={site.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          {site.logo_url &&
                        <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-1" />
                        }
                          <div>
                            <h3 className="font-semibold text-white">{site.name}</h3>
                            <p className="text-sm text-gray-400">{site.bonus_offer || 'No bonus available'}</p>
                          </div>
                        </div>
                        <Button
                        onClick={() => copyTrackingLink(site.id)}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-700">

                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    )}
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
    </div>);

}