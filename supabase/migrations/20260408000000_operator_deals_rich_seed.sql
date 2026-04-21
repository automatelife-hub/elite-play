-- ============================================================
-- Elite Play — Operator Deals Rich Seed (DAR-86, replaces DAR-82)
--
-- Adds extended display/tracking columns to operator_deals
-- and upserts the 14 real deals from src/data/affiliateDeals.js
-- (Poker x 7, Casino x 6, Sports x 1).
--
-- Safe to re-run: uses ON CONFLICT ... DO UPDATE.
-- ============================================================

-- =====================
-- STEP 1: Add extended columns (idempotent)
-- =====================
ALTER TABLE public.operator_deals
  ADD COLUMN IF NOT EXISTS subcategory     TEXT,
  ADD COLUMN IF NOT EXISTS website         TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_code  TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url    TEXT,
  ADD COLUMN IF NOT EXISTS welcome_bonus   TEXT,
  ADD COLUMN IF NOT EXISTS welcome_bonus_short TEXT,
  ADD COLUMN IF NOT EXISTS bonus_code      TEXT,
  ADD COLUMN IF NOT EXISTS bonus_wagering  TEXT,
  ADD COLUMN IF NOT EXISTS deal_status     TEXT DEFAULT 'active'
    CHECK (deal_status IN ('active','pending','negotiating','inactive')),
  ADD COLUMN IF NOT EXISTS deal_start_date DATE,
  ADD COLUMN IF NOT EXISTS deal_renewal_date DATE,
  ADD COLUMN IF NOT EXISTS rating          NUMERIC(3,1),
  ADD COLUMN IF NOT EXISTS tags            TEXT[],
  ADD COLUMN IF NOT EXISTS is_new          BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS score           INTEGER,
  ADD COLUMN IF NOT EXISTS min_payout      NUMERIC,
  ADD COLUMN IF NOT EXISTS payment_methods TEXT[],
  ADD COLUMN IF NOT EXISTS sub_affiliate_pct NUMERIC,
  ADD COLUMN IF NOT EXISTS cpa_min_deposit NUMERIC,
  ADD COLUMN IF NOT EXISTS hybrid_revshare_pct NUMERIC,
  ADD COLUMN IF NOT EXISTS hybrid_cpa_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS is_exclusive    BOOLEAN DEFAULT FALSE;

-- =====================
-- STEP 2: Upsert the 14 deals from affiliateDeals.js
-- NOTE: Uses actual column names from base schema:
--   rev_share_pct (not revenue_share_pct)
--   notes (not deal_notes)
--   category constraint: poker|casino|sportsbook|hybrid
-- =====================

INSERT INTO public.operator_deals (
  operator_name, operator_slug,
  category, subcategory,
  website, affiliate_code, tracking_url,
  deal_type,
  rev_share_pct, cpa_amount, cpa_currency, cpa_min_deposit,
  rakeback_pct, hybrid_revshare_pct, hybrid_cpa_amount,
  negative_carryover, sub_affiliate_pct,
  min_payout, payment_frequency, payment_methods,
  welcome_bonus, welcome_bonus_short, bonus_code, bonus_wagering,
  deal_status, notes,
  deal_start_date, deal_renewal_date,
  is_exclusive, is_active, is_featured, is_new,
  rating, tags, score
) VALUES

-- ---------------------------------------------------------------
-- POKER OPERATORS
-- ---------------------------------------------------------------

-- 1. GGPoker — Hybrid 30% RevShare + $100 CPA
(
  'GGPoker', 'ggpoker',
  'poker', 'international',
  'https://www.ggpoker.com', 'ELITEPLAY', 'https://ggpoker.com/ref/ELITEPLAY',
  'hybrid',
  NULL, NULL, 'USD', 50.00,
  NULL, 30.00, 100.00,
  FALSE, 5.00,
  100.00, 'monthly', ARRAY['bank_transfer','skrill','neteller','crypto'],
  '200% up to $600 + $100 in tickets', 'Up to $600 Bonus', 'ELITEPLAY', 'x5 rake requirement',
  'active', '30% RevShare + $100 CPA on first deposit >= $50. No negative carryover (resets quarterly). Fish Buffet gives players 60% rakeback. Negotiate higher RevShare at 50+ FTDs/month.',
  '2026-01-01', '2026-12-31',
  FALSE, TRUE, TRUE, FALSE,
  4.8, ARRAY['poker','crypto','high-traffic','fish-buffet'], 91
),

-- 2. PokerStars — 35% RevShare (tiered, pending)
(
  'PokerStars', 'pokerstars',
  'poker', 'international',
  'https://www.pokerstars.com', 'ELITE600', 'https://www.pokerstars.com/poker/download/?source=ELITE600',
  'revenue_share',
  35.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 5.00,
  100.00, 'monthly', ARRAY['bank_transfer','skrill','neteller'],
  '100% up to $600 First Deposit Bonus', '100% up to $600', 'ELITE600', 'Release in $10 increments per 200 VPPs earned',
  'pending', 'Tiered RevShare: 25% base, 30% at 20+ FTDs, 35% at 50+ FTDs. Account application submitted. Large player pool, high conversion. Negative carryover waived after 3 months of inactivity.',
  NULL, NULL,
  FALSE, TRUE, TRUE, FALSE,
  4.6, ARRAY['poker','high-traffic','stars-coins','tournaments'], 87
),

-- 3. WPT Global — 40% RevShare, biweekly (active)
(
  'WPT Global', 'wpt-global',
  'poker', 'international',
  'https://www.wptglobal.com', 'ELITEPLAY', 'https://www.wptglobal.com/deposit/?bonus=ELITEPLAY',
  'revenue_share',
  40.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 5.00,
  100.00, 'biweekly', ARRAY['bank_transfer','crypto'],
  '100% up to $1,200 First Deposit Bonus', '100% up to $1,200', 'ELITEPLAY', 'x3 rake requirement',
  'active', 'Aggressive 40% RevShare. Biweekly payments. Negative carryover resets quarterly. Growing network, strong tournament offering. One of our best poker deals.',
  '2026-02-01', '2027-01-31',
  FALSE, TRUE, TRUE, FALSE,
  4.7, ARRAY['poker','crypto','tournaments','biweekly-pay'], 90
),

-- 4. Americas Cardroom — 27% Rakeback, weekly (US-facing, pending)
(
  'Americas Cardroom', 'acr-poker',
  'poker', 'us-facing',
  'https://www.americascardroom.eu', 'ELITE', 'https://www.americascardroom.eu/poker-bonus/?bonus=ELITE',
  'rakeback',
  NULL, NULL, 'USD', NULL,
  27.00, NULL, NULL,
  FALSE, 3.00,
  25.00, 'weekly', ARRAY['crypto','bitcoin','check'],
  '200% up to $1,000 + free tickets', '200% up to $1,000', 'ELITE', NULL,
  'pending', '27% instant rakeback paid directly to players. Weekly crypto payouts. US players accepted. Agent earns sub-affiliate % on referred player rake. Soft cash game pool.',
  NULL, NULL,
  FALSE, TRUE, FALSE, FALSE,
  4.2, ARRAY['poker','rakeback','us-friendly','crypto','weekly-pay'], 78
),

-- 5. 888poker — 35% RevShare, negotiating (negative carryover)
(
  '888poker', '888poker',
  'poker', 'international',
  'https://www.888poker.com', 'ELITEPLAY', 'https://www.888poker.com/poker/download/?tcode=ELITEPLAY',
  'revenue_share',
  35.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  TRUE, 3.00,
  100.00, 'monthly', ARRAY['bank_transfer','skrill','neteller'],
  '888 Package: $88 FREE + 100% up to $888', '$88 Free + 100% up to $888', 'ELITEPLAY', '30-day expiry, rake requirement',
  'negotiating', 'Negotiating 35% RevShare (standard is 30%). Negative carryover applies. Target: 40% exclusive at 30+ FTDs/month.',
  NULL, NULL,
  FALSE, TRUE, FALSE, FALSE,
  4.3, ARRAY['poker','established','tournaments','softfield'], 80
),

-- 6. ClubGG — 30% Rakeback, club-based, weekly (pending)
(
  'ClubGG', 'clubgg',
  'poker', 'club-based',
  'https://www.clubgg.com', 'ELITEGG', 'https://www.clubgg.com/invite/ELITEGG',
  'rakeback',
  NULL, NULL, 'USD', NULL,
  30.00, NULL, NULL,
  FALSE, 5.00,
  25.00, 'weekly', ARRAY['crypto','usdt'],
  '30% rakeback from day one', '30% Rakeback', NULL, NULL,
  'pending', 'Club-based structure. Agent manages player pool directly. 30% rakeback passed to players. Good for high-volume cash game players. Weekly USDT settlement.',
  NULL, NULL,
  FALSE, TRUE, FALSE, FALSE,
  4.1, ARRAY['poker','club-based','rakeback','cash-games','crypto'], 74
),

-- 7. partypoker — CPA $150 per FTD, monthly (pending)
(
  'partypoker', 'partypoker',
  'poker', 'international',
  'https://www.partypoker.com', 'ELITE40', 'https://www.partypoker.com/how-to-play/account/registration.html?bonuscode=ELITE40',
  'cpa',
  NULL, 150.00, 'USD', 20.00,
  NULL, NULL, NULL,
  FALSE, 0.00,
  150.00, 'monthly', ARRAY['bank_transfer','neteller'],
  '40% up to $500 Welcome Bonus', '40% up to $500', 'ELITE40', 'x3 rake requirement',
  'pending', 'CPA $150 per qualifying first deposit (min $20). Monthly payments. Simple deal structure.',
  NULL, NULL,
  FALSE, TRUE, FALSE, FALSE,
  4.0, ARRAY['poker','cpa','established','tournaments'], 72
),

-- ---------------------------------------------------------------
-- CASINO & CRYPTO OPERATORS
-- ---------------------------------------------------------------

-- 8. Stake.com — 40% RevShare, weekly crypto (active, featured)
(
  'Stake.com', 'stake',
  'casino', 'crypto-casino',
  'https://stake.com', 'ELITEPLAY', 'https://stake.com/?c=ELITEPLAY',
  'revenue_share',
  40.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 5.00,
  50.00, 'weekly', ARRAY['crypto','bitcoin','ethereum','litecoin','ripple'],
  'No KYC required. Instant crypto deposits. VIP rakeback up to 15%.', 'VIP Rakeback + Weekly Bonuses', 'ELITEPLAY', NULL,
  'active', '40% RevShare on casino. Crypto native. No KYC for small deposits. Weekly payouts from $50. Negative carryover resets monthly. Negotiate to 45% at $10k+ NGR/month.',
  '2026-01-15', '2027-01-14',
  FALSE, TRUE, TRUE, FALSE,
  4.9, ARRAY['casino','crypto','no-kyc','sports','slots','live-casino','weekly-pay','featured'], 95
),

-- 9. BitStarz — CPA $100, monthly (pending, featured)
(
  'BitStarz', 'bitstarz',
  'casino', 'crypto-casino',
  'https://www.bitstarz.com', 'ELITE', 'https://www.bitstarz.com/?c=ELITE&i=affiliate',
  'cpa',
  NULL, 100.00, 'USD', 20.00,
  NULL, NULL, NULL,
  FALSE, 0.00,
  100.00, 'monthly', ARRAY['crypto','bitcoin'],
  '5 BTC + 180 Free Spins Welcome Package', '5 BTC + 180 Free Spins', 'ELITE', 'x40 wagering requirement',
  'pending', 'CPA $100 per first depositor. Award-winning Bitcoin casino. High conversion on first deposit.',
  NULL, NULL,
  FALSE, TRUE, TRUE, FALSE,
  4.7, ARRAY['casino','crypto','btc','slots','live-casino','award-winning'], 88
),

-- 10. BC.Game — 40% RevShare, weekly (pending, featured)
(
  'BC.Game', 'bc-game',
  'casino', 'crypto-casino',
  'https://bc.game', 'ELITEPLAY', 'https://bc.game/i-eliteplay-n/',
  'revenue_share',
  40.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 3.00,
  50.00, 'weekly', ARRAY['crypto','bitcoin','ethereum','bnb'],
  'Up to 220% First Deposit + Daily Lucky Spin', 'Up to 220% First Deposit', 'ELITEPLAY', 'x20 wagering',
  'pending', '40% RevShare. Strong crypto-native player base. Excellent slot selection including Pragmatic Play.',
  NULL, NULL,
  FALSE, TRUE, TRUE, FALSE,
  4.6, ARRAY['casino','crypto','rakeback','slots','live-casino','weekly-pay'], 86
),

-- 11. Rollbit — 35% RevShare, weekly (pending, new)
(
  'Rollbit', 'rollbit',
  'casino', 'crypto-casino',
  'https://rollbit.com', 'ELITEPLAY', 'https://rollbit.com/?c=ELITEPLAY',
  'revenue_share',
  35.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 5.00,
  50.00, 'weekly', ARRAY['crypto','bitcoin','ethereum','solana'],
  'Rakeback from first bet + RLB token rewards', 'Rakeback + RLB Tokens', 'ELITEPLAY', NULL,
  'pending', '35% RevShare. Unique RLB token economy adds extra earning potential.',
  NULL, NULL,
  FALSE, TRUE, FALSE, TRUE,
  4.4, ARRAY['casino','crypto','slots','token-rewards','new'], 82
),

-- 12. Duelbits — 35% RevShare, biweekly (pending, new)
(
  'Duelbits', 'duelbits',
  'casino', 'crypto-casino',
  'https://duelbits.com', 'ELITE', 'https://duelbits.com/?ref=ELITE',
  'revenue_share',
  35.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 3.00,
  50.00, 'biweekly', ARRAY['crypto','bitcoin','ethereum','litecoin'],
  '100% up to $200 + Rakeback', '100% up to $200 + Rakeback', 'ELITE', 'x30 wagering requirement',
  'pending', '35% RevShare. Growing crypto casino with strong esports focus. Biweekly payments.',
  NULL, NULL,
  FALSE, TRUE, FALSE, TRUE,
  4.3, ARRAY['casino','crypto','esports','rakeback','new'], 79
),

-- 13. Roobet — 35% RevShare, weekly (active)
(
  'Roobet', 'roobet',
  'casino', 'crypto-casino',
  'https://roobet.com', 'ELITEPLAY', 'https://roobet.com/?ref=ELITEPLAY',
  'revenue_share',
  35.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  FALSE, 5.00,
  50.00, 'weekly', ARRAY['crypto','bitcoin','ethereum'],
  'Rakeback + Roo Boost promotion', 'Rakeback + Weekly Boost', 'ELITEPLAY', NULL,
  'active', '35% RevShare deal confirmed. Weekly payouts. Strong brand recognition.',
  '2026-03-01', '2027-02-28',
  FALSE, TRUE, FALSE, FALSE,
  4.5, ARRAY['casino','crypto','slots','live-casino','weekly-pay'], 84
),

-- ---------------------------------------------------------------
-- SPORTS BETTING
-- ---------------------------------------------------------------

-- 14. bet365 — 30% RevShare, monthly (negotiating, negative carryover)
--     tracking_url NULL: pending proper affiliate account at partners.bet365.com
(
  'bet365', 'bet365',
  'sportsbook', 'traditional-sportsbook',
  'https://www.bet365.com', 'EPLYNG', NULL,
  'revenue_share',
  30.00, NULL, 'USD', NULL,
  NULL, NULL, NULL,
  TRUE, 0.00,
  100.00, 'monthly', ARRAY['bank_transfer'],
  'Up to $30 in Bet Credits', 'Up to $30 Bet Credits', NULL, 'Min deposit $10, bet credits used in 7 days',
  'negotiating', '30% RevShare. Large established sportsbook. Negative carryover. Application in progress at partners.bet365.com.',
  NULL, NULL,
  FALSE, TRUE, FALSE, FALSE,
  4.4, ARRAY['sports','established','live-betting','global'], 78
)

ON CONFLICT (operator_slug) DO UPDATE SET
  category          = EXCLUDED.category,
  subcategory       = EXCLUDED.subcategory,
  website           = EXCLUDED.website,
  affiliate_code    = EXCLUDED.affiliate_code,
  tracking_url      = EXCLUDED.tracking_url,
  deal_type         = EXCLUDED.deal_type,
  rev_share_pct     = EXCLUDED.rev_share_pct,
  cpa_amount        = EXCLUDED.cpa_amount,
  cpa_currency      = EXCLUDED.cpa_currency,
  cpa_min_deposit   = EXCLUDED.cpa_min_deposit,
  rakeback_pct      = EXCLUDED.rakeback_pct,
  hybrid_revshare_pct = EXCLUDED.hybrid_revshare_pct,
  hybrid_cpa_amount = EXCLUDED.hybrid_cpa_amount,
  negative_carryover = EXCLUDED.negative_carryover,
  sub_affiliate_pct = EXCLUDED.sub_affiliate_pct,
  min_payout        = EXCLUDED.min_payout,
  payment_frequency = EXCLUDED.payment_frequency,
  payment_methods   = EXCLUDED.payment_methods,
  welcome_bonus     = EXCLUDED.welcome_bonus,
  welcome_bonus_short = EXCLUDED.welcome_bonus_short,
  bonus_code        = EXCLUDED.bonus_code,
  bonus_wagering    = EXCLUDED.bonus_wagering,
  deal_status       = EXCLUDED.deal_status,
  notes             = EXCLUDED.notes,
  deal_start_date   = EXCLUDED.deal_start_date,
  deal_renewal_date = EXCLUDED.deal_renewal_date,
  is_exclusive      = EXCLUDED.is_exclusive,
  is_featured       = EXCLUDED.is_featured,
  is_new            = EXCLUDED.is_new,
  rating            = EXCLUDED.rating,
  tags              = EXCLUDED.tags,
  score             = EXCLUDED.score,
  updated_at        = NOW();
