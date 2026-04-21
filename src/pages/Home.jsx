import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Site, Article } from "@/entities/all";

import NewHeroSection from "../components/home/NewHeroSection";
import FeaturedSites from "../components/home/FeaturedSites";
import TopRatedSection from "../components/home/TopRatedSection";
import AIAdvisorCTA from "../components/home/AIAdvisorCTA";
import LatestArticles from "../components/home/LatestArticles";
import TrustIndicators from "../components/home/TrustIndicators";
import GeoMapSelector from "../components/geo/GeoMapSelector";
import RegionStats from "../components/geo/RegionStats";
import { checkSiteAvailability } from "../components/sites/SiteAvailabilityBadge";

export default function Home() {
  const [user, setUser] = useState(null);
  const [featuredSites, setFeaturedSites] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    document.title = "Elite Play — Best Rakeback Deals, Poker & Casino Bonuses";
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);
      setUserCountry(currentUser?.country_code);

      const [allSites, articles] = await Promise.all([
        Site.list('-rating'),
        Article.filter({ published: true }, '-created_date', 4)
      ]);

      setSites(allSites);
      
      // Filter only poker sites
      const pokerSites = allSites.filter(site => 
        site.type === 'poker' || 
        site.type === 'poker_casino' || 
        site.type === 'poker_sportsbetting' || 
        site.type === 'all'
      );

      // Sort by geo-availability - available sites first
      const sortedByGeo = sortSitesByAvailability(pokerSites, currentUser?.country_code);

      // Featured sites - top 3 available
      const featured = sortedByGeo.filter(site => site.featured).slice(0, 3);
      
      // Top rated - top 6 (mix of available and unavailable)
      const topRatedSites = sortedByGeo.slice(0, 6);

      setFeaturedSites(featured);
      setTopRated(topRatedSites);
      setLatestArticles(articles);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortSitesByAvailability = (sites, country) => {
    if (!country) return sites;

    return sites.sort((a, b) => {
      const aAvailable = checkSiteAvailability(a, country);
      const bAvailable = checkSiteAvailability(b, country);

      // Available sites come first
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;

      // Within same availability, sort by rating
      return b.rating - a.rating;
    });
  };

  const handleCountrySelect = (country) => {
    setUserCountry(country);
    if (country) {
      // Re-sort sites based on new country selection
      const [allSites] = [sites];
      const pokerSites = allSites.filter(site => 
        site.type === 'poker' || 
        site.type === 'poker_casino' || 
        site.type === 'poker_sportsbetting' || 
        site.type === 'all'
      );
      const sortedByGeo = sortSitesByAvailability(pokerSites, country);
      const featured = sortedByGeo.filter(site => site.featured).slice(0, 3);
      const topRatedSites = sortedByGeo.slice(0, 6);
      setFeaturedSites(featured);
      setTopRated(topRatedSites);
    } else {
      loadData();
    }
  };

  const [sites, setSites] = useState([]);

  return (
    <div className="bg-gray-950 text-white">
      <NewHeroSection 
        sites={topRated} 
        loading={loading} 
        userCountry={userCountry}
      />
      <TrustIndicators />
      <FeaturedSites sites={featuredSites} loading={loading} userCountry={userCountry} />
      <AIAdvisorCTA />
      
      <GeoMapSelector 
        currentCountry={userCountry} 
        onCountrySelect={handleCountrySelect}
        sites={sites}
      />
      
      <RegionStats sites={sites} countryCode={userCountry} />
      
      <TopRatedSection sites={topRated} loading={loading} userCountry={userCountry} />
      <LatestArticles articles={latestArticles} loading={loading} />
    </div>
  );
}