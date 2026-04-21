import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, CheckCircle, Clock, Archive, Plus, ExternalLink,
  TrendingUp, Users, DollarSign, AlertCircle, FileText, X, Target,
  BarChart2
} from "lucide-react";
import { toast } from "sonner";
import CustomDealRequestForm from "../components/agent/CustomDealRequestForm";
import OperatorComparisonMatrix from "../components/affiliate/OperatorComparisonMatrix";

export default function AgentDeals() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [myDeals, setMyDeals] = useState([]);
  const [operatorDeals, setOperatorDeals] = useState([]);
  const [selectedOperatorDeal, setSelectedOperatorDeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showCustomDealForm, setShowCustomDealForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      if (!currentUser.is_agent && currentUser.role !== 'admin') {
        toast.error("Access denied. Agent status required.");
        return;
      }

      const [allSites, userDeals, opDeals] = await Promise.all([
        db.entities.Site.list(),
        currentUser.agent_id ? db.entities.AgentDeal.list() : [],
        db.entities.OperatorDeal.filter({ is_active: true }),
      ]);

      setSites(allSites);
      const filteredDeals = userDeals.filter(d => d.agent_id === currentUser.agent_id);
      setMyDeals(filteredDeals);
      setOperatorDeals(opDeals);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load deals data");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForDeal = async (e) => {
    e.preventDefault();
    try {
      await db.entities.AgentDeal.create({
        agent_id: user.agent_id,
        site_id: selectedSite.id,
        commission_rate: 30, // Default rate, will be adjusted by admin
        status: 'pending',
        notes: `Application submitted by ${user.full_name}`
      });

      toast.success("Deal application submitted successfully!");
      setShowApplyDialog(false);
      setSelectedSite(null);
      await loadData();
    } catch (error) {
      console.error("Error applying for deal:", error);
      toast.error("Failed to submit application");
    }
  };

  const handleArchiveDeal = async (dealId) => {
    try {
      await db.entities.AgentDeal.update(dealId, {
        status: 'paused'
      });
      toast.success("Deal archived successfully");
      await loadData();
    } catch (error) {
      console.error("Error archiving deal:", error);
      toast.error("Failed to archive deal");
    }
  };

  const handleActivateDeal = async (dealId) => {
    try {
      await db.entities.AgentDeal.update(dealId, {
        status: 'approved'
      });
      toast.success("Deal reactivated successfully");
      await loadData();
    } catch (error) {
      console.error("Error activating deal:", error);
      toast.error("Failed to reactivate deal");
    }
  };

  const openDetailsDialog = (deal) => {
    setSelectedDeal(deal);
    setShowDetailsDialog(true);
  };

  const availableSites = sites.filter(site => {
    const alreadyHasDeal = myDeals.some(d => d.site_id === site.id && d.status !== 'rejected');
    return !alreadyHasDeal;
  });

  const filteredSites = availableSites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === "all" || site.type === filterType || site.type.includes(filterType))
  );

  const activeDeals = myDeals.filter(d => d.status === 'approved');
  const pendingDeals = myDeals.filter(d => d.status === 'pending');
  const archivedDeals = myDeals.filter(d => d.status === 'paused' || d.status === 'rejected');

  const statusColors = {
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    paused: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const DealCard = ({ deal, showActions = true }) => {
    const site = sites.find(s => s.id === deal.site_id);
    if (!site) return null;

    return (
      <Card className="glass-card-light hover:border-emerald-500/30 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {site.logo_url && (
                <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-2" />
              )}
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{site.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{site.type.replace(/_/g, ', ')}</p>
              </div>
            </div>
            <Badge className={statusColors[deal.status]}>
              {deal.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
              {deal.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
              {deal.status === 'paused' && <Archive className="w-3 h-3 mr-1" />}
              {deal.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-400 mb-1" />
              <div className="text-2xl font-bold text-white">{deal.commission_rate}%</div>
              <div className="text-xs text-gray-400">Commission Rate</div>
            </div>
            {deal.approved_date && (
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400 mb-1" />
                <div className="text-sm font-semibold text-white">{deal.approved_date}</div>
                <div className="text-xs text-gray-400">Approved Date</div>
              </div>
            )}
          </div>

          {site.bonus_offer && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
              <div className="text-xs font-semibold text-emerald-400 mb-1">CURRENT OFFER</div>
              <div className="text-sm text-white">{site.bonus_offer}</div>
            </div>
          )}

          {showActions && (
            <div className="flex gap-2">
              <Button
                onClick={() => openDetailsDialog(deal)}
                variant="outline"
                className="flex-1 border-slate-700 text-gray-300 hover:bg-slate-800"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Details
              </Button>
              {deal.status === 'approved' && (
                <Button
                  onClick={() => handleArchiveDeal(deal.id)}
                  variant="outline"
                  className="border-yellow-700 text-yellow-400 hover:bg-yellow-800/20"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              )}
              {deal.status === 'paused' && (
                <Button
                  onClick={() => handleActivateDeal(deal.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reactivate
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!user?.is_agent && user?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Agent Access Required</h1>
        <p className="text-gray-400">This page is only accessible to approved agents.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Deal Management</h1>
          <p className="text-gray-400">Manage your partnerships and apply for new deals</p>
        </div>
        <Button
          onClick={() => setShowCustomDealForm(true)}
          className="fire-gradient fire-glow"
        >
          <Target className="w-4 h-4 mr-2" />
          Request Custom Deal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{activeDeals.length}</div>
                <div className="text-sm text-gray-400">Active Deals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{pendingDeals.length}</div>
                <div className="text-sm text-gray-400">Pending Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Archive className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{archivedDeals.length}</div>
                <div className="text-sm text-gray-400">Archived</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="my-deals" className="space-y-6">
        <TabsList className="glass-card-light border-slate-700">
          <TabsTrigger value="my-deals">My Deals</TabsTrigger>
          <TabsTrigger value="compare">
            <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
            Compare Operators
          </TabsTrigger>
          <TabsTrigger value="apply">Apply for Deals</TabsTrigger>
        </TabsList>

        {/* My Deals Tab */}
        <TabsContent value="my-deals" className="space-y-6">
          <Tabs defaultValue="active">
            <TabsList className="glass-card-light border-slate-700 w-full">
              <TabsTrigger value="active" className="flex-1">
                Active ({activeDeals.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Pending ({pendingDeals.length})
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">
                Archived ({archivedDeals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid gap-6">
                {activeDeals.length > 0 ? (
                  activeDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
                ) : (
                  <Card className="glass-card-light">
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No active deals yet. Apply for deals to get started!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-6">
                {pendingDeals.length > 0 ? (
                  pendingDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
                ) : (
                  <Card className="glass-card-light">
                    <CardContent className="p-12 text-center">
                      <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No pending applications</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="archived" className="mt-6">
              <div className="grid gap-6">
                {archivedDeals.length > 0 ? (
                  archivedDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
                ) : (
                  <Card className="glass-card-light">
                    <CardContent className="p-12 text-center">
                      <Archive className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No archived deals</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Compare Operators Tab */}
        <TabsContent value="compare" className="space-y-6">
          <Card className="glass-card-light">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-lg font-semibold text-white">Operator Deal Comparison</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Compare all active operator deals side-by-side. Select a deal to apply.
                  </p>
                </div>
                {selectedOperatorDeal && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Selected:</span>
                    <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                      {selectedOperatorDeal.operator_name}
                    </Badge>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                      onClick={() => {
                        // Find corresponding site if linked
                        const linkedSite = sites.find(
                          (s) => s.id === selectedOperatorDeal.site_id
                        );
                        if (linkedSite) {
                          setSelectedSite(linkedSite);
                          setShowApplyDialog(true);
                        } else {
                          toast.info("Contact us to apply for this deal: " + selectedOperatorDeal.operator_name);
                        }
                      }}
                    >
                      Apply for This Deal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {operatorDeals.length === 0 ? (
            <Card className="glass-card-light">
              <CardContent className="p-12 text-center">
                <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No operator deals available at this time.</p>
              </CardContent>
            </Card>
          ) : (
            <OperatorComparisonMatrix
              deals={operatorDeals}
              selectedDealIds={selectedOperatorDeal ? [selectedOperatorDeal.id] : []}
              onSelectDeal={(deal) =>
                setSelectedOperatorDeal((prev) =>
                  prev?.id === deal.id ? null : deal
                )
              }
            />
          )}
        </TabsContent>

        {/* Apply for Deals Tab */}
        <TabsContent value="apply" className="space-y-6">
          {/* Filters */}
          <Card className="glass-card-light">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search sites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="poker">Poker</SelectItem>
                    <SelectItem value="casino">Casino</SelectItem>
                    <SelectItem value="sportsbetting">Sports Betting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Available Sites */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map(site => (
              <Card key={site.id} className="glass-card-light hover:border-emerald-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {site.logo_url && (
                      <img src={site.logo_url} alt={site.name} className="w-12 h-12 object-contain bg-white rounded p-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{site.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{site.type.replace(/_/g, ', ')}</p>
                    </div>
                  </div>

                  {site.bonus_offer && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 mb-4">
                      {site.bonus_offer}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white font-semibold">{site.rating}/5</span>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedSite(site);
                      setShowApplyDialog(true);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSites.length === 0 && (
            <Card className="glass-card-light">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No available sites found. Try adjusting your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="glass-card text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply for Deal</DialogTitle>
          </DialogHeader>
          
          {selectedSite && (
            <form onSubmit={handleApplyForDeal}>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  {selectedSite.logo_url && (
                    <img src={selectedSite.logo_url} alt={selectedSite.name} className="w-16 h-16 object-contain bg-white rounded p-2" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedSite.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{selectedSite.type.replace(/_/g, ', ')}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold mb-1">Application Process</p>
                      <p className="text-sm text-gray-300">
                        Your application will be reviewed by our team. Once approved, you'll receive a confirmation 
                        and the deal will be activated with the agreed commission rate.
                      </p>
                    </div>
                  </div>
                </div>

                {selectedSite.description && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-gray-300">{selectedSite.description}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowApplyDialog(false);
                    setSelectedSite(null);
                  }}
                  className="border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  Submit Application
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Deal Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="glass-card text-white border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Deal Details</DialogTitle>
          </DialogHeader>

          {selectedDeal && (() => {
            const site = sites.find(s => s.id === selectedDeal.site_id);
            return site ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  {site.logo_url && (
                    <img src={site.logo_url} alt={site.name} className="w-16 h-16 object-contain bg-white rounded p-2" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{site.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{site.type.replace(/_/g, ', ')}</p>
                  </div>
                  <Badge className={statusColors[selectedDeal.status]}>
                    {selectedDeal.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Commission Rate</div>
                    <div className="text-2xl font-bold text-green-400">{selectedDeal.commission_rate}%</div>
                  </div>
                  {selectedDeal.approved_date && (
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Approved Date</div>
                      <div className="text-lg font-semibold text-white">{selectedDeal.approved_date}</div>
                    </div>
                  )}
                </div>

                {site.bonus_offer && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="text-xs font-semibold text-emerald-400 mb-2">CURRENT OFFER</div>
                    <div className="text-white">{site.bonus_offer}</div>
                  </div>
                )}

                {site.description && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm font-semibold text-white mb-2">About</div>
                    <p className="text-sm text-gray-300">{site.description}</p>
                  </div>
                )}

                {site.highlights && site.highlights.length > 0 && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm font-semibold text-white mb-2">Highlights</div>
                    <ul className="space-y-2">
                      {site.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDeal.notes && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm font-semibold text-blue-400 mb-2">Admin Notes</div>
                    <p className="text-sm text-gray-300">{selectedDeal.notes}</p>
                  </div>
                )}
              </div>
            ) : null;
          })()}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDetailsDialog(false);
                setSelectedDeal(null);
              }}
              className="border-slate-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Deal Request Form */}
      <CustomDealRequestForm
        open={showCustomDealForm}
        onOpenChange={setShowCustomDealForm}
        agentId={user?.agent_id}
        sites={sites}
        onSuccess={loadData}
      />
    </div>
  );
}