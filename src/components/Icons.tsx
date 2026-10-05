import React from 'react';

export const IconDashboard: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M17.66 6.34l1.41-1.41" />
    <path d="M19.07 19.07A10 10 0 1 0 4.93 19.07" />
    <path d="M12 12l4-2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const IconPrinting: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </svg>
);

export const IconDyeing: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12h20" />
    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
    <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
    <path d="M12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);

export const IconAlarms: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const IconUtilities: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const IconBoilers: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18" />
    <path d="M5 21V8l7-5 7 5v13" />
    <path d="M9 14h6" />
    <path d="M9 18h6" />
    <path d="M12 9v2" />
  </svg>
);

export const IconHeatExchanger: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const IconGeneset: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.5 2v6h-6" />
    <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
  </svg>
);

export const IconCompressor: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export const IconHVAC: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20" />
    <path d="M17 5l-5 5-5-5" />
    <path d="M17 19l-5-5-5 5" />
    <path d="M2 12h20" />
    <path d="M5 7l5 5-5 5" />
    <path d="M19 7l-5 5 5 5" />
  </svg>
);

export const IconGrid: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="5" height="5" />
    <rect x="16" y="3" width="5" height="5" />
    <rect x="9.5" y="9.5" width="5" height="5" />
    <rect x="3" y="16" width="5" height="5" />
    <rect x="16" y="16" width="5" height="5" />
  </svg>
);

export const IconSolarPV: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="12" rx="1" />
    <path d="M3 10h18" />
    <path d="M9 4v12" />
    <path d="M15 4v12" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
  </svg>
);

export const IconChillers: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 8c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
    <path d="M2 14c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
  </svg>
);

export const IconWaterPump: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 6c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
    <path d="M2 12c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
    <path d="M2 18c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
  </svg>
);

export const IconETP: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 7c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
    <path d="M2 12c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
    <path d="M2 17c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
  </svg>
);

export const IconRO: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 8c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
    <path d="M2 14c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1 4-1" />
  </svg>
);

export const IconDevices: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 16V4m0 0L3 8m4-4l4 4" />
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

export const IconChevronRight: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const IconChevronDown: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const IconSubmenuCircle: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7.5" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export const IconSteam: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14c2.5-2 5.5-2 8 0s5.5 2 8 0" />
    <path d="M4 18c2.5-2 5.5-2 8 0s5.5 2 8 0" />
    <path d="M12 4c-1.8 2.4-1.8 5.1 0 7.5" />
    <path d="M8 5c-1.2 1.6-1.2 3.4 0 5" />
    <path d="M16 5c-1.2 1.6-1.2 3.4 0 5" />
  </svg>
);

export const IconMoisture: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3s6 6.4 6 11a6 6 0 1 1-12 0c0-4.6 6-11 6-11z" />
  </svg>
);

export const IconTemperature: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0z" />
    <path d="M12 17v-6" />
  </svg>
);

export const IconQuality: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const IconLive: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M7 11h2l2-3 2 6 2-3h2" />
  </svg>
);

export const IconStatus: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconPerformance: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </svg>
);

export const IconLog: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <circle cx="4" cy="6" r="1.2" fill="currentColor" />
    <circle cx="4" cy="12" r="1.2" fill="currentColor" />
    <circle cx="4" cy="18" r="1.2" fill="currentColor" />
  </svg>
);

export const IconStoppage: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

export const IconSubmenuImage: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const IconSubmenuCopy: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconHamburger: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const IconChatBubble: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconBell: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const IconGridLauncher: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </svg>
);

export const LibertyLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="silverGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="80%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      {/* Outer steel coin rim */}
      <circle cx="24" cy="24" r="22" fill="url(#silverGrad)" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Inner recessed circle */}
      <circle cx="24" cy="24" r="18" fill="#1e293b" opacity="0.85" stroke="#cbd5e1" strokeWidth="0.8" />
      {/* Globe longitude/latitude wireframe or textile weave */}
      <ellipse cx="24" cy="24" rx="16" ry="7" stroke="#e2e8f0" strokeWidth="1" fill="none" opacity="0.7" />
      <ellipse cx="24" cy="24" rx="7" ry="16" stroke="#e2e8f0" strokeWidth="1" fill="none" opacity="0.7" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
      <line x1="24" y1="8" x2="24" y2="40" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
      {/* Dynamic central star/gem */}
      <circle cx="24" cy="24" r="3.5" fill="#f8fafc" />
    </svg>
    <span style={{
      fontWeight: 500,
      fontSize: '15.5px',
      color: '#e6ebf1',
      letterSpacing: '0.2px',
      whiteSpace: 'nowrap',
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      Lucky Textile
    </span>
  </div>
);
