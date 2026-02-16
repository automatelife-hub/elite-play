import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function KPIAnalytics({ players, commissions, referralLinks }) {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const presets = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "All Time", days: null }
  ];

  const applyPreset = (days) => {
    if (days === null) {
      setDateRange({ from: null, to: null });
    } else {
      setDateRange({
        from: subDays(new Date(), days),
        to: new Date()
      });
    }
  };

  const kpiData = useMemo(() => {
    const filterByDate = (date) => {
      if (!dateRange.from || !dateRange.to) return true;
      const itemDate = new Date(date);
      return isWithinInterval(itemDate, { start: startOfDay(dateRange.from), end: endOfDay(dateRange.to) });
    };

    const filteredPlayers = players.filter(p => filterByDate(p.signup_date || p.created_date));
    const filteredCommissions = commissions.filter(c => filterByDate(c.created_date));
    const filteredLinks = referralLinks;

    // Player acquisition rate
    const totalDays = dateRange.from && dateRange.to 
      ? Math.max(1, Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24)))
      : 1;
    const acquisitionRate = (filteredPlayers.length / totalDays).toFixed(2);

    // Total revenue
    const totalRevenue = filteredPlayers.reduce((sum, p) => sum + (p.total_revenue || 0), 0);

    // Conversion rates
    const totalClicks = filteredLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
    const totalConversions = filteredLinks.reduce((sum, l) => sum + (l.conversions || 0), 0);
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;

    // Average revenue per player
    const avgRevenuePerPlayer = filteredPlayers.length > 0 
      ? (totalRevenue / filteredPlayers.length).toFixed(2)
      : 0;

    // Total commissions
    const totalEarned = filteredCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    // Active players
    const activePlayers = filteredPlayers.filter(p => p.status === "active" || p.status === "approved").length;
    const activePlayerRate = filteredPlayers.length > 0 
      ? ((activePlayers / filteredPlayers.length) * 100).toFixed(1)
      : 0;

    return {
      acquisitionRate,
      totalRevenue,
      conversionRate,
      avgRevenuePerPlayer,
      totalEarned,
      activePlayers,
      activePlayerRate,
      totalPlayers: filteredPlayers.length,
      totalClicks,
      totalConversions
    };
  }, [players, commissions, referralLinks, dateRange]);

  // Chart data - daily breakdown
  const chartData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];

    const days = [];
    const current = new Date(dateRange.from);
    while (current <= dateRange.to) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayPlayers = players.filter(p => {
        const pDate = new Date(p.signup_date || p.created_date);
        return format(pDate, 'yyyy-MM-dd') === dayStr;
      });

      const dayRevenue = dayPlayers.reduce((sum, p) => sum + (p.total_revenue || 0), 0);

      return {
        date: format(day, 'MMM dd'),
        players: dayPlayers.length,
        revenue: dayRevenue
      };
    }).slice(-30); // Show last 30 points max
  }, [players, dateRange]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white text-2xl">KPI Analytics</CardTitle>
          
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.days)}
                className="border-slate-700 text-gray-300 hover:bg-slate-800"
              >
                {preset.label}
              </Button>
            ))}

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : null }))}
                className="w-36 bg-slate-800 border-slate-700 text-gray-300"
              />
              <span className="text-gray-400">to</span>
              <Input
                type="date"
                value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : null }))}
                className="w-36 bg-slate-800 border-slate-700 text-gray-300"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Rate
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{kpiData.acquisitionRate}</div>
              <div className="text-xs text-gray-400">Players / Day</div>
              <div className="text-xs text-gray-500 mt-1">{kpiData.totalPlayers} total players</div>
            </CardContent>
          </Card>

          <Card className="glass-card-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Revenue
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">${kpiData.totalRevenue.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Total Generated</div>
              <div className="text-xs text-gray-500 mt-1">${kpiData.avgRevenuePerPlayer} avg / player</div>
            </CardContent>
          </Card>

          <Card className="glass-card-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  Conv.
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{kpiData.conversionRate}%</div>
              <div className="text-xs text-gray-400">Conversion Rate</div>
              <div className="text-xs text-gray-500 mt-1">{kpiData.totalConversions}/{kpiData.totalClicks} clicks</div>
            </CardContent>
          </Card>

          <Card className="glass-card-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  Active
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{kpiData.activePlayerRate}%</div>
              <div className="text-xs text-gray-400">Active Player Rate</div>
              <div className="text-xs text-gray-500 mt-1">{kpiData.activePlayers} active</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card-light">
            <CardHeader>
              <CardTitle className="text-white text-sm">Player Acquisition Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="players" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card-light">
            <CardHeader>
              <CardTitle className="text-white text-sm">Revenue Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}