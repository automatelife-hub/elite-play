import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus } from "lucide-react";

export default function SuggestedBundleCard({ service, onAddToCart }) {
  const discountedPrice = service.price * (1 - service.bundleDiscount / 100);
  
  return (
    <Card className="glass-card border-yellow-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500/20 to-transparent w-32 h-32" />
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {service.bundleDiscount}% OFF
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
        <p className="text-sm text-gray-400 mb-3">
          Perfect with: <span className="text-emerald-400">{service.bundledWith}</span>
        </p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-white">${discountedPrice.toFixed(2)}</span>
          <span className="text-gray-500 line-through text-sm">${service.price}</span>
        </div>

        <Button 
          onClick={onAddToCart}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bundle Deal
        </Button>
      </CardContent>
    </Card>
  );
}