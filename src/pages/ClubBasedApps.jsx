import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Site } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Users, Shield, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function ClubBasedApps() {
  const [clubApps, setClubApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClubApps();
  }, []);

  const loadClubApps = async () => {
    try {
      const allSites = await base44.entities.Site.list('-rating');
      
      // Filter only club-based apps
      const clubs = allSites.filter(site => site.is_club_based_app === true);
      
      setClubApps(clubs);
    } catch (error) {
      console.error("Error loading club-based apps:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mx-auto mb-8 bg-gray-800" />
          <div className="grid gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 py-20 border-b border-emerald-500/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-6 px-4 py-2">
              <Users className="w-4 h-4 mr-2 inline" />
              Private Club Poker
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Apps with </span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Private Clubs
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join exclusive poker clubs with soft games, private tables, and dedicated communities
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {clubApps.length > 0 ? (
          <div className="grid gap-6">
            {clubApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`${createPageUrl("SiteDetail")}?site=${app.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`}>
                  <Card className="group bg-gradient-to-r from-slate-900/90 to-slate-950 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6 items-center">
                        <div className="flex items-center space-x-4">
                          {app.logo_url && (
                            <div className="bg-white rounded-lg p-2 shadow-md flex-shrink-0">
                              <img
                                src={app.logo_url}
                                alt={app.name}
                                className="w-[130px] h-[130px] object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {app.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(app.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-yellow-400 font-semibold">{app.rating}</span>
                            </div>
                            {app.bonus_offer && (
                              <p className="text-green-400 text-sm font-medium">
                                🎁 {app.bonus_offer}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <Users className="w-3 h-3 mr-1 inline" />
                            Club-Based
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          {app.highlights?.slice(0, 3).map((highlight, idx) => (
                            <div key={idx} className="flex items-center text-gray-300 text-sm">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></div>
                              {highlight}
                            </div>
                          ))}
                        </div>

                        <div className="text-right">
                          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Club-Based Apps Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We're working on adding exclusive club-based poker apps. Check back soon!
            </p>
            <Link to={createPageUrl("PokerHome")}>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Back to Poker Sites
              </Button>
            </Link>
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-slate-900/50 to-slate-950/50 border border-slate-800 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">What are Club-Based Poker Apps?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Private & Secure</h3>
                <p className="text-sm text-gray-400">
                  Invite-only clubs with vetted players and secure environments
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Soft Games</h3>
                <p className="text-sm text-gray-400">
                  Recreational-focused player pools with softer competition
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Exclusive Benefits</h3>
                <p className="text-sm text-gray-400">
                  Special rakeback deals and promotions for club members
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}