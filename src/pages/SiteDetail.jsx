import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, ExternalLink, CreditCard, Smartphone, Monitor, FileText, Network, ThumbsUp, Sparkles, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";
import ImageGallery from "../components/sites/ImageGallery";

// Add flag emoji helper at the top
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const getCountryName = (countryCode) => {
  const countries = {
    'US': 'United States', 'UK': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
    'RU': 'Russia', 'UA': 'Ukraine', 'BY': 'Belarus', 'KZ': 'Kazakhstan',
    'DE': 'Germany', 'FR': 'France', 'ES': 'Spain', 'IT': 'Italy',
    'NL': 'Netherlands', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
    'BR': 'Brazil', 'MX': 'Mexico', 'AR': 'Argentina', 'JP': 'Japan',
    'IN': 'India', 'SG': 'Singapore', 'NZ': 'New Zealand', 'PH': 'Philippines',
    'AT': 'Austria', 'BE': 'Belgium', 'CZ': 'Czech Republic', 'FI': 'Finland',
    'GR': 'Greece', 'HU': 'Hungary', 'IE': 'Ireland', 'LV': 'Latvia',
    'LT': 'Lithuania', 'LU': 'Luxembourg', 'MT': 'Malta', 'PL': 'Poland',
    'PT': 'Portugal', 'RO': 'Romania', 'SK': 'Slovakia', 'SI': 'Slovenia',
    'ZA': 'South Africa', 'CH': 'Switzerland', 'TR': 'Turkey', 'AE': 'United Arab Emirates',
  };
  return countries[countryCode] || countryCode;
};

const checkSiteAvailability = (site, userCountry) => {
  if (!userCountry) return true;

  if (site.restricted_countries && site.restricted_countries.includes(userCountry)) {
    return false;
  }

  if (site.available_countries && site.available_countries.length > 0) {
    return site.available_countries.includes(userCountry);
  }

  return true;
};

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

export default function SiteDetail() {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [loadingNetwork, setLoadingNetwork] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [generatingProscons, setGeneratingProscons] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const siteName = urlParams.get('site');
      
      const [sites, currentUser] = await Promise.all([
        base44.entities.Site.list(),
        base44.auth.me().catch(() => null)
      ]);

      if (currentUser && currentUser.country_code) {
        setUserCountry(currentUser.country_code);
      }
      
      let foundSite = null;
      for (let i = 0; i < sites.length; i++) {
        const normalizedName = sites[i].name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
        const normalizedParam = (siteName || '').toLowerCase();
        if (normalizedName === normalizedParam) {
          foundSite = sites[i];
          break;
        }
      }
      
      setSite(foundSite);
      
      // Load network info if site has a poker network
      if (foundSite && foundSite.poker_network && foundSite.poker_network !== 'no_deal_available') {
        loadNetworkInfo(foundSite.poker_network);
      }

      // Load testimonials
      if (foundSite) {
        loadTestimonials(foundSite.id);
      }
    } catch (error) {
      console.error("Error loading site:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkInfo = async (networkId) => {
    setLoadingNetwork(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a brief 2-3 sentence description about the ${getNetworkName(networkId)} poker network. Include when it was established (if known) and what makes it notable. Keep it concise and informative.`,
        add_context_from_internet: false
      });
      
      setNetworkInfo({
        id: networkId,
        name: getNetworkName(networkId),
        description: response
      });
    } catch (error) {
      console.error("Error loading network info:", error);
    } finally {
      setLoadingNetwork(false);
    }
  };

  const loadTestimonials = async (siteId) => {
    try {
      const allTestimonials = await base44.entities.UserTestimonial.filter(
        { site_id: siteId, verified: true },
        '-created_date',
        10
      );
      setTestimonials(allTestimonials);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    }
  };

  const generateProsAndCons = async () => {
    if (!site) return;
    
    setGeneratingProscons(true);
    try {
      const prompt = `Based on the following information about ${site.name}, generate a comprehensive list of pros and cons:

Site Type: ${formatSiteType(site.type)}
Rating: ${site.rating}/5
Bonus: ${site.bonus_offer || 'None'}
Description: ${site.description || 'No description available'}
Highlights: ${site.highlights?.join(', ') || 'None'}
Payment Methods: ${site.payment_methods?.join(', ') || 'Various'}
Established: ${site.established_year || 'Unknown'}

Please provide:
1. A list of 4-6 pros (advantages)
2. A list of 3-5 cons (disadvantages)

Format as JSON with this structure:
{
  "pros": ["pro 1", "pro 2", ...],
  "cons": ["con 1", "con 2", ...]
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            pros: {
              type: "array",
              items: { type: "string" }
            },
            cons: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Update the site with generated pros and cons
      await base44.entities.Site.update(site.id, {
        pros: response.pros,
        cons: response.cons
      });

      // Reload site data
      await loadData();
    } catch (error) {
      console.error("Error generating pros and cons:", error);
    } finally {
      setGeneratingProscons(false);
    }
  };

  const getNetworkName = (networkId) => {
    const networkNames = {
      'gg_network': 'GG Network',
      'chico_poker_network': 'Chico Poker Network',
      'ipoker_network': 'iPoker Network',
      'winning_poker_network': 'Winning Poker Network',
      'horizon_poker_network': 'Horizon Poker Network',
      'betconstruct_network': 'BetConstruct Network',
      'idnpoker_network': 'IDNPoker Network',
      'paiwangluo_poker_network': 'Paiwangluo Poker Network',
      'gvc_network': 'GVC Network',
      'peoples_network': 'Peoples Network',
      'dollaro': 'Dollaro',
      'microgaming_poker_network': 'Microgaming Poker Network',
      'grand': 'Grand',
      'hive': 'Hive',
      'klas_poker_network': 'Klas Poker Network',
      'rap': 'RAP',
      'ipoker_es_network': 'iPoker.es Network',
      'hive_italy': 'Hive Italy',
      'tonybet_network': 'Tonybet Network',
      'ongame_poker': 'Ongame Poker',
      'revolution_cake': 'Revolution (Cake)',
      'aconcagua_poker_network': 'Aconcagua Poker Network',
      'merge_gaming_network': 'Merge Gaming Network',
      'independent': 'Independent'
    };
    return networkNames[networkId] || networkId;
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-96 bg-gray-800 rounded-xl mb-8" />
          <Skeleton className="h-64 bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Site Not Found</h1>
          <p className="text-gray-400 mb-6">Could not find the poker site you are looking for.</p>
          <Link to={createPageUrl("Reviews")}>
            <Button>Back to All Sites</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = checkSiteAvailability(site, userCountry);
  const countryName = getCountryName(userCountry);
  const flagEmoji = getFlagEmoji(userCountry);
  
  // Use detail logo if available, otherwise fall back to regular logo
  const displayLogo = site.logo_detail_url || site.logo_url;

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section with distinct background and spacing from nav */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b-4 border-yellow-500/30 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Country Availability Banner */}
          {userCountry && (
            <div className={`mb-6 rounded-xl p-4 border-2 ${
              isAvailable 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{flagEmoji}</span>
                {isAvailable ? (
                  <div className="text-center">
                    <p className="text-green-400 font-bold text-xl mb-2">
                      🎉 Yay! {countryName} is available to play at {site.name}
                    </p>
                    <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Play Now at {site.name}
                      </Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-red-400 font-bold text-xl">
                    😔 Sorry, {countryName} is not available at this time
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column: Logo, Name, Rating */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                {displayLogo && (
                  <div className="bg-white rounded-xl p-2 shadow-2xl mb-4">
                    <img 
                      src={displayLogo} 
                      alt={site.name}
                      className="w-[280px] h-[80px] object-contain"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-bold mb-3">{site.name}</h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={i <= Math.floor(site.rating) ? 'w-6 h-6 fill-yellow-400 text-yellow-400' : 'w-6 h-6 text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold text-3xl">{site.rating}</span>
                </div>

                <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 text-lg px-4 py-1">
                  {formatSiteType(site.type)}
                </Badge>
              </div>
            </div>

            {/* Middle Column: Detailed Ratings */}
            <div className="lg:col-span-1 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">How We Rate</h2>
              <div className="space-y-3">
                {site.reliability_rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Reliability</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={i <= Math.floor(site.reliability_rating) ? 'w-4 h-4 fill-yellow-400 text-yellow-400' : 'w-4 h-4 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{site.reliability_rating}</span>
                    </div>
                  </div>
                )}
                {site.game_selection_rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Game Selection</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={i <= Math.floor(site.game_selection_rating) ? 'w-4 h-4 fill-yellow-400 text-yellow-400' : 'w-4 h-4 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{site.game_selection_rating}</span>
                    </div>
                  </div>
                )}
                {site.bonuses_promotions_rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Bonuses & Promos</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={i <= Math.floor(site.bonuses_promotions_rating) ? 'w-4 h-4 fill-yellow-400 text-yellow-400' : 'w-4 h-4 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{site.bonuses_promotions_rating}</span>
                    </div>
                  </div>
                )}
                {site.casual_players_rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Casual Players</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={i <= Math.floor(site.casual_players_rating) ? 'w-4 h-4 fill-yellow-400 text-yellow-400' : 'w-4 h-4 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{site.casual_players_rating}</span>
                    </div>
                  </div>
                )}
                {site.deposits_withdrawals_rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Deposits & Withdrawals</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={i <= Math.floor(site.deposits_withdrawals_rating) ? 'w-4 h-4 fill-yellow-400 text-yellow-400' : 'w-4 h-4 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{site.deposits_withdrawals_rating}</span>
                    </div>
                  </div>
                )}
                {site.software_convenience_rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Software & Convenience</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={i <= Math.floor(site.software_convenience_rating) ? 'w-4 h-4 fill-yellow-400 text-yellow-400' : 'w-4 h-4 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 font-semibold">{site.software_convenience_rating}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Bonus & CTA */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              {site.bonus_offer && (
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6 mb-6">
                  <div className="text-green-400 text-sm font-semibold mb-2">🎁 WELCOME BONUS</div>
                  <div className="text-white font-bold text-2xl mb-4">{site.bonus_offer}</div>
                </div>
              )}
              
              <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
                <Button 
                  className={`w-full font-bold text-xl py-8 rounded-xl shadow-2xl transition-all transform hover:scale-105 ${
                    isAvailable
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 hover:shadow-yellow-500/50'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isAvailable}
                >
                  <ExternalLink className="w-6 h-6 mr-3" />
                  {isAvailable ? `Visit ${site.name}` : 'Not Available'}
                </Button>
              </a>
            </div>
          </div>

          {/* Info Row Below */}
          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-700">
            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase">Info</h3>
              <div className="space-y-2">
                {site.established_year && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Established</span>
                    <span className="text-white">{site.established_year}</span>
                  </div>
                )}
                {site.license && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">License</span>
                    <span className="text-white text-xs">{site.license}</span>
                  </div>
                )}
                {site.minimum_deposit && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min deposit</span>
                    <span className="text-white">${site.minimum_deposit}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase">Platforms</h3>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Monitor className="w-8 h-8 text-green-400 mb-2" />
                  <span className="text-xs text-gray-400">Desktop</span>
                </div>
                <div className="flex flex-col items-center">
                  <Smartphone className="w-8 h-8 text-green-400 mb-2" />
                  <span className="text-xs text-gray-400">Mobile</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase">Payment</h3>
              <div className="flex flex-wrap gap-2">
                {site.payment_methods && site.payment_methods.length > 0 ? (
                  site.payment_methods.slice(0, 4).map((method, idx) => (
                    <Badge key={idx} variant="outline" className="text-gray-300 border-gray-600">
                      <CreditCard className="w-3 h-3 mr-1" />
                      {method}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Multiple options</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Review Section with Table of Contents */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Contents
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {site.bonus_offer && (
                      <li>
                        <a href="#welcome-bonus" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                          Welcome Bonus
                        </a>
                      </li>
                    )}
                    <li>
                      <a href="#rakeback" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Rakeback
                      </a>
                    </li>
                    <li>
                      <a href="#vip-rewards" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        VIP Rewards
                      </a>
                    </li>
                    <li>
                      <a href="#jackpots" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Jackpots
                      </a>
                    </li>
                    <li>
                      <a href="#rake-structure" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Rake Structure
                      </a>
                    </li>
                    <li>
                      <a href="#games-traffic" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Games & Traffic
                      </a>
                    </li>
                    {(site.type === 'poker_casino' || site.type === 'all') && (
                      <li>
                        <a href="#bookmaker-casino" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                          Bookmaker & Casino
                        </a>
                      </li>
                    )}
                    <li>
                      <a href="#game-softness" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Game Softness
                      </a>
                    </li>
                    <li>
                      <a href="#attitude-pros" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Attitude to Pros
                      </a>
                    </li>
                    <li>
                      <a href="#software" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Software
                      </a>
                    </li>
                    <li>
                      <a href="#reliability" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Reliability
                      </a>
                    </li>
                    <li>
                      <a href="#customer-support" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Support
                      </a>
                    </li>
                    <li>
                      <a href="#deposits-withdrawals" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Deposits
                      </a>
                    </li>
                    <li>
                      <a href="#pros-cons" className="block py-2 px-3 rounded hover:bg-gray-800 hover:text-yellow-400 transition-colors cursor-pointer">
                        Pros & Cons
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Review Sections */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
                  <FileText className="w-8 h-8 text-yellow-400 mr-3" />
                  {site.name} Review
                </h2>
                {/* Review Sections */}
                {site.bonus_offer && (
              <div id="welcome-bonus" className="mb-12 scroll-mt-32">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                  💰 100% Welcome Bonus up to $1,000
                </h3>
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-xl text-white font-semibold mb-4">{site.bonus_offer}</p>
                  <p className="text-gray-400 leading-relaxed">
                    Detailed information about the welcome bonus, terms and conditions, wagering requirements, and how to claim it will be displayed here.
                  </p>
                </div>
                  </div>
                )}

                <div id="rakeback" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                {site.name} Rakeback
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Information about rakeback percentages, how it's calculated, payment frequency, and special rakeback deals available through our affiliate.
              </p>
            </div>

            <div id="vip-rewards" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                VIP Rewards Program
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Details about the VIP loyalty program, tier levels, benefits at each level, and how to maximize your rewards.
              </p>
            </div>

            <div id="jackpots" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                {site.name} Poker Jackpots
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Information about available jackpots, bad beat jackpots, progressive jackpots, and how to qualify.
              </p>
            </div>

            <div id="rake-structure" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Rake Structure
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Detailed breakdown of rake percentages for cash games and tournaments, rake caps, and comparison with industry standards.
              </p>
            </div>

            <div id="games-traffic" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Games and Traffic
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Analysis of available game types, stake levels, peak traffic times, and average number of concurrent players.
              </p>
            </div>

            {(site.type === 'poker_casino' || site.type === 'all') && (
              <div id="bookmaker-casino" className="mb-12 scroll-mt-32">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                  Bookmaker and Casino
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Overview of the integrated sportsbook and casino offerings, game selection, and cross-platform promotions.
                </p>
              </div>
            )}

            <div id="game-softness" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Game Softness
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Assessment of player skill levels, recreational vs. professional player ratio, and overall game difficulty.
              </p>
            </div>

            <div id="attitude-pros" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Attitude Toward Professional Players
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Information about the site's policies regarding professional players, multi-tabling, HUDs, and account restrictions.
              </p>
            </div>

            <div id="software" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                {site.name} Software
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Review of the poker client software, mobile app quality, user interface, features, and overall user experience.
              </p>
            </div>

            <div id="reliability" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Reliability and Trustworthiness
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Analysis of the site's reputation, licensing, security measures, and history of fair play and timely payments.
              </p>
            </div>

            <div id="customer-support" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Customer Support
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Details about support channels (live chat, email, phone), response times, and quality of customer service.
              </p>
            </div>

            <div id="deposits-withdrawals" className="mb-12 scroll-mt-32">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-gray-700 pb-2">
                Deposits and Withdrawals
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive overview of payment methods, processing times, fees, limits, and withdrawal policies.
              </p>
            </div>

                <div id="pros-cons" className="scroll-mt-32">
                          <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
                            <h3 className="text-2xl font-bold text-yellow-400">
                              Pros and Cons of Playing at {site.name}
                            </h3>
                            {(!site.pros || !site.cons || site.pros.length === 0 || site.cons.length === 0) && (
                              <Button
                                onClick={generateProsAndCons}
                                disabled={generatingProscons}
                                className="bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                              >
                                {generatingProscons ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate with AI
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Image Gallery */}
        {site.gallery_images && site.gallery_images.length > 0 && (
          <div className="mb-12">
            <ImageGallery images={site.gallery_images} siteName={site.name} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <Check className="w-6 h-6 text-green-400 mr-2" />
                Pros
              </h2>
              {site.pros && site.pros.length > 0 ? (
                <ul className="space-y-3">
                  {site.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{pro}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No pros listed yet.</p>
                  <Button
                    onClick={generateProsAndCons}
                    disabled={generatingProscons}
                    className="bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  >
                    {generatingProscons ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <X className="w-6 h-6 text-red-400 mr-2" />
                Cons
              </h2>
              {site.cons && site.cons.length > 0 ? (
                <ul className="space-y-3">
                  {site.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start">
                      <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{con}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No cons listed yet.</p>
                  <Button
                    onClick={generateProsAndCons}
                    disabled={generatingProscons}
                    className="bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  >
                    {generatingProscons ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Testimonials Section */}
        {testimonials.length > 0 && (
          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                <Quote className="w-6 h-6 text-cyan-400 mr-2" />
                User Testimonials
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <Card key={idx} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-white">{testimonial.user_name}</p>
                          <p className="text-xs text-gray-400">
                            {testimonial.user_country} • {new Date(testimonial.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        "{testimonial.testimonial}"
                      </p>
                      {testimonial.verified && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Verified User
                        </Badge>
                      )}
                      {testimonial.helpful_count > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <ThumbsUp className="w-3 h-3" />
                          {testimonial.helpful_count} found this helpful
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Poker Network Section */}
        {site.poker_network && site.poker_network !== 'no_deal_available' && (
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-cyan-500/30 mb-12">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Network className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Poker Network</h2>
                    <p className="text-cyan-400 font-semibold">{networkInfo?.name || getNetworkName(site.poker_network)}</p>
                  </div>
                </div>
                <Link to={`${createPageUrl('PokerNetworkDetail')}?network=${site.poker_network}`}>
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    View Network Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {loadingNetwork ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                  <span className="text-sm">Loading network information...</span>
                </div>
              ) : networkInfo?.description ? (
                <p className="text-slate-300 leading-relaxed">
                  {networkInfo.description}
                </p>
              ) : null}
              
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-slate-400 text-sm">
                  {site.name} is part of the {networkInfo?.name || getNetworkName(site.poker_network)}, which means 
                  you'll be playing in a shared player pool with other sites on the network, ensuring better traffic 
                  and game variety at all stakes.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {site.description && (
          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">About {site.name}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{site.description}</p>
            </CardContent>
          </Card>
        )}

        {site.highlights && site.highlights.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {site.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center">
          <a href={site.affiliate_url} target="_blank" rel="noopener noreferrer">
            <Button 
              className={`bg-gradient-to-r ${isAvailable ? 'from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900' : 'from-gray-700 to-gray-600 text-gray-400 cursor-not-allowed'} font-bold text-lg py-6 px-12`}
              disabled={!isAvailable}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              {isAvailable ? `Play Now at ${site.name}` : 'Not Available'}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}