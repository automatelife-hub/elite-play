import React from 'react';

export default function GIALogo({ size = 'md', className = '', animated = false }) {
  const sizes = { xs: 28, sm: 40, md: 72, lg: 112, xl: 152 };
  const d = sizes[size] || sizes.md;

  return (
    <svg width={d} height={d} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"
      className={`gi-logo ${animated ? 'animate-float' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="gi-icon-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="gi-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(37,99,235,0.5)" />
          <stop offset="100%" stopColor="rgba(37,99,235,0.15)" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#0D1424" stroke="rgba(37,99,235,0.3)" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(37,99,235,0.1)" strokeWidth="0.8" />

      {/* Spade upper bulb */}
      <path d="M40 16 C36 20 28 26 28 34 C28 41 33 45 40 45 C47 45 52 41 52 34 C52 26 44 20 40 16Z"
        fill="url(#gi-icon-grad)" />

      {/* Spade left/right lobes */}
      <path d="M40 38 C32 35 24 32 24 38 C24 43 30 46 40 45Z" fill="url(#gi-icon-grad)" opacity="0.9" />
      <path d="M40 38 C48 35 56 32 56 38 C56 43 50 46 40 45Z" fill="url(#gi-icon-grad)" opacity="0.9" />

      {/* Spade stem */}
      <path d="M37 45 C37 49 34 52 32 54 L48 54 C46 52 43 49 43 45Z" fill="url(#gi-icon-grad)" />

      {/* Signal arcs — intelligence motif */}
      <path d="M30 22 C28 26 27 30 28 34" fill="none" stroke="#93C5FD" strokeWidth="1.2"
        strokeLinecap="round" opacity="0.45" />
      <path d="M26 18 C22 25 21 30 22 37" fill="none" stroke="#93C5FD" strokeWidth="0.9"
        strokeLinecap="round" opacity="0.2" />

      {/* GIA text mark */}
      <text x="40" y="70" fontFamily="'Syne', sans-serif" fontSize="7" fontWeight="700"
        fill="rgba(148,163,184,0.6)" textAnchor="middle" letterSpacing="3">GIA</text>
    </svg>
  );
}

export function GIALogoMark({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <GIAIcon size={32} />
      <div className="flex flex-col leading-none">
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F1F5F9', letterSpacing: '0.04em', lineHeight: 1.2 }}>
          GAMBLE<span style={{ color: '#60A5FA' }}>INTEL</span>
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '9px', color: 'rgba(148,163,184,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 }}>
          Intelligence Agency
        </span>
      </div>
    </div>
  );
}

export function GIALogoCompact({ size = 'sm', className = '' }) {
  const sizes = { xs: 24, sm: 32, md: 40, lg: 52 };
  return <GIAIcon size={sizes[size] || sizes.sm} className={className} />;
}

export function GIAIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
      className={`gi-icon ${className}`}>
      <defs>
        <linearGradient id="gi-icon-sm-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="#0D1424" stroke="rgba(37,99,235,0.3)" strokeWidth="1" />
      <path d="M16 6 C13.5 9 8 13 8 17.5 C8 21 10.5 23 16 22.5 C21.5 23 24 21 24 17.5 C24 13 18.5 9 16 6Z"
        fill="url(#gi-icon-sm-grad)" />
      <path d="M14 22.5 C14 24.5 12.5 26 11.5 27 L20.5 27 C19.5 26 18 24.5 18 22.5Z"
        fill="url(#gi-icon-sm-grad)" />
      <path d="M10 10 C9 12 8.5 14 9 16.5" fill="none" stroke="#93C5FD"
        strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
