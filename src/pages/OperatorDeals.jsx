import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  DollarSign,
  Percent,
  BarChart3,
  Copy,
  ExternalLink,
  Zap,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import OperatorComparisonMatrix from "../components/affiliate/OperatorComparisonMatrix";
import { ALL_DEALS, getDealValueLabel } from "@/data/affiliateDeals";

/**
 * Converts the canonical affiliateDeals.js format to the shape expected by
 * OperatorComparisonMatrix (snake_case DB column names).
 * This ensures the UI works identically whether data comes from Supabase or the local deal file.
 */
function normalizeDeal(deal) {
  return {
    id:                 deal.id,
    operator_name:      deal.name,
    operator_slug:      deal.slug,
    deal_type:          deal.dealType,
    revenue_share_pct:  deal.revenueSharePct ?? null,
    rakeback_pct:       deal.rakebackPct ?? null,
    cpa_amount:         deal.cpaAmount ?? null,
    hybrid_cpa_amount:  deal.dealType === "hybrid" ? deal.cpaAmount : null,
    hybrid_revshare_pct: deal.dealType === "hybrid" ? deal.revenueSharePct : null,
    sub_affiliate_pct:  deal.subAffiliatePct ?? 0,
    negative_carryover: deal.negativeCarryover ?? false,
    payment_frequency:  deal.paymentFrequency,
    min_payout:         deal.minPayoutUsd,
    payment_methods:    deal.paymentMethods ?? [],
    deal_notes:         deal.dealNotes ?? "",
    is_exclusive:       deal.isExclusive ?? false,
    is_active:          deal.isActive ?? true,
    _score:             deal.score ?? 0,
    // Extended fields used in deal cards
    welcome_bonus:      deal.welcomeBonus,
    bonus_code:         deal.bonusCode,
    tracking_url:       deal.trackingUrl,
    deal_status:        deal.dealStatus,
    category:           deal.category,
    rating:             deal.rating,
    tags:               deal.tags ?? [],
    is_featured:        deal.isFeatured ?? false,
    is_new:             deal.isNew ?? false,
  };
}

// Seed data — real deals negotiated by Affiliate Manager (DAR-80).
// This data is displayed when the Supabase operator_deals table is not yet seeded.
const SEED_DEALS = ALL_DEALS.map(normalizeDeal);

function StatCard({ icon: Icon, label, value, sub, color = "yellow" }) {
  const colorMap = {
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    green: "text-green-400 bg-green-400/10 border-green-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
            <Icon className={`w-4 h-4 ${colorMap[color].split(" ")[0]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-xs mb-0.5">{label}</p>
            <p className="text-white font-bold text-lg leading-tight">{value}</p>
            {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OperatorDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    document.title = "Operator Deals — Best Poker Rakeback & Casino Affiliate Deals | Elite Play";
  }, []);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await db.entities.OperatorDeal.filter({ is_active: true });
      if (!data || data.length === 0) {
        setDeals(SEED_DEALS);
        setUsingMock(true);
      } else {
        setDeals(data);
      }
    } catch {
      setDeals(SEED_DEALS);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDeal = (deal) => {
    setSelectedDeals((prev) =>
      prev.some((d) => d.id === deal.id)
        ? prev.filter((d) => d.id !== deal.id)
        : prev.length < 3
        ? [...prev, deal]
        : [prev[1], prev[2], deal]
    );
  };

  const copyAffiliateLink = (deal) => {
    // Use the real tracking URL if available, otherwise fall back to the Elite Play redirect
    const url = deal.tracking_url || `https://eliteplay.gg/go/${deal.operator_slug}?ref=agent&src=deals`;
    navigator.clipboard.writeText(url).then(() =>
      toast.success(`Link copied for ${deal.operator_name}`)
    );
  };

  // Summary stats
  const topRevShare = deals.reduce(
    (max, d) => Math.max(max, d.revenue_share_pct ?? d.hybrid_revshare_pct ?? 0),
    0
  );
  const topRakeback = deals.reduce((max, d) => Math.max(max, d.rakeback_pct ?? 0), 0);
  const topCpa = deals.reduce(
    (max, d) => Math.max(max, d.cpa_amount ?? d.hybrid_cpa_amount ?? 0),
    0
  );
  const weeklyPayCount = deals.filter((d) => d.payment_frequency === "weekly").length;

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen p-6">
        <Skeleton className="h-10 w-72 mb-6 bg-gray-800" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 bg-gray-800 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 bg-gray-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Operator Deal Matrix</h1>
              <p className="text-gray-400 text-sm">
                Compare affiliate commission structures across all operators
              </p>
            </div>
          </div>

          {usingMock && (
            <div className="flex items-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 w-fit">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              Showing seed data — connect Supabase to load live deals
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            icon={Percent}
            label="Top Rev Share"
            value={`${topRevShare}%`}
            sub="Best available rate"
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            label="Top Rakeback"
            value={`${topRakeback}%`}
            sub="Instant to players"
            color="green"
          />
          <StatCard
            icon={DollarSign}
            label="Best CPA"
            value={`$${topCpa}`}
            sub="Per qualifying player"
            color="blue"
          />
          <StatCard
            icon={Zap}
            label="Weekly Payouts"
            value={weeklyPayCount}
            sub={`of ${deals.length} operators`}
            color="purple"
          />
        </motion.div>

        {/* Selected deals summary */}
        {selectedDeals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <Card className="bg-yellow-400/5 border-yellow-400/20">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Selected Deals ({selectedDeals.length}/3)
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-3">
                  {selectedDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
                    >
                      <span className="text-white text-sm font-medium">{deal.operator_name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                        onClick={() => copyAffiliateLink(deal)}
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy Link
                      </Button>
                      <button
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                        onClick={() => handleSelectDeal(deal)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Comparison Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-0">
              <CardTitle className="text-white text-lg flex items-center justify-between">
                <span>All Operator Deals</span>
                <span className="text-gray-500 text-sm font-normal">
                  Click a row to expand details · Select up to 3 deals
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <OperatorComparisonMatrix
                deals={deals}
                onSelectDeal={handleSelectDeal}
                selectedDealIds={selectedDeals.map((d) => d.id)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
