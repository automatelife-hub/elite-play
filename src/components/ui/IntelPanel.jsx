import React from 'react';
import { styled } from '@/stitches.config';

// ─── Styled primitives ────────────────────────────────────────────────────────

const PanelContainer = styled('div', {
  background: '$darkPanel',
  border: '1px solid $intelCyan',
  borderRadius: '$none',
  position: 'relative',
  padding: '20px',
  backdropFilter: 'blur(10px)',
  boxShadow: '$panel',

  '&::before': {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20px',
    height: '20px',
    border: '2px solid $intelCyan',
    borderRight: 'none',
    borderBottom: 'none',
  },
  '&::after': {
    content: "''",
    position: 'absolute',
    top: 0,
    right: 0,
    width: '20px',
    height: '20px',
    border: '2px solid $intelCyan',
    borderLeft: 'none',
    borderBottom: 'none',
  },

  variants: {
    glowColor: {
      cyan:  { boxShadow: '0 0 10px rgba(0,217,255,0.3)' },
      green: { boxShadow: '0 0 10px rgba(0,255,65,0.3)' },
      gold:  { boxShadow: '0 0 10px rgba(255,215,0,0.3)' },
      red:   { boxShadow: '0 0 10px rgba(255,0,51,0.3)' },
    },
  },
});

const IntelHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '15px',
  borderBottom: '1px solid $cyanGlow30',
  marginBottom: '15px',
  position: 'relative',
  zIndex: 1,
});

const ClassificationLevel = styled('span', {
  fontFamily: '$mono',
  fontSize: '$xs',
  letterSpacing: '$normal',
  color: '$alertRed',
  textTransform: 'uppercase',
  fontWeight: '$bold',
  display: 'block',
});

const IntelTitle = styled('h3', {
  fontFamily: '$tactical',
  fontSize: '$md',
  fontWeight: '$bold',
  letterSpacing: '$wide',
  color: '$intelCyan',
  textTransform: 'uppercase',
  margin: 0,
  textShadow: '0 0 10px rgba(0,217,255,0.5)',
});

const PanelContent = styled('div', {
  position: 'relative',
  zIndex: 1,
  color: '$intelCyan',
  fontFamily: '$mono',
  fontSize: '$sm',
  lineHeight: 1.6,
  letterSpacing: '$tight',
});

const StatRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid $cyanGlow10',
  '&:last-child': { borderBottom: 'none' },
});

const StatLabel = styled('span', {
  color: '$cyanGlow70',
  fontWeight: '$medium',
});

const StatValue = styled('span', {
  color: '$intelCyan',
  fontWeight: '$bold',
  textShadow: '0 0 5px $intelCyan',
});

const StatusBadge = styled('div', {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '$sm',
  fontSize: '$xs',
  fontWeight: '$bold',
  letterSpacing: '$normal',
  textTransform: 'uppercase',
  border: '1px solid currentColor',
  fontFamily: '$mono',

  variants: {
    status: {
      success: { background: '$greenGlow20', color: '$secureGreen' },
      alert:   { background: '$redGlow20',   color: '$alertRed'    },
      pending: { background: '$goldGlow20',  color: '$missionGold' },
      active:  { background: '$cyanGlow10',  color: '$intelCyan'   },
    },
  },
  defaultVariants: { status: 'active' },
});

const BottomCorners = styled('div', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,

  '&::before': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '20px',
    height: '20px',
    border: '2px solid $intelCyan',
    borderRight: 'none',
    borderTop: 'none',
  },
  '&::after': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '20px',
    height: '20px',
    border: '2px solid $intelCyan',
    borderLeft: 'none',
    borderTop: 'none',
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

const IntelPanel = ({
  title = 'INTEL REPORT',
  classification = 'TOP SECRET',
  status = 'active',
  glowColor = 'cyan',
  children,
  stats = [],
}) => {
  return (
    <PanelContainer glowColor={glowColor}>
      <IntelHeader>
        <div>
          <ClassificationLevel>{classification}</ClassificationLevel>
          <IntelTitle>{title}</IntelTitle>
        </div>
        <StatusBadge status={status}>{status}</StatusBadge>
      </IntelHeader>

      <PanelContent>
        {stats.length > 0 && (
          <div>
            {stats.map((stat, idx) => (
              <StatRow key={idx}>
                <StatLabel>{stat.label}</StatLabel>
                <StatValue>{stat.value}</StatValue>
              </StatRow>
            ))}
          </div>
        )}
        {children}
      </PanelContent>

      <BottomCorners />
    </PanelContainer>
  );
};

export default IntelPanel;
