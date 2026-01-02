import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Copy, Download, Wand2, TrendingUp, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function AIMarketingAssistant({ sites, agent, players, campaigns }) {
  const [activeTab, setActiveTab] = useState("copy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  
  // Copy Generation State
  const [selectedSite, setSelectedSite] = useState("");
  const [copyType, setCopyType] = useState("email");
  const [copyTone, setCopyTone] = useState("professional");
  const [additionalContext, setAdditionalContext] = useState("");

  // Strategy State
  const [strategyGoal, setStrategyGoal] = useState("player_acquisition");
  const [strategyBudget, setStrategyBudget] = useState("medium");

  // Banner State
  const [bannerPlatform, setBannerPlatform] = useState("facebook");
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerSite, setBannerSite] = useState("");

  const generateCopy = async () => {
    if (!selectedSite) {
      toast.error("Please select a site");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      const site = sites.find(s => s.id === selectedSite);
      const prompt = `You are an expert copywriter for iGaming affiliate marketing.

Generate ${copyType} promotional copy for ${site.name} with the following details:
- Site Type: ${site.type}
- Bonus Offer: ${site.bonus_offer || 'Various promotions available'}
- Highlights: ${site.highlights?.join(', ') || 'Top gaming site'}
- Tone: ${copyTone}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

${copyType === 'email' ? 'Include subject line, greeting, body with clear value proposition, call-to-action, and signature placeholder.' : ''}
${copyType === 'social' ? 'Create 3 variations for different social platforms (Facebook, Twitter, Instagram). Keep them concise and engaging with appropriate hashtags.' : ''}
${copyType === 'landing' ? 'Write compelling landing page copy including headline, subheadline, 3 benefit points, and strong CTA.' : ''}
${copyType === 'ad' ? 'Create 3 short ad copy variations (50 words max each) for PPC campaigns.' : ''}

Make it persuasive, clear, and focused on converting players.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setResult(response);
      toast.success("Copy generated successfully!");
    } catch (error) {
      console.error("Error generating copy:", error);
      toast.error("Failed to generate copy");
    } finally {
      setLoading(false);
    }
  };

  const generateStrategy = async () => {
    setLoading(true);
    setResult("");
    try {
      // Aggregate player demographics
      const playerPlatforms = players.reduce((acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
      }, {});

      const avgRevenue = players.length > 0 
        ? players.reduce((sum, p) => sum + (p.total_revenue || 0), 0) / players.length
        : 0;

      const activePlayers = players.filter(p => p.status === 'active' || p.status === 'approved').length;

      const prompt = `You are a performance marketing strategist for iGaming affiliates.

Based on the following data, suggest a comprehensive marketing strategy:

CURRENT PERFORMANCE:
- Total Players: ${players.length}
- Active Players: ${activePlayers}
- Average Revenue per Player: $${avgRevenue.toFixed(2)}
- Player Distribution: ${Object.entries(playerPlatforms).map(([k,v]) => `${k}: ${v}`).join(', ')}
- Active Campaigns: ${campaigns.filter(c => c.status === 'active').length}

GOAL: ${strategyGoal.replace('_', ' ')}
BUDGET: ${strategyBudget}

Provide:
1. Top 3 recommended marketing channels with rationale
2. Content strategy and messaging approach
3. Budget allocation recommendations
4. Key metrics to track
5. Quick wins (actions to take this week)
6. Long-term initiatives (3-6 months)

Be specific, data-driven, and actionable.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setResult(response);
      toast.success("Strategy generated!");
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast.error("Failed to generate strategy");
    } finally {
      setLoading(false);
    }
  };

  const generateBannerDesign = async () => {
    if (!bannerMessage || !bannerSite) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      const site = sites.find(s => s.id === bannerSite);
      
      const platformSizes = {
        facebook: "1200x628",
        instagram: "1080x1080",
        google: "728x90",
        display: "300x250",
        twitter: "1200x675"
      };

      const prompt = `Create a banner ad design concept for ${site.name}.

Platform: ${bannerPlatform} (${platformSizes[bannerPlatform]})
Main Message: ${bannerMessage}
Site Info: ${site.bonus_offer || 'Premium gaming experience'}

Provide a detailed design brief including:
1. Layout Structure - describe element placement and hierarchy
2. Color Palette - primary, secondary, accent colors that match gaming/casino aesthetics
3. Typography - font suggestions for headline and body
4. Visual Elements - icons, graphics, imagery recommendations
5. Call-to-Action - button text and placement
6. Design Tips - specific advice for maximum impact

Format this as a clear design specification that a graphic designer can implement.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setResult(response);
      toast.success("Banner design concept created!");
    } catch (error) {
      console.error("Error generating banner:", error);
      toast.error("Failed to generate banner design");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-marketing-${activeTab}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    toast.success("Downloaded!");
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI Marketing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 mb-6 grid grid-cols-3 w-full">
            <TabsTrigger value="copy" className="data-[state=active]:bg-purple-500/20">
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Copy
            </TabsTrigger>
            <TabsTrigger value="strategy" className="data-[state=active]:bg-purple-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="banner" className="data-[state=active]:bg-purple-500/20">
              <ImageIcon className="w-4 h-4 mr-2" />
              Banner Design
            </TabsTrigger>
          </TabsList>

          {/* Copy Generation Tab */}
          <TabsContent value="copy">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Select Site *</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Choose a site to promote" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} - {site.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Copy Type</Label>
                  <Select value={copyType} onValueChange={setCopyType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="social">Social Media Posts</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="ad">PPC Ad Copy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Tone</Label>
                  <Select value={copyTone} onValueChange={setCopyTone}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="exciting">Exciting & Bold</SelectItem>
                      <SelectItem value="luxury">Luxury & Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Additional Context (Optional)</Label>
                <Textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Any specific details, promotions, or audience info..."
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  rows={3}
                />
              </div>

              <Button
                onClick={generateCopy}
                disabled={loading || !selectedSite}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Copy
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy">
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{players.length}</div>
                      <div className="text-xs text-gray-400">Total Players</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{campaigns.filter(c => c.status === 'active').length}</div>
                      <div className="text-xs text-gray-400">Active Campaigns</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">{agent?.tier || 'bronze'}</div>
                      <div className="text-xs text-gray-400">Tier Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Primary Goal</Label>
                  <Select value={strategyGoal} onValueChange={setStrategyGoal}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="player_acquisition">Player Acquisition</SelectItem>
                      <SelectItem value="revenue_growth">Revenue Growth</SelectItem>
                      <SelectItem value="engagement">Player Engagement</SelectItem>
                      <SelectItem value="retention">Player Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Budget Level</Label>
                  <Select value={strategyBudget} onValueChange={setStrategyBudget}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low ($0-500/month)</SelectItem>
                      <SelectItem value="medium">Medium ($500-2000/month)</SelectItem>
                      <SelectItem value="high">High ($2000+/month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateStrategy}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Strategy
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Banner Design Tab */}
          <TabsContent value="banner">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Platform *</Label>
                <Select value={bannerPlatform} onValueChange={setBannerPlatform}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook (1200x628)</SelectItem>
                    <SelectItem value="instagram">Instagram (1080x1080)</SelectItem>
                    <SelectItem value="google">Google Display (728x90)</SelectItem>
                    <SelectItem value="display">Display Ad (300x250)</SelectItem>
                    <SelectItem value="twitter">Twitter (1200x675)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Site to Promote *</Label>
                <Select value={bannerSite} onValueChange={setBannerSite}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Main Message *</Label>
                <Textarea
                  value={bannerMessage}
                  onChange={(e) => setBannerMessage(e.target.value)}
                  placeholder="e.g., 'Get 100% Welcome Bonus up to $1000' or 'Join the Best Poker Site'"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  rows={2}
                />
              </div>

              <Button
                onClick={generateBannerDesign}
                disabled={loading || !bannerMessage || !bannerSite}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate Design Brief
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Results Display */}
        {result && (
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Generated Content</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="border-gray-600 text-gray-300"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadResult}
                    className="border-gray-600 text-gray-300"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  className="text-gray-300"
                  components={{
                    h1: ({ children }) => <h1 className="text-white text-xl font-bold mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-white text-lg font-semibold mb-2 mt-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-white text-base font-semibold mb-2 mt-3">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                    code: ({ children }) => <code className="bg-gray-900 px-1 py-0.5 rounded text-cyan-400">{children}</code>,
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}