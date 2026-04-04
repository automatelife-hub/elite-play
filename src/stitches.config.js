import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Gamble Intel Mission Control palette
      intelBlue:     '#0047AB',
      intelCyan:     '#00D9FF',
      intelElectric: '#00F0FF',
      intelDark:     '#0A0E27',
      intelNavy:     '#0F1629',
      missionGold:   '#FFD700',
      alertRed:      '#FF0033',
      secureGreen:   '#00FF41',
      radarGreen:    '#39FF14',

      // Semantic overlays
      cyanGlow10:  'rgba(0, 217, 255, 0.10)',
      cyanGlow20:  'rgba(0, 217, 255, 0.20)',
      cyanGlow30:  'rgba(0, 217, 255, 0.30)',
      cyanGlow50:  'rgba(0, 217, 255, 0.50)',
      cyanGlow70:  'rgba(0, 217, 255, 0.70)',
      darkPanel:   'rgba(10, 14, 39, 0.95)',
      hudOverlay:  'rgba(10, 14, 39, 0.85)',

      greenGlow20: 'rgba(0, 255, 65, 0.20)',
      redGlow20:   'rgba(255, 0, 51, 0.20)',
      goldGlow20:  'rgba(255, 215, 0, 0.20)',
    },
    fonts: {
      tech:    "'Orbitron', 'Exo 2', sans-serif",
      tactical:"'Rajdhani', 'Saira', sans-serif",
      mono:    "'Share Tech Mono', 'Courier New', monospace",
      body:    "system-ui, sans-serif",
    },
    fontSizes: {
      xs:  '10px',
      sm:  '12px',
      md:  '14px',
      lg:  '16px',
      xl:  '20px',
      '2xl': '24px',
      '3xl': '32px',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      bold:   '700',
    },
    letterSpacings: {
      tight:  '0.5px',
      normal: '1px',
      wide:   '2px',
      wider:  '4px',
    },
    radii: {
      none: '0',
      sm:   '2px',
      md:   '4px',
      lg:   '8px',
    },
    shadows: {
      neonBlue:  '0 0 10px rgba(0,217,255,0.6), 0 0 20px rgba(0,71,171,0.4)',
      neonCyan:  '0 0 6px rgba(0,217,255,0.8)',
      neonGreen: '0 0 10px rgba(0,255,65,0.6)',
      neonGold:  '0 0 10px rgba(255,215,0,0.6)',
      neonRed:   '0 0 10px rgba(255,0,51,0.6)',
      panel:     '0 0 10px rgba(0,217,255,0.2)',
    },
  },
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
  },
  utils: {
    neonText: (color) => ({
      color,
      textShadow: `0 0 8px ${color}`,
    }),
    tacticalBorder: (color) => ({
      border: `1px solid ${color}`,
    }),
  },
});

// ─── Reusable keyframes ───────────────────────────────────────────────────────

export const floatAnim = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%':      { transform: 'translateY(-10px)' },
});

export const glowPulse = keyframes({
  '0%, 100%': { boxShadow: '0 0 20px #00D9FF, 0 0 40px #0047AB', opacity: 1 },
  '50%':      { boxShadow: '0 0 10px #00D9FF, 0 0 20px #0047AB', opacity: 0.8 },
});

export const hologramFlicker = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%':      { opacity: 0.85 },
});

export const dataScan = keyframes({
  '0%':        { top: '-100%', opacity: 0 },
  '10%':       { opacity: 1 },
  '90%':       { opacity: 1 },
  '100%':      { top: '100%', opacity: 0 },
});

export const radarPulse = keyframes({
  '0%':   { transform: 'scale(1)',   opacity: 0.8 },
  '100%': { transform: 'scale(1.5)', opacity: 0 },
});

export const shimmer = keyframes({
  '0%':   { left: '-100%' },
  '100%': { left: '200%' },
});

export const neonPulse = keyframes({
  '0%, 100%': { textShadow: '0 0 8px #00D9FF' },
  '50%':      { textShadow: '0 0 20px #00D9FF, 0 0 40px #00D9FF' },
});
