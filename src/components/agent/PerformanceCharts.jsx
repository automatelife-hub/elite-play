import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export default function PerformanceCharts({ players, commissions }) {
  // Generate player growth data
  const playerGrowthData = React.useMemo(() => {
    const monthlyData = {};
    
    players.forEach(player => {
      if (player.signup_date) {
        const date = new Date(player.signup_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    let cumulative = 0;
    
    return sortedMonths.slice(-6).map(month => {
      cumulative += monthlyData[month];
      const [year, monthNum] = month.split('-');
      const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('en', { month: 'short' });
      
      return {
        month: monthName,
        new: monthlyData[month],
        total: cumulative
      };
    });
  }, [players]);

  // Generate revenue trend data
  const revenueTrendData = React.useMemo(() => {
    const monthlyRevenue = {};
    
    commissions.forEach(commission => {
      if (commission.period_end) {
        const date = new Date(commission.period_end);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (commission.commission_amount || 0);
      }
    });

    const sortedMonths = Object.keys(monthlyRevenue).sort();
    
    return sortedMonths.slice(-6).map(month => {
      const [year, monthNum] = month.split('-');
      const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('en', { month: 'short' });
      
      return {
        month: monthName,
        commission: monthlyRevenue[month]
      };
    });
  }, [commissions]);

  // Platform distribution data
  const platformData = React.useMemo(() => {
    const distribution = { poker: 0, casino: 0, sportsbetting: 0 };
    
    players.forEach(player => {
      if (distribution.hasOwnProperty(player.platform)) {
        distribution[player.platform]++;
      }
    });

    return Object.entries(distribution)
      .map(([platform, count]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        players: count
      }))
      .filter(item => item.players > 0);
  }, [players]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('commission') ? 
                `$${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Player Growth Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Player Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          {playerGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={playerGrowthData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)"
                  name="Total Players"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No player data yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Trend Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Commission Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  name="Commission"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No commission data yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Distribution */}
      <Card className="bg-gray-900 border-gray-800 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Platform Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {platformData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="players" fill="#a855f7" radius={[8, 8, 0, 0]} name="Players" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No platform data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}