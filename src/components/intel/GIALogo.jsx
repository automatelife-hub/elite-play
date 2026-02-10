import React from 'react';

export default function GIALogo({ size = 'md', className = '', animated = false }) {
  const sizes = {
    xs: 32,
    sm: 48,
    md: 80,
    lg: 120,
    xl: 160
  };

  const dimension = sizes[size] || sizes.md;

  return (
    <svg 
      width={dimension} 
      height={dimension} 
      viewBox="0 0 120 120" 
      xmlns="http://www.w3.org/2000/svg"
      className={`gia-logo ${animated ? 'animate-neon-pulse' : ''} ${className}`}
    >
      <defs>
        {/* Tactical grid pattern */}
        <pattern id="grid-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path 
            d="M 10 0 L 0 0 0 10" 
            fill="none" 
            stroke="rgba(0,217,255,0.1)" 
            strokeWidth="0.5"
          />
        </pattern>
        
        {/* Neon glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Gradient for spade */}
        <linearGradient id="spade-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0047AB" />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle 
        cx="60" 
        cy="60" 
        r="58" 
        fill="none" 
        stroke="#00D9FF" 
        strokeWidth="2"
        filter="url(#glow)"
      />
      
      {/* Inner circle with grid background */}
      <circle cx="60" cy="60" r="54" fill="url(#grid-pattern)" opacity="0.3"/>
      
      {/* Center spade symbol */}
      <g filter="url(#glow)">
        <path 
          d="M60,30 C55,35 45,45 45,55 C45,65 52,70 60,70 C68,70 75,65 75,55 C75,45 65,35 60,30 Z" 
          fill="url(#spade-gradient)"
        />
        <path 
          d="M60,70 L55,78 L65,78 Z" 
          fill="url(#spade-gradient)"
        />
      </g>
      
      {/* GIA text */}
      <text 
        x="60" 
        y="58" 
        fontFamily="Rajdhani, sans-serif" 
        fontSize="18" 
        fontWeight="bold" 
        fill="#fff" 
        textAnchor="middle"
        letterSpacing="3"
        filter="url(#glow)"
      >
        GIA
      </text>
      
      {/* Ring text - top */}
      <path 
        id="curve-top" 
        d="M15,60 A45,45 0 0,1 105,60" 
        fill="transparent"
      />
      <text fontFamily="Rajdhani, sans-serif" fontSize="9" fill="#00D9FF" letterSpacing="2">
        <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
          GAMBLE INTELLIGENCE
        </textPath>
      </text>

      {/* Ring text - bottom */}
      <path 
        id="curve-bottom" 
        d="M15,60 A45,45 0 0,0 105,60" 
        fill="transparent"
      />
      <text fontFamily="Rajdhani, sans-serif" fontSize="9" fill="#00D9FF" letterSpacing="2">
        <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
          AGENCY
        </textPath>
      </text>
      
      {/* Corner brackets */}
      <g stroke="#FFD700" strokeWidth="2" fill="none">
        <path d="M10,10 L10,20 M10,10 L20,10"/>
        <path d="M110,10 L110,20 M110,10 L100,10"/>
        <path d="M10,110 L10,100 M10,110 L20,110"/>
        <path d="M110,110 L110,100 M110,110 L100,110"/>
      </g>

      {/* Animated scan line */}
      {animated && (
        <line 
          x1="0" 
          y1="60" 
          x2="120" 
          y2="60" 
          stroke="#00D9FF" 
          strokeWidth="1" 
          opacity="0.5"
          className="animate-grid-scan"
        />
      )}
    </svg>
  );
}

// Compact logo variant
export function GIALogoCompact({ size = 'sm', className = '' }) {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64
  };

  const dimension = sizes[size] || sizes.sm;

  return (
    <svg 
      width={dimension} 
      height={dimension} 
      viewBox="0 0 48 48" 
      xmlns="http://www.w3.org/2000/svg"
      className={`gia-logo-compact ${className}`}
    >
      <defs>
        <filter id="glow-compact">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Hexagon border */}
      <path 
        d="M24,2 L42,13 L42,35 L24,46 L6,35 L6,13 Z" 
        fill="none" 
        stroke="#00D9FF" 
        strokeWidth="2"
        filter="url(#glow-compact)"
      />

      {/* Spade */}
      <g filter="url(#glow-compact)">
        <path 
          d="M24,12 C21,15 16,20 16,24 C16,28 19,31 24,31 C29,31 32,28 32,24 C32,20 27,15 24,12 Z" 
          fill="#00D9FF"
        />
        <path 
          d="M24,31 L21,36 L27,36 Z" 
          fill="#00D9FF"
        />
      </g>

      {/* GIA text */}
      <text 
        x="24" 
        y="28" 
        fontFamily="Rajdhani, sans-serif" 
        fontSize="8" 
        fontWeight="bold" 
        fill="#0A0E27" 
        textAnchor="middle"
        letterSpacing="1"
      >
        GIA
      </text>
    </svg>
  );
}

// Icon-only spade variant
export function GIAIcon({ size = 24, className = '', color = '#00D9FF' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      className={`gia-icon ${className}`}
    >
      <defs>
        <filter id="glow-icon">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#glow-icon)">
        <path 
          d="M12,2 C10,4 6,8 6,12 C6,16 9,18 12,18 C15,18 18,16 18,12 C18,8 14,4 12,2 Z" 
          fill={color}
        />
        <path 
          d="M12,18 L10,22 L14,22 Z" 
          fill={color}
        />
      </g>
    </svg>
  );
}
