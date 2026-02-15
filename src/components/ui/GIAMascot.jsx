import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const float_anim = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow_pulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px #00D9FF, 0 0 40px #0047AB;
    opacity: 1;
  }
  50% { 
    box-shadow: 0 0 10px #00D9FF, 0 0 20px #0047AB;
    opacity: 0.8;
  }
`;

const hologram_flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
`;

const data_scan = keyframes`
  0% { top: -100%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const MascotContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'large' ? '200px' : props.size === 'small' ? '80px' : '120px'};
  height: ${props => props.size === 'large' ? '200px' : props.size === 'small' ? '80px' : '120px'};
  animation: ${float_anim} 3s ease-in-out infinite;
`;

const HolographicBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  animation: ${hologram_flicker} 0.1s infinite;
  
  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(0, 217, 255, 0.5);
    animation: ${data_scan} 2s linear infinite;
  }
`;

const SVGMascot = styled.svg`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px #00D9FF) drop-shadow(0 0 20px #00D9FF);
  animation: ${glow_pulse} 3s ease-in-out infinite;
`;

const StatusBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: ${props => props.status === 'success' ? '#00FF41' : props.status === 'alert' ? '#FF0033' : '#00D9FF'};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.status === 'success' ? '#00FF41' : props.status === 'alert' ? '#FF0033' : '#00D9FF'};
  animation: ${glow_pulse} 2s ease-in-out infinite;
`;

const MessageBubble = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 14, 39, 0.95);
  border: 1px solid #00D9FF;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: #00D9FF;
  white-space: nowrap;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 0 10px #00D9FF;
  z-index: 10;
`;

const GIAMascot = ({ 
  state = 'idle', 
  size = 'medium',
  status = 'active',
  showMessage = false,
  message = 'READY FOR BRIEFING'
}) => {
  const [animState, setAnimState] = useState(state);
  const [displayMessage, setDisplayMessage] = useState(showMessage);

  useEffect(() => {
    setAnimState(state);
  }, [state]);

  useEffect(() => {
    setDisplayMessage(showMessage);
  }, [showMessage]);

  return (
    <MascotContainer size={size}>
      <MessageBubble visible={displayMessage}>
        {message}
      </MessageBubble>
      
      <HolographicBody>
        <SVGMascot viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          {/* Head - Holographic Sphere */}
          <defs>
            <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: '#00F0FF', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0047AB', stopOpacity: 0.6 }} />
            </radialGradient>
          </defs>
          
          {/* Main head sphere */}
          <circle cx="60" cy="40" r="28" fill="url(#headGlow)" opacity="0.9" />
          
          {/* GIA Visor/Eyes */}
          <rect x="42" y="32" width="36" height="12" fill="none" stroke="#00D9FF" strokeWidth="2" opacity="0.8" />
          <circle cx="52" cy="38" r="3" fill="#00FF41" />
          <circle cx="68" cy="38" r="3" fill="#00FF41" />
          
          {/* Tactical Headset */}
          <path d="M 40 35 Q 35 25 40 20" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="40" cy="18" r="4" fill="#FFD700" opacity="0.8" />
          <path d="M 80 35 Q 85 25 80 20" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="80" cy="18" r="4" fill="#FFD700" opacity="0.8" />
          
          {/* Body - Torso */}
          <path d="M 50 65 L 45 90 L 75 90 L 70 65" fill="rgba(0, 217, 255, 0.3)" stroke="#00D9FF" strokeWidth="1.5" />
          
          {/* Arms */}
          <line x1="50" y1="70" x2="30" y2="80" stroke="#00D9FF" strokeWidth="2" />
          <line x1="70" y1="70" x2="90" y2="80" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="30" cy="82" r="3" fill="#00D9FF" />
          <circle cx="90" cy="82" r="3" fill="#00D9FF" />
          
          {/* Badge/Insignia */}
          <circle cx="60" cy="82" r="8" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          <text x="60" y="85" textAnchor="middle" fontSize="6" fill="#FFD700" fontWeight="bold">♠</text>
          
          {/* Data streams around head */}
          <circle cx="45" cy="25" r="2" fill="#00F0FF" opacity="0.7" />
          <circle cx="75" cy="25" r="2" fill="#00F0FF" opacity="0.7" />
          <circle cx="60" cy="15" r="2" fill="#00F0FF" opacity="0.7" />
        </SVGMascot>
      </HolographicBody>
      
      <StatusBadge status={status} />
    </MascotContainer>
  );
};

export default GIAMascot;
