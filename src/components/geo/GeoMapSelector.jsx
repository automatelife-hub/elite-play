import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Country data with ISO codes
const REGIONS = {
  "US": { name: "United States", code: "US", center: [37.0902, -95.7129], zoom: 4 },
  "GB": { name: "United Kingdom", code: "GB", center: [55.3781, -3.4360], zoom: 6 },
  "CA": { name: "Canada", code: "CA", center: [56.1304, -106.3468], zoom: 4 },
  "AU": { name: "Australia", code: "AU", center: [-25.2744, 133.7751], zoom: 4 },
  "DE": { name: "Germany", code: "DE", center: [51.1657, 10.4515], zoom: 6 },
  "FR": { name: "France", code: "FR", center: [46.2276, 2.2137], zoom: 6 },
  "ES": { name: "Spain", code: "ES", center: [40.4637, -3.7492], zoom: 6 },
  "IT": { name: "Italy", code: "IT", center: [41.8719, 12.5674], zoom: 6 },
  "BR": { name: "Brazil", code: "BR", center: [-14.2350, -51.9253], zoom: 4 },
  "MX": { name: "Mexico", code: "MX", center: [23.6345, -102.5528], zoom: 5 },
  "JP": { name: "Japan", code: "JP", center: [36.2048, 138.2529], zoom: 5 },
  "KR": { name: "South Korea", code: "KR", center: [35.9078, 127.7669], zoom: 7 },
  "IN": { name: "India", code: "IN", center: [20.5937, 78.9629], zoom: 5 },
  "NL": { name: "Netherlands", code: "NL", center: [52.1326, 5.2913], zoom: 7 },
  "SE": { name: "Sweden", code: "SE", center: [60.1282, 18.6435], zoom: 5 },
  "NO": { name: "Norway", code: "NO", center: [60.4720, 8.4689], zoom: 5 },
  "PL": { name: "Poland", code: "PL", center: [51.9194, 19.1451], zoom: 6 },
  "AR": { name: "Argentina", code: "AR", center: [-38.4161, -63.6167], zoom: 4 },
  "CL": { name: "Chile", code: "CL", center: [-35.6751, -71.5430], zoom: 4 },
  "ZA": { name: "South Africa", code: "ZA", center: [-30.5595, 22.9375], zoom: 5 },
};

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function GeoMapSelector({ currentCountry, onCountrySelect, sites = [] }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentCountry && REGIONS[currentCountry]) {
      setSelectedRegion(REGIONS[currentCountry]);
      setMapCenter(REGIONS[currentCountry].center);
      setMapZoom(REGIONS[currentCountry].zoom);
    }
  }, [currentCountry]);

  useEffect(() => {
    if (selectedRegion && sites.length > 0) {
      const available = sites.filter(site => {
        if (!site.restricted_countries || site.restricted_countries.length === 0) {
          if (!site.available_countries || site.available_countries.length === 0) {
            return true; // Available worldwide
          }
          return site.available_countries.includes(selectedRegion.code);
        }
        return !site.restricted_countries.includes(selectedRegion.code);
      }).length;
      setAvailableCount(available);
    }
  }, [selectedRegion, sites]);

  const handleRegionClick = async (region) => {
    setLoading(true);
    setSelectedRegion(region);
    setMapCenter(region.center);
    setMapZoom(region.zoom);
    
    setTimeout(() => {
      onCountrySelect(region.code);
      setLoading(false);
    }, 300);
  };

  const resetView = () => {
    setSelectedRegion(null);
    setMapCenter([20, 0]);
    setMapZoom(2);
    onCountrySelect(null);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
            <Globe className="w-4 h-4 mr-2" />
            Global Coverage
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Discover Sites Available in <span className="text-cyan-400">Your Region</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Click on a region to see personalized offers and site availability
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[500px] relative">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: "100%", width: "100%", background: "#0F172A" }}
                    zoomControl={true}
                    scrollWheelZoom={false}
                  >
                    <MapController center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    />
                  </MapContainer>
                  
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-[1000]">
                      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedRegion && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-white font-semibold text-lg">{selectedRegion.name}</div>
                    <div className="text-sm text-gray-400">
                      {availableCount} {availableCount === 1 ? 'site' : 'sites'} available
                    </div>
                  </div>
                </div>
                <Button
                  onClick={resetView}
                  variant="outline"
                  className="border-slate-700 text-gray-300 hover:bg-slate-800"
                >
                  Reset View
                </Button>
              </div>
            )}
          </div>

          {/* Region Selector */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Select Your Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2">
                  {Object.values(REGIONS).sort((a, b) => a.name.localeCompare(b.name)).map((region) => {
                    const isSelected = selectedRegion?.code === region.code;
                    const regionAvailable = sites.filter(site => {
                      if (!site.restricted_countries || site.restricted_countries.length === 0) {
                        if (!site.available_countries || site.available_countries.length === 0) {
                          return true;
                        }
                        return site.available_countries.includes(region.code);
                      }
                      return !site.restricted_countries.includes(region.code);
                    }).length;

                    return (
                      <button
                        key={region.code}
                        onClick={() => handleRegionClick(region)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                            <div>
                              <div className={`font-medium ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                                {region.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {regionAvailable} available
                              </div>
                            </div>
                          </div>
                          {regionAvailable > 0 ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}