import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
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
  Headphones } from
"lucide-react";
import { createPageUrl } from "@/utils";
import AgentApplicationForm from "../components/agent/AgentApplicationForm";
import FeaturedOffersSection from "../components/agent/FeaturedOffersSection";

export default function BecomeAgent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
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
            {/* Multi-Source Tracking */}
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-400/30 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 text-cyan-400" />
                </div>
                <CardTitle className="text-xl text-white">Advanced Traffic Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Track unlimited traffic sources with granular analytics. Monitor performance by campaign, source, medium, and custom parameters.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                    Real-time conversion tracking
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                    Custom UTM parameters
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                    Multi-channel attribution
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sub-Affiliate Management */}
            <Card className="bg-slate-900 border-slate-700 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">Sub-Affiliate Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Build and manage your own network of sub-affiliates. Recruit, track, and reward your partners - all under your brand.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    Unlimited sub-affiliates
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    Individual dashboards
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    Custom commission structures
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Deal Customization */}
            <Card className="bg-slate-900 border-slate-700 hover:border-emerald-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Settings className="w-7 h-7 text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-white">Tiered Deal Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Create custom deals for different player tiers. Offer VIP treatment to high rollers while optimizing recreational player acquisition.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    Flexible tier structures
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    Custom bonus packages
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    Dynamic commission rates
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* White-Label Branding */}
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white">White-Label Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Run everything under your own brand. Custom domain, logo, colors - your affiliates see YOUR agency, not ours.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    Custom domain setup
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    Branded reporting
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    Custom email templates
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
                    <span className="text-slate-300">Complete agency platform access</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Unlimited traffic source tracking</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Unlimited sub-affiliates</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Custom deal management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">White-label branding</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Advanced analytics & reporting</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Email support</span>
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
                    <span className="text-slate-300">Priority support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Dedicated account manager</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Custom feature requests</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">API access (coming soon)</span>
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
              <h3 className="text-xl font-bold text-white mb-3">Configure Your Deals</h3>
              <p className="text-slate-400">
                Set up your commission structures, create player tiers, and customize deals across our 50+ poker sites and casinos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Start Promoting & Earning</h3>
              <p className="text-slate-400">
                Launch your campaigns, recruit sub-affiliates, and watch your revenue grow. Real-time tracking shows every conversion.
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
      {showApplication &&
      <section id="application-form" className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AgentApplicationForm onSuccess={handleApplicationSuccess} />
          </div>
        </section>
      }
    </div>);

}