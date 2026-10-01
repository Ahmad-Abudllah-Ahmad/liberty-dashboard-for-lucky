import React from 'react';

export const DyeingQualityDashboard: React.FC = () => {
  return (
    <div className="dashboard-content">
      <div className="content-header-row">
        <div>
          <h2>Dyeing Quality Parameters & Process Curves</h2>
          <p className="content-subtitle">Liberty Mills Limited • High Temperature Exhaust & Continuous Dyeing QC</p>
        </div>
        <div className="header-actions-group">
          <span className="badge-tag green">RIGHT-FIRST-TIME (RFT): 98.6%</span>
          <button className="btn-export">Export Dyeing Log</button>
        </div>
      </div>

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">DYE BATH PH</span>
            <span className="metric-badge green">STABILIZED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">6.24</span>
            <span className="metric-unit">pH</span>
          </div>
          <div className="metric-footer">
            Setpoint: 6.0 - 6.5 pH (Reactive Exhaust)
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">LIQUOR RATIO</span>
            <span className="metric-badge green">ECO-LOW</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">1 : 5.8</span>
            <span className="metric-unit">L:K</span>
          </div>
          <div className="metric-footer">
            Water saving: 34% vs conventional machines
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">SALT CONCENTRATION</span>
            <span className="metric-badge normal">DOSING</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">45.0</span>
            <span className="metric-unit">g/L</span>
          </div>
          <div className="metric-footer">
            Glauber's Salt (Na₂SO₄) automatic dosing
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">COLOR REPRODUCIBILITY</span>
            <span className="metric-badge green">GRADE 5</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">0.35</span>
            <span className="metric-unit">ΔE</span>
          </div>
          <div className="metric-footer">
            Datacolor 800 Spectrophotometer Match
          </div>
        </div>
      </div>

      {/* Temperature / Time Profile */}
      <div className="scada-two-col">
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Dyeing Thermal Profile Cycle • Vessel #3 (Fong's Eco-8)</h3>
            <span className="badge-tag">Reactive Deep Navy • 100% Cotton</span>
          </div>

          <div className="thermal-curve-container">
            <div className="curve-step">
              <span className="c-step-name">1. Loading & Scouring</span>
              <span className="c-step-temp font-mono">60 °C</span>
              <span className="c-step-duration font-sub">20 Mins</span>
            </div>
            <div className="curve-step">
              <span className="c-step-name">2. Dye Dosing</span>
              <span className="c-step-temp font-mono">50 °C</span>
              <span className="c-step-duration font-sub">15 Mins</span>
            </div>
            <div className="curve-step">
              <span className="c-step-name">3. Salt & Alkali</span>
              <span className="c-step-temp font-mono">60 °C</span>
              <span className="c-step-duration font-sub">30 Mins</span>
            </div>
            <div className="curve-step active">
              <span className="c-step-name">4. Fixation Holding</span>
              <span className="c-step-temp font-mono text-green">98.4 °C</span>
              <span className="c-step-duration font-sub">Holding (35/45m)</span>
            </div>
            <div className="curve-step">
              <span className="c-step-name">5. Soaping & Wash</span>
              <span className="c-step-temp font-mono">95 °C</span>
              <span className="c-step-duration font-sub">25 Mins</span>
            </div>
            <div className="curve-step">
              <span className="c-step-name">6. Softening & Drain</span>
              <span className="c-step-temp font-mono">40 °C</span>
              <span className="c-step-duration font-sub">15 Mins</span>
            </div>
          </div>

          <div className="curve-details-box">
            <span>Current Heating Gradient: <strong>1.5 °C / min</strong></span>
            <span>Steam Flow to Vessel: <strong>1.8 TPH</strong></span>
            <span>Pump Differential Pressure: <strong>0.38 Bar</strong></span>
          </div>
        </div>

        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Dye Chemical Dosing Tanks Status</h3>
            <span className="font-sub">Automated Liquid & Powder Dosing</span>
          </div>

          <div className="dosing-tanks-list">
            <div className="dosing-tank-item">
              <div>
                <strong>Dosing Tank A: Reactive Dyes Solution</strong>
                <div className="font-sub">Volume: 420 L • Agitator Active @ 240 RPM</div>
              </div>
              <div className="font-mono text-green">74% Level</div>
            </div>

            <div className="dosing-tank-item">
              <div>
                <strong>Dosing Tank B: Soda Ash / Caustic Alkali</strong>
                <div className="font-sub">Volume: 650 L • Temp 28.0°C</div>
              </div>
              <div className="font-mono text-green">82% Level</div>
            </div>

            <div className="dosing-tank-item">
              <div>
                <strong>Dosing Tank C: Glauber's Salt Brine</strong>
                <div className="font-sub">Volume: 800 L • Specific Gravity 1.18</div>
              </div>
              <div className="font-mono text-green">65% Level</div>
            </div>

            <div className="dosing-tank-item">
              <div>
                <strong>Dosing Tank D: Acetic Acid Neutralizer</strong>
                <div className="font-sub">Volume: 200 L • pH Buffer Ready</div>
              </div>
              <div className="font-mono text-green">90% Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DyeingLiveMonitoringDashboard: React.FC = () => {
  return (
    <div className="dashboard-content">
      <div className="content-header-row">
        <div>
          <h2>Dyeing Mills Live SCADA Telemetry & Vessel Monitoring</h2>
          <p className="content-subtitle">Liberty Mills Limited • Central Dye House Vessel Automation Network</p>
        </div>
        <div className="header-actions-group">
          <span className="badge-tag green">8 OF 10 VESSELS ACTIVE IN PRODUCTION</span>
          <button className="btn-export">Export Batch Logs</button>
        </div>
      </div>

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL ACTIVE BATCHES</span>
            <span className="metric-badge green">RUNNING</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">8 / 10</span>
            <span className="metric-unit">Vessels</span>
          </div>
          <div className="metric-footer">
            2 Idle / Washing • Total Capacity: 18,500 kg
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">DYE HOUSE STEAM LOAD</span>
            <span className="metric-badge normal">CONSUMING</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">17.8</span>
            <span className="metric-unit">TPH</span>
          </div>
          <div className="metric-footer">
            Supplied from Boilers #1 &amp; #2
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">HOT WATER RECOVERY</span>
            <span className="metric-badge green">HEAT EXCHANGER</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">84.2</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Recovered from cooling drain water
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">DYE HOUSE WATER FLOW</span>
            <span className="metric-badge blue">RO WATER</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">84.5</span>
            <span className="metric-unit">m³/h</span>
          </div>
          <div className="metric-footer">
            Conductivity: &lt; 50 µS/cm (Zero hardness)
          </div>
        </div>
      </div>

      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Dyeing Vessels Live Telemetry</h3>
          <span className="badge-tag">Shift A Status</span>
        </div>

        <div className="table-responsive">
          <table className="scada-table">
            <thead>
              <tr>
                <th>Vessel ID</th>
                <th>Model</th>
                <th>Batch # & Shade</th>
                <th>Status</th>
                <th>Temp</th>
                <th>Pressure</th>
                <th>Phase</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'DY-01', model: "Fong's Eco-8 (2000kg)", batch: 'JC-9490 • Reactive Deep Navy', status: 'running', temp: '98.4 °C', pres: '2.1 Bar', phase: 'Fixation Holding', rem: '18 mins' },
                { id: 'DY-02', model: "Fong's Eco-8 (2000kg)", batch: 'JC-9491 • Forest Emerald 2000kg', status: 'running', temp: '85.0 °C', pres: '1.8 Bar', phase: 'Heating Up', rem: '42 mins' },
                { id: 'DY-03', model: 'Thies Soft-Flow (1000kg)', batch: 'JC-9492 • Pastel Lavender', status: 'running', temp: '60.0 °C', pres: '1.2 Bar', phase: 'Chemical Dosing', rem: '55 mins' },
                { id: 'DY-04', model: 'Thies Soft-Flow (1000kg)', batch: 'JC-9493 • Charcoal Melange', status: 'running', temp: '95.0 °C', pres: '1.9 Bar', phase: 'Soaping Wash', rem: '25 mins' },
                { id: 'DY-05', model: 'Sclavos Athena (1500kg)', batch: 'JC-9494 • Optic White Mercerized', status: 'running', temp: '90.0 °C', pres: '1.6 Bar', phase: 'Bleaching Boil', rem: '30 mins' },
                { id: 'DY-06', model: 'Thies Soft-Flow (1000kg)', batch: 'Waiting Lot #9495', status: 'idle', temp: '42.0 °C', pres: '0.0 Bar', phase: 'Drain & Wash', rem: 'Ready' },
              ].map((v) => (
                <tr key={v.id}>
                  <td className="font-mono"><strong>{v.id}</strong></td>
                  <td>{v.model}</td>
                  <td>{v.batch}</td>
                  <td><span className={`status-tag ${v.status}`}><span className="dot"></span> {v.status.toUpperCase()}</span></td>
                  <td className="font-mono">{v.temp}</td>
                  <td className="font-mono">{v.pres}</td>
                  <td><span className="badge-tag">{v.phase}</span></td>
                  <td className="font-mono">{v.rem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
