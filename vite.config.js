import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_ prefixed) so we can bridge the
  // Supabase integration vars (NEXT_PUBLIC_SUPABASE_*, SUPABASE_*) into the
  // VITE_ names the client code reads via import.meta.env.
  const env = loadEnv(mode, process.cwd(), '')

  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.SUPABASE_URL ||
    ''
  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    ''

  return {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    plugins: [
        react(),
        visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
        // Upload source maps to Sentry on production builds (no-op if env vars absent)
        sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            silent: true,
            telemetry: false,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-ui': [
                        'framer-motion',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-select',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-accordion',
                        '@radix-ui/react-tooltip',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-alert-dialog',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-label',
                        '@radix-ui/react-progress',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-toast',
                    ],
                    'vendor-data': [
                        '@tanstack/react-query',
                        '@supabase/supabase-js',
                        'zod',
                        'react-hook-form',
                        '@hookform/resolvers',
                    ],
                    'vendor-charts': ['recharts'],
                    'vendor-map': ['leaflet', 'react-leaflet'],
                    'vendor-misc': [
                        'date-fns',
                        'react-day-picker',
                        'react-markdown',
                        'canvas-confetti',
                        'lucide-react',
                        'sonner',
                        'next-themes',
                        'clsx',
                        'tailwind-merge',
                        'class-variance-authority',
                    ],
                },
            },
        },
    },
  }
})
