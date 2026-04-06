/**
 * Elite Play — Affiliate Tracking Utility (DAR-20)
 *
 * Client-side utilities for:
 *  - Recording affiliate clicks via Supabase RPC
 *  - Generating / resolving SubID tracking URLs
 *  - Reading UTM params and persisting session attribution
 */

import { supabase } from '@/api/supabaseClient';
import { analytics } from '@/lib/analytics';

// ---------------------------------------------------------------------------
// Session storage keys
// ---------------------------------------------------------------------------
const SESSION_KEY_SUB_ID    = 'ep_sub_id';
const SESSION_KEY_OPERATOR  = 'ep_operator';
const SESSION_KEY_SOURCE    = 'ep_source';
const SESSION_KEY_UTM       = 'ep_utm';
const COOKIE_SESSION_ID     = 'ep_session';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate or retrieve a stable anonymous session ID (stored in cookie). */
function getSessionId() {
  const name = COOKIE_SESSION_ID + '=';
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const trimmed = c.trim();
    if (trimmed.startsWith(name)) return trimmed.substring(name.length);
  }
  // Create new session ID
  const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
  // Expires in 30 days
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_SESSION_ID}=${id}; expires=${expires}; path=/; SameSite=Lax`;
  return id;
}

/** Simple browser fingerprint (non-PII, for duplicate detection). */
async function getFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || '',
    navigator.platform || '',
  ].join('|');

  // SHA-256 hash of components (no crypto.subtle fallback needed, using btoa as approximation)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(components));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback: simple checksum
  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    hash = ((hash << 5) - hash) + components.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/** Parse UTM params from a URL search string. */
function parseUtmParams(search) {
  const params = new URLSearchParams(search);
  return {
    utm_source:   params.get('utm_source')   || null,
    utm_medium:   params.get('utm_medium')   || null,
    utm_campaign: params.get('utm_campaign') || null,
    utm_content:  params.get('utm_content')  || null,
  };
}

/** Infer traffic source from UTMs / referrer. */
function inferTrafficSource(utms, referrer) {
  if (utms.utm_medium === 'email') return 'email';
  if (utms.utm_medium === 'social' || ['facebook', 'twitter', 'instagram', 'tiktok', 'youtube'].some(s => (utms.utm_source || '').includes(s))) return 'social';
  if (utms.utm_medium === 'cpc' || utms.utm_medium === 'paid') return 'paid';
  if (utms.utm_source === 'referral' || (referrer && !referrer.includes(window.location.hostname))) return 'referral';
  if (utms.utm_medium === 'organic' || (!utms.utm_source && referrer && ['google', 'bing', 'yahoo', 'duckduckgo'].some(s => referrer.includes(s)))) return 'seo';
  return 'direct';
}

// ---------------------------------------------------------------------------
// Attribution persistence
// ---------------------------------------------------------------------------

/**
 * Called on every page load. Captures UTM params and sub_id from URL
 * and persists them to sessionStorage for later use by recordClick().
 */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const subId    = params.get('sub_id');
  const operator = params.get('operator') || params.get('op');

  if (subId) sessionStorage.setItem(SESSION_KEY_SUB_ID, subId);
  if (operator) sessionStorage.setItem(SESSION_KEY_OPERATOR, operator);

  const utms = parseUtmParams(window.location.search);
  const hasUtm = Object.values(utms).some(Boolean);
  if (hasUtm) sessionStorage.setItem(SESSION_KEY_UTM, JSON.stringify(utms));

  const source = inferTrafficSource(utms, document.referrer);
  if (source !== 'direct' || subId) {
    sessionStorage.setItem(SESSION_KEY_SOURCE, source);
  }
}

/** Returns currently captured attribution context. */
export function getAttribution() {
  let utms = {};
  try { utms = JSON.parse(sessionStorage.getItem(SESSION_KEY_UTM) || '{}'); } catch {}
  return {
    sub_id:   sessionStorage.getItem(SESSION_KEY_SUB_ID),
    operator: sessionStorage.getItem(SESSION_KEY_OPERATOR),
    source:   sessionStorage.getItem(SESSION_KEY_SOURCE) || 'direct',
    ...utms,
  };
}

// ---------------------------------------------------------------------------
// Click recording
// ---------------------------------------------------------------------------

/**
 * Record an affiliate click event.
 *
 * @param {object} opts
 * @param {string}  opts.subId          - The subID on the tracking link
 * @param {string}  opts.operatorSlug   - e.g. 'ggpoker'
 * @param {string}  [opts.trafficSource] - overrides auto-detected source
 * @param {string}  [opts.landingPage]  - current page path
 * @param {string}  [opts.affiliateLinkId] - UUID of the affiliate_links row
 * @param {string}  [opts.userId]       - authenticated user UUID
 * @returns {Promise<object>} { id, is_bot, is_duplicate, duplicate_of }
 */
export async function recordClick({ subId, operatorSlug, trafficSource, landingPage, affiliateLinkId, userId } = {}) {
  if (!subId || !operatorSlug) {
    console.warn('[affiliateTracking] recordClick: missing subId or operatorSlug');
    return null;
  }

  try {
    const attribution = getAttribution();
    const sessionId   = getSessionId();
    const fingerprint = await getFingerprint();
    const source      = trafficSource || attribution.source || 'direct';

    const { data, error } = await supabase.rpc('record_affiliate_click', {
      p_sub_id:           subId,
      p_operator_slug:    operatorSlug,
      p_traffic_source:   source,
      p_session_id:       sessionId,
      p_fingerprint:      fingerprint,
      p_user_agent:       navigator.userAgent,
      p_landing_page:     landingPage || window.location.pathname,
      p_affiliate_link_id: affiliateLinkId || null,
      p_user_id:          userId || null,
      p_utm_source:       attribution.utm_source || null,
      p_utm_medium:       attribution.utm_medium || null,
      p_utm_campaign:     attribution.utm_campaign || null,
      p_utm_content:      attribution.utm_content || null,
    });

    if (error) {
      console.error('[affiliateTracking] recordClick error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[affiliateTracking] recordClick exception:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// SubID URL generation (client calls Supabase RPC)
// ---------------------------------------------------------------------------

/**
 * Generate a new tracking link via the Supabase `create_tracking_link` RPC.
 *
 * @param {object} opts
 * @param {string} opts.operatorSlug
 * @param {string} opts.baseUrl        - The operator's affiliate base URL
 * @param {string} opts.trafficSource  - 'seo' | 'social' | 'email' | 'referral' | 'direct' | 'paid' | 'other'
 * @param {string} [opts.agentId]      - UUID of the generating agent/user
 * @param {string} [opts.label]        - Human-readable label
 * @returns {Promise<object>}  The subid_tracking_links row
 */
export async function createTrackingLink({ operatorSlug, baseUrl, trafficSource, agentId, label }) {
  const { data, error } = await supabase.rpc('create_tracking_link', {
    p_operator_slug:  operatorSlug,
    p_base_url:       baseUrl,
    p_traffic_source: trafficSource,
    p_agent_id:       agentId || null,
    p_label:          label || null,
  });

  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Operator base URLs
// ---------------------------------------------------------------------------

/** Known affiliate base URLs per operator slug. */
export const OPERATOR_BASE_URLS = {
  ggpoker:    'https://ggpoker.com/ref/',
  pokerstars: 'https://www.pokerstars.com/poker/download/?source=',
  'acr-poker': 'https://www.americascardroom.eu/poker-bonus/?bonus=',
  bovada:     'https://www.bovada.lv/?overlayid=AFFPPA&btag=',
  betonline:  'https://betonline.ag/promotions/poker?ref=',
  stake:      'https://stake.com/?c=',
  'wpt-global': 'https://www.wptglobal.com/deposit/?bonus=',
  'acr-poker': 'https://www.americascardroom.eu/poker-bonus/?bonus=',
  partypoker: 'https://www.partypoker.com/how-to-play/account/registration.html?bonuscode=',
  '888poker':  'https://www.888poker.com/poker/download/?tcode=',
};

/** Returns the operator's tracking base URL or a placeholder. */
export function getOperatorBaseUrl(slug) {
  return OPERATOR_BASE_URLS[slug] || `https://${slug}.com/affiliate?ref=`;
}

// ---------------------------------------------------------------------------
// Build a redirect URL for a tracked outbound click (used on landing pages)
// ---------------------------------------------------------------------------

/**
 * Build a tracked outbound URL for a given operator and subID.
 * Also records the click asynchronously (fire-and-forget).
 *
 * @param {string} subId
 * @param {string} operatorSlug
 * @param {string} [affiliateLinkId]
 * @param {string} [userId]
 * @returns {string} The full outbound URL to navigate to
 */
export function buildOutboundUrl(subId, operatorSlug, affiliateLinkId, userId) {
  // Fire-and-forget click recording (Supabase + GA4)
  recordClick({ subId, operatorSlug, affiliateLinkId, userId }).catch(() => {});
  analytics.trackDealClick({ operator_slug: operatorSlug, sub_id: subId });

  const base = getOperatorBaseUrl(operatorSlug);
  return base + encodeURIComponent(subId);
}

/**
 * Call when a user copies/claims a tracking link (deal_claim event).
 *
 * @param {string} subId
 * @param {string} operatorSlug
 */
export function claimTrackingLink(subId, operatorSlug) {
  analytics.trackDealClaim({ operator_slug: operatorSlug, sub_id: subId });
}
