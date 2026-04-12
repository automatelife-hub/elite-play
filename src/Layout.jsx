import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { db } from "@/api/supabaseClient";
import {
  Home, Star, BarChart3, BookOpen, Bot, Building2,
  Search, Bell, User as UserIcon, LogOut, Settings,
  Menu, X, ChevronDown, Wallet, TrendingUp, Trophy,
  Gift, Newspaper, Target, Users, Crown, ArrowLeft, LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// User entity is accessed via db.auth.me()
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GIALogoMark, GIAIcon } from "@/components/intel/GIALogo";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const rootPages = ["Home", "PokerAdvisor", "Reviews", "Profile", "PlayerDashboard"];
  const isRootPage = rootPages.includes(currentPageName);

  React.useEffect(() => {
    db.auth.me().then(currentUser => {
    setUser(currentUser);
    }).catch(() => {
    setUser(null);
    });
  }, []);

  const isLandingPage = currentPageName === "Home" || currentPageName === "BecomeAgent" || 
                        currentPageName === "CasinoHome" || 
                        currentPageName === "SportsbettingHome";

  const isAgentPortal = currentPageName === "AgentPortal" || currentPageName === "MarketingHub" || 
                        currentPageName === "AgentContests" || currentPageName === "AdminStats" ||
                        currentPageName === "AdminPayouts" || currentPageName === "AdminAgents";

  // Navigation items for sidebar
  const navigationItems = [
    ...(user ? [{
      section: "My Account",
      items: [
        { title: "Dashboard", url: createPageUrl("PlayerDashboard"), icon: LayoutDashboard },
        { title: "Gamification Hub", url: createPageUrl("GamificationHub"), icon: Crown },
      ]
    }] : []),
    {
      section: "Main",
      items: [
        { title: "Home", url: createPageUrl("Home"), icon: Home },
        { title: "AI Advisor", url: createPageUrl("PokerAdvisor"), icon: Bot },
        { title: "Compare Sites", url: createPageUrl("Compare"), icon: BarChart3 },
        { title: "Leaderboard", url: createPageUrl("Leaderboard"), icon: Trophy },
        ...(!user ? [{ title: "Gamification Hub", url: createPageUrl("GamificationHub"), icon: Crown }] : []),
      ]
    },
    {
      section: "Browse",
      items: [
        { title: "Deals Marketplace", url: createPageUrl("DealsMarketplace"), icon: TrendingUp },
        { title: "Poker Sites", url: createPageUrl("PokerNetworks"), icon: Star },
        { title: "Casino Sites", url: createPageUrl("CasinoHome"), icon: Gift },
        { title: "Sportsbetting", url: createPageUrl("SportsbettingHome"), icon: Target },
        { title: "Poker Networks", url: createPageUrl("PokerNetworks"), icon: Users },
      ]
    },
    {
      section: "Resources",
      items: [
        { title: "News & Articles", url: createPageUrl("News"), icon: Newspaper },
        { title: "Guides", url: createPageUrl("Guides"), icon: BookOpen },
      ]
    }
  ];

  const agentNavigationItems = [
    {
      section: "Dashboard",
      items: [
        { title: "Overview", url: createPageUrl("AgentPortal"), icon: BarChart3 },
        { title: "Agency Stats", url: createPageUrl("AgencyDashboard"), icon: LayoutDashboard },
        { title: "Player Details", url: createPageUrl("PlayerStats"), icon: Users },
        { title: "My Deals", url: createPageUrl("AgentDeals"), icon: Target },
        { title: "Marketing Hub", url: createPageUrl("MarketingHub"), icon: TrendingUp },
        { title: "Contests", url: createPageUrl("AgentContests"), icon: Trophy },
      ]
    },
    ...(user?.role === 'admin' ? [{
      section: "Admin",
      items: [
        { title: "Agent Management", url: createPageUrl("AdminAgents"), icon: Users },
        { title: "Payouts", url: createPageUrl("AdminPayouts"), icon: Wallet },
        { title: "System Stats", url: createPageUrl("AdminStats"), icon: BarChart3 },
      ]
    }] : [])
  ];

  const currentNavItems = isAgentPortal && (user?.is_agent || user?.role === 'admin') 
    ? agentNavigationItems 
    : navigationItems;

  // Landing page layout (no sidebar)
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#080C14]">
        <style>
          {`
            :root {
              --primary-cyan: #22D3EE;
              --primary-purple: #A78BFA;
              --dark-slate: #0F172A;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
              * {
                -webkit-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
              }

              /* Hide scrollbars */
              ::-webkit-scrollbar {
                display: none;
              }
              * {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }

              /* Disable overscroll bounce */
              body {
                overscroll-behavior-y: contain;
              }

              /* Safe area insets */
              .mobile-header {
                padding-top: env(safe-area-inset-top);
              }

              .mobile-bottom-nav {
                padding-bottom: env(safe-area-inset-bottom);
              }
            }
          `}
        </style>
        
        {/* Top Navigation Bar for Landing Pages */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-[#1E2A3F]/60 mobile-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                <div className="w-8 h-8 text-teal-400">
                  <TrendingUp className="w-full h-full" />
                </div>
                <span className="text-white text-2xl font-black tracking-tight">GambleIntel</span>
              </Link>

              <div className="hidden md:flex items-center space-x-10">
                <Link to={createPageUrl("PokerNetworks")} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">
                  Poker
                </Link>
                <Link to={createPageUrl("CasinoHome")} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">
                  Casino
                </Link>
                <Link to={createPageUrl("SportsbettingHome")} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">
                  Sports
                </Link>
                <Link to={createPageUrl("Compare")} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">
                  Compare
                </Link>
                <Link to={createPageUrl("BecomeAgent")} className="text-slate-300 hover:text-white transition-colors font-bold text-sm">
                  Become Agent
                </Link>
              </div>

              <div className="hidden md:flex items-center">
                {user ? (
                  <Button variant="ghost" className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-full px-6 py-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm">{user.full_name}</span>
                  </Button>
                ) : (
                  <Link to={createPageUrl("Affiliate")}>
                    <Button className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-full px-8 py-6 font-bold text-sm">
                      Agent Login
                    </Button>
                  </Link>
                )}
              </div>

              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-300"
                >
                  {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#1E2A3F] bg-[#080C14]">
              <div className="px-4 py-4 space-y-2">
                <Link to={createPageUrl("PokerNetworks")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-[#141E35]">
                  Poker
                </Link>
                <Link to={createPageUrl("CasinoHome")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-[#141E35]">
                  Casino
                </Link>
                <Link to={createPageUrl("SportsbettingHome")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-[#141E35]">
                  Sports
                </Link>
                <Link to={createPageUrl("BecomeAgent")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-[#141E35]">
                  Become Agent
                </Link>
              </div>
            </div>
          )}
        </nav>

        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#0D1424]/50 backdrop-blur-sm border-t border-[#1E2A3F]/60 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-[#475569] text-sm">
              © 2026 AceRakeback. All rights reserved. • 18+ Only. Play responsibly.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // App Layout (with sidebar for logged-in areas)
  return (
    <div className="min-h-screen bg-[#080C14]">
      <style>
        {`
          :root {
            --primary-cyan: #22D3EE;
            --primary-emerald: #10B981;
            --dark-slate: #0F172A;
          }

          /* Glassmorphism utilities */
          .glass-card {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(16, 185, 129, 0.1);
          }

          .glass-card-light {
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(34, 211, 238, 0.1);
          }

          /* Mobile optimizations */
          @media (max-width: 768px) {
            * {
              -webkit-user-select: none;
              user-select: none;
              -webkit-tap-highlight-color: transparent;
            }

            /* Hide scrollbars */
            ::-webkit-scrollbar {
              display: none;
            }
            * {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }

            /* Disable overscroll bounce */
            body {
              overscroll-behavior-y: contain;
            }

            /* Safe area insets */
            .mobile-header {
              padding-top: env(safe-area-inset-top);
            }

            .mobile-bottom-nav {
              padding-bottom: env(safe-area-inset-bottom);
            }
          }
        `}
      </style>

      {/* Left Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0D1424]/95 backdrop-blur-xl border-r border-[#1E2A3F]/60 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden md:block`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E2A3F]/60">
            {sidebarOpen ? (
              <Link to={createPageUrl("Home")}><GIALogoMark /></Link>
            ) : (
              <GIAIcon size={32} className="mx-auto" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-blue-400"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            {currentNavItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                {sidebarOpen && (
                  <div className="px-3 mb-2 text-xs font-semibold text-[#475569] uppercase tracking-wider">
                    {section.section}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 shadow-lg shadow-blue-600/10'
                            : 'text-gray-400 hover:text-blue-400 hover:bg-[#141E35]/50'
                        }`}
                        title={!sidebarOpen ? item.title : ''}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">{item.title}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Become Agent CTA */}
          {!user?.is_agent && user?.role !== 'admin' && sidebarOpen && (
            <div className="p-4 border-t border-[#1E2A3F]/60">
              <Link to={createPageUrl("BecomeAgent")}>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-500/5 border border-blue-600/20 hover:border-blue-600/40 transition-all cursor-pointer">
                  <Building2 className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="text-sm font-semibold text-white mb-1">Become an Agent</div>
                  <div className="text-xs text-gray-400">Earn 40% commissions</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-[#0D1424]/80 backdrop-blur-xl border-b border-[#1E2A3F]/60 mobile-header">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile Back Button or Menu */}
            {!isRootPage ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="md:hidden text-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Search Bar — hidden on mobile to prevent overflow at 375px */}
            <div className="hidden sm:block flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search sites, guides, or deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141E35]/50 border-[#1E2A3F]/60 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {user?.is_agent && (
                <Link to={createPageUrl("AgentPortal")}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-blue-400 hidden sm:flex">
                    <Crown className="w-4 h-4 mr-2" />
                    Agent Portal
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-blue-400 gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden sm:inline">{user.full_name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0D1424] border-[#1E2A3F] w-56">
                    <div className="px-3 py-2 border-b border-[#1E2A3F]">
                      <div className="text-sm font-medium text-white">{user.full_name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                      {user.role === 'admin' && (
                        <Badge className="mt-1 bg-[#F43F5E]/15 text-[#FB7185] border-[#F43F5E]/20 text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("PlayerDashboard")} className="cursor-pointer text-[#94A3B8]">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Profile")} className="cursor-pointer text-[#94A3B8]">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Stats")} className="cursor-pointer text-[#94A3B8]">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        My Stats
                      </Link>
                    </DropdownMenuItem>
                    {user.is_agent && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("AgentPortal")} className="cursor-pointer text-[#94A3B8]">
                          <Crown className="w-4 h-4 mr-2" />
                          Agent Portal
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-[#1E2A3F]" />
                    <DropdownMenuItem onClick={() => db.auth.logout()} className="text-red-400 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to={createPageUrl("Affiliate")}>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#0D1424] border-r border-[#1E2A3F]">
              <div className="p-4 border-b border-[#1E2A3F]">
                  <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <circle cx="60" cy="60" r="58" fill="none" stroke="#00D9FF" strokeWidth="2" />
                        <circle cx="60" cy="60" r="50" fill="rgba(0, 71, 171, 0.1)" />
                        <path d="M 60 30 C 55 35 50 40 50 48 C 50 56 54 62 60 62 C 66 62 70 56 70 48 C 70 40 65 35 60 30 Z" fill="#00D9FF" />
                        <path d="M 55 62 L 52 70 L 68 70 L 65 62" fill="#00D9FF" />
                        <text x="60" y="90" textAnchor="middle" fontSize="10" fill="#FFD700" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="2">GIA</text>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-cyan-400 text-sm tracking-wider uppercase">Gamble Intel</span>
                      <span className="text-[7px] text-yellow-500 tracking-wide uppercase">Intelligence Agency</span>
                    </div>
                  </Link>
                </div>
              <nav className="py-4 px-3">
                {currentNavItems.map((section, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="px-3 mb-2 text-xs font-semibold text-[#475569] uppercase">
                      {section.section}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#141E35]"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-0 p-4 sm:p-6 lg:p-8" style={{ overscrollBehaviorY: 'contain' }}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D1424]/95 backdrop-blur-xl border-t border-[#1E2A3F]/60 md:hidden mobile-bottom-nav">
          <div className="flex items-center justify-around h-16 px-2">
            <Link
              to={createPageUrl("Home")}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPageName === "Home"
                  ? "text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              to={createPageUrl("PokerAdvisor")}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPageName === "PokerAdvisor"
                  ? "text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              <Bot className="w-5 h-5" />
              <span className="text-xs font-medium">Advisor</span>
            </Link>
            <Link
              to={createPageUrl("Reviews")}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPageName === "Reviews"
                  ? "text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="text-xs font-medium">Reviews</span>
            </Link>
            <Link
              to={createPageUrl("Profile")}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPageName === "Profile"
                  ? "text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </nav>
        </div>
        </div>
        );
        }