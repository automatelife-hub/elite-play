import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { hasPermission } from "./PermissionsGuard";

export default function SiteManagement({ user }) {
  const canManage = hasPermission(user, 'manage_sites');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "poker",
    logo_url: "",
    affiliate_url: "",
    rating: 4,
    bonus_offer: "",
    commission_rate: 0,
    highlights: ["", "", ""],
    featured: false,
    featured_for_agents: false
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const allSites = await base44.entities.Site.list('-created_date');
      setSites(allSites);
    } catch (error) {
      console.error("Error loading sites:", error);
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canManage) {
      toast.error("You don't have permission to manage sites");
      return;
    }
    
    try {
      const siteData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim() !== "")
      };

      if (editingSite) {
        await base44.entities.Site.update(editingSite.id, siteData);
        toast.success("Site updated successfully");
      } else {
        await base44.entities.Site.create(siteData);
        toast.success("Site created successfully");
      }

      setShowDialog(false);
      resetForm();
      await loadSites();
    } catch (error) {
      console.error("Error saving site:", error);
      toast.error("Failed to save site");
    }
  };

  const handleEdit = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      type: site.type,
      logo_url: site.logo_url || "",
      affiliate_url: site.affiliate_url,
      rating: site.rating,
      bonus_offer: site.bonus_offer || "",
      commission_rate: site.commission_rate || 0,
      highlights: site.highlights?.length > 0 ? [...site.highlights, "", "", ""].slice(0, 3) : ["", "", ""],
      featured: site.featured || false,
      featured_for_agents: site.featured_for_agents || false
    });
    setShowDialog(true);
  };

  const handleDelete = async (siteId) => {
    if (!canManage) {
      toast.error("You don't have permission to delete sites");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      await base44.entities.Site.delete(siteId);
      toast.success("Site deleted successfully");
      await loadSites();
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site");
    }
  };

  const resetForm = () => {
    setEditingSite(null);
    setFormData({
      name: "",
      type: "poker",
      logo_url: "",
      affiliate_url: "",
      rating: 4,
      bonus_offer: "",
      commission_rate: 0,
      highlights: ["", "", ""],
      featured: false,
      featured_for_agents: false
    });
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || site.type === typeFilter || site.type?.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Management</h2>
          <p className="text-gray-400">Manage poker sites, casinos, and sportsbooks</p>
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
            Add Site
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="poker">Poker</SelectItem>
            <SelectItem value="casino">Casino</SelectItem>
            <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sites Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-700 rounded mb-4" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <Card key={site.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {site.logo_url ? (
                    <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-2" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-400">
                      No Logo
                    </div>
                  )}
                  {site.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{site.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">⭐ {site.rating}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-sm capitalize">{site.type}</span>
                </div>

                {site.bonus_offer && (
                  <p className="text-green-400 text-sm mb-3">{site.bonus_offer}</p>
                )}

                {site.highlights && site.highlights.length > 0 && (
                  <ul className="text-gray-400 text-xs mb-4 space-y-1">
                    {site.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx}>• {highlight}</li>
                    ))}
                  </ul>
                )}

                {canManage && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(site)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(site.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No sites found matching your filters
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSite ? "Edit Site" : "Add New Site"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Site Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poker">Poker</SelectItem>
                    <SelectItem value="casino">Casino</SelectItem>
                    <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
                    <SelectItem value="poker_casino">Poker & Casino</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-300">Logo URL</Label>
                <Input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-300">Affiliate URL *</Label>
                <Input
                  type="url"
                  value={formData.affiliate_url}
                  onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Rating (1-5) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  Featured on Homepage
                </Label>
                <Label className="text-gray-300 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured_for_agents}
                    onChange={(e) => setFormData({ ...formData, featured_for_agents: e.target.checked })}
                    className="mr-2"
                  />
                  Featured for Agents
                </Label>
              </div>

              <div>
                <Label className="text-gray-300">Bonus Offer</Label>
                <Input
                  value={formData.bonus_offer}
                  onChange={(e) => setFormData({ ...formData, bonus_offer: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="e.g., 100% up to $1000"
                />
              </div>

              <div>
                <Label className="text-gray-300">Commission Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="e.g., 30"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-300">Highlights (up to 3)</Label>
                {formData.highlights.map((highlight, idx) => (
                  <Input
                    key={idx}
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...formData.highlights];
                      newHighlights[idx] = e.target.value;
                      setFormData({ ...formData, highlights: newHighlights });
                    }}
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                    placeholder={`Highlight ${idx + 1}`}
                  />
                ))}
              </div>
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
                {editingSite ? "Update Site" : "Create Site"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}