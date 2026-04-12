import React from "react";
import { 
  Dice5, 
  Search, 
  Download, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Mail,
  Gamepad2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const players = [
  { id: "USR_992812", regDate: "Oct 12, 2023", type: "Casino", deposit: "$1,250.00", wagering: "$14,580.40", revenue: "+$412.50", revColor: "text-emerald-400" },
  { id: "USR_992844", regDate: "Oct 14, 2023", type: "Poker", deposit: "$800.00", wagering: "$2,100.00", revenue: "-$84.20", revColor: "text-rose-400" },
  { id: "USR_993102", regDate: "Oct 15, 2023", type: "Casino", deposit: "$5,400.00", wagering: "$82,900.00", revenue: "+$1,822.10", revColor: "text-emerald-400" },
  { id: "USR_993415", regDate: "Oct 18, 2023", type: "Casino", deposit: "$450.00", wagering: "$3,200.50", revenue: "+$120.00", revColor: "text-emerald-400" },
  { id: "USR_993882", regDate: "Oct 20, 2023", type: "Poker", deposit: "$3,100.00", wagering: "$12,400.00", revenue: "+$940.50", revColor: "text-emerald-400" },
  { id: "USR_994119", regDate: "Oct 22, 2023", type: "Casino", deposit: "$210.00", wagering: "$840.00", revenue: "-$12.40", revColor: "text-rose-400" },
  { id: "USR_994451", regDate: "Oct 25, 2023", type: "Casino", deposit: "$9,200.00", wagering: "$142,000.00", revenue: "+$3,440.00", revColor: "text-emerald-400" },
];

export default function PlayerStats() {
  return (
    <div className="bg-[#f7f6f8] dark:bg-[#0f0f12] text-white font-sans min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#362348] bg-[#1a1122] px-10 py-3 sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <div className="text-[#7f13ec]">
                <Dice5 className="w-8 h-8" />
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-tight">iGaming Agency</h2>
            </div>
            <nav className="flex items-center gap-8">
              <a className="text-[#ad92c9] hover:text-white transition-colors text-sm font-medium" href="#">Dashboard</a>
              <a className="text-white text-sm font-bold border-b-2 border-[#7f13ec] pb-1" href="#">Players</a>
              <a className="text-[#ad92c9] hover:text-white transition-colors text-sm font-medium" href="#">Deals</a>
              <a className="text-[#ad92c9] hover:text-white transition-colors text-sm font-medium" href="#">Reports</a>
              <a className="text-[#ad92c9] hover:text-white transition-colors text-sm font-medium" href="#">Finance</a>
            </nav>
          </div>
          
          <div className="flex flex-1 justify-end gap-4 items-center">
            <div className="flex min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden bg-[#362348]">
                <div className="text-[#ad92c9] flex items-center justify-center pl-4">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent text-white focus:ring-0 placeholder:text-[#ad92c9] px-4 pl-2 text-sm font-normal outline-none" 
                  placeholder="Quick search player ID..."
                />
              </div>
            </div>
            <button className="flex gap-2 items-center bg-[#7f13ec] hover:bg-[#7f13ec]/90 transition-all text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#7f13ec]/20">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <div className="relative group">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#7f13ec]/30" style={{ backgroundImage: "url('https://i.pravatar.cc/150?u=alex')" }}></div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8">
          {/* Breadcrumbs & Header */}
          <div className="mb-8">
            <nav className="flex gap-2 text-[#ad92c9] text-sm mb-4">
              <a className="hover:text-[#7f13ec] transition-colors" href="#">Reports</a>
              <span>/</span>
              <span className="text-white font-medium">Detailed Player Statistics</span>
            </nav>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-white text-4xl font-black tracking-tight mb-2">Detailed Player Statistics</h1>
                <p className="text-[#ad92c9] text-lg max-w-2xl">Deep-dive into individual player performance, deposit patterns, and net revenue across all brands and traffic sources.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex rounded-lg bg-[#1a1122] p-1 border border-[#362348]">
                  <button className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#7f13ec] text-white transition-all">Casino</button>
                  <button className="px-3 py-1.5 rounded-md text-xs font-bold text-[#ad92c9] hover:text-white transition-colors">Poker</button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Deposits" value="$142,580.00" change="12.5% vs last month" icon={TrendingUp} trend="up" />
            <StatCard title="Total Wagering" value="$2,104,922.50" change="8.2% vs last month" icon={TrendingUp} trend="up" />
            <StatCard title="Net Revenue" value="$48,290.15" change="Stable performance" icon={Minus} trend="neutral" />
            <StatCard title="New Registrations" value="1,204" change="4.1% vs last month" icon={TrendingDown} trend="down" />
          </div>

          {/* Filter Bar */}
          <div className="bg-[#1a1122] border border-[#362348] rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
            <div className="flex-1 min-w-[240px]">
              <p className="text-[#ad92c9] text-[10px] font-bold uppercase mb-1 ml-1">Date Range</p>
              <div className="flex items-center bg-[#0f0f12] border border-[#362348] rounded-lg px-3 py-2 text-sm text-white gap-3 cursor-pointer hover:border-[#7f13ec] transition-colors">
                <Calendar className="w-5 h-5 text-[#ad92c9]" />
                <span>Oct 01, 2023 - Oct 31, 2023</span>
                <ChevronDown className="w-4 h-4 text-[#ad92c9] ml-auto" />
              </div>
            </div>
            <div className="w-48">
              <p className="text-[#ad92c9] text-[10px] font-bold uppercase mb-1 ml-1">Traffic Source</p>
              <div className="flex items-center bg-[#0f0f12] border border-[#362348] rounded-lg px-3 py-2 text-sm text-white gap-2 cursor-pointer hover:border-[#7f13ec] transition-colors">
                <span className="truncate">All Sources</span>
                <ChevronDown className="w-4 h-4 text-[#ad92c9] ml-auto" />
              </div>
            </div>
            <div className="w-48">
              <p className="text-[#ad92c9] text-[10px] font-bold uppercase mb-1 ml-1">Account Manager</p>
              <div className="flex items-center bg-[#0f0f12] border border-[#362348] rounded-lg px-3 py-2 text-sm text-white gap-2 cursor-pointer hover:border-[#7f13ec] transition-colors">
                <span className="truncate">Alex Rivers</span>
                <ChevronDown className="w-4 h-4 text-[#ad92c9] ml-auto" />
              </div>
            </div>
            <div className="flex items-end gap-2 pt-5">
              <button className="bg-[#7f13ec] px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg shadow-[#7f13ec]/20 hover:scale-[1.02] active:scale-95 transition-all">Apply</button>
              <button className="bg-[#362348] px-4 py-2 rounded-lg text-sm font-bold text-[#ad92c9] hover:text-white transition-colors">Reset</button>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-[#1a1122] border border-[#362348] rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[#0f0f12]/50 border-b border-[#362348]">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest sticky left-0 bg-[#1a1122] z-10">Player ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest">Reg. Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest">Type</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest">Deposit Amount</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest">Wagering</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest text-right">Net Revenue</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-[#ad92c9] tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#362348]">
                  {players.map((player, idx) => (
                    <tr key={idx} className="hover:bg-[#7f13ec]/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-white sticky left-0 bg-[#1a1122] group-hover:bg-[#231730] transition-colors">{player.id}</td>
                      <td className="px-6 py-4 text-sm text-[#ad92c9]">{player.regDate}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[10px] font-bold uppercase ${
                          player.type === 'Casino' ? 'bg-[#7f13ec]/20 text-[#7f13ec] border-[#7f13ec]/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {player.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{player.deposit}</td>
                      <td className="px-6 py-4 text-sm text-[#ad92c9]">{player.wagering}</td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${player.revColor}`}>{player.revenue}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-[#ad92c9] hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                          <Info className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-[#0f0f12]/30 border-t border-[#362348] flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-[#ad92c9]">
                <p>Showing <span className="text-white font-bold">1-7</span> of <span className="text-white font-bold">1,204</span> players</p>
                <select className="bg-[#0f0f12] border border-[#362348] text-white rounded px-2 py-1 text-xs focus:ring-[#7f13ec] focus:border-[#7f13ec] outline-none">
                  <option>10 per page</option>
                  <option>25 per page</option>
                  <option>50 per page</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-[#362348] text-[#ad92c9] hover:text-white transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#7f13ec] text-white text-sm font-bold shadow-md">1</button>
                <button className="px-4 py-2 rounded-lg text-[#ad92c9] hover:text-white transition-colors text-sm font-bold">2</button>
                <button className="px-4 py-2 rounded-lg text-[#ad92c9] hover:text-white transition-colors text-sm font-bold">3</button>
                <span className="text-[#ad92c9] px-2">...</span>
                <button className="px-4 py-2 rounded-lg text-[#ad92c9] hover:text-white transition-colors text-sm font-bold">121</button>
                <button className="p-2 rounded-lg border border-[#362348] text-[#ad92c9] hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#362348] mt-12 py-12 px-10 bg-[#1a1122]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white mb-6">
                <Dice5 className="w-8 h-8 text-[#7f13ec]" />
                <span className="font-bold text-xl tracking-tight">iGaming Agency</span>
              </div>
              <p className="text-[#ad92c9] max-w-sm mb-6">Empowering casino and poker affiliates with real-time data analysis, advanced deal negotiation tools, and comprehensive player statistics.</p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full border border-[#362348] flex items-center justify-center text-[#ad92c9] hover:text-white hover:border-[#7f13ec] transition-all" href="#">
                  <Globe className="w-5 h-5" />
                </a>
                <a className="w-10 h-10 rounded-full border border-[#362348] flex items-center justify-center text-[#ad92c9] hover:text-white hover:border-[#7f13ec] transition-all" href="#">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-[#ad92c9] text-sm">
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Affiliate Dash</a></li>
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Deal Builder</a></li>
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">API Access</a></li>
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Player Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-[#ad92c9] text-sm">
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Compliance</a></li>
                <li><a className="hover:text-[#7f13ec] transition-colors" href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-[#362348] flex justify-between text-xs text-[#ad92c9]">
            <p>© 2023 iGaming Agency Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="#">Cookie Policy</a>
              <a className="hover:text-white transition-colors" href="#">Security</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, trend }) {
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-[#7f13ec]';
  return (
    <div className="bg-[#1a1122] border border-[#362348] p-5 rounded-xl shadow-lg">
      <p className="text-[#ad92c9] text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      <div className={`flex items-center gap-1 ${trendColor} text-xs font-bold mt-2`}>
        <Icon className="w-4 h-4" />
        <span>{change}</span>
      </div>
    </div>
  );
}
