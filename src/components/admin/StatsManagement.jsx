import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { hasPermission } from "./PermissionsGuard";

export default function StatsManagement({ user, signups, sites }) {
  const [uploading, setUploading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const canManage = hasPermission(user, 'manage_stats');

  const [formData, setFormData] = useState({
    signup_id: "",
    period_type: "weekly",
    period_start: "",
    period_end: "",
    hands_played: 0,
    rake_generated: 0,
    profit_loss: 0,
    tournaments_played: 0,
    cash_games_played: 0,
    total_wagered: 0,
    commission_earned: 0,
    bonus_cleared: 0,
    notes: ""
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canManage) {
      toast.error("You don't have permission to upload statistics");
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: await base44.entities.UserStats.schema()
      });

      if (result.status === "success" && result.output) {
        const statsArray = Array.isArray(result.output) ? result.output : [result.output];
        
        await base44.entities.UserStats.bulkCreate(statsArray);
        
        toast.success(`Successfully uploaded ${statsArray.length} stat records`);
      } else {
        toast.error("Failed to extract data from file");
      }
    } catch (error) {
      console.error("Error uploading stats:", error);
      toast.error("Failed to upload stats file");
    } finally {
      setUploading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (!canManage) {
      toast.error("You don't have permission to add statistics");
      return;
    }
    
    try {
      const signup = signups.find(s => s.id === formData.signup_id);
      if (!signup) {
        toast.error("Please select a valid signup");
        return;
      }

      await base44.entities.UserStats.create({
        ...formData,
        user_email: signup.user_email
      });

      toast.success("Stats added successfully");
      setShowManualForm(false);
      setFormData({
        signup_id: "",
        period_type: "weekly",
        period_start: "",
        period_end: "",
        hands_played: 0,
        rake_generated: 0,
        profit_loss: 0,
        tournaments_played: 0,
        cash_games_played: 0,
        total_wagered: 0,
        commission_earned: 0,
        bonus_cleared: 0,
        notes: ""
      });
    } catch (error) {
      console.error("Error adding stats:", error);
      toast.error("Failed to add stats");
    }
  };

  if (!canManage) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Statistics Management</h3>
        <p className="text-gray-400">You don't have permission to manage statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="w-5 h-5 text-yellow-400" />
              Bulk Upload via File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">
              Upload a CSV or Excel file with user statistics. The file will be automatically parsed.
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="stats-upload"
              disabled={uploading}
            />
            <label htmlFor="stats-upload">
              <Button
                as="span"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white cursor-pointer"
              >
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
            </label>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Plus className="w-5 h-5 text-yellow-400" />
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">
              Manually enter statistics for a specific user and time period.
            </p>
            <Button
              onClick={() => setShowManualForm(!showManualForm)}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
            >
              {showManualForm ? "Hide Form" : "Open Manual Entry"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {showManualForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Add Statistics Manually</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">User Signup *</Label>
                  <Select
                    value={formData.signup_id}
                    onValueChange={(value) => setFormData({ ...formData, signup_id: value })}
                    required
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue placeholder="Select user signup" />
                    </SelectTrigger>
                    <SelectContent>
                      {signups.map((signup) => {
                        const site = sites.find(s => s.id === signup.site_id);
                        return (
                          <SelectItem key={signup.id} value={signup.id}>
                            {signup.user_email} - {site?.name} ({signup.site_username})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Period Type *</Label>
                  <Select
                    value={formData.period_type}
                    onValueChange={(value) => setFormData({ ...formData, period_type: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period_start" className="text-gray-300">Period Start *</Label>
                  <Input
                    id="period_start"
                    type="date"
                    value={formData.period_start}
                    onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="period_end" className="text-gray-300">Period End *</Label>
                  <Input
                    id="period_end"
                    type="date"
                    value={formData.period_end}
                    onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="hands_played" className="text-gray-300">Hands Played</Label>
                  <Input
                    id="hands_played"
                    type="number"
                    value={formData.hands_played}
                    onChange={(e) => setFormData({ ...formData, hands_played: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="rake_generated" className="text-gray-300">Rake Generated ($)</Label>
                  <Input
                    id="rake_generated"
                    type="number"
                    step="0.01"
                    value={formData.rake_generated}
                    onChange={(e) => setFormData({ ...formData, rake_generated: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="profit_loss" className="text-gray-300">Profit/Loss ($)</Label>
                  <Input
                    id="profit_loss"
                    type="number"
                    step="0.01"
                    value={formData.profit_loss}
                    onChange={(e) => setFormData({ ...formData, profit_loss: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="commission_earned" className="text-gray-300">Commission Earned ($)</Label>
                  <Input
                    id="commission_earned"
                    type="number"
                    step="0.01"
                    value={formData.commission_earned}
                    onChange={(e) => setFormData({ ...formData, commission_earned: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManualForm(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
                >
                  Add Statistics
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}