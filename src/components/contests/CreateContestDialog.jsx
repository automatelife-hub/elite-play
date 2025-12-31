import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function CreateContestDialog({ open, onOpenChange, sites, agentId, onContestCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contest_name: "",
    contest_type: "rake_race",
    site_id: "",
    start_date: "",
    end_date: "",
    prize_pool: "",
    rules: "",
    poker_rake_multiplier: 100,
    casino_wager_multiplier: 1,
    raffle_tickets_per_rake: 1,
    raffle_tickets_per_wager: 1,
    min_qualification: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agentId) {
      toast.error("Agent ID required");
      return;
    }

    setLoading(true);
    try {
      await base44.entities.AgentContest.create({
        ...formData,
        agent_id: agentId,
        status: new Date(formData.start_date) > new Date() ? 'upcoming' : 'active'
      });

      toast.success("Contest created successfully!");
      onOpenChange(false);
      setFormData({
        contest_name: "",
        contest_type: "rake_race",
        site_id: "",
        start_date: "",
        end_date: "",
        prize_pool: "",
        rules: "",
        poker_rake_multiplier: 100,
        casino_wager_multiplier: 1,
        raffle_tickets_per_rake: 1,
        raffle_tickets_per_wager: 1,
        min_qualification: 0
      });
      if (onContestCreated) onContestCreated();
    } catch (error) {
      console.error("Error creating contest:", error);
      toast.error("Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Contest</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label>Contest Name *</Label>
              <Input
                value={formData.contest_name}
                onChange={(e) => setFormData({ ...formData, contest_name: e.target.value })}
                placeholder="e.g., January Rake Race"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Contest Type *</Label>
                <Select
                  value={formData.contest_type}
                  onValueChange={(value) => setFormData({ ...formData, contest_type: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rake_race">Rake Race</SelectItem>
                    <SelectItem value="wagering_contest">Wagering Contest</SelectItem>
                    <SelectItem value="raffle">Raffle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Site *</Label>
                <Select
                  value={formData.site_id}
                  onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Prize Pool *</Label>
              <Input
                value={formData.prize_pool}
                onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                placeholder="e.g., 1st: $1000, 2nd: $500, 3rd: $250"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Point System</h4>
              <p className="text-sm text-gray-400 mb-3">
                For poker: $1 rake = {formData.poker_rake_multiplier} points<br />
                For casino: $1 wagered = {formData.casino_wager_multiplier} point(s)
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Poker Rake Multiplier</Label>
                  <Input
                    type="number"
                    value={formData.poker_rake_multiplier}
                    onChange={(e) => setFormData({ ...formData, poker_rake_multiplier: parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Casino Wager Multiplier</Label>
                  <Input
                    type="number"
                    value={formData.casino_wager_multiplier}
                    onChange={(e) => setFormData({ ...formData, casino_wager_multiplier: parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
              </div>
            </div>

            {formData.contest_type === 'raffle' && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h4 className="font-semibold text-purple-400 mb-2">Raffle Settings</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Tickets per $1 Rake (Poker)</Label>
                    <Input
                      type="number"
                      value={formData.raffle_tickets_per_rake}
                      onChange={(e) => setFormData({ ...formData, raffle_tickets_per_rake: parseFloat(e.target.value) })}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Tickets per $100 Wagered (Casino)</Label>
                    <Input
                      type="number"
                      value={formData.raffle_tickets_per_wager}
                      onChange={(e) => setFormData({ ...formData, raffle_tickets_per_wager: parseFloat(e.target.value) })}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Minimum Qualification</Label>
              <Input
                type="number"
                value={formData.min_qualification}
                onChange={(e) => setFormData({ ...formData, min_qualification: parseFloat(e.target.value) })}
                placeholder="Minimum points/rake to qualify"
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <Label>Rules & Details</Label>
              <Textarea
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="Describe the contest rules, eligibility, etc."
                className="bg-gray-800 border-gray-700 text-white mt-1 h-24"
              />
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
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {loading ? "Creating..." : "Create Contest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}