import React from 'react';
import { Shield, Activity, Clock, AlertTriangle } from 'lucide-react';

export default function MissionStatusBar({ 
  agentId, 
  agentName, 
  rank = 'OPERATIVE',
  status = 'ACTIVE',
  missionTime = '00:00:00',
  securityLevel = 'SECURE',
  alerts = 0,
  className = ''
}) {
  const statusColors = {
    ACTIVE: 'text-mission-secure-green',
    STANDBY: 'text-mission-gold',
    OFFLINE: 'text-intel-cyan/60'
  };

  const securityColors = {
    SECURE: { bg: 'bg-mission-secure-green/20', text: 'text-mission-secure-green', icon: Shield },
    COMPROMISED: { bg: 'bg-mission-alert-red/20', text: 'text-mission-alert-red', icon: AlertTriangle },
    ANALYZING: { bg: 'bg-mission-gold/20', text: 'text-mission-gold', icon: Activity }
  };

  const security = securityColors[securityLevel] || securityColors.SECURE;
  const SecurityIcon = security.icon;

  return (
    <div className={`mission-status-bar bg-intel-dark border-b-2 border-intel-cyan/50 px-6 py-3 ${className}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Agent Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-intel-blue to-intel-cyan rounded-full flex items-center justify-center border-2 border-intel-cyan shadow-neon-blue">
              <span className="text-white font-tech font-bold text-sm">
                {agentName?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <div className="text-xs text-intel-cyan/60 font-tactical uppercase">
                AGENT ID
              </div>
              <div className="text-sm font-tech font-bold text-intel-cyan">
                {agentId || 'UNASSIGNED'}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-intel-cyan/30" />

          <div>
            <div className="text-xs text-intel-cyan/60 font-tactical uppercase">
              CALLSIGN
            </div>
            <div className="text-sm font-tech font-bold text-white">
              {agentName || 'Anonymous'}
            </div>
          </div>

          <div className="h-8 w-px bg-intel-cyan/30" />

          <div>
            <div className="text-xs text-intel-cyan/60 font-tactical uppercase">
              RANK
            </div>
            <div className="text-sm font-tactical font-bold text-mission-gold">
              {rank}
            </div>
          </div>
        </div>

        {/* Mission Stats */}
        <div className="flex items-center gap-6">
          {/* Mission Timer */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-intel-cyan" />
            <div>
              <div className="text-xs text-intel-cyan/60 font-tactical uppercase">
                MISSION TIME
              </div>
              <div className="text-sm font-mono-tech font-bold text-white">
                {missionTime}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-intel-cyan/30" />

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`} />
            <div>
              <div className="text-xs text-intel-cyan/60 font-tactical uppercase">
                STATUS
              </div>
              <div className={`text-sm font-tactical font-bold ${statusColors[status]}`}>
                {status}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-intel-cyan/30" />

          {/* Security */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded ${security.bg}`}>
            <SecurityIcon className={`w-4 h-4 ${security.text}`} />
            <div className={`text-sm font-tactical font-bold ${security.text} uppercase`}>
              {securityLevel}
            </div>
          </div>

          {/* Alerts */}
          {alerts > 0 && (
            <>
              <div className="h-8 w-px bg-intel-cyan/30" />
              <div className="relative flex items-center gap-2 px-3 py-2 rounded bg-mission-alert-red/20 border border-mission-alert-red/50 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-mission-alert-red" />
                <span className="text-sm font-tech font-bold text-mission-alert-red">
                  {alerts} ALERT{alerts !== 1 ? 'S' : ''}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function MissionStatusBarMobile({ 
  agentName, 
  status = 'ACTIVE',
  securityLevel = 'SECURE',
  alerts = 0,
  className = ''
}) {
  const statusColors = {
    ACTIVE: 'text-mission-secure-green',
    STANDBY: 'text-mission-gold',
    OFFLINE: 'text-intel-cyan/60'
  };

  const securityColors = {
    SECURE: { text: 'text-mission-secure-green', icon: Shield },
    COMPROMISED: { text: 'text-mission-alert-red', icon: AlertTriangle },
    ANALYZING: { text: 'text-mission-gold', icon: Activity }
  };

  const security = securityColors[securityLevel] || securityColors.SECURE;
  const SecurityIcon = security.icon;

  return (
    <div className={`mission-status-bar-mobile bg-intel-dark border-b-2 border-intel-cyan/50 px-4 py-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-intel-blue to-intel-cyan rounded-full flex items-center justify-center border border-intel-cyan">
            <span className="text-white font-tech font-bold text-xs">
              {agentName?.charAt(0) || 'A'}
            </span>
          </div>
          <div>
            <div className="text-xs font-tech text-intel-cyan">
              {agentName || 'Agent'}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} animate-pulse`} />
              <span className={`text-xs font-tactical ${statusColors[status]}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SecurityIcon className={`w-4 h-4 ${security.text}`} />
          {alerts > 0 && (
            <div className="relative">
              <AlertTriangle className="w-4 h-4 text-mission-alert-red animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-mission-alert-red text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {alerts}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
