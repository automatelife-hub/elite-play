-- ============================================================
-- Elite Play / Gamble Intel — Full Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES (extends auth.users)
-- =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  photo_url TEXT,
  phone TEXT,
  country TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
  is_agent BOOLEAN DEFAULT FALSE,
  agent_id UUID,
  preferred_location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- SITES
-- =====================
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  type TEXT,
  description TEXT,
  short_description TEXT,
  logo_url TEXT,
  logo_detail_url TEXT,
  banner_url TEXT,
  url TEXT,
  rating NUMERIC(3,1) DEFAULT 0,
  established_year INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  is_club_based_app BOOLEAN DEFAULT FALSE,
  highlights TEXT[],
  bonus_offer TEXT,
  bonus_info TEXT,
  min_deposit NUMERIC(10,2),
  supported_countries TEXT[],
  supported_currencies TEXT[],
  payment_methods TEXT[],
  platforms TEXT[],
  poker_network TEXT,
  geo_priority JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon')),
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AGENTS
-- =====================
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  agent_email TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  country TEXT,
  bio TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'suspended')),
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  commission_rate NUMERIC(5,2) DEFAULT 25.00,
  payment_type TEXT DEFAULT 'revenue_share',
  payment_method TEXT,
  payment_details JSONB,
  tracking_code TEXT,
  agent_referral_code TEXT UNIQUE,
  referrer_agent_id UUID,
  internal_tags TEXT[],
  assigned_manager TEXT,
  referred_players_count INTEGER DEFAULT 0,
  total_revenue_generated NUMERIC(12,2) DEFAULT 0,
  total_paid_out NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  approved_by TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from profiles.agent_id to agents
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_agent
  FOREIGN KEY (agent_id) REFERENCES public.agents(id);

-- =====================
-- AGENT DEALS
-- =====================
CREATE TABLE public.agent_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  commission_rate NUMERIC(5,2),
  commission_type TEXT DEFAULT 'revenue_share',
  cpa_amount NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'paused', 'rejected', 'terminated')),
  approved_date TIMESTAMPTZ,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, site_id)
);

-- =====================
-- AGENT PLAYERS
-- =====================
CREATE TABLE public.agent_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id),
  player_username TEXT,
  player_email TEXT,
  platform TEXT DEFAULT 'poker',
  signup_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'active', 'approved', 'inactive')),
  total_revenue NUMERIC(12,2) DEFAULT 0,
  monthly_revenue NUMERIC(12,2) DEFAULT 0,
  referred_players_count INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AGENT COMMISSIONS
-- =====================
CREATE TABLE public.agent_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.agent_deals(id),
  player_id UUID REFERENCES public.agent_players(id),
  period_start DATE,
  period_end DATE,
  gross_revenue NUMERIC(12,2) DEFAULT 0,
  commission_rate NUMERIC(5,2),
  commission_amount NUMERIC(12,2) DEFAULT 0,
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'paid', 'failed')),
  payout_batch_id UUID,
  processed_date TIMESTAMPTZ,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AGENT REFERRAL LINKS
-- =====================
CREATE TABLE public.agent_referral_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id),
  link_url TEXT NOT NULL,
  short_code TEXT UNIQUE,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AGENT REFERRALS (agent-to-agent)
-- =====================
CREATE TABLE public.agent_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_agent_id UUID NOT NULL REFERENCES public.agents(id),
  referred_agent_id UUID NOT NULL REFERENCES public.agents(id),
  referral_code TEXT,
  referral_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'approved', 'rejected', 'expired')),
  commission_earned NUMERIC(10,2) DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AGENT CONTESTS / GIVEAWAYS
-- =====================
CREATE TABLE public.agent_contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES public.agents(id),
  site_id UUID REFERENCES public.sites(id),
  contest_name TEXT NOT NULL,
  contest_type TEXT CHECK (contest_type IN ('rake_race', 'wagering_contest', 'raffle', 'leaderboard')),
  description TEXT,
  prize_pool NUMERIC(10,2),
  prize_details JSONB,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  rules TEXT,
  poker_rake_multiplier NUMERIC(5,2) DEFAULT 1,
  casino_wager_multiplier NUMERIC(5,2) DEFAULT 1,
  raffle_tickets_per_rake NUMERIC(5,2),
  raffle_tickets_per_wager NUMERIC(5,2),
  min_qualification NUMERIC(10,2),
  max_participants INTEGER,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CONTEST PARTICIPANTS
-- =====================
CREATE TABLE public.contest_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID NOT NULL REFERENCES public.agent_contests(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id),
  player_username TEXT,
  score NUMERIC(12,2) DEFAULT 0,
  rank INTEGER,
  prize_won NUMERIC(10,2),
  status TEXT DEFAULT 'active',
  joined_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AGENT ACHIEVEMENTS
-- =====================
CREATE TABLE public.agent_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  badge_icon TEXT,
  earned_date TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- =====================
-- AGENT ONBOARDING
-- =====================
CREATE TABLE public.agent_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  step_completed TEXT[],
  current_step TEXT,
  payment_setup_complete BOOLEAN DEFAULT FALSE,
  profile_complete BOOLEAN DEFAULT FALSE,
  first_deal_complete BOOLEAN DEFAULT FALSE,
  first_player_added BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  completed_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CUSTOM DEAL REQUESTS
-- =====================
CREATE TABLE public.custom_deal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  site_id UUID REFERENCES public.sites(id),
  site_name TEXT,
  requested_commission_rate NUMERIC(5,2),
  requested_bonus TEXT,
  justification TEXT,
  expected_volume TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'denied', 'rejected')),
  admin_response TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PAYOUT BATCHES
-- =====================
CREATE TABLE public.payout_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES public.agents(id),
  total_amount NUMERIC(12,2) DEFAULT 0,
  commission_ids UUID[],
  payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'pending_approval', 'approved', 'processing', 'completed', 'rejected', 'failed')),
  approved_by TEXT,
  rejection_reason TEXT,
  transaction_id TEXT,
  notes TEXT,
  processed_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from commissions to payout batches
ALTER TABLE public.agent_commissions
  ADD CONSTRAINT fk_commission_payout_batch
  FOREIGN KEY (payout_batch_id) REFERENCES public.payout_batches(id);

-- =====================
-- SERVICE PACKAGES
-- =====================
CREATE TABLE public.service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  package_type TEXT DEFAULT 'one_time',
  price NUMERIC(10,2),
  features TEXT[],
  turnaround_time TEXT,
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  popular BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SERVICE ORDERS
-- =====================
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES public.service_packages(id),
  user_id UUID REFERENCES public.profiles(id),
  agent_id UUID REFERENCES public.agents(id),
  quantity INTEGER DEFAULT 1,
  price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  attachments TEXT[],
  completed_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AFFILIATE LINKS
-- =====================
CREATE TABLE public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  site_id UUID REFERENCES public.sites(id),
  url TEXT NOT NULL,
  custom_tag TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AFFILIATE EARNINGS
-- =====================
CREATE TABLE public.affiliate_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES public.affiliate_links(id),
  user_id UUID REFERENCES public.profiles(id),
  site_id UUID REFERENCES public.sites(id),
  amount NUMERIC(10,2),
  conversion_type TEXT,
  conversion_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MARKETING ASSETS
-- =====================
CREATE TABLE public.marketing_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('banner', 'logo', 'video', 'copy', 'landing_page', 'social_post')),
  category TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  site_id UUID REFERENCES public.sites(id),
  download_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MARKETING CAMPAIGNS
-- =====================
CREATE TABLE public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  budget NUMERIC(10,2),
  spent NUMERIC(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  assets JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MARKETING REQUESTS
-- =====================
CREATE TABLE public.marketing_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id),
  type TEXT,
  description TEXT,
  requirements TEXT,
  site_id UUID REFERENCES public.sites(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  deliverables TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- USER SITE SIGNUPS
-- =====================
CREATE TABLE public.user_site_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  site_id UUID REFERENCES public.sites(id),
  site_name TEXT,
  site_username TEXT,
  signup_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- USER STATS
-- =====================
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  signup_id UUID REFERENCES public.user_site_signups(id),
  period_type TEXT DEFAULT 'weekly' CHECK (period_type IN ('daily', 'weekly', 'biweekly', 'monthly')),
  period_start DATE,
  period_end DATE,
  hands_played INTEGER DEFAULT 0,
  rake_generated NUMERIC(10,2) DEFAULT 0,
  profit_loss NUMERIC(10,2) DEFAULT 0,
  tournaments_played INTEGER DEFAULT 0,
  cash_games_played INTEGER DEFAULT 0,
  total_wagered NUMERIC(12,2) DEFAULT 0,
  commission_earned NUMERIC(10,2) DEFAULT 0,
  bonus_cleared NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SUPPORT TICKETS
-- =====================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  agent_id UUID REFERENCES public.agents(id),
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  messages JSONB[],
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ARTICLES
-- =====================
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  author TEXT,
  category TEXT,
  tags TEXT[],
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_agents_email ON public.agents(agent_email);
CREATE INDEX idx_agents_status ON public.agents(status);
CREATE INDEX idx_agents_referral_code ON public.agents(agent_referral_code);
CREATE INDEX idx_agent_deals_agent ON public.agent_deals(agent_id);
CREATE INDEX idx_agent_deals_site ON public.agent_deals(site_id);
CREATE INDEX idx_agent_players_agent ON public.agent_players(agent_id);
CREATE INDEX idx_agent_commissions_agent ON public.agent_commissions(agent_id);
CREATE INDEX idx_agent_commissions_payout ON public.agent_commissions(payout_status);
CREATE INDEX idx_sites_rating ON public.sites(rating DESC);
CREATE INDEX idx_sites_featured ON public.sites(featured) WHERE featured = TRUE;
CREATE INDEX idx_affiliate_links_user ON public.affiliate_links(user_id);
CREATE INDEX idx_user_signups_email ON public.user_site_signups(user_email);
CREATE INDEX idx_user_stats_email ON public.user_stats(user_email);
CREATE INDEX idx_articles_published ON public.articles(published, created_date DESC);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_sites BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_agents BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_agent_deals BEFORE UPDATE ON public.agent_deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_agent_onboarding BEFORE UPDATE ON public.agent_onboarding FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_custom_deal_requests BEFORE UPDATE ON public.custom_deal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_payout_batches BEFORE UPDATE ON public.payout_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_service_orders BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_affiliate_links BEFORE UPDATE ON public.affiliate_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_affiliate_earnings BEFORE UPDATE ON public.affiliate_earnings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_marketing_campaigns BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_marketing_requests BEFORE UPDATE ON public.marketing_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_support_tickets BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_articles BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_deal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_site_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: sites, articles, service_packages, marketing_assets, agent_contests
CREATE POLICY "Public read sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read service_packages" ON public.service_packages FOR SELECT USING (true);
CREATE POLICY "Public read marketing_assets" ON public.marketing_assets FOR SELECT USING (true);
CREATE POLICY "Public read agent_contests" ON public.agent_contests FOR SELECT USING (true);
CREATE POLICY "Public read contest_participants" ON public.contest_participants FOR SELECT USING (true);

-- PROFILES: users read/update own
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- AGENTS: anyone can insert (apply), agents read own, admins manage all
CREATE POLICY "Anyone can apply as agent" ON public.agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents read own" ON public.agents FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR status = 'approved'
);
CREATE POLICY "Agents update own" ON public.agents FOR UPDATE USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AGENT DEALS: agents see own, admins see all
CREATE POLICY "Agent deals select" ON public.agent_deals FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Agent deals insert" ON public.agent_deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Agent deals update" ON public.agent_deals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AGENT PLAYERS: agents see own
CREATE POLICY "Agent players select" ON public.agent_players FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Agent players insert" ON public.agent_players FOR INSERT WITH CHECK (true);

-- AGENT COMMISSIONS: agents see own
CREATE POLICY "Agent commissions select" ON public.agent_commissions FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Agent commissions update" ON public.agent_commissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- REFERRAL LINKS: agents see own
CREATE POLICY "Referral links select" ON public.agent_referral_links FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AGENT REFERRALS
CREATE POLICY "Agent referrals select" ON public.agent_referrals FOR SELECT USING (true);
CREATE POLICY "Agent referrals insert" ON public.agent_referrals FOR INSERT WITH CHECK (true);

-- ACHIEVEMENTS
CREATE POLICY "Achievements select" ON public.agent_achievements FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ONBOARDING
CREATE POLICY "Onboarding select" ON public.agent_onboarding FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Onboarding update" ON public.agent_onboarding FOR UPDATE USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CUSTOM DEAL REQUESTS
CREATE POLICY "Deal requests select" ON public.custom_deal_requests FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Deal requests insert" ON public.custom_deal_requests FOR INSERT WITH CHECK (true);

-- PAYOUT BATCHES
CREATE POLICY "Payout batches select" ON public.payout_batches FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Payout batches manage" ON public.payout_batches FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- SERVICE ORDERS
CREATE POLICY "Service orders select" ON public.service_orders FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Service orders insert" ON public.service_orders FOR INSERT WITH CHECK (true);

-- AFFILIATE LINKS
CREATE POLICY "Affiliate links select" ON public.affiliate_links FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Affiliate links manage" ON public.affiliate_links FOR ALL USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AFFILIATE EARNINGS
CREATE POLICY "Affiliate earnings select" ON public.affiliate_earnings FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- MARKETING CAMPAIGNS
CREATE POLICY "Marketing campaigns select" ON public.marketing_campaigns FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- MARKETING REQUESTS
CREATE POLICY "Marketing requests select" ON public.marketing_requests FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Marketing requests insert" ON public.marketing_requests FOR INSERT WITH CHECK (true);

-- USER SITE SIGNUPS
CREATE POLICY "User signups select" ON public.user_site_signups FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "User signups manage" ON public.user_site_signups FOR ALL USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- USER STATS
CREATE POLICY "User stats select" ON public.user_stats FOR SELECT USING (
  user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "User stats insert" ON public.user_stats FOR INSERT WITH CHECK (true);

-- SUPPORT TICKETS
CREATE POLICY "Support tickets select" ON public.support_tickets FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Support tickets insert" ON public.support_tickets FOR INSERT WITH CHECK (true);

-- ADMIN: full access to all tables for admins (sites, service_packages, articles write)
CREATE POLICY "Admins manage sites" ON public.sites FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage service_packages" ON public.service_packages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================
-- SEED DATA: Sample poker sites
-- =====================
INSERT INTO public.sites (name, slug, type, description, rating, featured, highlights, bonus_offer, established_year, status) VALUES
('PokerStars', 'pokerstars', 'poker', 'The world''s largest online poker room with the widest variety of games and tournaments.', 9.5, true, ARRAY['Largest player pool', 'Best tournament schedule', 'Mobile app available', 'VIP rewards program'], '100% up to $600 deposit bonus', 2001, 'active'),
('GGPoker', 'ggpoker', 'poker', 'Fast-growing poker platform with innovative features and massive tournament guarantees.', 9.3, true, ARRAY['Smart HUD features', 'Massive MTT guarantees', 'All-in insurance', 'Rush & Cash'], '$600 welcome bonus package', 2017, 'active'),
('888poker', '888poker', 'poker', 'One of the most trusted names in online poker with excellent software and promotions.', 8.8, true, ARRAY['No deposit bonus available', 'BLAST sit & go', 'Excellent mobile app', 'Strong tournament schedule'], '$88 free + 100% up to $888', 2002, 'active'),
('PartyPoker', 'partypoker', 'poker', 'Premium poker experience with focus on recreational players and fair play.', 8.5, false, ARRAY['Anonymous tables', 'Power Series tournaments', 'Great for beginners', 'cashback rewards'], 'Up to $600 welcome bonus', 2001, 'active'),
('WPT Global', 'wpt-global', 'poker', 'Official World Poker Tour online platform with exclusive tournaments and promotions.', 8.7, false, ARRAY['WPT branded tournaments', 'Flipout feature', 'Growing player base', 'Crypto deposits'], '100% up to $1,200 deposit match', 2022, 'active'),
('ClubGG', 'clubgg', 'club_app', 'Free-to-play poker club app powered by GGPoker technology with real-money club games.', 8.2, false, ARRAY['GGPoker engine', 'Club-based games', 'Free to download', 'Real money clubs available'], 'Free to join clubs', 2020, 'active'),
('PPPoker', 'pppoker', 'club_app', 'Leading private club poker app with global player network and club management tools.', 8.0, false, ARRAY['Private clubs worldwide', 'Agent management', 'Multiple game types', 'Low rake'], 'Join clubs with agent referral', 2016, 'active'),
('Stake', 'stake', 'casino', 'Leading crypto casino and sportsbook with provably fair games and instant payouts.', 9.1, true, ARRAY['Crypto-native platform', 'Provably fair games', 'VIP program', 'Instant withdrawals'], 'Up to $3,000 welcome package', 2017, 'active'),
('Betway', 'betway', 'sportsbetting', 'Premier sportsbook with competitive odds, live betting, and comprehensive market coverage.', 8.6, false, ARRAY['Competitive odds', 'Live streaming', 'Cash out feature', 'Mobile betting app'], '$250 free bet welcome offer', 2006, 'active'),
('bet365', 'bet365', 'sportsbetting', 'The world''s biggest online sports betting brand with unmatched market depth.', 9.4, true, ARRAY['Most markets available', 'Best live betting', 'Live streaming', 'Early payout offers'], 'Up to $30 in bet credits', 2000, 'active');

-- SEED DATA: Sample articles
INSERT INTO public.articles (title, slug, content, excerpt, author, category, tags, published, featured) VALUES
('Best Rakeback Deals for 2026', 'best-rakeback-deals-2026', 'A comprehensive guide to the top rakeback offers available across major poker sites in 2026...', 'Find the highest rakeback percentages and best VIP programs across all major poker networks.', 'GIA Editorial', 'poker-strategy', ARRAY['rakeback', 'poker', 'deals'], true, true),
('How to Choose the Right Poker Site', 'how-to-choose-poker-site', 'Choosing the right poker site can make a significant difference in your win rate and overall experience...', 'Key factors to consider when selecting an online poker room for your play style.', 'GIA Editorial', 'beginners', ARRAY['beginners', 'poker', 'guide'], true, false),
('Crypto Casino Revolution: What Players Need to Know', 'crypto-casino-revolution', 'The rise of cryptocurrency casinos has transformed online gambling with faster payouts and provably fair games...', 'Everything you need to know about playing at crypto casinos in 2026.', 'GIA Editorial', 'casino-guides', ARRAY['crypto', 'casino', 'guide'], true, false),
('Sports Betting Strategy: Value Betting Explained', 'value-betting-explained', 'Value betting is the cornerstone of profitable sports betting. Learn how to identify and exploit value in odds...', 'Master the fundamentals of value betting to improve your sports betting ROI.', 'GIA Editorial', 'industry-news', ARRAY['sportsbetting', 'strategy'], true, true);

-- SEED DATA: Sample service packages
INSERT INTO public.service_packages (name, description, category, price, features, active, featured) VALUES
('Custom Banner Design', 'Professional banner designs for your affiliate marketing campaigns.', 'creative_design', 49.99, ARRAY['3 banner sizes', '2 revision rounds', 'Source files included', '48h delivery'], true, false),
('Landing Page Setup', 'Custom landing page optimized for poker/casino affiliate conversions.', 'creative_design', 199.99, ARRAY['Responsive design', 'SEO optimized', 'Analytics setup', 'A/B testing ready'], true, true),
('Social Media Package', 'Monthly social media content creation and scheduling for iGaming promotion.', 'creative_design', 149.99, ARRAY['20 posts per month', 'Platform optimization', 'Hashtag strategy', 'Performance report'], true, false);
