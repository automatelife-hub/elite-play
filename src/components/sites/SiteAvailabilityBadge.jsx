import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";

// Get country name from code
const getCountryName = (countryCode) => {
  const countries = {
    'US': 'United States',
    'UK': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'RU': 'Russia',
    'UA': 'Ukraine',
    'BY': 'Belarus',
    'KZ': 'Kazakhstan',
    'UZ': 'Uzbekistan',
    'AZ': 'Azerbaijan',
    'AM': 'Armenia',
    'GE': 'Georgia',
    'KG': 'Kyrgyzstan',
    'TJ': 'Tajikistan',
    'TM': 'Turkmenistan',
    'MD': 'Moldova',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'IE': 'Ireland',
    'PT': 'Portugal',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IS': 'Iceland',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'SK': 'Slovakia',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'SI': 'Slovenia',
    'RS': 'Serbia',
    'LT': 'Lithuania',
    'LV': 'Latvia',
    'EE': 'Estonia',
    'JP': 'Japan',
    'KR': 'South Korea',
    'CN': 'China',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'VN': 'Vietnam',
    'IN': 'India',
    'NZ': 'New Zealand',
    'BR': 'Brazil',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru',
    'VE': 'Venezuela',
    'UY': 'Uruguay',
    'EC': 'Ecuador',
    'CR': 'Costa Rica',
    'MX': 'Mexico',
    'TR': 'Turkey',
    'IL': 'Israel',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'ZA': 'South Africa',
    'NG': 'Nigeria',
    'KE': 'Kenya',
    'EG': 'Egypt',
  };
  return countries[countryCode] || countryCode;
};

export default function SiteAvailabilityBadge({ site, userCountry }) {
  if (!userCountry) return null;

  const isAvailable = checkSiteAvailability(site, userCountry);
  const countryName = getCountryName(userCountry);

  if (isAvailable) {
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        {countryName} is accepted
      </Badge>
    );
  }

  return (
    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
      <AlertCircle className="w-3 h-3 mr-1" />
      Sorry, {countryName} is not accepted
    </Badge>
  );
}

export function checkSiteAvailability(site, userCountry) {
  if (!userCountry) return true;

  if (site.restricted_countries && site.restricted_countries.includes(userCountry)) {
    return false;
  }

  if (site.available_countries && site.available_countries.length > 0) {
    return site.available_countries.includes(userCountry);
  }

  return true;
}