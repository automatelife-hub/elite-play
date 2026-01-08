import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Target, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Flame,
  FileText,
  BarChart3,
  Users,
  Radar,
  Lock,
  Cpu,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [topSites, setTopSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me().catch(() => null);
      setUser(currentUser);
      
      const sites = await base44.entities.Site.list('-rating', 6);
      setTopSites(sites);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #1A0000, #0F0F0F)' }}>
      {/* Hero Section - Fire Theme */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Animated Fire Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-red-900 to-orange-600 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-800 to-orange-700 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16">
            
            <Badge className="fire-glass-light text-orange-400 border-orange-600 mb-8 px-6 py-3 text-base font-bold">
              <Flame className="w-5 h-5 mr-2 inline animate-pulse" />
              INTELLIGENCE OPERATIONS AGENCY
            </Badge>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight">
              <span className="block text-white mb-3">Gaming Intel</span>
              <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Agency
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Classified intelligence on poker rooms, casinos & networks. Risk analysis. Opportunity assessment. Mission-critical support.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to={createPageUrl("AgentPortal")}>
                <Button className="group fire-gradient hover:fire-glow px-10 py-7 text-lg rounded-xl shadow-2xl transition-all">
                  <Radar className="w-5 h-5 mr-2" />
                  Agent Mission Control
                </Button>
              </Link>
              <Link to={createPageUrl("Stats")}>
                <Button className="group fire-glass-light border-2 border-orange-600 hover:bg-orange-600/20 px-10 py-7 text-lg rounded-xl text-orange-400 transition-all">
                  <Cpu className="w-5 h-5 mr-2" />
                  Player Intel Command
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Bento Grid - Intelligence Overview */}
          <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto">
            {/* Large Feature - Agency Services */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-12 md:col-span-8">
              <Card className="fire-glass fire-glow border-orange-600/30 h-full hover:border-orange-500 transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-orange-400 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Agency Intelligence Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-orange-500 mt-1" />
                        <div>
                          <div className="font-semibold text-white mb-1">Intel Briefs</div>
                          <div className="text-sm text-gray-400">Detailed files on 150+ poker rooms, casinos & networks</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                          <div className="font-semibold text-white mb-1">Risk Assessment</div>
                          <div className="text-sm text-gray-400">Real-time threat analysis & scam protection</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <div className="font-semibold text-white mb-1">Opportunity Intel</div>
                          <div className="text-sm text-gray-400">EV signals, value opportunities, deal analysis</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <div className="font-semibold text-white mb-1">Agent Operations</div>
                          <div className="text-sm text-gray-400">Track players, revenue, commissions & deals</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Cpu className="w-5 h-5 text-purple-500 mt-1" />
                        <div>
                          <div className="font-semibold text-white mb-1">Bot Detection</div>
                          <div className="text-sm text-gray-400">AI-powered analysis & intelligent screening</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-cyan-500 mt-1" />
                        <div>
                          <div className="font-semibold text-white mb-1">24/7 Support</div>
                          <div className="text-sm text-gray-400">Mission-critical customer support operations</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 md:col-span-4 space-y-4">
              <Card className="fire-glass border-red-600/30 hover:border-red-500 transition-all">
                <CardContent className="p-6 text-center">
                  <Eye className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">150+</div>
                  <div className="text-sm text-gray-400">Sites Under Surveillance</div>
                </CardContent>
              </Card>
              <Card className="fire-glass border-orange-600/30 hover:border-orange-500 transition-all">
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">$2M+</div>
                  <div className="text-sm text-gray-400">Protected Revenue</div>
                </CardContent>
              </Card>
              <Card className="fire-glass border-yellow-600/30 hover:border-yellow-500 transition-all">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Operations Active</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Medium Cards - Access Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-12 md:col-span-6">
              <Link to={createPageUrl("AgentPortal")}>
                <Card className="fire-glass border-orange-600/30 hover:border-orange-500 hover:fire-glow transition-all cursor-pointer h-full group">
                  <CardContent className="p-8">
                    <Radar className="w-12 h-12 text-orange-500 mb-4 group-hover:animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">GIA Mission Control</h3>
                    <p className="text-gray-400 mb-4">Agent operations console. Track players, revenue, offers & risk signals. Command center for affiliate operations.</p>
                    <div className="flex items-center gap-2 text-orange-400">
                      <span className="font-semibold">Access Console</span>
                      <Target className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-12 md:col-span-6">
              <Link to={createPageUrl("Stats")}>
                <Card className="fire-glass border-blue-600/30 hover:border-blue-500 hover:fire-glow transition-all cursor-pointer h-full group">
                  <CardContent className="p-8">
                    <Cpu className="w-12 h-12 text-blue-500 mb-4 group-hover:animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">Player Intelligence Command</h3>
                    <p className="text-gray-400 mb-4">Player command center. Access improved rooms, rake deals & scam protection. Intelligent analysis & bot detection.</p>
                    <div className="flex items-center gap-2 text-blue-400">
                      <span className="font-semibold">Enter Command Center</span>
                      <Activity className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* Small Cards - Quick Access */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="col-span-6 md:col-span-3">
              <Link to={createPageUrl("BestPokerSites")}>
                <Card className="fire-glass border-green-600/30 hover:border-green-500 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="font-bold text-white mb-1">Poker Files</div>
                    <div className="text-xs text-gray-400">Room intelligence</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="col-span-6 md:col-span-3">
              <Link to={createPageUrl("CasinoHome")}>
                <Card className="fire-glass border-purple-600/30 hover:border-purple-500 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="font-bold text-white mb-1">Casino Files</div>
                    <div className="text-xs text-gray-400">Casino dossiers</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="col-span-6 md:col-span-3">
              <Link to={createPageUrl("PokerNetworks")}>
                <Card className="fire-glass border-cyan-600/30 hover:border-cyan-500 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                    <div className="font-bold text-white mb-1">Network Intel</div>
                    <div className="text-xs text-gray-400">Network analysis</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="col-span-6 md:col-span-3">
              <Link to={createPageUrl("PokerAdvisor")}>
                <Card className="fire-glass border-yellow-600/30 hover:border-yellow-500 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="font-bold text-white mb-1">AI Advisor</div>
                    <div className="text-xs text-gray-400">Intel analysis</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Classified Files Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <Badge className="fire-glass-light text-red-400 border-red-600 mb-4 px-4 py-2">
              <AlertTriangle className="w-4 h-4 mr-2 inline" />
              CLASSIFIED INTELLIGENCE
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Top Priority <span className="text-orange-500">Target Files</span>
            </h2>
            <p className="text-xl text-gray-400">High-value opportunities under active surveillance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSites.slice(0, 6).map((site, idx) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}>
                <Card className="fire-glass border-orange-600/30 hover:border-orange-500 hover:fire-glow transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center p-2">
                        {site.logo_url ? (
                          <img src={site.logo_url} alt={site.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-600" />
                        )}
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        VERIFIED
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{site.name}</h3>
                    <div className="text-sm text-gray-400 mb-3 capitalize">{site.type.replace(/_/g, ' ')}</div>
                    
                    {site.bonus_offer && (
                      <div className="bg-orange-500/10 border border-orange-600/30 rounded-lg p-3 mb-3">
                        <div className="text-xs text-orange-400 font-semibold mb-1">OFFER INTEL</div>
                        <div className="text-sm text-white">{site.bonus_offer}</div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Threat Level: <span className="text-green-400 font-semibold">LOW</span>
                      </div>
                      <Link to={createPageUrl("SiteDetail") + `?id=${site.id}`}>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                          View File
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}