import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Archive, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

export default function DealsOverview({ agentDeals, sites, referralLinks }) {
  const [copiedLink, setCopiedLink] = useState(null);

  const activeDeals = agentDeals.filter(d => d.status === 'approved');
  const pendingDeals = agentDeals.filter(d => d.status === 'pending');
  const archivedDeals = agentDeals.filter(d => d.status === 'paused' || d.status === 'rejected');

  const getLinksForDeal = (siteId) => {
    return referralLinks.filter(l => l.site_id === siteId && l.active);
  };

  const getArchivedLinks = (siteId) => {
    return referralLinks.filter(l => l.site_id === siteId && !l.active);
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link.custom_url || link.referral_code);
    setCopiedLink(link.id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const DealCard = ({ deal, showArchived = false }) => {
    const site = sites.find(s => s.id === deal.site_id);
    const links = showArchived ? getArchivedLinks(deal.site_id) : getLinksForDeal(deal.site_id);

    return (
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {site?.logo_url && (
              <img src={site.logo_url} alt={site.name} className="w-12 h-12 object-contain bg-white rounded p-1" />
            )}
            <div>
              <h4 className="font-semibold text-white">{site?.name || 'Unknown Site'}</h4>
              <p className="text-xs text-gray-400">{site?.type}</p>
            </div>
          </div>
          <Badge className={
            deal.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            deal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
            deal.status === 'paused' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
            'bg-red-500/20 text-red-400 border-red-500/30'
          }>
            {deal.status === 'approved' ? <CheckCircle className="w-3 h-3 mr-1" /> :
             deal.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> :
             deal.status === 'paused' ? <Archive className="w-3 h-3 mr-1" /> :
             <XCircle className="w-3 h-3 mr-1" />}
            {deal.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm">
          <div>
            <span className="text-gray-400">Commission:</span>
            <span className="text-green-400 font-semibold ml-2">{deal.commission_rate}%</span>
          </div>
          {deal.approved_date && (
            <div>
              <span className="text-gray-400">Approved:</span>
              <span className="text-white ml-2">{deal.approved_date}</span>
            </div>
          )}
        </div>

        {/* Links */}
        {links.length > 0 && (
          <div className="space-y-2 mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-400 mb-2">
              {showArchived ? 'Archived Links' : 'Active Links'}:
            </div>
            {links.map(link => (
              <div key={link.id} className="flex items-center gap-2 p-2 bg-slate-900/50 rounded text-sm">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{link.referral_code}</div>
                  <div className="text-xs text-gray-500">
                    {link.clicks || 0} clicks • {link.conversions || 0} conversions
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyLink(link)}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedLink === link.id ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {deal.notes && (
          <div className="mt-3 p-2 bg-slate-900/50 rounded text-xs text-gray-400">
            <span className="font-semibold">Note:</span> {deal.notes}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Your Deals & Links</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {activeDeals.length} Active
            </Badge>
            {pendingDeals.length > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {pendingDeals.length} Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="bg-slate-800/50 border-slate-700 w-full">
            <TabsTrigger value="active" className="flex-1">
              Active Deals ({activeDeals.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending ({pendingDeals.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">
              Archived ({archivedDeals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeDeals.length > 0 ? (
              activeDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active deals yet. Contact support to get started!
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {pendingDeals.length > 0 ? (
              pendingDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No pending deals
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived" className="mt-6 space-y-4">
            {archivedDeals.length > 0 ? (
              archivedDeals.map(deal => <DealCard key={deal.id} deal={deal} showArchived={true} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No archived deals
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}