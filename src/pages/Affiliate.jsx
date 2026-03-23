
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, Award, ArrowRight, CheckCircle, Building2, UserCheck } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Affiliate() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);
      
      if (currentUser.is_agent) {
        navigate(createPageUrl("AgentPortal"));
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (user && user.is_agent) {
      navigate(createPageUrl("AgentPortal"));
    } else if (user) {
      navigate(createPageUrl("AgentPortal"));
    } else {
      db.auth.redirectToLogin(window.location.pathname);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Compact Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">
              Partner With PokerPro Elite
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
              Join our network and earn commissions across <span className="text-cyan-400 font-semibold">Poker</span>, <span className="text-purple-400 font-semibold">Casino</span>, and <span className="text-emerald-400 font-semibold">Sportsbetting</span>
            </p>
          </div>
        </div>
      </section>

      {/* Two-Tier Program Section */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Choose Your Partnership Model</h2>
          <p className="text-center text-slate-300 mb-12 max-w-2xl mx-auto text-lg">
            Whether you're an individual marketer or a full-service agency, we have a program designed for you
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Affiliate Program */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-cyan-500/20 border-2 border-cyan-400/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-10 h-10 text-cyan-400" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">Affiliate Program</CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 mx-auto">
                  For Individual Marketers
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 text-center">
                  Perfect for content creators, streamers, and individual marketers who want to promote our sites and earn commissions
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Personal tracking links for all sites</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Up to 40% revenue share</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Real-time statistics dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Marketing materials provided</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Monthly payments</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Quick approval (24-48 hours)</span>
                  </div>
                </div>

                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-6"
                >
                  Apply as Affiliate
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Agency Program */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 hover:border-purple-400/50 transition-all relative">
              <div className="absolute -top-3 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-4 py-1">
                  PREMIUM
                </Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-purple-500/20 border-2 border-purple-400/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">Agency Program</CardTitle>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 mx-auto">
                  For Professional Agencies
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 text-center">
                  Designed for agencies, poker clubs, and businesses managing multiple affiliates with white-label solutions
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Manage sub-affiliates under your brand</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Up to 50% revenue share + volume bonuses</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Advanced analytics & reporting tools</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Dedicated account manager</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Custom commission structures</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">White-label tracking & branding options</span>
                  </div>
                </div>

                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-6"
                >
                  Apply as Agency
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Promote Across Multiple Platforms
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">♠️</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">Poker Sites</h3>
                <p className="text-slate-400 text-sm mb-4">Top poker rooms with competitive rakeback and exclusive tournaments</p>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                  20+ Sites Available
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎰</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">Online Casinos</h3>
                <p className="text-slate-400 text-sm mb-4">Premium casino sites with slots, table games, and live dealers</p>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                  15+ Casinos
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-emerald-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">⚽</span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">Sportsbooks</h3>
                <p className="text-slate-400 text-sm mb-4">Leading sportsbooks with best odds and betting markets</p>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                  10+ Books
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Partner With Us?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">High Commissions</h3>
                <p className="text-slate-400 text-sm">Industry-leading revenue share rates</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Real-Time Tracking</h3>
                <p className="text-slate-400 text-sm">Monitor your earnings as they happen</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Dedicated Support</h3>
                <p className="text-slate-400 text-sm">Personal account manager assistance</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Proven Track Record</h3>
                <p className="text-slate-400 text-sm">10+ years in the industry</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our network today and start generating revenue from poker, casino, and sportsbetting
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {user && user.is_agent ? "Go to Dashboard" : user ? "Apply Now" : "Get Started"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
