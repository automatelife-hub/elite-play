import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function SiteCard({ site, userCountry }) {
  const siteSlug = site.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {site.logo_url && (
              <img 
                src={site.logo_url} 
                alt={site.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <Link to={`/site/${siteSlug}`}>
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {site.name}
                </h3>
              </Link>
              <div className="flex items-center space-x-2">
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
            </div>
          </div>
          <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
            {site.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {site.bonus_offer && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 font-semibold text-sm">🎁 {site.bonus_offer}</p>
            </div>
          )}

          <div className="space-y-2">
            {site.highlights?.slice(0, 3).map((highlight, idx) => (
              <div key={idx} className="flex items-center text-gray-300 text-sm">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3"></div>
                {highlight}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Link to={`/site/${siteSlug}`} className="flex-1">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                View Details
              </Button>
            </Link>
            <a
              href={site.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold">
                <ExternalLink className="w-4 h-4 mr-2" />
                Play Now
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}