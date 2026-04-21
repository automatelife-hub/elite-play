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

-- =====================
-- SLOTS (Slot RTP Intelligence Hub)
-- =====================
CREATE TABLE public.slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_logo_url TEXT,
  thumbnail_url TEXT,
  rtp NUMERIC(5,2) NOT NULL,
  live_rtp NUMERIC(5,2),
  volatility TEXT CHECK (volatility IN ('Low', 'Med', 'High')),
  max_win INTEGER,
  features TEXT[],
  theme TEXT,
  status TEXT DEFAULT 'Normal' CHECK (status IN ('Hot', 'Normal', 'Cold')),
  rtp_history NUMERIC(5,2)[],
  demo_url TEXT,
  affiliate_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  release_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_slots_provider ON public.slots (provider);
CREATE INDEX idx_slots_status ON public.slots (status);
CREATE INDEX idx_slots_rtp ON public.slots (live_rtp DESC);

-- RLS: anyone can read slots
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "slots_public_read" ON public.slots FOR SELECT USING (TRUE);
CREATE POLICY "slots_admin_write" ON public.slots FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- =====================
-- SEED DATA: Initial 20 slots (Backend Lead to expand to 500+)
-- =====================
INSERT INTO public.slots (name, provider, rtp, live_rtp, volatility, max_win, features, status, rtp_history) VALUES
('Gates of Olympus', 'Pragmatic Play', 96.50, 97.80, 'High', 5000, ARRAY['Free Spins', 'Buy Bonus', 'Multiplier'], 'Hot', ARRAY[95.2, 96.1, 97.0, 96.8, 97.5, 97.8, 97.8]),
('Sweet Bonanza', 'Pragmatic Play', 96.48, 96.90, 'High', 21100, ARRAY['Free Spins', 'Buy Bonus', 'Tumble'], 'Hot', ARRAY[94.5, 95.3, 96.1, 96.3, 96.7, 96.9, 96.9]),
('Big Bass Bonanza', 'Pragmatic Play', 96.71, 95.20, 'High', 2100, ARRAY['Free Spins', 'Money Collect'], 'Normal', ARRAY[96.9, 96.4, 95.8, 95.5, 95.3, 95.2, 95.2]),
('Book of Dead', 'Play''n GO', 96.21, 94.10, 'High', 5000, ARRAY['Free Spins', 'Expanding Symbols'], 'Cold', ARRAY[96.0, 95.4, 94.8, 94.5, 94.2, 94.1, 94.1]),
('Starburst', 'NetEnt', 96.09, 96.30, 'Low', 500, ARRAY['Expanding Wilds', 'Respin'], 'Normal', ARRAY[95.8, 96.0, 96.1, 96.2, 96.3, 96.3, 96.3]),
('Reactoonz', 'Play''n GO', 96.51, 98.10, 'High', 4570, ARRAY['Tumble', 'Multiplier', 'Quantum Leap'], 'Hot', ARRAY[95.0, 96.0, 97.0, 97.5, 97.9, 98.0, 98.1]),
('Gonzo''s Quest Megaways', 'NetEnt', 96.00, 95.70, 'Med', 20000, ARRAY['Megaways', 'Avalanche', 'Free Spins'], 'Normal', ARRAY[96.2, 96.0, 95.9, 95.8, 95.7, 95.7, 95.7]),
('Dead or Alive 2', 'NetEnt', 96.82, 93.50, 'High', 111111, ARRAY['Free Spins', 'Sticky Wilds'], 'Cold', ARRAY[97.0, 96.5, 95.8, 95.0, 94.2, 93.8, 93.5]),
('Bonanza Megaways', 'Big Time Gaming', 96.00, 96.60, 'High', 10000, ARRAY['Megaways', 'Free Spins', 'Unlimited Multiplier'], 'Normal', ARRAY[95.9, 96.0, 96.2, 96.4, 96.5, 96.6, 96.6]),
('Wolf Gold', 'Pragmatic Play', 96.01, 97.50, 'Med', 5000, ARRAY['Free Spins', 'Money Respin', 'Jackpot'], 'Hot', ARRAY[95.0, 95.8, 96.4, 96.8, 97.1, 97.3, 97.5]),
('Jammin Jars', 'Push Gaming', 96.83, 98.40, 'High', 20000, ARRAY['Free Spins', 'Rainbow Feature', 'Expanding Symbols'], 'Hot', ARRAY[96.0, 96.8, 97.2, 97.6, 98.0, 98.2, 98.4]),
('Immortal Romance', 'Microgaming', 96.86, 96.10, 'Med', 3645, ARRAY['Free Spins', 'Wild Desire', 'Chamber of Spins'], 'Normal', ARRAY[96.8, 96.7, 96.5, 96.3, 96.2, 96.1, 96.1]),
('Razor Shark', 'Push Gaming', 96.70, 94.80, 'High', 50000, ARRAY['Free Spins', 'Buy Bonus', 'Nudge'], 'Cold', ARRAY[96.5, 96.0, 95.5, 95.2, 95.0, 94.9, 94.8]),
('Fire Joker', 'Play''n GO', 96.15, 96.80, 'Med', 800, ARRAY['Free Spins', 'Wheel of Multiplier', 'Sticky Respin'], 'Normal', ARRAY[95.8, 96.0, 96.3, 96.5, 96.6, 96.7, 96.8]),
('Thunderstruck II', 'Microgaming', 96.65, 95.90, 'Med', 2400, ARRAY['Free Spins', 'Great Hall of Spins', 'Wildstorm'], 'Normal', ARRAY[96.5, 96.3, 96.1, 96.0, 95.9, 95.9, 95.9]),
('Legacy of Dead', 'Play''n GO', 96.58, 93.00, 'High', 5000, ARRAY['Free Spins', 'Expanding Symbols', 'Buy Bonus'], 'Cold', ARRAY[96.4, 95.8, 95.0, 94.2, 93.6, 93.2, 93.0]),
('Pirate Gold Deluxe', 'Pragmatic Play', 96.48, 97.10, 'High', 1800, ARRAY['Free Spins', 'Treasure Chest', 'Multiplier Trail'], 'Hot', ARRAY[95.2, 95.8, 96.3, 96.7, 97.0, 97.1, 97.1]),
('Fruit Party', 'Pragmatic Play', 96.50, 96.20, 'High', 5000, ARRAY['Tumble', 'Free Spins', 'Buy Bonus'], 'Normal', ARRAY[96.4, 96.3, 96.2, 96.2, 96.2, 96.2, 96.2]),
('Dog House Megaways', 'Pragmatic Play', 96.55, 97.30, 'High', 9999, ARRAY['Megaways', 'Free Spins', 'Sticky Wilds', 'Multiplier'], 'Hot', ARRAY[95.8, 96.2, 96.7, 97.0, 97.2, 97.3, 97.3]),
('Wanted Dead or a Wild', 'Hacksaw Gaming', 96.38, 98.50, 'High', 12500, ARRAY['Free Spins', 'Buy Bonus', 'Wild Multiplier', 'Retrigger'], 'Hot', ARRAY[95.5, 96.0, 96.8, 97.4, 98.0, 98.3, 98.5]);

-- =====================
-- GAMIFICATION TABLES (Phase 1 - added DAR-16)
-- =====================

-- XP Ledger: tracks all XP transactions per user
CREATE TABLE IF NOT EXISTS public.xp_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'player_referral', 'active_player_month', 'deal_conversion', 'login_streak'
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_id ON public.xp_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_created_at ON public.xp_ledger(created_at);

-- Dark Coins Ledger
CREATE TABLE IF NOT EXISTS public.dark_coins_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = earn, negative = spend
  source TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dark_coins_user_id ON public.dark_coins_ledger(user_id);

-- Missions: daily and weekly definitions
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly')),
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  criteria_json JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission Completions
CREATE TABLE IF NOT EXISTS public.mission_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mission_completions_user ON public.mission_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_completions_mission ON public.mission_completions(mission_id);

-- XP Totals View (for leaderboard / tier display)
-- Bronze: 0-999 | Silver: 1000-4999 | Gold: 5000-14999 | Platinum: 15000-29999 | Elite: 30000+
CREATE OR REPLACE VIEW public.user_xp_totals AS
SELECT
  user_id,
  COALESCE(SUM(amount), 0) AS total_xp,
  CASE
    WHEN COALESCE(SUM(amount), 0) >= 30000 THEN 'elite'
    WHEN COALESCE(SUM(amount), 0) >= 15000 THEN 'platinum'
    WHEN COALESCE(SUM(amount), 0) >= 5000  THEN 'gold'
    WHEN COALESCE(SUM(amount), 0) >= 1000  THEN 'silver'
    ELSE 'bronze'
  END AS tier
FROM public.xp_ledger
GROUP BY user_id;

-- Dark Coin Balances View
CREATE OR REPLACE VIEW public.user_dark_coin_balances AS
SELECT user_id, COALESCE(SUM(amount), 0) AS balance
FROM public.dark_coins_ledger
GROUP BY user_id;

-- =====================
-- OPERATOR DEALS (DAR-20/DAR-23)
-- Commission structures per operator for affiliate dashboard
-- =====================
CREATE TABLE IF NOT EXISTS public.operator_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  operator_name TEXT NOT NULL,
  operator_slug TEXT UNIQUE NOT NULL,
  -- Categorisation
  category TEXT,                           -- 'poker' | 'casino' | 'sports'
  subcategory TEXT,
  website TEXT,
  -- Affiliate tracking
  affiliate_code TEXT,                     -- our code with this operator
  tracking_url TEXT,                       -- full affiliate link
  -- Deal type & commission structure
  deal_type TEXT NOT NULL CHECK (deal_type IN ('revenue_share', 'cpa', 'hybrid', 'rakeback', 'flat')),
  -- Revenue Share
  revenue_share_pct NUMERIC(5,2),          -- e.g. 35.00 = 35%
  -- CPA
  cpa_amount NUMERIC(10,2),                -- per qualifying player
  cpa_currency TEXT DEFAULT 'USD',
  cpa_min_deposit NUMERIC(10,2),           -- minimum deposit to qualify
  -- Rakeback / Hybrid
  rakeback_pct NUMERIC(5,2),               -- e.g. 30.00 = 30% rakeback
  hybrid_revshare_pct NUMERIC(5,2),
  hybrid_cpa_amount NUMERIC(10,2),
  -- Terms
  negative_carryover BOOLEAN DEFAULT TRUE, -- does negative balance carry to next month?
  sub_affiliate_pct NUMERIC(5,2),          -- % of referred sub-affiliate earnings
  min_payout NUMERIC(10,2) DEFAULT 100,
  payment_frequency TEXT DEFAULT 'monthly' CHECK (payment_frequency IN ('weekly', 'biweekly', 'monthly')),
  payment_methods TEXT[] DEFAULT ARRAY['bank_transfer', 'crypto'],
  geo_restrictions TEXT[],                 -- blocked country codes
  -- Player-facing bonus / offer
  welcome_bonus TEXT,
  welcome_bonus_short TEXT,
  bonus_code TEXT,
  bonus_wagering TEXT,
  -- Deal lifecycle
  deal_status TEXT DEFAULT 'active' CHECK (deal_status IN ('active','pending','negotiating','inactive')),
  deal_notes TEXT,
  deal_start_date DATE,
  deal_renewal_date DATE,
  -- Display / ranking
  rating NUMERIC(3,1),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  score INTEGER,
  is_exclusive BOOLEAN DEFAULT FALSE,      -- exclusive deal negotiated
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operator_deals_site ON public.operator_deals(site_id);
CREATE INDEX IF NOT EXISTS idx_operator_deals_type ON public.operator_deals(deal_type);
CREATE INDEX IF NOT EXISTS idx_operator_deals_active ON public.operator_deals(is_active);

ALTER TABLE public.operator_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "operator_deals_public_read" ON public.operator_deals FOR SELECT USING (TRUE);
CREATE POLICY "operator_deals_admin_write" ON public.operator_deals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================
-- AFFILIATE CLICK EVENTS (DAR-20)
-- Tracks every click on an affiliate link
-- =====================
CREATE TABLE IF NOT EXISTS public.affiliate_click_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Link attribution
  sub_id TEXT NOT NULL,                    -- unique subID per traffic source
  operator_slug TEXT NOT NULL,             -- which operator was clicked
  affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
  -- Traffic source
  traffic_source TEXT NOT NULL CHECK (traffic_source IN ('seo', 'social', 'email', 'referral', 'direct', 'paid', 'other')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  landing_page TEXT,
  -- User identity (pre-registration)
  session_id TEXT,                         -- anonymous session cookie
  fingerprint_hash TEXT,                   -- browser fingerprint for dedup
  ip_hash TEXT,                            -- hashed IP (privacy-safe)
  user_agent TEXT,
  country_code CHAR(2),
  -- Authenticated user (if logged in)
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Fraud flags
  is_bot BOOLEAN DEFAULT FALSE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of UUID REFERENCES public.affiliate_click_events(id) ON DELETE SET NULL,
  -- Timing
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_click_events_sub_id ON public.affiliate_click_events(sub_id);
CREATE INDEX IF NOT EXISTS idx_click_events_operator ON public.affiliate_click_events(operator_slug);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON public.affiliate_click_events(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_events_session ON public.affiliate_click_events(session_id);
CREATE INDEX IF NOT EXISTS idx_click_events_user ON public.affiliate_click_events(user_id);

ALTER TABLE public.affiliate_click_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "click_events_insert" ON public.affiliate_click_events FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "click_events_admin_read" ON public.affiliate_click_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================
-- AFFILIATE CONVERSIONS (DAR-20)
-- Tracks registrations, deposits, player activity from click events
-- =====================
CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Source click
  click_event_id UUID REFERENCES public.affiliate_click_events(id) ON DELETE SET NULL,
  sub_id TEXT NOT NULL,
  operator_slug TEXT NOT NULL,
  -- Conversion data
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('registration', 'first_deposit', 'deposit', 'player_activity')),
  player_id TEXT,                          -- operator's player ID (from their reports)
  player_username TEXT,
  -- Financial
  deposit_amount NUMERIC(10,2),
  deposit_currency TEXT DEFAULT 'USD',
  commission_amount NUMERIC(10,2),
  commission_currency TEXT DEFAULT 'USD',
  -- Deal attribution
  operator_deal_id UUID REFERENCES public.operator_deals(id) ON DELETE SET NULL,
  deal_type TEXT,
  -- Reconciliation
  operator_report_date DATE,              -- date from operator's monthly report
  is_reconciled BOOLEAN DEFAULT FALSE,   -- matched against operator report
  reconciled_at TIMESTAMPTZ,
  discrepancy_amount NUMERIC(10,2),      -- difference if any vs operator report
  -- Timing
  converted_at TIMESTAMPTZ DEFAULT NOW(),
  reported_at TIMESTAMPTZ                -- when operator reported this conversion
);

CREATE INDEX IF NOT EXISTS idx_conversions_sub_id ON public.affiliate_conversions(sub_id);
CREATE INDEX IF NOT EXISTS idx_conversions_operator ON public.affiliate_conversions(operator_slug);
CREATE INDEX IF NOT EXISTS idx_conversions_type ON public.affiliate_conversions(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON public.affiliate_conversions(converted_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_reconciled ON public.affiliate_conversions(is_reconciled);

ALTER TABLE public.affiliate_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversions_insert" ON public.affiliate_conversions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "conversions_admin_read" ON public.affiliate_conversions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================
-- SUBID TRACKING LINKS (DAR-20)
-- Generated tracking URLs per agent/source
-- =====================
CREATE TABLE IF NOT EXISTS public.subid_tracking_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_id TEXT UNIQUE NOT NULL,
  operator_slug TEXT NOT NULL,
  base_url TEXT NOT NULL,
  full_url TEXT NOT NULL,                  -- base_url + tracking params
  traffic_source TEXT NOT NULL,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT,                              -- human-readable label
  is_active BOOLEAN DEFAULT TRUE,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subid_links_sub_id ON public.subid_tracking_links(sub_id);
CREATE INDEX IF NOT EXISTS idx_subid_links_operator ON public.subid_tracking_links(operator_slug);
CREATE INDEX IF NOT EXISTS idx_subid_links_agent ON public.subid_tracking_links(agent_id);

ALTER TABLE public.subid_tracking_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subid_links_agent_own" ON public.subid_tracking_links FOR ALL USING (
  agent_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================
-- SEED: Operator Deals (core subset — full 14-deal seed via migration 20260408000000)
-- =====================
INSERT INTO public.operator_deals (
  operator_name, operator_slug, category,
  deal_type, revenue_share_pct, rakeback_pct, cpa_amount, cpa_currency, cpa_min_deposit,
  hybrid_revshare_pct, hybrid_cpa_amount,
  sub_affiliate_pct, negative_carryover,
  payment_frequency, min_payout, payment_methods,
  affiliate_code, tracking_url,
  welcome_bonus, bonus_code,
  deal_status, deal_notes, is_exclusive, is_active, is_featured, rating, score
) VALUES
('GGPoker',           'ggpoker',    'poker',  'hybrid',        NULL,  NULL,  NULL,   'USD', 50.00, 30.00, 100.00, 5.00, FALSE, 'monthly',   100.00, ARRAY['bank_transfer','skrill','neteller','crypto'],  'ELITEPLAY',  'https://ggpoker.com/ref/ELITEPLAY',                                                              '200% up to $600 + $100 in tickets',          'ELITEPLAY', 'active',      '30% RevShare + $100 CPA on first deposit ≥$50. No negative carryover. Fish Buffet 60% rakeback.',                                                          FALSE, TRUE,  TRUE,  4.8, 91),
('PokerStars',        'pokerstars', 'poker',  'revenue_share', 35.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   5.00, FALSE, 'monthly',   100.00, ARRAY['bank_transfer','skrill','neteller'],           'ELITE600',   'https://www.pokerstars.com/poker/download/?source=ELITE600',                                     '100% up to $600 First Deposit Bonus',        'ELITE600',  'pending',     'Tiered RevShare: 25% base, 30% at 20+ FTDs, 35% at 50+ FTDs. Application submitted.',                                                                      FALSE, TRUE,  TRUE,  4.6, 87),
('WPT Global',        'wpt-global', 'poker',  'revenue_share', 40.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   5.00, FALSE, 'biweekly',  100.00, ARRAY['bank_transfer','crypto'],                      'ELITEPLAY',  'https://www.wptglobal.com/deposit/?bonus=ELITEPLAY',                                             '100% up to $1,200 First Deposit Bonus',      'ELITEPLAY', 'active',      'Aggressive 40% RevShare. Biweekly payments. Negative carryover resets quarterly.',                                                                          FALSE, TRUE,  TRUE,  4.7, 90),
('Americas Cardroom', 'acr-poker',  'poker',  'rakeback',      NULL,  27.00, NULL,   'USD', NULL,  NULL,  NULL,   3.00, FALSE, 'weekly',     25.00, ARRAY['crypto','bitcoin','check'],                    'ELITE',      'https://www.americascardroom.eu/poker-bonus/?bonus=ELITE',                                       '200% up to $1,000 + free tickets',           'ELITE',     'pending',     '27% instant rakeback to players. US-friendly. Weekly crypto payouts.',                                                                                     FALSE, TRUE,  FALSE, 4.2, 78),
('888poker',          '888poker',   'poker',  'revenue_share', 35.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   3.00, TRUE,  'monthly',   100.00, ARRAY['bank_transfer','skrill','neteller'],           'ELITEPLAY',  'https://www.888poker.com/poker/download/?tcode=ELITEPLAY',                                       '$88 Free + 100% up to $888',                 'ELITEPLAY', 'negotiating', '888 Affiliates. Negotiating 35% RevShare. Negative carryover — pushing for waiver.',                                                                       FALSE, TRUE,  FALSE, 4.3, 80),
('ClubGG',            'clubgg',     'poker',  'rakeback',      NULL,  30.00, NULL,   'USD', NULL,  NULL,  NULL,   5.00, FALSE, 'weekly',     25.00, ARRAY['crypto','usdt'],                               'ELITEGG',    'https://www.clubgg.com/invite/ELITEGG',                                                          '30% rakeback from day one',                  NULL,        'pending',     'Club-based. Agent manages player pool. 30% rakeback to players. Weekly USDT.',                                                                              FALSE, TRUE,  FALSE, 4.1, 74),
('partypoker',        'partypoker', 'poker',  'cpa',           NULL,  NULL,  150.00, 'USD', 20.00, NULL,  NULL,   0.00, FALSE, 'monthly',   150.00, ARRAY['bank_transfer','neteller'],                    'ELITE40',    'https://www.partypoker.com/how-to-play/account/registration.html?bonuscode=ELITE40',          '40% up to $500 Welcome Bonus',               'ELITE40',   'pending',     'CPA $150 per qualifying first deposit ≥$20. Monthly payments.',                                                                                            FALSE, TRUE,  FALSE, 4.0, 72),
('Stake.com',         'stake',      'casino', 'revenue_share', 40.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   5.00, FALSE, 'weekly',     50.00, ARRAY['crypto','bitcoin','ethereum','litecoin'],      'ELITEPLAY',  'https://stake.com/?c=ELITEPLAY',                                                                 'VIP Rakeback + Weekly Bonuses',              'ELITEPLAY', 'active',      '40% RevShare on casino. Crypto native. Weekly payouts. Best crypto casino deal.',                                                                           FALSE, TRUE,  TRUE,  4.9, 95),
('BitStarz',          'bitstarz',   'casino', 'cpa',           NULL,  NULL,  100.00, 'USD', 20.00, NULL,  NULL,   0.00, FALSE, 'monthly',   100.00, ARRAY['crypto','bitcoin'],                            'ELITE',      'https://www.bitstarz.com/?c=ELITE&i=affiliate',                                                  '5 BTC + 180 Free Spins Welcome Package',     'ELITE',     'pending',     'CPA $100 per first depositor. Award-winning BTC casino.',                                                                                                  FALSE, TRUE,  TRUE,  4.7, 88),
('BC.Game',           'bc-game',    'casino', 'revenue_share', 40.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   3.00, FALSE, 'weekly',     50.00, ARRAY['crypto','bitcoin','ethereum','bnb'],           'ELITEPLAY',  'https://bc.game/i-eliteplay-n/',                                                                 'Up to 220% First Deposit + Daily Lucky Spin', 'ELITEPLAY', 'pending',    '40% RevShare. Strong crypto-native player base. Pragmatic Play slots.',                                                                                    FALSE, TRUE,  TRUE,  4.6, 86),
('Rollbit',           'rollbit',    'casino', 'revenue_share', 35.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   5.00, FALSE, 'weekly',     50.00, ARRAY['crypto','bitcoin','ethereum','solana'],        'ELITEPLAY',  'https://rollbit.com/?c=ELITEPLAY',                                                               'Rakeback + RLB Tokens',                      'ELITEPLAY', 'pending',     '35% RevShare. RLB token economy. Good for influencer traffic.',                                                                                            FALSE, TRUE,  FALSE, 4.4, 82),
('Duelbits',          'duelbits',   'casino', 'revenue_share', 35.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   3.00, FALSE, 'biweekly',   50.00, ARRAY['crypto','bitcoin','ethereum','litecoin'],      'ELITE',      'https://duelbits.com/?ref=ELITE',                                                                '100% up to $200 + Rakeback',                 'ELITE',     'pending',     '35% RevShare. Growing crypto casino with strong esports focus. Biweekly payments.',                                                                        FALSE, TRUE,  FALSE, 4.3, 79),
('Roobet',            'roobet',     'casino', 'revenue_share', 35.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   5.00, FALSE, 'weekly',     50.00, ARRAY['crypto','bitcoin','ethereum'],                 'ELITEPLAY',  'https://roobet.com/?ref=ELITEPLAY',                                                              'Rakeback + Weekly Boost',                    'ELITEPLAY', 'active',      '35% RevShare confirmed. Weekly payouts. Influencer-heavy platform.',                                                                                       FALSE, TRUE,  FALSE, 4.5, 84),
('bet365',            'bet365',     'sports', 'revenue_share', 30.00, NULL,  NULL,   'USD', NULL,  NULL,  NULL,   0.00, TRUE,  'monthly',   100.00, ARRAY['bank_transfer'],                               'EPLYNG',     'https://www.bet365.com/#/AC/B4/C1/D48/E1/I/',                                                   'Up to $30 in Bet Credits',                   NULL,        'negotiating', '30% RevShare. Large established sportsbook. Negative carryover. Application in progress.',                                                                  FALSE, TRUE,  FALSE, 4.4, 78)
ON CONFLICT (operator_slug) DO NOTHING;

-- =====================
-- BADGES (DAR-27)
-- Badge definitions and per-agent award tracking
-- =====================

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,          -- machine-readable key e.g. 'first_referral'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,                -- emoji used in UI
  color TEXT NOT NULL DEFAULT 'blue', -- blue | green | purple | gold | silver | cyan | orange | yellow
  xp_reward INTEGER NOT NULL DEFAULT 0,
  condition_type TEXT NOT NULL,      -- 'referral_count' | 'active_deal' | 'player_revenue' | 'active_player_count' | 'tier' | 'login_streak' | 'dark_coins'
  condition_value NUMERIC NOT NULL,  -- numeric threshold for the condition
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_badges_agent ON public.agent_badges(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_badges_badge ON public.agent_badges(badge_id);

-- RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_public_read" ON public.badges FOR SELECT USING (TRUE);
CREATE POLICY "badges_admin_write" ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.agent_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agent_badges_own_read" ON public.agent_badges FOR SELECT USING (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "agent_badges_system_insert" ON public.agent_badges FOR INSERT WITH CHECK (TRUE);

-- =====================
-- SEED: 10 Starter Badges
-- =====================
INSERT INTO public.badges (key, name, description, icon, color, xp_reward, condition_type, condition_value, sort_order) VALUES
  ('first_referral',       'First Referral',       'Refer your first player to the network',           '🤝', 'blue',   100,  'referral_count',       1,   1),
  ('deal_maker',           'Deal Maker',            'Activate your first operator deal',                '📋', 'green',  100,  'active_deal',          1,   2),
  ('high_roller',          'High Roller',           'A referred player generates 500+ in revenue',      '🎰', 'purple', 250,  'player_revenue',       500, 3),
  ('network_builder',      'Network Builder',       'Build a network of 10 active players',             '🌐', 'cyan',   200,  'active_player_count',  10,  4),
  ('silver_achiever',      'Silver Achiever',       'Reach Silver tier status',                         '🥈', 'silver', 150,  'tier',                 2,   5),
  ('gold_achiever',        'Gold Achiever',         'Reach Gold tier status',                           '🥇', 'gold',   300,  'tier',                 3,   6),
  ('platinum_club',        'Platinum Club',         'Reach Platinum tier status',                       '💎', 'purple', 500,  'tier',                 4,   7),
  ('elite_status',         'Elite Status',          'Reach the top — Elite tier',                       '👑', 'gold',   1000, 'tier',                 5,   8),
  ('streak_master',        'Streak Master',         'Log in 7 days in a row',                           '🔥', 'orange', 150,  'login_streak',         7,   9),
  ('dark_coins_collector', 'Dark Coins Collector',  'Accumulate 100 Dark Coins',                        '🪙', 'yellow', 100,  'dark_coins',           100, 10)
ON CONFLICT (key) DO NOTHING;

-- =====================
-- FUNCTION: check_and_award_badges
-- Call after any XP/tier/referral change to award newly unlocked badges.
-- Returns the count of newly awarded badges.
-- =====================
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_agent_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_agent          public.agents%ROWTYPE;
  v_tier_rank      INTEGER;
  v_referral_count BIGINT;
  v_active_deals   BIGINT;
  v_max_player_rev NUMERIC;
  v_active_players BIGINT;
  v_streak_days    BIGINT;
  v_dark_coins     NUMERIC;
  v_badge          RECORD;
  v_awarded        INTEGER := 0;
  v_qualifies      BOOLEAN;
  -- Tier ordering: bronze=1, silver=2, gold=3, platinum=4, elite=5
  TIER_RANKS       CONSTANT JSONB := '{"bronze":1,"silver":2,"gold":3,"platinum":4,"elite":5}';
BEGIN
  -- Fetch agent row
  SELECT * INTO v_agent FROM public.agents WHERE id = p_agent_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  v_tier_rank := COALESCE((TIER_RANKS ->> v_agent.tier)::INTEGER, 1);

  -- Aggregate stats
  SELECT COUNT(*) INTO v_referral_count
    FROM public.agent_players WHERE agent_id = p_agent_id;

  SELECT COUNT(*) INTO v_active_deals
    FROM public.agent_deals WHERE agent_id = p_agent_id AND status = 'active';

  SELECT COALESCE(MAX(total_revenue), 0) INTO v_max_player_rev
    FROM public.agent_players WHERE agent_id = p_agent_id;

  SELECT COUNT(*) INTO v_active_players
    FROM public.agent_players WHERE agent_id = p_agent_id AND status = 'active';

  -- Login streak: count distinct days with a login_streak XP entry in last 7 days
  SELECT COUNT(DISTINCT DATE(created_at)) INTO v_streak_days
    FROM public.xp_ledger
    WHERE user_id = v_agent.user_id
      AND source = 'login_streak'
      AND created_at >= NOW() - INTERVAL '7 days';

  -- Dark coin balance
  SELECT COALESCE(SUM(amount), 0) INTO v_dark_coins
    FROM public.dark_coins_ledger
    WHERE user_id = v_agent.user_id;

  -- Iterate all badge definitions and award where qualified and not yet earned
  FOR v_badge IN SELECT * FROM public.badges ORDER BY sort_order LOOP
    -- Skip if already awarded
    IF EXISTS (
      SELECT 1 FROM public.agent_badges
      WHERE agent_id = p_agent_id AND badge_id = v_badge.id
    ) THEN CONTINUE; END IF;

    v_qualifies := FALSE;

    CASE v_badge.condition_type
      WHEN 'referral_count'      THEN v_qualifies := v_referral_count    >= v_badge.condition_value;
      WHEN 'active_deal'         THEN v_qualifies := v_active_deals       >= v_badge.condition_value;
      WHEN 'player_revenue'      THEN v_qualifies := v_max_player_rev     >= v_badge.condition_value;
      WHEN 'active_player_count' THEN v_qualifies := v_active_players     >= v_badge.condition_value;
      WHEN 'tier'                THEN v_qualifies := v_tier_rank           >= v_badge.condition_value;
      WHEN 'login_streak'        THEN v_qualifies := v_streak_days        >= v_badge.condition_value;
      WHEN 'dark_coins'          THEN v_qualifies := v_dark_coins         >= v_badge.condition_value;
      ELSE v_qualifies := FALSE;
    END CASE;

    IF v_qualifies THEN
      INSERT INTO public.agent_badges (agent_id, badge_id)
      VALUES (p_agent_id, v_badge.id)
      ON CONFLICT DO NOTHING;

      -- Grant XP reward for the badge
      IF v_badge.xp_reward > 0 AND v_agent.user_id IS NOT NULL THEN
        INSERT INTO public.xp_ledger (user_id, amount, source, reference_id)
        VALUES (v_agent.user_id, v_badge.xp_reward, 'badge_award', v_badge.id);
      END IF;

      v_awarded := v_awarded + 1;
    END IF;
  END LOOP;

  RETURN v_awarded;
END;
$$;
