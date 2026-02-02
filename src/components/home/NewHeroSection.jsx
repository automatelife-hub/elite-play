import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Gift, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function NewHeroSection({ sites, loading, userCountry }) {
  const [showClubApps, setShowClubApps] = useState(false);
  const [clubApps, setClubApps] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(false);

  useEffect(() => {
    if (showClubApps && clubApps.length === 0) {
      loadClubApps();
    }
  }, [showClubApps]);

  const loadClubApps = async () => {
    setLoadingClubs(true);
    try {
      const allSites = await base44.entities.Site.list('-rating');
      const clubs = allSites.filter(site => site.is_club_based_app === true);
      setClubApps(clubs);
    } catch (error) {
      console.error("Error loading club apps:", error);
    } finally {
      setLoadingClubs(false);
    }
  };

  const displaySites = showClubApps ? clubApps.slice(0, 5) : (sites?.slice(0, 5) || []);
  const isLoading = showClubApps ? loadingClubs : loading;

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Poker/Casino Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Floating Card Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl text-red-500/20 animate-pulse">♥</div>
        <div className="absolute top-40 left-1/4 text-5xl text-white/10 animate-pulse" style={{animationDelay: '0.5s'}}>♠</div>
        <div className="absolute bottom-32 left-16 text-7xl text-red-500/15 animate-pulse" style={{animationDelay: '1s'}}>♦</div>
        <div className="absolute top-28 right-1/3 text-4xl text-white/10 animate-pulse" style={{animationDelay: '0.3s'}}>♣</div>
        <div className="absolute bottom-20 left-1/3 text-5xl text-emerald-500/15 animate-pulse" style={{animationDelay: '0.7s'}}>♠</div>
      </div>
      
      {/* Glowing orbs for ambiance */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/70 to-gray-950/90" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="pt-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Your Premium<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">iGaming Partner</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light leading-relaxed max-w-xl">
              Premium deals, expert guidance, and the best rakeback offers across poker, casino, and sportsbetting.
            </p>

            <ul className="space-y-5 mb-12">
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-emerald-400 mr-4 text-xl">✓</span>
                24/7 player & agent support
              </li>
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-emerald-400 mr-4 text-xl">✓</span>
                Top rakeback & VIP deals
              </li>
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-emerald-400 mr-4 text-xl">✓</span>
                50+ verified sites
              </li>
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-emerald-400 mr-4 text-xl">✓</span>
                Affiliate programs available
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Reviews")}>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold px-10 py-7 text-lg shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 transform hover:scale-105">
                  Explore Sites
                </Button>
              </Link>
              <Link to={createPageUrl("BecomeAgent")}>
                <Button variant="outline" className="border-2 border-emerald-500/70 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 px-10 py-7 text-lg font-bold transition-all duration-300">
                  Start an Agency
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Rooms List */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-gray-800">
              <button
                onClick={() => setShowClubApps(false)}
                className={`px-6 py-4 border-r border-gray-800 text-left transition-colors ${
                  !showClubApps ? 'bg-emerald-500/10' : 'hover:bg-gray-800/50'
                }`}
              >
                <div className={`font-semibold ${!showClubApps ? 'text-emerald-400' : 'text-white'}`}>
                  Best rooms
                </div>
                <div className="text-gray-400 text-sm flex items-center">
                  <span className="mr-1">🌍</span> for {userCountry || 'Worldwide'}
                </div>
              </button>
              <button
                onClick={() => setShowClubApps(true)}
                className={`px-6 py-4 text-left transition-colors ${
                  showClubApps ? 'bg-emerald-500/10' : 'hover:bg-gray-800/50'
                }`}
              >
                <div className={`font-semibold flex items-center ${showClubApps ? 'text-emerald-400' : 'text-white'}`}>
                  <Users className="w-4 h-4 mr-2" />
                  Apps
                </div>
                <div className="text-gray-400 text-sm">with private clubs</div>
              </button>
            </div>

            {/* Sites List */}
            <div className="divide-y divide-gray-800">
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg" />
                        <div>
                          <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
                          <div className="h-3 bg-gray-700 rounded w-32" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-700 rounded w-16" />
                        <div className="h-8 bg-gray-700 rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))
              ) : displaySites.length > 0 ? (
                displaySites.map((site, index) => (
                  <div key={site.id} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {site.logo_url ? (
                          <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center shadow-md">
                            <img
                              src={site.logo_url}
                              alt={site.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center text-white font-bold">
                            {site.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-semibold">{site.name}</div>
                          <div className="text-green-400 text-sm flex items-center">
                            <Gift className="w-3 h-3 mr-1" />
                            {site.bonus_offer || `Up to $${1000 + index * 500}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                          <Button 
                            size="sm" 
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-4"
                          >
                            Sign up
                          </Button>
                        </a>
                        <Link to={`${createPageUrl("SiteDetail")}?site=${site.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`}>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-4"
                          >
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-400">
                  {showClubApps ? 'No club-based apps available yet' : 'No sites available'}
                </div>
              )}
            </div>

            {/* View All Link */}
            <div className="px-6 py-4 border-t border-gray-800 text-center">
              <Link 
                to={createPageUrl("Reviews")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View all sites →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}