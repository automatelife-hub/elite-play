-- ============================================================
-- Elite Play — Affiliate Tracking Functions (DAR-20)
-- Fraud detection, SubID URL generation, commission aggregation
-- ============================================================

-- =====================
-- FUNCTION: generate_sub_id
-- Generates a unique subID for a given operator + traffic source + agent
-- Format: {operator_prefix}_{source_prefix}_{agent_short}_{random}
-- =====================
CREATE OR REPLACE FUNCTION public.generate_sub_id(
  p_operator_slug TEXT,
  p_traffic_source TEXT,
  p_agent_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_operator_prefix TEXT;
  v_source_prefix   TEXT;
  v_agent_short     TEXT := 'anon';
  v_random          TEXT;
  v_sub_id          TEXT;
  v_attempt         INTEGER := 0;
BEGIN
  -- Derive short prefixes
  v_operator_prefix := UPPER(LEFT(REPLACE(p_operator_slug, '-', ''), 4));
  v_source_prefix   := UPPER(LEFT(p_traffic_source, 3));

  -- Agent short suffix (first 6 chars of UUID without dashes)
  IF p_agent_id IS NOT NULL THEN
    v_agent_short := UPPER(LEFT(REPLACE(p_agent_id::TEXT, '-', ''), 6));
  END IF;

  -- Generate unique subID with collision check
  LOOP
    v_random  := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    v_sub_id  := v_operator_prefix || '_' || v_source_prefix || '_' || v_agent_short || '_' || v_random;

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.subid_tracking_links WHERE sub_id = v_sub_id
    );

    v_attempt := v_attempt + 1;
    IF v_attempt > 20 THEN
      RAISE EXCEPTION 'Could not generate unique sub_id after 20 attempts';
    END IF;
  END LOOP;

  RETURN v_sub_id;
END;
$$;

-- =====================
-- FUNCTION: create_tracking_link
-- Creates a fully-qualified tracking URL and persists the subid_tracking_links record.
-- Returns the created row.
-- =====================
CREATE OR REPLACE FUNCTION public.create_tracking_link(
  p_operator_slug   TEXT,
  p_base_url        TEXT,
  p_traffic_source  TEXT,
  p_agent_id        UUID DEFAULT NULL,
  p_label           TEXT DEFAULT NULL
)
RETURNS public.subid_tracking_links
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sub_id   TEXT;
  v_full_url TEXT;
  v_row      public.subid_tracking_links;
BEGIN
  -- Generate unique subID
  v_sub_id := public.generate_sub_id(p_operator_slug, p_traffic_source, p_agent_id);

  -- Build full tracking URL (append sub_id as query param)
  IF p_base_url LIKE '%?%' THEN
    v_full_url := p_base_url || '&sub_id=' || v_sub_id;
  ELSE
    v_full_url := p_base_url || '?sub_id=' || v_sub_id;
  END IF;

  INSERT INTO public.subid_tracking_links (
    sub_id, operator_slug, base_url, full_url,
    traffic_source, agent_id, label, is_active
  ) VALUES (
    v_sub_id, p_operator_slug, p_base_url, v_full_url,
    p_traffic_source, p_agent_id, p_label, TRUE
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

-- =====================
-- FUNCTION: record_affiliate_click
-- Inserts a click event with duplicate / bot detection.
-- Returns the inserted row id and fraud flags.
-- =====================
CREATE OR REPLACE FUNCTION public.record_affiliate_click(
  p_sub_id          TEXT,
  p_operator_slug   TEXT,
  p_traffic_source  TEXT DEFAULT 'direct',
  p_session_id      TEXT DEFAULT NULL,
  p_fingerprint     TEXT DEFAULT NULL,
  p_ip_hash         TEXT DEFAULT NULL,
  p_user_agent      TEXT DEFAULT NULL,
  p_country_code    CHAR(2) DEFAULT NULL,
  p_user_id         UUID DEFAULT NULL,
  p_landing_page    TEXT DEFAULT NULL,
  p_utm_source      TEXT DEFAULT NULL,
  p_utm_medium      TEXT DEFAULT NULL,
  p_utm_campaign    TEXT DEFAULT NULL,
  p_utm_content     TEXT DEFAULT NULL,
  p_affiliate_link_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_bot        BOOLEAN := FALSE;
  v_is_duplicate  BOOLEAN := FALSE;
  v_duplicate_of  UUID    := NULL;
  v_new_id        UUID;
  v_cutoff        TIMESTAMPTZ := NOW() - INTERVAL '24 hours';
  v_user_agent_lc TEXT;
BEGIN
  -- ---- Bot detection (basic) ----
  v_user_agent_lc := LOWER(COALESCE(p_user_agent, ''));
  IF v_user_agent_lc ~ '(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|sogou|exabot|facebot|ia_archiver|bot|crawler|spider|scraper|headless|phantom|selenium|puppeteer)' THEN
    v_is_bot := TRUE;
  END IF;
  -- Empty user agent is suspicious
  IF p_user_agent IS NULL OR LENGTH(TRIM(p_user_agent)) = 0 THEN
    v_is_bot := TRUE;
  END IF;

  -- ---- Duplicate detection ----
  -- Check: same session_id clicked same operator within 24h
  IF p_session_id IS NOT NULL AND NOT v_is_bot THEN
    SELECT id INTO v_duplicate_of
    FROM public.affiliate_click_events
    WHERE session_id = p_session_id
      AND operator_slug = p_operator_slug
      AND clicked_at > v_cutoff
      AND is_duplicate = FALSE
    ORDER BY clicked_at DESC
    LIMIT 1;

    IF v_duplicate_of IS NOT NULL THEN
      v_is_duplicate := TRUE;
    END IF;
  END IF;

  -- Check: same fingerprint clicked same operator within 24h (stronger signal)
  IF p_fingerprint IS NOT NULL AND NOT v_is_bot AND NOT v_is_duplicate THEN
    SELECT id INTO v_duplicate_of
    FROM public.affiliate_click_events
    WHERE fingerprint_hash = p_fingerprint
      AND operator_slug = p_operator_slug
      AND clicked_at > v_cutoff
      AND is_duplicate = FALSE
    ORDER BY clicked_at DESC
    LIMIT 1;

    IF v_duplicate_of IS NOT NULL THEN
      v_is_duplicate := TRUE;
    END IF;
  END IF;

  -- ---- Insert click event ----
  INSERT INTO public.affiliate_click_events (
    sub_id, operator_slug, affiliate_link_id,
    traffic_source, utm_source, utm_medium, utm_campaign, utm_content, landing_page,
    session_id, fingerprint_hash, ip_hash, user_agent, country_code, user_id,
    is_bot, is_duplicate, duplicate_of
  ) VALUES (
    p_sub_id, p_operator_slug, p_affiliate_link_id,
    p_traffic_source, p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content, p_landing_page,
    p_session_id, p_fingerprint, p_ip_hash, p_user_agent, p_country_code, p_user_id,
    v_is_bot, v_is_duplicate, v_duplicate_of
  )
  RETURNING id INTO v_new_id;

  -- ---- Increment click counter on subid_tracking_links (non-duplicate, non-bot only) ----
  IF NOT v_is_bot AND NOT v_is_duplicate THEN
    UPDATE public.subid_tracking_links
    SET click_count = click_count + 1,
        updated_at  = NOW()
    WHERE sub_id = p_sub_id;
  END IF;

  RETURN jsonb_build_object(
    'id',           v_new_id,
    'is_bot',       v_is_bot,
    'is_duplicate', v_is_duplicate,
    'duplicate_of', v_duplicate_of
  );
END;
$$;

-- =====================
-- FUNCTION: get_operator_commission_summary
-- Aggregates conversions per operator for the commission dashboard.
-- p_range: '7d' | '30d' | '90d' | 'mtd' | 'all'
-- =====================
CREATE OR REPLACE FUNCTION public.get_operator_commission_summary(
  p_range TEXT DEFAULT '30d'
)
RETURNS TABLE(
  operator_slug        TEXT,
  operator_name        TEXT,
  deal_type            TEXT,
  total_clicks         BIGINT,
  valid_clicks         BIGINT,
  registrations        BIGINT,
  first_deposits       BIGINT,
  total_deposits       NUMERIC,
  total_commission     NUMERIC,
  unreconciled_count   BIGINT,
  last_conversion_at   TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start TIMESTAMPTZ;
BEGIN
  v_start := CASE p_range
    WHEN '7d'  THEN NOW() - INTERVAL '7 days'
    WHEN '30d' THEN NOW() - INTERVAL '30 days'
    WHEN '90d' THEN NOW() - INTERVAL '90 days'
    WHEN 'mtd' THEN DATE_TRUNC('month', NOW())
    ELSE        '1970-01-01'::TIMESTAMPTZ
  END;

  RETURN QUERY
  SELECT
    od.operator_slug,
    od.operator_name,
    od.deal_type,
    -- Total clicks (all)
    COUNT(DISTINCT ce.id)                                        AS total_clicks,
    -- Valid clicks (non-bot, non-duplicate)
    COUNT(DISTINCT ce.id) FILTER (WHERE NOT ce.is_bot AND NOT ce.is_duplicate) AS valid_clicks,
    -- Conversions
    COUNT(DISTINCT cv.id) FILTER (WHERE cv.conversion_type = 'registration')   AS registrations,
    COUNT(DISTINCT cv.id) FILTER (WHERE cv.conversion_type = 'first_deposit')  AS first_deposits,
    COALESCE(SUM(cv.deposit_amount)    FILTER (WHERE cv.deposit_amount IS NOT NULL),    0) AS total_deposits,
    COALESCE(SUM(cv.commission_amount) FILTER (WHERE cv.commission_amount IS NOT NULL), 0) AS total_commission,
    COUNT(DISTINCT cv.id) FILTER (WHERE NOT cv.is_reconciled)                  AS unreconciled_count,
    MAX(cv.converted_at)                                                        AS last_conversion_at
  FROM public.operator_deals od
  LEFT JOIN public.affiliate_click_events ce
    ON ce.operator_slug = od.operator_slug
    AND ce.clicked_at >= v_start
  LEFT JOIN public.affiliate_conversions cv
    ON cv.operator_slug = od.operator_slug
    AND cv.converted_at >= v_start
  WHERE od.is_active = TRUE
  GROUP BY od.operator_slug, od.operator_name, od.deal_type
  ORDER BY total_commission DESC;
END;
$$;

-- =====================
-- FUNCTION: reconcile_conversion
-- Marks a conversion as reconciled and records any discrepancy.
-- =====================
CREATE OR REPLACE FUNCTION public.reconcile_conversion(
  p_conversion_id       UUID,
  p_operator_report_amount NUMERIC,
  p_operator_report_date   DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conv            public.affiliate_conversions%ROWTYPE;
  v_discrepancy     NUMERIC;
BEGIN
  SELECT * INTO v_conv
  FROM public.affiliate_conversions
  WHERE id = p_conversion_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversion % not found', p_conversion_id;
  END IF;

  v_discrepancy := p_operator_report_amount - COALESCE(v_conv.commission_amount, 0);

  UPDATE public.affiliate_conversions
  SET
    is_reconciled         = TRUE,
    reconciled_at         = NOW(),
    discrepancy_amount    = v_discrepancy,
    operator_report_date  = COALESCE(p_operator_report_date, operator_report_date),
    reported_at           = NOW()
  WHERE id = p_conversion_id;

  RETURN jsonb_build_object(
    'id',           p_conversion_id,
    'reconciled',   TRUE,
    'our_amount',   v_conv.commission_amount,
    'report_amount', p_operator_report_amount,
    'discrepancy',  v_discrepancy
  );
END;
$$;

-- =====================
-- FUNCTION: bulk_reconcile_from_report
-- Takes an array of {conversion_id, reported_amount} objects and reconciles all.
-- Returns summary counts.
-- =====================
CREATE OR REPLACE FUNCTION public.bulk_reconcile_from_report(
  p_rows JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_row         JSONB;
  v_matched     INTEGER := 0;
  v_discrepancy INTEGER := 0;
  v_not_found   INTEGER := 0;
  v_result      JSONB;
BEGIN
  FOR v_row IN SELECT * FROM jsonb_array_elements(p_rows) LOOP
    BEGIN
      v_result := public.reconcile_conversion(
        (v_row->>'conversion_id')::UUID,
        (v_row->>'reported_amount')::NUMERIC,
        (v_row->>'report_date')::DATE
      );
      IF (v_result->>'discrepancy')::NUMERIC <> 0 THEN
        v_discrepancy := v_discrepancy + 1;
      ELSE
        v_matched := v_matched + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_not_found := v_not_found + 1;
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'matched',     v_matched,
    'discrepancy', v_discrepancy,
    'not_found',   v_not_found,
    'total',       v_matched + v_discrepancy + v_not_found
  );
END;
$$;
