-- ============================================================
-- Elite Play — Operator Deals Seed Migration (DAR-47)
-- 22 operators: Poker rooms + Crypto casinos + Sportsbooks
-- Affiliate Manager: update [YOUR_AFFILIATE_ID] placeholders
-- after registering at each affiliate program.
-- ============================================================

-- =====================
-- STEP 1: Add affiliate_url to sites table
-- (Required by OperatorDealCard component — operator.affiliate_url)
-- =====================
ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS affiliate_url TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_program_url TEXT,
  ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- =====================
-- STEP 2: Add extra operators to sites table
-- (Extends initial 10-site seed from schema)
-- =====================
INSERT INTO public.sites (name, slug, type, description, short_description, rating, featured, highlights, bonus_offer, established_year, status, payment_methods, supported_currencies, platforms)
VALUES
  ('ACR Poker', 'acr-poker', 'poker',
   'Americas Cardroom — the flagship skin of the Winning Poker Network, US-friendly with 27% instant rakeback and some of the softest cash games online.',
   'US-friendly poker with 27% instant rakeback',
   8.0, false,
   ARRAY['US players accepted', '27% instant rakeback', 'Weekly crypto payouts', 'Soft cash game pool', 'MTT guarantees'],
   '27% Rakeback + 100% up to $2,000 deposit bonus',
   2011, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'Zelle', 'MoneyOrder'],
   ARRAY['USD', 'BTC', 'ETH'],
   ARRAY['Desktop', 'Mobile']),

  ('Bovada', 'bovada', 'poker',
   'Bovada is the premier US-facing poker, casino, and sportsbook brand offering crypto deposits and a $150 CPA per qualifying player.',
   'Top US poker & casino brand',
   8.0, false,
   ARRAY['US players accepted', 'Poker + Casino + Sports', 'Crypto deposits', 'Anonymous tables', 'Weekly player rewards'],
   '$500 poker welcome bonus + 100% casino match',
   2011, 'active',
   ARRAY['Bitcoin', 'Bitcoin Cash', 'Zelle', 'Vouchers'],
   ARRAY['USD', 'BTC'],
   ARRAY['Desktop', 'Mobile']),

  ('BetOnline', 'betonline', 'sportsbetting',
   'BetOnline is a US-friendly sportsbook, poker room, and casino with 25-35% affiliate RevShare and monthly crypto payouts.',
   'US-friendly sports, poker & casino',
   7.8, false,
   ARRAY['US players accepted', 'Poker + Sports + Casino', 'Crypto payouts', 'Live betting', 'Racebook'],
   '50% welcome bonus up to $1,000',
   2004, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'Credit Card', 'Bank Transfer'],
   ARRAY['USD', 'BTC', 'ETH'],
   ARRAY['Desktop', 'Mobile']),

  ('BitStarz', 'bitstarz', 'casino',
   'Award-winning Bitcoin casino with 3,500+ games, 24-hour payouts, and one of the best CPA affiliate programs in crypto gambling.',
   'World''s #1 Bitcoin casino',
   9.0, true,
   ARRAY['3,500+ games', '24h crypto payouts', 'Live dealer games', 'VIP program', 'No KYC fast withdrawals'],
   '5 BTC + 200 Free Spins welcome package',
   2014, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'Dogecoin', 'USDT', 'Credit Card'],
   ARRAY['BTC', 'ETH', 'LTC', 'DOGE', 'USDT', 'EUR', 'USD'],
   ARRAY['Desktop', 'Mobile']),

  ('Roobet', 'roobet', 'casino',
   'Fast-growing crypto casino popular with streamers, offering 25-35% RevShare and weekly affiliate payouts in crypto.',
   'Crypto casino for the streamer generation',
   8.5, false,
   ARRAY['Provably fair games', 'Streamer partnerships', 'Daily drops & wins', 'Crypto-only', 'Instant payouts'],
   'Up to 20% Rakeback + weekly promotions',
   2019, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'Dogecoin'],
   ARRAY['BTC', 'ETH', 'LTC', 'DOGE'],
   ARRAY['Desktop', 'Mobile']),

  ('Cloudbet', 'cloudbet', 'casino',
   'Established Bitcoin casino and sportsbook with tiered RevShare up to 50% and a broad game library from 50+ providers.',
   'Pioneer Bitcoin casino & sportsbook',
   8.3, false,
   ARRAY['50+ game providers', 'Sports + Casino', 'Tiered 25-50% RevShare', 'BTC/ETH/USDT', 'eSports betting'],
   '100% match up to 5 BTC welcome bonus',
   2013, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'USDT', 'Litecoin', 'Cardano', 'USDC'],
   ARRAY['BTC', 'ETH', 'USDT', 'LTC', 'ADA'],
   ARRAY['Desktop', 'Mobile']),

  ('BC.Game', 'bc-game', 'casino',
   'Fast-growing crypto casino with 50%+ RevShare at volume, 10,000+ games, and one of the most aggressive affiliate programs in the market.',
   'High-RevShare crypto casino',
   8.6, true,
   ARRAY['10,000+ games', 'Up to 50% RevShare', 'Daily lucky spins', 'Chat rain feature', 'BCG token rewards'],
   '360% first deposit bonus + daily missions',
   2017, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'USDT', 'Litecoin', 'Dogecoin', 'BNB', 'TRX', 'XRP'],
   ARRAY['BTC', 'ETH', 'USDT', 'LTC', 'DOGE', 'BNB', 'TRX', 'XRP'],
   ARRAY['Desktop', 'Mobile']),

  ('Rollbit', 'rollbit', 'casino',
   'NFT-integrated crypto casino with daily affiliate payouts, RLB token incentives, and a unique house edge revenue share model.',
   'NFT crypto casino with daily payouts',
   8.4, false,
   ARRAY['NFT integration', 'Daily affiliate payouts', 'RLB token rewards', 'Futures trading', 'Crash games'],
   'Up to 15% Rakeback + RLB token bonuses',
   2020, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Solana', 'USDT'],
   ARRAY['BTC', 'ETH', 'SOL', 'USDT', 'RLB'],
   ARRAY['Desktop', 'Mobile']),

  ('Duelbits', 'duelbits', 'casino',
   'Hybrid crypto casino and sportsbook offering 25-35% RevShare plus CPA options, with weekly affiliate crypto payments.',
   'Crypto casino & sports betting hybrid',
   8.1, false,
   ARRAY['Casino + Sportsbook', 'Hybrid affiliate model', 'Rakeback loyalty', 'Crypto-native', 'Weekly payouts'],
   '$10 free + deposit bonus on sign-up',
   2020, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'Dogecoin', 'USDT', 'TRX'],
   ARRAY['BTC', 'ETH', 'LTC', 'DOGE', 'USDT'],
   ARRAY['Desktop', 'Mobile']),

  ('Natural8', 'natural8', 'poker',
   'Natural8 is a GGNetwork skin offering 40% rakeback, massive tournament guarantees, and some of the best player rewards in online poker.',
   'GGNetwork skin with 40% rakeback',
   8.5, false,
   ARRAY['40% rakeback', 'GGNetwork traffic', 'Weekly payouts', 'WSOP partnerships', 'Team sponsorships'],
   '40% Rakeback + $20 free on sign-up',
   2018, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Bank Transfer', 'Skrill', 'Neteller'],
   ARRAY['USD', 'BTC', 'ETH'],
   ARRAY['Desktop', 'Mobile']),

  ('PokerKing', 'pokerking', 'poker',
   'PokerKing is a WPN-network skin with 30-35% rakeback, agent referral model, and weekly crypto payouts for US and international players.',
   'WPN poker with agent model & 30% rakeback',
   7.9, false,
   ARRAY['WPN network traffic', '30-35% rakeback', 'Agent referral model', 'Weekly crypto payouts', 'US accepted'],
   '30% Rakeback + 200% up to $2,000 welcome bonus',
   2018, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'Zelle'],
   ARRAY['USD', 'BTC', 'ETH'],
   ARRAY['Desktop', 'Mobile']),

  ('Wild.io', 'wild-io', 'casino',
   'Emerging crypto casino with up to 45% RevShare for affiliates, Pragmatic Play and Hacksaw Gaming content, and monthly crypto payouts.',
   'Emerging crypto casino — up to 45% RevShare',
   8.0, false,
   ARRAY['Up to 45% RevShare', 'Pragmatic & Hacksaw content', 'Weekly promotions', 'VIP loyalty cashback', 'Crypto-first'],
   '100% up to 1 BTC + 100 free spins',
   2021, 'active',
   ARRAY['Bitcoin', 'Ethereum', 'Litecoin', 'USDT', 'Dogecoin'],
   ARRAY['BTC', 'ETH', 'LTC', 'USDT', 'DOGE'],
   ARRAY['Desktop', 'Mobile'])
ON CONFLICT (slug) DO NOTHING;

-- =====================
-- STEP 3: Update existing sites with affiliate URLs
-- IMPORTANT: Replace [YOUR_AFFILIATE_ID] placeholders after
-- registering at each affiliate program.
-- =====================

-- PokerStars → affiliates.pokerstars.com
UPDATE public.sites SET
  affiliate_url = 'https://www.pokerstars.com/poker/?source=affiliate&aff=ELITEPLAY2026',
  affiliate_program_url = 'https://affiliates.pokerstars.com/poker/affiliate/'
WHERE slug = 'pokerstars';

-- GGPoker → affiliates.gg.poker
UPDATE public.sites SET
  affiliate_url = 'https://ggs.poker/ELITEPLAY',
  affiliate_program_url = 'https://affiliates.gg.poker/'
WHERE slug = 'ggpoker';

-- 888poker → 888affiliates.com
UPDATE public.sites SET
  affiliate_url = 'https://www.888poker.com/?aflt=ELITEPLAY2026',
  affiliate_program_url = 'https://www.888affiliates.com/'
WHERE slug = '888poker';

-- PartyPoker → partycasinopartners.com
UPDATE public.sites SET
  affiliate_url = 'https://www.partypoker.com/promos/ELITEPLAY',
  affiliate_program_url = 'https://www.partycasinopartners.com/'
WHERE slug = 'partypoker';

-- WPT Global → affiliates.wptglobal.com
UPDATE public.sites SET
  affiliate_url = 'https://wptglobal.com/?ref=ELITEPLAY2026',
  affiliate_program_url = 'https://affiliates.wptglobal.com/'
WHERE slug = 'wpt-global';

-- ClubGG → GGNetwork affiliates
UPDATE public.sites SET
  affiliate_url = 'https://www.clubgg.net/?ref=ELITEPLAY',
  affiliate_program_url = 'https://affiliates.gg.poker/'
WHERE slug = 'clubgg';

-- Stake → stake.com/affiliates
UPDATE public.sites SET
  affiliate_url = 'https://stake.com/?c=ELITEPLAY',
  affiliate_program_url = 'https://stake.com/affiliates'
WHERE slug = 'stake';

-- Betway → betwaypartners.com
UPDATE public.sites SET
  affiliate_url = 'https://betway.com/?btag=ELITEPLAY2026',
  affiliate_program_url = 'https://www.betwaypartners.com/'
WHERE slug = 'betway';

-- bet365 → 365affiliates.com
UPDATE public.sites SET
  affiliate_url = 'https://www.bet365.com/#/AC/B1/C1/D1002/E47764168/F3/',
  affiliate_program_url = 'https://www.365affiliates.com/'
WHERE slug = 'bet365';

-- ACR Poker → wpn.com/affiliates
UPDATE public.sites SET
  affiliate_url = 'https://www.americascardroom.eu/?btag=ELITEPLAY2026',
  affiliate_program_url = 'https://www.wpn.com/affiliates'
WHERE slug = 'acr-poker';

-- Bovada → bovadaaffiliate.com
UPDATE public.sites SET
  affiliate_url = 'https://www.bovada.lv/?extcmp=ELITEPLAY_AFF',
  affiliate_program_url = 'https://www.bovadaaffiliate.com/'
WHERE slug = 'bovada';

-- BetOnline → betonlineaffiliates.ag
UPDATE public.sites SET
  affiliate_url = 'https://www.betonline.ag/?btag=ELITEPLAY2026',
  affiliate_program_url = 'https://www.betonlineaffiliates.ag/'
WHERE slug = 'betonline';

-- BitStarz → bitstarzpartners.com
UPDATE public.sites SET
  affiliate_url = 'https://bs1.xyz/?a=ELITEPLAY&c=DEALS',
  affiliate_program_url = 'https://www.bitstarzpartners.com/'
WHERE slug = 'bitstarz';

-- Roobet → roobet.com affiliates
UPDATE public.sites SET
  affiliate_url = 'https://roobet.com/?ref=ELITEPLAY',
  affiliate_program_url = 'https://roobet.com/affiliates'
WHERE slug = 'roobet';

-- Cloudbet → affiliates.cloudbet.com
UPDATE public.sites SET
  affiliate_url = 'https://cloudbet.com/en/?ex=ELITEPLAY2026',
  affiliate_program_url = 'https://affiliates.cloudbet.com/'
WHERE slug = 'cloudbet';

-- BC.Game → bc.game partners
UPDATE public.sites SET
  affiliate_url = 'https://bc.game/#/?i=ELITEPLAY',
  affiliate_program_url = 'https://bc.game/partners'
WHERE slug = 'bc-game';

-- Rollbit → rollbit.com affiliates
UPDATE public.sites SET
  affiliate_url = 'https://rollbit.com/?r=ELITEPLAY',
  affiliate_program_url = 'https://rollbit.com/affiliates'
WHERE slug = 'rollbit';

-- Duelbits → duelbits.com affiliates
UPDATE public.sites SET
  affiliate_url = 'https://duelbits.com/?ref=ELITEPLAY',
  affiliate_program_url = 'https://duelbits.com/affiliates'
WHERE slug = 'duelbits';

-- Natural8 → natural8.com affiliates
UPDATE public.sites SET
  affiliate_url = 'https://www.natural8.com/?ref=ELITEPLAY2026',
  affiliate_program_url = 'https://www.natural8.com/affiliates'
WHERE slug = 'natural8';

-- PokerKing → wpn.com/affiliates
UPDATE public.sites SET
  affiliate_url = 'https://www.pokerking.com/?btag=ELITEPLAY2026',
  affiliate_program_url = 'https://www.wpn.com/affiliates'
WHERE slug = 'pokerking';

-- Wild.io → wild.io affiliates
UPDATE public.sites SET
  affiliate_url = 'https://wild.io/?btag=ELITEPLAY2026',
  affiliate_program_url = 'https://wild.io/affiliates'
WHERE slug = 'wild-io';

-- PPPoker → pppoker.com affiliates
UPDATE public.sites SET
  affiliate_url = 'https://www.pppoker.net/?ref=ELITEPLAY',
  affiliate_program_url = 'https://www.pppoker.net/agent'
WHERE slug = 'pppoker';

-- =====================
-- STEP 4: Seed operator_deals table (22 operators)
-- =====================

INSERT INTO public.operator_deals (
  site_id, operator_name, operator_slug,
  deal_type, revenue_share_pct, cpa_amount, cpa_currency, cpa_min_deposit,
  rakeback_pct, hybrid_revshare_pct, hybrid_cpa_amount,
  negative_carryover, sub_affiliate_pct, min_payout,
  payment_frequency, payment_methods, geo_restrictions, deal_notes,
  is_exclusive, is_active
)
SELECT
  s.id,
  v.operator_name, v.operator_slug,
  v.deal_type, v.revenue_share_pct, v.cpa_amount, v.cpa_currency, v.cpa_min_deposit,
  v.rakeback_pct, v.hybrid_revshare_pct, v.hybrid_cpa_amount,
  v.negative_carryover, v.sub_affiliate_pct, v.min_payout,
  v.payment_frequency, v.payment_methods, v.geo_restrictions, v.deal_notes,
  v.is_exclusive, v.is_active
FROM (VALUES

  -- 1. PokerStars — Stars Affiliates, tiered RevShare 30%
  ('PokerStars', 'pokerstars', 'revenue_share',
   30.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 100.00, 'monthly',
   ARRAY['bank_transfer','skrill','neteller'],
   ARRAY['US','AU','FR','ES','IT','PT','DK','SE','NO','CH','HU','RU'],
   'Stars Affiliates program. Tiered RevShare: 25% base → 30% standard → 35%+ at volume. Negative carryover waived on request. Monthly via Skrill/Neteller/Bank. Signup: affiliates.pokerstars.com',
   FALSE, TRUE),

  -- 2. GGPoker — Hybrid 35% RevShare + $100 CPA
  ('GGPoker', 'ggpoker', 'hybrid',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', 50.00::NUMERIC,
   NULL::NUMERIC, 35.00::NUMERIC, 100.00::NUMERIC,
   FALSE, 5.00, 100.00, 'monthly',
   ARRAY['bank_transfer','skrill','crypto'],
   ARRAY['US'],
   'GG Affiliates program. Hybrid: 35% RevShare + $100 CPA per FTD ≥$50. No negative carryover (resets monthly). Strong MTT traffic. Signup: affiliates.gg.poker',
   FALSE, TRUE),

  -- 3. 888poker — 30% RevShare (can negotiate 35% exclusive)
  ('888poker', '888poker', 'revenue_share',
   30.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   TRUE, 3.00, 100.00, 'monthly',
   ARRAY['bank_transfer','neteller','skrill'],
   ARRAY[],
   '888 Affiliates. 30% RevShare standard; push for 35% exclusive deal. Negative carryover applies — negotiate waiver at volume. Monthly payments. Signup: 888affiliates.com',
   FALSE, TRUE),

  -- 4. PartyPoker — CPA $150 per FTD
  ('PartyPoker', 'partypoker', 'cpa',
   NULL::NUMERIC, 150.00::NUMERIC, 'USD', 20.00::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 0.00, 150.00, 'monthly',
   ARRAY['bank_transfer','paypal'],
   ARRAY['US'],
   'PartyPoker Partners / partycasinopartners.com. CPA $150 per qualifying FTD ≥$20. No RevShare option currently. Monthly bank/PayPal payouts. Signup: partycasinopartners.com',
   FALSE, TRUE),

  -- 5. WPT Global — 40% RevShare, biweekly
  ('WPT Global', 'wpt-global', 'revenue_share',
   40.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 100.00, 'biweekly',
   ARRAY['bank_transfer','crypto'],
   ARRAY[],
   'WPT Global Affiliates. 40% RevShare — best poker RevShare rate we carry. Negative carryover resets quarterly (very favourable). Biweekly payments. Crypto deposits accepted. Signup: affiliates.wptglobal.com',
   FALSE, TRUE),

  -- 6. ClubGG — 30% Rakeback, weekly crypto
  ('ClubGG', 'clubgg', 'rakeback',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   30.00::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 25.00, 'weekly',
   ARRAY['crypto'],
   ARRAY[],
   'GGNetwork ClubGG. 30% rakeback to players via club structure. Agent manages player pool directly and earns sub-affiliate share. Weekly crypto payouts. Ideal for club-app players.',
   FALSE, TRUE),

  -- 7. ACR Poker — 27% Rakeback, weekly crypto, US-friendly
  ('ACR Poker', 'acr-poker', 'rakeback',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   27.00::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 3.00, 25.00, 'weekly',
   ARRAY['bitcoin','litecoin','bank_transfer','zelle'],
   ARRAY[],
   'WPN Affiliates (wpn.com/affiliates). 27% instant rakeback to players. US players accepted. Weekly crypto payouts. Agent earns 3% sub-affiliate on referred player rake. Soft cash games.',
   FALSE, TRUE),

  -- 8. PPPoker — 30% Rakeback, agent model
  ('PPPoker', 'pppoker', 'rakeback',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   30.00::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 25.00, 'weekly',
   ARRAY['bitcoin','usdt'],
   ARRAY[],
   'PPPoker agent referral program. 30% rakeback via private club structure. Agent controls player pool and rake distribution. Weekly crypto settlement. Global private club network.',
   FALSE, TRUE),

  -- 9. Stake — 40% RevShare, weekly crypto (best casino deal)
  ('Stake', 'stake', 'revenue_share',
   40.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 50.00, 'weekly',
   ARRAY['bitcoin','ethereum','litecoin','usdt','xrp','bnb'],
   ARRAY['US','GB','AU','NL','DE','SE','DK','NO','ES','FR'],
   'Stake Affiliates (stake.com/affiliates). 40% RevShare on casino — our best crypto casino deal. Promo code system for player tracking. Weekly crypto payouts from $50 minimum. Neg carryover resets monthly. Use referral code for player tracking.',
   FALSE, TRUE),

  -- 10. Betway — CPA $100 per FTD, regulated
  ('Betway', 'betway', 'cpa',
   NULL::NUMERIC, 100.00::NUMERIC, 'USD', 10.00::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 0.00, 100.00, 'monthly',
   ARRAY['bank_transfer','paypal','neteller'],
   ARRAY['US','AU'],
   'Betway Partners (betwaypartners.com). CPA $100 per FTD ≥$10 on sports/casino. RevShare available on request. Regulated markets only (UK, Canada, South Africa, Europe). Monthly payouts.',
   FALSE, TRUE),

  -- 11. bet365 — CPA $120 per FTD, tier 1 regulated
  ('bet365', 'bet365', 'cpa',
   NULL::NUMERIC, 120.00::NUMERIC, 'USD', 10.00::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 0.00, 100.00, 'monthly',
   ARRAY['bank_transfer'],
   ARRAY['US','AU'],
   '365 Affiliates (365affiliates.com). CPA $120 per qualified FTD. Selective program — requires traffic quality review. Tier 1 regulated markets (UK, Europe, Canada). Monthly bank transfer.',
   FALSE, TRUE),

  -- 12. BitStarz — CPA €150 per FTD, award-winning BTC casino
  ('BitStarz', 'bitstarz', 'cpa',
   NULL::NUMERIC, 150.00::NUMERIC, 'EUR', 20.00::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 0.00, 100.00, 'monthly',
   ARRAY['bitcoin','ethereum','litecoin','dogecoin','usdt','bank_transfer'],
   ARRAY[],
   'BitStarz Partners (bitstarzpartners.com). CPA €150 per FTD ≥€20 or RevShare 25-40% hybrid available. Award-winning BTC casino (Best Casino multiple years). Fast 24h payouts. Monthly crypto/fiat. Signup: bitstarzpartners.com',
   FALSE, TRUE),

  -- 13. Roobet — 25% RevShare, weekly crypto
  ('Roobet', 'roobet', 'revenue_share',
   25.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 50.00, 'weekly',
   ARRAY['bitcoin','ethereum','litecoin','dogecoin'],
   ARRAY['US','GB','AU'],
   'Roobet Partners. 25% RevShare on house edge + 1% of referred player wager volume as sub-affiliate share. Strong streamer/influencer culture. Weekly crypto payouts. Referral code tracking.',
   FALSE, TRUE),

  -- 14. Cloudbet — tiered RevShare up to 50%
  ('Cloudbet', 'cloudbet', 'revenue_share',
   30.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   TRUE, 5.00, 100.00, 'monthly',
   ARRAY['bitcoin','ethereum','usdt','litecoin','cardano'],
   ARRAY[],
   'Cloudbet Affiliates (affiliates.cloudbet.com). Tiered RevShare: 25% base → 30% standard → 50% at high volume. Negative carryover resets quarterly. BTC casino + sports. Long 90-day cookie. Monthly BTC payouts. Signup: affiliates.cloudbet.com',
   FALSE, TRUE),

  -- 15. BC.Game — up to 50% RevShare, weekly crypto
  ('BC.Game', 'bc-game', 'revenue_share',
   35.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 50.00, 'weekly',
   ARRAY['bitcoin','ethereum','usdt','litecoin','dogecoin','bnb','trx','xrp'],
   ARRAY['US','UK','FR'],
   'BC.Game Partners. 35% base RevShare → 50% at volume. Weekly multi-crypto payouts. 10,000+ games. BCG token rewards for players. Sub-affiliate: 5%. No negative carryover. Signup: bc.game/partners',
   FALSE, TRUE),

  -- 16. Rollbit — 25% RevShare (house edge share), daily payouts
  ('Rollbit', 'rollbit', 'revenue_share',
   25.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 10.00, 'weekly',
   ARRAY['bitcoin','ethereum','solana','usdt'],
   ARRAY['US','GB','AU'],
   'Rollbit Affiliates. 25% of house edge on referred player bets. Daily crypto payouts (min $10). RLB token staking bonuses for affiliates. NFT integration unique selling point. Signup: rollbit.com/affiliates',
   FALSE, TRUE),

  -- 17. Duelbits — Hybrid 30% RevShare + $75 CPA, weekly crypto
  ('Duelbits', 'duelbits', 'hybrid',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', 20.00::NUMERIC,
   NULL::NUMERIC, 30.00::NUMERIC, 75.00::NUMERIC,
   FALSE, 3.00, 50.00, 'weekly',
   ARRAY['bitcoin','ethereum','litecoin','dogecoin','usdt'],
   ARRAY['US','GB'],
   'Duelbits Partners. Hybrid: 30% RevShare + $75 CPA per FTD ≥$20. Weekly crypto payouts. Casino + Sports betting. Rakeback loyalty program for players. Signup: duelbits.com/affiliates',
   FALSE, TRUE),

  -- 18. Bovada — CPA $150 per qualifying US player
  ('Bovada', 'bovada', 'cpa',
   NULL::NUMERIC, 150.00::NUMERIC, 'USD', 50.00::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 0.00, 100.00, 'monthly',
   ARRAY['bitcoin','bitcoin_cash','vouchers'],
   ARRAY[],
   'Bovada Affiliates. CPA $150 per qualifying FTD ≥$50 (poker/casino). US-only traffic. RevShare: 25% available. Monthly BTC payouts. Best US-facing brand for poker + casino + sports. Signup: bovadaaffiliate.com',
   FALSE, TRUE),

  -- 19. BetOnline — 25% RevShare, US-friendly
  ('BetOnline', 'betonline', 'revenue_share',
   25.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 3.00, 100.00, 'monthly',
   ARRAY['bitcoin','ethereum','litecoin','bank_transfer','credit_card'],
   ARRAY[],
   'BetOnline Affiliates (betonlineaffiliates.ag). 25% RevShare sports + poker + casino. US players accepted. Monthly crypto/bank payouts. CPA available on request. Signup: betonlineaffiliates.ag',
   FALSE, TRUE),

  -- 20. Natural8 — 40% Rakeback, GGNetwork, weekly
  ('Natural8', 'natural8', 'rakeback',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   40.00::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 5.00, 25.00, 'weekly',
   ARRAY['bitcoin','ethereum','skrill','neteller','bank_transfer'],
   ARRAY['US'],
   'Natural8 Affiliates (GGNetwork skin). 40% rakeback — highest rakeback we carry for poker. No negative carryover. Weekly payouts. WSOP partnership. Ideal for serious cash game grinders. Signup: natural8.com/affiliates',
   FALSE, TRUE),

  -- 21. PokerKing — 30% Rakeback, WPN, weekly crypto
  ('PokerKing', 'pokerking', 'rakeback',
   NULL::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   30.00::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 3.00, 25.00, 'weekly',
   ARRAY['bitcoin','ethereum','litecoin','zelle'],
   ARRAY[],
   'WPN Affiliates — PokerKing skin. 30% rakeback. Agent referral model ideal for sub-affiliate network building. Weekly crypto payouts. US players accepted. Signup: wpn.com/affiliates',
   FALSE, TRUE),

  -- 22. Wild.io — up to 45% RevShare, crypto
  ('Wild.io', 'wild-io', 'revenue_share',
   35.00::NUMERIC, NULL::NUMERIC, 'USD', NULL::NUMERIC,
   NULL::NUMERIC, NULL::NUMERIC, NULL::NUMERIC,
   FALSE, 3.00, 50.00, 'monthly',
   ARRAY['bitcoin','ethereum','litecoin','usdt','dogecoin'],
   ARRAY['US','GB'],
   'Wild.io Partners. 35% RevShare standard → 45% negotiable at volume. Emerging crypto casino with Pragmatic Play and Hacksaw Gaming content. Monthly crypto payouts. VIP cashback for players. Signup: wild.io/affiliates',
   FALSE, TRUE)

) AS v(
  operator_name, operator_slug, deal_type,
  revenue_share_pct, cpa_amount, cpa_currency, cpa_min_deposit,
  rakeback_pct, hybrid_revshare_pct, hybrid_cpa_amount,
  negative_carryover, sub_affiliate_pct, min_payout,
  payment_frequency, payment_methods, geo_restrictions, deal_notes,
  is_exclusive, is_active
)
LEFT JOIN public.sites s ON s.slug = v.operator_slug
ON CONFLICT (operator_slug) DO UPDATE SET
  deal_type = EXCLUDED.deal_type,
  revenue_share_pct = EXCLUDED.revenue_share_pct,
  cpa_amount = EXCLUDED.cpa_amount,
  cpa_currency = EXCLUDED.cpa_currency,
  cpa_min_deposit = EXCLUDED.cpa_min_deposit,
  rakeback_pct = EXCLUDED.rakeback_pct,
  hybrid_revshare_pct = EXCLUDED.hybrid_revshare_pct,
  hybrid_cpa_amount = EXCLUDED.hybrid_cpa_amount,
  negative_carryover = EXCLUDED.negative_carryover,
  sub_affiliate_pct = EXCLUDED.sub_affiliate_pct,
  min_payout = EXCLUDED.min_payout,
  payment_frequency = EXCLUDED.payment_frequency,
  payment_methods = EXCLUDED.payment_methods,
  geo_restrictions = EXCLUDED.geo_restrictions,
  deal_notes = EXCLUDED.deal_notes,
  is_exclusive = EXCLUDED.is_exclusive,
  updated_at = NOW();

-- =====================
-- VERIFY: Show seeded deals summary
-- =====================
-- SELECT operator_name, deal_type,
--   COALESCE(revenue_share_pct::TEXT || '% RevShare', '') ||
--   COALESCE(rakeback_pct::TEXT || '% Rakeback', '') ||
--   COALESCE('$' || cpa_amount::TEXT || ' CPA', '') AS rate,
--   payment_frequency, negative_carryover
-- FROM public.operator_deals
-- WHERE is_active = TRUE
-- ORDER BY deal_type, operator_name;
