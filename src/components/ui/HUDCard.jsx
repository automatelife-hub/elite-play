import React from 'react';
import { styled } from '@/stitches.config';

// ─── Styled primitives ────────────────────────────────────────────────────────

const CardRoot = styled('div', {
  position: 'relative',
  background: '$darkPanel',
  backdropFilter: 'blur(10px)',
  border: '1px solid $cyanGlow30',
  borderRadius: '$none',
  overflow: 'visible',

  // top-left corner bracket
  '&::before': {
    content: "''",
    position: 'absolute',
    top: '-1px',
    left: '-1px',
    width: '16px',
    height: '16px',
    border: '2px solid currentColor',
    borderRight: 'none',
    borderBottom: 'none',
  },
  // top-right corner bracket
  '&::after': {
    content: "''",
    position: 'absolute',
    top: '-1px',
    right: '-1px',
    width: '16px',
    height: '16px',
    border: '2px solid currentColor',
    borderLeft: 'none',
    borderBottom: 'none',
  },

  variants: {
    glow: {
      cyan:  { color: '$intelCyan',   boxShadow: '0 0 10px rgba(0,217,255,0.25)' },
      green: { color: '$secureGreen', boxShadow: '0 0 10px rgba(0,255,65,0.25)'  },
      gold:  { color: '$missionGold', boxShadow: '0 0 10px rgba(255,215,0,0.25)' },
      red:   { color: '$alertRed',    boxShadow: '0 0 10px rgba(255,0,51,0.25)'  },
      none:  { color: '$cyanGlow30',  boxShadow: 'none' },
    },
  },
  defaultVariants: { glow: 'cyan' },
});

// Bottom corner brackets via a sibling element
const BottomCorners = styled('div', {
  position: 'absolute',
  bottom: '-1px',
  left: '-1px',
  right: '-1px',
  pointerEvents: 'none',

  '&::before': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '16px',
    height: '16px',
    border: '2px solid currentColor',
    borderRight: 'none',
    borderTop: 'none',
  },
  '&::after': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '16px',
    height: '16px',
    border: '2px solid currentColor',
    borderLeft: 'none',
    borderTop: 'none',
  },
});

const CardHeader = styled('div', {
  padding: '16px 20px 12px',
  borderBottom: '1px solid $cyanGlow20',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
});

const CardTitle = styled('h3', {
  fontFamily: '$tactical',
  fontSize: '$md',
  fontWeight: '$bold',
  letterSpacing: '$wide',
  textTransform: 'uppercase',
  color: '$intelCyan',
  margin: 0,
  textShadow: '0 0 8px rgba(0,217,255,0.4)',
});

const CardContent = styled('div', {
  padding: '16px 20px',
  color: '$intelCyan',
  fontFamily: '$mono',
  fontSize: '$sm',
  lineHeight: 1.6,
});

const CardFooter = styled('div', {
  padding: '12px 20px 16px',
  borderTop: '1px solid $cyanGlow20',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

// ─── Compound component ───────────────────────────────────────────────────────

const HUDCard = React.forwardRef(({ children, glow = 'cyan', ...props }, ref) => (
  <CardRoot ref={ref} glow={glow} {...props}>
    {children}
    <BottomCorners />
  </CardRoot>
));

HUDCard.displayName = 'HUDCard';

HUDCard.Header  = CardHeader;
HUDCard.Title   = CardTitle;
HUDCard.Content = CardContent;
HUDCard.Footer  = CardFooter;

export default HUDCard;
