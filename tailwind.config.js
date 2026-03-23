/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
  			popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
  			primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  			secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
  			muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
  			accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
  			destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: { '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))', '3': 'hsl(var(--chart-3))', '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))' },
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			gi: {
  				base: '#080C14',
  				surface: '#0D1424',
  				elevated: '#141E35',
  				'blue-600': '#2563EB',
  				'blue-500': '#3B82F6',
  				'blue-400': '#60A5FA',
  				'blue-300': '#93C5FD',
  				'blue-glow': '#1D4ED8',
  				gold: '#C8A951',
  				'gold-light': '#E8C878',
  				success: '#10B981',
  				danger: '#F43F5E',
  				warning: '#F59E0B',
  				'text-1': '#F1F5F9',
  				'text-2': '#94A3B8',
  				'text-3': '#475569'
  			},
  			intel: { blue: '#2563EB', cyan: '#60A5FA', electric: '#93C5FD', dark: '#080C14', navy: '#0D1424' },
  			mission: { gold: '#C8A951', 'alert-red': '#F43F5E', 'secure-green': '#10B981', 'radar-green': '#34D399' },
  			poker: {
  				'spade-black': '#1A1A1A', 'heart-red': '#F43F5E', 'diamond-red': '#E11D48',
  				'club-black': '#000000', 'royal-purple': '#7C3AED', 'chip-gold': '#C8A951'
  			}
  		},
  		keyframes: {
  			'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
  			'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
  			'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  			'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  			'float': { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
  			'pulse-blue': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.85' } },
  			'shine': { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
  			'radar-pulse': { '0%': { transform: 'scale(0.95)', opacity: '1' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
  			'grid-scan': { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(100%)', opacity: '0' } },
  			'neon-pulse': { '0%, 100%': { filter: 'brightness(1)' }, '50%': { filter: 'brightness(1.1)' } }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-up': 'fade-up 0.5s ease-out forwards',
  			'fade-in': 'fade-in 0.4s ease-out forwards',
  			'float': 'float 4s ease-in-out infinite',
  			'pulse-blue': 'pulse-blue 2.5s ease-in-out infinite',
  			'shine': 'shine 3s linear infinite',
  			'radar-pulse': 'radar-pulse 2s ease-out infinite',
  			'grid-scan': 'grid-scan 3s linear infinite',
  			'neon-pulse': 'neon-pulse 3s ease-in-out infinite'
  		},
  		fontFamily: {
  			'display': ['Syne', 'sans-serif'],
  			'body': ['DM Sans', 'sans-serif'],
  			'mono': ['JetBrains Mono', 'Share Tech Mono', 'monospace'],
  			'tech': ['Syne', 'sans-serif'],
  			'tactical': ['DM Sans', 'sans-serif'],
  			'mono-tech': ['JetBrains Mono', 'Share Tech Mono', 'monospace']
  		},
  		backgroundImage: {
  			'gi-grid': 'radial-gradient(circle, rgba(37,99,235,0.08) 1px, transparent 1px)',
  			'gi-gradient': 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
  			'tactical-grid': 'linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px)',
  			'intel-gradient': 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
  			'mission-gradient': 'linear-gradient(135deg, #080C14 0%, #0D1424 100%)'
  		},
  		boxShadow: {
  			'gi-blue': '0 0 20px rgba(37,99,235,0.25), 0 4px 16px rgba(0,0,0,0.4)',
  			'gi-card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.3)',
  			'gi-glow': '0 0 0 1px rgba(37,99,235,0.3), 0 0 20px rgba(37,99,235,0.15)',
  			'neon-blue': '0 0 12px rgba(37,99,235,0.35), 0 4px 16px rgba(0,0,0,0.3)',
  			'neon-green': '0 0 10px rgba(16,185,129,0.25)',
  			'neon-gold': '0 0 10px rgba(200,169,81,0.25)'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}