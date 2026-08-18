import { describe, expect, it } from 'vitest';
import { calcStreakMultiplier, getTier, nextStreak } from '../xp-math';

describe('getTier', () => {
  it('classifies bronze across its full range', () => {
    expect(getTier(0)).toBe('bronze');
    expect(getTier(499)).toBe('bronze');
  });

  it('classifies silver at the boundary', () => {
    expect(getTier(500)).toBe('silver');
    expect(getTier(1999)).toBe('silver');
  });

  it('classifies gold at the boundary', () => {
    expect(getTier(2000)).toBe('gold');
    expect(getTier(4999)).toBe('gold');
  });

  it('classifies platinum at the boundary', () => {
    expect(getTier(5000)).toBe('platinum');
    expect(getTier(9999)).toBe('platinum');
  });

  it('classifies elite at and beyond 10_000', () => {
    expect(getTier(10_000)).toBe('elite');
    expect(getTier(1_000_000)).toBe('elite');
  });
});

describe('calcStreakMultiplier', () => {
  it('returns 1.0 for sub-7-day streaks', () => {
    expect(calcStreakMultiplier(0)).toBe(1.0);
    expect(calcStreakMultiplier(6)).toBe(1.0);
  });

  it('returns 1.5 for 7-29 day streaks', () => {
    expect(calcStreakMultiplier(7)).toBe(1.5);
    expect(calcStreakMultiplier(29)).toBe(1.5);
  });

  it('returns 2.0 for 30+ day streaks', () => {
    expect(calcStreakMultiplier(30)).toBe(2.0);
    expect(calcStreakMultiplier(365)).toBe(2.0);
  });
});

describe('nextStreak', () => {
  const HOUR = 3_600_000;

  it('initialises to 1 when there is no previous login', () => {
    expect(nextStreak(0, null, new Date())).toBe(1);
  });

  it('does not increment within the same 24h window', () => {
    const now = new Date('2026-04-28T12:00:00Z');
    const last = new Date(now.getTime() - 5 * HOUR);
    expect(nextStreak(4, last, now)).toBe(4);
  });

  it('increments for a 24h-48h gap (consecutive day)', () => {
    const now = new Date('2026-04-28T12:00:00Z');
    const last = new Date(now.getTime() - 25 * HOUR);
    expect(nextStreak(4, last, now)).toBe(5);
  });

  it('increments at exactly 48h (boundary is inclusive)', () => {
    const now = new Date('2026-04-28T12:00:00Z');
    const last = new Date(now.getTime() - 48 * HOUR);
    expect(nextStreak(4, last, now)).toBe(5);
  });

  it('resets to 1 when the gap exceeds 48h', () => {
    const now = new Date('2026-04-28T12:00:00Z');
    const last = new Date(now.getTime() - 72 * HOUR);
    expect(nextStreak(4, last, now)).toBe(1);
  });
});
