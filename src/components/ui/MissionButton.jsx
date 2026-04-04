import React from 'react';
import { styled, shimmer } from '@/stitches.config';

// Shimmer sweep on hover
const ButtonBase = styled('button', {
  position: 'relative',
  overflow: 'hidden',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: '$tactical',
  fontWeight: '$bold',
  letterSpacing: '$wide',
  textTransform: 'uppercase',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s ease',
  borderRadius: '$none',

  // Shimmer sweep
  '&::before': {
    content: "''",
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    transition: 'none',
  },
  '&:hover::before': {
    animation: `${shimmer} 0.6s ease forwards`,
  },

  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },

  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, #0047AB 0%, #00D9FF 100%)',
        color: '#fff',
        border: '1px solid $intelCyan',
        boxShadow: '$neonBlue',
        '&:hover': { boxShadow: '0 0 20px rgba(0,217,255,0.8), 0 0 40px rgba(0,71,171,0.6)' },
      },
      secondary: {
        background: 'transparent',
        color: '$intelCyan',
        border: '1px solid $intelCyan',
        '&:hover': { background: '$cyanGlow10', boxShadow: '$neonCyan' },
      },
      alert: {
        background: '$redGlow20',
        color: '$alertRed',
        border: '1px solid $alertRed',
        boxShadow: '$neonRed',
        '&:hover': { background: 'rgba(255,0,51,0.3)' },
      },
      gold: {
        background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.1) 100%)',
        color: '$missionGold',
        border: '1px solid $missionGold',
        boxShadow: '$neonGold',
        '&:hover': { background: 'rgba(255,215,0,0.25)', boxShadow: '0 0 20px rgba(255,215,0,0.7)' },
      },
      ghost: {
        background: 'transparent',
        color: '$cyanGlow70',
        border: '1px solid $cyanGlow30',
        '&:hover': { color: '$intelCyan', borderColor: '$intelCyan' },
      },
    },
    size: {
      sm: { fontSize: '$xs', padding: '6px 14px' },
      md: { fontSize: '$md', padding: '10px 20px' },
      lg: { fontSize: '$lg', padding: '14px 28px' },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

const MissionButton = React.forwardRef(({ children, ...props }, ref) => (
  <ButtonBase ref={ref} {...props}>{children}</ButtonBase>
));

MissionButton.displayName = 'MissionButton';

export default MissionButton;
