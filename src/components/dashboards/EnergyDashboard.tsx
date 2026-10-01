import React, { useMemo, useState } from 'react';
import { ShareBarChart } from '../charts/PortalCharts';
import { LiveValue, useLiveNumber } from '../../lib/LiveTelemetry';
import { formatNumber } from '../../lib/liveValue';

export const EnergyDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h' | '7d'>('24h');

  const totalKw = useLiveNumber(14820, 1, 45);

  const genGas = useLiveNumber(7620, 10, 35);
  const genGrid = useLiveNumber(4200, 11, 28);
  const genSolar = useLiveNumber(3000, 12, 22);

  const deptDyeing = useLiveNumber(4850, 20, 28);
  const deptPrint = useLiveNumber(4120, 21, 24);
  const deptComp = useLiveNumber(1940, 22, 14);
  const deptHvac = useLiveNumber(1680, 23, 12);
  const deptWater = useLiveNumber(1250, 24, 10);
  const deptLight = useLiveNumber(980, 25, 8);

  const mixRows = useMemo(
    () => [
      { label: '⚡ Jenbacher Gas Gensets (JMS 620 x 2)', value: genGas, fillClass: 'gas-fill', unit: 'kW' },
      { label: '🏭 K-Electric 11kV Feeder (Grid)', value: genGrid, fillClass: 'grid-fill', unit: 'kW' },
      { label: '☀️ 3.5 MWp Rooftop Solar PV Array', value: genSolar, fillClass: 'solar-fill', unit: 'kW' },
    ],
    [genGas, genGrid, genSolar],
  );

  const deptRows = useMemo(
    () => [
      { label: 'Dyeing & Bleaching Mill', value: deptDyeing, unit: 'kW' },
      { label: 'Printing & Stenters', value: deptPrint, unit: 'kW' },
      { label: 'Compressors & Compressed Air', value: deptComp, unit: 'kW' },
      { label: 'Chillers & HVAC System', value: deptHvac, unit: 'kW' },
      { label: 'Water Pumps, RO & ETP', value: deptWater, unit: 'kW' },
      { label: 'Lighting & Admin Facilities', value: deptLight, unit: 'kW' },
    ],
    [deptDyeing, deptPrint, deptComp, deptHvac, deptWater, deptLight],
  );

  return (
    <div className="dashboard-content">
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

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL ACTIVE POWER</span>
            <span className="metric-badge green">ONLINE</span>
          </div>
          <div className="metric-body">
            <LiveValue value={14820} seed={1} amplitude={45} digits={0} />
            <span className="metric-unit">kW</span>
          </div>
          <div className="metric-footer">
            <span className="text-green">▲ live</span> vs previous shift • Peak: 15,200 kW
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">POWER FACTOR (AVG)</span>
            <span className="metric-badge green">OPTIMAL</span>
          </div>
          <div className="metric-body">
            <LiveValue value={0.982} seed={2} amplitude={0.004} digits={3} />
            <span className="metric-unit">PF</span>
          </div>
          <div className="metric-footer">Capacitor bank 4 of 6 active • Target &gt; 0.95</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">GRID FREQUENCY</span>
            <span className="metric-badge normal">STABLE</span>
          </div>
          <div className="metric-body">
            <LiveValue value={50.04} seed={3} amplitude={0.02} digits={2} />
            <span className="metric-unit">Hz</span>
          </div>
          <div className="metric-footer">Min: 49.92 Hz • Max: 50.12 Hz</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TODAY&apos;S CONSUMPTION</span>
            <span className="metric-badge blue">ACCUMULATED</span>
          </div>
          <div className="metric-body">
            <LiveValue value={284.6} seed={4} amplitude={0.35} digits={1} />
            <span className="metric-unit">MWh</span>
          </div>
          <div className="metric-footer">Specific Energy: 0.18 kWh / fabric meter</div>
        </div>
      </div>

      <div className="scada-two-col">
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Current Power Generation & Supply Mix</h3>
            <span className="source-total">Total: {(totalKw / 1000).toFixed(2)} MW</span>
          </div>
          <ShareBarChart layout="source" rows={mixRows} />
          <div className="source-legend-grid">
            <div className="legend-card">
              <span className="leg-label">Gas Genset Heat Rate</span>
              <LiveValue className="leg-val font-mono" value={8.2} seed={30} amplitude={0.05} digits={1} suffix=" MJ/kWh" />
            </div>
            <div className="legend-card">
              <span className="leg-label">Grid Incomer Tariff</span>
              <span className="leg-val font-mono">Off-Peak Window</span>
            </div>
            <div className="legend-card">
              <span className="leg-label">Solar Irradiance</span>
              <LiveValue className="leg-val font-mono" value={895} seed={31} amplitude={12} digits={0} suffix=" W/m²" />
            </div>
          </div>
        </div>

        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Substation Main LT Busbar 3-Phase Telemetry</h3>
            <span className="badge-tag">LT Incomer #1</span>
          </div>
          <div className="phases-grid">
            {[
              { letter: 'R (L1)', className: 'red', v: 402.4, a: 1248, p: 4950, s: 40 },
              { letter: 'Y (L2)', className: 'yellow', v: 404.1, a: 1232, p: 4940, s: 41 },
              { letter: 'B (L3)', className: 'blue', v: 401.8, a: 1240, p: 4930, s: 42 },
            ].map((phase) => (
              <div key={phase.letter} className="phase-card">
                <div className={`phase-letter ${phase.className}`}>{phase.letter}</div>
                <div className="phase-data">
                  <div className="phase-data-row">
                    <span className="lbl">Voltage:</span>
                    <LiveValue className="val font-mono" value={phase.v} seed={phase.s} amplitude={0.8} digits={1} suffix=" V" />
                  </div>
                  <div className="phase-data-row">
                    <span className="lbl">Current:</span>
                    <LiveValue className="val font-mono" value={phase.a} seed={phase.s + 1} amplitude={6} digits={0} suffix=" A" />
                  </div>
                  <div className="phase-data-row">
                    <span className="lbl">Power:</span>
                    <LiveValue className="val font-mono" value={phase.p} seed={phase.s + 2} amplitude={18} digits={0} suffix=" kW" />
                  </div>
                  <div className="phase-data-row">
                    <span className="lbl">THD (V):</span>
                    <LiveValue className="val font-mono" value={1.8} seed={phase.s + 3} amplitude={0.05} digits={1} suffix="%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="voltage-unbalance-row">
            <span>Phase Voltage Unbalance: <strong className="text-green">0.42%</strong> (Limit: &lt; 2.0%)</span>
            <span>Current Unbalance: <strong className="text-green">1.1%</strong> (Limit: &lt; 5.0%)</span>
          </div>
        </div>
      </div>

      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Plant Departmental Power Distribution</h3>
          <span className="font-sub">Real-time Sub-metering Modbus TCP</span>
        </div>
        <div className="dept-distribution-grid">
          {deptRows.map((row) => (
            <div key={row.label} className="dept-card chart-interactive">
              <span className="dept-name">{row.label}</span>
              <span className="dept-kw font-mono">{formatNumber(row.value, 0)} kW</span>
              <span className="dept-share">{((row.value / totalKw) * 100).toFixed(1)}% of Plant</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
