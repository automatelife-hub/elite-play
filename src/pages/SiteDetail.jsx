import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Shield, Zap, Gift, TrendingUp, Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";

export default function SiteDetail() {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSite();
  }, []);

  const loadSite = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const siteId = params.get('id');
      
      if (!siteId) {
        toast.error("Site ID not found");
        return;
      }

      const sites = await base44.entities.Site.filter({ id: siteId });
      if (sites.length > 0) {
        setSite(sites[0]);
      }
    } catch (error) {
      console.error("Error loading site:", error);
      toast.error("Failed to load site details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-2">Site Not Found</h1>
        <p className="text-gray-400">The requested site could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* 12-Column Product Detail Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Content - 8 columns */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Hero Card */}
          <Card className="glass-card border-emerald-500/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  {site.logo_detail_url || site.logo_url ? (
                    <div className="bg-white rounded-xl p-6 shadow-2xl">
                      <img 
                        src={site.logo_detail_url || site.logo_url} 
                        alt={site.name} 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 flex items-center justify-center">
                      <Star className="w-20 h-20 text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 capitalize">
                      {site.type.replace('_', ' ')}
                    </Badge>
                    {site.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-4xl font-bold text-white mb-4">{site.name}</h1>
                  
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(site.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-2xl font-bold text-white">{site.rating.toFixed(1)}</span>
                  </div>

                  {site.bonus_offer && (
                    <div className="glass-card-light rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-gray-400">Welcome Bonus</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">{site.bonus_offer}</div>
                    </div>
                  )}

                  <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-12 py-6 text-lg rounded-xl shadow-xl">
                      Play Now
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">About {site.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{site.description || 'No description available.'}</p>
            </CardContent>
          </Card>

          {/* Pros & Cons */}
          {(site.pros?.length > 0 || site.cons?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {site.pros?.length > 0 && (
                <Card className="glass-card border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Pros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {site.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {site.cons?.length > 0 && (
                <Card className="glass-card border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Cons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {site.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - 4 columns */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Key Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-gray-400">Established</span>
                <span className="text-white font-semibold">{site.established_year || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-gray-400">Min Deposit</span>
                <span className="text-white font-semibold">${site.minimum_deposit || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-gray-400">License</span>
                <span className="text-white font-semibold text-sm">{site.license || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Rating Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Rating Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Reliability', value: site.reliability_rating },
                { label: 'Game Selection', value: site.game_selection_rating },
                { label: 'Bonuses', value: site.bonuses_promotions_rating },
                { label: 'Software', value: site.software_convenience_rating }
              ].map((rating, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{rating.label}</span>
                    <span className="text-white font-semibold">{rating.value || 0}/5</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                      style={{ width: `${((rating.value || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          {site.payment_methods?.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {site.payment_methods.map((method, idx) => (
                    <Badge key={idx} variant="outline" className="text-gray-300 border-slate-600">
                      {method}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}