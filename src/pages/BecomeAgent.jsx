import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Headphones,
  Trophy,
  Award,
  Ticket,
  LineChart } from
"lucide-react";
import { createPageUrl } from "@/utils";
import AgentApplicationForm from "../components/agent/AgentApplicationForm";
import FeaturedOffersSection from "../components/agent/FeaturedOffersSection";

export default function BecomeAgent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    checkUser();
    // Check for referral code
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
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

  const handleApplyNow = () => {
    if (user && user.is_agent) {
      navigate(createPageUrl("AgentPortal"));
    } else {
      setShowApplication(true);
      setTimeout(() => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleApplicationSuccess = () => {
    setShowApplication(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>);

  }

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm font-semibold mb-6">
              PREMIUM AGENCY PROGRAM
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Scale Your iGaming Business
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mt-2">
                With Professional Tools
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Launch your own white-label iGaming agency with our comprehensive platform. 
              Manage multiple affiliates, track unlimited traffic sources, and create custom deals 
              across <span className="text-blue-400 font-semibold">Poker</span>, 
              <span className="text-purple-400 font-semibold"> Casino</span>, and 
              <span className="text-emerald-400 font-semibold"> Sportsbetting</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleApplyNow}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">

                Start Your Agency
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 hover:text-white px-12 py-6 text-lg font-bold rounded-xl border-2 border-cyan-500 hover:border-cyan-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>

                View Pricing
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 left-10 text-cyan-400/20 text-6xl animate-pulse">♠</div>
        <div className="absolute bottom-10 right-20 text-purple-400/20 text-5xl animate-pulse" style={{ animationDelay: '1s' }}>♦</div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Run a Professional Agency
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our platform gives you the tools to compete with the biggest players in the industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agent Tier System */}
            <Card className="bg-slate-900 border-slate-700 hover:border-yellow-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-yellow-400" />
                </div>
                <CardTitle className="text-xl text-white">Progressive Tier System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Grow from Bronze to Gold tier and unlock increasing commission rates, exclusive benefits, and premium features as you scale.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                    Bronze: 25-30% commission
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                    Silver: 30-35% commission
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                    Gold: 35-40% commission
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Gamification & Achievements */}
            <Card className="bg-slate-900 border-slate-700 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-7 h-7 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">Gamification & Leaderboards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Earn achievement badges, compete on leaderboards, and track your progress with engaging gamification features.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    Achievement badge system
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    Agent leaderboards
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    Performance milestones
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contest Management */}
            <Card className="bg-slate-900 border-slate-700 hover:border-pink-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-pink-500/20 border border-pink-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Ticket className="w-7 h-7 text-pink-400" />
                </div>
                <CardTitle className="text-xl text-white">Player Contest System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Create and manage rake races, wagering contests, and raffles to boost player engagement and retention.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-pink-400 mr-2 flex-shrink-0" />
                    Rake race tournaments
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-pink-400 mr-2 flex-shrink-0" />
                    Casino wagering contests
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-pink-400 mr-2 flex-shrink-0" />
                    Raffle systems
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-400/30 rounded-xl flex items-center justify-center mb-4">
                  <LineChart className="w-7 h-7 text-cyan-400" />
                </div>
                <CardTitle className="text-xl text-white">Advanced Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Comprehensive performance dashboards, exportable reports, and real-time tracking with beautiful visualizations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                    Performance charts & graphs
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                    CSV & PDF exports
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                    Custom date ranges
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Marketing Hub */}
            <Card className="bg-slate-900 border-slate-700 hover:border-indigo-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-indigo-400" />
                </div>
                <CardTitle className="text-xl text-white">Marketing Asset Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Access professional marketing materials, track campaign performance, and request custom assets for your promotions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" />
                    Ready-made banners & graphics
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" />
                    Campaign tracking
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" />
                    Custom asset requests
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Player Management */}
            <Card className="bg-slate-900 border-slate-700 hover:border-emerald-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white">Player Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Comprehensive player tracking with detailed statistics, filtering, and real-time status updates across all platforms.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    Unlimited player tracking
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    Platform filtering
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    Revenue per player tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Support System */}
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Headphones className="w-7 h-7 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white">Integrated Support System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Built-in ticketing system for quick issue resolution. Track all support requests and get help when you need it.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    Support ticket management
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    Priority categorization
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    Fast response times
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Payment Management */}
            <Card className="bg-slate-900 border-slate-700 hover:border-green-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-7 h-7 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white">Automated Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Request payouts directly from your dashboard. Choose between automated monthly payments or performance-based processing.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    One-click payment requests
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Multiple payment methods
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Detailed payout history
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Financial Management */}
            <Card className="bg-slate-900 border-slate-700 hover:border-yellow-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-7 h-7 text-yellow-400" />
                </div>
                <CardTitle className="text-xl text-white">Revenue Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Comprehensive financial tools to track earnings, manage payouts, and reconcile accounts across all your partnerships.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                    Automated payout calculations
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                    Multi-currency support
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                    Financial reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security & Compliance */}
            <Card className="bg-slate-900 border-slate-700 hover:border-red-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-red-400" />
                </div>
                <CardTitle className="text-xl text-white">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Bank-level security and compliance features to protect your business and maintain regulatory standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                    256-bit SSL encryption
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                    GDPR compliant
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                    Regular security audits
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Offers Section */}
      <FeaturedOffersSection isApprovedAgent={false} />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transparent, Performance-Based Pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We win when you win. Our pricing structure scales with your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Standard Pricing */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 flex flex-col hover:border-blue-500/50 transition-all">
              <CardHeader>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 w-fit">
                  STANDARD PLAN
                </Badge>
                <CardTitle className="text-3xl text-white mt-4">
                  $399<span className="text-lg text-slate-400 font-normal">/month</span>
                </CardTitle>
                <p className="text-slate-400">Full platform access with our affiliate links</p>
                <p className="text-sm text-slate-500 mt-2">+ $599 one-time setup fee</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Complete agent dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Unlimited player tracking</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Tier progression system</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Contest management tools</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Marketing asset library</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Performance analytics & reports</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Support ticket system</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Automated payment processing</span>
                  </div>
                </div>

                <Button
                  onClick={handleApplyNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 mt-6">

                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Performance Plan */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 relative flex flex-col hover:border-blue-500/50 transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold px-6 py-2 text-sm shadow-lg">
                  MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="pt-8">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 w-fit">
                  PERFORMANCE PLAN
                </Badge>
                <CardTitle className="text-3xl text-white mt-4">
                  FREE<span className="text-lg text-slate-400 font-normal">*</span>
                </CardTitle>
                <p className="text-slate-400">When you generate $1,500+/month revenue share</p>
                <p className="text-sm text-slate-500 mt-2">+ $599 one-time setup fee</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold mb-1">Performance Incentive</p>
                      <p className="text-slate-400 text-sm">
                        Once your monthly revenue share reaches $1,500, your platform fee is waived. 
                        Scale your business without worrying about platform costs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300"><strong>Everything in Standard</strong></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Achievement badges & gamification</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Leaderboard access</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Priority support tickets</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Dedicated account manager</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Custom marketing assets</span>
                  </div>
                </div>

                <Button
                  onClick={handleApplyNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 mt-6">

                  Start Earning Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Customer Service Add-on */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">White-Glove Customer Service</CardTitle>
                    <p className="text-slate-400 text-sm mt-1">Let us handle player support for you</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  ADD-ON SERVICE
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">What We Handle:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      Player onboarding & account setup
                    </li>
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      Deposit & withdrawal assistance
                    </li>
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      Bonus claim support
                    </li>
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      Technical troubleshooting
                    </li>
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      24/7 live chat support
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Pricing:</h4>
                  <p className="text-slate-300 text-sm mb-4">
                    Custom pricing based on your volume and support needs. Typical packages range from 
                    <span className="text-emerald-400 font-semibold"> $500-2,000/month</span> depending on player count and service level.
                  </p>
                  <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                    Request Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Launch Your Agency in 3 Simple Steps
            </h2>
            <p className="text-xl text-slate-400">
              Be up and running in less than 48 hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-2 border-blue-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Apply & Get Approved</h3>
              <p className="text-slate-400">
                Submit your application and get approved within 24-48 hours. We'll set up your account and white-label platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-2 border-purple-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Set Up Your Dashboard</h3>
              <p className="text-slate-400">
                Complete onboarding wizard, configure payment details, and access tracking links for 50+ poker sites and casinos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Start Promoting & Earning</h3>
              <p className="text-slate-400">
                Submit players, create contests, use marketing materials, and track performance. Climb tier levels and unlock higher commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to Build Your iGaming Empire?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the elite network of agencies earning 6-7 figures annually. 
            Your competitors are already using our platform - don't get left behind.
          </p>
          <Button
            onClick={handleApplyNow}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">

            Apply Now - Limited Spots Available
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-slate-500 text-sm mt-4">
            No credit card required • Setup in 48 hours • Cancel anytime
          </p>
        </div>
      </section>

      {/* Application Form Section */}
      {showApplication && (
        <section id="application-form" className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {referralCode && (
              <div className="mb-8">
                <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 max-w-3xl mx-auto">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">You've Been Referred!</h3>
                    </div>
                    <p className="text-gray-300 mb-2">
                      An existing agent has invited you to join our platform.
                    </p>
                    <p className="text-purple-400 text-sm">
                      Their referral code will be automatically applied to your application.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
            <AgentApplicationForm onSuccess={handleApplicationSuccess} />
          </div>
        </section>
      )}
    </div>
  );
}