/**
 * rotate-missions — Supabase Edge Function
 *
 * Rotates the active mission pool. Intended to be called by a Supabase
 * pg_cron job or scheduled trigger (e.g., every hour, or via cron).
 *
 * Rotation schedule:
 *   - Daily   missions: rotate every 24h UTC
 *   - Weekly  missions: rotate every Monday 00:00 UTC
 *   - Monthly missions: rotate every 1st of the month 00:00 UTC
 *
 * The function:
 *   1. Deactivates missions whose active_to has passed
 *   2. Assigns newly-due active missions to all users who don't have them yet
 *
 * Invoke via POST (no body required). Must be called with service-role key
 * or from a trusted Supabase cron job (no user auth needed).
 *
 * Mission templates live in the `missions` table with is_active=false
 * and future active_from / active_to windows pre-populated by this function.
 */

import { createServiceClient } from "./_shared/supabase.ts";

// ── Types ──────────────────────────────────────────────────────────────────

interface MissionTemplate {
  title: string;
  description: string;
  mission_type: "daily" | "weekly" | "monthly";
  action: string;
  target_count: number;
  xp_reward: number;
  coin_reward: number;
}

// ── Mission catalogue ──────────────────────────────────────────────────────
// These are the base templates. One set per rotation window.

const DAILY_MISSIONS: MissionTemplate[] = [
  { title: "Daily Login",       description: "Log in today",                  mission_type: "daily",   action: "login",            target_count: 1,  xp_reward: 20,  coin_reward: 20  },
  { title: "Deal Hunter",       description: "Claim a deal today",             mission_type: "daily",   action: "claim_deal",       target_count: 1,  xp_reward: 30,  coin_reward: 30  },
  { title: "Share & Shine",     description: "Share an achievement",           mission_type: "daily",   action: "share_achievement",target_count: 1,  xp_reward: 20,  coin_reward: 20  },
];

const WEEKLY_MISSIONS: MissionTemplate[] = [
  { title: "Week Warrior",      description: "Log in 5 days this week",        mission_type: "weekly",  action: "login",            target_count: 5,  xp_reward: 100, coin_reward: 100 },
  { title: "Deal Spree",        description: "Claim 3 deals this week",        mission_type: "weekly",  action: "claim_deal",       target_count: 3,  xp_reward: 120, coin_reward: 120 },
  { title: "Recruiter",         description: "Refer a friend this week",       mission_type: "weekly",  action: "refer_friend",     target_count: 1,  xp_reward: 150, coin_reward: 150 },
];

const MONTHLY_MISSIONS: MissionTemplate[] = [
  { title: "Month Loyalist",    description: "Log in 20 days this month",      mission_type: "monthly", action: "login",            target_count: 20, xp_reward: 500, coin_reward: 500 },
  { title: "Power Recruiter",   description: "Refer 3 friends this month",     mission_type: "monthly", action: "refer_friend",     target_count: 3,  xp_reward: 600, coin_reward: 600 },
  { title: "Deal Master",       description: "Claim 10 deals this month",      mission_type: "monthly", action: "claim_deal",       target_count: 10, xp_reward: 400, coin_reward: 400 },
];

// ── Time helpers ────────────────────────────────────────────────────────────

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function nextDayUTC(d: Date): Date {
  const t = startOfDayUTC(d);
  t.setUTCDate(t.getUTCDate() + 1);
  return t;
}

function startOfWeekUTC(d: Date): Date {
  // Monday = 1; roll back to Monday
  const day = d.getUTCDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  const t = startOfDayUTC(d);
  t.setUTCDate(t.getUTCDate() + diff);
  return t;
}

function nextWeekUTC(d: Date): Date {
  const t = startOfWeekUTC(d);
  t.setUTCDate(t.getUTCDate() + 7);
  return t;
}

function startOfMonthUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function nextMonthUTC(d: Date): Date {
  const t = startOfMonthUTC(d);
  t.setUTCMonth(t.getUTCMonth() + 1);
  return t;
}

interface TimeWindow {
  activeFrom: Date;
  activeTo: Date;
}

function getWindowForType(type: "daily" | "weekly" | "monthly", now: Date): TimeWindow {
  switch (type) {
    case "daily":
      return { activeFrom: startOfDayUTC(now), activeTo: nextDayUTC(now) };
    case "weekly":
      return { activeFrom: startOfWeekUTC(now), activeTo: nextWeekUTC(now) };
    case "monthly":
      return { activeFrom: startOfMonthUTC(now), activeTo: nextMonthUTC(now) };
  }
}

// ── Core rotation logic ────────────────────────────────────────────────────

async function rotateMissionType(
  db: ReturnType<typeof createServiceClient>,
  now: Date,
  templates: MissionTemplate[],
): Promise<{ created: number; skipped: number }> {
  const type = templates[0].mission_type;
  const { activeFrom, activeTo } = getWindowForType(type, now);

  let created = 0;
  let skipped = 0;

  for (const template of templates) {
    // Check if a mission for this window already exists
    const { data: existing } = await db
      .from("missions")
      .select("id")
      .eq("action", template.action)
      .eq("mission_type", type)
      .eq("active_from", activeFrom.toISOString())
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    await db.from("missions").insert({
      title: template.title,
      description: template.description,
      mission_type: template.mission_type,
      action: template.action,
      target_count: template.target_count,
      xp_reward: template.xp_reward,
      coin_reward: template.coin_reward,
      active_from: activeFrom.toISOString(),
      active_to: activeTo.toISOString(),
      is_active: true,
    });

    created++;
  }

  return { created, skipped };
}

async function deactivateExpiredMissions(
  db: ReturnType<typeof createServiceClient>,
  now: Date,
): Promise<number> {
  const { data, error } = await db
    .from("missions")
    .update({ is_active: false })
    .eq("is_active", true)
    .lt("active_to", now.toISOString())
    .select("id");

  if (error) throw new Error(`Failed to deactivate missions: ${error.message}`);
  return data?.length ?? 0;
}

// ── Main handler ────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const db = createServiceClient();
  const now = new Date();

  try {
    // 1. Deactivate expired missions
    const deactivated = await deactivateExpiredMissions(db, now);

    // 2. Rotate each mission type
    const daily   = await rotateMissionType(db, now, DAILY_MISSIONS);
    const weekly  = await rotateMissionType(db, now, WEEKLY_MISSIONS);
    const monthly = await rotateMissionType(db, now, MONTHLY_MISSIONS);

    const summary = {
      ranAt: now.toISOString(),
      deactivated,
      daily,
      weekly,
      monthly,
    };

    console.log("rotate-missions complete:", JSON.stringify(summary));

    return Response.json({ success: true, ...summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("rotate-missions error:", message);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
});
