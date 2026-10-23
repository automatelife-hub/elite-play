import { createServiceClient } from "../_shared/supabase.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// XP tier thresholds
const TIER_THRESHOLDS = [
  { tier: "elite",    min: 30000 },
  { tier: "platinum", min: 15000 },
  { tier: "gold",     min: 5000  },
  { tier: "silver",   min: 1000  },
  { tier: "bronze",   min: 0     },
];

function xpToTier(totalXp: number): string {
  for (const { tier, min } of TIER_THRESHOLDS) {
    if (totalXp >= min) return tier;
  }
  return "bronze";
}

// Badge unlock definitions (XP-based)
const BADGE_CONDITIONS = [
  { id: "first_xp",       name: "First XP",        icon: "⚡", xpRequired: 1    },
  { id: "xp_100",         name: "Century",          icon: "💯", xpRequired: 100  },
  { id: "xp_500",         name: "High Roller",      icon: "🎰", xpRequired: 500  },
  { id: "silver_unlock",  name: "Silver Agent",     icon: "🥈", xpRequired: 1000 },
  { id: "xp_5000",        name: "Gold Rush",        icon: "🏆", xpRequired: 5000 },
  { id: "platinum_unlock",name: "Platinum Agent",   icon: "💎", xpRequired: 15000},
  { id: "elite_unlock",   name: "Elite Agent",      icon: "👑", xpRequired: 30000},
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  const db = createServiceClient();

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }
    const token = match[1];
    const { data: { user }, error: authErr } = await db.auth.getUser(token);
    if (authErr || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }

    // Only agents or admins may award XP (service-role callers bypass this)
    const { data: profile } = await db
      .from("profiles")
      .select("role, is_agent, tier")
      .eq("id", user.id)
      .single();

    const isAdminOrAgent = profile?.role === "admin" || profile?.is_agent;
    if (!isAdminOrAgent) {
      return Response.json({ error: "Forbidden" }, { status: 403, headers: CORS });
    }

    const body = await req.json();
    const { userId, source, amount, referenceId } = body as {
      userId: string;
      source: string;
      amount: number;
      referenceId?: string;
    };

    if (!userId || !source || typeof amount !== "number" || amount <= 0) {
      return Response.json({ error: "Invalid params: userId, source, amount required" }, { status: 400, headers: CORS });
    }

    const validSources = ["player_referral", "active_player_month", "deal_conversion", "login_streak", "mission_complete", "badge_unlock", "admin_grant"];
    if (!validSources.includes(source)) {
      return Response.json({ error: `Invalid source. Must be one of: ${validSources.join(", ")}` }, { status: 400, headers: CORS });
    }

    // Insert XP ledger entry
    const { error: xpErr } = await db.from("xp_ledger").insert({
      user_id: userId,
      amount,
      source,
      reference_id: referenceId ?? null,
    });
    if (xpErr) throw xpErr;

    // Fetch new total XP
    const { data: xpView, error: xpViewErr } = await db
      .from("user_xp_totals")
      .select("total_xp, tier")
      .eq("user_id", userId)
      .single();
    if (xpViewErr) throw xpViewErr;

    const newXp = Number(xpView?.total_xp ?? 0);
    const newTier = xpToTier(newXp);

    // Award Dark Coins: 1 per 10 XP earned this transaction
    const coinsAwarded = Math.floor(amount / 10);
    if (coinsAwarded > 0) {
      const { error: coinErr } = await db.from("dark_coins_ledger").insert({
        user_id: userId,
        amount: coinsAwarded,
        source: `xp_conversion:${source}`,
        reference_id: referenceId ?? null,
      });
      if (coinErr) throw coinErr;
    }

    // Check tier promotion — update profiles.tier if changed
    const oldTier = profile?.tier ?? "bronze";
    if (newTier !== oldTier) {
      await db.from("profiles").update({ tier: newTier }).eq("id", userId);
    }

    // Check badge unlocks
    const { data: existingBadges } = await db
      .from("agent_achievements")
      .select("achievement_id")
      .eq("agent_id", userId);

    const earnedIds = new Set((existingBadges ?? []).map((b: { achievement_id: string }) => b.achievement_id));
    const badgesUnlocked: { id: string; name: string; icon: string }[] = [];

    for (const badge of BADGE_CONDITIONS) {
      if (!earnedIds.has(badge.id) && newXp >= badge.xpRequired) {
        const { error: badgeErr } = await db.from("agent_achievements").insert({
          agent_id: userId,
          achievement_id: badge.id,
          achievement_name: badge.name,
          badge_icon: badge.icon,
          earned_at: new Date().toISOString(),
        });
        if (!badgeErr) {
          badgesUnlocked.push({ id: badge.id, name: badge.name, icon: badge.icon });
        }
      }
    }

    return Response.json(
      { newXp, tier: newTier, coinsAwarded, badgesUnlocked, tierChanged: newTier !== oldTier },
      { headers: CORS }
    );
  } catch (err) {
    console.error("[award-xp]", err);
    return Response.json({ error: "Internal server error" }, { status: 500, headers: CORS });
  }
});
