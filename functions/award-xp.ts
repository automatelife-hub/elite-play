/**
 * award-xp — Supabase Edge Function
 *
 * Awards XP and Dark Coins to a user for a given action.
 * Handles tier upgrades, streak multipliers, and mission progress.
 *
 * POST body: { userId: string, action: string, metadata?: object }
 */

import { createServiceClient } from "./_shared/supabase.ts";
import { calcStreakMultiplier, getTier, nextStreak, type TierName } from "./_shared/xp-math.ts";

// ── Constants ──────────────────────────────────────────────────────────────

const XP_VALUES: Record<string, number> = {
  login: 10,
  claim_deal: 25,
  refer_friend: 100,
  complete_mission: 0, // resolved dynamically from mission record
  share_achievement: 15,
};

async function updateStreak(
  db: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ streak: number; multiplier: number }> {
  const now = new Date();

  const { data: existing } = await db
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    // First login ever
    await db.from("user_streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_login_at: now.toISOString(),
      streak_multiplier: 1.0,
    });
    return { streak: 1, multiplier: 1.0 };
  }

  const lastLogin = existing.last_login_at ? new Date(existing.last_login_at) : null;
  const newStreak = nextStreak(existing.current_streak, lastLogin, now);

  const multiplier = calcStreakMultiplier(newStreak);
  const longest = Math.max(newStreak, existing.longest_streak ?? 0);

  await db.from("user_streaks").update({
    current_streak: newStreak,
    longest_streak: longest,
    last_login_at: now.toISOString(),
    streak_multiplier: multiplier,
  }).eq("user_id", userId);

  return { streak: newStreak, multiplier };
}

// ── Mission progress ────────────────────────────────────────────────────────

async function updateMissionProgress(
  db: ReturnType<typeof createServiceClient>,
  userId: string,
  action: string
): Promise<void> {
  const now = new Date().toISOString();

  // Get active missions that match this action
  const { data: activeMissions } = await db
    .from("missions")
    .select("id, target_count, xp_reward, coin_reward")
    .eq("action", action)
    .eq("is_active", true)
    .lte("active_from", now)
    .gte("active_to", now);

  if (!activeMissions?.length) return;

  for (const mission of activeMissions) {
    // Upsert user_missions row
    const { data: um } = await db
      .from("user_missions")
      .select("id, progress, completed")
      .eq("user_id", userId)
      .eq("mission_id", mission.id)
      .maybeSingle();

    if (um?.completed) continue; // already done

    const currentProgress = um?.progress ?? 0;
    const newProgress = currentProgress + 1;
    const completed = newProgress >= mission.target_count;

    if (um) {
      await db.from("user_missions").update({
        progress: newProgress,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      }).eq("id", um.id);
    } else {
      await db.from("user_missions").insert({
        user_id: userId,
        mission_id: mission.id,
        progress: newProgress,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      });
    }
  }
}

// ── Main handler ────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: { userId?: string; action?: string; metadata?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { userId, action, metadata } = body;

  if (!userId || !action) {
    return Response.json({ error: "userId and action are required" }, { status: 400 });
  }

  if (!(action in XP_VALUES) && action !== "complete_mission") {
    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  const db = createServiceClient();

  // Fetch current user profile
  const { data: profile, error: profileErr } = await db
    .from("profiles")
    .select("id, xp_total, xp_tier, dark_coins_balance")
    .eq("id", userId)
    .single();

  if (profileErr || !profile) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Determine base XP (for complete_mission, pull from metadata.missionId)
  let baseXp = XP_VALUES[action] ?? 0;
  if (action === "complete_mission" && metadata?.missionId) {
    const { data: mission } = await db
      .from("missions")
      .select("xp_reward")
      .eq("id", metadata.missionId)
      .maybeSingle();
    baseXp = mission?.xp_reward ?? 50;
  }

  // Update streak (only on login action) and get multiplier
  let multiplier = 1.0;
  if (action === "login") {
    const result = await updateStreak(db, userId);
    multiplier = result.multiplier;
  } else {
    // Read existing streak multiplier for non-login actions
    const { data: streak } = await db
      .from("user_streaks")
      .select("streak_multiplier")
      .eq("user_id", userId)
      .maybeSingle();
    multiplier = streak?.streak_multiplier ?? 1.0;
  }

  const xpEarned = Math.round(baseXp * multiplier);
  const coinsEarned = xpEarned; // 1 XP = 1 Dark Coin

  const newXpTotal = (profile.xp_total ?? 0) + xpEarned;
  const newCoins = (profile.dark_coins_balance ?? 0) + coinsEarned;

  const oldTier = profile.xp_tier as TierName;
  const newTier = getTier(newXpTotal);
  const tierUpgraded = newTier !== oldTier;

  // Update profile
  await db.from("profiles").update({
    xp_total: newXpTotal,
    xp_tier: newTier,
    dark_coins_balance: newCoins,
  }).eq("id", userId);

  // Record XP transaction
  await db.from("xp_transactions").insert({
    user_id: userId,
    action,
    xp_earned: xpEarned,
    coins_earned: coinsEarned,
    multiplier,
    metadata: metadata ?? null,
  });

  // Update mission progress for this action
  await updateMissionProgress(db, userId, action);

  return Response.json({
    success: true,
    xpEarned,
    coinsEarned,
    multiplier,
    newXpTotal,
    newCoinsBalance: newCoins,
    tier: newTier,
    tierUpgraded,
    previousTier: tierUpgraded ? oldTier : undefined,
  });
});
