import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";

const NetworkLogo = ({ logo, name }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="text-2xl font-bold text-white">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="w-full h-full object-contain"
      onError={() => setHasError(true)}
    />
  );
};

export default function PokerNetworks() {
  const networks = [
    {
      id: "gg_network",
      name: "GG Network",
      rooms: "10 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/e50fc940-c332-4bed-a942-1dbb98a559e6",
      description: "One of the largest poker networks globally"
    },
    {
      id: "chico_poker_network",
      name: "Chico Poker Network",
      rooms: "3 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/34530bc7-e2d1-47ef-af07-656892b46e84",
      description: "Popular US-facing network"
    },
    {
      id: "ipoker_network",
      name: "iPoker Network",
      rooms: "19 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/3d3ed418-c058-42be-ae1e-d1c56b843a1b",
      description: "One of the oldest and most established networks"
    },
    {
      id: "winning_poker_network",
      name: "Winning Poker Network",
      rooms: "7 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/136f06c5-e0d3-4e41-a7a3-a16f2d92fed4",
      description: "Features Americas Cardroom and other major sites"
    },
    {
      id: "horizon_poker_network",
      name: "Horizon Poker Network",
      rooms: "2 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/e952e374-9dac-4e51-ac54-9beb7ce45f24",
      description: "Growing network with solid traffic"
    },
    {
      id: "betconstruct_network",
      name: "BetConstruct Network",
      rooms: "2 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/daf1e97e-e588-4f31-b9e9-a187ec47fd34",
      description: "Multi-product platform including poker"
    },
    {
      id: "idnpoker_network",
      name: "IDNPoker Network",
      rooms: "4 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/37d2b879-84f7-4550-8927-81f7db0e5888",
      description: "Dominant in Asian markets"
    },
    {
      id: "paiwangluo_poker_network",
      name: "Paiwangluo Poker Network",
      rooms: "5 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/d3527f72-c2c6-4509-917f-5bf1cf5eab5e",
      description: "Asian-focused poker network"
    },
    {
      id: "gvc_network",
      name: "GVC Network",
      rooms: "6 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/e528d906-0134-47df-bcf5-a3c51f47393d",
      description: "Formerly Bwin Party Network"
    },
    {
      id: "peoples_network",
      name: "Peoples Network",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/b7114cdb-4bee-47a8-9a5b-4961495acd42",
      description: "Specialized network"
    },
    {
      id: "dollaro",
      name: "Dollaro",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/0bdc1d94-dd05-472d-8416-0b8e459a3b6a",
      description: "Emerging network"
    },
    {
      id: "microgaming_poker_network",
      name: "Microgaming Poker Network",
      rooms: "3 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/2b793f24-f58c-431c-914e-b2d58e3f97dd",
      description: "Part of the Microgaming gaming empire"
    },
    {
      id: "grand",
      name: "Grand",
      rooms: "2 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/ce2e7d15-9804-426a-8037-a5d4b9d1f3c8",
      description: "Boutique poker network"
    },
    {
      id: "hive",
      name: "Hive",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/c0afc94f-122a-4fd2-bed7-c7cdb09af3fa",
      description: "Modern poker platform"
    },
    {
      id: "klas_poker_network",
      name: "Klas Poker Network",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/971daafc-0702-427d-b566-acdc5c1fd851",
      description: "Regional network"
    },
    {
      id: "rap",
      name: "RAP",
      rooms: "2 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/89aa60c9-d939-45e3-9dbf-90c37e132747",
      description: "Russian affiliate program"
    },
    {
      id: "ipoker_es_network",
      name: "iPoker.es Network",
      rooms: "0 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/f8a83f74-88d5-4fde-8fd2-32729991814f",
      description: "Spanish-regulated iPoker variant"
    },
    {
      id: "hive_italy",
      name: "Hive Italy",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/ccc8b6cf-6e8e-4cd8-89d1-92cd7171ba60",
      description: "Italian-regulated network"
    },
    {
      id: "tonybet_network",
      name: "Tonybet Network",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/e76be52a-48a3-4079-af28-60312412a106",
      description: "Independent branded network"
    },
    {
      id: "ongame_poker",
      name: "Ongame Poker",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/8cb1fd43-ddbd-47ef-8790-c996c8c52810",
      description: "Legacy poker network"
    },
    {
      id: "revolution_cake",
      name: "Revolution (Cake)",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/f1555fed-7f33-4b66-97d9-3f595e1abffa",
      description: "Formerly Cake Poker Network"
    },
    {
      id: "aconcagua_poker_network",
      name: "Aconcagua Poker Network",
      rooms: "1 poker room",
      logo: "https://cms.worldpokerdeals.com/assets/5337bffa-dbdb-47d4-8798-869e5c4c9bb9",
      description: "South American focused"
    },
    {
      id: "merge_gaming_network",
      name: "Merge Gaming Network",
      rooms: "0 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/fecee69a-aff3-4768-8148-2d0baec27f20",
      description: "Historical poker network"
    },
    {
      id: "independent",
      name: "Independent",
      rooms: "126 poker rooms",
      logo: "https://cms.worldpokerdeals.com/assets/8097c14a-252e-4ffc-b259-50e3321c9909",
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
                      <NetworkLogo logo={network.logo} name={network.name} />
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