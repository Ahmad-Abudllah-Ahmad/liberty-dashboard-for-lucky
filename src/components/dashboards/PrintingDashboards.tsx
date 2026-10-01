import React, { useState } from 'react';
import { LiveValue } from '../../lib/LiveTelemetry';
import { mockMachines } from '../../data/mockPlantData';

export const PrintingQualityDashboard: React.FC = () => {
  return (
    <div className="dashboard-content">
      <div className="content-header-row">
        <div>
          <h2>Printing Quality Parameters & Spectrophotometry</h2>
          <p className="content-subtitle">Liberty Mills Limited • Rotary Screen & Digital Textile Printing Quality Control</p>
        </div>
        <div className="header-actions-group">
          <span className="badge-tag green">QUALITY GRADE: A+ (99.2% FIRST CHOICE)</span>
          <button className="btn-export">Export QC Certificate</button>
        </div>
      </div>

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">COLOR DELTA E (ΔE)</span>
            <span className="metric-badge green">EXCELLENT</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={0.42} seed={1} amplitude={0.0500} digits={2} />
            <span className="metric-unit">ΔE</span>
          </div>
          <div className="metric-footer">
            Tolerance: &lt; 1.00 ΔE vs Master Standard
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PRINT REGISTRATION ERROR</span>
            <span className="metric-badge green">ALIGNED</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={0.08} seed={2} amplitude={0.0500} digits={2} />
            <span className="metric-unit">mm</span>
          </div>
          <div className="metric-footer">
            Optical Camera Alignment: 12 Colors Sync
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PASTE VISCOSITY</span>
            <span className="metric-badge normal">OPTIMAL</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={4250} seed={3} amplitude={34.0000} digits={0} />
            <span className="metric-unit">cP</span>
          </div>
          <div className="metric-footer">
            Alginate / Emulsion Binder • Temp 26.5°C
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">DRYER FIXATION TEMP</span>
            <span className="metric-badge green">STABILIZED</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={145} seed={4} amplitude={1.1600} digits={1} />
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Gas circulation burners active • 4 Chambers
          </div>
        </div>
      </div>

      {/* Screen Color Alignment Matrix */}
      <div className="scada-two-col">
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Reggiani Rotary Screen Printing • 12-Color Quality Matrix</h3>
            <span className="badge-tag">Design #LML-FLORAL-2026</span>
          </div>

          <div className="color-screen-table-wrap">
            <table className="scada-table">
              <thead>
                <tr>
                  <th>Color #</th>
                  <th>Pantone / Shade</th>
                  <th>Viscosity</th>
                  <th>Squeegee Bar</th>
                  <th>Mesh Count</th>
                  <th>ΔE Quality</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { num: 1, name: 'Deep Royal Navy', cP: '4,450 cP', bar: '3.0 Bar', mesh: '125 Mesh', de: '0.38', color: '#1e3a8a' },
                  { num: 2, name: 'Crimson Red Ruby', cP: '4,200 cP', bar: '2.8 Bar', mesh: '135 Mesh', de: '0.45', color: '#b91c1c' },
                  { num: 3, name: 'Golden Mustard', cP: '4,150 cP', bar: '2.8 Bar', mesh: '155 Mesh', de: '0.32', color: '#d97706' },
                  { num: 4, name: 'Emerald Olive', cP: '4,300 cP', bar: '2.9 Bar', mesh: '125 Mesh', de: '0.41', color: '#047857' },
                  { num: 5, name: 'Charcoal Shadow', cP: '4,500 cP', bar: '3.1 Bar', mesh: '165 Mesh', de: '0.29', color: '#334155' },
                  { num: 6, name: 'Tender Lavender', cP: '4,100 cP', bar: '2.7 Bar', mesh: '155 Mesh', de: '0.50', color: '#7c3aed' },
                ].map((c) => (
                  <tr key={c.num}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: c.color, display: 'inline-block' }}></span>
                        <strong>Screen {c.num}</strong>
                      </div>
                    </td>
                    <td>{c.name}</td>
                    <td className="font-mono">{c.cP}</td>
                    <td className="font-mono">{c.bar}</td>
                    <td>{c.mesh}</td>
                    <td className="font-mono text-green"><strong>{c.de}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Online Defect Frequency & Fabric Inspection</h3>
            <span className="font-sub">Automated Camera Vision System</span>
          </div>

          <div className="defect-metrics">
            <div className="defect-item">
              <span>Color Bleed / Smudge</span>
              <strong className="text-green font-mono">0.02 / 1000m</strong>
            </div>
            <div className="defect-item">
              <span>Screen Choking / Scumming</span>
              <strong className="text-green font-mono">0.00 / 1000m</strong>
            </div>
            <div className="defect-item">
              <span>Weft Distortion (Skew / Bow)</span>
              <strong className="text-green font-mono">0.4% (Within Limit)</strong>
            </div>
            <div className="defect-item">
              <span>Pin Holes / Coating Voids</span>
              <strong className="text-green font-mono">0.01 / 1000m</strong>
            </div>
          </div>

          <div className="quality-assurance-badge">
            <h4>ISO 9001 & OEKO-TEX Standard 100 Certified</h4>
            <p>Liberty Mills Limited high-performance printing standards guarantee wash fastness Grade 4-5 and light fastness Grade 6.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrintingLiveMonitoringDashboard: React.FC = () => {
  const [selectedLine, setSelectedLine] = useState<'ROT-01' | 'ZIM-02' | 'DIG-03'>('ROT-01');

  return (
    <div className="dashboard-content">
      <div className="content-header-row">
        <div>
          <h2>Printing Mills Live SCADA Telemetry & Machine Monitoring</h2>
          <p className="content-subtitle">Liberty Mills Limited • Rotary, Flatbed & Stenter Production Lines</p>
        </div>
        <div className="header-actions-group">
          <div className="btn-group-pill">
            <button className={`btn-pill ${selectedLine === 'ROT-01' ? 'active' : ''}`} onClick={() => setSelectedLine('ROT-01')}>
              Rotary Screen (Line 1)
            </button>
            <button className={`btn-pill ${selectedLine === 'ZIM-02' ? 'active' : ''}`} onClick={() => setSelectedLine('ZIM-02')}>
              Zimmer Flatbed (Line 2)
            </button>
            <button className={`btn-pill ${selectedLine === 'DIG-03' ? 'active' : ''}`} onClick={() => setSelectedLine('DIG-03')}>
              Digital High-Speed (Line 3)
            </button>
          </div>
        </div>
      </div>

      {/* Machine Status Top */}
      <div className="machine-live-banner">
        <div className="live-camera-mockup">
          <div className="camera-header">
            <span className="rec-dot"></span> LIVE SCADA FEED • REGGIANI ROTARY #1 (CAMERA 04)
          </div>
          <div className="camera-view">
            <div className="camera-crosshair"></div>
            <div className="camera-overlay-info">
              <span>SPEED: 62.0 M/MIN</span>
              <span>JOB: JC-LML-2026-9460</span>
              <span>FABRIC: 100% COTTON 240 CM</span>
            </div>
          </div>
        </div>

        <div className="live-specs-column">
          <div className="spec-card">
            <span className="spec-label">ACTIVE JOB CARD</span>
            <h3 className="spec-title">JC-LML-2026-9460</h3>
            <span className="spec-desc">Reactive Rotary Print 120 GSM • Export Order Bedding</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">SHIFT RUN METERS</span>
            <div className="spec-val-row">
              <span className="spec-val font-mono">24,850</span>
              <span className="spec-unit">Meters</span>
            </div>
            <span className="spec-desc text-green">Shift Target: 28,000 m (88.7% completed)</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">LINE RUNNING EFFICIENCY</span>
            <div className="spec-val-row">
              <span className="spec-val font-mono">96.0</span>
              <span className="spec-unit">%</span>
            </div>
            <span className="spec-desc text-green">Downtime today: 18 mins (Screen washing)</span>
          </div>
        </div>
      </div>

      {/* Live Machines Table */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>All Printing & Stenter Units Current Status</h3>
          <span className="badge-tag">Shift A • Live</span>
        </div>
        <div className="table-responsive">
          <table className="scada-table">
            <thead>
              <tr>
                <th>Machine</th>
                <th>Type</th>
                <th>Status</th>
                <th>Running Speed</th>
                <th>Active Job Card</th>
                <th>Operator</th>
                <th>Chamber Temp</th>
                <th>OEE Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {mockMachines.filter(m => m.type.includes('Printing') || m.type.includes('Finishing')).map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.type}</td>
                  <td><span className={`status-tag ${m.status}`}><span className="dot"></span> {m.status.toUpperCase()}</span></td>
                  <td className="font-mono">{m.speed}</td>
                  <td>{m.jobCard}</td>
                  <td>{m.operator}</td>
                  <td className="font-mono">{m.temperature} °C</td>
                  <td className="font-mono text-green"><strong>{m.efficiency}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
