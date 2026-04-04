import React, { useState, useEffect } from 'react';
import { styled, floatAnim, glowPulse, hologramFlicker, dataScan } from '@/stitches.config';

// ─── Styled primitives ────────────────────────────────────────────────────────

const MascotContainer = styled('div', {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${floatAnim} 3s ease-in-out infinite`,

  variants: {
    size: {
      large:  { width: '200px', height: '200px' },
      medium: { width: '120px', height: '120px' },
      small:  { width: '80px',  height: '80px'  },
    },
  },
  defaultVariants: { size: 'medium' },
});

const HolographicBody = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  animation: `${hologramFlicker} 4s ease-in-out infinite`,

  '&::after': {
    content: "''",
    position: 'absolute',
    top: '-100%',
    left: 0,
    right: 0,
    height: '2px',
    background: 'rgba(0, 217, 255, 0.5)',
    animation: `${dataScan} 2s linear infinite`,
  },
});

const SVGMascot = styled('svg', {
  width: '100%',
  height: '100%',
  filter: 'drop-shadow(0 0 10px #00D9FF) drop-shadow(0 0 20px #00D9FF)',
  animation: `${glowPulse} 3s ease-in-out infinite`,
});

const StatusDot = styled('div', {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  animation: `${glowPulse} 2s ease-in-out infinite`,

  variants: {
    status: {
      success: { background: '#00FF41', boxShadow: '0 0 10px #00FF41' },
      alert:   { background: '#FF0033', boxShadow: '0 0 10px #FF0033' },
      active:  { background: '#00D9FF', boxShadow: '0 0 10px #00D9FF' },
    },
  },
  defaultVariants: { status: 'active' },
});

const MessageBubble = styled('div', {
  position: 'absolute',
  top: '-50px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(10, 14, 39, 0.95)',
  border: '1px solid #00D9FF',
  borderRadius: '$sm',
  padding: '8px 12px',
  fontFamily: '$mono',
  fontSize: '$xs',
  color: '$intelCyan',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.3s ease',
  letterSpacing: '$tight',
  textTransform: 'uppercase',
  boxShadow: '0 0 10px #00D9FF',
  zIndex: 10,

  variants: {
    visible: {
      true:  { opacity: 1 },
      false: { opacity: 0 },
    },
  },
  defaultVariants: { visible: false },
});

// ─── Component ────────────────────────────────────────────────────────────────

const GIAMascot = ({
  state = 'idle',
  size = 'medium',
  status = 'active',
  showMessage = false,
  message = 'READY FOR BRIEFING',
}) => {
  const [animState, setAnimState] = useState(state);
  const [displayMessage, setDisplayMessage] = useState(showMessage);

  useEffect(() => { setAnimState(state); }, [state]);
  useEffect(() => { setDisplayMessage(showMessage); }, [showMessage]);

  return (
    <MascotContainer size={size}>
      <MessageBubble visible={displayMessage}>{message}</MessageBubble>

      <HolographicBody>
        <SVGMascot viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   style={{ stopColor: '#00F0FF', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0047AB', stopOpacity: 0.6 }} />
            </radialGradient>
          </defs>

          {/* Head sphere */}
          <circle cx="60" cy="40" r="28" fill="url(#headGlow)" opacity="0.9" />

          {/* GIA Visor / eyes */}
          <rect x="42" y="32" width="36" height="12" fill="none" stroke="#00D9FF" strokeWidth="2" opacity="0.8" />
          <circle cx="52" cy="38" r="3" fill="#00FF41" />
          <circle cx="68" cy="38" r="3" fill="#00FF41" />

          {/* Tactical headset */}
          <path d="M 40 35 Q 35 25 40 20" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="40" cy="18" r="4" fill="#FFD700" opacity="0.8" />
          <path d="M 80 35 Q 85 25 80 20" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="80" cy="18" r="4" fill="#FFD700" opacity="0.8" />

          {/* Torso */}
          <path d="M 50 65 L 45 90 L 75 90 L 70 65" fill="rgba(0,217,255,0.3)" stroke="#00D9FF" strokeWidth="1.5" />

          {/* Arms */}
          <line x1="50" y1="70" x2="30" y2="80" stroke="#00D9FF" strokeWidth="2" />
          <line x1="70" y1="70" x2="90" y2="80" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="30" cy="82" r="3" fill="#00D9FF" />
          <circle cx="90" cy="82" r="3" fill="#00D9FF" />

          {/* Badge */}
          <circle cx="60" cy="82" r="8" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          <text x="60" y="85" textAnchor="middle" fontSize="6" fill="#FFD700" fontWeight="bold">♠</text>

          {/* Data particles */}
          <circle cx="45" cy="25" r="2" fill="#00F0FF" opacity="0.7" />
          <circle cx="75" cy="25" r="2" fill="#00F0FF" opacity="0.7" />
          <circle cx="60" cy="15" r="2" fill="#00F0FF" opacity="0.7" />
        </SVGMascot>
      </HolographicBody>

      <StatusDot status={status} />
    </MascotContainer>
  );
};

export default GIAMascot;
