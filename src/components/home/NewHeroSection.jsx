import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Gift, Users } from "lucide-react";
import { db } from "@/api/supabaseClient";

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
      const allSites = await db.entities.Site.list('-rating');
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
    <div className="relative min-h-[620px] overflow-hidden" style={{ backgroundColor: "#080C14" }}>
      {/* Dot grid background */}
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.09) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      
      {/* Floating Card Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl text-blue-400/10 animate-pulse">♥</div>
        <div className="absolute top-40 left-1/4 text-5xl text-blue-300/8 animate-pulse" style={{animationDelay: '0.5s'}}>♠</div>
        <div className="absolute bottom-32 left-16 text-7xl text-blue-400/8 animate-pulse" style={{animationDelay: '1s'}}>♦</div>
        <div className="absolute top-28 right-1/3 text-4xl text-blue-300/8 animate-pulse" style={{animationDelay: '0.3s'}}>♣</div>
        <div className="absolute bottom-20 left-1/3 text-5xl text-blue-500/8 animate-pulse" style={{animationDelay: '0.7s'}}>♠</div>
      </div>
      
      {/* Glowing orbs for ambiance */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
      
      {/* Dark overlay gradient */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="pt-8">
            <h1 className="font-display font-extrabold text-white mb-6 leading-[1.08] tracking-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", fontFamily: "Syne, sans-serif", letterSpacing: "-0.03em" }}>
              Your Premium<br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">iGaming Partner</span>
            </h1>

            <p className="text-lg text-[#94A3B8] mb-8 font-light leading-relaxed max-w-xl" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Premium deals, expert guidance, and the best rakeback offers across poker, casino, and sportsbetting.
            </p>

            <ul className="space-y-5 mb-12">
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-blue-400 mr-4 text-xl">✓</span>
                24/7 player & agent support
              </li>
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-blue-400 mr-4 text-xl">✓</span>
                Top rakeback & VIP deals
              </li>
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-blue-400 mr-4 text-xl">✓</span>
                50+ verified sites
              </li>
              <li className="flex items-center text-lg text-gray-300">
                <span className="text-blue-400 mr-4 text-xl">✓</span>
                Affiliate programs available
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Reviews")}>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-10 py-7 text-lg shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 transition-all duration-300 transform hover:scale-105">
                  Explore Sites
                </Button>
              </Link>
              <Link to={createPageUrl("BecomeAgent")}>
                <Button variant="outline" className="border-2 border-blue-600/70 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500 px-10 py-7 text-lg font-bold transition-all duration-300">
                  Start an Agency
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Rooms List */}
          <div className="bg-[#0D1424]/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-gray-800">
              <button
                onClick={() => setShowClubApps(false)}
                className={`px-6 py-4 border-r border-gray-800 text-left transition-colors ${
                  !showClubApps ? 'bg-blue-600/10' : 'hover:bg-[#141E35]/50'
                }`}
              >
                <div className={`font-semibold ${!showClubApps ? 'text-blue-400' : 'text-white'}`}>
                  Best rooms
                </div>
                <div className="text-gray-400 text-sm flex items-center">
                  <span className="mr-1">🌍</span> for {userCountry || 'Worldwide'}
                </div>
              </button>
              <button
                onClick={() => setShowClubApps(true)}
                className={`px-6 py-4 text-left transition-colors ${
                  showClubApps ? 'bg-blue-600/10' : 'hover:bg-[#141E35]/50'
                }`}
              >
                <div className={`font-semibold flex items-center ${showClubApps ? 'text-blue-400' : 'text-white'}`}>
                  <Users className="w-4 h-4 mr-2" />
                  Apps
                </div>
                <div className="text-gray-400 text-sm">with private clubs</div>
              </button>
            </div>

            {/* Sites List */}
            <div className="divide-y divide-[#1E2A3F]">
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
                  <div key={site.id} className="px-6 py-4 hover:bg-[#141E35]/50 transition-colors">
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
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
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
                            className="bg-[#141E35] hover:bg-[#1E2A3F] text-white text-xs px-4"
                          >
                            Sign up
                          </Button>
                        </a>
                        <Link to={`${createPageUrl("SiteDetail")}?site=${site.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`}>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-[#1E2A3F] text-[#94A3B8] hover:bg-[#141E35] text-xs px-4"
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
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
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