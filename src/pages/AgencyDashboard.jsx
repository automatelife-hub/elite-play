import React from "react";
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Handshake, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Calendar, 
  Download, 
  Zap, 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  MoreHorizontal,
  Dice5
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const revenueData = [
  { name: 'MAY 01', ggr: 400, ngr: 240 },
  { name: 'MAY 07', ggr: 300, ngr: 139 },
  { name: 'MAY 14', ggr: 200, ngr: 980 },
  { name: 'MAY 21', ggr: 278, ngr: 390 },
  { name: 'MAY 30', ggr: 189, ngr: 480 },
];

const topBrands = [
  { name: "Vortix Casino", code: "VRT", value: 142000, percentage: 85 },
  { name: "Spinia Royale", code: "SPR", value: 98000, percentage: 62 },
  { name: "Luxor Poker", code: "LUX", value: 74000, percentage: 45 },
];

const activeDeals = [
  { brand: "Vegas Pulse", code: "VP", type: "Revenue Share", rate: "35%", status: "active", expiry: "Dec 2024" },
  { brand: "Bluff Poker", code: "BP", type: "CPA", rate: "$250 / FTD", status: "pending", expiry: "--" },
  { brand: "Slot99 Arena", code: "S9", type: "Hybrid", rate: "20% + $50", status: "expired", expiry: "Jan 2024" },
];

export default function AgencyDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f6f8] dark:bg-[#191022] text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#191022] border-r border-slate-200 dark:border-[#7f13ec]/20 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7f13ec] flex items-center justify-center text-white shadow-lg shadow-[#7f13ec]/30">
            <Dice5 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#7f13ec]">iGaming</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#7f13ec]/10 text-[#7f13ec] font-medium" href="#">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#7f13ec]/5 transition-colors" href="#">
            <BarChart3 className="w-5 h-5" />
            <span>Player Stats</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#7f13ec]/5 transition-colors" href="#">
            <FileText className="w-5 h-5" />
            <span>Content Requests</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#7f13ec]/5 transition-colors" href="#">
            <Handshake className="w-5 h-5" />
            <span>Deal Negotiations</span>
          </a>
          
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Management</p>
          </div>
          
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#7f13ec]/5 transition-colors" href="#">
            <Users className="w-5 h-5" />
            <span>Affiliates</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#7f13ec]/5 transition-colors" href="#">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-[#7f13ec]/20">
          <Button className="w-full bg-[#7f13ec] hover:bg-[#7f13ec]/90 text-white py-6 rounded-lg font-bold text-sm shadow-lg shadow-[#7f13ec]/20">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-[#7f13ec]/20 flex items-center justify-between px-8 bg-white/50 dark:bg-[#191022]/50 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-[#7f13ec]/10 border-none rounded-lg focus:ring-2 focus:ring-[#7f13ec]/50 text-sm transition-all outline-none" 
                placeholder="Search across brands, players, or deals..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 dark:hover:bg-[#7f13ec]/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#191022]"></span>
            </Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-[#7f13ec]/20"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Alex Rivera</p>
                <p className="text-xs text-slate-500">Agency Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-[#7f13ec]/20">
                <img src="https://i.pravatar.cc/150?u=alex" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Performance Overview</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time gaming metrics and affiliate conversion tracking.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white dark:bg-[#7f13ec]/10 border-slate-200 dark:border-[#7f13ec]/30 hover:bg-slate-50 dark:hover:bg-[#7f13ec]/20">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              <Button className="bg-[#7f13ec] text-white shadow-lg shadow-[#7f13ec]/20 hover:brightness-110">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Total Players" value="12,450" change="+12.5%" icon={Users} color="emerald" />
            <KPICard title="Active Users" value="3,820" change="-2.4%" icon={Zap} color="blue" trend="down" />
            <KPICard title="Total GGR" value="$542.0k" change="+18.2%" icon={DollarSign} color="purple" />
            <KPICard title="Net Revenue" value="$318.5k" change="+14.1%" icon={Wallet} color="amber" />
          </div>

          {/* Main Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-white dark:bg-[#7f13ec]/5 border-slate-200 dark:border-[#7f13ec]/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg">Revenue Performance</h3>
                  <p className="text-sm text-slate-500">Gross vs Net Gaming Revenue</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#7f13ec]"></span>
                    <span className="text-xs font-medium">GGR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-xs font-medium">NGR</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorGgr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7f13ec" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#7f13ec" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#191022', border: '1px solid #7f13ec33', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="ggr" stroke="#7f13ec" strokeWidth={3} fillOpacity={1} fill="url(#colorGgr)" />
                    <Area type="monotone" dataKey="ngr" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Brands Card */}
            <Card className="bg-white dark:bg-[#7f13ec]/5 border-slate-200 dark:border-[#7f13ec]/10 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Top Casino Brands</h3>
              <div className="space-y-5">
                {topBrands.map((brand, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-[#0f0f12] border border-slate-200 dark:border-[#7f13ec]/20 flex items-center justify-center font-black text-xs">
                      {brand.code}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{brand.name}</p>
                      <div className="w-full bg-slate-100 dark:bg-[#0f0f12] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-[#7f13ec] h-full rounded-full" style={{ width: `${brand.percentage}%` }}></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold">${(brand.value / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-auto bg-slate-100 dark:bg-[#7f13ec]/10 hover:bg-slate-200 dark:hover:bg-[#7f13ec]/20 text-xs font-bold uppercase tracking-widest">
                View All Brands
              </Button>
            </Card>
          </div>

          {/* Active Deals Table */}
          <Card className="bg-white dark:bg-[#7f13ec]/5 border-slate-200 dark:border-[#7f13ec]/10 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-[#7f13ec]/10 flex items-center justify-between">
              <h3 className="font-bold text-lg">Active Affiliate Deals</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold uppercase">12 Active</Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold uppercase">4 Pending</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-[#0f0f12]/50 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Commission Type</th>
                    <th className="px-6 py-4">Rate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Expiring</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#7f13ec]/10">
                  {activeDeals.map((deal, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#7f13ec]/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#7f13ec]/20 text-[#7f13ec] flex items-center justify-center font-bold text-xs">{deal.code}</div>
                          <span className="text-sm font-bold">{deal.brand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{deal.type}</td>
                      <td className="px-6 py-4 font-mono font-bold text-[#7f13ec]">{deal.rate}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${
                          deal.status === 'active' ? 'text-emerald-500' : 
                          deal.status === 'pending' ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            deal.status === 'active' ? 'bg-emerald-500' : 
                            deal.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
                          }`}></span>
                          {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{deal.expiry}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#7f13ec] transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function KPICard({ title, value, change, icon: Icon, color, trend = "up" }) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-[#7f13ec]/10 text-[#7f13ec]",
    amber: "bg-amber-500/10 text-amber-500"
  };

  return (
    <Card className="bg-white dark:bg-[#7f13ec]/5 p-6 border-slate-200 dark:border-[#7f13ec]/10 flex flex-col gap-2 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <span className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-black">{value}</p>
        <p className={`${trend === 'up' ? 'text-emerald-500' : 'text-red-500'} text-xs font-bold mb-1.5 flex items-center gap-0.5`}>
          {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {change}
        </p>
      </div>
    </Card>
  );
}
