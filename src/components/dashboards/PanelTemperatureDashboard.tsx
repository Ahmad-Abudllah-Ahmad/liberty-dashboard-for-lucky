import React, { useMemo, useState } from 'react';
import { StackBarChart } from '../charts/PortalCharts';
import { ScadaContentHeader } from '../portal/ScadaContentHeader';
import { LiveValue } from '../../lib/LiveTelemetry';
import { useLiveNumber, useTelemetryTick } from '../../lib/LiveTelemetry';
import { wobble } from '../../lib/liveValue';

export const PanelTemperatureDashboard: React.FC = () => {
  const [selectedPanel, setSelectedPanel] = useState<string>('LT-01');
  const tick = useTelemetryTick();

  const panels = useMemo(
    () => [
      { id: 'LT-01', name: 'Main Substation LT Switchgear Panel #1', ambient: wobble(31.5, tick, 0.15, 1), maxTemp: wobble(82.4, tick, 0.4, 2), status: 'warning', hotspot: 'Phase B Busbar Bolted Joint' },
      { id: 'LT-02', name: 'Main Substation LT Switchgear Panel #2', ambient: wobble(32.0, tick, 0.15, 3), maxTemp: wobble(64.2, tick, 0.3, 4), status: 'normal', hotspot: 'None' },
      { id: 'APFC-01', name: 'Automatic Power Factor Capacitor Bank 1200 kVAR', ambient: wobble(34.2, tick, 0.15, 5), maxTemp: wobble(68.5, tick, 0.3, 6), status: 'normal', hotspot: 'Stage 3 De-tuned Reactor' },
      { id: 'TRF-01', name: '2500 kVA Step-Down Transformer 11kV/415V', ambient: wobble(33.0, tick, 0.15, 7), maxTemp: wobble(74.0, tick, 0.35, 8), status: 'normal', hotspot: 'LV Bushing Terminal' },
      { id: 'VFD-STN24', name: 'Stenter-24 Multi-Drive Inverter Cabinet', ambient: wobble(28.5, tick, 0.12, 9), maxTemp: wobble(44.8, tick, 0.25, 10), status: 'normal', hotspot: 'Cabinet Exhaust Vent' },
    ],
    [tick],
  );

  const thermalProbesBase = [
    { name: 'Busbar Incomer Phase R (L1)', temp: 62.4, threshold: 75.0 },
    { name: 'Busbar Incomer Phase Y (L2)', temp: 82.4, threshold: 75.0 },
    { name: 'Busbar Incomer Phase B (L3)', temp: 64.1, threshold: 75.0 },
    { name: 'Air Circuit Breaker ACB-1 Primary Contacts', temp: 58.2, threshold: 70.0 },
    { name: 'Neutral Link & Earth Return Connection', temp: 38.6, threshold: 60.0 },
    { name: 'Feeder Breaker MCCB-04 (Dyeing Mill Main)', temp: 67.8, threshold: 75.0 },
    { name: 'Feeder Breaker MCCB-07 (Stenter-24 Incomer)', temp: 59.4, threshold: 75.0 },
    { name: 'Enclosure Internal Air Ambient Temp', temp: 31.5, threshold: 45.0 },
  ];

  const probeRows = useMemo(
    () =>
      thermalProbesBase.map((probe, index) => ({
        label: probe.name,
        value: Number(wobble(probe.temp, tick, 0.35, index + 11).toFixed(1)),
      })),
    [tick],
  );

  const maxProbe = useLiveNumber(82.4, 12, 0.35);
  const ambient = useLiveNumber(31.5, 13, 0.12);

  return (
    <div className="dashboard-content">
      <ScadaContentHeader
        title="Electrical Panel Temperature & Thermal Monitoring"
        subtitle="Liberty Mills Limited • Infrared Continuous Busbar & Switchgear Thermal Protection"
        actions={
          <>
            <span className="badge-tag yellow">1 THERMAL HOTSPOT WARNING DETECTED</span>
            <button type="button" className="btn-export">Export Thermal Report</button>
          </>
        }
      />

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MAX PANEL TEMPERATURE</span>
            <span className="metric-badge yellow">HOTSPOT DETECTED</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number text-yellow" value={82.4} seed={12} amplitude={0.35} digits={1} />
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">Location: LT-01 Busbar Phase Y (Limit: 75.0°C)</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">SUBSTATION ROOM AMBIENT</span>
            <span className="metric-badge normal">AIR CONDITIONED</span>
          </div>
          <div className="metric-body">
            <LiveValue value={31.5} seed={13} amplitude={0.12} digits={1} />
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">Humidity: 48% RH • AC Unit 2 Running</div>
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
          <div className="metric-footer">Battery &amp; Zigbee Mesh: 100% Signal</div>
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
          <div className="metric-footer">Scheduled torque inspection at next shutdown</div>
        </div>
      </div>

      <div className="scada-two-col">
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
                    {p.status === 'warning' ? `HOTSPOT ${p.maxTemp.toFixed(1)}°C` : 'NORMAL'}
                  </span>
                </div>
                <div className="p-details">
                  <span>Enclosure Ambient: <strong className="font-mono">{p.ambient.toFixed(1)}°C</strong></span>
                  <span>Max Contact Temp: <strong className="font-mono">{p.maxTemp.toFixed(1)}°C</strong></span>
                </div>
                {p.hotspot !== 'None' && (
                  <div className="hotspot-flag">⚠️ Detected Hotspot: {p.hotspot}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Thermal Probe Readings • {selectedPanel}</h3>
            <span className="font-sub">Continuous Real-time IR Telemetry</span>
          </div>

          <StackBarChart rows={probeRows} variant="probe" max={100} />

          <div className="thermal-action-box">
            <h4>Recommended Preventive Maintenance Action</h4>
            <p>
              Phase Y Busbar joint shows ~20°C rise vs adjacent phases (L1: {probeRows[0]?.value ?? 62}°C vs L2:{' '}
              {maxProbe.toFixed(1)}°C). Ambient {ambient.toFixed(1)}°C. Recommend retorquing during the Sunday maintenance window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
