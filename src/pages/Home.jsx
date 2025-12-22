import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Site, Article } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, TrendingUp, Users, DollarSign, ArrowRight, ExternalLink } from "lucide-react";
import AIAdvisorCTA from "../components/home/AIAdvisorCTA";
import LatestArticles from "../components/home/LatestArticles";
import TrustIndicators from "../components/home/TrustIndicators";
import LocationBanner from "../components/geo/LocationBanner";
import RotatingSitesShowcase from "../components/home/RotatingSitesShowcase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [topSites, setTopSites] = useState({ poker: [], casino: [], sportsbetting: [] });
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [allSites, articles] = await Promise.all([
        Site.list('-rating'),
        Article.filter({ published: true }, '-created_date', 4)
      ]);

      setTopSites({ poker: allSites, casino: allSites, sportsbetting: allSites });
      setLatestArticles(articles);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative min-h-[500px] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">AceRakeback</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your premium partner for poker, casino, and sportsbetting with exclusive deals, top rakeback, and professional agency programs
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to={createPageUrl("PokerHome")}>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-6 text-lg">
                ♠ Explore Poker
              </Button>
            </Link>
            <Link to={createPageUrl("CasinoHome")}>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 py-6 text-lg">
                🎰 Explore Casino
              </Button>
            </Link>
            <Link to={createPageUrl("SportsbettingHome")}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg">
                ⚽ Explore Sportsbetting
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <RotatingSitesShowcase sites={topSites.poker} loading={loading} />
      <TrustIndicators />

      {/* Gaming Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Poker */}
          <Card className="bg-gradient-to-br from-emerald-900/30 to-gray-900 border-emerald-500/30 hover:border-emerald-500/60 transition-all group">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">♠</div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-3">Poker Sites</h3>
              <p className="text-gray-400 mb-4">Top poker rooms with the best rakeback deals and exclusive VIP programs</p>
              <div className="space-y-2 mb-4">
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>)}
                  </div>
                ) : (
                  topSites.poker.map(site => (
                    <div key={site.id} className="flex items-center text-sm text-gray-300">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-2" />
                      {site.name} - {site.rating}/5
                    </div>
                  ))
                )}
              </div>
              <Link to={createPageUrl("PokerHome")}>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white group-hover:translate-x-1 transition-transform">
                  View Poker Sites <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Casino */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900 border-purple-500/30 hover:border-purple-500/60 transition-all group">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🎰</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">Online Casinos</h3>
              <p className="text-gray-400 mb-4">Best online casinos with generous bonuses and thousands of games</p>
              <div className="space-y-2 mb-4">
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>)}
                  </div>
                ) : (
                  topSites.casino.map(site => (
                    <div key={site.id} className="flex items-center text-sm text-gray-300">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-2" />
                      {site.name} - {site.rating}/5
                    </div>
                  ))
                )}
              </div>
              <Link to={createPageUrl("CasinoHome")}>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white group-hover:translate-x-1 transition-transform">
                  View Casinos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Sportsbetting */}
          <Card className="bg-gradient-to-br from-orange-900/30 to-gray-900 border-orange-500/30 hover:border-orange-500/60 transition-all group">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-3">Sportsbooks</h3>
              <p className="text-gray-400 mb-4">Premier sportsbooks with competitive odds and live betting options</p>
              <div className="space-y-2 mb-4">
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>)}
                  </div>
                ) : (
                  topSites.sportsbetting.map(site => (
                    <div key={site.id} className="flex items-center text-sm text-gray-300">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-2" />
                      {site.name} - {site.rating}/5
                    </div>
                  ))
                )}
              </div>
              <Link to={createPageUrl("SportsbettingHome")}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white group-hover:translate-x-1 transition-transform">
                  View Sportsbooks <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Become an Agent CTA */}
      <div className="bg-gradient-to-r from-emerald-900/20 via-cyan-900/20 to-emerald-900/20 border-y border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">
                💼 Agency Program
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                Start Your Own <span className="text-emerald-400">iGaming Agency</span>
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Join our professional agency program and earn lucrative commissions by referring players to top poker sites, casinos, and sportsbooks.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <DollarSign className="w-5 h-5 text-emerald-400 mr-3" />
                  High commission rates up to 40% revenue share
                </div>
                <div className="flex items-center text-gray-300">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mr-3" />
                  Real-time tracking and transparent reporting
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 text-emerald-400 mr-3" />
                  Dedicated account manager and 24/7 support
                </div>
                <div className="flex items-center text-gray-300">
                  <Gift className="w-5 h-5 text-emerald-400 mr-3" />
                  Exclusive deals and promotional materials
                </div>
              </div>
              <Link to={createPageUrl("BecomeAgent")}>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 text-lg">
                  Start Your Agency <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-3xl"></div>
              <Card className="relative bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Fast Setup</h4>
                        <p className="text-sm text-gray-400">Get started in minutes with our streamlined onboarding</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Lifetime Earnings</h4>
                        <p className="text-sm text-gray-400">Earn commissions for the lifetime of your referred players</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Marketing Support</h4>
                        <p className="text-sm text-gray-400">Access to banners, landing pages, and promotional tools</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AIAdvisorCTA />
      <LatestArticles articles={latestArticles} loading={loading} />
      
      {user && <LocationBanner user={user} onLocationConfirmed={() => loadData()} />}
    </div>
  );
}