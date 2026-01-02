import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Image, TrendingUp, Plus, Search, FileText, Video, Layout, Sparkles } from "lucide-react";
import { toast } from "sonner";
import MarketingAssetLibrary from "../components/marketing/MarketingAssetLibrary";
import MarketingRequestForm from "../components/marketing/MarketingRequestForm";
import CampaignPerformance from "../components/marketing/CampaignPerformance";
import AIMarketingAssistant from "../components/marketing/AIMarketingAssistant";

export default function MarketingHub() {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [assets, setAssets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sites, setSites] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (!currentUser.is_agent && currentUser.role !== 'admin') {
        toast.error("Agent access required");
        return;
      }

      const [agentData, allAssets, agentCampaigns, agentRequests, allSites, agentPlayers] = await Promise.all([
        base44.entities.Agent.filter({ agent_email: currentUser.email }),
        base44.entities.MarketingAsset.list('-created_date'),
        currentUser.agent_id ? 
          base44.entities.MarketingCampaign.filter({ agent_id: currentUser.agent_id }) : [],
        currentUser.agent_id ?
          base44.entities.MarketingRequest.filter({ agent_id: currentUser.agent_id }) : [],
        base44.entities.Site.list(),
        currentUser.agent_id ?
          base44.entities.AgentPlayer.filter({ agent_id: currentUser.agent_id }) : []
      ]);

      if (agentData.length > 0) {
        setAgent(agentData[0]);
      }

      setAssets(allAssets);
      setCampaigns(agentCampaigns);
      setRequests(agentRequests);
      setSites(allSites);
      setPlayers(agentPlayers);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load marketing data");
    } finally {
      setLoading(false);
    }
  };

  const totalDownloads = assets.reduce((sum, a) => sum + (a.download_count || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user?.is_agent && user?.role !== 'admin') {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Agent Access Required</h1>
          <p className="text-gray-400">This hub is only accessible to approved agents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marketing Hub</h1>
            <p className="text-gray-400">Professional marketing assets and campaign tools</p>
          </div>
          <Button
            onClick={() => setShowRequestForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Custom Asset
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Image className="w-4 h-4 mr-2 text-blue-400" />
                Available Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{assets.length}</div>
              <p className="text-xs text-gray-500 mt-1">{totalDownloads} downloads</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{activeCampaigns}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-purple-400" />
                Custom Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{requests.length}</div>
              <p className="text-xs text-yellow-400 mt-1">{pendingRequests} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Layout className="w-4 h-4 mr-2 text-cyan-400" />
                Asset Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">7</div>
              <p className="text-xs text-gray-500 mt-1">Categories available</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-purple-500/20">
              Asset Library
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-500/20">
              Campaign Performance
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-purple-500/20">
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <AIMarketingAssistant
              sites={sites}
              agent={agent}
              players={players}
              campaigns={campaigns}
            />
          </TabsContent>

          <TabsContent value="library">
            <MarketingAssetLibrary 
              assets={assets} 
              agent={agent}
              onDownload={loadData}
            />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignPerformance 
              campaigns={campaigns}
              assets={assets}
            />
          </TabsContent>

          <TabsContent value="requests">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Custom Asset Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length > 0 ? (
                  <div className="space-y-3">
                    {requests.map(request => (
                      <div key={request.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{request.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{request.description}</p>
                            <div className="flex gap-2 text-xs">
                              <Badge variant="outline" className="capitalize">
                                {request.request_type}
                              </Badge>
                              <Badge className={
                                request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                request.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                request.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }>
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                          {request.completed_asset_url && (
                            <Button size="sm" asChild>
                              <a href={request.completed_asset_url} download>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No custom requests yet</p>
                    <Button
                      onClick={() => setShowRequestForm(true)}
                      variant="outline"
                      className="mt-4 border-gray-700 text-gray-300"
                    >
                      Create First Request
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Form Dialog */}
      <MarketingRequestForm
        open={showRequestForm}
        onOpenChange={setShowRequestForm}
        agentId={user?.agent_id}
        onRequestCreated={loadData}
      />
    </div>
  );
}