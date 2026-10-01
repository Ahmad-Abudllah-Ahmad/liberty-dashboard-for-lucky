import React, { useState } from 'react';
import { LiveValue } from '../../lib/LiveTelemetry';

export const QualityParametersComparisonDashboard: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<string>('BLEACHING-01');
  const [activeSubTab, setActiveSubTab] = useState<string>('prod');
  const dateRange = '28-09-2026 to 29-09-2026';

  const machineOptions = [
    'BLEACHING-01',
    'PAD STEAM DYEING 01',
    'PAD STEAM DYEING 02',
    'PRINING UNIT MAIN',
    'REGGIANI-03',
    'REGGIANI-04',
    'REGGIANI-05',
    'REGGIANI-06',
    'STENTER-14 (NEW)',
    'STENTER-15 (NEW MONFORTS)',
    'STENTER-24',
    'FONGS-10 (600 KG)',
    'GAURNERI CALENDER',
    'Micro Sand 1 - Speed',
    'Micro Sand 2 - Speed',
  ];

  // Exact table columns from WhatsApp Image 2026-10-01 at 00.13.29 & 00.13.31:
  // Label | Tolerenc% | Set Value | Act. Value | Difference
  const parameterRows = [
    { label: 'Chemical Bath Temperature', tolerance: '±2.0%', setVal: '95.0 °C', actVal: '95.4 °C', diff: '+0.4 °C', status: 'pass' },
    { label: 'Main Steam Header Pressure', tolerance: '±5.0%', setVal: '4.50 Bar', actVal: '4.48 Bar', diff: '-0.02 Bar', status: 'pass' },
    { label: 'Running Line Speed', tolerance: '±3.0%', setVal: '50.0 m/min', actVal: '49.8 m/min', diff: '-0.2 m/min', status: 'pass' },
    { label: 'Fabric Padder Squeeze Pressure', tolerance: '±2.5%', setVal: '3.20 Bar', actVal: '3.18 Bar', diff: '-0.02 Bar', status: 'pass' },
    { label: 'Chemical Dosing Flow Rate (Caustic)', tolerance: '±4.0%', setVal: '120.0 L/h', actVal: '122.5 L/h', diff: '+2.5 L/h', status: 'pass' },
    { label: 'Hydrogen Peroxide (H2O2) Concentration', tolerance: '±3.0%', setVal: '35.0 g/L', actVal: '34.8 g/L', diff: '-0.2 g/L', status: 'pass' },
    { label: 'Fabric Moisture (Exit Sensor)', tolerance: '±0.5%', setVal: '5.0 %', actVal: '4.9 %', diff: '-0.1 %', status: 'pass' },
    { label: 'Washing Compartment #1 Temp', tolerance: '±2.0%', setVal: '85.0 °C', actVal: '85.6 °C', diff: '+0.6 °C', status: 'pass' },
    { label: 'Washing Compartment #2 Temp', tolerance: '±2.0%', setVal: '80.0 °C', actVal: '80.2 °C', diff: '+0.2 °C', status: 'pass' },
    { label: 'Washing Compartment #3 Temp', tolerance: '±2.0%', setVal: '70.0 °C', actVal: '69.5 °C', diff: '-0.5 °C', status: 'pass' },
    { label: 'Fresh Water Flow to Wash Boxes', tolerance: '±5.0%', setVal: '18.0 m³/h', actVal: '17.8 m³/h', diff: '-0.2 m³/h', status: 'pass' },
    { label: 'Dryer Chamber 1 Air Temperature', tolerance: '±2.0%', setVal: '135.0 °C', actVal: '136.2 °C', diff: '+1.2 °C', status: 'pass' },
  ];

  return (
    <div className="dashboard-content quality-comparison-container">
      {/* Header matching 10.252.1.247:8018/Comparision/7 */}
      <div className="content-header-row">
        <div>
          <h2>Quality Parameters Checks &amp; Machine Comparison</h2>
          <p className="content-subtitle">Liberty Mills Limited • Real-time Process Setpoint vs Actual Verification (10.252.1.247:8018/Comparision/7)</p>
        </div>
        <div className="header-actions-group">
          <div className="machine-selector-dropdown">
            <span className="font-sub">Machine: </span>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="select-machine"
            >
              {machineOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button className="btn-export">Export QC Report</button>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching WhatsApp Image 2026-10-01 at 00.13.28 */}
      <div className="comparison-subtabs-strip">
        <button
          className={`subtab-btn ${activeSubTab === 'prod' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('prod')}
        >
          📊 Utilities with Production
        </button>
        <button
          className={`subtab-btn ${activeSubTab === 'lot' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('lot')}
        >
          🏷️ Utilities with Lotwise Production
        </button>
        <button
          className={`subtab-btn ${activeSubTab === 'stop' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stop')}
        >
          ⏱️ Utilities with Stoppage
        </button>
        <button
          className={`subtab-btn ${activeSubTab === 'fb' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('fb')}
        >
          📋 FB Activity Log
        </button>
        <button
          className={`subtab-btn ${activeSubTab === 'eb' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('eb')}
        >
          ⚙️ EB Machine
        </button>
      </div>

      {/* Production & Utility Summary Bar */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL PRODUCTION</span>
            <span className="metric-badge green">RUNNING</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={28450} seed={1} amplitude={227.6000} digits={0} />
            <span className="metric-unit">Meters</span>
          </div>
          <div className="metric-footer">Shift Leader: Malik • Operator A</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">STEAM CONSUMED</span>
            <span className="metric-badge blue">ACCUMULATED</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={48.2} seed={2} amplitude={0.3856} digits={1} />
            <span className="metric-unit">Tons</span>
          </div>
          <div className="metric-footer">Specific Steam: 1.69 kg / meter</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">GAS CONSUMPTION</span>
            <span className="metric-badge normal">NATURAL GAS</span>
          </div>
          <div className="metric-body">
            <LiveValue className="metric-number" value={1840} seed={3} amplitude={14.7200} digits={0} />
            <span className="metric-unit">m³</span>
          </div>
          <div className="metric-footer">Burners modulated at 68%</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PARAMETER COMPLIANCE</span>
            <span className="metric-badge green">99.8% PASS</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">12 / 12</span>
            <span className="metric-unit">Checks</span>
          </div>
          <div className="metric-footer">All within tolerance set limits</div>
        </div>
      </div>

      {/* The Exact Table matching WhatsApp Image 2026-10-01 at 00.13.29 & 00.13.31 */}
      {/* Columns: Label | Tolerenc% | Set Value | Act. Value | Difference */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Quality Parameters Checks • {selectedMachine}</h3>
          <span className="badge-tag">Date: {dateRange}</span>
        </div>

        <div className="table-responsive">
          <table className="scada-table comparison-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Parameter Label</th>
                <th style={{ width: '15%' }}>Tolerenc%</th>
                <th style={{ width: '15%' }}>Set Value</th>
                <th style={{ width: '15%' }}>Act. Value</th>
                <th style={{ width: '15%' }}>Diffrence</th>
              </tr>
            </thead>
            <tbody>
              {parameterRows.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.label}</strong></td>
                  <td className="font-mono font-sub">{row.tolerance}</td>
                  <td className="font-mono text-muted">{row.setVal}</td>
                  <td className="font-mono font-bold">{row.actVal}</td>
                  <td className={`font-mono font-bold ${row.diff.startsWith('+') ? 'text-blue' : 'text-green'}`}>
                    {row.diff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
