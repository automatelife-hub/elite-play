import React from 'react';
import { TacticalCardBackground } from './TacticalBackground';

export default function IntelPanel({ 
  children, 
  className = '',
  header = null,
  classification = null,
  code = null,
  showCorners = true,
  variant = 'default' // default, alert, success, warning
}) {
  const variantStyles = {
    default: 'border-intel-cyan',
    alert: 'border-mission-alert-red',
    success: 'border-mission-secure-green',
    warning: 'border-mission-gold'
  };

  const variantGlow = {
    default: 'shadow-neon-blue',
    alert: 'shadow-[0_0_20px_rgba(255,0,51,0.5)]',
    success: 'shadow-neon-green',
    warning: 'shadow-neon-gold'
  };

  return (
    <div className={`intel-panel relative ${variantStyles[variant]} ${variantGlow[variant]} ${className}`}>
      <TacticalCardBackground />
      
      {/* Tactical Corners */}
      {showCorners && (
        <div className="corner-brackets pointer-events-none">
          {/* Top left */}
          <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-current" />
          {/* Top right */}
          <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-current" />
          {/* Bottom left */}
          <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-current" />
          {/* Bottom right */}
          <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-current" />
        </div>
      )}

      {/* Header */}
      {header && (
        <div className="intel-panel-header flex items-center justify-between mb-4 pb-3 border-b border-intel-cyan/30">
          <div className="flex items-center gap-3">
            {header}
          </div>
          <div className="flex items-center gap-2">
            {classification && (
              <span className="text-xs font-tactical uppercase px-2 py-1 bg-mission-alert-red/20 text-mission-alert-red border border-mission-alert-red/50">
                {classification}
              </span>
            )}
            {code && (
              <span className="text-xs font-mono-tech text-intel-cyan/60">
                {code}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="intel-panel-content relative z-10">
        {children}
      </div>
    </div>
  );
}

// Stat display component for intel panels
export function IntelStat({ label, value, trend, icon: Icon, unit = '' }) {
  const trendColor = trend && trend.startsWith('+') ? 'text-mission-secure-green' : 
                     trend && trend.startsWith('-') ? 'text-mission-alert-red' : 
                     'text-intel-cyan';

  return (
    <div className="intel-stat flex items-center justify-between p-3 bg-intel-navy/50 rounded border border-intel-cyan/20">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-intel-blue/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-intel-cyan" />
          </div>
        )}
        <div>
          <div className="text-xs text-intel-cyan/60 font-tactical uppercase tracking-wider">
            {label}
          </div>
          <div className="text-2xl font-tech font-bold text-white flex items-baseline gap-1">
            {value}
            {unit && <span className="text-sm text-intel-cyan/60">{unit}</span>}
          </div>
        </div>
      </div>
      {trend && (
        <div className={`text-sm font-bold ${trendColor}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

// Data row component
export function IntelDataRow({ label, value, icon: Icon, highlight = false }) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 ${
      highlight ? 'bg-intel-cyan/10 border-l-2 border-intel-cyan' : 'border-b border-intel-cyan/10'
    }`}>
      <div className="flex items-center gap-2 text-sm text-intel-cyan/80">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="font-tactical uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-mono-tech text-white font-bold">
        {value}
      </div>
    </div>
  );
}

// List item component for intel panels
export function IntelListItem({ 
  title, 
  subtitle, 
  status, 
  icon: Icon, 
  actions = null,
  onClick = null 
}) {
  const statusColors = {
    active: 'text-mission-secure-green',
    pending: 'text-mission-gold',
    completed: 'text-intel-cyan',
    failed: 'text-mission-alert-red',
    analyzing: 'text-mission-gold animate-pulse'
  };

  return (
    <div 
      className={`intel-list-item flex items-center gap-3 p-3 border border-intel-cyan/20 mb-2 transition-all ${
        onClick ? 'cursor-pointer hover:bg-intel-cyan/5 hover:border-intel-cyan/40' : ''
      }`}
      onClick={onClick}
    >
      {Icon && (
        <div className="w-10 h-10 rounded bg-intel-blue/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-intel-cyan" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-tactical text-white truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-intel-cyan/60 truncate">
            {subtitle}
          </div>
        )}
      </div>

      {status && (
        <div className={`text-xs font-tactical uppercase ${statusColors[status] || 'text-intel-cyan'}`}>
          {status}
        </div>
      )}

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
