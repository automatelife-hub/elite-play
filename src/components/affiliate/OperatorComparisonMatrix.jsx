import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpDown,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  Shield,
  Star,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const DEAL_TYPE_LABELS = {
  revenue_share: "Rev Share",
  cpa: "CPA",
  hybrid: "Hybrid",
  rakeback: "Rakeback",
  flat: "Flat Fee",
};

const DEAL_TYPE_COLORS = {
  revenue_share: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  cpa: "bg-green-500/20 text-green-300 border-green-500/30",
  hybrid: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  rakeback: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  flat: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const PAYMENT_FREQ_LABELS = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
};

function MetricCell({ value, suffix = "", highlight = false, empty = "-" }) {
  if (value == null) return <span className="text-gray-600 text-sm">{empty}</span>;
  return (
    <span className={`font-semibold text-sm ${highlight ? "text-yellow-400" : "text-white"}`}>
      {value}{suffix}
    </span>
  );
}

function BoolCell({ value }) {
  return value ? (
    <Check className="w-4 h-4 text-green-400 mx-auto" />
  ) : (
    <X className="w-4 h-4 text-red-400 mx-auto" />
  );
}

function ScoreBar({ score, max = 100 }) {
  const pct = Math.min((score / max) * 100, 100);
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-800 rounded-full h-1.5">
        <motion.div
          className={`${color} h-1.5 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{Math.round(score)}</span>
    </div>
  );
}

function computeScore(deal) {
  let score = 0;
  // RevShare (max 30 pts)
  if (deal.revenue_share_pct) score += Math.min(deal.revenue_share_pct, 40) * 0.75;
  // Rakeback (max 25 pts)
  if (deal.rakeback_pct) score += Math.min(deal.rakeback_pct, 35) * 0.7;
  // No negative carryover (15 pts)
  if (!deal.negative_carryover) score += 15;
  // Payment frequency (10 pts)
  if (deal.payment_frequency === "weekly") score += 10;
  else if (deal.payment_frequency === "biweekly") score += 6;
  else score += 2;
  // Sub-affiliate (5 pts)
  if (deal.sub_affiliate_pct) score += Math.min(deal.sub_affiliate_pct, 5) * 1;
  // Exclusive (5 pts)
  if (deal.is_exclusive) score += 5;
  return Math.min(score, 100);
}

const SORT_OPTIONS = [
  { key: "score", label: "Best Deal" },
  { key: "revenue_share_pct", label: "Rev Share %" },
  { key: "rakeback_pct", label: "Rakeback %" },
  { key: "cpa_amount", label: "CPA Amount" },
  { key: "payment_frequency", label: "Payment Speed" },
];

export default function OperatorComparisonMatrix({ deals = [], onSelectDeal, selectedDealIds = [] }) {
  const [sortKey, setSortKey] = useState("score");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const dealsWithScores = useMemo(
    () => deals.map((d) => ({ ...d, _score: computeScore(d) })),
    [deals]
  );

  const filtered = useMemo(
    () =>
      filterType === "all"
        ? dealsWithScores
        : dealsWithScores.filter((d) => d.deal_type === filterType),
    [dealsWithScores, filterType]
  );

  const sorted = useMemo(() => {
    const freqOrder = { weekly: 0, biweekly: 1, monthly: 2 };
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (sortKey === "score") { av = a._score; bv = b._score; }
      else if (sortKey === "payment_frequency") {
        av = freqOrder[a.payment_frequency] ?? 3;
        bv = freqOrder[b.payment_frequency] ?? 3;
      } else {
        av = a[sortKey] ?? -1;
        bv = b[sortKey] ?? -1;
      }
      return sortAsc ? av - bv : bv - av;
    });
  }, [filtered, sortKey, sortAsc]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const dealTypes = ["all", ...new Set(deals.map((d) => d.deal_type))];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {dealTypes.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  filterType === t
                    ? "bg-yellow-400 text-gray-900 border-yellow-400"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {t === "all" ? "All Deals" : DEAL_TYPE_LABELS[t] ?? t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500">Sort:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => toggleSort(opt.key)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
                  sortKey === opt.key
                    ? "border-yellow-400/50 text-yellow-400"
                    : "border-gray-700 text-gray-500 hover:border-gray-500"
                }`}
              >
                {opt.label}
                {sortKey === opt.key && (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No deals match this filter.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium min-w-[160px]">Operator</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Deal Type</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 ml-auto cursor-help">
                        Rev Share <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>% of net revenue shared with affiliate</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 ml-auto cursor-help">
                        Rakeback <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>% of rake returned to players directly</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-right">CPA</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-center">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 mx-auto cursor-help">
                        Neg. Carryover <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>Whether negative balance carries to next period (bad for affiliates)</TooltipContent>
                    </Tooltip>
                  </th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-center">Payment</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-center">Sub-Aff %</th>
                  <th className="px-4 py-3 text-gray-400 font-medium min-w-[130px]">Deal Score</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {sorted.map((deal, idx) => {
                    const isSelected = selectedDealIds.includes(deal.id);
                    const isExpanded = expandedId === deal.id;
                    const isTop = idx === 0;

                    return (
                      <React.Fragment key={deal.id}>
                        <motion.tr
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`border-b border-gray-800/60 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-yellow-400/5"
                              : isTop
                              ? "bg-green-900/10"
                              : "hover:bg-gray-800/40"
                          }`}
                          onClick={() => setExpandedId(isExpanded ? null : deal.id)}
                        >
                          {/* Operator */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isTop && (
                                <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-semibold text-white flex items-center gap-1">
                                  {deal.operator_name}
                                  {deal.is_exclusive && (
                                    <Badge className="text-[10px] px-1 py-0 bg-purple-500/20 text-purple-300 border-purple-500/30 ml-1">
                                      EXCL
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Deal Type */}
                          <td className="px-4 py-3">
                            <Badge
                              className={`text-xs border ${
                                DEAL_TYPE_COLORS[deal.deal_type] ?? "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {DEAL_TYPE_LABELS[deal.deal_type] ?? deal.deal_type}
                            </Badge>
                          </td>

                          {/* Rev Share */}
                          <td className="px-4 py-3 text-right">
                            <MetricCell
                              value={deal.revenue_share_pct ?? deal.hybrid_revshare_pct}
                              suffix="%"
                              highlight={(deal.revenue_share_pct ?? deal.hybrid_revshare_pct) >= 35}
                            />
                          </td>

                          {/* Rakeback */}
                          <td className="px-4 py-3 text-right">
                            <MetricCell
                              value={deal.rakeback_pct}
                              suffix="%"
                              highlight={deal.rakeback_pct >= 30}
                            />
                          </td>

                          {/* CPA */}
                          <td className="px-4 py-3 text-right">
                            <MetricCell
                              value={deal.cpa_amount ?? deal.hybrid_cpa_amount}
                              suffix=""
                              highlight={(deal.cpa_amount ?? deal.hybrid_cpa_amount) >= 150}
                            >
                              {(deal.cpa_amount || deal.hybrid_cpa_amount) && (
                                <span className="text-gray-400 text-xs mr-0.5">$</span>
                              )}
                            </MetricCell>
                            {(deal.cpa_amount ?? deal.hybrid_cpa_amount) != null && (
                              <span className="text-white font-semibold text-sm">
                                ${deal.cpa_amount ?? deal.hybrid_cpa_amount}
                              </span>
                            )}
                            {!(deal.cpa_amount ?? deal.hybrid_cpa_amount) && (
                              <span className="text-gray-600 text-sm">—</span>
                            )}
                          </td>

                          {/* Negative Carryover */}
                          <td className="px-4 py-3 text-center">
                            <BoolCell value={!deal.negative_carryover} />
                          </td>

                          {/* Payment Frequency */}
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`text-xs font-medium ${
                                deal.payment_frequency === "weekly"
                                  ? "text-green-400"
                                  : deal.payment_frequency === "biweekly"
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {PAYMENT_FREQ_LABELS[deal.payment_frequency] ?? deal.payment_frequency}
                            </span>
                          </td>

                          {/* Sub-Affiliate */}
                          <td className="px-4 py-3 text-center">
                            <MetricCell value={deal.sub_affiliate_pct} suffix="%" />
                          </td>

                          {/* Score */}
                          <td className="px-4 py-3">
                            <ScoreBar score={deal._score} />
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {onSelectDeal && (
                                <Button
                                  size="sm"
                                  variant={isSelected ? "outline" : "default"}
                                  className={`h-7 px-3 text-xs ${
                                    isSelected
                                      ? "border-yellow-400/50 text-yellow-400"
                                      : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectDeal(deal);
                                  }}
                                >
                                  {isSelected ? "Selected" : "Select"}
                                </Button>
                              )}
                              <button
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(isExpanded ? null : deal.id);
                                }}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </motion.tr>

                        {/* Expanded detail row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              key={`${deal.id}-detail`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <td colSpan={10} className="bg-gray-900/80 px-6 py-4 border-b border-gray-800">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {deal.deal_notes && (
                                    <div className="col-span-2 md:col-span-4">
                                      <p className="text-gray-400 text-xs mb-1">Deal Notes</p>
                                      <p className="text-gray-200">{deal.deal_notes}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-gray-500 text-xs mb-1">Min Payout</p>
                                    <p className="text-white">${deal.min_payout ?? 100}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs mb-1">Payment Methods</p>
                                    <p className="text-white capitalize">
                                      {(deal.payment_methods ?? []).join(", ") || "—"}
                                    </p>
                                  </div>
                                  {deal.cpa_min_deposit && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">CPA Min Deposit</p>
                                      <p className="text-white">${deal.cpa_min_deposit}</p>
                                    </div>
                                  )}
                                  {deal.geo_restrictions?.length > 0 && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Geo Restrictions</p>
                                      <p className="text-red-400 text-xs">{deal.geo_restrictions.join(", ")}</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" /> Top-rated deal
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-green-400" /> No negative carryover = good
          </span>
          <span className="text-yellow-400 font-medium">Yellow values</span>
          <span>= above-average rates</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
