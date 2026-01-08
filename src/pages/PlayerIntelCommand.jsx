import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cpu, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Eye,
  Zap,
  Activity,
  FileText,
  CheckCircle,
  Bot,
  Radar
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function PlayerIntelCommand() {
  const [user, setUser] = useState(null);
  const [sites, setSites] = useState([]);
  const [userSignups, setUserSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me().catch(() => null);
      setUser(currentUser);

      const [allSites, signups] = await Promise.all([
        base44.entities.Site.list('-rating', 20),
        currentUser ? base44.entities.UserSiteSignup.filter({ user_email: currentUser.email }) : []
      ]);

      setSites(allSites);
      setUserSignups(signups);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock intelligence data
  const roomScores = [
    { name: 'PokerStars', security: 95, value: 88, traffic: 92 },
    { name: 'GGPoker', security: 90, value: 85, traffic: 88 },
    { name: 'partypoker', security: 88, value: 82, traffic: 75 },
    { name: '888poker', security: 85, value: 80, traffic: 70 },
  ];

  const threatLevels = [
    { name: 'Secure', value: 65, color: '#10b981' },
    { name: 'Monitor', value: 25, color: '#f59e0b' },
    { name: 'Caution', value: 10, color: '#ef4444' },
  ];

  const evSignals = [
    { month: 'Jan', rakeback: 35, bonus: 42, value: 38 },
    { month: 'Feb', rakeback: 38, bonus: 45, value: 41 },
    { month: 'Mar', rakeback: 42, bonus: 48, value: 45 },
    { month: 'Apr', rakeback: 45, bonus: 52, value: 48 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #1A0000, #0F0F0F)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, #1A0000, #0F0F0F)' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-8 h-8 text-blue-500 animate-pulse" />
            <h1 className="text-4xl font-bold text-white">Player Intelligence Command</h1>
            <Badge className="fire-glass-light text-blue-400 border-blue-600 px-3 py-1">
              <Radar className="w-4 h-4 mr-1 inline" />
              MONITORING
            </Badge>
          </div>
          <p className="text-gray-400">Player Command Center • Real-time Intelligence & Protection Systems</p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Main Status Dashboard - Top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12">
            <Card className="fire-glass fire-glow border-blue-600/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{sites.length}</div>
                    <div className="text-sm text-gray-400">Verified Rooms</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">98.5%</div>
                    <div className="text-sm text-gray-400">Security Score</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">42%</div>
                    <div className="text-sm text-gray-400">Avg Rakeback</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-gray-400">Threats Detected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Room Intelligence - Large Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-8">
            <Card className="fire-glass border-green-600/30 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-500" />
                  Room Intelligence Matrix
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                    LIVE DATA
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roomScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1A0000', border: '1px solid #4F46E5', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="security" fill="#10b981" name="Security" />
                    <Bar dataKey="value" fill="#3b82f6" name="Value" />
                    <Bar dataKey="traffic" fill="#8b5cf6" name="Traffic" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Threat Analysis - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="fire-glass border-red-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Threat Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={threatLevels}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {threatLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1A0000', border: '1px solid #ef4444' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="fire-glass border-purple-600/30">
              <CardContent className="p-6">
                <Bot className="w-10 h-10 text-purple-500 mb-3" />
                <div className="text-sm text-gray-400 mb-2">AI Bot Detection</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">ACTIVE</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* EV Signals Chart - Wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 lg:col-span-8">
            <Card className="fire-glass border-orange-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  EV Opportunity Signals
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 ml-auto">
                    <Zap className="w-3 h-3 mr-1" />
                    HIGH VALUE
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={evSignals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1A0000', border: '1px solid #FF4500', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="rakeback" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="bonus" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="value" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Intel Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="fire-glass border-cyan-600/30 hover:border-cyan-500 transition-all">
              <CardContent className="p-6">
                <Target className="w-10 h-10 text-cyan-500 mb-3" />
                <div className="text-xl font-bold text-white mb-1">12 New Deals</div>
                <div className="text-sm text-gray-400">Available this week</div>
                <Link to={createPageUrl("BestPokerSites")}>
                  <Button size="sm" className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700">
                    View Deals
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="fire-glass border-green-600/30 hover:border-green-500 transition-all">
              <CardContent className="p-6">
                <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
                <div className="text-xl font-bold text-white mb-1">{userSignups.length} Rooms</div>
                <div className="text-sm text-gray-400">Currently tracked</div>
                <Link to={createPageUrl("Profile")}>
                  <Button size="sm" className="mt-3 w-full bg-green-600 hover:bg-green-700">
                    Manage Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Verified Sites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-12">
            <Card className="fire-glass border-blue-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Top Verified Intelligence Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sites.slice(0, 6).map((site, idx) => (
                    <div key={site.id} className="fire-glass-light border border-orange-600/30 rounded-lg p-4 hover:border-orange-500 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center p-2">
                          {site.logo_url ? (
                            <img src={site.logo_url} alt={site.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-600" />
                          )}
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          SECURE
                        </Badge>
                      </div>
                      <h4 className="text-white font-bold mb-1">{site.name}</h4>
                      <div className="text-sm text-gray-400 mb-3 capitalize">{site.type.replace(/_/g, ' ')}</div>
                      <Link to={createPageUrl("SiteDetail") + `?id=${site.id}`}>
                        <Button size="sm" variant="outline" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20">
                          Access File
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-12">
            <Card className="fire-gradient fire-glow border-blue-600">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Need Advanced Intelligence Analysis?</h3>
                    <p className="text-gray-300">Consult with our AI advisor for personalized room recommendations and risk assessment</p>
                  </div>
                  <Link to={createPageUrl("PokerAdvisor")}>
                    <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8">
                      Launch AI Advisor
                      <Cpu className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}