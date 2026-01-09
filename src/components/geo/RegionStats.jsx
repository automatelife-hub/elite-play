import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Shield, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function RegionStats({ sites, countryCode }) {
  const availableSites = sites.filter(site => {
    if (!countryCode) return true;
    
    if (!site.restricted_countries || site.restricted_countries.length === 0) {
      if (!site.available_countries || site.available_countries.length === 0) {
        return true; // Available worldwide
      }
      return site.available_countries.includes(countryCode);
    }
    return !site.restricted_countries.includes(countryCode);
  });

  const totalBonusValue = availableSites.reduce((sum, site) => {
    const match = site.bonus_offer?.match(/\$(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const avgRating = availableSites.length > 0
    ? (availableSites.reduce((sum, site) => sum + site.rating, 0) / availableSites.length).toFixed(1)
    : 0;

  const stats = [
    {
      icon: TrendingUp,
      label: "Available Sites",
      value: availableSites.length,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-500/30"
    },
    {
      icon: DollarSign,
      label: "Total Bonus Value",
      value: `$${totalBonusValue.toLocaleString()}`,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: Shield,
      label: "Avg Rating",
      value: `${avgRating}/5`,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30"
    },
    {
      icon: Users,
      label: "Verified Sites",
      value: availableSites.filter(s => s.license).length,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30"
    }
  ];

  if (!countryCode) return null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border ${stat.borderColor}`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}