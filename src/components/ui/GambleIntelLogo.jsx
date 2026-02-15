import React from 'react';
import styled, { keyframes } from 'styled-components';

const neon_glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 10px #00D9FF) drop-shadow(0 0 20px #00D9FF);
  }
  50% {
    filter: drop-shadow(0 0 20px #00D9FF) drop-shadow(0 0 30px #0047AB);
  }
`;

const spin_slow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LogoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.variant === 'compact' ? '0' : '12px'};
  font-family: 'Rajdhani', sans-serif;
`;

const SVGLogo = styled.svg`
  width: ${props => {
    switch(props.size) {
      case 'small': return '40px';
      case 'large': return '120px';
      default: return '80px';
    }
  }};
  height: ${props => {
    switch(props.size) {
      case 'small': return '40px';
      case 'large': return '120px';
      default: return '80px';
    }
  }};
  animation: ${neon_glow} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px #00D9FF);
`;

const TextLogo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .brand-name {
    font-size: ${props => {
      switch(props.size) {
        case 'small': return '12px';
        case 'large': return '32px';
        default: return '18px';
      }
    }};
    font-weight: 700;
    letter-spacing: 2px;
    color: #00D9FF;
    text-shadow: 0 0 10px #00D9FF;
    text-transform: uppercase;
  }
  
  .tagline {
    font-size: ${props => {
      switch(props.size) {
        case 'small': return '8px';
        case 'large': return '14px';
        default: return '10px';
      }
    }};
    letter-spacing: 1px;
    color: #FFD700;
    text-transform: uppercase;
  }
`;

const GambleIntelLogo = ({ 
  variant = 'full',
  size = 'medium',
  showGlow = true
}) => {
  if (variant === 'compact') {
    return (
      <SVGLogo viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" size={size}>
        <circle cx="60" cy="60" r="58" fill="none" stroke="#00D9FF" strokeWidth="2" />
        <circle cx="60" cy="60" r="50" fill="rgba(0, 71, 171, 0.1)" />
        
        {/* Spade Symbol */}
        <path d="M 60 30 C 55 35 50 40 50 48 C 50 56 54 62 60 62 C 66 62 70 56 70 48 C 70 40 65 35 60 30 Z" 
          fill="#00D9FF" />
        <path d="M 55 62 L 52 70 L 68 70 L 65 62" fill="#00D9FF" />
        
        {/* GIA Text */}
        <text x="60" y="90" textAnchor="middle" fontSize="10" fill="#FFD700" fontWeight="bold" 
          fontFamily="Rajdhani, sans-serif" letterSpacing="2">
          GIA
        </text>
      </SVGLogo>
    );
  }

  if (variant === 'horizontal') {
    return (
      <LogoWrapper variant="horizontal">
        <SVGLogo viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" size={size}>
          <circle cx="60" cy="60" r="58" fill="none" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="60" cy="60" r="50" fill="rgba(0, 71, 171, 0.1)" />
          
          {/* Spade */}
          <path d="M 60 30 C 55 35 50 40 50 48 C 50 56 54 62 60 62 C 66 62 70 56 70 48 C 70 40 65 35 60 30 Z" 
            fill="#00D9FF" />
          <path d="M 55 62 L 52 70 L 68 70 L 65 62" fill="#00D9FF" />
        </SVGLogo>
        
        <TextLogo size={size}>
          <div className="brand-name">GAMBLE INTEL</div>
          <div className="tagline">Intelligence Agency</div>
        </TextLogo>
      </LogoWrapper>
    );
  }

  // Full variant (default)
  return (
    <LogoWrapper>
      <SVGLogo viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" size={size}>
        {/* Outer Circle Ring */}
        <circle cx="60" cy="60" r="58" fill="none" stroke="#00D9FF" strokeWidth="2" />
        
        {/* Grid Pattern */}
        <circle cx="60" cy="60" r="50" fill="rgba(0, 71, 171, 0.1)" />
        <circle cx="60" cy="60" r="40" fill="none" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="#00D9FF" strokeWidth="0.5" opacity="0.3" />
        
        {/* Main Spade Symbol */}
        <path d="M 60 25 C 54 32 48 38 48 48 C 48 58 52 65 60 65 C 68 65 72 58 72 48 C 72 38 66 32 60 25 Z" 
          fill="#00D9FF" opacity="0.95" />
        
        {/* Spade Bottom */}
        <path d="M 52 65 L 48 75 L 72 75 L 68 65" fill="#00D9FF" opacity="0.95" />
        
        {/* GIA Badge Circle */}
        <circle cx="60" cy="85" r="12" fill="none" stroke="#FFD700" strokeWidth="1.5" />
        
        {/* GIA Text */}
        <text x="60" y="90" textAnchor="middle" fontSize="8" fill="#FFD700" fontWeight="bold" 
          fontFamily="Rajdhani, sans-serif" letterSpacing="1">
          GIA
        </text>
        
        {/* Tactical Corner Brackets */}
        <line x1="10" y1="10" x2="10" y2="25" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="25" y2="10" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="110" y1="10" x2="110" y2="25" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="110" y1="10" x2="95" y2="10" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="10" y1="110" x2="10" y2="95" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="10" y1="110" x2="25" y2="110" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="110" y1="110" x2="110" y2="95" stroke="#FFD700" strokeWidth="1.5" />
        <line x1="110" y1="110" x2="95" y2="110" stroke="#FFD700" strokeWidth="1.5" />
      </SVGLogo>
      
      <TextLogo size={size}>
        <div className="brand-name">GAMBLE INTEL</div>
        <div className="tagline">Intelligence Advantage</div>
      </TextLogo>
    </LogoWrapper>
  );
};

export default GambleIntelLogo;
