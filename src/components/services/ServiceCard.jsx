import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Clock, Star } from "lucide-react";

export default function ServiceCard({ service, inCart, onAddToCart, onRemoveFromCart, onOrder }) {
  const categoryIcons = {
    video_production: "🎬",
    image_editing: "🎨",
    creative_design: "✨",
    website_development: "💻",
    agency_management: "📊",
    growth_optimization: "📈",
    consultation: "🎯",
    compliance_risk: "🛡️",
    tools_integration: "🔧"
  };

  return (
    <Card className="glass-card hover:border-emerald-500/30 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="text-3xl">{categoryIcons[service.category] || "📦"}</div>
          <div className="flex gap-2">
            {service.popular && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {service.package_type === "recurring" && (
              <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                Recurring
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-white text-xl">{service.name}</CardTitle>
        <p className="text-gray-400 text-sm mt-2">{service.description}</p>
      </CardHeader>

      <CardContent>
        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Includes:</div>
            <ul className="space-y-1">
              {service.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                  <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Turnaround */}
        {service.turnaround_time && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Clock className="w-4 h-4" />
            {service.turnaround_time}
          </div>
        )}

        {/* Price */}
        <div className="border-t border-slate-800 pt-4 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">${service.price}</span>
            {service.billing_cycle !== "one_time" && (
              <span className="text-gray-400 text-sm">/{service.billing_cycle}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {inCart ? (
            <Button
              onClick={onRemoveFromCart}
              variant="outline"
              className="flex-1 border-red-700 text-red-400 hover:bg-red-800/20"
            >
              Remove
            </Button>
          ) : (
            <Button
              onClick={onAddToCart}
              variant="outline"
              className="flex-1 border-emerald-700 text-emerald-400 hover:bg-emerald-800/20"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
          <Button
            onClick={onOrder}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500"
          >
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}