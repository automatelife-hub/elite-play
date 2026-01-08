import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Target } from "lucide-react";

export default function CustomDealRequestForm({ open, onOpenChange, agentId, sites, onSuccess }) {
  const [formData, setFormData] = useState({
    site_id: "",
    requested_commission_rate: "",
    requested_bonus: "",
    justification: "",
    expected_volume: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.site_id || !formData.requested_commission_rate || !formData.justification) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await base44.entities.CustomDealRequest.create({
        agent_id: agentId,
        site_id: formData.site_id,
        requested_commission_rate: parseFloat(formData.requested_commission_rate),
        requested_bonus: formData.requested_bonus,
        justification: formData.justification,
        expected_volume: formData.expected_volume,
        status: "pending"
      });

      toast.success("Custom deal request submitted successfully");
      
      setFormData({
        site_id: "",
        requested_commission_rate: "",
        requested_bonus: "",
        justification: "",
        expected_volume: ""
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fire-glass border-orange-600/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Target className="w-6 h-6 text-orange-500" />
            Request Custom Deal Terms
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300">Site / Casino *</Label>
              <Select 
                value={formData.site_id} 
                onValueChange={(value) => setFormData({ ...formData, site_id: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Requested Commission Rate (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.requested_commission_rate}
                  onChange={(e) => setFormData({ ...formData, requested_commission_rate: e.target.value })}
                  placeholder="e.g., 45"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Expected Monthly Volume</Label>
                <Input
                  value={formData.expected_volume}
                  onChange={(e) => setFormData({ ...formData, expected_volume: e.target.value })}
                  placeholder="e.g., $10,000 revenue or 50 players"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Requested Bonus / Special Terms</Label>
              <Textarea
                value={formData.requested_bonus}
                onChange={(e) => setFormData({ ...formData, requested_bonus: e.target.value })}
                placeholder="e.g., $500 sign-up bonus, exclusive tournament access, custom tracking"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Justification *</Label>
              <Textarea
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Explain why you're requesting these custom terms (e.g., existing player base, marketing strategy, traffic sources)"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={4}
                required
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-600/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Note:</strong> Custom deal requests are reviewed by our team within 48 hours. 
                Higher volume and proven track record increase approval chances.
              </p>
            </div>
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
              disabled={submitting}
              className="fire-gradient hover:fire-glow text-white"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}