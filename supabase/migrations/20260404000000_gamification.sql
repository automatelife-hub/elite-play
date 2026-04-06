-- ============================================================
-- Elite Play — Gamification Schema Migration
-- XP Engine, Mission Rotation, Streak Tracking, Dark Coins
-- ============================================================

-- =====================
-- PROFILES: Add gamification columns
-- =====================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp_tier TEXT DEFAULT 'bronze'
    CHECK (xp_tier IN ('bronze', 'silver', 'gold', 'platinum', 'elite')),
  ADD COLUMN IF NOT EXISTS dark_coins_balance INTEGER DEFAULT 0;

-- =====================
-- XP TRANSACTIONS
-- =====================
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  coins_earned INTEGER NOT NULL,
  multiplier NUMERIC(4,2) DEFAULT 1.0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_action ON public.xp_transactions(action);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created ON public.xp_transactions(created_at DESC);

-- =====================
-- USER STREAKS
-- =====================
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  streak_multiplier NUMERIC(4,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON public.user_streaks(user_id);

CREATE TRIGGER set_updated_at_user_streaks
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ACHIEVEMENTS (user-level)
-- =====================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  badge_icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);

-- =====================
-- MISSIONS (definitions, rotated by cron)
-- =====================
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('daily', 'weekly', 'monthly')),
  action TEXT NOT NULL,           -- e.g. 'login', 'claim_deal', 'refer_friend'
  target_count INTEGER DEFAULT 1, -- how many times action must occur
  xp_reward INTEGER NOT NULL,
  coin_reward INTEGER DEFAULT 0,
  active_from TIMESTAMPTZ NOT NULL,
  active_to TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missions_active ON public.missions(is_active, active_from, active_to);
CREATE INDEX IF NOT EXISTS idx_missions_type ON public.missions(mission_type);

-- =====================
-- USER MISSIONS (user progress on active missions)
-- =====================
CREATE TABLE IF NOT EXISTS public.user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  xp_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_user_missions_user ON public.user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_mission ON public.user_missions(mission_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_completed ON public.user_missions(completed);

CREATE TRIGGER set_updated_at_user_missions
  BEFORE UPDATE ON public.user_missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- RLS
-- =====================
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

-- XP Transactions: users see own, admins see all
CREATE POLICY "xp_transactions_select" ON public.xp_transactions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Streaks: users see own, admins see all
CREATE POLICY "user_streaks_select" ON public.user_streaks FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Achievements: users see own, admins see all
CREATE POLICY "achievements_select" ON public.achievements FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Missions: public read (anyone can see what missions are active)
CREATE POLICY "missions_public_read" ON public.missions FOR SELECT USING (true);

-- User Missions: users see own, admins see all
CREATE POLICY "user_missions_select" ON public.user_missions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
