import React from 'react';
import { styled } from '@/stitches.config';

const BadgeRoot = styled('span', {
  display: 'inline-block',
  padding: '3px 8px',
  fontFamily: '$mono',
  fontSize: '$xs',
  fontWeight: '$bold',
  letterSpacing: '$normal',
  textTransform: 'uppercase',
  border: '1px solid currentColor',
  borderRadius: '$sm',
  lineHeight: 1.4,

  variants: {
    level: {
      topSecret:  { color: '$alertRed',    background: '$redGlow20',   borderColor: '$alertRed'    },
      classified: { color: '#FF8C00',      background: 'rgba(255,140,0,0.15)', borderColor: '#FF8C00' },
      restricted: { color: '$missionGold', background: '$goldGlow20',  borderColor: '$missionGold' },
      active:     { color: '$secureGreen', background: '$greenGlow20', borderColor: '$secureGreen' },
      pending:    { color: '$missionGold', background: '$goldGlow20',  borderColor: '$missionGold' },
      intel:      { color: '$intelCyan',   background: '$cyanGlow10',  borderColor: '$intelCyan'   },
    },
    glow: {
      true: { filter: 'drop-shadow(0 0 4px currentColor)' },
    },
  },
  defaultVariants: { level: 'intel' },
});

const TacticalBadge = ({ children, level = 'intel', glow = false, ...props }) => (
  <BadgeRoot level={level} glow={glow} {...props}>{children}</BadgeRoot>
);

export default TacticalBadge;
