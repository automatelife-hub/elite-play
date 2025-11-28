import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Gift } from "lucide-react";

export default function NewHeroSection({ sites, loading, userCountry }) {
  const topSites = sites?.slice(0, 5) || [];

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
          <div className="pt-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Professional<br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Poker Affiliate</span>
            </h1>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-gray-300">
                <span className="text-cyan-400 mr-3">✦</span>
                7 days a week players support
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-cyan-400 mr-3">✦</span>
                Up to $800 in free software
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-cyan-400 mr-3">✦</span>
                30+ poker sites and 60+ private clubs
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-cyan-400 mr-3">✦</span>
                Helping players win more since 2013
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("BestPokerSites")}>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-6 text-lg">
                  Choose poker room
                </Button>
              </Link>
              <Link to={createPageUrl("BecomeAgent")}>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg">
                  Contact us
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Rooms List */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-gray-800">
              <div className="px-6 py-4 border-r border-gray-800">
                <div className="text-white font-semibold">Best rooms</div>
                <div className="text-gray-400 text-sm flex items-center">
                  <span className="mr-1">🌍</span> for {userCountry || 'Worldwide'}
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="text-white font-semibold">Apps</div>
                <div className="text-gray-400 text-sm">with private clubs</div>
              </div>
            </div>

            {/* Sites List */}
            <div className="divide-y divide-gray-800">
              {loading ? (
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
              ) : topSites.length > 0 ? (
                topSites.map((site, index) => (
                  <div key={site.id} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {site.logo_url ? (
                          <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
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
                  No sites available
                </div>
              )}
            </div>

            {/* View All Link */}
            <div className="px-6 py-4 border-t border-gray-800 text-center">
              <Link 
                to={createPageUrl("BestPokerSites")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View all poker rooms →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}