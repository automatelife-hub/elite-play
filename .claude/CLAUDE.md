# Elite Play — Claude Code Context

## What this project is
A gambling intelligence and casino affiliate platform ("Gamble Intel") built with React + Vite, Supabase, and deployed to Vercel. It provides casino game intelligence, operator reviews, and real-time gambling data to players and affiliates. The frontend uses shadcn/ui and Tailwind; Supabase handles auth, database, and edge functions via Cloudflare Workers (`functions/`).

## Project type
Language: JavaScript (JSX)  Framework: React + Vite  Package manager: npm

## Key directories / files
- `src/` — React SPA source (components, pages, hooks, API clients)
- `functions/` — Cloudflare Workers / Vercel edge functions
- `supabase/` — Supabase migrations, edge function source, config
- `public/` — Static assets
- `supabase-schema.sql` — Full database schema (reference before migrations)
- `vercel.json` — Vercel deployment config
- `GAMBLE_INTEL_IMPLEMENTATION.md` — Implementation spec for Gamble Intel features
- `GAMBLE_INTEL_REDESIGN.md` — Redesign plan and visual direction
- `REDESIGN_SUMMARY.md` — Completed redesign summary
- `FRONTEND_ANALYSIS_REPORT.md` — Frontend audit findings
- `stitch_content_deal_requests.zip` — Content partnership assets

## Skills to invoke
- superpowers:brainstorming — before planning any change
- superpowers:writing-plans — for multi-step work
- superpowers:subagent-driven-development — for executing plans
- superpowers:systematic-debugging — when hitting bugs
- superpowers:test-driven-development — when adding features
- page-cro — for affiliate landing page and casino review conversion
- seo-audit — for organic gambling search traffic
- deep-research — for casino affiliate compliance and market research

## Agents to use
- Frontend Developer — React, shadcn/ui, Tailwind, framer-motion animations
- Backend Architect — Supabase schema, RLS, edge functions
- SEO Specialist — Gambling affiliate SEO, casino keyword strategy
- Legal Compliance Checker — Gambling regulations, affiliate disclaimers
- Database Optimizer — Supabase PostgreSQL query and index optimization

## Critical notes
- An existing `CLAUDE.md` is at the project root — read it before making changes (it may have current sprint context)
- Sentry is integrated (`@sentry/react`, `@sentry/vite-plugin`) — check Sentry config before changing error handling
- Deployed to Vercel — `vercel.json` controls routing; edge functions must be Cloudflare-compatible
- `migrate_colors.py` at root — one-off color migration script, not part of regular build
- Supabase RLS is active — any new tables need RLS policies before data is accessible
