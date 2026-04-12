import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  RefreshCw, 
  ArrowRight, 
  BarChart3, 
  Wallet, 
  Lock, 
  ChevronRight,
  Code2,
  Database,
  Bitcoin,
  CreditCard,
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AffiliatePayoutsLanding() {
  return (
    <div className="bg-white text-[#0A2540] font-sans overflow-x-hidden">
      {/* Custom Stripe-style styles */}
      <style>
        {`
          .stripe-shadow {
            box-shadow: 0 50px 100px -20px rgba(50,50,93,0.25), 0 30px 60px -30px rgba(0,0,0,0.3);
          }
          .stripe-gradient {
            background: linear-gradient(150deg, #53f 15%, #05d5ff 70%, #a6ffcb 94%);
          }
          .text-indigo {
            color: #635BFF;
          }
          .bg-indigo {
            background-color: #635BFF;
          }
          .diagonal-bg {
            clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 bg-[#F6F9FC] diagonal-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-indigo/10 text-[#635BFF] border-none mb-6 px-4 py-1 text-sm font-semibold hover:bg-indigo/20">
                Financial Infrastructure
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-[#0A2540] mb-6">
                Payouts for elite <br />
                <span className="text-[#635BFF]">iGaming affiliates.</span>
              </h1>
              <p className="text-xl text-[#425466] mb-10 max-w-xl leading-relaxed">
                The most reliable settlement engine in the industry. Automate your commissions, track player value in real-time, and get paid instantly in any currency.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("BecomeAgent")}>
                  <Button className="bg-[#635BFF] hover:bg-[#5851FF] text-white px-8 py-6 text-lg font-bold rounded-md shadow-lg shadow-indigo/20 transition-all transform hover:-translate-y-1">
                    Start your agency
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" className="text-[#635BFF] hover:text-[#0A2540] px-8 py-6 text-lg font-bold group">
                  Contact sales
                  <ChevronRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            {/* Floating UI Representation */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="bg-white rounded-xl stripe-shadow p-8 border border-gray-100 max-w-lg mx-auto relative z-20 overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo rounded-lg flex items-center justify-center text-white">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">Agency Wallet</div>
                      <div className="text-xs text-[#425466]">Settlements Active</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#0A2540]">$142,580.42</div>
                    <div className="text-[10px] uppercase font-bold text-emerald-500 flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3 fill-current" /> Instant Clear
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#F6F9FC] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bitcoin className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-semibold">BTC Settlement</span>
                    </div>
                    <span className="text-xs font-bold text-[#635BFF]">+0.421 BTC</span>
                  </div>
                  <div className="p-4 bg-[#F6F9FC] rounded-lg flex items-center justify-between border-l-4 border-[#635BFF]">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-indigo" />
                      <span className="text-sm font-semibold">Card Withdrawal</span>
                    </div>
                    <span className="text-xs font-bold text-[#0A2540]">Processing...</span>
                  </div>
                  <div className="p-4 bg-[#F6F9FC] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-semibold">USD Bank Transfer</span>
                    </div>
                    <span className="text-xs font-bold text-[#0A2540]">-$5,000.00</span>
                  </div>
                </div>

                {/* Animated progress bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-[10px] font-bold text-[#425466] uppercase mb-2">
                    <span>Reconciliation Progress</span>
                    <span>98%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-indigo h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-indigo/5 rounded-full blur-3xl z-10" />
              <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#425466] mb-8">Powering settlements across</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl"><Bitcoin className="w-6 h-6 text-[#F7931A]" /> Bitcoin</div>
            <div className="flex items-center gap-2 font-bold text-xl"><CreditCard className="w-6 h-6 text-indigo" /> Visa</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Database className="w-6 h-6 text-blue-500" /> USDC</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Banknote className="w-6 h-6 text-emerald-600" /> SEPA</div>
            <div className="flex items-center gap-2 font-bold text-xl text-[#0A2540]">Skrill</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-20">
            <h2 className="text-[#635BFF] font-bold text-lg mb-4">Financial Excellence</h2>
            <h3 className="text-4xl font-bold tracking-tight text-[#0A2540]">
              Built for scale. Designed for trust.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard 
              icon={Zap} 
              title="Instant Settlements" 
              description="No more waiting for month-end. Liquidate your commissions into your preferred wallet the moment they clear."
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Enterprise Security" 
              description="Bank-grade encryption and multi-sig cold storage for all agency funds. Your revenue is protected 24/7."
            />
            <FeatureCard 
              icon={Globe} 
              title="Multi-Currency" 
              description="Settle in USD, EUR, BTC, ETH, or USDT. Our intelligent routing engine gets you the best rates."
            />
            <FeatureCard 
              icon={RefreshCw} 
              title="Auto-Reconciliation" 
              description="Eliminate manual spreadsheets. Our system automatically matches deposits to your affiliate IDs."
            />
          </div>
        </div>
      </section>

      {/* The 'Tech' Section */}
      <section className="py-24 md:py-32 bg-[#0A2540] text-white relative overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-[#00D5FF] font-bold text-lg mb-4">The Platform</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Integrate once. <br />Scale everywhere.
              </h3>
              <p className="text-lg text-[#ADBDCC] mb-10 leading-relaxed">
                Our robust API and secure ledger allow high-volume affiliates to treat their business like a software company. Access granular player data and financial reports programmatically.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00D5FF]/20 flex items-center justify-center text-[#00D5FF] flex-shrink-0 mt-1">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Developer-First API</h4>
                    <p className="text-sm text-[#ADBDCC]">Automate your reporting and payout workflows with ease.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00D5FF]/20 flex items-center justify-center text-[#00D5FF] flex-shrink-0 mt-1">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Immutable Ledger</h4>
                    <p className="text-sm text-[#ADBDCC]">Every transaction is recorded on our secure, auditable financial rail.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Code Snippet / Technical Visual */}
            <div className="bg-[#1A3353] rounded-xl border border-white/10 p-6 font-mono text-sm overflow-hidden stripe-shadow">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="space-y-2">
                <p className="text-blue-400">const <span className="text-white">gia</span> = require(<span className="text-emerald-400">'@gia/payouts'</span>);</p>
                <p className="text-slate-400">// Initialize secure settlement</p>
                <p className="text-white">await gia.settle({'{'}</p>
                <p className="pl-4 text-white">agentId: <span className="text-yellow-400">'AGENT_VIP_001'</span>,</p>
                <p className="pl-4 text-white">method: <span className="text-yellow-400">'USDT_ERC20'</span>,</p>
                <p className="pl-4 text-white">amount: <span className="text-indigo-300">50000.00</span>,</p>
                <p className="pl-4 text-white">autoApprove: <span className="text-orange-400">true</span></p>
                <p className="text-white">{'}'});</p>
                <p className="text-slate-400 mt-4">// Status: SUCCESS</p>
                <p className="text-emerald-400 font-bold">Transaction: 0x7a2...f4e1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#F6F9FC]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-[#0A2540]">Ready to professionalize your agency?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={createPageUrl("BecomeAgent")}>
              <Button className="bg-[#635BFF] hover:bg-[#5851FF] text-white px-10 py-7 text-lg font-bold rounded-md shadow-xl shadow-indigo/20">
                Create an account
              </Button>
            </Link>
            <Button variant="outline" className="border-[#635BFF] text-[#635BFF] hover:bg-indigo/5 px-10 py-7 text-lg font-bold">
              Speak with an expert
            </Button>
          </div>
          <p className="mt-8 text-sm text-[#425466]">
            Used by 500+ elite affiliates globally. No setup fees.
          </p>
        </div>
      </section>

      {/* Simple Footer Sub-band */}
      <footer className="py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-[#425466] gap-4">
          <div className="flex items-center gap-6">
            <span>© 2026 Gamble Intel Agency</span>
            <a href="#" className="hover:text-indigo">Privacy & Terms</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-indigo">System Status</a>
            <a href="#" className="hover:text-indigo">Global Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group">
      <div className="w-12 h-12 bg-indigo/5 rounded-lg flex items-center justify-center text-[#635BFF] mb-6 transition-colors group-hover:bg-indigo group-hover:text-white">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-lg font-bold text-[#0A2540] mb-3">{title}</h4>
      <p className="text-[#425466] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
