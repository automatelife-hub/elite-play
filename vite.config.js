import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
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
});
