import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link2, Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";

export default function AffiliateLinks() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [filterSite, setFilterSite] = useState("all");
  const [filterPlacement, setFilterPlacement] = useState("all");

  const [formData, setFormData] = useState({
    site_id: "",
    link_name: "",
    affiliate_url: "",
    is_default: false,
    placement: "global",
    active: true,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        toast.error("Admin access required");
        return;
      }

      const [affiliateLinks, allSites] = await Promise.all([
        base44.entities.AffiliateLink.list('-created_date'),
        base44.entities.Site.list('name'),
      ]);

      setLinks(affiliateLinks);
      setSites(allSites);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load affiliate links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await base44.entities.AffiliateLink.update(editingLink.id, formData);
        toast.success("Affiliate link updated");
      } else {
        await base44.entities.AffiliateLink.create(formData);
        toast.success("Affiliate link created");
      }
      
      setShowDialog(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error saving affiliate link:", error);
      toast.error("Failed to save affiliate link");
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      site_id: link.site_id,
      link_name: link.link_name,
      affiliate_url: link.affiliate_url,
      is_default: link.is_default,
      placement: link.placement,
      active: link.active,
      notes: link.notes || "",
    });
    setShowDialog(true);
  };

  const handleDelete = async (linkId) => {
    if (!confirm("Are you sure you want to delete this affiliate link?")) return;
    
    try {
      await base44.entities.AffiliateLink.delete(linkId);
      toast.success("Affiliate link deleted");
      await loadData();
    } catch (error) {
      console.error("Error deleting affiliate link:", error);
      toast.error("Failed to delete affiliate link");
    }
  };

  const handleToggleActive = async (link) => {
    try {
      await base44.entities.AffiliateLink.update(link.id, {
        active: !link.active,
      });
      toast.success(`Link ${link.active ? 'deactivated' : 'activated'}`);
      await loadData();
    } catch (error) {
      console.error("Error toggling link status:", error);
      toast.error("Failed to update link status");
    }
  };

  const handleSetDefault = async (link) => {
    try {
      // First, unset all defaults for this site
      const siteLinks = links.filter(l => l.site_id === link.site_id);
      await Promise.all(
        siteLinks.map(l => 
          base44.entities.AffiliateLink.update(l.id, { is_default: false })
        )
      );
      
      // Then set this one as default
      await base44.entities.AffiliateLink.update(link.id, { is_default: true });
      toast.success("Default link updated");
      await loadData();
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to set default link");
    }
  };

  const resetForm = () => {
    setEditingLink(null);
    setFormData({
      site_id: "",
      link_name: "",
      affiliate_url: "",
      is_default: false,
      placement: "global",
      active: true,
      notes: "",
    });
  };

  const getSiteName = (siteId) => {
    const site = sites.find(s => s.id === siteId);
    return site?.name || "Unknown Site";
  };

  const filteredLinks = links.filter(link => {
    if (filterSite !== "all" && link.site_id !== filterSite) return false;
    if (filterPlacement !== "all" && link.placement !== filterPlacement) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-gray-400">You need admin privileges to manage affiliate links.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Affiliate Link Management</h1>
            <p className="text-gray-400">Manage affiliate links for all poker sites</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Affiliate Link
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-sm text-gray-400 mb-1">Total Links</div>
              <div className="text-3xl font-bold text-white">{links.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-sm text-gray-400 mb-1">Active Links</div>
              <div className="text-3xl font-bold text-green-400">
                {links.filter(l => l.active).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-sm text-gray-400 mb-1">Sites Covered</div>
              <div className="text-3xl font-bold text-cyan-400">
                {new Set(links.map(l => l.site_id)).size}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-sm text-gray-400 mb-1">Total Clicks</div>
              <div className="text-3xl font-bold text-purple-400">
                {links.reduce((sum, l) => sum + (l.click_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">Filter by Site</Label>
                <Select value={filterSite} onValueChange={setFilterSite}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Filter by Placement</Label>
                <Select value={filterPlacement} onValueChange={setFilterPlacement}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Placements</SelectItem>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="reviews">Reviews</SelectItem>
                    <SelectItem value="detail">Detail Page</SelectItem>
                    <SelectItem value="comparison">Comparison</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Affiliate Links ({filteredLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Site</TableHead>
                    <TableHead className="text-gray-400">Link Name</TableHead>
                    <TableHead className="text-gray-400">Placement</TableHead>
                    <TableHead className="text-gray-400">URL</TableHead>
                    <TableHead className="text-gray-400">Clicks</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map(link => (
                    <TableRow key={link.id} className="border-gray-800">
                      <TableCell className="text-white">
                        {getSiteName(link.site_id)}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          {link.link_name}
                          {link.is_default && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-300 border-gray-600 capitalize">
                          {link.placement}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm max-w-xs truncate">
                        {link.affiliate_url}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {link.click_count || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            link.active
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {link.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!link.is_default && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSetDefault(link)}
                              className="text-gray-400 hover:text-yellow-400"
                              title="Set as default"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(link)}
                            className={link.active ? "text-gray-400 hover:text-red-400" : "text-gray-400 hover:text-green-400"}
                            title={link.active ? "Deactivate" : "Activate"}
                          >
                            {link.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(link)}
                            className="text-gray-400 hover:text-cyan-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(link.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredLinks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No affiliate links found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Affiliate Link" : "Add Affiliate Link"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="link_name" className="text-gray-300">Link Name *</Label>
                <Input
                  id="link_name"
                  value={formData.link_name}
                  onChange={(e) => setFormData({ ...formData, link_name: e.target.value })}
                  placeholder="e.g., Homepage CTA, Review Page Button"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="affiliate_url" className="text-gray-300">Affiliate URL *</Label>
                <Input
                  id="affiliate_url"
                  type="url"
                  value={formData.affiliate_url}
                  onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                  placeholder="https://example.com/ref/yourcode"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Placement *</Label>
                <Select
                  value={formData.placement}
                  onValueChange={(value) => setFormData({ ...formData, placement: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (Default)</SelectItem>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="reviews">Reviews Page</SelectItem>
                    <SelectItem value="detail">Detail Page</SelectItem>
                    <SelectItem value="comparison">Comparison Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700"
                  />
                  <span className="text-gray-300">Set as default link for this site</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700"
                  />
                  <span className="text-gray-300">Active</span>
                </label>
              </div>

              <div>
                <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Internal notes about this link..."
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
              >
                {editingLink ? "Update Link" : "Create Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}