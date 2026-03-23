import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Gift, TrendingUp, Filter, DollarSign, ExternalLink } from "lucide-react";

export default function FeaturedOffersSection({ isApprovedAgent = false }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("commission"); // commission, bonus, rating

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const allSites = await db.entities.Site.list('-rating');
      // Filter for featured agent offers
      const featuredSites = allSites.filter(site => site.featured_for_agents || site.featured);
      setSites(featuredSites);
    } catch (error) {
      console.error("Error loading sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseBonusAmount = (bonusStr) => {
    if (!bonusStr) return 0;
    const match = bonusStr.match(/\$?([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  const filteredAndSortedSites = sites
    .filter(site => {
      if (categoryFilter === "all") return true;
      return site.type === categoryFilter || site.type?.includes(categoryFilter);
    })
    .sort((a, b) => {
      if (sortBy === "commission") {
        return (b.commission_rate || 0) - (a.commission_rate || 0);
      } else if (sortBy === "bonus") {
        return parseBonusAmount(b.bonus_offer) - parseBonusAmount(a.bonus_offer);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  const formatSiteType = (type) => {
    const typeMap = {
      'poker': 'Poker',
      'casino': 'Casino',
      'sportsbetting': 'Sportsbetting',
      'poker_casino': 'Poker & Casino',
      'poker_sportsbetting': 'Poker & Sports',
      'casino_sportsbetting': 'Casino & Sports',
      'all': 'All Games'
    };
    return typeMap[type] || type;
  };

  const getCategoryColor = (type) => {
    if (type?.includes('poker')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (type?.includes('casino')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (type?.includes('sportsbetting')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2 mb-4">
            TOP OFFERS
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Affiliate Offers
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {isApprovedAgent 
              ? "Exclusive high-commission deals for our approved agents"
              : "Access these premium offers when you become an approved agent"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Filter:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="poker">Poker</SelectItem>
                <SelectItem value="casino">Casino</SelectItem>
                <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commission">Commission Rate</SelectItem>
                <SelectItem value="bonus">Bonus Amount</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSites.length > 0 ? (
            filteredAndSortedSites.map((site) => (
              <Card 
                key={site.id} 
                className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all group relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                
                <CardContent className="p-6 relative z-10">
                  {/* Logo */}
                  <div className="w-full h-24 bg-white rounded-lg p-3 flex items-center justify-center mb-4 shadow-lg">
                    {site.logo_url ? (
                      <img
                        src={site.logo_url}
                        alt={site.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-3xl font-bold text-gray-800">
                        {site.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Site Name & Category */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-white mb-2">{site.name}</h3>
                    <Badge className={getCategoryColor(site.type)}>
                      {formatSiteType(site.type)}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(site.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-400 text-sm">{site.rating}/5</span>
                  </div>

                  {/* Bonus Offer */}
                  {site.bonus_offer && (
                    <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <div className="flex items-start">
                        <Gift className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-emerald-400 text-sm font-semibold">
                          {site.bonus_offer}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Commission Rate - Only for approved agents */}
                  {isApprovedAgent && site.commission_rate && (
                    <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-cyan-400 mr-2" />
                          <span className="text-cyan-400 text-sm font-semibold">Commission:</span>
                        </div>
                        <span className="text-cyan-400 text-lg font-bold">{site.commission_rate}%</span>
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <a 
                    href={site.affiliate_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold group-hover:shadow-lg transition-all">
                      {isApprovedAgent ? 'Get Affiliate Link' : 'View Offer'}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>

                  {/* Highlights */}
                  {site.highlights && site.highlights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <ul className="space-y-1">
                        {site.highlights.slice(0, 2).map((highlight, idx) => (
                          <li key={idx} className="text-slate-400 text-xs flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No offers found matching your filters
            </div>
          )}
        </div>

        {/* Note for non-approved users */}
        {!isApprovedAgent && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 rounded-lg px-6 py-4">
              <DollarSign className="w-6 h-6 text-purple-400" />
              <div className="text-left">
                <p className="text-white font-semibold">Want to see commission rates?</p>
                <p className="text-slate-400 text-sm">Apply to become an agent to access exclusive rates and earnings</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}