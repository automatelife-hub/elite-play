import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CustomDealManager({ agentId, sites }) {
  const [customDeals, setCustomDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newDeal, setNewDeal] = useState({
    site_id: "",
    requested_commission_rate: "",
    requested_bonus: "",
    justification: "",
    expected_volume: ""
  });

  useEffect(() => {
    loadCustomDeals();
  }, [agentId]);

  const loadCustomDeals = async () => {
    try {
      const deals = await db.entities.CustomDealRequest.filter({ agent_id: agentId });
      setCustomDeals(deals);
    } catch (error) {
      console.error("Error loading custom deals:", error);
      toast.error("Failed to load custom deals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      await db.entities.CustomDealRequest.create({
        ...newDeal,
        agent_id: agentId,
        requested_commission_rate: parseFloat(newDeal.requested_commission_rate),
        status: "pending"
      });

      toast.success("Custom deal request submitted");
      setShowCreateDialog(false);
      setNewDeal({
        site_id: "",
        requested_commission_rate: "",
        requested_bonus: "",
        justification: "",
        expected_volume: ""
      });
      await loadCustomDeals();
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Failed to submit deal request");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "under_review":
        return <FileText className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "under_review":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredDeals = customDeals.filter(deal => {
    const site = sites.find(s => s.id === deal.site_id);
    const matchesSearch = site?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || deal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-white text-2xl">Custom Deal Requests</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Request custom commission rates and terms</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search by site..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deals List */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No custom deal requests found</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              variant="outline"
              className="mt-4 border-slate-700 text-gray-300"
            >
              Create Your First Request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeals.map((deal) => {
              const site = sites.find(s => s.id === deal.site_id);
              return (
                <Card key={deal.id} className="glass-card-light hover:border-emerald-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {site?.logo_url && (
                          <img src={site.logo_url} alt={site.name} className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold">{site?.name || "Unknown Site"}</h3>
                            <Badge className={getStatusColor(deal.status)}>
                              {getStatusIcon(deal.status)}
                              <span className="ml-1 capitalize">{deal.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-gray-500">Requested Commission</div>
                              <div className="text-emerald-400 font-semibold">{deal.requested_commission_rate}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Expected Volume</div>
                              <div className="text-white text-sm">{deal.expected_volume || "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Requested</div>
                              <div className="text-white text-sm">{format(new Date(deal.created_date), 'MMM dd, yyyy')}</div>
                            </div>
                            {deal.reviewed_date && (
                              <div>
                                <div className="text-xs text-gray-500">Reviewed</div>
                                <div className="text-white text-sm">{format(new Date(deal.reviewed_date), 'MMM dd, yyyy')}</div>
                              </div>
                            )}
                          </div>

                          {deal.requested_bonus && (
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 mb-1">Requested Bonus</div>
                              <div className="text-gray-300 text-sm">{deal.requested_bonus}</div>
                            </div>
                          )}

                          <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">Justification</div>
                            <div className="text-gray-300 text-sm">{deal.justification}</div>
                          </div>

                          {deal.admin_response && (
                            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                              <div className="text-xs text-gray-500 mb-1">Admin Response</div>
                              <div className="text-gray-300 text-sm">{deal.admin_response}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Create Deal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="glass-card text-white border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Request Custom Deal</DialogTitle>
            <p className="text-sm text-gray-400">Submit a request for custom commission rates and terms</p>
          </DialogHeader>
          <form onSubmit={handleCreateDeal}>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-300">Site *</Label>
                <Select value={newDeal.site_id} onValueChange={(value) => setNewDeal({ ...newDeal, site_id: value })} required>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="commission_rate" className="text-gray-300">Requested Commission Rate (%) *</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  step="0.1"
                  value={newDeal.requested_commission_rate}
                  onChange={(e) => setNewDeal({ ...newDeal, requested_commission_rate: e.target.value })}
                  placeholder="e.g., 35"
                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bonus" className="text-gray-300">Requested Bonus/Special Offer</Label>
                <Input
                  id="bonus"
                  value={newDeal.requested_bonus}
                  onChange={(e) => setNewDeal({ ...newDeal, requested_bonus: e.target.value })}
                  placeholder="e.g., $500 welcome bonus"
                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="volume" className="text-gray-300">Expected Player Volume/Revenue</Label>
                <Input
                  id="volume"
                  value={newDeal.expected_volume}
                  onChange={(e) => setNewDeal({ ...newDeal, expected_volume: e.target.value })}
                  placeholder="e.g., 50 players, $10,000/month"
                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="justification" className="text-gray-300">Justification *</Label>
                <Textarea
                  id="justification"
                  value={newDeal.justification}
                  onChange={(e) => setNewDeal({ ...newDeal, justification: e.target.value })}
                  placeholder="Explain why you're requesting this custom deal..."
                  className="bg-slate-800/50 border-slate-700 text-white mt-1 min-h-[100px]"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="border-slate-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}