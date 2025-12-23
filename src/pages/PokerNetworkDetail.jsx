import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Users, TrendingUp } from "lucide-react";
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
      const allSites = await base44.entities.Site.list();
      
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-white/10 rounded-full p-4 flex items-center justify-center">
              <img
                src={network.logo}
                alt={network.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {network.name}
              </h1>
              {network.established && (
                <p className="text-slate-400">Established {network.established} • {network.headquarters}</p>
              )}
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-4xl">
            {network.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* History Section */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  Network History
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {network.history}
                </p>
              </CardContent>
            </Card>

            {/* Sites Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-cyan-400" />
                Poker Sites with Deals ({sites.length})
              </h2>
              
              {sites.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {sites.map((site) => (
                    <Card key={site.id} className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          {site.logo_url && (
                            <img 
                              src={site.logo_url} 
                              alt={site.name} 
                              className="w-16 h-16 object-contain bg-white rounded p-2" 
                            />
                          )}
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                            <span className="font-semibold">{site.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2">{site.name}</h3>
                        
                        {site.bonus_offer && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-3">
                            {site.bonus_offer}
                          </Badge>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Link to={`${createPageUrl('SiteDetail')}?site=${site.id}`} className="flex-1">
                            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                              View Details
                            </Button>
                          </Link>
                          <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
                              Sign Up
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-slate-900 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-400">
                      We currently don't have any exclusive deals with sites on this network. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Features */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {network.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Link to={createPageUrl("PokerNetworks")}>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                ← Back to All Networks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}