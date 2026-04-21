import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { getOperatorLogo } from "@/data/operatorLogos";

const NetworkLogo = ({ src, name }) => {
  const [error, setError] = React.useState(false);

  if (error || !src) {
    return <div className="text-2xl font-bold text-white">{name.charAt(0)}</div>;
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-contain"
      onError={() => setError(true)}
    />
  );
};

export default function PokerNetworks() {
  const networks = [
    {
      id: "gg_network",
      name: "GG Network",
      rooms: "10 poker rooms",
      logo: getOperatorLogo("ggpoker"),
      description: "One of the largest poker networks globally"
    },
    {
      id: "chico_poker_network",
      name: "Chico Poker Network",
      rooms: "3 poker rooms",
      logo: getOperatorLogo("betonline"),
      description: "Popular US-facing network"
    },
    {
      id: "ipoker_network",
      name: "iPoker Network",
      rooms: "19 poker rooms",
      logo: getOperatorLogo("ladbrokes"),
      description: "One of the oldest and most established networks"
    },
    {
      id: "winning_poker_network",
      name: "Winning Poker Network",
      rooms: "7 poker rooms",
      logo: getOperatorLogo("acr-poker"),
      description: "Features Americas Cardroom and other major sites"
    },
    {
      id: "horizon_poker_network",
      name: "Horizon Poker Network",
      rooms: "2 poker rooms",
      logo: getOperatorLogo("everygame"),
      description: "Growing network with solid traffic"
    },
    {
      id: "betconstruct_network",
      name: "BetConstruct Network",
      rooms: "2 poker rooms",
      logo: null,
      description: "Multi-product platform including poker"
    },
    {
      id: "idnpoker_network",
      name: "IDNPoker Network",
      rooms: "4 poker rooms",
      logo: null,
      description: "Dominant in Asian markets"
    },
    {
      id: "paiwangluo_poker_network",
      name: "Paiwangluo Poker Network",
      rooms: "5 poker rooms",
      logo: null,
      description: "Asian-focused poker network"
    },
    {
      id: "gvc_network",
      name: "GVC Network",
      rooms: "6 poker rooms",
      logo: getOperatorLogo("bwin"),
      description: "Formerly Bwin Party Network"
    },
    {
      id: "peoples_network",
      name: "Peoples Network",
      rooms: "1 poker room",
      logo: null,
      description: "Specialized network"
    },
    {
      id: "dollaro",
      name: "Dollaro",
      rooms: "1 poker room",
      logo: null,
      description: "Emerging network"
    },
    {
      id: "microgaming_poker_network",
      name: "Microgaming Poker Network",
      rooms: "3 poker rooms",
      logo: null,
      description: "Part of the Microgaming gaming empire"
    },
    {
      id: "grand",
      name: "Grand",
      rooms: "2 poker rooms",
      logo: null,
      description: "Boutique poker network"
    },
    {
      id: "hive",
      name: "Hive",
      rooms: "1 poker room",
      logo: null,
      description: "Modern poker platform"
    },
    {
      id: "klas_poker_network",
      name: "Klas Poker Network",
      rooms: "1 poker room",
      logo: null,
      description: "Regional network"
    },
    {
      id: "rap",
      name: "RAP",
      rooms: "2 poker rooms",
      logo: null,
      description: "Russian affiliate program"
    },
    {
      id: "ipoker_es_network",
      name: "iPoker.es Network",
      rooms: "0 poker rooms",
      logo: null,
      description: "Spanish-regulated iPoker variant"
    },
    {
      id: "hive_italy",
      name: "Hive Italy",
      rooms: "1 poker room",
      logo: null,
      description: "Italian-regulated network"
    },
    {
      id: "tonybet_network",
      name: "Tonybet Network",
      rooms: "1 poker room",
      logo: null,
      description: "Independent branded network"
    },
    {
      id: "ongame_poker",
      name: "Ongame Poker",
      rooms: "1 poker room",
      logo: null,
      description: "Legacy poker network"
    },
    {
      id: "revolution_cake",
      name: "Revolution (Cake)",
      rooms: "1 poker room",
      logo: null,
      description: "Formerly Cake Poker Network"
    },
    {
      id: "aconcagua_poker_network",
      name: "Aconcagua Poker Network",
      rooms: "1 poker room",
      logo: null,
      description: "South American focused"
    },
    {
      id: "merge_gaming_network",
      name: "Merge Gaming Network",
      rooms: "0 poker rooms",
      logo: null,
      description: "Historical poker network"
    },
    {
      id: "independent",
      name: "Independent",
      rooms: "126 poker rooms",
      logo: null,
      description: "Standalone poker sites not part of a network"
    }
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Online Poker Networks
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Rating of popular online poker networks by AceRakeback
          </p>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {networks.map((network, index) => (
            <Link 
              key={index}
              to={`${createPageUrl('PokerNetworkDetail')}?network=${network.id}`}
            >
              <Card 
                className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all group cursor-pointer"
              >
                <CardContent className="p-6">
                  {/* Logo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-20 h-20 bg-white/10 rounded-full p-3 flex items-center justify-center overflow-hidden">
                      <NetworkLogo src={network.logo} name={network.name} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Network Name */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {network.name}
                  </h3>

                  {/* Rooms Count */}
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-3">
                    {network.rooms}
                  </Badge>

                  {/* Description */}
                  <p className="text-slate-400 text-sm">
                    {network.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-slate-900/50 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              What Are Poker Networks?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Poker networks are groups of online poker sites that share player pools, software, and infrastructure. 
              This allows smaller poker brands to offer robust games and tournaments by pooling players from multiple sites.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Playing on a network means you'll find more game variety, bigger tournaments, and better traffic - 
              especially at non-peak hours. Each site on the network maintains its own branding, bonuses, and rakeback deals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}