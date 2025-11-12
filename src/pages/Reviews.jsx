
import React, { useState, useEffect, useCallback } from "react";
import { Site } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ExternalLink, Search, Filter, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

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
  return typeMap[type] || type;
};

export default function Reviews() {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const filterAndSortSites = useCallback(() => {
    let filtered = sites;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((site) => site.type === typeFilter);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "established":
        filtered = filtered.sort((a, b) => (b.established_year || 0) - (a.established_year || 0));
        break;
      default:
        break;
    }

    setFilteredSites(filtered);
  }, [sites, searchTerm, typeFilter, sortBy]);

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    filterAndSortSites();
  }, [filterAndSortSites]);

  const loadSites = async () => {
    try {
      const data = await Site.list('-rating');
      setSites(data);
    } catch (error) {
      console.error("Error loading sites:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mx-auto mb-8 bg-gray-800" />
          <div className="grid gap-6">
            {Array(6).fill(0).map((_, i) =>
            <Skeleton key={i} className="h-48 bg-gray-800 rounded-xl" />
            )}
          </div>
        </div>
      </div>);

  }

  // Helper function to create page URL
  // In a real app, this might be a more sophisticated utility.
  // For this context, it effectively just returns "/SiteDetail".
  const createPageUrl = (pageName) => {
    if (pageName === "SiteDetail") {
      return "/SiteDetail";
    }
    return `/${pageName.toLowerCase()}`;
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">Site Reviews</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive reviews of the world's top poker sites and online casinos
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white" />

            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="poker">Poker Sites</SelectItem>
                <SelectItem value="casino">Casinos</SelectItem>
                <SelectItem value="sportsbetting">Sportsbooks</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="established">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              <span>{filteredSites.length} results</span>
            </div>
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid gap-6">
          {filteredSites.map((site) => {
            const siteSlug = site.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');

            return (
              <Link
                key={site.id}
                to={createPageUrl("SiteDetail") + `?site=${siteSlug}`}
                className="rounded-[3px] block"
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

        {filteredSites.length === 0 && !loading &&
        <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No sites found matching your criteria</div>
            <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
            }}
            className="mt-4">

              Clear Filters
            </Button>
          </div>
        }
      </div>
    </div>
  );
}
