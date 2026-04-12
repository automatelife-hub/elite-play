import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy, CheckCircle, ExternalLink, RotateCcw,
  TrendingUp, DollarSign, Percent, Zap, ChevronLeft
} from "lucide-react";
import { toast } from "sonner";

// ─── Constants ──────────────────────────────────────────────────────────────

const DEAL_TYPE_META = {
  revenue_share: {
    label: "Rev Share",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: Percent,
    glowColor: "rgba(59,130,246,0.35)",
  },
  cpa: {
    label: "CPA",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
    icon: DollarSign,
    glowColor: "rgba(34,197,94,0.35)",
  },
  hybrid: {
    label: "Hybrid",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: Zap,
    glowColor: "rgba(168,85,247,0.35)",
  },
  rakeback: {
    label: "Rakeback",
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    icon: TrendingUp,
    glowColor: "rgba(234,179,8,0.35)",
  },
  flat: {
    label: "Flat Fee",
    color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    icon: DollarSign,
    glowColor: "rgba(107,114,128,0.35)",
  },
};

const GOLD_GLOW = "0 0 0 2px rgba(234,179,8,0.6), 0 0 24px rgba(234,179,8,0.25)";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildSubidUrl(baseUrl, trackingCode) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    if (trackingCode) url.searchParams.set("subid", trackingCode);
    return url.toString();
  } catch {
    const sep = baseUrl.includes("?") ? "&" : "?";
    return trackingCode ? `${baseUrl}${sep}subid=${trackingCode}` : baseUrl;
  }
}

function getPrimaryRate(deal) {
  if (!deal) return null;
  if (deal.revenue_share_pct) return { value: `${deal.revenue_share_pct}%`, label: "Rev Share" };
  if (deal.rakeback_pct) return { value: `${deal.rakeback_pct}%`, label: "Rakeback" };
  if (deal.cpa_amount) return { value: `$${deal.cpa_amount}`, label: "CPA" };
  if (deal.hybrid_cpa_amount) return { value: `$${deal.hybrid_cpa_amount}`, label: "CPA" };
  return null;
}

// ─── Front Face ──────────────────────────────────────────────────────────────

function CardFront({ operator, deal, featured, onFlip }) {
  const meta = DEAL_TYPE_META[deal?.deal_type] ?? DEAL_TYPE_META.revenue_share;
  const DealIcon = meta.icon;
  const rate = getPrimaryRate(deal);

  return (
    <div className="absolute inset-0 flex flex-col p-5 backface-hidden">
      {/* Featured ribbon */}
      {featured && (
        <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none">
          <div className="absolute top-4 right-[-18px] bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-[10px] font-bold px-6 py-0.5 rotate-45">
            FEATURED
          </div>
        </div>
      )}

      {/* Operator logo */}
      <div className="w-full h-20 bg-white rounded-lg flex items-center justify-center mb-4 overflow-hidden shadow-md">
        {operator?.logo_url ? (
          <img
            src={operator.logo_url}
            alt={operator.name}
            className="max-w-full max-h-full object-contain p-2"
          />
        ) : (
          <span className="text-2xl font-extrabold text-gray-800">
            {operator?.name?.charAt(0) ?? "?"}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-white font-bold text-base mb-1 truncate">
        {operator?.name ?? "Operator"}
      </h3>

      {/* Deal type badge */}
      <div className="flex items-center gap-2 mb-3">
        <Badge className={`${meta.color} text-xs border flex items-center gap-1`}>
          <DealIcon className="w-3 h-3" />
          {meta.label}
        </Badge>
        {operator?.type && (
          <Badge className="bg-slate-700/60 text-slate-300 border-slate-600/40 text-xs border">
            {operator.type.replace("_", " ")}
          </Badge>
        )}
      </div>

      {/* Primary rate highlight */}
      {rate && (
        <div className="mt-auto mb-4 rounded-lg bg-slate-900/60 border border-slate-700/60 px-4 py-3 flex items-center justify-between">
          <span className="text-slate-400 text-xs">{rate.label}</span>
          <span className="text-2xl font-extrabold text-white">{rate.value}</span>
        </div>
      )}

      {/* Flip CTA */}
      <Button
        size="sm"
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-semibold"
        onClick={onFlip}
      >
        View Deal Details
      </Button>
    </div>
  );
}

// ─── Back Face ───────────────────────────────────────────────────────────────

function CardBack({ operator, deal, agent, onFlip }) {
  const [copied, setCopied] = useState(false);
  const meta = DEAL_TYPE_META[deal?.deal_type] ?? DEAL_TYPE_META.revenue_share;

  const affiliateUrl = buildSubidUrl(operator?.affiliate_url, agent?.tracking_code);

  const handleCopy = () => {
    if (!affiliateUrl) {
      toast.error("No affiliate URL configured for this operator.");
      return;
    }
    navigator.clipboard.writeText(affiliateUrl).then(() => {
      setCopied(true);
      toast.success("Affiliate link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const rows = [
    deal?.revenue_share_pct != null && { label: "Rev Share", value: `${deal.revenue_share_pct}%` },
    deal?.rakeback_pct != null && { label: "Rakeback", value: `${deal.rakeback_pct}%` },
    deal?.cpa_amount != null && { label: "CPA Amount", value: `$${deal.cpa_amount}` },
    deal?.hybrid_cpa_amount != null && { label: "Hybrid CPA", value: `$${deal.hybrid_cpa_amount}` },
    deal?.minimum_deposit != null && { label: "Min. Deposit", value: `$${deal.minimum_deposit}` },
    deal?.cookie_duration_days != null && { label: "Cookie", value: `${deal.cookie_duration_days}d` },
    deal?.payment_frequency && { label: "Payout", value: deal.payment_frequency },
  ].filter(Boolean);

  return (
    <div
      className="absolute inset-0 flex flex-col p-5 backface-hidden"
      style={{ transform: "rotateY(180deg)" }}
    >
      {/* Back header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {operator?.logo_url && (
            <img
              src={operator.logo_url}
              alt={operator.name}
              className="w-7 h-7 object-contain bg-white rounded p-0.5 flex-shrink-0"
            />
          )}
          <span className="text-white font-semibold text-sm truncate">{operator?.name}</span>
        </div>
        <Badge className={`${meta.color} text-xs border flex-shrink-0`}>{meta.label}</Badge>
      </div>

      {/* Deal metrics */}
      <div className="space-y-1.5 flex-1 overflow-auto">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-slate-900/50 border border-slate-700/40"
          >
            <span className="text-slate-400">{row.label}</span>
            <span className="text-white font-semibold">{row.value}</span>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-slate-500 text-xs text-center py-4">No deal metrics available.</p>
        )}
        {deal?.notes && (
          <p className="text-slate-400 text-xs pt-1 px-1 italic">{deal.notes}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0 border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 px-2"
          onClick={onFlip}
          aria-label="Flip back"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-semibold gap-1.5"
          onClick={handleCopy}
          disabled={!affiliateUrl}
        >
          {copied ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy Link{agent?.tracking_code ? " + SubID" : ""}</>
          )}
        </Button>

        {operator?.affiliate_url && (
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 px-2"
            asChild
          >
            <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" aria-label="Open in new tab">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main Card ───────────────────────────────────────────────────────────────

/**
 * OperatorDealCard
 *
 * Props:
 *   operator  — Site object  { id, name, logo_url, affiliate_url, type, featured }
 *   deal      — OperatorDeal { deal_type, revenue_share_pct, rakeback_pct, cpa_amount, ... }
 *   agent     — Agent object { tracking_code, ... }
 *   featured  — boolean override (falls back to operator.featured)
 */
export function OperatorDealCard({ operator, deal, agent, featured }) {
  const [flipped, setFlipped] = useState(false);
  const isFeatured = featured ?? operator?.featured ?? false;
  const meta = DEAL_TYPE_META[deal?.deal_type] ?? DEAL_TYPE_META.revenue_share;

  return (
    <motion.div
      className="relative w-full"
      style={{ perspective: "1000px", minHeight: "320px" }}
      whileHover={!flipped ? { scale: 1.03 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Pulsing gold border for featured */}
      {isFeatured && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0 2px rgba(234,179,8,0.5), 0 0 12px rgba(234,179,8,0.15)",
              "0 0 0 2px rgba(234,179,8,0.9), 0 0 28px rgba(234,179,8,0.35)",
              "0 0 0 2px rgba(234,179,8,0.5), 0 0 12px rgba(234,179,8,0.15)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Hover glow overlay (non-featured) */}
      {!isFeatured && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06)` }}
          whileHover={{
            boxShadow: `0 0 0 1.5px ${meta.glowColor}, 0 0 20px ${meta.glowColor}`,
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* 3D flip container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          minHeight: "320px",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardFront
            operator={operator}
            deal={deal}
            featured={isFeatured}
            onFlip={() => setFlipped(true)}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardBack
            operator={operator}
            deal={deal}
            agent={agent}
            onFlip={() => setFlipped(false)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Grid Wrapper ─────────────────────────────────────────────────────────────

/**
 * OperatorDealGrid
 *
 * Renders a responsive 1/2/3-col grid of OperatorDealCards.
 *
 * Props:
 *   operators — array of Site objects
 *   deals     — array of OperatorDeal objects (matched by site_id or operator_slug)
 *   agent     — Agent object { tracking_code }
 */
export function OperatorDealGrid({ operators = [], deals = [], agent }) {
  if (operators.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No operator deals available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {operators.map((op) => {
        const deal = deals.find(
          (d) => d.site_id === op.id || d.operator_slug === op.slug
        );
        return (
          <OperatorDealCard
            key={op.id}
            operator={op}
            deal={deal}
            agent={agent}
          />
        );
      })}
    </div>
  );
}

export default OperatorDealCard;
