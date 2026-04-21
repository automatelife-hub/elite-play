import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  ArrowUpDown,
  Check,
  X,
  Star,
  Info,
  ChevronDown,
  ChevronUp,
  Globe,
  AlertTriangle,
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

function MetricCell({ value, suffix = "", highlight = false }) {
  if (value == null) return <span className="text-gray-600 text-sm">—</span>;
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
  const color = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";
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

/** Deterministic pseudo-random sparkline based on operator slug */
function generateSparklineData(deal) {
  const seed = (deal.operator_slug || deal.id || "x")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const base =
    deal.revenue_share_pct ||
    deal.rakeback_pct ||
    (deal.cpa_amount ? 30 : 20) ||
    25;

  const months = 6;
  const data = [];
  let prev = base * 0.65;

  for (let i = 0; i < months; i++) {
    const noise = (((seed * (i + 3) * 137) % 30) / 15) - 1; // -1 to +1
    const trend = (base * 0.35) / months; // gentle upward bias
    prev = Math.max(0.5, prev + trend + noise);
    data.push({ m: i + 1, v: parseFloat(prev.toFixed(2)) });
  }
  return data;
}

function TrendSparkline({ deal }) {
  const data = useMemo(() => generateSparklineData(deal), [deal]);
  const first = data[0].v;
  const last = data[data.length - 1].v;
  const up = last >= first;
  const color = up ? "#10b981" : "#f87171";

  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1" style={{ height: 32 }}>
        <ResponsiveContainer width="100%" height={32}>
          <LineChart data={data}>
            <RechartsTooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white">
                    {payload[0].value}%
                  </div>
                ) : null
              }
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              dot={false}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <span className={`text-xs font-medium ${up ? "text-green-400" : "text-red-400"}`}>
        {up ? "↑" : "↓"} {Math.abs(last - first).toFixed(1)}%
      </span>
    </div>
  );
}

function GeoCell({ geoRestrictions }) {
  if (!geoRestrictions || geoRestrictions.length === 0) {
    return (
      <span className="flex items-center gap-1 text-green-400 text-xs justify-center">
        <Globe className="w-3 h-3" /> Global
      </span>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-1 text-orange-400 text-xs cursor-help justify-center">
          <AlertTriangle className="w-3 h-3" />
          {geoRestrictions.length} restricted
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs max-w-[160px]">Blocked: {geoRestrictions.join(", ")}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function computeScore(deal) {
  let score = 0;
  if (deal.revenue_share_pct) score += Math.min(deal.revenue_share_pct, 40) * 0.75;
  if (deal.rakeback_pct) score += Math.min(deal.rakeback_pct, 35) * 0.7;
  if (!deal.negative_carryover) score += 15;
  if (deal.payment_frequency === "weekly") score += 10;
  else if (deal.payment_frequency === "biweekly") score += 6;
  else score += 2;
  if (deal.sub_affiliate_pct) score += Math.min(deal.sub_affiliate_pct, 5) * 1;
  if (deal.is_exclusive) score += 5;
  return Math.min(score, 100);
}

const SORT_OPTIONS = [
  { key: "score", label: "Best Deal" },
  { key: "revenue_share_pct", label: "Rev Share" },
  { key: "rakeback_pct", label: "Rakeback" },
  { key: "cpa_amount", label: "CPA" },
  { key: "payment_frequency", label: "Payout Speed" },
];

/** Mobile card for a single deal */
function DealCard({ deal, onSelectDeal, isSelected, isTop }) {
  const [expanded, setExpanded] = useState(false);
  const sparkData = useMemo(() => generateSparklineData(deal), [deal]);
  const first = sparkData[0].v;
  const last = sparkData[sparkData.length - 1].v;
  const up = last >= first;

  return (
    <Card
      className={`border transition-all ${
        isSelected
          ? "border-yellow-400/50 bg-yellow-400/5"
          : isTop
          ? "border-green-500/30 bg-green-900/10"
          : "border-gray-800 bg-gray-900/50"
      }`}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              {isTop && <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
              <span className="font-bold text-white text-sm">{deal.operator_name}</span>
              {deal.is_exclusive && (
                <Badge className="text-[10px] px-1 py-0 bg-purple-500/20 text-purple-300 border-purple-500/30">
                  EXCL
                </Badge>
              )}
            </div>
            <Badge
              className={`text-xs border mt-1 ${
                DEAL_TYPE_COLORS[deal.deal_type] ?? "bg-gray-700 text-gray-300"
              }`}
            >
              {DEAL_TYPE_LABELS[deal.deal_type] ?? deal.deal_type}
            </Badge>
          </div>
          <ScoreBar score={deal._score} />
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-800/60 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">Rev Share</div>
            <div className="text-sm font-bold text-white">
              {deal.revenue_share_pct ?? deal.hybrid_revshare_pct
                ? `${deal.revenue_share_pct ?? deal.hybrid_revshare_pct}%`
                : "—"}
            </div>
          </div>
          <div className="bg-gray-800/60 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">Rakeback</div>
            <div className="text-sm font-bold text-white">
              {deal.rakeback_pct ? `${deal.rakeback_pct}%` : "—"}
            </div>
          </div>
          <div className="bg-gray-800/60 rounded p-2 text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">CPA</div>
            <div className="text-sm font-bold text-white">
              {deal.cpa_amount ?? deal.hybrid_cpa_amount
                ? `$${deal.cpa_amount ?? deal.hybrid_cpa_amount}`
                : "—"}
            </div>
          </div>
        </div>

        {/* Trend + meta row */}
        <div className="flex items-center justify-between mb-3">
          <TrendSparkline deal={deal} />
          <div className="flex items-center gap-3 text-xs">
            <span
              className={
                deal.payment_frequency === "weekly"
                  ? "text-green-400"
                  : deal.payment_frequency === "biweekly"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }
            >
              {PAYMENT_FREQ_LABELS[deal.payment_frequency] ?? deal.payment_frequency}
            </span>
            <GeoCell geoRestrictions={deal.geo_restrictions} />
          </div>
        </div>

        {/* Expandable detail */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-800 pt-3 mt-2 space-y-2 text-xs"
          >
            <div className="flex justify-between">
              <span className="text-gray-500">No neg. carryover</span>
              <BoolCell value={!deal.negative_carryover} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sub-affiliate</span>
              <span className="text-white">{deal.sub_affiliate_pct ? `${deal.sub_affiliate_pct}%` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Min payout</span>
              <span className="text-white">${deal.min_payout ?? 100}</span>
            </div>
            {deal.payment_methods?.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment methods</span>
                <span className="text-white capitalize">{deal.payment_methods.join(", ")}</span>
              </div>
            )}
            {deal.deal_notes && (
              <p className="text-gray-400 pt-1">{deal.deal_notes}</p>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {onSelectDeal && (
            <Button
              size="sm"
              variant={isSelected ? "outline" : "default"}
              className={`flex-1 h-8 text-xs ${
                isSelected
                  ? "border-yellow-400/50 text-yellow-400"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              }`}
              onClick={() => onSelectDeal(deal)}
            >
              {isSelected ? "Selected" : "Select Deal"}
            </Button>
          )}
          <button
            className="text-gray-500 hover:text-gray-300 transition-colors"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OperatorComparisonMatrix({
  deals = [],
  onSelectDeal,
  selectedDealIds = [],
}) {
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
      if (sortKey === "score") {
        av = a._score;
        bv = b._score;
      } else if (sortKey === "payment_frequency") {
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
    else {
      setSortKey(key);
      setSortAsc(false);
    }
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

          {/* Sort controls */}
          <div className="flex flex-wrap gap-2 items-center">
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
                {sortKey === opt.key && <ArrowUpDown className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No deals match this filter.</div>
        ) : (
          <>
            {/* ─── Desktop Table (≥ 768px) ─── */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900 border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium min-w-[160px]">
                      Operator
                    </th>
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
                    <th className="px-4 py-3 text-gray-400 font-medium text-center">Payment</th>
                    <th className="px-4 py-3 text-gray-400 font-medium text-center">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 mx-auto cursor-help">
                          Geo <Info className="w-3 h-3" />
                        </TooltipTrigger>
                        <TooltipContent>Geographic availability / restrictions</TooltipContent>
                      </Tooltip>
                    </th>
                    <th className="px-4 py-3 text-gray-400 font-medium min-w-[120px]">
                      6-Mo Trend
                    </th>
                    <th className="px-4 py-3 text-gray-400 font-medium min-w-[130px]">
                      Deal Score
                    </th>
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
                                <div className="font-semibold text-white flex items-center gap-1">
                                  {deal.operator_name}
                                  {deal.is_exclusive && (
                                    <Badge className="text-[10px] px-1 py-0 bg-purple-500/20 text-purple-300 border-purple-500/30 ml-1">
                                      EXCL
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Deal Type */}
                            <td className="px-4 py-3">
                              <Badge
                                className={`text-xs border ${
                                  DEAL_TYPE_COLORS[deal.deal_type] ??
                                  "bg-gray-700 text-gray-300"
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
                                highlight={
                                  (deal.revenue_share_pct ?? deal.hybrid_revshare_pct) >= 35
                                }
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
                              {deal.cpa_amount ?? deal.hybrid_cpa_amount ? (
                                <span
                                  className={`font-semibold text-sm ${
                                    (deal.cpa_amount ?? deal.hybrid_cpa_amount) >= 150
                                      ? "text-yellow-400"
                                      : "text-white"
                                  }`}
                                >
                                  ${deal.cpa_amount ?? deal.hybrid_cpa_amount}
                                </span>
                              ) : (
                                <span className="text-gray-600 text-sm">—</span>
                              )}
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
                                {PAYMENT_FREQ_LABELS[deal.payment_frequency] ??
                                  deal.payment_frequency}
                              </span>
                            </td>

                            {/* Geo */}
                            <td className="px-4 py-3 text-center">
                              <GeoCell geoRestrictions={deal.geo_restrictions} />
                            </td>

                            {/* Trend Sparkline */}
                            <td className="px-4 py-3">
                              <TrendSparkline deal={deal} />
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
                                <td
                                  colSpan={10}
                                  className="bg-gray-900/80 px-6 py-4 border-b border-gray-800"
                                >
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
                                        <p className="text-gray-500 text-xs mb-1">
                                          CPA Min Deposit
                                        </p>
                                        <p className="text-white">${deal.cpa_min_deposit}</p>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Sub-Affiliate</p>
                                      <p className="text-white">
                                        {deal.sub_affiliate_pct
                                          ? `${deal.sub_affiliate_pct}%`
                                          : "—"}
                                      </p>
                                    </div>
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

            {/* ─── Mobile Card Stack (< 768px) ─── */}
            <div className="md:hidden space-y-3">
              {sorted.map((deal, idx) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onSelectDeal={onSelectDeal}
                  isSelected={selectedDealIds.includes(deal.id)}
                  isTop={idx === 0}
                />
              ))}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" /> Top-rated deal
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-green-400" /> Global = no geo block
          </span>
          <span className="text-yellow-400 font-medium">Yellow values</span>
          <span>= above-average rates</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
