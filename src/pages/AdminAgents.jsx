import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Users, Search, CheckCircle, XCircle, Edit, Tag, UserCog, Award, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminAgents() {
  const [user, setUser] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        toast.error("Admin access required");
        return;
      }

      const agentsList = await base44.entities.Agent.list('-created_date');
      setAgents(agentsList);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const approveAgent = async (agentId) => {
    try {
      await base44.entities.Agent.update(agentId, {
        status: 'approved'
      });
      
      // Trigger onboarding emails
      try {
        await base44.functions.invoke('sendOnboardingEmails', { agent_id: agentId });
      } catch (emailError) {
        console.error("Failed to send onboarding emails:", emailError);
      }
      
      toast.success("Agent approved successfully");
      await loadData();
    } catch (error) {
      console.error("Error approving agent:", error);
      toast.error("Failed to approve agent");
    }
  };

  const denyAgent = async (agentId) => {
    try {
      await base44.entities.Agent.update(agentId, {
        status: 'denied'
      });
      toast.success("Agent denied");
      await loadData();
    } catch (error) {
      console.error("Error denying agent:", error);
      toast.error("Failed to deny agent");
    }
  };

  const openEditDialog = (agent) => {
    setSelectedAgent(agent);
    setEditForm({
      commission_rate: agent.commission_rate || 0,
      payment_type: agent.payment_type || 'automated',
      payment_method: agent.payment_method || '',
      payment_details: agent.payment_details || '',
      assigned_manager: agent.assigned_manager || '',
      internal_tags: agent.internal_tags || [],
      tier: agent.tier || 'bronze',
      notes: agent.notes || ''
    });
    setShowEditDialog(true);
  };

  const saveAgentChanges = async () => {
    if (!selectedAgent) return;

    try {
      await base44.entities.Agent.update(selectedAgent.id, editForm);
      toast.success("Agent updated successfully");
      setShowEditDialog(false);
      setSelectedAgent(null);
      await loadData();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
    }
  };

  const toggleTag = (tag) => {
    const currentTags = editForm.internal_tags || [];
    if (currentTags.includes(tag)) {
      setEditForm({
        ...editForm,
        internal_tags: currentTags.filter(t => t !== tag)
      });
    } else {
      setEditForm({
        ...editForm,
        internal_tags: [...currentTags, tag]
      });
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agent_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.company_name && agent.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = tierFilter === "all" || agent.tier === tierFilter;
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesPaymentType = paymentTypeFilter === "all" || agent.payment_type === paymentTypeFilter;

    return matchesSearch && matchesTier && matchesStatus && matchesPaymentType;
  });

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    denied: "bg-red-500/20 text-red-400 border-red-500/30",
    suspended: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };

  const tierIcons = {
    bronze: Award,
    silver: Sparkles,
    gold: Crown
  };

  const tierColors = {
    bronze: "text-orange-400",
    silver: "text-gray-300",
    gold: "text-yellow-400"
  };

  const tagColors = {
    Manager: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    VIP: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Poker: "bg-green-500/20 text-green-400 border-green-500/30",
    Casino: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const pendingCount = agents.filter(a => a.status === 'pending').length;
  const approvedCount = agents.filter(a => a.status === 'approved').length;

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is only accessible to administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Agent Management</h1>
          <p className="text-gray-400">Manage agent applications, details, and assignments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{agents.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Gold Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {agents.filter(a => a.tier === 'gold').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Types</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="performance_based">Performance Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="space-y-4">
          {filteredAgents.map(agent => {
            const TierIcon = tierIcons[agent.tier];
            return (
              <Card key={agent.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{agent.agent_name}</h3>
                        <Badge className={statusColors[agent.status]}>
                          {agent.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TierIcon className={`w-4 h-4 ${tierColors[agent.tier]}`} />
                          <span className={`text-sm font-semibold ${tierColors[agent.tier]} capitalize`}>
                            {agent.tier}
                          </span>
                        </div>
                        {agent.payment_type === 'performance_based' && (
                          <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                            Performance Based
                          </Badge>
                        )}
                      </div>

                      {agent.internal_tags && agent.internal_tags.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {agent.internal_tags.map(tag => (
                            <Badge key={tag} className={tagColors[tag]} variant="outline">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white ml-2">{agent.agent_email}</span>
                        </div>
                        {agent.company_name && (
                          <div>
                            <span className="text-gray-400">Company:</span>
                            <span className="text-white ml-2">{agent.company_name}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-400">Commission:</span>
                          <span className="text-green-400 ml-2 font-semibold">
                            {agent.commission_rate || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Players:</span>
                          <span className="text-white ml-2">{agent.referred_players_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-white ml-2">
                            ${(agent.total_revenue_generated || 0).toFixed(2)}
                          </span>
                        </div>
                        {agent.assigned_manager && (
                          <div>
                            <span className="text-gray-400">Manager:</span>
                            <span className="text-cyan-400 ml-2">{agent.assigned_manager}</span>
                          </div>
                        )}
                      </div>

                      {agent.notes && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-xs text-gray-400 mb-1">Admin Notes:</div>
                          <div className="text-sm text-gray-300">{agent.notes}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {agent.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => approveAgent(agent.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => denyAgent(agent.id)}
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Deny
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => openEditDialog(agent)}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredAgents.length === 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No agents found matching your filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Agent Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Edit Agent: {selectedAgent?.agent_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Commission Rate (%)</Label>
                <Input
                  type="number"
                  value={editForm.commission_rate}
                  onChange={(e) => setEditForm({ ...editForm, commission_rate: parseFloat(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-gray-300">Tier</Label>
                <Select
                  value={editForm.tier}
                  onValueChange={(value) => setEditForm({ ...editForm, tier: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Payment Type</Label>
              <Select
                value={editForm.payment_type}
                onValueChange={(value) => setEditForm({ ...editForm, payment_type: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="performance_based">Performance Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Payment Method</Label>
                <Input
                  value={editForm.payment_method}
                  onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value })}
                  placeholder="e.g., Bank Transfer, PayPal"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-gray-300">Assigned Manager</Label>
                <Input
                  value={editForm.assigned_manager}
                  onChange={(e) => setEditForm({ ...editForm, assigned_manager: e.target.value })}
                  placeholder="manager@example.com"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Payment Details</Label>
              <Textarea
                value={editForm.payment_details}
                onChange={(e) => setEditForm({ ...editForm, payment_details: e.target.value })}
                placeholder="Account number, routing info, etc."
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-gray-300 mb-3 block">Internal Tags</Label>
              <div className="flex flex-wrap gap-2">
                {['Manager', 'VIP', 'Poker', 'Casino'].map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    variant="outline"
                    className={`${
                      editForm.internal_tags?.includes(tag)
                        ? tagColors[tag]
                        : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Admin Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Internal notes about this agent..."
                className="bg-gray-800 border-gray-700 text-white mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedAgent(null);
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAgentChanges}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}