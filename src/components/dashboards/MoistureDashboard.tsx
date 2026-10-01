import React, { useState } from 'react';

export const MoistureDashboard: React.FC = () => {
  const [selectedStenter, setSelectedStenter] = useState<'STN-24' | 'STN-21' | 'STN-18'>('STN-24');

  const stentersData = {
    'STN-24': {
      name: 'Stenter-24 (Monforts 10-Chamber)',
      fabric: '100% Combed Cotton Satin 140 GSM (Width: 240 cm)',
      speed: 48.5,
      entryMoisture: 52.4,
      exitMoisture: 4.8,
      targetMoisture: 5.0,
      tolerance: '±0.5%',
      chambers: [175, 180, 182, 183, 182, 180, 178, 175, 170, 160],
      exhaustHumidity: 88,
      status: 'OPTIMAL CONTROL',
    },
    'STN-21': {
      name: 'Stenter-21 (Bruckner 8-Chamber)',
      fabric: 'Poly-Cotton 65/35 Sheeting 125 GSM (Width: 260 cm)',
      speed: 55.0,
      entryMoisture: 48.0,
      exitMoisture: 5.2,
      targetMoisture: 5.0,
      tolerance: '±0.5%',
      chambers: [160, 168, 172, 175, 175, 172, 168, 155],
      exhaustHumidity: 74,
      status: 'OPTIMAL CONTROL',
    },
    'STN-18': {
      name: 'Stenter-18 (Monforts 8-Chamber)',
      fabric: 'Linen Blend Curtain Fabric 220 GSM (Width: 280 cm)',
      speed: 38.0,
      entryMoisture: 58.2,
      exitMoisture: 4.2,
      targetMoisture: 4.8,
      tolerance: '±0.5%',
      chambers: [165, 170, 175, 178, 178, 175, 170, 160],
      exhaustHumidity: 82,
      status: 'WARNING: OVER-DRYING',
    },
  };

  const current = stentersData[selectedStenter];

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Fabric Moisture Telemetry & Stenter Regulation</h2>
          <p className="content-subtitle">Liberty Mills Limited • Online Mahlo Radiometric Fabric Moisture Control</p>
        </div>
        <div className="header-actions-group">
          <div className="btn-group-pill">
            <button
              className={`btn-pill ${selectedStenter === 'STN-24' ? 'active' : ''}`}
              onClick={() => setSelectedStenter('STN-24')}
            >
              Stenter-24 (Active)
            </button>
            <button
              className={`btn-pill ${selectedStenter === 'STN-21' ? 'active' : ''}`}
              onClick={() => setSelectedStenter('STN-21')}
            >
              Stenter-21
            </button>
            <button
              className={`btn-pill ${selectedStenter === 'STN-18' ? 'active' : ''}`}
              onClick={() => setSelectedStenter('STN-18')}
            >
              Stenter-18
            </button>
          </div>
        </div>
      </div>

      {/* Moisture KPIs */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">FABRIC EXIT MOISTURE</span>
            <span className={`metric-badge ${current.exitMoisture < 4.5 ? 'yellow' : 'green'}`}>
              {current.exitMoisture < 4.5 ? 'WARNING' : 'ON TARGET'}
            </span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.exitMoisture}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">
            Target: {current.targetMoisture}% • Tol: {current.tolerance}
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PAD MANGLE ENTRY MOISTURE</span>
            <span className="metric-badge blue">ENTRY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.entryMoisture}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">
            Mangle Nip Pressure: 3.4 Bar • Liquor Pick-up: 62%
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">LINE RUNNING SPEED</span>
            <span className="metric-badge green">AUTO REGULATING</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.speed}</span>
            <span className="metric-unit">m/min</span>
          </div>
          <div className="metric-footer">
            VFD Drive: 48.5 Hz • Weft Straightener: Active
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">EXHAUST AIR HUMIDITY</span>
            <span className="metric-badge normal">ECO-EXHAUST</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.exhaustHumidity}</span>
            <span className="metric-unit">g/kg</span>
          </div>
          <div className="metric-footer">
            Damper Opening: 68% • Heat Exchanger: 82%
          </div>
        </div>
      </div>

      {/* Machine & Chamber Profile */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>{current.name} • Thermal Chamber Temperature Gradient Profile</h3>
          <span className="badge-tag">{current.fabric}</span>
        </div>

        <div className="chamber-grid">
          {current.chambers.map((temp, idx) => (
            <div key={idx} className="chamber-box">
              <span className="ch-num">Zone {idx + 1}</span>
              <span className="ch-temp font-mono">{temp} °C</span>
              <div className="ch-bar-wrap">
                <div
                  className="ch-bar-fill"
                  style={{
                    height: `${(temp / 200) * 100}%`,
                    backgroundColor: temp > 180 ? '#ef4444' : temp > 170 ? '#f59e0b' : '#3b82f6',
                  }}
                ></div>
              </div>
              <span className="ch-type">{idx === 0 ? 'Entry' : idx === current.chambers.length - 1 ? 'Exit' : 'Dry'}</span>
            </div>
          ))}
        </div>

        <div className="chamber-legend-bar">
          <span>Target Moisture: <strong>{current.targetMoisture}%</strong></span>
          <span>Actual Moisture: <strong>{current.exitMoisture}%</strong></span>
          <span>Moisture Sensor: <strong>Mahlo Textometer RMS-12</strong></span>
          <span>Weft Straightening: <strong>Orthomat RFMC-12 Online</strong></span>
        </div>
      </div>

      {/* Closed-loop Moisture Control Simulation */}
      <div className="scada-two-col">
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Closed-Loop Speed vs Moisture Regulation</h3>
          </div>
          <p className="panel-note">
            When fabric moisture rises above 5.5%, stenter line speed automatically trims down by 1.2 m/min.
            When moisture drops below 4.5% (energy waste / fabric brittleness), speed automatically accelerates.
          </p>
          <div className="loop-status-grid">
            <div className="loop-card">
              <span className="loop-lbl">Moisture Error</span>
              <span className="loop-val font-mono">{(current.exitMoisture - current.targetMoisture).toFixed(2)} %</span>
            </div>
            <div className="loop-card">
              <span className="loop-lbl">PID Loop Output</span>
              <span className="loop-val font-mono">0.0 m/min trim</span>
            </div>
            <div className="loop-card">
              <span className="loop-lbl">Circulation Fans</span>
              <span className="loop-val font-mono">10 Units @ 1,450 RPM</span>
            </div>
          </div>
        </div>

        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Fabric Batch Specifications</h3>
          </div>
          <div className="batch-spec-grid">
            <div><span className="b-lbl">Job Card #:</span> <strong>JC-LML-2026-9481</strong></div>
            <div><span className="b-lbl">Fabric Sort:</span> <strong>Satin 40x40 / 140x80</strong></div>
            <div><span className="b-lbl">Finished Width:</span> <strong>240 cm (94.5")</strong></div>
            <div><span className="b-lbl">Chemical Finish:</span> <strong>Easy Care Resin + Softener</strong></div>
            <div><span className="b-lbl">Shift Production:</span> <strong>18,450 meters</strong></div>
            <div><span className="b-lbl">Shift Leader:</span> <strong>M. Tariq</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
