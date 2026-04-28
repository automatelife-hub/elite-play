/**
 * Pure helpers extracted from award-xp.ts so they can be unit-tested
 * outside the Deno runtime.
 */

export const TIERS = [
  { name: "bronze",   min: 0,      max: 499 },
  { name: "silver",   min: 500,    max: 1999 },
  { name: "gold",     min: 2000,   max: 4999 },
  { name: "platinum", min: 5000,   max: 9999 },
  { name: "elite",    min: 10000,  max: Infinity },
] as const;

export type TierName = "bronze" | "silver" | "gold" | "platinum" | "elite";

export function getTier(totalXp: number): TierName {
  for (const tier of TIERS) {
    if (totalXp >= tier.min && totalXp <= tier.max) return tier.name as TierName;
  }
  return "elite";
}

export function calcStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 7)  return 1.5;
  return 1.0;
}

/**
 * Given the previous login timestamp and the current time, return the next
 * streak count. Mirrors the rules in award-xp.ts updateStreak():
 *   - no previous login → 1
 *   - < 24h since last  → unchanged
 *   - 24–48h            → +1
 *   - > 48h             → reset to 1
 */
export function nextStreak(currentStreak: number, lastLoginAt: Date | null, now: Date): number {
  if (!lastLoginAt) return 1;
  const hoursSince = (now.getTime() - lastLoginAt.getTime()) / 3_600_000;
  if (hoursSince < 24) return currentStreak;
  if (hoursSince <= 48) return currentStreak + 1;
  return 1;
}
