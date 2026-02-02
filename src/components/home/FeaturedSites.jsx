import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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
  return typeMap[type] || type.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function FeaturedSites({ sites, loading, userCountry }) {
  if (loading) {
    return (
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4 bg-slate-800" />
            <Skeleton className="h-4 w-96 mx-auto bg-slate-800" />
          </div>
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) =>
              <Skeleton key={i} className="h-48 bg-slate-800 rounded-xl" />
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Top Available Poker Sites</h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
            The highest rated poker sites available in your region
          </p>
        </div>

        <div className="grid gap-6">
          {sites.map((site) => {
            const siteSlug = site.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');

            return (
              <Link
                key={site.id}
                to={createPageUrl("SiteDetail") + `?site=${siteSlug}`}
                className="block"
              >
                <Card className="bg-gradient-to-r text-card-foreground rounded-lg group border shadow-sm from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                  <CardContent className="bg-slate-900 p-6 rounded-lg">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      <div className="flex items-center space-x-4">
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
                          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                            {site.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
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
                          {site.bonus_offer && (
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
                        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}