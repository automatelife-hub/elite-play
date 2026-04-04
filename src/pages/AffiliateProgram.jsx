import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { db } from "@/api/supabaseClient";
import { OperatorDealGrid } from "../components/agent/OperatorDealCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Users, Zap, BarChart3, Globe, Code, Image,
  Video, FileText, Megaphone, Target, Settings, CheckCircle2,
  ArrowRight, Percent, DollarSign, Palette, Layout, ExternalLink
} from "lucide-react";

export default function AffiliateProgram() {
  const [featuredOperators, setFeaturedOperators] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);

  useEffect(() => {
    Promise.all([
      db.entities.OperatorDeal.filter({ is_active: true }),
      db.entities.Site.list(),
    ]).then(([deals, sites]) => {
      const activeSiteIds = new Set(deals.map((d) => d.site_id));
      const operators = sites.filter(
        (s) => activeSiteIds.has(s.id) && (s.featured || s.featured_for_agents)
      );
      setFeaturedOperators(operators.slice(0, 6));
      setFeaturedDeals(deals);
    }).catch(() => {});
  }, []);

  const affiliateVsAgency = [
    {
      title: "Affiliate Program",
      icon: TrendingUp,
      color: "emerald",
      description: "Individual marketers promoting sites",
      features: [
        "Earn commissions per player signup",
        "Access to marketing materials",
        "Personal tracking links",
        "Monthly automated payouts",
        "30-40% revenue share",
        "Self-service dashboard"
      ],
      bestFor: "Content creators, bloggers, influencers"
    },
    {
      title: "Agency Program",
      icon: Users,
      color: "cyan",
      description: "Full-service partner with dedicated support",
      features: [
        "Custom commission structures",
        "Dedicated account manager",
        "White-label solutions",
        "Custom marketing campaigns",
        "Up to 50% revenue share",
        "Priority support & tools"
      ],
      bestFor: "Marketing agencies, large networks, poker clubs"
    }
  ];

  const commissionStructure = [
    {
      tier: "Standard Affiliate",
      rate: "30-35%",
      description: "Base commission for all new affiliates",
      requirements: "No minimum required",
      color: "from-slate-600 to-slate-700"
    },
    {
      tier: "Premium Affiliate",
      rate: "35-40%",
      description: "Higher rates for consistent performers",
      requirements: "5+ active players/month",
      color: "from-emerald-600 to-emerald-700"
    },
    {
      tier: "Agency Partner",
      rate: "40-50%",
      description: "Custom deals for high-volume partners",
      requirements: "20+ active players/month",
      color: "from-cyan-600 to-cyan-700"
    }
  ];

  const platformFeatures = [
    {
      icon: Settings,
      title: "Fully Customizable Software",
      description: "Our affiliate software can be fully customised to match your branding and custom requirements."
    },
    {
      icon: Globe,
      title: "Multiple Site Profiles",
      description: "Affiliates can create unlimited site profiles for each of sites they own and run multiple campaigns simultaneously."
    },
    {
      icon: Palette,
      title: "Interface Branding",
      description: "Our turnkey iGaming affiliate software can be fully rebranded and customised as per your requirements."
    },
    {
      icon: Target,
      title: "Dynamic Tracking Parameters",
      description: "Allows affiliates to use dynamic tracking parameters such as 'Click IDs' to track each placement separately."
    },
    {
      icon: Code,
      title: "Built-in Dynamic Ad-server",
      description: "Our platform comes with a built-in dynamic ad server giving you complete control of your marketing tools."
    },
    {
      icon: BarChart3,
      title: "Campaign Management",
      description: "Manage multiple campaigns at once with an easy-to-use user interface and measure each campaign at user level."
    },
    {
      icon: Layout,
      title: "Multiple Formats Supported",
      description: "Our ad-server supports a wide variety of media formats including rich media to help you communicate effectively."
    },
    {
      icon: ExternalLink,
      title: "Landing Page URL Management",
      description: "Edit, manage and customize your Landing Page URLs anytime to help you promote the latest offers at all times!"
    },
    {
      icon: BarChart3,
      title: "Enhanced Media Reporting",
      description: "Detailed reports to help you analyse the best performing creatives and optimize your campaign to achieve best results."
    }
  ];

  const marketingTools = [
    {
      icon: Image,
      title: "Banner Creation",
      description: "Professional banner designs in all standard sizes (728x90, 300x250, etc.)",
      price: "From $50/banner",
      popular: false
    },
    {
      icon: Video,
      title: "Video Production",
      description: "Promotional videos, reviews, and social media content",
      price: "From $200/video",
      popular: true
    },
    {
      icon: FileText,
      title: "Content Writing",
      description: "SEO-optimized articles, reviews, and landing page copy",
      price: "From $100/article",
      popular: true
    },
    {
      icon: Megaphone,
      title: "Social Media Packages",
      description: "Complete social media campaign setup and management",
      price: "From $300/month",
      popular: false
    },
    {
      icon: Layout,
      title: "Landing Page Design",
      description: "Custom landing pages optimized for conversions",
      price: "From $500/page",
      popular: false
    },
    {
      icon: Target,
      title: "Campaign Strategy",
      description: "Expert consultation on marketing strategy and optimization",
      price: "From $150/hour",
      popular: false
    }
  ];

  const rakebackBenefits = [
    "Offer up to 60% rakeback to your players",
    "Competitive edge in player acquisition",
    "Automated rakeback tracking and distribution",
    "Customizable rakeback structures per player",
    "Real-time rakeback calculations",
    "Monthly consolidated reports"
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">
              Industry-Leading Affiliate Program
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Join Our <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Affiliate Program</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Partner with the industry's most trusted iGaming platform. Earn up to 50% revenue share with our comprehensive affiliate and agency programs.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <Link to={createPageUrl("BecomeAgent")}>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Affiliate")}>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                  Affiliate Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { label: "Max Commission", value: "50%", icon: Percent },
              { label: "Max Rakeback", value: "60%", icon: DollarSign },
              { label: "Payment Methods", value: "10+", icon: CheckCircle2 },
              { label: "Marketing Tools", value: "50+", icon: Zap }
            ].map((stat, idx) => (
              <Card key={idx} className="glass-card text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate vs Agency */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-base sm:text-xl text-gray-400">
              Two powerful programs designed for different types of partners
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {affiliateVsAgency.map((program, idx) => (
              <Card key={idx} className={`glass-card border-${program.color}-500/20 hover:border-${program.color}-500/40 transition-all`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${program.color}-500/20 to-${program.color}-600/20 flex items-center justify-center mb-4`}>
                    <program.icon className={`w-6 h-6 text-${program.color}-400`} />
                  </div>
                  <CardTitle className="text-2xl text-white">{program.title}</CardTitle>
                  <p className="text-gray-400">{program.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle2 className={`w-5 h-5 text-${program.color}-400 flex-shrink-0 mt-0.5`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`p-4 rounded-lg bg-${program.color}-500/10 border border-${program.color}-500/20`}>
                    <div className="text-xs font-semibold text-gray-400 mb-1">BEST FOR</div>
                    <div className={`text-sm text-${program.color}-400`}>{program.bestFor}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Commission Structure
            </h2>
            <p className="text-base sm:text-xl text-gray-400">
              Transparent, competitive rates that grow with your performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {commissionStructure.map((tier, idx) => (
              <Card key={idx} className="glass-card relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.color}`} />
                <CardHeader>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{tier.rate}</span>
                    <span className="text-gray-400">revenue share</span>
                  </div>
                  <CardTitle className="text-xl text-white">{tier.tier}</CardTitle>
                  <p className="text-gray-400 text-sm">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="text-xs font-semibold text-gray-400 mb-1">REQUIREMENTS</div>
                    <div className="text-sm text-gray-300">{tier.requirements}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Platform Features
            </h2>
            <p className="text-base sm:text-xl text-gray-400">
              Powerful tools and features to maximize your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {platformFeatures.map((feature, idx) => (
              <Card key={idx} className="glass-card hover:border-emerald-500/30 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rakeback Benefits */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <Card className="glass-card border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-white">Rakeback Program</CardTitle>
                  <p className="text-gray-400">Offer industry-leading rakeback to your players</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {rakebackBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Marketing Services Add-ons */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Marketing Services & Add-ons
            </h2>
            <p className="text-base sm:text-xl text-gray-400">
              Professional services to accelerate your growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {marketingTools.map((tool, idx) => (
              <Card key={idx} className={`relative glass-card hover:border-cyan-500/30 transition-all ${tool.popular ? 'border-cyan-500/20' : ''}`}>
                {tool.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <tool.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-lg text-white">{tool.title}</CardTitle>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-white">{tool.price.split('/')[0]}</span>
                    {tool.price.includes('/') && (
                      <span className="text-gray-400">/{tool.price.split('/')[1]}</span>
                    )}
                  </div>
                  <Link to={createPageUrl("ServicesMarketplace")}>
                    <Button variant="outline" className="w-full border-slate-700 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Operator Deals */}
      {featuredOperators.length > 0 && (
        <section className="py-20 px-4 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">
                LIVE DEALS
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured Operator Deals
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Flip a card to explore commission structures. Sign up as an agent to unlock your personalised tracking links.
              </p>
            </div>
            <OperatorDealGrid
              operators={featuredOperators}
              deals={featuredDeals}
              agent={null}
            />
            <div className="text-center mt-10">
              <Link to={createPageUrl("BecomeAgent")}>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-10 py-5 text-base">
                  Unlock All Deals — Apply Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-emerald-500/20 text-center">
            <CardContent className="py-12">
              <Zap className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-base sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of affiliates and agencies earning competitive commissions with our industry-leading iGaming platform.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                <Link to={createPageUrl("BecomeAgent")}>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Affiliate")}>
                  <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}