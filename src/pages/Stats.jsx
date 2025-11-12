import React, { useState, useEffect } from "react";
import { User, UserSiteSignup, UserStats, Site } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Activity, Award, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

export default function Stats() {
  const [user, setUser] = useState(null);
  const [signups, setSignups] = useState([]);
  const [stats, setStats] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignup, setSelectedSignup] = useState("all");
  const [periodType, setPeriodType] = useState("weekly");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [userSignups, userStats, allSites] = await Promise.all([
        UserSiteSignup.filter({ user_email: currentUser.email }),
        UserStats.filter({ user_email: currentUser.email }, '-period_start'),
        Site.list()
      ]);

      setSignups(userSignups);
      setStats(userStats);
      setSites(allSites);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStats = stats.filter(stat => {
    const matchesSignup = selectedSignup === "all" || stat.signup_id === selectedSignup;
    const matchesPeriod = stat.period_type === periodType;
    return matchesSignup && matchesPeriod;
  });

  const totalStats = filteredStats.reduce((acc, stat) => ({
    hands_played: acc.hands_played + (stat.hands_played || 0),
    rake_generated: acc.rake_generated + (stat.rake_generated || 0),
    profit_loss: acc.profit_loss + (stat.profit_loss || 0),
    commission_earned: acc.commission_earned + (stat.commission_earned || 0),
  }), { hands_played: 0, rake_generated: 0, profit_loss: 0, commission_earned: 0 });

  const chartData = filteredStats.map(stat => ({
    date: format(new Date(stat.period_start), 'MMM dd'),
    profit: stat.profit_loss || 0,
    rake: stat.rake_generated || 0,
    commission: stat.commission_earned || 0
  }));

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Statistics</h1>
          <p className="text-gray-400">Track your performance across all poker sites</p>
        </div>

        {signups.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <Activity className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-300">No stats available yet</h3>
              <p className="text-gray-500 mb-4">
                Add your site signups in your profile to start tracking statistics
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Select value={selectedSignup} onValueChange={setSelectedSignup}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full md:w-64">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {signups.map((signup) => {
                    const site = sites.find(s => s.id === signup.site_id);
                    return (
                      <SelectItem key={signup.id} value={signup.id}>
                        {site?.name} - {signup.site_username}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Tabs value={periodType} onValueChange={setPeriodType} className="flex-1">
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-yellow-500/20">Weekly</TabsTrigger>
                  <TabsTrigger value="biweekly" className="data-[state=active]:bg-yellow-500/20">Bi-Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-yellow-500/20">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-400" />
                    Hands Played
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalStats.hands_played.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                    Profit/Loss
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalStats.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${totalStats.profit_loss.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-purple-400" />
                    Rake Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${totalStats.rake_generated.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-400" />
                    Commission Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">${totalStats.commission_earned.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {chartData.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Profit/Loss Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                          labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit/Loss" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Rake & Commission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                          labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Legend />
                        <Bar dataKey="rake" fill="#8B5CF6" name="Rake Generated" />
                        <Bar dataKey="commission" fill="#F59E0B" name="Commission Earned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">No stats data yet</h3>
                  <p className="text-gray-500">
                    Stats will appear here once data is uploaded by the admin
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}