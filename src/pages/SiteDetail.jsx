import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, ExternalLink, CreditCard, Smartphone, Monitor, FileText } from "lucide-react";
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
    } catch (error) {
      console.error("Error loading site:", error);
    } finally {
      setLoading(false);
    }
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
        <Card className="bg-gray-900 border-gray-800 mb-12">
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
              <FileText className="w-8 h-8 text-yellow-400 mr-3" />
              {site.name} Review
            </h2>
            <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Table of Contents</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-300">
                {site.bonus_offer && <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Welcome Bonus</li>}
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Rakeback</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> VIP Rewards</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Jackpots</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Rake Structure</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Games and Traffic</li>
                {site.type === 'poker_casino' || site.type === 'all' ? <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Bookmaker and Casino</li> : null}
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Game Softness</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Attitude Toward Pros</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Software Quality</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Reliability</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Customer Support</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Deposits & Withdrawals</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2">•</span> Pros and Cons</li>
              </ul>
            </div>
            
            {site.bonus_offer && (
              <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h3 className="text-2xl font-bold mb-3 text-green-400">💰 Welcome Bonus</h3>
                <p className="text-xl text-white font-semibold">{site.bonus_offer}</p>
              </div>
            )}

            <p className="text-gray-400 text-lg leading-relaxed">
              Detailed review content will be displayed here. Each section from the table of contents above will be expanded with comprehensive information about {site.name}.
            </p>
          </CardContent>
        </Card>

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
                <p className="text-gray-400">No pros listed.</p>
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
                <p className="text-gray-400">No cons listed.</p>
              )}
            </CardContent>
          </Card>
        </div>

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