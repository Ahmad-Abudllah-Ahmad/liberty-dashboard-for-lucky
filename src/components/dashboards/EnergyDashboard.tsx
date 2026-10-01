import React, { useState } from 'react';

export const EnergyDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h' | '7d'>('24h');

  return (
    <div className="dashboard-content">
      {/* Top Title & Filters */}
      <div className="content-header-row">
        <div>
          <h2>Energy Telemetry & Power Management</h2>
          <p className="content-subtitle">Liberty Mills Limited • Substation & Internal Power Generation Center</p>
        </div>
        <div className="header-actions-group">
          <div className="btn-group-pill">
            <button className={`btn-pill ${timeRange === '1h' ? 'active' : ''}`} onClick={() => setTimeRange('1h')}>1 Hour</button>
            <button className={`btn-pill ${timeRange === '8h' ? 'active' : ''}`} onClick={() => setTimeRange('8h')}>8h (Shift)</button>
            <button className={`btn-pill ${timeRange === '24h' ? 'active' : ''}`} onClick={() => setTimeRange('24h')}>24 Hours</button>
            <button className={`btn-pill ${timeRange === '7d' ? 'active' : ''}`} onClick={() => setTimeRange('7d')}>7 Days</button>
          </div>
          <button className="btn-export">Export SCADA Log</button>
        </div>
      </div>

      {/* Main KPI Cards Row */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL ACTIVE POWER</span>
            <span className="metric-badge green">ONLINE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">14,820</span>
            <span className="metric-unit">kW</span>
          </div>
          <div className="metric-footer">
            <span className="text-green">▲ +2.4%</span> vs previous shift • Peak: 15,200 kW
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">POWER FACTOR (AVG)</span>
            <span className="metric-badge green">OPTIMAL</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">0.982</span>
            <span className="metric-unit">PF</span>
          </div>
          <div className="metric-footer">
            Capacitor bank 4 of 6 active • Target &gt; 0.95
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">GRID FREQUENCY</span>
            <span className="metric-badge normal">STABLE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">50.04</span>
            <span className="metric-unit">Hz</span>
          </div>
          <div className="metric-footer">
            Min: 49.92 Hz • Max: 50.12 Hz
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TODAY'S CONSUMPTION</span>
            <span className="metric-badge blue">ACCUMULATED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">284.6</span>
            <span className="metric-unit">MWh</span>
          </div>
          <div className="metric-footer">
            Specific Energy: 0.18 kWh / fabric meter
          </div>
        </div>
      </div>

      {/* Power Source Mix & 3-Phase Telemetry */}
      <div className="scada-two-col">
        {/* Source Mix */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Current Power Generation & Supply Mix</h3>
            <span className="source-total">Total: 14.82 MW</span>
          </div>
          <div className="sources-breakdown">
            <div className="source-item">
              <div className="source-info">
                <span className="source-name">⚡ Jenbacher Gas Gensets (JMS 620 x 2)</span>
                <span className="source-kw font-mono">7,620 kW (51.4%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill gas-fill" style={{ width: '51.4%' }}></div>
              </div>
            </div>

            <div className="source-item">
              <div className="source-info">
                <span className="source-name">🏭 K-Electric 11kV Feeder (Grid)</span>
                <span className="source-kw font-mono">4,200 kW (28.3%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill grid-fill" style={{ width: '28.3%' }}></div>
              </div>
            </div>

            <div className="source-item">
              <div className="source-info">
                <span className="source-name">☀️ 3.5 MWp Rooftop Solar PV Array</span>
                <span className="source-kw font-mono">3,000 kW (20.3%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill solar-fill" style={{ width: '20.3%' }}></div>
              </div>
            </div>
          </div>

          <div className="source-legend-grid">
            <div className="legend-card">
              <span className="leg-label">Gas Genset Heat Rate</span>
              <span className="leg-val font-mono">8.2 MJ/kWh</span>
            </div>
            <div className="legend-card">
              <span className="leg-label">Grid Incomer Tariff</span>
              <span className="leg-val font-mono">Off-Peak Window</span>
            </div>
            <div className="legend-card">
              <span className="leg-label">Solar Irradiance</span>
              <span className="leg-val font-mono">895 W/m²</span>
            </div>
          </div>
        </div>

        {/* 3-Phase Voltage & Current Telemetry */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Substation Main LT Busbar 3-Phase Telemetry</h3>
            <span className="badge-tag">LT Incomer #1</span>
          </div>

          <div className="phases-grid">
            <div className="phase-card">
              <div className="phase-letter red">R (L1)</div>
              <div className="phase-data">
                <div className="phase-data-row">
                  <span className="lbl">Voltage:</span>
                  <span className="val font-mono">402.4 V</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">Current:</span>
                  <span className="val font-mono">1,248 A</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">Power:</span>
                  <span className="val font-mono">4,950 kW</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">THD (V):</span>
                  <span className="val font-mono">1.8%</span>
                </div>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-letter yellow">Y (L2)</div>
              <div className="phase-data">
                <div className="phase-data-row">
                  <span className="lbl">Voltage:</span>
                  <span className="val font-mono">404.1 V</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">Current:</span>
                  <span className="val font-mono">1,232 A</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">Power:</span>
                  <span className="val font-mono">4,940 kW</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">THD (V):</span>
                  <span className="val font-mono">1.9%</span>
                </div>
              </div>
            </div>

            <div className="phase-card">
              <div className="phase-letter blue">B (L3)</div>
              <div className="phase-data">
                <div className="phase-data-row">
                  <span className="lbl">Voltage:</span>
                  <span className="val font-mono">401.8 V</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">Current:</span>
                  <span className="val font-mono">1,240 A</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">Power:</span>
                  <span className="val font-mono">4,930 kW</span>
                </div>
                <div className="phase-data-row">
                  <span className="lbl">THD (V):</span>
                  <span className="val font-mono">1.7%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="voltage-unbalance-row">
            <span>Phase Voltage Unbalance: <strong className="text-green">0.42%</strong> (Limit: &lt; 2.0%)</span>
            <span>Current Unbalance: <strong className="text-green">1.1%</strong> (Limit: &lt; 5.0%)</span>
          </div>
        </div>
      </div>

      {/* Departmental Power Distribution */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Plant Departmental Power Distribution</h3>
          <span className="font-sub">Real-time Sub-metering Modbus TCP</span>
        </div>
        <div className="dept-distribution-grid">
          <div className="dept-card">
            <span className="dept-name">Dyeing & Bleaching Mill</span>
            <span className="dept-kw font-mono">4,850 kW</span>
            <span className="dept-share">32.7% of Plant</span>
          </div>
          <div className="dept-card">
            <span className="dept-name">Printing & Stenters</span>
            <span className="dept-kw font-mono">4,120 kW</span>
            <span className="dept-share">27.8% of Plant</span>
          </div>
          <div className="dept-card">
            <span className="dept-name">Compressors & Compressed Air</span>
            <span className="dept-kw font-mono">1,940 kW</span>
            <span className="dept-share">13.1% of Plant</span>
          </div>
          <div className="dept-card">
            <span className="dept-name">Chillers & HVAC System</span>
            <span className="dept-kw font-mono">1,680 kW</span>
            <span className="dept-share">11.3% of Plant</span>
          </div>
          <div className="dept-card">
            <span className="dept-name">Water Pumps, RO & ETP</span>
            <span className="dept-kw font-mono">1,250 kW</span>
            <span className="dept-share">8.4% of Plant</span>
          </div>
          <div className="dept-card">
            <span className="dept-name">Lighting & Admin Facilities</span>
            <span className="dept-kw font-mono">980 kW</span>
            <span className="dept-share">6.6% of Plant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
