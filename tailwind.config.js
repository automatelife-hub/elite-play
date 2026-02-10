/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
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
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
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
  			// Gamble Intel Mission Control Colors
  			intel: {
  				blue: '#0047AB',
  				cyan: '#00D9FF',
  				electric: '#00F0FF',
  				dark: '#0A0E27',
  				navy: '#0F1629'
  			},
  			mission: {
  				gold: '#FFD700',
  				'alert-red': '#FF0033',
  				'secure-green': '#00FF41',
  				'radar-green': '#39FF14'
  			},
  			poker: {
  				'spade-black': '#1A1A1A',
  				'heart-red': '#E63946',
  				'diamond-red': '#DC2F02',
  				'club-black': '#000000',
  				'royal-purple': '#6A0DAD',
  				'chip-gold': '#DAA520'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'radar-pulse': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'scale(1.5)',
  					opacity: '0'
  				}
  			},
  			'grid-scan': {
  				'0%': { transform: 'translateY(0)', opacity: '1' },
  				'100%': { transform: 'translateY(100%)', opacity: '0' }
  			},
  			'data-flow': {
  				'0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
  				'10%': { opacity: '1' },
  				'90%': { opacity: '1' },
  				'100%': { transform: 'translateY(-100vh) translateX(50px)', opacity: '0' }
  			},
  			'hologram-flicker': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.8' }
  			},
  			'glitch': {
  				'0%': { transform: 'translate(0)' },
  				'20%': { transform: 'translate(-2px, 2px)' },
  				'40%': { transform: 'translate(-2px, -2px)' },
  				'60%': { transform: 'translate(2px, 2px)' },
  				'80%': { transform: 'translate(2px, -2px)' },
  				'100%': { transform: 'translate(0)' }
  			},
  			'neon-pulse': {
  				'0%, 100%': { 
  					textShadow: '0 0 10px #00D9FF, 0 0 20px #00D9FF, 0 0 30px #0047AB',
  					filter: 'brightness(1)'
  				},
  				'50%': { 
  					textShadow: '0 0 20px #00D9FF, 0 0 30px #00D9FF, 0 0 40px #0047AB',
  					filter: 'brightness(1.2)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'radar-pulse': 'radar-pulse 2s ease-out infinite',
  			'grid-scan': 'grid-scan 3s linear infinite',
  			'data-flow': 'data-flow 4s linear infinite',
  			'hologram-flicker': 'hologram-flicker 0.1s infinite',
  			'glitch': 'glitch 0.3s infinite',
  			'neon-pulse': 'neon-pulse 3s ease-in-out infinite'
  		},
  		fontFamily: {
  			'tech': ['Orbitron', 'Exo 2', 'sans-serif'],
  			'tactical': ['Rajdhani', 'Saira', 'sans-serif'],
  			'mono-tech': ['Share Tech Mono', 'Courier New', 'monospace']
  		},
  		backgroundImage: {
  			'tactical-grid': 'linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px)',
  			'intel-gradient': 'linear-gradient(135deg, #0047AB 0%, #00D9FF 100%)',
  			'mission-gradient': 'linear-gradient(135deg, #0A0E27 0%, #0F1629 100%)'
  		},
  		boxShadow: {
  			'neon-blue': '0 0 10px #00D9FF, 0 0 20px #00D9FF, 0 0 30px #0047AB',
  			'neon-green': '0 0 10px #00FF41, 0 0 20px #00FF41',
  			'neon-gold': '0 0 10px #FFD700, 0 0 20px #FFD700'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}