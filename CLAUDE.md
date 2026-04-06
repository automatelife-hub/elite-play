# Project Overview

Elite Play (rebranded as **Gamble Intel** / Gamble Intelligence Agency) is an affiliate marketing platform for the iGaming/online poker industry. It handles agent onboarding and commission management, marketing asset distribution, AI-powered poker site recommendations, real-time performance analytics and leaderboards, support ticketing, contest tracking, and geo-based site suggestions.

# Tech Stack

- **Runtime:** Node.js (frontend only — no custom server)
- **Frontend:** React 18.2, Vite 6.1, React Router v6
- **Styling:** Tailwind CSS 3.4 with a custom "Mission Control" intelligence theme (colors: `intel-*`, `mission-*`, `alert-*`, `secure-*`); fonts: Syne, DM Sans, JetBrains Mono
- **UI Components:** Radix UI + shadcn/ui (`components.json` configured)
- **Data Fetching:** TanStack React Query v5
- **Forms:** React Hook Form + Zod
- **Backend/Auth/DB:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Edge Functions:** TypeScript, deployed to Supabase
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Maps:** Leaflet + React Leaflet
- **Language:** JavaScript/JSX (frontend); TypeScript (Supabase functions). `jsconfig.json` used instead of `tsconfig.json`; `checkJs` is enabled

# Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Lint (auto-fixes in place)
npm run lint

# Type-check JS files via jsconfig
npm run typecheck
```

> No test runner is configured. There are no unit or E2E tests.

# Code Conventions

- **Path alias:** `@/*` maps to `./src/*` (configured in `jsconfig.json` and `vite.config.js`)
- **Page routing:** File-based auto-routing via `src/pages.config.js`. Add a file to `src/pages/` and it auto-routes to `/{pagename}`. No manual route registration needed.
- **Data access:** Never call Supabase directly. Use the abstraction layer in `src/api/supabaseClient.js`:
  - `db.auth` — authentication helpers
  - `db.entities` — generic CRUD for all tables
  - `db.functions` — invoke Supabase Edge Functions
  - `db.integrations` — email, SMS, LLM, image generation, file upload
- **Table names:** All Supabase tables are aliased in `TABLE_MAP` inside `supabaseClient.js`. Use the alias, not raw strings.
- **Components:** Domain-specific components live in `src/components/<domain>/`. Shared UI primitives (shadcn/Radix) live in `src/components/ui/`.
- **Naming:** PascalCase for components and pages, camelCase for hooks and utilities.
- **Design language:** "Mission Control" / intelligence-agency theme. Stick to the existing Tailwind color tokens — don't introduce arbitrary hex values.

# Environment Variables

Create `.env.local` in the project root (next to `package.json`):

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

These are the only two variables required to run the app locally. The anon key is safe to expose client-side (Supabase RLS enforces access control).

# Important Notes

- **Supabase schema:** `supabase-schema.sql` contains the full database schema (~7 000 lines). Reference it when working on data models or writing new queries.
- **Edge Functions:** Located in `functions/`. Each file is a standalone Deno/TypeScript serverless function deployed to Supabase. Key functions: `calculateAgentCommissions`, `executePayout`, `processPayouts`, `sendOnboardingEmails`.
- **No test suite:** There are currently no automated tests. Validate changes manually via `npm run dev`.
- **Python utility:** `migrate_colors.py` is a one-off script for bulk CSS class replacement — not part of the normal workflow.
- **WhatsApp:** `WhatsAppFloatingButton` and agent conversation stubs are present but not fully wired up.
- **Maps:** Leaflet requires a browser environment; components using `react-leaflet` will fail in SSR contexts (not an issue with Vite/SPA).
- **Build output:** `dist/` is gitignored. Deploy by pointing a static host at the Vite build output.
