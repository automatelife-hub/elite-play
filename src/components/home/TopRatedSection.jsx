
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { checkSiteAvailability } from "../sites/SiteAvailabilityBadge";

const formatSiteType = (type) => {
  if (!type) return 'Gaming Site';
  const typeMap = {
    'poker': 'Poker',
    'casino': 'Casino',
    'sportsbetting': 'Sportsbetting',
    'poker_casino': 'Poker & Casino',
    'poker_sportsbetting': 'Poker & Sportsbetting',
    'casino_sportsbetting': 'Casino & Sportsbetting',
    'all': 'Poker, Casino & Sportsbetting'
  };
  if (type.includes(',')) {
    return type.split(',').map(t => typeMap[t.trim().toLowerCase()] || t.trim()).join(', ');
  }
  return typeMap[type.toLowerCase()] || type;
};

export default function TopRatedSection({ sites, loading, userCountry }) {
  if (loading) {
    return (
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mx-auto mb-12 bg-slate-800" />
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48 bg-slate-800 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">All Top Rated Poker Sites</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete list of the highest rated poker sites, with available sites shown first
          </p>
        </div>

        <div className="grid gap-6">
          {sites.map((site, index) => {
            const isAvailable = checkSiteAvailability(site, userCountry);
            const siteSlug = site.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
            
            return (
              <Link
                key={site.id}
                to={createPageUrl("SiteDetail") + `?site=${siteSlug}`}
                className="block"
              >
                <div 
                  className={`bg-gradient-to-r from-gray-800/50 to-gray-900/50 border rounded-lg p-6 hover:border-yellow-500/50 transition-all duration-300 group ${
                    isAvailable ? 'border-gray-700' : 'border-gray-800 opacity-75'
                  }`}
                >
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${
                        isAvailable 
                          ? 'bg-gray-800 border border-gray-700 text-gray-400'
                          : 'bg-gray-900 border border-gray-800 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {site.logo_url && (
                        <div className="bg-white rounded-lg p-1.5 shadow-md flex-shrink-0">
                          <img 
                            src={site.logo_url} 
                            alt={site.name}
                            className="w-[130px] h-[130px] object-contain"
                          />
                        </div>
                      )}
                      
                      <div>
                        <h3 className={`text-xl font-bold transition-colors ${
                          isAvailable 
                            ? 'text-white group-hover:text-yellow-400'
                            : 'text-gray-500'
                        }`}>
                          {site.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2"> {/* Added mb-2 here */}
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(site.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-yellow-400 font-semibold">{site.rating}</span>
                        </div>
                        {site.bonus_offer && isAvailable && (
                          <p className="text-green-400 text-sm font-medium">
                            🎁 {site.bonus_offer}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                        {formatSiteType(site.type)}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      {site.highlights?.slice(0, 3).map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3"></div>
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="text-right">
                      <Button 
                        className={`font-semibold ${
                          isAvailable
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-500'
                        }`}
                        disabled={!isAvailable}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {isAvailable ? 'View Details' : 'Not Available'}
                      </Button>
                    </div>
                  </div>

                  {site.geo_notes && !isAvailable && (
                    <p className="text-gray-600 text-xs mt-3 italic pl-16">
                      {site.geo_notes}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Reviews")}>
            <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 hover:text-white px-8 py-3 text-lg font-semibold rounded-xl border-2 border-yellow-500 hover:border-yellow-600 transition-all duration-300 transform hover:scale-105">
              View All Reviews
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
