
import React from "react";
import { Shield, Award, Users, Clock } from "lucide-react";

const indicators = [
  {
    icon: Shield,
    title: "Licensed & Regulated",
    description: "Only featuring sites with proper gaming licenses",
    color: "blue"
  },
  {
    icon: Award,
    title: "Expert Reviews",
    description: "In-depth analysis by professional players",
    color: "purple"
  },
  {
    icon: Users,
    title: "Community Verified",
    description: "Ratings verified by real player experiences",
    color: "emerald"
  },
  {
    icon: Clock,
    title: "Updated Daily",
    description: "Fresh bonuses and promotions every day",
    color: "slate"
  }
];

const colorClasses = {
  blue: {
    bg: "from-blue-400/10 to-blue-600/10",
    border: "border-blue-500/20 group-hover:border-blue-500/40",
    icon: "text-blue-400"
  },
  purple: {
    bg: "from-purple-400/10 to-purple-600/10",
    border: "border-purple-500/20 group-hover:border-purple-500/40",
    icon: "text-purple-400"
  },
  emerald: {
    bg: "from-emerald-400/10 to-emerald-600/10",
    border: "border-emerald-500/20 group-hover:border-emerald-500/40",
    icon: "text-emerald-400"
  },
  slate: {
    bg: "from-slate-400/10 to-slate-600/10",
    border: "border-slate-500/20 group-hover:border-slate-500/40",
    icon: "text-slate-400"
  }
};

export default function TrustIndicators() {
  return (
    <section className="py-16 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => {
            const colors = colorClasses[indicator.color];
            return (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300`}>
                  <indicator.icon className={`w-8 h-8 ${colors.icon}`} />
                </div>
                {/* Heading color remains text-white, which is visible on a dark background. No change specified in outline. */}
                <h3 className="font-semibold text-white mb-2">{indicator.title}</h3>
                <p className="text-gray-400 text-sm">{indicator.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
