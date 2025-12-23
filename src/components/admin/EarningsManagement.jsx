import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, DollarSign, Calendar, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { hasPermission } from "./PermissionsGuard";
import { format } from "date-fns";

export default function EarningsManagement({ user, sites }) {
  const canManage = hasPermission(user, 'manage_stats') || hasPermission(user, 'full_admin');
  const [earnings, setEarnings] = useState([]);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEarning, setEditingEarning] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    affiliate_link_id: "",
    site_id: "",
    user_email: "",
    amount: 0,
    currency: "USD",
    conversion_date: new Date().toISOString().split('T')[0],
    status: "pending",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [earningsData, linksData] = await Promise.all([
        base44.entities.AffiliateEarnings.list('-conversion_date'),
        base44.entities.AffiliateLink.list()
      ]);
      setEarnings(earningsData);
      setAffiliateLinks(linksData);
    } catch (error) {
      console.error("Error loading earnings:", error);
      toast.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canManage) {
      toast.error("You don't have permission to manage earnings");
      return;
    }
    
    try {
      if (editingEarning) {
        await base44.entities.AffiliateEarnings.update(editingEarning.id, formData);
        toast.success("Earning updated successfully");
      } else {
        await base44.entities.AffiliateEarnings.create(formData);
        toast.success("Earning added successfully");
      }

      setShowDialog(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error saving earning:", error);
      toast.error("Failed to save earning");
    }
  };

  const handleStatusChange = async (earningId, newStatus) => {
    if (!canManage) {
      toast.error("You don't have permission to change status");
      return;
    }

    try {
      const updateData = { status: newStatus };
      if (newStatus === 'paid') {
        updateData.payment_date = new Date().toISOString().split('T')[0];
      }
      
      await base44.entities.AffiliateEarnings.update(earningId, updateData);
      toast.success(`Status changed to ${newStatus}`);
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setEditingEarning(null);
    setFormData({
      affiliate_link_id: "",
      site_id: "",
      user_email: "",
      amount: 0,
      currency: "USD",
      conversion_date: new Date().toISOString().split('T')[0],
      status: "pending",
      notes: ""
    });
  };

  const handleEdit = (earning) => {
    setEditingEarning(earning);
    setFormData({
      affiliate_link_id: earning.affiliate_link_id || "",
      site_id: earning.site_id,
      user_email: earning.user_email || "",
      amount: earning.amount,
      currency: earning.currency || "USD",
      conversion_date: earning.conversion_date,
      status: earning.status,
      notes: earning.notes || ""
    });
    setShowDialog(true);
  };

  const getSiteName = (siteId) => {
    const site = sites.find(s => s.id === siteId);
    return site?.name || "Unknown Site";
  };

  const getLinkName = (linkId) => {
    const link = affiliateLinks.find(l => l.id === linkId);
    return link?.link_name || "Direct Link";
  };

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const filteredEarnings = earnings.filter(earning => {
    const matchesStatus = statusFilter === "all" || earning.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      earning.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSiteName(earning.site_id).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEarnings = filteredEarnings.reduce((sum, e) => sum + (e.amount || 0), 0);
  const pendingEarnings = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.amount || 0), 0);
  const approvedEarnings = earnings.filter(e => e.status === 'approved').reduce((sum, e) => sum + (e.amount || 0), 0);
  const paidEarnings = earnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0);

  if (!canManage) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Earnings Management</h3>
        <p className="text-gray-400">You don't have permission to manage earnings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Affiliate Earnings</h2>
          <p className="text-gray-400">Track and manage affiliate commission earnings</p>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Earning
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">${pendingEarnings.toFixed(2)}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-400">${approvedEarnings.toFixed(2)}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Paid</p>
                <p className="text-2xl font-bold text-blue-400">${paidEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by user email or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Earnings Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Site</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">User</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td>
                  </tr>
                ) : filteredEarnings.length > 0 ? (
                  filteredEarnings.map((earning) => (
                    <tr key={earning.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-white">
                        {format(new Date(earning.conversion_date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-white">{getSiteName(earning.site_id)}</td>
                      <td className="py-3 px-4 text-gray-400">{earning.user_email || '-'}</td>
                      <td className="py-3 px-4 text-green-400 font-semibold">
                        ${earning.amount.toFixed(2)} {earning.currency}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[earning.status]}>
                          {earning.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {earning.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleStatusChange(earning.id, 'approved')}
                                size="sm"
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => handleStatusChange(earning.id, 'rejected')}
                                size="sm"
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          {earning.status === 'approved' && (
                            <Button
                              onClick={() => handleStatusChange(earning.id, 'paid')}
                              size="sm"
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30"
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            onClick={() => handleEdit(earning)}
                            size="sm"
                            variant="outline"
                            className="border-gray-700 text-gray-400 hover:bg-gray-800"
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">No earnings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEarning ? "Edit Earning" : "Add New Earning"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Site *</Label>
                <Select
                  value={formData.site_id}
                  onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select site" />
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
                <Label className="text-gray-300">Affiliate Link</Label>
                <Select
                  value={formData.affiliate_link_id}
                  onValueChange={(value) => setFormData({ ...formData, affiliate_link_id: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue placeholder="Select link (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {affiliateLinks
                      .filter(link => !formData.site_id || link.site_id === formData.site_id)
                      .map((link) => (
                        <SelectItem key={link.id} value={link.id}>
                          {link.link_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user_email" className="text-gray-300">User Email</Label>
                <Input
                  id="user_email"
                  type="email"
                  value={formData.user_email}
                  onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <Label htmlFor="conversion_date" className="text-gray-300">Conversion Date *</Label>
                <Input
                  id="conversion_date"
                  type="date"
                  value={formData.conversion_date}
                  onChange={(e) => setFormData({ ...formData, conversion_date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-gray-300">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
              >
                {editingEarning ? "Update" : "Add"} Earning
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}