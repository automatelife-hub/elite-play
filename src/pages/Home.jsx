import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Site, Article } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, ArrowRight, Sparkles, Shield, Zap, Trophy, DollarSign, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [topSites, setTopSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allSites] = await Promise.all([
        Site.list('-rating', 6)
      ]);
      setTopSites(allSites);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero Section - Full Viewport */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="glass-card-light text-emerald-400 border-emerald-500/30 mb-8 px-6 py-2.5 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Trusted by 50,000+ Players Worldwide
            </Badge>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight">
              <span className="block text-white/90 mb-3">Maximize Your</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Rakeback
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Premium deals, exclusive bonuses, and professional agency programs
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to={createPageUrl("PokerHome")}>
                <Button className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-10 py-7 text-lg rounded-xl shadow-2xl hover:scale-105 transition-all">
                  <Zap className="w-5 h-5 mr-2" />
                  Explore Poker
                </Button>
              </Link>
              <Link to={createPageUrl("CasinoHome")}>
                <Button className="group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-10 py-7 text-lg rounded-xl shadow-2xl hover:scale-105 transition-all">
                  <Star className="w-5 h-5 mr-2" />
                  Explore Casino
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { value: "$2M+", label: "Paid in Rakeback", icon: DollarSign },
                { value: "150+", label: "Partner Sites", icon: Target },
                { value: "24/7", label: "Expert Support", icon: Shield },
                { value: "40%", label: "Commission", icon: TrendingUp }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="glass-card-light rounded-xl p-6 hover:border-emerald-500/30 transition-all"
                >
                  <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Top Sites Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Top Rated <span className="text-emerald-400">Sites</span>
            </h2>
            <p className="text-xl text-gray-400">
              Hand-picked platforms with the best deals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSites.slice(0, 6).map((site, idx) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={createPageUrl("SiteDetail") + `?id=${site.id}`}>
                  <Card className="group glass-card hover:border-emerald-500/30 transition-all duration-300 h-full cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
                    
                    <CardContent className="relative p-6">
                      {site.logo_url && (
                        <div className="h-20 flex items-center justify-center mb-4 bg-white/5 rounded-lg p-3">
                          <img src={site.logo_url} alt={site.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {site.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(site.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-400">{site.rating.toFixed(1)}</span>
                      </div>

                      {site.bonus_offer && (
                        <div className="glass-card-light rounded-lg p-3 mb-4">
                          <div className="text-sm text-emerald-400 font-semibold">{site.bonus_offer}</div>
                        </div>
                      )}

                      <Button className="w-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-400 border border-emerald-500/30 group-hover:border-emerald-500/50">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become Agent CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 to-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl p-12 border-emerald-500/20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-6 px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2 inline" />
                  Premium Program
                </Badge>
                
                <h2 className="text-5xl font-bold mb-6 leading-tight">
                  Launch Your <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    iGaming Agency
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8">
                  Earn lifetime commissions. Professional tools. Dedicated support.
                </p>
                
                <Link to={createPageUrl("BecomeAgent")}>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-8 py-6 text-lg rounded-xl shadow-xl">
                    Start Your Agency
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "$8.5K", label: "Avg Monthly", icon: DollarSign },
                  { value: "1,200+", label: "Active Agents", icon: Users },
                  { value: "$2.1M", label: "Total Payouts", icon: TrendingUp },
                  { value: "40%", label: "Commission", icon: Trophy }
                ].map((stat, idx) => (
                  <div key={idx} className="glass-card-light rounded-xl p-6">
                    <stat.icon className="w-6 h-6 text-emerald-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}