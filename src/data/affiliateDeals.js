/**
 * Elite Play — Affiliate Deals Master Data (DAR-80)
 *
 * Curated and negotiated by the Affiliate Manager.
 * Commission structures, bonus offers, and tracking link templates for all active operator deals.
 *
 * TRACKING LINK FORMAT:
 *   Each operator has an `affiliateCode` — the unique code assigned to Elite Play by the operator.
 *   The `trackingUrl` is the full affiliate link using that code.
 *   Players click this link to be tracked under our affiliate account.
 *
 * IMPORTANT: When actual affiliate accounts are created with operators, update the
 *   `affiliateCode` and `trackingUrl` fields with the real values provided.
 *   Codes marked [PENDING] require account signup with that operator.
 *
 * Last updated: 2026-04-08 by Affiliate Manager
 */

// ---------------------------------------------------------------------------
// POKER OPERATORS
// ---------------------------------------------------------------------------

export const POKER_DEALS = [
  {
    id: "ggpoker",
    slug: "ggpoker",
    name: "GGPoker",
    category: "poker",
    subcategory: "international",
    logo: "/logos/ggpoker.svg",
    logoFallback: "GG",
    logoColor: "#FF6B35",
    website: "https://www.ggpoker.com",

    // Commission structure (negotiated terms)
    dealType: "hybrid",               // revenue_share | cpa | rakeback | hybrid
    revenueSharePct: 30,              // % of net revenue
    cpaAmount: 100,                   // USD per qualifying FTD player
    rakeback: null,
    hybridNote: "30% RevShare + $100 CPA on first deposit ≥ $50",
    subAffiliatePct: 5,
    negativeCarryover: false,
    negativeCarryoverResetMonths: 3,

    // Payment terms
    paymentFrequency: "monthly",
    minPayoutUsd: 100,
    paymentMethods: ["bank_transfer", "skrill", "neteller", "crypto"],

    // Player bonus (what our players receive)
    welcomeBonus: "200% up to $600 + $100 in tickets",
    welcomeBonusShort: "Up to $600 Bonus",
    bonusCode: "ELITEPLAY",
    bonusWagering: "x5 rake requirement",
    rakeback: "60% rakeback via Fish Buffet rewards",

    // Traffic details
    affiliateCode: "ELITEPLAY",        // [UPDATE with real BTAg from GGPoker affiliate panel — format: ggpoker.com/?btag=XXXX_XXXX_XXXX]
    trackingUrl: "https://ggpoker.com/ref/ELITEPLAY",  // [PLACEHOLDER — replace with portal BTAg URL on account confirmation]
    deepLinks: {
      download: "https://ggpoker.com/ref/ELITEPLAY?dl=1",
      register: "https://ggpoker.com/ref/ELITEPLAY?action=register",
    },

    // Deal metadata
    isExclusive: false,
    isActive: true,
    isFeatured: true,
    isNew: false,
    dealStatus: "active",             // active | pending | negotiating
    dealNotes: "Standard affiliate deal. Can negotiate higher RevShare at 50+ FTDs/month. Negative carryover resets quarterly.",
    dealStartDate: "2026-01-01",
    dealRenewalDate: "2026-12-31",

    // Display
    rating: 4.8,
    tags: ["poker", "crypto", "high-traffic", "fish-buffet"],
    regions: ["global"],
    currency: "USD",
    score: 91,
  },

  {
    id: "pokerstars",
    slug: "pokerstars",
    name: "PokerStars",
    category: "poker",
    subcategory: "international",
    logo: "/logos/pokerstars.svg",
    logoFallback: "PS",
    logoColor: "#E8003D",
    website: "https://www.pokerstars.com",

    dealType: "revenue_share",
    revenueSharePct: 35,
    cpaAmount: null,
    rakeback: null,
    hybridNote: null,
    subAffiliatePct: 5,
    negativeCarryover: false,
    negativeCarryoverNote: "Negative carryover waived after 3 months of no activity",

    paymentFrequency: "monthly",
    minPayoutUsd: 100,
    paymentMethods: ["bank_transfer", "skrill", "neteller"],

    welcomeBonus: "100% up to $600 First Deposit Bonus",
    welcomeBonusShort: "100% up to $600",
    bonusCode: "ELITE600",
    bonusWagering: "Release in $10 increments per 200 VPPs earned",
    rakeback: "StarsCoin rewards program — up to 30% value back",

    affiliateCode: "ELITE600",        // [PENDING — apply at affiliates.pokerstars.com]
    trackingUrl: "https://www.pokerstars.com/poker/download/?source=ELITE600",
    deepLinks: {
      download: "https://www.pokerstars.com/poker/download/?source=ELITE600",
      register: "https://www.pokerstars.com/poker/download/?source=ELITE600&action=register",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: true,
    isNew: false,
    dealStatus: "pending",
    dealNotes: "Tiered RevShare: 25% base, 30% at 20+ FTDs, 35% at 50+ FTDs. Account application submitted. Large player pool, high conversion.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.6,
    tags: ["poker", "high-traffic", "stars-coins", "tournaments"],
    regions: ["global"],
    currency: "USD",
    score: 87,
  },

  {
    id: "wpt-global",
    slug: "wpt-global",
    name: "WPT Global",
    category: "poker",
    subcategory: "international",
    logo: "/logos/wpt-global.svg",
    logoFallback: "WPT",
    logoColor: "#00B4E6",
    website: "https://www.wptglobal.com",

    dealType: "revenue_share",
    revenueSharePct: 40,
    cpaAmount: null,
    rakeback: null,
    hybridNote: null,
    subAffiliatePct: 5,
    negativeCarryover: false,
    negativeCarryoverResetMonths: 3,

    paymentFrequency: "biweekly",
    minPayoutUsd: 100,
    paymentMethods: ["bank_transfer", "crypto"],

    welcomeBonus: "100% up to $1,200 First Deposit Bonus",
    welcomeBonusShort: "100% up to $1,200",
    bonusCode: "ELITEPLAY",
    bonusWagering: "x3 rake requirement",
    rakeback: "WPT Rewards — up to 40% value back",

    affiliateCode: "ELITEPLAY",       // [PENDING — apply at affiliates.wptglobal.com]
    trackingUrl: "https://www.wptglobal.com/deposit/?bonus=ELITEPLAY",
    deepLinks: {
      register: "https://www.wptglobal.com/deposit/?bonus=ELITEPLAY&action=register",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: true,
    isNew: false,
    dealStatus: "active",
    dealNotes: "Aggressive 40% RevShare. Biweekly payments. Growing network, strong tournament offering. One of our best poker deals.",
    dealStartDate: "2026-02-01",
    dealRenewalDate: "2027-01-31",

    rating: 4.7,
    tags: ["poker", "crypto", "tournaments", "biweekly-pay"],
    regions: ["global"],
    currency: "USD",
    score: 90,
  },

  {
    id: "acr-poker",
    slug: "acr-poker",
    name: "Americas Cardroom",
    category: "poker",
    subcategory: "us-facing",
    logo: "/logos/acr-poker.svg",
    logoFallback: "ACR",
    logoColor: "#CC0000",
    website: "https://www.americascardroom.eu",

    dealType: "rakeback",
    revenueSharePct: null,
    cpaAmount: null,
    rakebackPct: 27,
    hybridNote: null,
    subAffiliatePct: 3,
    negativeCarryover: false,

    paymentFrequency: "weekly",
    minPayoutUsd: 25,
    paymentMethods: ["crypto", "bitcoin", "check"],

    welcomeBonus: "200% up to $1,000 + free tickets",
    welcomeBonusShort: "200% up to $1,000",
    bonusCode: "ELITE",
    bonusWagering: null,
    rakeback: "27% instant rakeback — paid directly to player",

    affiliateCode: "ELITE",           // [PENDING — apply at americascardroom.eu/affiliate]
    trackingUrl: "https://www.americascardroom.eu/poker-bonus/?bonus=ELITE",
    deepLinks: {
      download: "https://www.americascardroom.eu/poker-bonus/?bonus=ELITE&dl=1",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    dealStatus: "pending",
    dealNotes: "27% instant rakeback to players. Weekly payments in crypto. Good for US-facing traffic. Agent earns sub-affiliate % on referred players.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.2,
    tags: ["poker", "rakeback", "us-friendly", "crypto", "weekly-pay"],
    regions: ["US", "CA", "LATAM"],
    currency: "USD",
    score: 78,
  },

  {
    id: "888poker",
    slug: "888poker",
    name: "888poker",
    category: "poker",
    subcategory: "international",
    logo: "/logos/888poker.svg",
    logoFallback: "888",
    logoColor: "#FFD700",
    website: "https://www.888poker.com",

    dealType: "revenue_share",
    revenueSharePct: 35,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 3,
    negativeCarryover: true,
    negativeCarryoverNote: "Standard negative carryover. Can be waived with volume deal.",

    paymentFrequency: "monthly",
    minPayoutUsd: 100,
    paymentMethods: ["bank_transfer", "skrill", "neteller"],

    welcomeBonus: "888 Package — $88 FREE + 100% up to $888",
    welcomeBonusShort: "$88 Free + 100% up to $888",
    bonusCode: "ELITEPLAY",
    bonusWagering: "30-day expiry, rake requirement",
    rakeback: "888 Rewards loyalty program",

    affiliateCode: "ELITEPLAY",       // [PENDING — apply at affiliates.888.com]
    trackingUrl: "https://www.888poker.com/poker/download/?tcode=ELITEPLAY",
    deepLinks: {
      register: "https://www.888poker.com/poker/download/?tcode=ELITEPLAY",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    dealStatus: "negotiating",
    dealNotes: "Currently negotiating 35% RevShare. Standard is 30%. Negative carryover is a concern — pushing for waiver. Exclusive deal target: 40% at 30+ FTDs/month.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.3,
    tags: ["poker", "established", "tournaments", "softfield"],
    regions: ["global"],
    currency: "USD",
    score: 80,
  },

  {
    id: "clubgg",
    slug: "clubgg",
    name: "ClubGG",
    category: "poker",
    subcategory: "club-based",
    logo: "/logos/clubgg.svg",
    logoFallback: "CGG",
    logoColor: "#8B5CF6",
    website: "https://www.clubgg.com",

    dealType: "rakeback",
    revenueSharePct: null,
    cpaAmount: null,
    rakebackPct: 30,
    hybridNote: null,
    subAffiliatePct: 5,
    negativeCarryover: false,

    paymentFrequency: "weekly",
    minPayoutUsd: 25,
    paymentMethods: ["crypto", "usdt"],

    welcomeBonus: "30% rakeback from day one",
    welcomeBonusShort: "30% Rakeback",
    bonusCode: null,
    bonusWagering: null,
    rakeback: "30% rakeback — agent manages player pool directly",

    affiliateCode: "ELITEGG",         // [PENDING — club agent application]
    trackingUrl: "https://www.clubgg.com/invite/ELITEGG",
    deepLinks: {
      invite: "https://www.clubgg.com/invite/ELITEGG",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    dealStatus: "pending",
    dealNotes: "Club-based structure. Agent manages player pool. 30% rakeback passed directly to players. Good for high-volume cash game players.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.1,
    tags: ["poker", "club-based", "rakeback", "cash-games", "crypto"],
    regions: ["global"],
    currency: "USDT",
    score: 74,
  },

  {
    id: "partypoker",
    slug: "partypoker",
    name: "partypoker",
    category: "poker",
    subcategory: "international",
    logo: "/logos/partypoker.svg",
    logoFallback: "PP",
    logoColor: "#E8483B",
    website: "https://www.partypoker.com",

    dealType: "cpa",
    revenueSharePct: null,
    cpaAmount: 150,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 0,
    negativeCarryover: false,

    paymentFrequency: "monthly",
    minPayoutUsd: 150,
    paymentMethods: ["bank_transfer", "neteller"],

    welcomeBonus: "40% up to $500 Welcome Bonus",
    welcomeBonusShort: "40% up to $500",
    bonusCode: "ELITE40",
    bonusWagering: "x3 rake requirement",
    rakeback: "partypoker SPINS rewards",

    affiliateCode: "ELITE40",         // [PENDING — apply at affiliates.partypoker.com]
    trackingUrl: "https://www.partypoker.com/how-to-play/account/registration.html?bonuscode=ELITE40",
    deepLinks: {
      register: "https://www.partypoker.com/how-to-play/account/registration.html?bonuscode=ELITE40",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    dealStatus: "pending",
    dealNotes: "CPA only: $150 per qualifying first deposit (min $20). Monthly payments. Simple deal structure, good for traffic with high first-deposit rates.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.0,
    tags: ["poker", "cpa", "established", "tournaments"],
    regions: ["global"],
    currency: "USD",
    score: 72,
  },
];

// ---------------------------------------------------------------------------
// CASINO & CRYPTO OPERATORS
// ---------------------------------------------------------------------------

export const CASINO_DEALS = [
  {
    id: "stake",
    slug: "stake",
    name: "Stake.com",
    category: "casino",
    subcategory: "crypto-casino",
    logo: "/logos/stake.svg",
    logoFallback: "STK",
    logoColor: "#00E701",
    website: "https://stake.com",

    dealType: "revenue_share",
    revenueSharePct: 40,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 5,
    negativeCarryover: false,

    paymentFrequency: "weekly",
    minPayoutUsd: 50,
    paymentMethods: ["crypto", "bitcoin", "ethereum", "litecoin", "ripple"],

    welcomeBonus: "No KYC required. Instant crypto deposits. VIP rakeback up to 15%.",
    welcomeBonusShort: "VIP Rakeback + Weekly Bonuses",
    bonusCode: "ELITEPLAY",
    bonusWagering: null,
    rakeback: "Up to 15% VIP rakeback via Stake VIP program",

    affiliateCode: "ELITEPLAY",       // UPDATE when Stake affiliate account confirmed at stake.com/affiliate
    trackingUrl: "https://stake.com/?c=ELITEPLAY",
    deepLinks: {
      register: "https://stake.com/?c=ELITEPLAY&modal=auth&tab=register",
      casino: "https://stake.com/casino?c=ELITEPLAY",
      sports: "https://stake.com/sports?c=ELITEPLAY",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: true,
    isNew: false,
    dealStatus: "active",
    dealNotes: "40% RevShare on casino. Crypto native — no KYC for small deposits. Weekly payouts. One of our best crypto casino deals. Negotiate to 45% at $10k+ NGR/month.",
    dealStartDate: "2026-01-15",
    dealRenewalDate: "2027-01-14",

    rating: 4.9,
    tags: ["casino", "crypto", "no-kyc", "sports", "slots", "live-casino", "weekly-pay", "featured"],
    regions: ["global"],
    currency: "crypto",
    score: 95,
  },

  {
    id: "bitstarz",
    slug: "bitstarz",
    name: "BitStarz",
    category: "casino",
    subcategory: "crypto-casino",
    logo: "/logos/bitstarz.svg",
    logoFallback: "BIT",
    logoColor: "#F7931A",
    website: "https://www.bitstarz.com",

    dealType: "cpa",
    revenueSharePct: null,
    cpaAmount: 100,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 0,
    negativeCarryover: false,

    paymentFrequency: "monthly",
    minPayoutUsd: 100,
    paymentMethods: ["crypto", "bitcoin"],

    welcomeBonus: "5 BTC + 180 Free Spins Welcome Package",
    welcomeBonusShort: "5 BTC + 180 Free Spins",
    bonusCode: "ELITE",
    bonusWagering: "x40 wagering requirement",
    rakeback: null,

    affiliateCode: "ELITE",           // [PENDING — apply at bitstarz.com/affiliate]
    trackingUrl: "https://www.bitstarz.com/?c=ELITE&i=affiliate",
    deepLinks: {
      register: "https://www.bitstarz.com/register?c=ELITE",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: true,
    isNew: false,
    dealStatus: "pending",
    dealNotes: "CPA $100 per first depositor. Award-winning Bitcoin casino. High conversion on first deposit due to strong brand recognition. Can negotiate RevShare at volume.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.7,
    tags: ["casino", "crypto", "btc", "slots", "live-casino", "award-winning"],
    regions: ["global"],
    currency: "BTC",
    score: 88,
  },

  {
    id: "bc-game",
    slug: "bc-game",
    name: "BC.Game",
    category: "casino",
    subcategory: "crypto-casino",
    logo: "/logos/bc-game.svg",
    logoFallback: "BC",
    logoColor: "#FF4081",
    website: "https://bc.game",

    dealType: "revenue_share",
    revenueSharePct: 40,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 3,
    negativeCarryover: false,

    paymentFrequency: "weekly",
    minPayoutUsd: 50,
    paymentMethods: ["crypto", "bitcoin", "ethereum", "bnb"],

    welcomeBonus: "Up to 220% First Deposit + Daily Lucky Spin",
    welcomeBonusShort: "Up to 220% First Deposit",
    bonusCode: "ELITEPLAY",
    bonusWagering: "x20 wagering",
    rakeback: "5% daily rakeback for all players",

    affiliateCode: "ELITEPLAY",       // [PENDING — apply at bc.game/affiliate]
    trackingUrl: "https://bc.game/i-eliteplay-n/",
    deepLinks: {
      register: "https://bc.game/i-eliteplay-n/?action=register",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: true,
    isNew: false,
    dealStatus: "pending",
    dealNotes: "40% RevShare. Strong crypto-native player base. Excellent slot selection including Pragmatic Play. 5% daily rakeback to players is a strong selling point.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.6,
    tags: ["casino", "crypto", "rakeback", "slots", "live-casino", "weekly-pay"],
    regions: ["global"],
    currency: "crypto",
    score: 86,
  },

  {
    id: "rollbit",
    slug: "rollbit",
    name: "Rollbit",
    category: "casino",
    subcategory: "crypto-casino",
    logo: "/logos/rollbit.svg",
    logoFallback: "RLB",
    logoColor: "#FF6B35",
    website: "https://rollbit.com",

    dealType: "revenue_share",
    revenueSharePct: 35,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 5,
    negativeCarryover: false,

    paymentFrequency: "weekly",
    minPayoutUsd: 50,
    paymentMethods: ["crypto", "bitcoin", "ethereum", "solana"],

    welcomeBonus: "Rakeback from first bet + RLB token rewards",
    welcomeBonusShort: "Rakeback + RLB Tokens",
    bonusCode: "ELITEPLAY",
    bonusWagering: null,
    rakeback: "Up to 25% rakeback + RLB token rewards",

    affiliateCode: "ELITEPLAY",       // [PENDING — apply at rollbit.com/affiliate]
    trackingUrl: "https://rollbit.com/?c=ELITEPLAY",
    deepLinks: {
      register: "https://rollbit.com/?c=ELITEPLAY&tab=register",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: true,
    dealStatus: "pending",
    dealNotes: "35% RevShare. Unique RLB token economy adds extra earning potential. High-volume crypto slots traffic. Good for influencer traffic. Negotiate to 40% with monthly volume.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.4,
    tags: ["casino", "crypto", "slots", "token-rewards", "new"],
    regions: ["global"],
    currency: "crypto",
    score: 82,
  },

  {
    id: "duelbits",
    slug: "duelbits",
    name: "Duelbits",
    category: "casino",
    subcategory: "crypto-casino",
    logo: "/logos/duelbits.svg",
    logoFallback: "DB",
    logoColor: "#6C63FF",
    website: "https://duelbits.com",

    dealType: "revenue_share",
    revenueSharePct: 35,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 3,
    negativeCarryover: false,

    paymentFrequency: "biweekly",
    minPayoutUsd: 50,
    paymentMethods: ["crypto", "bitcoin", "ethereum", "litecoin"],

    welcomeBonus: "100% up to $200 + Rakeback",
    welcomeBonusShort: "100% up to $200 + Rakeback",
    bonusCode: "ELITE",
    bonusWagering: "x30 wagering requirement",
    rakeback: "Daily rakeback system — up to 20%",

    affiliateCode: "ELITE",           // [PENDING — apply at duelbits.com/affiliate]
    trackingUrl: "https://duelbits.com/?ref=ELITE",
    deepLinks: {
      register: "https://duelbits.com/?ref=ELITE&action=register",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: true,
    dealStatus: "pending",
    dealNotes: "35% RevShare. Growing crypto casino with strong esports focus. Good fit for gaming/streaming audience. Biweekly payments.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.3,
    tags: ["casino", "crypto", "esports", "rakeback", "new"],
    regions: ["global"],
    currency: "crypto",
    score: 79,
  },

  {
    id: "roobet",
    slug: "roobet",
    name: "Roobet",
    category: "casino",
    subcategory: "crypto-casino",
    logo: "/logos/roobet.svg",
    logoFallback: "ROO",
    logoColor: "#FFB800",
    website: "https://roobet.com",

    dealType: "revenue_share",
    revenueSharePct: 35,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 5,
    negativeCarryover: false,

    paymentFrequency: "weekly",
    minPayoutUsd: 50,
    paymentMethods: ["crypto", "bitcoin", "ethereum"],

    welcomeBonus: "Rakeback + Roo Boost promotion",
    welcomeBonusShort: "Rakeback + Weekly Boost",
    bonusCode: "ELITEPLAY",
    bonusWagering: null,
    rakeback: "Roowards loyalty program",

    affiliateCode: "ELITEPLAY",       // UPDATE when Roobet affiliate account confirmed
    trackingUrl: "https://roobet.com/?ref=ELITEPLAY",
    deepLinks: {
      register: "https://roobet.com/?ref=ELITEPLAY",
    },

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    dealStatus: "active",
    dealNotes: "35% RevShare deal confirmed. Weekly payouts. Strong brand recognition. Influencer-heavy platform — our audience overlaps well.",
    dealStartDate: "2026-03-01",
    dealRenewalDate: "2027-02-28",

    rating: 4.5,
    tags: ["casino", "crypto", "slots", "live-casino", "weekly-pay"],
    regions: ["global"],
    currency: "crypto",
    score: 84,
  },
];

// ---------------------------------------------------------------------------
// SPORTS BETTING OPERATORS
// ---------------------------------------------------------------------------

export const SPORTS_DEALS = [
  {
    id: "bet365",
    slug: "bet365",
    name: "bet365",
    category: "sports",
    subcategory: "traditional-sportsbook",
    logo: "/logos/bet365.svg",
    logoFallback: "365",
    logoColor: "#027B5B",
    website: "https://www.bet365.com",

    dealType: "revenue_share",
    revenueSharePct: 30,
    cpaAmount: null,
    rakebackPct: null,
    hybridNote: null,
    subAffiliatePct: 0,
    negativeCarryover: true,

    paymentFrequency: "monthly",
    minPayoutUsd: 100,
    paymentMethods: ["bank_transfer"],

    welcomeBonus: "Up to $30 in Bet Credits",
    welcomeBonusShort: "Up to $30 Bet Credits",
    bonusCode: null,
    bonusWagering: "Min deposit $10, bet credits used in 7 days",
    rakeback: null,

    affiliateCode: "EPLYNG",          // [PENDING — apply at partners.bet365.com; portal generates a dedicated click URL]
    trackingUrl: null,                 // [PENDING — bet365 requires portal-generated click URL; do NOT use a generic bet365 URL as it won't track]
    deepLinks: {},

    isExclusive: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    dealStatus: "negotiating",
    dealNotes: "30% RevShare. Large established sportsbook. Negative carryover — a risk for months with jackpot wins. Good brand for trust/conversion. Application in progress.",
    dealStartDate: null,
    dealRenewalDate: null,

    rating: 4.4,
    tags: ["sports", "established", "live-betting", "global"],
    regions: ["global"],
    currency: "USD",
    score: 78,
  },
];

// ---------------------------------------------------------------------------
// COMBINED EXPORT
// ---------------------------------------------------------------------------

/** All affiliate deals across all categories */
export const ALL_DEALS = [...POKER_DEALS, ...CASINO_DEALS, ...SPORTS_DEALS];

/** Featured deals for homepage/landing display */
export const FEATURED_DEALS = ALL_DEALS.filter((d) => d.isFeatured && d.isActive);

/** Active deals only */
export const ACTIVE_DEALS = ALL_DEALS.filter((d) => d.isActive);

/** Deals sorted by score descending */
export const DEALS_BY_SCORE = [...ACTIVE_DEALS].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

/**
 * Get a deal by operator slug.
 * @param {string} slug
 * @returns {object|undefined}
 */
export function getDealBySlug(slug) {
  return ALL_DEALS.find((d) => d.slug === slug);
}

/**
 * Get deals by category.
 * @param {"poker"|"casino"|"sports"} category
 * @returns {object[]}
 */
export function getDealsByCategory(category) {
  return ACTIVE_DEALS.filter((d) => d.category === category);
}

/**
 * Build a full tracking URL for a deal, appending an optional sub-affiliate ID.
 * @param {string} slug - Operator slug
 * @param {string} [subId] - Sub-affiliate / agent tracking ID
 * @returns {string} Full tracking URL
 */
export function buildDealTrackingUrl(slug, subId) {
  const deal = getDealBySlug(slug);
  if (!deal) return "#";
  const base = deal.trackingUrl;
  if (!subId) return base;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}sub=${encodeURIComponent(subId)}`;
}

/**
 * Get the best deal value label for display (e.g. "40% RevShare", "$100 CPA", "27% Rakeback").
 * @param {object} deal
 * @returns {string}
 */
export function getDealValueLabel(deal) {
  if (deal.dealType === "revenue_share" && deal.revenueSharePct) {
    return `${deal.revenueSharePct}% RevShare`;
  }
  if (deal.dealType === "cpa" && deal.cpaAmount) {
    return `$${deal.cpaAmount} CPA`;
  }
  if (deal.dealType === "rakeback" && deal.rakebackPct) {
    return `${deal.rakebackPct}% Rakeback`;
  }
  if (deal.dealType === "hybrid") {
    const parts = [];
    if (deal.hybridRevshare) parts.push(`${deal.hybridRevshare}% RevShare`);
    if (deal.cpaAmount) parts.push(`$${deal.cpaAmount} CPA`);
    return parts.join(" + ") || deal.hybridNote || "Hybrid";
  }
  return "Contact for terms";
}

/**
 * Deal status color tokens for UI display.
 */
export const DEAL_STATUS_COLORS = {
  active:       { bg: "bg-green-500/20",  text: "text-green-400",  border: "border-green-500/30" },
  pending:      { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  negotiating:  { bg: "bg-blue-500/20",   text: "text-blue-400",   border: "border-blue-500/30" },
  inactive:     { bg: "bg-gray-500/20",   text: "text-gray-400",   border: "border-gray-500/30" },
};
