import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MousePointer, DollarSign, Target } from "lucide-react";
import { format } from "date-fns";

export default function CampaignPerformance({ campaigns, assets }) {
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue_generated || 0), 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <MousePointer className="w-4 h-4 mr-2 text-blue-400" />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalClicks}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-400" />
              Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{totalConversions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{conversionRate}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-yellow-400" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns.map(campaign => {
                const asset = assets.find(a => a.id === campaign.asset_id);
                const campaignConversionRate = campaign.clicks > 0 
                  ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) 
                  : 0;

                return (
                  <div key={campaign.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{campaign.campaign_name}</h3>
                        {asset && (
                          <p className="text-sm text-gray-400">Using: {asset.asset_name}</p>
                        )}
                      </div>
                      <Badge className={
                        campaign.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Platform:</span>
                        <span className="text-white ml-2 capitalize">{campaign.platform}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Clicks:</span>
                        <span className="text-blue-400 ml-2 font-semibold">{campaign.clicks}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Conversions:</span>
                        <span className="text-green-400 ml-2 font-semibold">{campaign.conversions}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rate:</span>
                        <span className="text-purple-400 ml-2 font-semibold">{campaignConversionRate}%</span>
                      </div>
                    </div>

                    {campaign.start_date && (
                      <div className="mt-2 text-xs text-gray-500">
                        Started: {format(new Date(campaign.start_date), 'MMM dd, yyyy')}
                        {campaign.end_date && ` • Ended: ${format(new Date(campaign.end_date), 'MMM dd, yyyy')}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No campaigns tracked yet</p>
              <p className="text-xs mt-1">Start using marketing assets and track your performance</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}