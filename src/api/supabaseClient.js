import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// PascalCase entity name -> snake_case Supabase table name
const TABLE_MAP = {
  Agent: 'agents',
  AgentAchievement: 'agent_achievements',
  AgentCommission: 'agent_commissions',
  AgentContest: 'agent_contests',
  AgentDeal: 'agent_deals',
  AgentOnboarding: 'agent_onboarding',
  AgentPlayer: 'agent_players',
  AgentReferral: 'agent_referrals',
  AgentReferralLink: 'agent_referral_links',
  AffiliateEarnings: 'affiliate_earnings',
  AffiliateLink: 'affiliate_links',
  Article: 'articles',
  ContestParticipant: 'contest_participants',
  CustomDealRequest: 'custom_deal_requests',
  MarketingAsset: 'marketing_assets',
  MarketingCampaign: 'marketing_campaigns',
  MarketingRequest: 'marketing_requests',
  PayoutBatch: 'payout_batches',
  Query: 'queries',
  ServiceOrder: 'service_orders',
  ServicePackage: 'service_packages',
  Site: 'sites',
  SupportTicket: 'support_tickets',
  UserSiteSignup: 'user_site_signups',
  UserStats: 'user_stats',
};

/**
 * Parse Sort string into Supabase order params.
 * "-rating" -> { column: "rating", ascending: false }
 * "name"   -> { column: "name", ascending: true }
 */
function parseSort(sort) {
  if (!sort) return null;
  const desc = sort.startsWith('-');
  const column = desc ? sort.slice(1) : sort;
  return { column, ascending: !desc };
}

/**
 * Creates a proxy object that provides entity CRUD API over Supabase
 * but uses Supabase under the hood.
 */
function createEntityProxy(tableName) {
  return {
    async list(sort, limit) {
      let query = supabase.from(tableName).select('*');
      const sortOpts = parseSort(sort);
      if (sortOpts) {
        query = query.order(sortOpts.column, { ascending: sortOpts.ascending });
      }
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async filter(conditions, sort, limit) {
      let query = supabase.from(tableName).select('*');
      for (const [key, value] of Object.entries(conditions)) {
        if (value === undefined || value === null) continue;
        query = query.eq(key, value);
      }
      const sortOpts = parseSort(sort);
      if (sortOpts) {
        query = query.order(sortOpts.column, { ascending: sortOpts.ascending });
      }
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async create(record) {
      const { data, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async bulkUpdate(ids, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .in('id', ids)
        .select();
      if (error) throw error;
      return data || [];
    },

    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    async bulkCreate(records) {
      const { data, error } = await supabase
        .from(tableName)
        .insert(records)
        .select();
      if (error) throw error;
      return data || [];
    },

    async schema() {
      // Return basic schema info - used minimally (Stats page)
      return { json_schema: { properties: {} } };
    },
  };
}

// Entities proxy: auto-resolves db.entities.SomeName to the right table
const entitiesHandler = {};
const entitiesProxy = new Proxy(entitiesHandler, {
  get(target, entityName) {
    if (typeof entityName !== 'string') return undefined;
    if (!target[entityName]) {
      const tableName = TABLE_MAP[entityName] || entityName.toLowerCase();
      target[entityName] = createEntityProxy(tableName);
    }
    return target[entityName];
  },
});

// Auth wrapper: mimics db.auth.me(), .updateMe(), .logout(), etc.
const authWrapper = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }
    // Fetch profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      photo_url: profile?.photo_url || user.user_metadata?.avatar_url || '',
      role: profile?.role || 'user',
      is_agent: profile?.is_agent || false,
      agent_id: profile?.agent_id || null,
      phone: profile?.phone || '',
      country: profile?.country || '',
      preferred_currency: profile?.preferred_currency || 'USD',
      preferred_location: profile?.preferred_location || null,
    };
  },

  async updateMe(data) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);
    if (error) throw error;
  },

  // Alias used in Profile.jsx
  async updateMyUserData(data) {
    return this.updateMe(data);
  },

  async logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  },

  redirectToLogin(returnPath) {
    sessionStorage.setItem('returnPath', returnPath || '/');
    window.location.href = '/login';
  },
};

// Functions wrapper: mimics db.functions.invoke()
const functionsWrapper = {
  async invoke(functionName, params) {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: params,
    });
    if (error) throw error;
    return data;
  },
};

// Integrations wrapper: mimics db.integrations.Core.*
const integrationsWrapper = {
  Core: {
    async InvokeLLM(params) {
      const { data, error } = await supabase.functions.invoke('invoke-llm', {
        body: params,
      });
      if (error) throw error;
      return data;
    },
    async SendEmail(params) {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: params,
      });
      if (error) throw error;
      return data;
    },
    async SendSMS(params) {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: params,
      });
      if (error) throw error;
      return data;
    },
    async UploadFile({ file }) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);
      return { file_url: publicUrl };
    },
    async GenerateImage(params) {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: params,
      });
      if (error) throw error;
      return data;
    },
    async ExtractDataFromUploadedFile(params) {
      const { data, error } = await supabase.functions.invoke('extract-file-data', {
        body: params,
      });
      if (error) throw error;
      return data;
    },
  },
};

// Agents wrapper: stubs for AI agent/chat features (not yet implemented)
// These were used for WhatsApp connect, conversation management, etc.
const agentsWrapper = {
  getWhatsAppConnectURL(agentName) {
    // Placeholder — returns empty string until a real chat system is wired up
    return '';
  },
  async listConversations(params) {
    return [];
  },
  async getConversation(id) {
    return { id, messages: [] };
  },
  async createConversation(params) {
    return { id: 'stub-conv', messages: [] };
  },
  subscribeToConversation(convId, callback) {
    // No-op subscription, return unsubscribe function
    return () => {};
  },
  async addMessage(conversation, message) {
    return { id: 'stub-msg', ...message };
  },
};

// Export the compatibility object with a unified database access object
export const db = {
  auth: authWrapper,
  entities: entitiesProxy,
  functions: functionsWrapper,
  integrations: integrationsWrapper,
  agents: agentsWrapper,
};
