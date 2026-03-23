import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Star, 
  Check, 
  X, 
  ExternalLink, 
  BarChart3,
  Award
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Compare() {
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const data = await db.entities.Site.list('-rating');
      setSites(data);
      // Auto-select top 3 sites by default
      if (data.length >= 3) {
        setSelectedSites([data[0].id, data[1].id, data[2].id]);
      }
    } catch (error) {
      console.error("Error loading sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSite = (siteId) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId);
      } else {
        if (prev.length >= 4) return prev; // Max 4 sites
        return [...prev, siteId];
      }
    });
  };

  const selectedSiteObjects = sites.filter(site => selectedSites.includes(site.id));

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-12 w-64 mx-auto mb-8 bg-gray-800" />
          <div className="grid gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 bg-gray-800" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">Compare Poker Sites</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select up to 4 sites to compare features, bonuses, and ratings side-by-side
          </p>
        </div>

        {/* Site Selection */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Select Sites to Compare ({selectedSites.length}/4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sites.map(site => (
                <div
                  key={site.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedSites.includes(site.id)
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => toggleSite(site.id)}
                >
                  <Checkbox
                    checked={selectedSites.includes(site.id)}
                    onCheckedChange={() => toggleSite(site.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label className="text-white font-medium cursor-pointer truncate block">
                      {site.name}
                    </Label>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-400">{site.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedSiteObjects.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-800 rounded-xl">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-900 px-6 py-4 text-left text-sm font-semibold text-gray-300 border-r border-gray-800">
                        Feature
                      </th>
                      {selectedSiteObjects.map(site => (
                        <th key={site.id} className="px-6 py-4 text-center border-r border-gray-800 last:border-r-0">
                          <div className="flex flex-col items-center space-y-3">
                            {site.logo_url && (
                              <div className="bg-white rounded-lg p-2">
                                <img
                                  src={site.logo_url}
                                  alt={site.name}
                                  className="h-12 w-auto object-contain"
                                />
                              </div>
                            )}
                            <div className="text-white font-bold">{site.name}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                    {/* Overall Rating */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Overall Rating
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 text-center border-r border-gray-800 last:border-r-0">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i <= Math.floor(site.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-yellow-400 font-bold text-lg">{site.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Welcome Bonus */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Welcome Bonus
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 text-center text-gray-300 border-r border-gray-800 last:border-r-0">
                          {site.bonus_offer || '-'}
                        </td>
                      ))}
                    </tr>

                    {/* Reliability */}
                    {selectedSiteObjects.some(s => s.reliability_rating) && (
                      <tr>
                        <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                          Reliability
                        </td>
                        {selectedSiteObjects.map(site => (
                          <td key={site.id} className="px-6 py-4 text-center border-r border-gray-800 last:border-r-0">
                            <div className="flex items-center justify-center">
                              {site.reliability_rating ? (
                                <>
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i <= Math.floor(site.reliability_rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Game Selection */}
                    {selectedSiteObjects.some(s => s.game_selection_rating) && (
                      <tr>
                        <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                          Game Selection
                        </td>
                        {selectedSiteObjects.map(site => (
                          <td key={site.id} className="px-6 py-4 text-center border-r border-gray-800 last:border-r-0">
                            <div className="flex items-center justify-center">
                              {site.game_selection_rating ? (
                                <>
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i <= Math.floor(site.game_selection_rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Software Quality */}
                    {selectedSiteObjects.some(s => s.software_convenience_rating) && (
                      <tr>
                        <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                          Software Quality
                        </td>
                        {selectedSiteObjects.map(site => (
                          <td key={site.id} className="px-6 py-4 text-center border-r border-gray-800 last:border-r-0">
                            <div className="flex items-center justify-center">
                              {site.software_convenience_rating ? (
                                <>
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i <= Math.floor(site.software_convenience_rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Minimum Deposit */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Min Deposit
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 text-center text-gray-300 border-r border-gray-800 last:border-r-0">
                          {site.minimum_deposit ? `$${site.minimum_deposit}` : '-'}
                        </td>
                      ))}
                    </tr>

                    {/* Established Year */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Established
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 text-center text-gray-300 border-r border-gray-800 last:border-r-0">
                          {site.established_year || '-'}
                        </td>
                      ))}
                    </tr>

                    {/* Payment Methods */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Payment Methods
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 border-r border-gray-800 last:border-r-0">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {site.payment_methods && site.payment_methods.length > 0 ? (
                              site.payment_methods.slice(0, 3).map((method, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-gray-300 border-gray-600">
                                  {method}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Key Highlights */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Key Features
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 border-r border-gray-800 last:border-r-0">
                          <div className="space-y-2 text-left">
                            {site.highlights && site.highlights.length > 0 ? (
                              site.highlights.slice(0, 3).map((highlight, idx) => (
                                <div key={idx} className="flex items-start text-sm text-gray-300">
                                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Top Pros */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Top Pros
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 border-r border-gray-800 last:border-r-0">
                          <div className="space-y-2 text-left">
                            {site.pros && site.pros.length > 0 ? (
                              site.pros.slice(0, 2).map((pro, idx) => (
                                <div key={idx} className="flex items-start text-sm text-gray-300">
                                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{pro}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Top Cons */}
                    <tr>
                      <td className="sticky left-0 z-10 bg-gray-900/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Top Cons
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 border-r border-gray-800 last:border-r-0">
                          <div className="space-y-2 text-left">
                            {site.cons && site.cons.length > 0 ? (
                              site.cons.slice(0, 2).map((con, idx) => (
                                <div key={idx} className="flex items-start text-sm text-gray-300">
                                  <X className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{con}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* CTA Row */}
                    <tr className="bg-gray-800/50">
                      <td className="sticky left-0 z-10 bg-gray-800/50 px-6 py-4 text-sm font-medium text-gray-300 border-r border-gray-800">
                        Visit Site
                      </td>
                      {selectedSiteObjects.map(site => (
                        <td key={site.id} className="px-6 py-4 text-center border-r border-gray-800 last:border-r-0">
                          <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit
                            </Button>
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Select sites above to start comparing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}