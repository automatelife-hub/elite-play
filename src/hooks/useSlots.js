import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/api/supabaseClient';

// Fallback mock data used when Supabase slots table is not yet seeded
const MOCK_SLOTS = [
  { id: '1', name: 'Gates of Olympus', provider: 'Pragmatic Play', providerLogo: null, rtp: 96.5, liveRtp: 97.8, volatility: 'High', maxWin: 5000, features: ['Free Spins', 'Buy Bonus', 'Multiplier'], thumbnail: null, status: 'Hot', rtpHistory: [95.2, 96.1, 97.0, 96.8, 97.5, 97.8, 97.8] },
  { id: '2', name: 'Sweet Bonanza', provider: 'Pragmatic Play', providerLogo: null, rtp: 96.48, liveRtp: 96.9, volatility: 'High', maxWin: 21100, features: ['Free Spins', 'Buy Bonus', 'Tumble'], thumbnail: null, status: 'Hot', rtpHistory: [94.5, 95.3, 96.1, 96.3, 96.7, 96.9, 96.9] },
  { id: '3', name: 'Big Bass Bonanza', provider: 'Pragmatic Play', providerLogo: null, rtp: 96.71, liveRtp: 95.2, volatility: 'High', maxWin: 2100, features: ['Free Spins', 'Money Collect'], thumbnail: null, status: 'Normal', rtpHistory: [96.9, 96.4, 95.8, 95.5, 95.3, 95.2, 95.2] },
  { id: '4', name: 'Book of Dead', provider: 'Play\'n GO', providerLogo: null, rtp: 96.21, liveRtp: 94.1, volatility: 'High', maxWin: 5000, features: ['Free Spins', 'Expanding Symbols'], thumbnail: null, status: 'Cold', rtpHistory: [96.0, 95.4, 94.8, 94.5, 94.2, 94.1, 94.1] },
  { id: '5', name: 'Starburst', provider: 'NetEnt', providerLogo: null, rtp: 96.09, liveRtp: 96.3, volatility: 'Low', maxWin: 500, features: ['Expanding Wilds', 'Respin'], thumbnail: null, status: 'Normal', rtpHistory: [95.8, 96.0, 96.1, 96.2, 96.3, 96.3, 96.3] },
  { id: '6', name: 'Reactoonz', provider: 'Play\'n GO', providerLogo: null, rtp: 96.51, liveRtp: 98.1, volatility: 'High', maxWin: 4570, features: ['Tumble', 'Multiplier', 'Quantum Leap'], thumbnail: null, status: 'Hot', rtpHistory: [95.0, 96.0, 97.0, 97.5, 97.9, 98.0, 98.1] },
  { id: '7', name: 'Gonzo\'s Quest Megaways', provider: 'NetEnt', providerLogo: null, rtp: 96.00, liveRtp: 95.7, volatility: 'Med', maxWin: 20000, features: ['Megaways', 'Avalanche', 'Free Spins'], thumbnail: null, status: 'Normal', rtpHistory: [96.2, 96.0, 95.9, 95.8, 95.7, 95.7, 95.7] },
  { id: '8', name: 'Megaways Jack', provider: 'iSoftBet', providerLogo: null, rtp: 96.62, liveRtp: 97.2, volatility: 'High', maxWin: 50000, features: ['Megaways', 'Free Spins', 'Buy Bonus'], thumbnail: null, status: 'Hot', rtpHistory: [95.5, 96.0, 96.5, 96.9, 97.0, 97.1, 97.2] },
  { id: '9', name: 'Dead or Alive 2', provider: 'NetEnt', providerLogo: null, rtp: 96.82, liveRtp: 93.5, volatility: 'High', maxWin: 111111, features: ['Free Spins', 'Sticky Wilds'], thumbnail: null, status: 'Cold', rtpHistory: [97.0, 96.5, 95.8, 95.0, 94.2, 93.8, 93.5] },
  { id: '10', name: 'Bonanza Megaways', provider: 'Big Time Gaming', providerLogo: null, rtp: 96.0, liveRtp: 96.6, volatility: 'High', maxWin: 10000, features: ['Megaways', 'Free Spins', 'Unlimited Multiplier'], thumbnail: null, status: 'Normal', rtpHistory: [95.9, 96.0, 96.2, 96.4, 96.5, 96.6, 96.6] },
  { id: '11', name: 'Wolf Gold', provider: 'Pragmatic Play', providerLogo: null, rtp: 96.01, liveRtp: 97.5, volatility: 'Med', maxWin: 5000, features: ['Free Spins', 'Money Respin', 'Jackpot'], thumbnail: null, status: 'Hot', rtpHistory: [95.0, 95.8, 96.4, 96.8, 97.1, 97.3, 97.5] },
  { id: '12', name: 'Immortal Romance', provider: 'Microgaming', providerLogo: null, rtp: 96.86, liveRtp: 96.1, volatility: 'Med', maxWin: 3645, features: ['Free Spins', 'Wild Desire', 'Chamber of Spins'], thumbnail: null, status: 'Normal', rtpHistory: [96.8, 96.7, 96.5, 96.3, 96.2, 96.1, 96.1] },
  { id: '13', name: 'Razor Shark', provider: 'Push Gaming', providerLogo: null, rtp: 96.70, liveRtp: 94.8, volatility: 'High', maxWin: 50000, features: ['Free Spins', 'Buy Bonus', 'Nudge'], thumbnail: null, status: 'Cold', rtpHistory: [96.5, 96.0, 95.5, 95.2, 95.0, 94.9, 94.8] },
  { id: '14', name: 'Fire Joker', provider: 'Play\'n GO', providerLogo: null, rtp: 96.15, liveRtp: 96.8, volatility: 'Med', maxWin: 800, features: ['Free Spins', 'Wheel of Multiplier', 'Sticky Respin'], thumbnail: null, status: 'Normal', rtpHistory: [95.8, 96.0, 96.3, 96.5, 96.6, 96.7, 96.8] },
  { id: '15', name: 'Jammin Jars', provider: 'Push Gaming', providerLogo: null, rtp: 96.83, liveRtp: 98.4, volatility: 'High', maxWin: 20000, features: ['Free Spins', 'Rainbow Feature', 'Expanding Symbols'], thumbnail: null, status: 'Hot', rtpHistory: [96.0, 96.8, 97.2, 97.6, 98.0, 98.2, 98.4] },
  { id: '16', name: 'Thunderstruck II', provider: 'Microgaming', providerLogo: null, rtp: 96.65, liveRtp: 95.9, volatility: 'Med', maxWin: 2400, features: ['Free Spins', 'Great Hall of Spins', 'Wildstorm'], thumbnail: null, status: 'Normal', rtpHistory: [96.5, 96.3, 96.1, 96.0, 95.9, 95.9, 95.9] },
  { id: '17', name: 'Legacy of Dead', provider: 'Play\'n GO', providerLogo: null, rtp: 96.58, liveRtp: 93.0, volatility: 'High', maxWin: 5000, features: ['Free Spins', 'Expanding Symbols', 'Buy Bonus'], thumbnail: null, status: 'Cold', rtpHistory: [96.4, 95.8, 95.0, 94.2, 93.6, 93.2, 93.0] },
  { id: '18', name: 'Fishin Frenzy', provider: 'Blueprint Gaming', providerLogo: null, rtp: 96.12, liveRtp: 96.5, volatility: 'Med', maxWin: 25000, features: ['Free Spins', 'Money Collect'], thumbnail: null, status: 'Normal', rtpHistory: [96.0, 96.1, 96.3, 96.4, 96.5, 96.5, 96.5] },
  { id: '19', name: 'Pirate Gold Deluxe', provider: 'Pragmatic Play', providerLogo: null, rtp: 96.48, liveRtp: 97.1, volatility: 'High', maxWin: 1800, features: ['Free Spins', 'Treasure Chest', 'Multiplier Trail'], thumbnail: null, status: 'Hot', rtpHistory: [95.2, 95.8, 96.3, 96.7, 97.0, 97.1, 97.1] },
  { id: '20', name: 'Fruit Party', provider: 'Pragmatic Play', providerLogo: null, rtp: 96.50, liveRtp: 96.2, volatility: 'High', maxWin: 5000, features: ['Tumble', 'Free Spins', 'Buy Bonus'], thumbnail: null, status: 'Normal', rtpHistory: [96.4, 96.3, 96.2, 96.2, 96.2, 96.2, 96.2] },
];

const PROVIDERS = [...new Set(MOCK_SLOTS.map(s => s.provider))].sort();

function applyFilters(slots, filters) {
  let result = [...slots];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q)
    );
  }

  if (filters.providers.length > 0) {
    result = result.filter(s => filters.providers.includes(s.provider));
  }

  if (filters.volatility.length > 0) {
    result = result.filter(s => filters.volatility.includes(s.volatility));
  }

  if (filters.features.length > 0) {
    result = result.filter(s =>
      filters.features.every(f => s.features.includes(f))
    );
  }

  result = result.filter(s =>
    s.liveRtp >= filters.rtpRange[0] && s.liveRtp <= filters.rtpRange[1]
  );

  return result;
}

function applySort(slots, sortKey, sortDir) {
  const sorted = [...slots];
  sorted.sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

const DEFAULT_FILTERS = {
  search: '',
  providers: [],
  volatility: [],
  features: [],
  rtpRange: [80, 99],
};

// Normalize Supabase row (snake_case) to the shape the UI expects (camelCase)
function normalizeSlot(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    providerLogo: row.provider_logo_url || null,
    thumbnail: row.thumbnail_url || null,
    rtp: Number(row.rtp),
    liveRtp: Number(row.live_rtp ?? row.rtp),
    volatility: row.volatility,
    maxWin: row.max_win,
    features: row.features || [],
    status: row.status || 'Normal',
    rtpHistory: row.rtp_history || [],
    demoUrl: row.demo_url || null,
    affiliateUrl: row.affiliate_url || null,
  };
}

export function useSlots({ pageSize = 10 } = {}) {
  const [allSlots, setAllSlots] = useState(MOCK_SLOTS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState('liveRtp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load from Supabase; fall back to mock data if table not seeded yet
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await supabase
          .from('slots')
          .select('*')
          .order('live_rtp', { ascending: false });
        if (!cancelled) {
          if (!error && data && data.length > 0) {
            setAllSlots(data.map(normalizeSlot));
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => applyFilters(allSlots, filters), [allSlots, filters]);
  const sorted = useMemo(() => applySort(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const hotSlots = useMemo(() =>
    [...allSlots].sort((a, b) => b.liveRtp - a.liveRtp).slice(0, 10),
    [allSlots]
  );

  const tickerSlots = useMemo(() =>
    [...allSlots]
      .sort((a, b) => Math.abs(b.liveRtp - b.rtp) - Math.abs(a.liveRtp - a.rtp))
      .slice(0, 5),
    [allSlots]
  );

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return {
    slots: paginated,
    allSlots,
    hotSlots,
    tickerSlots,
    loading,
    filters,
    updateFilter,
    resetFilters,
    sortKey,
    sortDir,
    handleSort,
    page,
    setPage,
    totalPages,
    totalResults: sorted.length,
    totalSlots: allSlots.length,
    providers: PROVIDERS,
  };
}

export const ALL_FEATURES = [
  'Free Spins', 'Buy Bonus', 'Megaways', 'Tumble', 'Expanding Symbols',
  'Multiplier', 'Sticky Wilds', 'Money Collect', 'Jackpot',
];
