import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Star, BarChart3, BookOpen, Menu, X, Bot, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/entities/all";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import ThemeToggle from "./components/ui/ThemeToggle";
import OnboardingTooltip from "./components/onboarding/OnboardingTooltip";

// Helper component for selecting user location
const LocationSelector = ({ currentCountry, onLocationChanged }) => {
  const countries = [
    // North America
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "MX", name: "Mexico" },
    
    // CIS Countries
    { code: "RU", name: "Russia" },
    { code: "UA", name: "Ukraine" },
    { code: "BY", name: "Belarus" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "AM", name: "Armenia" },
    { code: "GE", name: "Georgia" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TM", name: "Turkmenistan" },
    { code: "MD", name: "Moldova" },
    
    // Western Europe
    { code: "UK", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "NL", name: "Netherlands" },
    { code: "BE", name: "Belgium" },
    { code: "AT", name: "Austria" },
    { code: "CH", name: "Switzerland" },
    { code: "IE", name: "Ireland" },
    { code: "PT", name: "Portugal" },
    
    // Northern Europe
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "IS", name: "Iceland" },
    
    // Eastern Europe
    { code: "PL", name: "Poland" },
    { code: "CZ", name: "Czech Republic" },
    { code: "SK", name: "Slovakia" },
    { code: "HU", name: "Hungary" },
    { code: "RO", name: "Romania" },
    { code: "BG", name: "Bulgaria" },
    { code: "HR", name: "Croatia" },
    { code: "SI", name: "Slovenia" },
    { code: "RS", name: "Serbia" },
    { code: "LT", name: "Lithuania" },
    { code: "LV", name: "Latvia" },
    { code: "EE", name: "Estonia" },
    
    // Asia-Pacific
    { code: "AU", name: "Australia" },
    { code: "NZ", name: "New Zealand" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "CN", name: "China" },
    { code: "HK", name: "Hong Kong" },
    { code: "TW", name: "Taiwan" },
    { code: "SG", name: "Singapore" },
    { code: "MY", name: "Malaysia" },
    { code: "TH", name: "Thailand" },
    { code: "PH", name: "Philippines" },
    { code: "ID", name: "Indonesia" },
    { code: "VN", name: "Vietnam" },
    { code: "IN", name: "India" },
    
    // Latin America
    { code: "BR", name: "Brazil" },
    { code: "AR", name: "Argentina" },
    { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" },
    { code: "PE", name: "Peru" },
    { code: "VE", name: "Venezuela" },
    { code: "UY", name: "Uruguay" },
    { code: "EC", name: "Ecuador" },
    { code: "CR", name: "Costa Rica" },
    
    // Middle East
    { code: "TR", name: "Turkey" },
    { code: "IL", name: "Israel" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SA", name: "Saudi Arabia" },
    
    // Africa
    { code: "ZA", name: "South Africa" },
    { code: "NG", name: "Nigeria" },
    { code: "KE", name: "Kenya" },
    { code: "EG", name: "Egypt" },
  ];

  // Helper to find country name from code for display
  const getCurrentCountryName = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code; // Fallback to code if name not found
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
        >
          <span className="font-medium">{getCurrentCountryName(currentCountry)}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900 border-slate-700 max-h-96 overflow-y-auto">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => onLocationChanged(country.code)}
            className="cursor-pointer text-gray-300 hover:text-cyan-400 hover:bg-slate-800"
          >
            {country.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const navigationItems = [
  {
    title: "Poker Sites",
    hasDropdown: true,
    icon: Star,
    dropdownItems: [
      { title: "Best poker sites 2025", url: createPageUrl("BestPokerSites") },
      { title: "Best Rakeback", url: createPageUrl("BestRakeback") },
      { title: "New poker sites", url: createPageUrl("NewPokerSites") },
      { title: "Club-based apps", url: createPageUrl("ClubBasedApps") },
      { title: "Sweepstakes poker", url: createPageUrl("SweepstakesPoker") },
      { title: "Poker networks", url: createPageUrl("PokerNetworks") },
    ]
  },
  {
    title: "Promotions",
    hasDropdown: true,
    icon: Star,
    dropdownItems: [
      { title: "Latest Promotions", url: createPageUrl("LatestPromotions") },
      { title: "Bonuses", url: createPageUrl("Bonuses") },
      { title: "For Cash Game Players", url: createPageUrl("CashGamePromotions") },
      { title: "Rake Races", url: createPageUrl("RakeRaces") },
    ]
  },
  {
    title: "News",
    url: createPageUrl("Reviews"),
    icon: Star,
  },
  {
    title: "AI Advisor",
    url: createPageUrl("PokerAdvisor"),
    icon: Bot,
  },
  {
    title: "Compare",
    url: createPageUrl("Compare"),
    icon: BarChart3,
  },
  {
    title: "Guides",
    url: createPageUrl("Guides"),
    icon: BookOpen,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState("Poker");
  const [userCountry, setUserCountry] = React.useState(null);
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    // Check saved theme preference
    const savedTheme = localStorage.getItem("acerakeback_theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    
    // Check if onboarding should be shown
    const onboardingComplete = localStorage.getItem("acerakeback_onboarding_complete");
    if (!onboardingComplete) {
      // Delay showing onboarding for better UX
      setTimeout(() => setShowOnboarding(true), 1000);
    }

    User.me().then(currentUser => {
      setUser(currentUser);
      setUserCountry(currentUser?.country_code || "US");
    }).catch(() => {
      setUser(null);
      setUserCountry("US");
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("acerakeback_theme", newTheme ? "dark" : "light");
  };

  const handleLocationChanged = (country) => {
    setUserCountry(country);
    // Reload the page to apply geo-targeting logic based on the new country.
    // In a real application, you might update a cookie or local storage,
    // then trigger a data refetch instead of a full page reload for a smoother UX.
    window.location.reload(); 
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
      {/* Onboarding for new users */}
      {showOnboarding && (
        <OnboardingTooltip onComplete={() => setShowOnboarding(false)} />
      )}
      <style>
        {`
          :root {
            --primary-cyan: #22D3EE;
            --primary-cyan-hover: #06B6D4;
            --secondary-purple: #A78BFA;
            --dark-slate: #0F172A;
            --light-slate: #1E293B;
            --accent-emerald: #10B981;
          }
        `}
      </style>
      
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        {/* Top Row - Logo and Category Buttons */}
        <div className="border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-6">
                <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
                                        <div className="relative w-11 h-11">
                                          {/* Logo background with glow */}
                                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl shadow-lg shadow-emerald-500/30" />
                                          {/* Inner card design */}
                                          <div className="absolute inset-0.5 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[10px] flex items-center justify-center">
                                            <div className="relative">
                                              <span className="text-emerald-400 font-bold text-xl">♠</span>
                                              <span className="absolute -top-1 -right-2 text-xs text-cyan-400 font-bold">A</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                                            AceRakeback
                                          </span>
                                          <span className="text-[10px] text-gray-500 tracking-widest uppercase">Pro Affiliate</span>
                                        </div>
                                      </Link>

                {/* Category Buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    onClick={() => setActiveCategory("Poker")}
                    className={`font-semibold transition-all ${
                      activeCategory === "Poker"
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    }`}
                  >
                    Poker
                  </Button>
                  <Button
                    onClick={() => setActiveCategory("Casino")}
                    className={`font-semibold transition-all ${
                      activeCategory === "Casino"
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    }`}
                  >
                    Casino
                  </Button>
                  <Button
                    onClick={() => setActiveCategory("Sportsbetting")}
                    className={`font-semibold transition-all ${
                      activeCategory === "Sportsbetting"
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    }`}
                  >
                    Sportsbetting
                  </Button>
                </div>
              </div>

              {/* User Profile Links (Desktop) */}
                                  <div className="hidden md:flex items-center space-x-4">
                                    <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
                                    {userCountry && (
                                      <LocationSelector currentCountry={userCountry} onLocationChanged={handleLocationChanged} />
                                    )}
                                    <Link
                  to={createPageUrl("BecomeAgent")}
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-semibold flex items-center space-x-1"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Become Agent</span>
                </Link>
                <Link
                  to={createPageUrl("Affiliate")}
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-semibold"
                >
                  Agent Login
                </Link>
                {user && (
                  <>
                    <Link
                      to={createPageUrl("Profile")}
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to={createPageUrl("Stats")}
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      Stats
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to={createPageUrl("AdminStats")}
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-300"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-center space-x-8 h-14">
            {navigationItems.map((item) => (
              item.hasDropdown ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50">
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-slate-700">
                    {item.dropdownItems.map((dropdownItem) => (
                      <DropdownMenuItem key={dropdownItem.title} asChild>
                        <Link
                          to={dropdownItem.url}
                          className="cursor-pointer text-gray-300 hover:text-cyan-400 hover:bg-slate-800"
                        >
                          {dropdownItem.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.url
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700">
            <div className="px-4 pt-4 space-y-2">
              {/* Mobile Category Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => setActiveCategory("Poker")}
                  size="sm"
                  className={`flex-1 ${
                    activeCategory === "Poker"
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                  }`}
                >
                  Poker
                </Button>
                <Button
                  onClick={() => setActiveCategory("Casino")}
                  size="sm"
                  className={`flex-1 ${
                    activeCategory === "Casino"
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                  }`}
                >
                  Casino
                </Button>
                <Button
                  onClick={() => setActiveCategory("Sportsbetting")}
                  size="sm"
                  className={`flex-1 ${
                    activeCategory === "Sportsbetting"
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                  }`}
                >
                  Sports
                </Button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex flex-col space-y-2">
                {userCountry && (
                    <LocationSelector currentCountry={userCountry} onLocationChanged={handleLocationChanged} />
                )}
                {navigationItems.map((item) => (
                  item.hasDropdown ? (
                    <div key={item.title} className="space-y-1">
                      <div className="flex items-center space-x-2 px-3 py-2 text-gray-300 font-medium">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.title}
                            to={dropdownItem.url}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-slate-800/50 text-sm"
                          >
                            {dropdownItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        location.pathname === item.url
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )
                ))}
                
                <Link
                  to={createPageUrl("BecomeAgent")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 font-semibold"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Become Agent</span>
                </Link>
                <Link
                  to={createPageUrl("Affiliate")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 font-semibold"
                >
                  <span>Agent Login</span>
                </Link>

                {user && (
                  <>
                    <Link
                      to={createPageUrl("Profile")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
                    >
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to={createPageUrl("Stats")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
                    >
                      <span className="font-medium">Stats</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to={createPageUrl("AdminStats")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
                      >
                        <span className="font-medium">Admin</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                                    <div className="relative w-9 h-9">
                                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg" />
                                      <div className="absolute inset-0.5 bg-gray-900 rounded-md flex items-center justify-center">
                                        <div className="relative">
                                          <span className="text-emerald-400 font-bold">♠</span>
                                          <span className="absolute -top-0.5 -right-1.5 text-[8px] text-cyan-400 font-bold">A</span>
                                        </div>
                                      </div>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AceRakeback</span>
                                  </div>
              <p className="text-gray-400 max-w-md">
                Your trusted guide to the world's best poker sites and online casinos. 
                We provide honest reviews and expert recommendations to help you play smarter.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  item.hasDropdown ? null : (
                    <li key={item.title}>
                      <Link 
                        to={item.url} 
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  )
                ))}
                {user?.role === 'admin' && (
                  <li>
                    <Link 
                      to={createPageUrl("AffiliateLinks")} 
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      Manage Links
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-400">Terms of Service</span></li>
                <li><span className="text-gray-400">Privacy Policy</span></li>
                <li><span className="text-gray-400">Responsible Gaming</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 AceRakeback. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2 md:mt-0">
                18+ Only. Gambling can be addictive. Please play responsibly.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}