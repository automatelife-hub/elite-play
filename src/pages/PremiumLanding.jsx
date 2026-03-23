import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ImageCard } from "@/components/ui/ImageCard";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Star, TrendingUp, Shield, Zap, 
  Award, Users, DollarSign, Globe, Sparkles,
  CheckCircle, Crown, Target
} from "lucide-react";

export default function PremiumLanding() {
  const [user, setUser] = useState(null);
  const [featuredSites, setFeaturedSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      const sites = await db.entities.Site.filter({ featured: true }, '-rating', 6);
      setFeaturedSites(sites);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Crown,
      title: "Premium Deals",
      description: "Exclusive partnerships with top iGaming operators worldwide",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      title: "40% Commission",
      description: "Industry-leading revenue share on all qualified players",
      gradient: "from-emerald-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Trusted Platform",
      description: "Licensed operators with proven track records and timely payments",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Real-Time Tracking",
      description: "Advanced analytics and performance monitoring dashboard",
      gradient: "from-pink-500 to-rose-600"
    }
  ];

  const stats = [
    { label: "Active Agents", value: "2,500+", icon: Users },
    { label: "Monthly Payouts", value: "$2.5M+", icon: DollarSign },
    { label: "Partner Sites", value: "150+", icon: Globe },
    { label: "Avg. Commission", value: "38%", icon: Target }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-6 py-2 text-base">
              <Sparkles className="w-4 h-4 mr-2" />
              The Premium iGaming Affiliate Network
            </Badge>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Turn Traffic Into
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Premium Revenue
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Join the elite network of iGaming affiliates earning industry-leading commissions 
              with exclusive deals, real-time analytics, and unmatched support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 py-6 shadow-2xl shadow-emerald-500/20"
              >
                Start Earning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8 py-6"
              >
                View Premium Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 border-y border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center space-y-2">
                  <Icon className="w-8 h-8 mx-auto text-emerald-400 mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sites */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              Premium Partners
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Exclusive <span className="text-emerald-400">Premium Deals</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Partner with the most trusted names in iGaming. Higher commissions, better players, faster payouts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSites.map((site) => (
              <Link key={site.id} to={createPageUrl("SiteDetail") + `?id=${site.id}`}>
                <Card className="bg-slate-900/50 border-slate-800/50 hover:border-emerald-500/30 transition-all duration-300 group backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/10">
                  {/* Site Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-xl bg-slate-800">
                    {site.logo_url ? (
                      <img 
                        src={site.logo_url} 
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <Award className="w-16 h-16 text-slate-700" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-500/90 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        {site.rating}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl text-white group-hover:text-emerald-400 transition-colors">
                      {site.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2">
                      {site.bonus_offer || "Exclusive welcome bonus for your players"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Commission Badge */}
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <span className="text-sm text-gray-400">Commission Rate</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {site.commission_rate || 40}%
                      </span>
                    </div>

                    {/* Highlights */}
                    {site.highlights && site.highlights.length > 0 && (
                      <div className="space-y-2">
                        {site.highlights.slice(0, 3).map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                      View Deal Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-4 py-2">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to <span className="text-cyan-400">Succeed</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={idx}
                  className="bg-slate-900/50 border-slate-800/50 hover:border-slate-700 transition-all duration-300 backdrop-blur-xl group"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-emerald-500/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
            <CardContent className="p-12 md:p-16 text-center space-y-8 relative z-10">
              <div className="inline-block p-4 bg-emerald-500/20 rounded-full mb-4">
                <Crown className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Join the Elite?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Start earning premium commissions today. No upfront costs, no hidden fees. 
                Just pure profit from day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-10 py-6 shadow-2xl shadow-emerald-500/30"
                >
                  Apply Now - It's Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 pt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Free to join
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  No minimum volume
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Instant approval
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}