import React, { useState } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Image as ImageIcon, Edit } from "lucide-react";
import { toast } from "sonner";

export default function MarketingAssetLibrary({ assets, agent, onDownload }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleDownload = async (asset) => {
    try {
      // Update download count
      await db.entities.MarketingAsset.update(asset.id, {
        download_count: (asset.download_count || 0) + 1
      });

      // Trigger download
      window.open(asset.file_url, '_blank');
      toast.success("Asset downloaded");
      
      if (onDownload) onDownload();
    } catch (error) {
      console.error("Error downloading asset:", error);
      toast.error("Failed to download asset");
    }
  };

  const handleCustomize = (asset) => {
    toast.info("Customization tool coming soon! This will allow you to add your tracking code and branding.");
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || asset.asset_type === typeFilter;
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const assetTypeIcons = {
    banner: "🎨",
    logo: "🏷️",
    brochure: "📄",
    social_media_template: "📱",
    email_template: "📧",
    video: "🎥",
    flyer: "📰"
  };

  return (
    <div>
      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardContent className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="banner">Banners</SelectItem>
                <SelectItem value="logo">Logos</SelectItem>
                <SelectItem value="brochure">Brochures</SelectItem>
                <SelectItem value="social_media_template">Social Media</SelectItem>
                <SelectItem value="email_template">Email Templates</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="flyer">Flyers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="poker">Poker</SelectItem>
                <SelectItem value="casino">Casino</SelectItem>
                <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Asset Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.map(asset => (
          <Card key={asset.id} className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all group">
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {asset.thumbnail_url ? (
                  <img src={asset.thumbnail_url} alt={asset.asset_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{assetTypeIcons[asset.asset_type] || '📦'}</span>
                )}
              </div>
              
              <h3 className="font-semibold text-white mb-1 line-clamp-1">{asset.asset_name}</h3>
              
              {asset.description && (
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{asset.description}</p>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="text-xs capitalize">
                  {asset.asset_type.replace('_', ' ')}
                </Badge>
                {asset.dimensions && (
                  <Badge variant="outline" className="text-xs text-gray-400">
                    {asset.dimensions}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(asset)}
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                {asset.customizable && (
                  <Button
                    onClick={() => handleCustomize(asset)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {asset.download_count > 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {asset.download_count} downloads
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No assets found matching your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}