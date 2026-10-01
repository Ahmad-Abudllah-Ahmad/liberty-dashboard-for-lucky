import React, { useMemo, useState } from 'react';
import {
  IconHamburger,
  IconChatBubble,
  IconBell,
  IconGridLauncher,
} from './Icons';
import type { AlarmRecord } from '../types';

interface HeaderProps {
  breadcrumb: string;
  onToggleSidebar: () => void;
  alarms: AlarmRecord[];
  onOpenAlarms: () => void;
  onNavigate: (id: string, breadcrumb: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumb,
  onToggleSidebar,
  alarms,
  onOpenAlarms,
  onNavigate,
}) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [showAlarmQuickView, setShowAlarmQuickView] = useState(false);

  const unacknowledgedAlarms = alarms.filter((a) => !a.acknowledged);

  const quickAlarms = useMemo(() => {
    const unack = alarms.filter((a) => !a.acknowledged);
    const ack = alarms.filter((a) => a.acknowledged);
    return [...unack, ...ack].slice(0, 5);
  }, [alarms]);

  const unackSeverityCounts = useMemo(
    () => ({
      critical: unacknowledgedAlarms.filter((a) => a.severity === 'critical').length,
      major: unacknowledgedAlarms.filter((a) => a.severity === 'major').length,
      minor: unacknowledgedAlarms.filter((a) => a.severity === 'minor').length,
      info: unacknowledgedAlarms.filter((a) => a.severity === 'info').length,
    }),
    [unacknowledgedAlarms],
  );

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <button
            className="btn-hamburger"
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
            aria-label="Toggle Navigation Menu"
          >
            <IconHamburger size={20} />
          </button>
          <div className="header-breadcrumb" onClick={() => onNavigate('home', 'Home')}>
            <span>{breadcrumb || 'Home'}</span>
          </div>
        </div>

        <div className="header-right">
          {/* Chat Icon with yellow badge (0) */}
          <div className="header-action-item" onClick={() => setShowChatModal(!showChatModal)}>
            <button className="btn-header-icon" title="Plant Communication Intercom (0 unread)">
              <IconChatBubble size={20} className="icon-chat" />
              <span className="badge-chat-yellow">0</span>
            </button>
          </div>

          {/* Bell Icon with unacknowledged alarm count */}
          <div className="header-action-item" onClick={() => setShowAlarmQuickView(!showAlarmQuickView)}>
            <button
              className="btn-header-icon"
              title={`Active Plant Alarms (${unacknowledgedAlarms.length} unacknowledged)`}
            >
              <IconBell size={20} className="icon-bell" />
              <span className="badge-bell-red">{unacknowledgedAlarms.length}</span>
            </button>
          </div>

          {/* Grid / Module Launcher */}
          <div className="header-action-item" onClick={() => setShowAppLauncher(!showAppLauncher)}>
            <button className="btn-header-icon" title="Liberty Plant Modules Launcher">
              <IconGridLauncher size={17} className="icon-grid" />
            </button>
          </div>
        </div>
      </header>

      {/* Alarm Quick Dropdown */}
      {showAlarmQuickView && (
        <div className="quick-dropdown alarm-dropdown">
          <div className="dropdown-header alarm-dropdown-head">
            <div className="alarm-dropdown-head-text">
              <h4>Active SCADA Alarms</h4>
              <p className="alarm-dropdown-sub">
                {unacknowledgedAlarms.length} unacknowledged · {alarms.length} total
              </p>
            </div>
            <button
              type="button"
              className="btn-close-dropdown"
              onClick={() => setShowAlarmQuickView(false)}
              aria-label="Close alarms panel"
            >
              ✕
            </button>
          </div>
          <div className="alarm-severity-strip" aria-label="Unacknowledged by severity">
            <span className="alarm-sev-pill critical">{unackSeverityCounts.critical} Critical</span>
            <span className="alarm-sev-pill major">{unackSeverityCounts.major} Major</span>
            <span className="alarm-sev-pill minor">{unackSeverityCounts.minor} Minor</span>
            <span className="alarm-sev-pill info">{unackSeverityCounts.info} Info</span>
          </div>
          <div className="dropdown-list alarm-dropdown-list">
            {quickAlarms.map((alm) => (
              <div
                key={alm.id}
                className={`dropdown-alarm-item ${alm.severity} ${alm.acknowledged ? 'is-ack' : 'is-unack'}`}
                tabIndex={0}
              >
                <span className={`alarm-sev-badge ${alm.severity}`}>{alm.severity}</span>
                <div className="alm-details">
                  <div className="alm-top-row">
                    <span className="alm-tag-line">
                      <span className="alm-tag">
                        {alm.tag} · {alm.area}
                      </span>
                      {!alm.acknowledged ? <span className="alm-unack-badge">Unack</span> : null}
                    </span>
                    <span className="alm-time">{alm.timestamp.replace('Today ', '')}</span>
                  </div>
                  <p className="alm-desc">{alm.description}</p>
                  <div className="alm-metrics">
                    <span className="alm-val">
                      PV <strong className="font-mono">{alm.value}</strong>
                    </span>
                    <span className="alm-val-sp">
                      SP <span className="font-mono">{alm.setpoint}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="dropdown-footer alarm-dropdown-footer">
            <button
              type="button"
              className="btn-view-all-alarms"
              onClick={() => {
                setShowAlarmQuickView(false);
                onOpenAlarms();
              }}
            >
              Open Full Alarm Console ({alarms.length} Alarms) →
            </button>
          </div>
        </div>
      )}

      {/* Operator Intercom Chat Modal */}
      {showChatModal && (
        <div className="quick-dropdown chat-dropdown">
          <div className="dropdown-header">
            <h4>Control Room Operator Intercom</h4>
            <button className="btn-close-dropdown" onClick={() => setShowChatModal(false)}>✕</button>
          </div>
          <div className="dropdown-chat-body">
            <div className="chat-empty">
              <IconChatBubble size={32} className="chat-empty-icon" />
              <p>No new dispatch messages</p>
              <span className="chat-sub">Shift A • All stations transmitting normal telemetry</span>
            </div>
            <div className="chat-quick-channels">
              <div className="channel-pill active">Main Utilities Dispatch</div>
              <div className="channel-pill">Boiler House</div>
              <div className="channel-pill">Stenter-24 Console</div>
              <div className="channel-pill">Substation 11kV</div>
            </div>
          </div>
        </div>
      )}

      {/* Module Quick Switcher Launcher */}
      {showAppLauncher && (
        <div className="quick-dropdown launcher-dropdown">
          <div className="dropdown-header">
            <h4>Liberty Mills SCADA Modules</h4>
            <button className="btn-close-dropdown" onClick={() => setShowAppLauncher(false)}>✕</button>
          </div>
          <div className="module-grid">
            <div
              className="module-card"
              onClick={() => {
                onNavigate('energy-dashboard', 'Dashboard / Energy Dashboard');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-energy">⚡</div>
              <span className="mod-title">Energy Telemetry</span>
              <span className="mod-desc">14.8 MW Load</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('steam-flow', 'Dashboard / Steam Flow');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-steam">💨</div>
              <span className="mod-title">Steam Flow</span>
              <span className="mod-desc">42.5 TPH</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('moisture', 'Dashboard / Moisture');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-moisture">💧</div>
              <span className="mod-title">Stenter Moisture</span>
              <span className="mod-desc">Stenter-24 Active</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('printing-live', 'Printing / Live Monitoring');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-print">🖨️</div>
              <span className="mod-title">Printing Mills</span>
              <span className="mod-desc">Rotary & Flatbed</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('dyeing-live', 'Dyeing / Live Monitoring');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-dye">🧪</div>
              <span className="mod-title">Dyeing House</span>
              <span className="mod-desc">High-temp Vessels</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('boilers', 'Boilers');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-boiler">🔥</div>
              <span className="mod-title">Boiler House</span>
              <span className="mod-desc">Units #1, #2, WHRB</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('grid', 'Grid');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-grid">🏭</div>
              <span className="mod-title">Grid & 11kV</span>
              <span className="mod-desc">K-Electric Feeder</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('solarpv', 'SolarPV');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-solar">☀️</div>
              <span className="mod-title">Solar PV</span>
              <span className="mod-desc">3.5 MWp Rooftop</span>
            </div>

            <div
              className="module-card"
              onClick={() => {
                onNavigate('etp', 'ETP');
                setShowAppLauncher(false);
              }}
            >
              <div className="mod-icon mod-etp">🌊</div>
              <span className="mod-title">ETP & RO</span>
              <span className="mod-desc">Effluent & Recycle</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
