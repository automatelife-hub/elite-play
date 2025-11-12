
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function AIAdvisorCTA() {
  const whatsappURL = base44.agents.getWhatsAppConnectURL('poker_advisor');

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decoration with images */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-blue-400 text-8xl">♠</div>
        <div className="absolute bottom-10 right-10 text-purple-400 text-8xl">♣</div>
        <div className="absolute top-1/2 left-1/4 text-emerald-400 text-6xl">♦</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700 backdrop-blur-sm overflow-hidden">
          <CardContent className="bg-slate-800 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Bot className="w-12 h-12 text-purple-400" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold uppercase text-sm tracking-wider">New Feature</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Meet Your Personal Poker Advisor
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  Get instant expert advice on poker sites, strategies, bonuses, and more. 
                  Available 24/7 via web chat or WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to={createPageUrl("PokerAdvisor")}>
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Bot className="w-5 h-5 mr-2" />
                      Start Chatting
                    </Button>
                  </Link>
                  <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 text-lg rounded-xl font-semibold transition-all duration-300">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Feature highlights - varied colors */}
            <div className="grid md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-700">
              <div className="text-center">
                <div className="text-blue-400 font-bold text-lg mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-lg mb-1">Instant</div>
                <div className="text-gray-400 text-sm">Quick Answers</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-lg mb-1">Expert</div>
                <div className="text-gray-400 text-sm">AI-Powered</div>
              </div>
              <div className="text-center">
                <div className="text-slate-300 font-bold text-lg mb-1">Free</div>
                <div className="text-gray-400 text-sm">No Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>);

}