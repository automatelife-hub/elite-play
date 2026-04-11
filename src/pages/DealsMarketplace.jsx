import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ExternalLink,
  Star,
  Zap,
  Clock,
  Globe,
  ChevronRight,
  RefreshCw,
  Filter,
  TrendingUp,
} from "lucide-react";
import {
  ALL_DEALS,
  getDealValueLabel,
  DEAL_STATUS_COLORS,
  buildDealTrackingUrl,
} from "@/data/affiliateDeals";

// ─── Region config ────────────────────────────────────────────────────────────

const REGIONS = [
  { id: "global",  label: "Global",           flag: "🌍" },
  { id: "GB",      label: "United Kingdom",    flag: "🇬🇧" },
  { id: "EU",      label: "European Union",    flag: "🇪🇺" },
  { id: "US",      label: "United States",     flag: "🇺🇸" },
  { id: "CA",      label: "Canada",            flag: "🇨🇦" },
  { id: "LATAM",   label: "Brazil & LATAM",    flag: "🇧🇷" },
];

const VERTICALS = [
  { id: "all",    label: "All",    count: ALL_DEALS.length },
  { id: "casino", label: "Casino", count: ALL_DEALS.filter((d) => d.category === "casino").length },
  { id: "poker",  label: "Poker",  count: ALL_DEALS.filter((d) => d.category === "poker").length },
  { id: "sports", label: "Sports", count: ALL_DEALS.filter((d) => d.category === "sports").length },
];

const PAGE_SIZE = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dealMatchesRegion(deal, selectedRegions) {
  if (selectedRegions.length === 0) return true;
  const dealRegions = deal.regions ?? ["global"];
  return selectedRegions.some(
    (r) =>
      r === "global" ||
      dealRegions.includes("global") ||
      dealRegions.includes(r)
  );
}

function getRegionFlags(regions) {
  if (!regions || regions.includes("global")) return [{ flag: "🌍", label: "Global" }];
  return regions
    .map((r) => REGIONS.find((reg) => reg.id === r))
    .filter(Boolean)
    .slice(0, 3);
}

function getDealTypeLabel(deal) {
  if (deal.dealType === "revenue_share") return `${deal.revenueSharePct}% RevShare`;
  if (deal.dealType === "cpa") return `$${deal.cpaAmount} CPA`;
  if (deal.dealType === "rakeback") return `${deal.rakebackPct}% Rakeback`;
  if (deal.dealType === "hybrid") return deal.hybridNote ?? "Hybrid";
  return "Custom";
}

function getCommissionColor(deal) {
  const pct =
    deal.revenueSharePct ?? deal.rakebackPct ?? (deal.cpaAmount ? 0 : 0);
  if (deal.dealType === "cpa") return "text-blue-400";
  if (pct >= 40) return "text-green-400";
  if (pct >= 30) return "text-purple-400";
  return "text-yellow-400";
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

function DealCard({ deal, index }) {
  const statusColors = DEAL_STATUS_COLORS[deal.dealStatus] ?? DEAL_STATUS_COLORS.inactive;
  const regionFlags = getRegionFlags(deal.regions);
  const commissionLabel = getDealTypeLabel(deal);
  const commissionColor = getCommissionColor(deal);
  const trackingUrl = buildDealTrackingUrl(deal.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="relative bg-[#12102A] border border-[#2A2558] rounded-xl overflow-hidden
                 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-200"
    >
      {/* Status badge */}
      {(deal.isNew || deal.dealStatus === "active") && (
        <div className="absolute top-3 right-3 z-10">
          {deal.isNew ? (
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold uppercase tracking-wide">
              New
            </Badge>
          ) : deal.dealStatus === "active" ? (
            <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] font-semibold uppercase tracking-wide">
              Live
            </Badge>
          ) : null}
        </div>
      )}

      <div className="p-5">
        {/* Header: logo + name + regions */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: deal.logoColor + "22", color: deal.logoColor, border: `1px solid ${deal.logoColor}44` }}
          >
            {deal.logoFallback}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-semibold text-sm leading-tight">{deal.name}</span>
              {regionFlags.map((r) => (
                <span key={r.label} title={r.label} className="text-base leading-none">{r.flag}</span>
              ))}
              {deal.isFeatured && (
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                {deal.dealStatus}
              </span>
              <span className="text-gray-500 text-[10px]">{deal.category}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2.5 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">Welcome Bonus</span>
            <span className="text-white text-xs font-medium text-right max-w-[60%] leading-tight">
              {deal.welcomeBonusShort ?? deal.welcomeBonus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">Commission</span>
            <span className={`text-xs font-bold ${commissionColor}`}>
              {commissionLabel}
            </span>
          </div>
          {deal.rakeback && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Rakeback</span>
              <span className="text-purple-300 text-xs font-medium text-right max-w-[60%] leading-tight truncate">
                {deal.rakeback}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">Payment</span>
            <span className="text-gray-300 text-xs">
              {deal.paymentFrequency}
              {deal.minPayoutUsd ? ` · min $${deal.minPayoutUsd}` : ""}
            </span>
          </div>
        </div>

        {/* Rating */}
        {deal.rating && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(deal.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < deal.rating
                    ? "text-yellow-400/60 fill-yellow-400/60"
                    : "text-gray-700"
                }`}
              />
            ))}
            <span className="text-gray-400 text-[11px] ml-1">{deal.rating}</span>
            <span className="text-gray-600 text-[11px]">· Score {deal.score}</span>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs border-[#2A2558] text-gray-300 hover:border-purple-500/60 hover:text-white bg-transparent"
            onClick={() => {/* navigate to review page */}}
          >
            Review
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold"
            onClick={() => window.open(trackingUrl, "_blank", "noopener,noreferrer")}
          >
            Sign Up
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsMarketplace() {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Count new deals added in last 7 days (simulated from deals with startDate)
  const newTodayCount = useMemo(
    () => ALL_DEALS.filter((d) => d.isNew || d.dealStatus === "active").length,
    []
  );

  const filteredDeals = useMemo(() => {
    let deals = ALL_DEALS.filter((d) => d.isActive);
    if (selectedVertical !== "all") {
      deals = deals.filter((d) => d.category === selectedVertical);
    }
    if (selectedRegions.length > 0) {
      deals = deals.filter((d) => dealMatchesRegion(d, selectedRegions));
    }
    // Featured first, then by score
    return deals.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.score ?? 0) - (a.score ?? 0);
    });
  }, [selectedVertical, selectedRegions]);

  const visibleDeals = filteredDeals.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDeals.length;

  function toggleRegion(regionId) {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    );
    setVisibleCount(PAGE_SIZE);
  }

  function handleVerticalChange(id) {
    setSelectedVertical(id);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest">
              {newTodayCount} NEW OFFERS TODAY
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Engaging Geo-Targeted Partner Offers
          </h1>
          <p className="text-gray-400 text-sm">
            Direct affiliate deals with premium brands. Filter by location and reward structure.
          </p>
        </div>

        <div className="flex gap-6">
          {/* ── Sidebar ── */}
          <aside className="w-52 shrink-0 space-y-6">
            {/* Region filter */}
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Target Region
              </p>
              <div className="space-y-2">
                {REGIONS.map((region) => (
                  <label
                    key={region.id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedRegions.includes(region.id)}
                      onCheckedChange={() => toggleRegion(region.id)}
                      className="border-[#2A2558] data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <span className="text-base leading-none">{region.flag}</span>
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      {region.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vertical filter */}
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Verticals
              </p>
              <div className="space-y-1">
                {VERTICALS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVerticalChange(v.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedVertical === v.id
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{v.label}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] h-4 px-1.5 ${
                        selectedVertical === v.id
                          ? "bg-purple-500/30 text-purple-300"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {v.id === "all" ? filteredDeals.length : ALL_DEALS.filter((d) => d.category === v.id && d.isActive).length}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(selectedRegions.length > 0 || selectedVertical !== "all") && (
              <button
                onClick={() => {
                  setSelectedRegions([]);
                  setSelectedVertical("all");
                  setVisibleCount(PAGE_SIZE);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Vertical tabs (top) */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {VERTICALS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVerticalChange(v.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedVertical === v.id
                      ? "bg-purple-600 text-white"
                      : "bg-[#12102A] text-gray-400 hover:text-white border border-[#2A2558] hover:border-purple-500/40"
                  }`}
                >
                  {v.label}
                  {v.id !== "all" && (
                    <span className="ml-1.5 text-[11px] opacity-70">{v.count}</span>
                  )}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-1.5 text-gray-500 text-xs">
                <Filter className="w-3.5 h-3.5" />
                {filteredDeals.length} deals
                {selectedRegions.length > 0 && (
                  <span className="text-purple-400">
                    · {selectedRegions.map((r) => REGIONS.find((x) => x.id === r)?.flag).join("")}
                  </span>
                )}
              </div>
            </div>

            {/* Deal grid */}
            {visibleDeals.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No deals match your current filters.</p>
                <button
                  onClick={() => { setSelectedRegions([]); setSelectedVertical("all"); }}
                  className="mt-2 text-purple-400 text-xs hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {visibleDeals.map((deal, i) => (
                    <DealCard key={deal.id} deal={deal} index={i} />
                  ))}
                </div>
              </AnimatePresence>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  className="border-[#2A2558] text-gray-300 hover:border-purple-500/60 hover:text-white bg-transparent px-8"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Load More Premium Offers
                </Button>
                <p className="text-gray-600 text-xs mt-2">
                  Showing {visibleDeals.length} of {filteredDeals.length} total deals
                </p>
              </div>
            )}

            {!hasMore && filteredDeals.length > 0 && (
              <p className="text-center text-gray-600 text-xs mt-6">
                Showing all {filteredDeals.length} deals
                {selectedRegions.length > 0 || selectedVertical !== "all" ? " matching your filters" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
