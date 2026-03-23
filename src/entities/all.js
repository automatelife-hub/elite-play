import { db } from '@/api/supabaseClient';

// Auth
export const User = db.auth;

// Core content
export const Site = db.entities.Site;
export const Article = db.entities.Article;

// User activity
export const UserSiteSignup = db.entities.UserSiteSignup;
export const UserStats = db.entities.UserStats;

// Agent system
export const Agent = db.entities.Agent;
export const AgentAchievement = db.entities.AgentAchievement;
export const AgentCommission = db.entities.AgentCommission;
export const AgentContest = db.entities.AgentContest;
export const AgentDeal = db.entities.AgentDeal;
export const AgentOnboarding = db.entities.AgentOnboarding;
export const AgentPlayer = db.entities.AgentPlayer;
export const AgentReferral = db.entities.AgentReferral;
export const AgentReferralLink = db.entities.AgentReferralLink;

// Affiliate
export const AffiliateEarnings = db.entities.AffiliateEarnings;
export const AffiliateLink = db.entities.AffiliateLink;

// Contests
export const ContestParticipant = db.entities.ContestParticipant;

// Deals
export const CustomDealRequest = db.entities.CustomDealRequest;

// Marketing
export const MarketingAsset = db.entities.MarketingAsset;
export const MarketingCampaign = db.entities.MarketingCampaign;
export const MarketingRequest = db.entities.MarketingRequest;

// Payouts
export const PayoutBatch = db.entities.PayoutBatch;

// Services
export const Service = db.entities.ServicePackage;
export const ServicePurchase = db.entities.ServiceOrder;
export const ServicePackage = db.entities.ServicePackage;
export const ServiceOrder = db.entities.ServiceOrder;

// Support
export const SupportTicket = db.entities.SupportTicket;
