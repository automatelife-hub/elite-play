import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, UserPlus, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ReferralSignup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    site_id: "",
    player_username: "",
    player_email: "",
    platform: "poker"
  });

  useEffect(() => {
    // Get referral code from URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }

    // Load sites
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const allSites = await base44.entities.Site.list();
      setSites(allSites);
    } catch (error) {
      console.error("Error loading sites:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!referralCode) {
      toast.error("No referral code found");
      return;
    }

    setLoading(true);
    try {
      const response = await base44.functions.invoke('processReferralSignup', {
        referral_code: referralCode,
        ...formData
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("Signup tracked successfully!");
      } else {
        toast.error(response.data.error || "Failed to process signup");
      }
    } catch (error) {
      console.error("Error submitting signup:", error);
      toast.error("Failed to process signup");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <Card className="bg-gray-900 border-green-500/30 max-w-md">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Signup Tracked!</h2>
            <p className="text-gray-400 mb-6">
              Your signup has been recorded. The referring agent will receive commission on your activity.
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md">
          <CardContent className="p-12 text-center">
            <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Referral Code</h2>
            <p className="text-gray-400">
              This page requires a valid referral code. Please use the link provided by your agent.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Complete Your Signup
            </CardTitle>
            <p className="text-gray-400 mt-2">
              You're signing up through a referral link. Complete the form below to get started.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poker">Poker</SelectItem>
                    <SelectItem value="casino">Casino</SelectItem>
                    <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Site *</Label>
                <Select
                  value={formData.site_id}
                  onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites
                      .filter((s) => s.type === formData.platform || s.type.includes(formData.platform))
                      .map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="player_username" className="text-gray-300">Your Username *</Label>
                <Input
                  id="player_username"
                  value={formData.player_username}
                  onChange={(e) => setFormData({ ...formData, player_username: e.target.value })}
                  placeholder="Your username on the gaming site"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="player_email" className="text-gray-300">Email (Optional)</Label>
                <Input
                  id="player_email"
                  type="email"
                  value={formData.player_email}
                  onChange={(e) => setFormData({ ...formData, player_email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-sm text-emerald-400">
                  ✓ Signing up with referral code: <span className="font-mono">{referralCode}</span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-semibold"
              >
                {loading ? "Processing..." : "Complete Signup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}