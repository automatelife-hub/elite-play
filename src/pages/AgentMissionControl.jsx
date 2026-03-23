import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Radar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  Activity,
  Shield,
  Zap,
  Eye,
  Flame
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

export default function AgentMissionControl() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      if (!currentUser.is_agent && currentUser.role !== 'admin') {
        navigate(createPageUrl("BecomeAgent"));
        return;
      }

      const [agentData, agentPlayers, agentCommissions, agentDeals] = await Promise.all([
        db.entities.Agent.filter({ agent_email: currentUser.email }),
        currentUser.agent_id ? db.entities.AgentPlayer.filter({ agent_id: currentUser.agent_id }) : [],
        currentUser.agent_id ? db.entities.AgentCommission.filter({ agent_id: currentUser.agent_id }) : [],
        currentUser.agent_id ? db.entities.AgentDeal.filter({ agent_id: currentUser.agent_id }) : []
      ]);

      if (agentData.length > 0) setAgent(agentData[0]);
      setPlayers(agentPlayers);
      setCommissions(agentCommissions);
      setDeals(agentDeals);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = players.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const activePlayers = players.filter(p => p.status === 'active').length;
  const totalCommission = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const activeDeals = deals.filter(d => d.status === 'approved').length;

  // Mock chart data
  const revenueData = [
    { month: 'Jan', revenue: 4200, commission: 1260 },
    { month: 'Feb', revenue: 5100, commission: 1530 },
    { month: 'Mar', revenue: 6800, commission: 2040 },
    { month: 'Apr', revenue: 8200, commission: 2460 },
    { month: 'May', revenue: 9500, commission: 2850 },
    { month: 'Jun', revenue: 11200, commission: 3360 },
  ];

  const riskData = [
    { category: 'Low Risk', value: 65 },
    { category: 'Medium Risk', value: 25 },
    { category: 'High Risk', value: 10 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #1A0000, #0F0F0F)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
            <Radar className="w-8 h-8 text-orange-500 animate-pulse" />
            <h1 className="text-4xl font-bold text-white">GIA Mission Control</h1>
            <Badge className="fire-glass-light text-red-400 border-red-600 px-3 py-1">
              <Activity className="w-4 h-4 mr-1 inline" />
              ACTIVE
            </Badge>
          </div>
          <p className="text-gray-400">Agent Operations Console • {agent?.agent_name || user?.full_name}</p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Large Status Panel - Top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12">
            <Card className="fire-glass fire-glow border-orange-600/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{activePlayers}</div>
                    <div className="text-sm text-gray-400">Active Operatives</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">${totalRevenue.toFixed(0)}</div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">${totalCommission.toFixed(0)}</div>
                    <div className="text-sm text-gray-400">Commission Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{activeDeals}</div>
                    <div className="text-sm text-gray-400">Active Missions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue Intelligence - Large */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-8">
            <Card className="fire-glass border-green-600/30 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-green-500" />
                  Revenue Intelligence
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +28.5%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1A0000', border: '1px solid #FF4500', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="commission" stroke="#f59e0b" fillOpacity={0.6} fill="#f59e0b" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="fire-glass border-red-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Threat Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="category" stroke="#888" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#1A0000', border: '1px solid #FF4500', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#FF4500" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="fire-glass border-orange-600/30">
              <CardContent className="p-6">
                <Shield className="w-10 h-10 text-orange-500 mb-3" />
                <div className="text-sm text-gray-400 mb-2">24/7 Support Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">OPERATIONAL</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-6 md:col-span-3">
            <Card className="fire-glass border-blue-600/30 hover:border-blue-500 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Eye className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{players.length}</div>
                <div className="text-sm text-gray-400">Total Operatives</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-6 md:col-span-3">
            <Card className="fire-glass border-purple-600/30 hover:border-purple-500 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Flame className="w-10 h-10 text-purple-500 mx-auto mb-3 animate-pulse" />
                <div className="text-2xl font-bold text-white mb-1">{agent?.tier || 'Bronze'}</div>
                <div className="text-sm text-gray-400 uppercase">Agent Tier</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-6 md:col-span-3">
            <Card className="fire-glass border-green-600/30 hover:border-green-500 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Zap className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{deals.length}</div>
                <div className="text-sm text-gray-400">Active Deals</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-6 md:col-span-3">
            <Card className="fire-glass border-yellow-600/30 hover:border-yellow-500 transition-all cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Activity className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Full Width CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="col-span-12">
            <Card className="fire-gradient fire-glow border-orange-600">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Access Full Operations Dashboard</h3>
                    <p className="text-gray-300">View detailed player tracking, commission reports, and deal management tools</p>
                  </div>
                  <Button 
                    onClick={() => navigate(createPageUrl("AgentPortal"))}
                    size="lg" 
                    className="bg-white text-red-900 hover:bg-gray-100 font-bold px-8">
                    Launch Dashboard
                    <Radar className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}