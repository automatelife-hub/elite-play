import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddSiteSignupDialog({ open, onClose, sites, onSubmit }) {
  const [formData, setFormData] = useState({
    site_id: "",
    site_username: "",
    site_email: "",
    signup_date: new Date().toISOString().split('T')[0],
    referral_code: "",
    status: "active",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        site_id: "",
        site_username: "",
        site_email: "",
        signup_date: new Date().toISOString().split('T')[0],
        referral_code: "",
        status: "active",
        notes: ""
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Site Signup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="site_id" className="text-gray-300">Select Site *</Label>
              <Select
                value={formData.site_id}
                onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Choose a poker site" />
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

            <div>
              <Label htmlFor="site_username" className="text-gray-300">Username on Site *</Label>
              <Input
                id="site_username"
                value={formData.site_username}
                onChange={(e) => setFormData({ ...formData, site_username: e.target.value })}
                placeholder="YourPokerUsername"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="site_email" className="text-gray-300">Email Used on Site *</Label>
              <Input
                id="site_email"
                type="email"
                value={formData.site_email}
                onChange={(e) => setFormData({ ...formData, site_email: e.target.value })}
                placeholder="your@email.com"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="signup_date" className="text-gray-300">Signup Date</Label>
              <Input
                id="signup_date"
                type="date"
                value={formData.signup_date}
                onChange={(e) => setFormData({ ...formData, signup_date: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="referral_code" className="text-gray-300">Referral/Promo Code</Label>
              <Input
                id="referral_code"
                value={formData.referral_code}
                onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                placeholder="Optional"
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information..."
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
            >
              {submitting ? "Adding..." : "Add Signup"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}