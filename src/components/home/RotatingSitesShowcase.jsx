import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Gift, ChevronLeft, ChevronRight } from "lucide-react";

export default function RotatingSitesShowcase({ sites, loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displaySites = sites || [];
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(displaySites.length / itemsPerSlide);

  useEffect(() => {
    if (loading || isPaused || displaySites.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [loading, isPaused, displaySites.length, totalSlides]);

  const getCurrentSlideItems = () => {
    const start = currentIndex * itemsPerSlide;
    return displaySites.slice(start, start + itemsPerSlide);
  };

  const formatSiteType = (type) => {
    const typeMap = {
      'poker': 'Poker',
      'casino': 'Casino',
      'sportsbetting': 'Sportsbetting',
      'poker_casino': 'Poker & Casino',
      'poker_sportsbetting': 'Poker & Sports',
      'casino_sportsbetting': 'Casino & Sports',
      'all': 'All Games'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Sites</h2>
            <p className="text-gray-400 text-lg">Top-rated poker rooms and online casinos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-slate-900 rounded-xl p-6 animate-pulse">
                <div className="w-full h-32 bg-slate-700 rounded-lg mb-4" />
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (displaySites.length === 0) return null;

  return (
    <div className="bg-slate-950 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Sites
          </h2>
          <p className="text-gray-400 text-lg">Top-rated poker rooms and online casinos</p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full w-12 h-12 p-0 shadow-xl"
            disabled={displaySites.length <= itemsPerSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full w-12 h-12 p-0 shadow-xl"
            disabled={displaySites.length <= itemsPerSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

        <div className="relative px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {getCurrentSlideItems().map((site) => (
                <motion.div
                  key={site.id}
                  onHoverStart={() => setIsPaused(true)}
                  onHoverEnd={() => setIsPaused(false)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer h-full group relative overflow-hidden">
                    {/* Background glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                    
                    <CardContent className="p-6 relative z-10">
                      {/* Logo Container */}
                      <div className="w-full h-32 bg-white rounded-lg p-4 flex items-center justify-center mb-4 shadow-lg">
                        {site.logo_url ? (
                          <img
                            src={site.logo_url}
                            alt={site.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-4xl font-bold text-gray-800">
                            {site.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Site Name */}
                      <h3 className="text-lg font-bold text-white mb-2 text-center">
                        {site.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center justify-center mb-3">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(site.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-400 text-sm">
                          {site.rating}/5
                        </span>
                      </div>

                      {/* Hover Overlay - Type and Bonus */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 z-20">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4 text-sm px-4 py-1">
                          {formatSiteType(site.type)}
                        </Badge>
                        
                        {site.bonus_offer && (
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Gift className="w-5 h-5 text-emerald-400 mr-2" />
                              <span className="text-emerald-400 font-semibold text-sm">Bonus Offer</span>
                            </div>
                            <p className="text-white font-bold text-lg">
                              {site.bonus_offer}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array(totalSlides).fill(0).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-cyan-400 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}