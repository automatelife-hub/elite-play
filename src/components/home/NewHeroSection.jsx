import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Gift, Users, Globe, ArrowRight, CheckCircle } from "lucide-react";
import { db } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function NewHeroSection({ sites, loading, userCountry }) {
  const [showClubApps, setShowClubApps] = useState(false);
  const [clubApps, setClubApps] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(false);

  useEffect(() => {
    if (showClubApps && clubApps.length === 0) {
      loadClubApps();
    }
  }, [showClubApps]);

  const loadClubApps = async () => {
    setLoadingClubs(true);
    try {
      const allSites = await db.entities.Site.list('-rating');
      const clubs = allSites.filter(site => site.is_club_based_app === true);
      setClubApps(clubs);
    } catch (error) {
      console.error("Error loading club apps:", error);
    } finally {
      setLoadingClubs(false);
    }
  };

  const displaySites = showClubApps ? clubApps.slice(0, 5) : (sites?.slice(0, 5) || []);
  const isLoading = showClubApps ? loadingClubs : loading;

  return (
    <div className="relative min-h-[700px] flex items-center overflow-hidden bg-[#080C14]">
      {/* Background with cards and chips effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        
        {/* Decorative elements to mimic the image's background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">
              Empower Your <br />
              <span className="text-white">iGaming Growth</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed font-medium">
              Premium deals, expert guidance, and the best rakeback offers across poker, casino, and sportsbetting.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-12">
              <div className="flex items-center gap-3 text-slate-200 font-semibold">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                24/7 player & agent support
              </div>
              <div className="flex items-center gap-3 text-slate-200 font-semibold">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                Top rakeback & VIP deals
              </div>
              <div className="flex items-center gap-3 text-slate-200 font-semibold">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                50+ verified sites
              </div>
              <div className="flex items-center gap-3 text-slate-200 font-semibold">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                Affiliate programs available
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <Link to={createPageUrl("Reviews")}>
                <Button className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-[#080C14] font-black px-10 py-7 text-lg rounded-xl shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all transform hover:scale-105">
                  Explore All Deals
                </Button>
              </Link>
              <Link to={createPageUrl("BecomeAgent")}>
                <Button variant="outline" className="border-2 border-slate-700 text-white hover:bg-white/5 px-10 py-7 text-lg font-black rounded-xl transition-all">
                  Start an Agency
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Tabbed List Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#111827]/80 backdrop-blur-xl rounded-[2rem] border border-slate-800/50 shadow-2xl overflow-hidden"
          >
            {/* Tabs Header */}
            <div className="flex p-4 gap-2">
              <button
                onClick={() => setShowClubApps(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all font-bold text-sm ${
                  !showClubApps ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Best rooms <span className="text-lg">🌎</span> for US
              </button>
              <button
                onClick={() => setShowClubApps(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all font-bold text-sm ${
                  showClubApps ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Apps with private clubs
              </button>
            </div>

            {/* List Content */}
            <div className="px-4 pb-4 space-y-3">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key={showClubApps ? "clubs" : "rooms"}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {displaySites.length > 0 ? (
                      displaySites.map((site, index) => (
                        <div key={site.id} className="group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/50 hover:border-slate-700 rounded-2xl p-3 flex items-center justify-between transition-all">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-14 h-14 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 p-1 flex items-center justify-center">
                              {site.logo_url ? (
                                <img src={site.logo_url} alt={site.name} className="w-full h-full object-contain" />
                              ) : (
                                <div className="text-teal-400 font-black text-xl">{site.name.charAt(0)}</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-white font-bold text-base truncate">{site.name}</h4>
                              <p className="text-teal-400/90 text-xs font-bold truncate flex items-center gap-1.5">
                                <Gift className="w-3 h-3" />
                                {site.bonus_offer || "Exclusive Welcome Bonus"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-[#080C14] font-black rounded-lg h-9 px-4 text-xs">
                                Sign up
                              </Button>
                            </a>
                            <Link to={`${createPageUrl("SiteDetail")}?site=${site.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`}>
                              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg h-9 px-4 text-xs font-bold">
                                Review
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center text-slate-500 font-bold">
                        No sites found for this category.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 text-center border-t border-slate-800/50">
              <Link to={createPageUrl("Reviews")} className="text-teal-400 hover:text-teal-300 font-black text-sm flex items-center justify-center gap-2 group">
                View all sites
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
