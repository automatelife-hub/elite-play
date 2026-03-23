import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, X, Check } from "lucide-react";
import { db } from "@/api/supabaseClient";
import { toast } from "sonner";

export default function LocationBanner({ user, onLocationConfirmed }) {
  const [visible, setVisible] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      // Use LLM with web search to detect country from IP
      const result = await db.integrations.Core.InvokeLLM({
        prompt: "Based on my IP address, what country am I in? Respond with only the 2-letter country code (e.g., US, UK, CA, AU) and nothing else. If you can't determine, respond with 'UNKNOWN'.",
        add_context_from_internet: false
      });

      const countryCode = result.trim().toUpperCase();
      
      if (countryCode && countryCode !== 'UNKNOWN' && countryCode.length === 2) {
        setDetectedCountry(countryCode);
        
        // Only show banner if user hasn't confirmed location yet
        if (!user?.location_confirmed || user?.country_code !== countryCode) {
          setVisible(true);
        }
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await db.auth.updateMe({
        country_code: detectedCountry,
        detected_country: detectedCountry,
        location_confirmed: true
      });
      
      setVisible(false);
      toast.success("Location confirmed!");
      if (onLocationConfirmed) onLocationConfirmed(detectedCountry);
    } catch (error) {
      console.error("Error confirming location:", error);
      toast.error("Failed to save location");
    }
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (loading || !visible || !detectedCountry) return null;

  const countryNames = {
    'US': 'United States',
    'UK': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'IE': 'Ireland',
    'NZ': 'New Zealand',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'AR': 'Argentina',
    'IN': 'India',
    'JP': 'Japan',
    'KR': 'South Korea',
    'SG': 'Singapore',
    'HK': 'Hong Kong',
    'TH': 'Thailand',
    'PH': 'Philippines',
  };

  const countryName = countryNames[detectedCountry] || detectedCountry;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-yellow-500/30 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-semibold">
                  Are you in {countryName}?
                </p>
                <p className="text-gray-400 text-sm">
                  We'll show you poker sites available in your region
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
              >
                <Check className="w-4 h-4 mr-2" />
                Yes
              </Button>
              <Button
                variant="ghost"
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}