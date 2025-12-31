import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Site, Article } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, TrendingUp, Users, DollarSign, ArrowRight, ExternalLink, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
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
      {/* Dynamic Hero Section */}
      <div className="relative min-h-[700px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Video-like Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Trusted by 50,000+ Players Worldwide
            </Badge>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight pb-2">
              <span className="block text-white mb-2">Maximize Your</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2">
                Gaming Rewards
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto font-light leading-relaxed">
              Premium rakeback deals, exclusive bonuses, and professional agency programs for poker, casino, and sportsbetting
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Link to={createPageUrl("PokerHome")}>
              <Button className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-10 py-7 text-lg rounded-xl shadow-2xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Explore Poker
                </span>
              </Button>
            </Link>
            <Link to={createPageUrl("CasinoHome")}>
              <Button className="group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-10 py-7 text-lg rounded-xl shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Explore Casino
                </span>
              </Button>
            </Link>
            <Link to={createPageUrl("SportsbettingHome")}>
              <Button className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-10 py-7 text-lg rounded-xl shadow-2xl shadow-orange-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Explore Sportsbetting
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { value: "$2M+", label: "Paid in Rakeback" },
              { value: "150+", label: "Partner Sites" },
              { value: "24/7", label: "Expert Support" },
              { value: "40%", label: "Commission Rates" }
            ].map((stat, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <RotatingSitesShowcase sites={topSites.poker} loading={loading} />
      <TrustIndicators />

      {/* Gaming Categories with Enhanced Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-emerald-400">Gaming Platform</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover premium opportunities across poker, casino, and sportsbetting
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Poker Sites",
              description: "Top poker rooms with the best rakeback deals and exclusive VIP programs",
              color: "emerald",
              icon: Zap,
              link: createPageUrl("PokerHome"),
              features: ["Up to 65% Rakeback", "VIP Programs", "Tournament Access"]
            },
            {
              title: "Online Casinos",
              description: "Best online casinos with generous bonuses and thousands of games",
              color: "purple",
              icon: Star,
              link: createPageUrl("CasinoHome"),
              features: ["$5000+ Bonuses", "10,000+ Games", "Live Dealers"]
            },
            {
              title: "Sportsbooks",
              description: "Premier sportsbooks with competitive odds and live betting options",
              color: "orange",
              icon: TrendingUp,
              link: createPageUrl("SportsbettingHome"),
              features: ["Best Odds", "Live Betting", "Cash Out Options"]
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={category.link}>
                <Card className={`group relative bg-gradient-to-br from-slate-900/90 to-slate-950 border-${category.color}-500/20 hover:border-${category.color}-500/60 transition-all duration-500 overflow-hidden h-full cursor-pointer`}>
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${category.color}-500/0 via-${category.color}-500/0 to-${category.color}-500/0 group-hover:from-${category.color}-500/10 group-hover:via-${category.color}-500/5 group-hover:to-${category.color}-500/10 transition-all duration-500`} />
                  
                  {/* Animated Border Gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${category.color}-500/20 to-transparent blur-xl`} />
                  </div>

                  <CardContent className="relative p-8">
                    <div className={`w-16 h-16 bg-${category.color}-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <category.icon className={`w-8 h-8 text-${category.color}-400`} />
                    </div>
                    
                    <h3 className={`text-2xl font-bold text-${category.color}-400 mb-3 group-hover:text-${category.color}-300 transition-colors`}>
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-300">
                          <div className={`w-1.5 h-1.5 bg-${category.color}-400 rounded-full mr-3`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button className={`w-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 hover:from-${category.color}-600 hover:to-${category.color}-700 text-white font-semibold group-hover:shadow-lg group-hover:shadow-${category.color}-500/30 transition-all duration-300`}>
                      Explore Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Become an Agent CTA - Premium Design */}
      <div className="relative bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 border-y border-emerald-500/20 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/30 mb-6 px-4 py-2">
                <DollarSign className="w-4 h-4 mr-2 inline" />
                Premium Agency Program
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Launch Your <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  iGaming Empire
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform your network into revenue with our professional agency program. Earn lifetime commissions from every player you refer.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-10">
                {[
                  { icon: DollarSign, title: "40% Revenue Share", desc: "Industry-leading commission rates" },
                  { icon: TrendingUp, title: "Real-Time Analytics", desc: "Track performance instantly" },
                  { icon: Shield, title: "Dedicated Support", desc: "24/7 account manager access" },
                  { icon: Gift, title: "Exclusive Deals", desc: "Premium promotional materials" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <item.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link to={createPageUrl("BecomeAgent")}>
                <Button className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-10 py-7 text-lg rounded-xl shadow-2xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                  Start Your Agency
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              
              <Card className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border-slate-800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <CardContent className="relative p-8">
                  <h3 className="text-2xl font-bold text-white mb-8">Success Metrics</h3>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Average Monthly Earnings", value: "$8,500", trend: "+32%" },
                      { label: "Active Agents", value: "1,200+", trend: "+45%" },
                      { label: "Total Payouts (2024)", value: "$2.1M", trend: "+89%" }
                    ].map((metric, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">{metric.label}</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {metric.trend}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold text-white">{metric.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-sm text-gray-300 text-center">
                      <span className="font-semibold text-emerald-400">"Best decision I made for my business."</span>
                      <br />
                      <span className="text-gray-500">— Top Performing Agent, 2024</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AIAdvisorCTA />
      <LatestArticles articles={latestArticles} loading={loading} />
      
      {user && <LocationBanner user={user} onLocationConfirmed={() => loadData()} />}
    </div>
  );
}