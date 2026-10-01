import React, { useState } from 'react';

export const HeatExchangerSCADADashboard: React.FC = () => {
  const [selectedExchanger, setSelectedExchanger] = useState<string>('PHE-01');

  // Exact table columns from WhatsApp Image 2026-10-01 at 11.40.54: Label, Unit, Value
  const telemetryRows = [
    { label: 'Hot Side Inlet Temperature (T1_IN)', unit: '°C', value: '88.5' },
    { label: 'Hot Side Outlet Temperature (T1_OUT)', unit: '°C', value: '42.0' },
    { label: 'Cold Side Inlet Temperature (T2_IN)', unit: '°C', value: '28.0' },
    { label: 'Cold Side Outlet Temperature (T2_OUT)', unit: '°C', value: '74.2' },
    { label: 'Hot Stream Flow Rate (F1)', unit: 'm³/h', value: '65.4' },
    { label: 'Cold Water Flow Rate (F2)', unit: 'm³/h', value: '70.8' },
    { label: 'Heat Recovery Power (Q)', unit: 'kWth', value: '3,850' },
    { label: 'Log Mean Temperature Difference (LMTD)', unit: '°C', value: '11.4' },
    { label: 'Exchanger Overall Thermal Efficiency', unit: '%', value: '84.6' },
    { label: 'Hot Side Differential Pressure (dP1)', unit: 'Bar', value: '0.38' },
    { label: 'Cold Side Differential Pressure (dP2)', unit: 'Bar', value: '0.32' },
    { label: 'Modulating Control Valve Position', unit: '%', value: '78.5' },
    { label: 'Daily Energy Saved Equivalent (Gas)', unit: 'm³/day', value: '10,080' },
  ];

  return (
    <div className="dashboard-content heatexchanger-container">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Heat Exchanger Monitoring &amp; Thermal Energy Recovery</h2>
          <p className="content-subtitle">Liberty Mills Limited • Central Plate Heat Exchanger Telemetry (10.252.1.247:8018/heatexchanger)</p>
        </div>
        <div className="header-actions-group">
          <div className="btn-group-pill">
            <button className={`btn-pill ${selectedExchanger === 'PHE-01' ? 'active' : ''}`} onClick={() => setSelectedExchanger('PHE-01')}>
              PHE-01 (Dye House Drain)
            </button>
            <button className={`btn-pill ${selectedExchanger === 'PHE-02' ? 'active' : ''}`} onClick={() => setSelectedExchanger('PHE-02')}>
              PHE-02 (Stenter Exhaust)
            </button>
            <button className={`btn-pill ${selectedExchanger === 'PHE-03' ? 'active' : ''}`} onClick={() => setSelectedExchanger('PHE-03')}>
              PHE-03 (Boiler Blowdown)
            </button>
          </div>
          <button className="btn-export">Export SCADA Data</button>
        </div>
      </div>

      {/* Visual SCADA Schematic Diagram matching WhatsApp Image 2026-10-01 at 11.40.54 */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Plate Heat Exchanger (PHE) Dynamic Process Schematic</h3>
          <span className="badge-tag green">HEAT TRANSFER ACTIVE</span>
        </div>

        <div className="phe-schematic-wrapper">
          <div className="phe-pipe-column hot-side">
            <div className="pipe-badge hot-in">
              <span className="badge-lbl">Hot Drain In</span>
              <strong className="font-mono">88.5 °C</strong>
              <span className="flow-pill font-mono">65.4 m³/h</span>
            </div>
            <div className="pipe-line-graphic hot-flow-down">
              <span className="flow-bubble"></span>
              <span className="flow-bubble delay"></span>
            </div>
            <div className="pipe-badge hot-out">
              <span className="badge-lbl">Hot Drain Out</span>
              <strong className="font-mono">42.0 °C</strong>
              <span className="flow-pill font-mono">To ETP</span>
            </div>
          </div>

          {/* Central Plate Pack Graphic */}
          <div className="phe-plate-core">
            <div className="plate-fins-strip">
              <div className="fin hot"></div>
              <div className="fin cold"></div>
              <div className="fin hot"></div>
              <div className="fin cold"></div>
              <div className="fin hot"></div>
              <div className="fin cold"></div>
              <div className="fin hot"></div>
              <div className="fin cold"></div>
            </div>
            <div className="phe-core-label">
              <strong>ALFA LAVAL PHE PACK</strong>
              <span>Titanium Plates • 120 Channels</span>
              <div className="phe-core-stat font-mono">3,850 kWth Recovered</div>
            </div>
          </div>

          <div className="phe-pipe-column cold-side">
            <div className="pipe-badge cold-out">
              <span className="badge-lbl">Pre-heated Out</span>
              <strong className="font-mono text-green">74.2 °C</strong>
              <span className="flow-pill font-mono">To Boilers &amp; Wash</span>
            </div>
            <div className="pipe-line-graphic cold-flow-up">
              <span className="flow-bubble"></span>
              <span className="flow-bubble delay"></span>
            </div>
            <div className="pipe-badge cold-in">
              <span className="badge-lbl">Soft Water In</span>
              <strong className="font-mono">28.0 °C</strong>
              <span className="flow-pill font-mono">70.8 m³/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Exact Table matching WhatsApp Image 2026-10-01 at 11.40.54: Label | Unit | Value */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Heat Exchanger Telemetry Data</h3>
          <span className="badge-tag">Real-time Fieldbus Tags</span>
        </div>

        <div className="table-responsive">
          <table className="scada-table heatexchanger-table">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Label</th>
                <th style={{ width: '20%' }}>Unit</th>
                <th style={{ width: '20%' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {telemetryRows.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.label}</strong></td>
                  <td className="font-mono font-sub">{row.unit}</td>
                  <td className="font-mono font-bold text-blue">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
