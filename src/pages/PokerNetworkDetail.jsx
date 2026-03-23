import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "@/api/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Users, TrendingUp, FileText, Award, Zap, Shield, DollarSign, Globe } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function PokerNetworkDetail() {
  const location = useLocation();
  const [network, setNetwork] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get network ID from URL params
  const urlParams = new URLSearchParams(location.search);
  const networkId = urlParams.get('network');

  const networkData = {
    gg_network: {
      name: "GG Network",
      logo: "https://cms.worldpokerdeals.com/assets/e50fc940-c332-4bed-a942-1dbb98a559e6",
      description: "GG Network is one of the largest and fastest-growing poker networks in the world. Known for its innovative features and massive tournament schedules, GG Network has become a top choice for both recreational and professional players.",
      history: "Founded in 2014, GG Network quickly rose to prominence by focusing on the Asian market before expanding globally. The network is home to GGPoker, which hosts some of the biggest online poker tournaments including WSOP Online events. In recent years, GG Network has partnered with major poker brands and celebrities, establishing itself as a premier destination for online poker.",
      established: 2014,
      headquarters: "Malta",
      features: [
        "Innovative game features like Rush & Cash and Flip & Go",
        "Major tournament series including WSOP Online",
        "Strong player traffic across all time zones",
        "Advanced hand history and HUD restrictions",
        "Multi-table tournament focus"
      ]
    },
    chico_poker_network: {
      name: "Chico Poker Network",
      logo: "https://cms.worldpokerdeals.com/assets/34530bc7-e2d1-47ef-af07-656892b46e84",
      description: "Chico Poker Network is a US-facing network known for soft games and reliable payments. The network has built a strong reputation among American players looking for trustworthy online poker options.",
      history: "Established in 2010, Chico Poker Network emerged as a reliable option for US players after the poker boom. The network includes brands like BetOnline Poker and SportsBetting Poker, which have maintained consistent player traffic and solid reputations over the years. Known for accepting cryptocurrency deposits and offering quick payouts.",
      established: 2010,
      headquarters: "Panama",
      features: [
        "US-friendly poker network",
        "Cryptocurrency payments accepted",
        "Soft player pool",
        "Combined sportsbook and casino offerings",
        "Regular tournament schedules"
      ]
    },
    ipoker_network: {
      name: "iPoker Network",
      logo: "https://cms.worldpokerdeals.com/assets/3d3ed418-c058-42be-ae1e-d1c56b843a1b",
      description: "iPoker is one of the oldest and most established poker networks in the industry. With a large selection of poker rooms and solid player liquidity, it remains a top choice for European players.",
      history: "Launched in 2004 by Playtech, iPoker has been a cornerstone of the online poker industry for nearly two decades. The network survived the 2011 poker crisis and continues to thrive with 19+ poker rooms sharing player pools. Known for its reliability, extensive game selection, and competitive rakeback programs.",
      established: 2004,
      headquarters: "United Kingdom",
      features: [
        "One of the oldest and most trusted networks",
        "19+ poker rooms with shared liquidity",
        "Strong European player base",
        "Extensive cash game and tournament offerings",
        "Regular software updates and improvements"
      ]
    },
    winning_poker_network: {
      name: "Winning Poker Network",
      logo: "https://cms.worldpokerdeals.com/assets/136f06c5-e0d3-4e41-a7a3-a16f2d92fed4",
      description: "Winning Poker Network (WPN) is home to Americas Cardroom and other major brands. Known for its massive tournament guarantees and cryptocurrency-friendly policies, WPN has become the largest US-facing network.",
      history: "WPN was established in 2001 and has grown to become the dominant network for US players. Americas Cardroom, its flagship brand, regularly hosts multi-million dollar tournament series including the OSS (Online Super Series) and Venom tournaments. The network pioneered Bitcoin deposits in online poker and maintains a reputation for innovation.",
      established: 2001,
      headquarters: "Costa Rica",
      features: [
        "Largest US-facing poker network",
        "Massive tournament guarantees (Venom, OSS)",
        "Bitcoin and cryptocurrency friendly",
        "Anonymous tables available",
        "Strong tournament traffic"
      ]
    },
    horizon_poker_network: {
      name: "Horizon Poker Network",
      logo: "https://cms.worldpokerdeals.com/assets/e952e374-9dac-4e51-ac54-9beb7ce45f24",
      description: "Horizon Poker Network is a growing network offering modern poker software and competitive gaming. While smaller than major networks, it provides good liquidity and attractive promotions.",
      history: "A relatively newer network in the industry, Horizon has been steadily building its player base through partnerships with established brands. The network focuses on delivering a solid poker experience with modern features and competitive rakeback deals.",
      established: 2018,
      headquarters: "Curacao",
      features: [
        "Modern poker software",
        "Growing player traffic",
        "Competitive rakeback programs",
        "Mobile-friendly platform",
        "Regular promotional offerings"
      ]
    },
    idnpoker_network: {
      name: "IDNPoker Network",
      logo: "https://cms.worldpokerdeals.com/assets/37d2b879-84f7-4550-8927-81f7db0e5888",
      description: "IDNPoker is the dominant poker network in Asia, offering massive player traffic and unique game variations popular in Asian markets.",
      history: "Founded in 2010, IDNPoker has grown to become the second-largest poker network globally by cash game traffic. The network focuses primarily on Asian markets, offering games in multiple Asian languages and accepting various payment methods popular in the region. Known for its mobile-first approach and recreational player-friendly policies.",
      established: 2010,
      headquarters: "Philippines",
      features: [
        "Dominant in Asian markets",
        "Second-largest network by traffic",
        "Mobile-first platform",
        "Recreational player focused",
        "Multiple Asian languages supported"
      ]
    },
    independent: {
      name: "Independent Poker Sites",
      logo: "https://cms.worldpokerdeals.com/assets/8097c14a-252e-4ffc-b259-50e3321c9909",
      description: "Independent poker sites operate their own software and player pools without joining a network. These sites often offer unique features and exclusive promotions.",
      history: "Independent sites include some of the biggest names in online poker like PokerStars, partypoker, and 888poker. These operators maintain their own software, player bases, and brand identities. While they don't share liquidity with other sites, their large player bases ensure excellent game selection and traffic at all stakes.",
      established: null,
      headquarters: "Various",
      features: [
        "Includes major brands like PokerStars and partypoker",
        "Unique software and features per site",
        "Large independent player pools",
        "Exclusive promotions and loyalty programs",
        "Full control over gaming experience"
      ]
    }
  };

  useEffect(() => {
    loadNetworkData();
  }, [networkId]);

  const loadNetworkData = async () => {
    try {
      const networkInfo = networkData[networkId] || networkData.independent;
      setNetwork(networkInfo);

      // Load all sites
      const allSites = await db.entities.Site.list();
      
      // Filter sites that belong to this network
      const networkSites = allSites.filter(site => {
        if (networkId === 'independent') {
          return site.poker_network === 'independent' || !site.poker_network || site.poker_network === 'no_deal_available';
        }
        return site.poker_network === networkId;
      });

      setSites(networkSites);
    } catch (error) {
      console.error("Error loading network data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!network) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Network Not Found</h1>
          <p className="text-gray-400">The requested poker network could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="w-32 h-32 bg-white/10 rounded-2xl p-4 flex items-center justify-center">
              <img
                src={network.logo}
                alt={network.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                {network.name} Review
              </h1>
              {network.established && (
                <p className="text-slate-400 text-lg">Established {network.established} • {network.headquarters}</p>
              )}
            </div>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed">
            {network.description}
          </p>
        </div>
      </div>

      {/* Sites List Section */}
      <div className="bg-slate-900/50 py-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Poker Sites on {network.name}</h2>
          {sites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site, index) => (
                <Card key={site.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        #{index + 1}
                      </Badge>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                        <span className="font-semibold">{site.rating}</span>
                      </div>
                    </div>
                    
                    {site.logo_url && (
                      <img 
                        src={site.logo_url} 
                        alt={site.name} 
                        className="w-24 h-16 object-contain bg-white/10 rounded p-2 mb-3" 
                      />
                    )}
                    
                    <h3 className="text-white font-bold mb-2">{site.name}</h3>
                    
                    {site.bonus_offer && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-400 mb-1">Bonus</p>
                        <p className="text-sm text-emerald-400 font-semibold">{site.bonus_offer}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Link to={`${createPageUrl('SiteDetail')}?site=${site.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                          Review
                        </Button>
                      </Link>
                      <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white">
                          Sign up
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <p className="text-slate-400">
                  We currently don't have any exclusive deals with sites on this network. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-cyan-400 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Table of Contents
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#network-skins" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Network Skins
                      </a>
                    </li>
                    <li>
                      <a href="#differences" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Differences Between Skins
                      </a>
                    </li>
                    <li>
                      <a href="#best-site" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Best Site on Network
                      </a>
                    </li>
                    <li>
                      <a href="#rakeback" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Rakeback
                      </a>
                    </li>
                    <li>
                      <a href="#rake-structure" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Rake Structure
                      </a>
                    </li>
                    <li>
                      <a href="#games-traffic" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Games and Traffic
                      </a>
                    </li>
                    <li>
                      <a href="#game-softness" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Game Softness
                      </a>
                    </li>
                    <li>
                      <a href="#attitude-pros" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Attitude to Pros
                      </a>
                    </li>
                    <li>
                      <a href="#reliability" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Reliability
                      </a>
                    </li>
                    <li>
                      <a href="#deposits" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Deposits & Cashouts
                      </a>
                    </li>
                    <li>
                      <a href="#software" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Software
                      </a>
                    </li>
                    <li>
                      <a href="#history" className="block py-2 px-3 rounded hover:bg-slate-800 hover:text-cyan-400 transition-colors text-slate-300">
                        Network History
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Back Button */}
              <Link to={createPageUrl("PokerNetworks")} className="mt-6 block">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  ← Back to All Networks
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Network Skins */}
            <section id="network-skins" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center border-b border-slate-700 pb-3">
                    <Globe className="w-6 h-6 text-cyan-400 mr-2" />
                    {network.name} Skins
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} comprises {sites.length} poker {sites.length === 1 ? 'site' : 'sites'}, all sharing the same player pool. 
                      This means you'll find the same games and tournaments regardless of which skin you choose.
                    </p>
                    {sites.length > 0 && (
                      <ul className="list-decimal list-inside space-y-2 ml-4">
                        {sites.map((site, index) => (
                          <li key={site.id}>
                            <Link to={`${createPageUrl('SiteDetail')}?site=${site.id}`} className="text-cyan-400 hover:text-cyan-300">
                              {site.name}
                            </Link>
                            {site.description && ` - ${site.description.slice(0, 100)}...`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Differences Between Skins */}
            <section id="differences" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Differences Between Skins
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      While all skins on {network.name} share the same player pool and software, there are some key differences:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-2 flex items-center">
                          <DollarSign className="w-5 h-5 text-emerald-400 mr-2" />
                          Payment Methods
                        </h3>
                        <p className="text-sm">
                          Different skins may offer different deposit and withdrawal options based on your location. 
                          Some focus on cryptocurrency, while others offer traditional payment methods.
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-2 flex items-center">
                          <Award className="w-5 h-5 text-yellow-400 mr-2" />
                          Promotions & Bonuses
                        </h3>
                        <p className="text-sm">
                          Each skin runs its own promotions and bonus programs. The welcome bonus structure and 
                          ongoing promotions can vary significantly between sites.
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-2 flex items-center">
                          <Zap className="w-5 h-5 text-cyan-400 mr-2" />
                          Rakeback Deals
                        </h3>
                        <p className="text-sm">
                          Rakeback percentages and VIP program structures can differ. Some skins offer fixed rakeback, 
                          while others use tiered loyalty programs.
                        </p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-2 flex items-center">
                          <Globe className="w-5 h-5 text-purple-400 mr-2" />
                          Geographic Focus
                        </h3>
                        <p className="text-sm">
                          Some skins target specific regions and may have better support, payment options, 
                          and promotions for players in those areas.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Best Site on Network */}
            <section id="best-site" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    What is the Best Site on {network.name}?
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      There's no one-size-fits-all answer to this question. The best site depends on your specific needs:
                    </p>
                    
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 my-4">
                      <h3 className="font-bold text-white mb-3">How to Choose the Right Skin:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span><strong>Location:</strong> Choose a skin that accepts players from your country and offers convenient payment methods.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span><strong>Rakeback:</strong> Compare rakeback deals and loyalty programs across different skins.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span><strong>Bonuses:</strong> Look at welcome bonuses and ongoing promotions that match your play style.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span><strong>Support:</strong> Consider the quality of customer support and available languages.</span>
                        </li>
                      </ul>
                    </div>

                    <p>
                      All skins on {network.name} share the same player pool, so you'll have access to the same games 
                      and traffic regardless of which site you choose. The decision comes down to which offers the best 
                      overall package for your specific situation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Rakeback */}
            <section id="rakeback" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    {network.name} Rakeback
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} offers competitive rakeback programs designed to reward regular players. 
                      The network uses a combination of VIP programs, rakeback deals, and promotional races.
                    </p>
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 my-4">
                      <h3 className="font-bold text-white mb-3 flex items-center">
                        <Award className="w-5 h-5 text-green-400 mr-2" />
                        Typical Rakeback Structure:
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span>Base Rakeback:</span>
                          <span className="font-semibold text-green-400">20-35%</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>VIP Program:</span>
                          <span className="font-semibold text-green-400">Up to 65%</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Special Deals:</span>
                          <span className="font-semibold text-green-400">Negotiable</span>
                        </li>
                      </ul>
                    </div>

                    <p>
                      The exact rakeback percentage depends on your volume, the skin you choose, and any special 
                      deals negotiated through affiliate programs. Contact us for personalized rakeback offers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Rake Structure */}
            <section id="rake-structure" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Rake Structure
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} uses a competitive rake structure designed to balance site profitability with 
                      player value. The rake varies by game type and stakes.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-3">Cash Games</h3>
                        <ul className="space-y-2 text-sm">
                          <li>• Rake: 2.5% - 5%</li>
                          <li>• Cap: $3 - $5 (stakes dependent)</li>
                          <li>• Method: Contributed rake</li>
                        </ul>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-3">Tournaments</h3>
                        <ul className="space-y-2 text-sm">
                          <li>• Fee: 5% - 10%</li>
                          <li>• Major series: Reduced fees</li>
                          <li>• Satellites: Varied structure</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400">
                      Note: Rake structures may vary slightly between different skins on the network. 
                      Always check the specific site's rake structure before playing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Games and Traffic */}
            <section id="games-traffic" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Games and Traffic
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} offers a wide variety of poker games with solid traffic at most stakes. 
                      The shared player pool ensures game availability around the clock.
                    </p>
                    
                    <div className="my-6">
                      <h3 className="font-bold text-white mb-4">Available Games:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                          <p className="font-semibold">No Limit Hold'em</p>
                          <p className="text-sm text-slate-400 mt-1">Most Popular</p>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                          <p className="font-semibold">Pot Limit Omaha</p>
                          <p className="text-sm text-slate-400 mt-1">Growing Action</p>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                          <p className="font-semibold">Tournaments</p>
                          <p className="text-sm text-slate-400 mt-1">24/7 Schedule</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <p className="font-semibold">Omaha Hi/Lo</p>
                          <p className="text-sm text-slate-400 mt-1">Select Stakes</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <p className="font-semibold">7 Card Stud</p>
                          <p className="text-sm text-slate-400 mt-1">Limited</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <p className="font-semibold">Mixed Games</p>
                          <p className="text-sm text-slate-400 mt-1">Higher Stakes</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">Peak Traffic Times:</h3>
                      <p className="text-sm">
                        Best action typically during evening hours (US/Europe time zones). Weekend traffic is strong 
                        across all stakes, with major tournament series drawing thousands of players.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Game Softness */}
            <section id="game-softness" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Game Softness
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} is known for maintaining a good balance of recreational and professional players. 
                      The network implements various measures to keep games attractive for all player types.
                    </p>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 my-4">
                      <h3 className="font-bold text-white mb-3">Player Mix:</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Recreational Players</span>
                            <span className="font-semibold text-green-400">60-70%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{width: '65%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Semi-Professional</span>
                            <span className="font-semibold text-yellow-400">20-25%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{width: '22%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Professional Grinders</span>
                            <span className="font-semibold text-red-400">10-15%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-red-400 h-2 rounded-full" style={{width: '12%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p>
                      Games are generally soft at low to mid stakes, with increased competition at higher limits. 
                      Tournament fields tend to be softer than cash games, especially during major series.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Attitude Towards Professionals */}
            <section id="attitude-pros" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Attitude Towards Professional Players
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} maintains a balanced approach to professional players, implementing policies 
                      that protect recreational players while still allowing skilled players to operate.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-white mb-2">Multi-Tabling Limits</h3>
                          <p className="text-sm">
                            Table limits vary by skin but generally allow 4-6 tables for cash games. 
                            Tournament multi-tabling is typically unrestricted.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-white mb-2">HUD and Third-Party Tools</h3>
                          <p className="text-sm">
                            Policies vary by network. Some allow basic HUDs, while others implement stricter 
                            regulations. Check with your specific skin for current policies.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-white mb-2">Account Restrictions</h3>
                          <p className="text-sm">
                            Winning players are generally welcomed, though extreme game selection or predatory 
                            behavior may be monitored. Fair play policies are enforced network-wide.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Reliability */}
            <section id="reliability" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Reliability and Trustworthiness
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} has built a solid reputation in the online poker industry. The network is licensed 
                      and regulated, ensuring player protection and fair gaming.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 my-6">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h3 className="font-bold text-white mb-1">Licensed</h3>
                        <p className="text-sm text-slate-400">Regulated jurisdiction</p>
                      </div>
                      
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h3 className="font-bold text-white mb-1">Proven Track Record</h3>
                        <p className="text-sm text-slate-400">{network.established && `${new Date().getFullYear() - network.established}+ years`}</p>
                      </div>
                      
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h3 className="font-bold text-white mb-1">Fast Payouts</h3>
                        <p className="text-sm text-slate-400">Timely withdrawals</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400">
                      All skins on the network are subject to regular audits and maintain segregated player funds. 
                      The network has a clean history of honoring withdrawals and maintaining fair gaming standards.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Deposits and Cashouts */}
            <section id="deposits" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Deposits and Cashouts
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      {network.name} offers a variety of deposit and withdrawal methods, with availability varying 
                      by skin and geographic location.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-6">
                      <div>
                        <h3 className="font-bold text-white mb-3 flex items-center">
                          <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                          Common Deposit Methods:
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Bitcoin & Cryptocurrencies
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Credit/Debit Cards
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            E-Wallets (Skrill, Neteller)
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Bank Transfers
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Prepaid Vouchers
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold text-white mb-3 flex items-center">
                          <DollarSign className="w-5 h-5 text-cyan-400 mr-2" />
                          Processing Times:
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center justify-between">
                            <span>Deposits:</span>
                            <span className="font-semibold text-green-400">Instant</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>Crypto Withdrawals:</span>
                            <span className="font-semibold text-cyan-400">24-48 hours</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>E-Wallet Withdrawals:</span>
                            <span className="font-semibold text-cyan-400">2-5 days</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>Bank Transfers:</span>
                            <span className="font-semibold text-yellow-400">5-10 days</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <p className="text-sm">
                        <strong>Note:</strong> Withdrawal times and available methods vary by skin and country. 
                        Cryptocurrency options typically offer the fastest processing times and lowest fees.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Software */}
            <section id="software" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3">
                    Software Review
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>
                      All sites on {network.name} use the same core poker software, ensuring a consistent playing 
                      experience across different skins. The software is available for desktop and mobile devices.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-3">Desktop Client</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Windows & Mac compatible
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Modern, intuitive interface
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Customizable table layouts
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Multi-table support
                          </li>
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-bold text-white mb-3">Mobile App</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            iOS & Android apps
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Full game selection
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Optimized for touch
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            Quick seat features
                          </li>
                        </ul>
                      </div>
                    </div>

                    <p>
                      The software is regularly updated with new features and improvements. Performance is generally 
                      solid, though some players report occasional connectivity issues during peak times.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* History */}
            <section id="history" className="scroll-mt-24">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-3 flex items-center">
                    <TrendingUp className="w-6 h-6 text-cyan-400 mr-2" />
                    {network.name} History
                  </h2>
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <p>{network.history}</p>
                    
                    {network.established && (
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 my-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-3xl font-bold text-cyan-400 mb-1">{network.established}</p>
                            <p className="text-sm text-slate-400">Founded</p>
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-cyan-400 mb-1">{sites.length}</p>
                            <p className="text-sm text-slate-400">Active Skins</p>
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-cyan-400 mb-1">{new Date().getFullYear() - network.established}+</p>
                            <p className="text-sm text-slate-400">Years Operating</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p>
                      Today, {network.name} continues to be a major player in the online poker industry, offering 
                      reliable gaming, competitive rakeback, and innovative features that attract players worldwide.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to Join {network.name}?
                </h2>
                <p className="text-slate-300 mb-6">
                  Choose your preferred skin and start playing today. All sites share the same player pool, 
                  so you'll always find action at your stakes.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {sites.slice(0, 3).map((site) => (
                    <a key={site.id} href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold">
                        Play at {site.name}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}