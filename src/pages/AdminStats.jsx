import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Activity, ArrowUp, ArrowDown, Target, Award } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminStats() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalPlayers: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    pendingPayouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        toast.error("Admin access required");
        return;
      }

      const [agents, players, commissions] = await Promise.all([
        base44.entities.Agent.list(),
        base44.entities.AgentPlayer.list(),
        base44.entities.AgentCommission.list()
      ]);

      setStats({
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'approved').length,
        totalPlayers: players.length,
        totalRevenue: players.reduce((sum, p) => sum + (p.total_revenue || 0), 0),
        totalCommissions: commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0),
        pendingPayouts: commissions.filter(c => c.payout_status === 'pending').reduce((sum, c) => sum + (c.commission_amount || 0), 0)
      });

      // Generate mock revenue trend data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mockData = months.map((month, idx) => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 30000,
        commissions: Math.floor(Math.random() * 15000) + 8000,
        agents: agents.length - (6 - idx) * 20
      }));
      setRevenueData(mockData);

    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-2">Admin Access Required</h1>
        <p className="text-gray-400">This page is only accessible to administrators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">System-wide performance metrics and insights</p>
      </div>

      {/* 12-Column Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* KPI Cards - Glassmorphism */}
        {[
          { 
            title: "Total Agents", 
            value: stats.totalAgents, 
            change: "+12%", 
            icon: Users, 
            color: "blue",
            span: "col-span-6 lg:col-span-3"
          },
          { 
            title: "Active Agents", 
            value: stats.activeAgents, 
            change: "+8%", 
            icon: Activity, 
            color: "green",
            span: "col-span-6 lg:col-span-3"
          },
          { 
            title: "Total Revenue", 
            value: `$${stats.totalRevenue.toFixed(0)}`, 
            change: "+24%", 
            icon: DollarSign, 
            color: "emerald",
            span: "col-span-6 lg:col-span-3"
          },
          { 
            title: "Total Players", 
            value: stats.totalPlayers, 
            change: "+18%", 
            icon: Target, 
            color: "purple",
            span: "col-span-6 lg:col-span-3"
          }
        ].map((stat, idx) => (
          <Card key={idx} className={`${stat.span} glass-card hover:border-${stat.color}-500/30 transition-all`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <Badge className={`bg-green-500/20 text-green-400 border-green-500/30 text-xs`}>
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
            </CardContent>
          </Card>
        ))}

        {/* Revenue Trend Chart - 8 columns */}
        <Card className="col-span-12 lg:col-span-8 glass-card">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers - 4 columns */}
        <Card className="col-span-12 lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="text-white">Top Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center gap-3 p-3 glass-card-light rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Agent {rank}</div>
                    <div className="text-xs text-gray-500">${(Math.random() * 10000 + 5000).toFixed(0)}</div>
                  </div>
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Growth Chart - Full Width */}
        <Card className="col-span-12 glass-card">
          <CardHeader>
            <CardTitle className="text-white">Agent Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="agents" fill="#22D3EE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}