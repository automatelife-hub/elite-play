
import React from "react";
import { Button } from "@/components/ui/button";
import { Star, Shield, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-slate-800/5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full mb-6">
            <Shield className="w-4 h-4 text-slate-400 mr-2" />
            <span className="text-slate-300 text-sm font-medium">Trusted by 50,000+ Players</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
          Discover the World's
          <span className="block text-white mt-2">
            Premier Poker Sites
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Expert reviews, exclusive bonuses, and insider tips for 
          <span className="text-blue-400 font-semibold"> Poker</span>, 
          <span className="text-purple-400 font-semibold"> Casino</span>, and 
          <span className="text-emerald-400 font-semibold"> Sportsbetting</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to={createPageUrl("Reviews")}>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Star className="w-5 h-5 mr-2" />
              View Top Sites
            </Button>
          </Link>
          <Link to={createPageUrl("Guides")}>
            <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 hover:text-white px-8 py-3 text-lg font-semibold rounded-xl border-2 border-yellow-500 hover:border-yellow-600 transition-all duration-300 transform hover:scale-105">
              <Award className="w-5 h-5 mr-2" />
              Read Expert Guides
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">50+</div>
            <div className="text-sm text-gray-500">Sites Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">$2M+</div>
            <div className="text-sm text-gray-500">Bonuses Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">5⭐</div>
            <div className="text-sm text-gray-500">Expert Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-400 mb-1">24/7</div>
            <div className="text-sm text-gray-500">Support Tracking</div>
          </div>
        </div>
      </div>

      {/* Floating Elements - varied colors */}
      <div className="absolute top-20 left-10 text-blue-400/20 text-6xl animate-pulse">♠</div>
      <div className="absolute top-40 right-16 text-purple-400/20 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>♦</div>
      <div className="absolute bottom-32 left-20 text-emerald-400/20 text-5xl animate-pulse" style={{ animationDelay: '2s' }}>♣</div>
      <div className="absolute bottom-20 right-32 text-slate-400/20 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>♥</div>
    </section>);

}
