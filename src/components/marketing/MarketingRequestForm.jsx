import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

const PRICING = {
  free: { label: "Free Assets", price: "$0", description: "Use existing library assets" },
  banner_standard: { label: "Standard Banner", price: "$50", description: "Static banner (728x90, 300x250)" },
  banner_animated: { label: "Animated Banner", price: "$150", description: "GIF or HTML5 banner" },
  video_short: { label: "Short Video (15-30s)", price: "$300", description: "Professional video ad" },
  video_long: { label: "Long Video (60s+)", price: "$600", description: "Full promotional video" },
  custom_quote: { label: "Custom Project", price: "Quote", description: "Complex or unique requirements" }
};

export default function MarketingRequestForm({ open, onOpenChange, agentId, onRequestCreated }) {
  const [formData, setFormData] = useState({
    request_type: '',
    title: '',
    description: '',
    specifications: '',
    target_site: '',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agentId) {
      toast.error("Agent ID required");
      return;
    }

    try {
      await base44.entities.MarketingRequest.create({
        agent_id: agentId,
        ...formData
      });

      toast.success("Request submitted successfully");
      onOpenChange(false);
      setFormData({
        request_type: '',
        title: '',
        description: '',
        specifications: '',
        target_site: '',
        budget: ''
      });
      
      if (onRequestCreated) onRequestCreated();
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Failed to submit request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Custom Marketing Asset</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Asset Type *</Label>
                <Select
                  value={formData.request_type}
                  onValueChange={(value) => setFormData({ ...formData, request_type: value })}
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="brochure">Brochure</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Budget Tier *</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRICING).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label} - {info.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.budget && (
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-300">
                        {PRICING[formData.budget].label} - {PRICING[formData.budget].price}
                      </div>
                      <div className="text-xs text-blue-200">
                        {PRICING[formData.budget].description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label className="text-gray-300">Request Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Animated banner for PokerStars"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you need in detail..."
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={4}
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Specifications</Label>
              <Textarea
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                placeholder="Size, format, colors, branding requirements..."
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Target Site/Campaign</Label>
              <Input
                value={formData.target_site}
                onChange={(e) => setFormData({ ...formData, target_site: e.target.value })}
                placeholder="Which site or campaign is this for?"
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sm">What Happens Next?</h4>
                <ol className="text-xs text-gray-400 space-y-1">
                  <li>1. Our design team reviews your request (24-48 hours)</li>
                  <li>2. You receive a quote confirmation for custom work</li>
                  <li>3. Work begins after approval</li>
                  <li>4. Asset delivered within agreed timeframe</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}