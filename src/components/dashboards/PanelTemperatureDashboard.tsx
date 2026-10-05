import React, { useState } from 'react';

export const PanelTemperatureDashboard: React.FC = () => {
  const [selectedPanel, setSelectedPanel] = useState<string>('LT-01');

  const panels = [
    { id: 'LT-01', name: 'Main Substation LT Switchgear Panel #1', ambient: 31.5, maxTemp: 82.4, status: 'warning', hotspot: 'Phase B Busbar Bolted Joint' },
    { id: 'LT-02', name: 'Main Substation LT Switchgear Panel #2', ambient: 32.0, maxTemp: 64.2, status: 'normal', hotspot: 'None' },
    { id: 'APFC-01', name: 'Automatic Power Factor Capacitor Bank 1200 kVAR', ambient: 34.2, maxTemp: 68.5, status: 'normal', hotspot: 'Stage 3 De-tuned Reactor' },
    { id: 'TRF-01', name: '2500 kVA Step-Down Transformer 11kV/415V', ambient: 33.0, maxTemp: 74.0, status: 'normal', hotspot: 'LV Bushing Terminal' },
    { id: 'VFD-STN24', name: 'Stenter-24 Multi-Drive Inverter Cabinet', ambient: 28.5, maxTemp: 44.8, status: 'normal', hotspot: 'Cabinet Exhaust Vent' },
  ];

  const thermalProbes = [
    { name: 'Busbar Incomer Phase R (L1)', temp: 62.4, threshold: 75.0, status: 'normal' },
    { name: 'Busbar Incomer Phase Y (L2)', temp: 82.4, threshold: 75.0, status: 'warning' },
    { name: 'Busbar Incomer Phase B (L3)', temp: 64.1, threshold: 75.0, status: 'normal' },
    { name: 'Air Circuit Breaker ACB-1 Primary Contacts', temp: 58.2, threshold: 70.0, status: 'normal' },
    { name: 'Neutral Link & Earth Return Connection', temp: 38.6, threshold: 60.0, status: 'normal' },
    { name: 'Feeder Breaker MCCB-04 (Dyeing Mill Main)', temp: 67.8, threshold: 75.0, status: 'normal' },
    { name: 'Feeder Breaker MCCB-07 (Stenter-24 Incomer)', temp: 59.4, threshold: 75.0, status: 'normal' },
    { name: 'Enclosure Internal Air Ambient Temp', temp: 31.5, threshold: 45.0, status: 'normal' },
  ];

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Electrical Panel Temperature & Thermal Monitoring</h2>
          <p className="content-subtitle">Lucky Textile • Infrared Continuous Busbar & Switchgear Thermal Protection</p>
        </div>
        <div className="header-actions-group">
          <span className="badge-tag yellow">1 THERMAL HOTSPOT WARNING DETECTED</span>
          <button className="btn-export">Export Thermal Report</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MAX PANEL TEMPERATURE</span>
            <span className="metric-badge yellow">HOTSPOT DETECTED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number text-yellow">82.4</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Location: LT-01 Busbar Phase Y (Limit: 75.0°C)
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">SUBSTATION ROOM AMBIENT</span>
            <span className="metric-badge normal">AIR CONDITIONED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">31.5</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Humidity: 48% RH • AC Unit 2 Running
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">ONLINE WIRELESS IR PROBES</span>
            <span className="metric-badge green">ALL HEALTHY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">48 / 48</span>
            <span className="metric-unit">Sensors</span>
          </div>
          <div className="metric-footer">
            Battery &amp; Zigbee Mesh: 100% Signal
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">THERMAL RUNAWAY RISK</span>
            <span className="metric-badge yellow">ELEVATED PH-B</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">LOW</span>
            <span className="metric-unit">ALERT</span>
          </div>
          <div className="metric-footer">
            Scheduled torque inspection at next shutdown
          </div>
        </div>
      </div>

      {/* Panel Selection and Probes */}
      <div className="scada-two-col">
        {/* Switchgear Panels List */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Monitored Electrical Switchgear Enclosures</h3>
            <span className="badge-tag">5 High-Power Cabinets</span>
          </div>

          <div className="panel-selector-list">
            {panels.map((p) => (
              <div
                key={p.id}
                className={`panel-select-card ${selectedPanel === p.id ? 'active' : ''} ${p.status === 'warning' ? 'has-warning' : ''}`}
                onClick={() => setSelectedPanel(p.id)}
              >
                <div className="p-header">
                  <strong>{p.name}</strong>
                  <span className={`status-pill ${p.status}`}>
                    {p.status === 'warning' ? 'HOTSPOT 82.4°C' : 'NORMAL'}
                  </span>
                </div>
                <div className="p-details">
                  <span>Enclosure Ambient: <strong className="font-mono">{p.ambient}°C</strong></span>
                  <span>Max Contact Temp: <strong className="font-mono">{p.maxTemp}°C</strong></span>
                </div>
                {p.hotspot !== 'None' && (
                  <div className="hotspot-flag">
                    ⚠️ Detected Hotspot: {p.hotspot}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thermal Probes Matrix for Selected Panel */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Thermal Probe Readings • {selectedPanel}</h3>
            <span className="font-sub">Continuous Real-time IR Telemetry</span>
          </div>

          <div className="probe-list">
            {thermalProbes.map((probe, idx) => {
              const isOver = probe.temp >= probe.threshold;
              return (
                <div key={idx} className={`probe-row ${isOver ? 'probe-alert' : ''}`}>
                  <div className="probe-info">
                    <span className="probe-name">{probe.name}</span>
                    <span className="probe-limit font-sub">Alarm Threshold: {probe.threshold}°C</span>
                  </div>
                  <div className="probe-bar-wrapper">
                    <div
                      className="probe-bar-fill"
                      style={{
                        width: `${Math.min(100, (probe.temp / 100) * 100)}%`,
                        backgroundColor: isOver ? '#ef4444' : probe.temp > 60 ? '#f59e0b' : '#10b981',
                      }}
                    ></div>
                  </div>
                  <div className="probe-temp font-mono">
                    <strong className={isOver ? 'text-red' : ''}>{probe.temp} °C</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="thermal-action-box">
            <h4>Recommended Preventive Maintenance Action</h4>
            <p>
              Phase Y Busbar joint shows 20°C temperature rise compared to adjacent phases (L1: 62.4°C vs L2: 82.4°C).
              Likely cause: loose bolt torque or surface oxidation. Recommend retorquing with calibrated torque wrench during upcoming Sunday maintenance window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
