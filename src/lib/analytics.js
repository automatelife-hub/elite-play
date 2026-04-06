/**
 * Elite Play — GA4 Analytics (DAR-60)
 *
 * Centralised wrapper around react-ga4. All event tracking for the app
 * lives here so measurement IDs and event names stay in one place.
 *
 * Usage:
 *   import { analytics } from '@/lib/analytics';
 *   analytics.trackEvent('deal_click', { operator: 'ggpoker' });
 *
 * Initialisation:
 *   Call analytics.init() once in App.jsx before any route renders.
 *   It is a no-op when VITE_GA4_MEASUREMENT_ID is not set, so local dev
 *   without the env var stays clean.
 */

import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

let initialised = false;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

function init() {
  if (!MEASUREMENT_ID) return;
  if (initialised) return;
  ReactGA.initialize(MEASUREMENT_ID, {
    // Uncomment to activate GA4 DebugView during development:
    // gaOptions: { debug_mode: import.meta.env.DEV },
  });
  initialised = true;
}

// ---------------------------------------------------------------------------
// Page views
// ---------------------------------------------------------------------------

/**
 * Send a page_view hit. Call this inside a useEffect keyed on location.pathname.
 * GA4 enhanced measurement also fires page_view automatically via the gtag
 * snippet, but we fire it manually here to keep SPA navigation consistent.
 *
 * @param {string} path   - e.g. '/OperatorDeals'
 * @param {string} [title]
 */
function trackPageView(path, title) {
  if (!initialised) return;
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title || document.title,
  });
}

// ---------------------------------------------------------------------------
// Generic event helper
// ---------------------------------------------------------------------------

/**
 * Fire a GA4 custom event.
 *
 * @param {string} eventName
 * @param {object} [params]
 */
function trackEvent(eventName, params = {}) {
  if (!initialised) return;
  ReactGA.event(eventName, params);
}

// ---------------------------------------------------------------------------
// Named events (keep in sync with GA4 conversion goals)
// ---------------------------------------------------------------------------

/** Fired on successful user registration. */
function trackSignUp(method = 'email') {
  trackEvent('sign_up', { method });
}

/** Fired on successful login. */
function trackLogin(method = 'email') {
  trackEvent('login', { method });
}

/**
 * Fired when a deal card becomes visible / user navigates to deal page.
 * @param {object} params
 * @param {string} params.operator_slug
 * @param {string} [params.operator_name]
 * @param {string} [params.deal_type]  e.g. 'rakeback', 'bonus', 'cashback'
 */
function trackDealView({ operator_slug, operator_name, deal_type } = {}) {
  trackEvent('deal_view', { operator_slug, operator_name, deal_type });
}

/**
 * Fired when a user clicks an outbound affiliate link.
 * This is the primary conversion event — mark it as a conversion in GA4.
 *
 * @param {object} params
 * @param {string} params.operator_slug
 * @param {string} [params.operator_name]
 * @param {string} [params.sub_id]
 * @param {string} [params.traffic_source]
 */
function trackDealClick({ operator_slug, operator_name, sub_id, traffic_source } = {}) {
  trackEvent('deal_click', { operator_slug, operator_name, sub_id, traffic_source });
}

/**
 * Fired when a user copies / claims a tracking link.
 *
 * @param {object} params
 * @param {string} params.operator_slug
 * @param {string} [params.sub_id]
 */
function trackDealClaim({ operator_slug, sub_id } = {}) {
  trackEvent('deal_claim', { operator_slug, sub_id });
}

/**
 * Fired when XP is awarded.
 *
 * @param {object} params
 * @param {number} params.amount   - XP amount
 * @param {string} [params.reason] - e.g. 'mission_complete', 'deal_click'
 */
function trackXpEarned({ amount, reason } = {}) {
  trackEvent('xp_earned', { amount, reason });
}

/**
 * Fired when a mission/quest is completed.
 *
 * @param {object} params
 * @param {string} params.mission_id
 * @param {string} [params.mission_title]
 */
function trackMissionComplete({ mission_id, mission_title } = {}) {
  trackEvent('mission_complete', { mission_id, mission_title });
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const analytics = {
  init,
  trackPageView,
  trackEvent,
  trackSignUp,
  trackLogin,
  trackDealView,
  trackDealClick,
  trackDealClaim,
  trackXpEarned,
  trackMissionComplete,
};
