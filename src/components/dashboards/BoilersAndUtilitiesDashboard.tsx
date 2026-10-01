import React, { useState } from 'react';

export const BoilersDashboard: React.FC = () => {
  const [selectedBoiler, setSelectedBoiler] = useState<'b1' | 'b2' | 'whrb'>('b1');

  return (
    <div className="dashboard-content">
      <div className="content-header-row">
        <div>
          <h2>Boiler House SCADA & Steam Generation Plant</h2>
          <p className="content-subtitle">Liberty Mills Limited • Central High-Pressure Steam Boilers & Heat Recovery</p>
        </div>
        <div className="header-actions-group">
          <div className="btn-group-pill">
            <button className={`btn-pill ${selectedBoiler === 'b1' ? 'active' : ''}`} onClick={() => setSelectedBoiler('b1')}>
              Boiler #1 (25 TPH Gas)
            </button>
            <button className={`btn-pill ${selectedBoiler === 'b2' ? 'active' : ''}`} onClick={() => setSelectedBoiler('b2')}>
              Boiler #2 (30 TPH Multi-fuel)
            </button>
            <button className={`btn-pill ${selectedBoiler === 'whrb' ? 'active' : ''}`} onClick={() => setSelectedBoiler('whrb')}>
              WHRB Heat Recovery
            </button>
          </div>
        </div>
      </div>

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL STEAM GENERATED</span>
            <span className="metric-badge green">RUNNING</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">42.50</span>
            <span className="metric-unit">TPH</span>
          </div>
          <div className="metric-footer">
            Design capacity: 55 TPH • Load factor: 77.2%
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">STEAM HEADER PRESSURE</span>
            <span className="metric-badge green">STABLE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">10.24</span>
            <span className="metric-unit">Bar</span>
          </div>
          <div className="metric-footer">
            Modulating burner firing rate: 72%
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">COMBUSTION EFFICIENCY</span>
            <span className="metric-badge green">OPTIMAL</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">88.4</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">
            Flue gas temp: 152°C • O₂ level: 3.4%
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">DEAERATOR FEEDWATER</span>
            <span className="metric-badge normal">TREATED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">104.5</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Dissolved Oxygen: &lt; 0.005 ppm • pH: 8.8
          </div>
        </div>
      </div>

      {/* Boiler Diagram Simulation */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Boiler #1 (25 TPH) SCADA Process Mimic</h3>
          <span className="badge-tag">Burner: Dual Fuel Riello • PLC: Siemens S7-1500</span>
        </div>

        <div className="boiler-mimic-grid">
          <div className="mimic-item">
            <span className="m-label">Steam Drum Level</span>
            <span className="m-val font-mono">+12 mm</span>
            <span className="m-sub font-sub">Normal Range: -50 to +50mm</span>
          </div>

          <div className="mimic-item">
            <span className="m-label">Feedwater Flow</span>
            <span className="m-val font-mono">18.6 m³/h</span>
            <span className="m-sub font-sub">VFD Pump 1 Active @ 44 Hz</span>
          </div>

          <div className="mimic-item">
            <span className="m-label">Natural Gas Flow</span>
            <span className="m-val font-mono">1,420 m³/h</span>
            <span className="m-sub font-sub">Gas Pressure: 280 mbar</span>
          </div>

          <div className="mimic-item">
            <span className="m-label">Furnace Draft Pressure</span>
            <span className="m-val font-mono">-18 Pa</span>
            <span className="m-sub font-sub">ID Fan Balanced Draft</span>
          </div>

          <div className="mimic-item">
            <span className="m-label">Blowdown TDS</span>
            <span className="m-val font-mono">2,480 ppm</span>
            <span className="m-sub font-sub">Auto Continuous Blowdown</span>
          </div>

          <div className="mimic-item">
            <span className="m-label">Flame Scanner</span>
            <span className="m-val font-mono text-green">100% SIGNAL</span>
            <span className="m-sub font-sub">UV / IR Flame Sensor Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UtilitiesDashboard: React.FC = () => {
  return (
    <div className="dashboard-content">
      <div className="content-header-row">
        <div>
          <h2>Plant Utilities & Auxiliary Distribution</h2>
          <p className="content-subtitle">Liberty Mills Limited • Water, Natural Gas, Compressed Air & Nitrogen Plant</p>
        </div>
        <div className="header-actions-group">
          <span className="badge-tag green">ALL UTILITY SYSTEMS STABLE</span>
          <button className="btn-export">Export Utility Audit</button>
        </div>
      </div>

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">NATURAL GAS FLOW</span>
            <span className="metric-badge green">SSGC SUPPLY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">3,240</span>
            <span className="metric-unit">m³/h</span>
          </div>
          <div className="metric-footer">
            Supply pressure: 45 PSI • Caloric val: 950 BTU/ft³
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">COMPRESSED AIR HEADER</span>
            <span className="metric-badge green">CONSTANT</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">7.25</span>
            <span className="metric-unit">Bar</span>
          </div>
          <div className="metric-footer">
            Total Flow: 4,800 CFM • 3 Compressors
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">RAW WATER INTAKE</span>
            <span className="metric-badge normal">DEEP WELLS</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">142</span>
            <span className="metric-unit">m³/h</span>
          </div>
          <div className="metric-footer">
            3 Deep well turbine pumps active
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">NITROGEN PURITY</span>
            <span className="metric-badge green">PSA PLANT</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">99.9</span>
            <span className="metric-unit">% N₂</span>
          </div>
          <div className="metric-footer">
            Used for dye vat blanketing &amp; laboratory
          </div>
        </div>
      </div>
    </div>
  );
};
