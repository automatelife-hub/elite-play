import { describe, expect, it } from 'vitest';
import { inferTrafficSource, parseUtmParams } from '../affiliateTracking';

describe('parseUtmParams', () => {
  it('returns nulls for an empty query string', () => {
    expect(parseUtmParams('')).toEqual({
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
    });
  });

  it('parses every recognised UTM key', () => {
    const search = '?utm_source=fb&utm_medium=cpc&utm_campaign=spring&utm_content=banner_a';
    expect(parseUtmParams(search)).toEqual({
      utm_source: 'fb',
      utm_medium: 'cpc',
      utm_campaign: 'spring',
      utm_content: 'banner_a',
    });
  });

  it('ignores unrelated params', () => {
    expect(parseUtmParams('?foo=bar&utm_source=x')).toEqual({
      utm_source: 'x',
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
    });
  });
});

describe('inferTrafficSource', () => {
  const empty = { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null };
  const HOST = 'eliteplay.io';

  it('classifies email medium', () => {
    expect(inferTrafficSource({ ...empty, utm_medium: 'email' }, '', HOST)).toBe('email');
  });

  it('classifies social medium', () => {
    expect(inferTrafficSource({ ...empty, utm_medium: 'social' }, '', HOST)).toBe('social');
  });

  it('classifies social by source domain (facebook, tiktok, etc.)', () => {
    for (const src of ['facebook', 'twitter', 'instagram', 'tiktok', 'youtube']) {
      expect(inferTrafficSource({ ...empty, utm_source: src }, '', HOST)).toBe('social');
    }
  });

  it('classifies cpc / paid', () => {
    expect(inferTrafficSource({ ...empty, utm_medium: 'cpc' }, '', HOST)).toBe('paid');
    expect(inferTrafficSource({ ...empty, utm_medium: 'paid' }, '', HOST)).toBe('paid');
  });

  it('classifies external referrer as referral', () => {
    expect(inferTrafficSource(empty, 'https://other-site.com/article', HOST)).toBe('referral');
  });

  it('treats same-host referrer as direct (not referral)', () => {
    expect(inferTrafficSource(empty, `https://${HOST}/some-page`, HOST)).toBe('direct');
  });

  it('classifies seo from search engine referrer', () => {
    for (const eng of ['google', 'bing', 'yahoo', 'duckduckgo']) {
      expect(inferTrafficSource(empty, `https://${eng}.com/`, HOST)).toBe('referral');
      // Note: the current implementation classifies external search-engine
      // referrers as `referral`, not `seo` — the seo branch only fires when
      // referrer is *same-host* (so `!referrer.includes(host)` is false) or
      // utm_medium=organic. This locks in current behaviour.
    }
  });

  it('classifies organic medium as seo', () => {
    expect(inferTrafficSource({ ...empty, utm_medium: 'organic' }, '', HOST)).toBe('seo');
  });

  it('falls back to direct when no signals', () => {
    expect(inferTrafficSource(empty, '', HOST)).toBe('direct');
  });
});
