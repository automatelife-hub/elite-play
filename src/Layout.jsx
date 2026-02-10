import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  Home, Star, BarChart3, BookOpen, Bot, Building2, 
  Search, Bell, User as UserIcon, LogOut, Settings, 
  Menu, X, ChevronDown, Wallet, TrendingUp, Trophy,
  Gift, Newspaper, Target, Users, Crown, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// User entity is accessed via base44.auth.me()
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const rootPages = ["Home", "PokerAdvisor", "Reviews", "Profile"];
  const isRootPage = rootPages.includes(currentPageName);

  React.useEffect(() => {
    base44.auth.me().then(currentUser => {
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
    {
      section: "Main",
      items: [
        { title: "Home", url: createPageUrl("Home"), icon: Home },
        { title: "AI Advisor", url: createPageUrl("PokerAdvisor"), icon: Bot },
        { title: "Compare Sites", url: createPageUrl("Compare"), icon: BarChart3 },
        { title: "Leaderboard", url: createPageUrl("Leaderboard"), icon: Trophy },
      ]
    },
    {
      section: "Browse",
      items: [
        { title: "Poker Sites", url: createPageUrl("BestPokerSites"), icon: Star },
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
      <div className="min-h-screen bg-slate-950">
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 mobile-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg shadow-lg shadow-emerald-500/30" />
                  <div className="absolute inset-0.5 bg-slate-950 rounded-md flex items-center justify-center">
                    <span className="text-emerald-400 font-bold">♠</span>
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  AceRakeback
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link to={createPageUrl("PokerHome")} className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Poker
                </Link>
                <Link to={createPageUrl("CasinoHome")} className="text-gray-300 hover:text-purple-400 transition-colors">
                  Casino
                </Link>
                <Link to={createPageUrl("SportsbettingHome")} className="text-gray-300 hover:text-orange-400 transition-colors">
                  Sports
                </Link>
                <Link to={createPageUrl("Compare")} className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Compare
                </Link>
                <Link to={createPageUrl("BecomeAgent")} className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  Become Agent
                </Link>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-300 hover:text-cyan-400">
                        <UserIcon className="w-4 h-4 mr-2" />
                        {user.full_name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 border-slate-700">
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="cursor-pointer text-gray-300">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {user.is_agent && (
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("AgentPortal")} className="cursor-pointer text-gray-300">
                            Agent Portal
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-400 cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to={createPageUrl("Affiliate")}>
                    <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
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
            <div className="md:hidden border-t border-slate-800 bg-slate-950">
              <div className="px-4 py-4 space-y-2">
                <Link to={createPageUrl("PokerHome")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800">
                  Poker
                </Link>
                <Link to={createPageUrl("CasinoHome")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800">
                  Casino
                </Link>
                <Link to={createPageUrl("SportsbettingHome")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800">
                  Sports
                </Link>
                <Link to={createPageUrl("BecomeAgent")} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800">
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
        <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-gray-400 text-sm">
              © 2026 AceRakeback. All rights reserved. • 18+ Only. Play responsibly.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // App Layout (with sidebar for logged-in areas)
  return (
    <div className="min-h-screen bg-slate-950">
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
        `}
      </style>

      {/* Left Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden md:block`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
            {sidebarOpen ? (
              <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg" />
                  <div className="absolute inset-0.5 bg-slate-950 rounded-md flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-sm">♠</span>
                  </div>
                </div>
                <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  AceRakeback
                </span>
              </Link>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">♠</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-cyan-400"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            {currentNavItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                {sidebarOpen && (
                  <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                            ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10'
                            : 'text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50'
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
            <div className="p-4 border-t border-slate-800/50">
              <Link to={createPageUrl("BecomeAgent")}>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer">
                  <Building2 className="w-6 h-6 text-emerald-400 mb-2" />
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
        <header className="sticky top-0 z-40 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search sites, guides, or deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {user?.is_agent && (
                <Link to={createPageUrl("AgentPortal")}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-emerald-400 hidden sm:flex">
                    <Crown className="w-4 h-4 mr-2" />
                    Agent Portal
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-cyan-400 gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden sm:inline">{user.full_name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 w-56">
                    <div className="px-3 py-2 border-b border-slate-700">
                      <div className="text-sm font-medium text-white">{user.full_name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                      {user.role === 'admin' && (
                        <Badge className="mt-1 bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Profile")} className="cursor-pointer text-gray-300">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Stats")} className="cursor-pointer text-gray-300">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        My Stats
                      </Link>
                    </DropdownMenuItem>
                    {user.is_agent && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("AgentPortal")} className="cursor-pointer text-gray-300">
                          <Crown className="w-4 h-4 mr-2" />
                          Agent Portal
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-400 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to={createPageUrl("Affiliate")}>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
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
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800">
              <div className="p-4 border-b border-slate-800">
                <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">♠</span>
                  </div>
                  <span className="font-bold text-white">AceRakeback</span>
                </Link>
              </div>
              <nav className="py-4 px-3">
                {currentNavItems.map((section, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
                      {section.section}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800"
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
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 md:hidden mobile-bottom-nav">
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