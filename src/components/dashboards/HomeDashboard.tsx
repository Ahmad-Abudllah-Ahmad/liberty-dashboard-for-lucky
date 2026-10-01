import React, { useState } from 'react';
import { mockMachines } from '../../data/mockPlantData';
import {
  IconDashboard,
  IconPrinting,
  IconDyeing,
  IconAlarms,
} from '../Icons';

interface HomeDashboardProps {
  onNavigate: (id: string, breadcrumb: string) => void;
  unacknowledgedAlarmsCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  unacknowledgedAlarmsCount,
}) => {
  const [viewMode, setViewMode] = useState<'standard' | 'overview'>('standard');

  return (
    <div className="dashboard-content home-view-container">
      {/* View Mode Bar */}
      <div className="home-top-toolbar">
        <div className="plant-quick-badge">
          <span className="live-pulse"></span>
          <span className="plant-name-badge">LIBERTY MILLS LIMITED</span>
          <span className="plant-tagline">Central SCADA & Industrial Monitoring Portal</span>
          <span className="plant-status-pill">SYS OPERATIONAL 100%</span>
        </div>

        <div className="view-toggle-group">
          <button
            className={`btn-toggle-view ${viewMode === 'standard' ? 'active' : ''}`}
            onClick={() => setViewMode('standard')}
          >
            Clean Canvas View
          </button>
          <button
            className={`btn-toggle-view ${viewMode === 'overview' ? 'active' : ''}`}
            onClick={() => setViewMode('overview')}
          >
            Plant SCADA Overview
          </button>
        </div>
      </div>

      {viewMode === 'standard' ? (
        /* The exact white canvas workspace card as shown in the user's screenshot */
        <div className="clean-home-card">
          <div className="clean-card-header">
            <div className="clean-card-title">
              <span className="clean-card-icon">⚡</span>
              <div>
                <h2>Liberty Mills Operations Center</h2>
                <p>Welcome to Liberty Mills Industrial Telemetry & Energy Management System</p>
              </div>
            </div>
            <div className="clean-card-actions">
              <button
                className="btn-primary-action"
                onClick={() => onNavigate('energy-dashboard', 'Dashboard / Energy Dashboard')}
              >
                View Energy Dashboard →
              </button>
            </div>
          </div>

          <div className="quick-access-strip">
            <div
              className="quick-card"
              onClick={() => onNavigate('energy-dashboard', 'Dashboard / Energy Dashboard')}
            >
              <div className="quick-card-icon energy-bg">
                <IconDashboard size={22} />
              </div>
              <div className="quick-card-body">
                <span className="quick-card-label">Total Load</span>
                <span className="quick-card-val">14,820 kW</span>
                <span className="quick-card-sub text-green">PF: 0.98 (Optimal)</span>
              </div>
            </div>

            <div
              className="quick-card"
              onClick={() => onNavigate('steam-flow', 'Dashboard / Steam Flow')}
            >
              <div className="quick-card-icon steam-bg">💨</div>
              <div className="quick-card-body">
                <span className="quick-card-label">Steam Flow</span>
                <span className="quick-card-val">42.5 TPH</span>
                <span className="quick-card-sub text-blue">10.2 Bar Header</span>
              </div>
            </div>

            <div
              className="quick-card"
              onClick={() => onNavigate('printing-live', 'Printing / Live Monitoring')}
            >
              <div className="quick-card-icon print-bg">
                <IconPrinting size={22} />
              </div>
              <div className="quick-card-body">
                <span className="quick-card-label">Printing Lines</span>
                <span className="quick-card-val">Stenter-24 Active</span>
                <span className="quick-card-sub text-green">48.5 m/min</span>
              </div>
            </div>

            <div
              className="quick-card"
              onClick={() => onNavigate('dyeing-live', 'Dyeing / Live Monitoring')}
            >
              <div className="quick-card-icon dye-bg">
                <IconDyeing size={22} />
              </div>
              <div className="quick-card-body">
                <span className="quick-card-label">Dyeing Vessels</span>
                <span className="quick-card-val">8 Batches In Run</span>
                <span className="quick-card-sub text-purple">98.1% Efficiency</span>
              </div>
            </div>

            <div
              className="quick-card"
              onClick={() => onNavigate('alarms', 'Alarms')}
            >
              <div className="quick-card-icon alarm-bg">
                <IconAlarms size={22} />
              </div>
              <div className="quick-card-body">
                <span className="quick-card-label">Active Alarms</span>
                <span className="quick-card-val text-red">140 Alarms</span>
                <span className="quick-card-sub text-red">{unacknowledgedAlarmsCount} Unacknowledged</span>
              </div>
            </div>
          </div>

          {/* Plant Shortcuts Grid */}
          <div className="home-sections-grid">
            <div className="home-section-tile" onClick={() => onNavigate('energy-dashboard', 'Dashboard / Energy Dashboard')}>
              <div className="tile-header">
                <span className="tile-icon">⚡</span>
                <h4>Energy Dashboard</h4>
              </div>
              <p>Real-time electrical telemetry, active/reactive power, harmonics, phase voltages & demand curves.</p>
              <span className="tile-link">Open Dashboard →</span>
            </div>

            <div className="home-section-tile" onClick={() => onNavigate('steam-flow', 'Dashboard / Steam Flow')}>
              <div className="tile-header">
                <span className="tile-icon">💨</span>
                <h4>Steam Distribution</h4>
              </div>
              <p>Boiler generation vs department consumption (Printing, Dyeing, Stenters, Finishing mills).</p>
              <span className="tile-link">Open Dashboard →</span>
            </div>

            <div className="home-section-tile" onClick={() => onNavigate('moisture', 'Dashboard / Moisture')}>
              <div className="tile-header">
                <span className="tile-icon">💧</span>
                <h4>Stenter Moisture</h4>
              </div>
              <p>Fabric entry/exit moisture % telemetry across Stenter-24, Stenter-21, and Monforts drying frames.</p>
              <span className="tile-link">Open Dashboard →</span>
            </div>

            <div className="home-section-tile" onClick={() => onNavigate('panel-temperature', 'Dashboard / Panel Temperature')}>
              <div className="tile-header">
                <span className="tile-icon">🌡️</span>
                <h4>Panel Temperature</h4>
              </div>
              <p>Thermal infrared probe monitoring for LT panels, HT switchgear, busbar joints & capacitor banks.</p>
              <span className="tile-link">Open Dashboard →</span>
            </div>

            <div className="home-section-tile" onClick={() => onNavigate('boilers', 'Boilers')}>
              <div className="tile-header">
                <span className="tile-icon">🔥</span>
                <h4>Boiler House SCADA</h4>
              </div>
              <p>Boiler #1, #2 & WHRB heat recovery, steam drum levels, flue gas O2 combustion efficiency.</p>
              <span className="tile-link">Open Dashboard →</span>
            </div>

            <div className="home-section-tile" onClick={() => onNavigate('solarpv', 'SolarPV')}>
              <div className="tile-header">
                <span className="tile-icon">☀️</span>
                <h4>3.5 MWp Solar PV</h4>
              </div>
              <p>Rooftop solar generation, string inverter health, daily yield MWh, carbon offsets.</p>
              <span className="tile-link">Open Dashboard →</span>
            </div>
          </div>
        </div>
      ) : (
        /* SCADA Overview with full plant live statistics */
        <div className="overview-scada-container">
          <div className="kpi-banner-grid">
            <div className="kpi-stat-card">
              <span className="kpi-label">TOTAL PLANT POWER</span>
              <div className="kpi-val-row">
                <span className="kpi-val">14.82</span>
                <span className="kpi-unit">MW</span>
              </div>
              <div className="kpi-bar-wrapper">
                <div className="kpi-bar-fill" style={{ width: '74%' }}></div>
              </div>
              <span className="kpi-footer-note">Grid: 4.2 MW • Genset: 7.6 MW • Solar: 3.0 MW</span>
            </div>

            <div className="kpi-stat-card">
              <span className="kpi-label">STEAM GENERATION</span>
              <div className="kpi-val-row">
                <span className="kpi-val">42.50</span>
                <span className="kpi-unit">TPH</span>
              </div>
              <div className="kpi-bar-wrapper">
                <div className="kpi-bar-fill steam-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="kpi-footer-note">Boiler 1: 18.2 • Boiler 2: 16.8 • WHRB: 7.5 TPH</span>
            </div>

            <div className="kpi-stat-card">
              <span className="kpi-label">DAILY PRODUCTION</span>
              <div className="kpi-val-row">
                <span className="kpi-val">184,520</span>
                <span className="kpi-unit">Meters</span>
              </div>
              <div className="kpi-bar-wrapper">
                <div className="kpi-bar-fill prod-fill" style={{ width: '92%' }}></div>
              </div>
              <span className="kpi-footer-note">Target: 200,000 m (92.3% of Shift Quota)</span>
            </div>

            <div className="kpi-stat-card">
              <span className="kpi-label">PLANT WATER BALANCE</span>
              <div className="kpi-val-row">
                <span className="kpi-val">2,150</span>
                <span className="kpi-unit">m³/day</span>
              </div>
              <div className="kpi-bar-wrapper">
                <div className="kpi-bar-fill water-fill" style={{ width: '68%' }}></div>
              </div>
              <span className="kpi-footer-note">RO Permeate: 78% Recovery • ETP: Normal NEQS</span>
            </div>
          </div>

          {/* Machine Live Telemetry Table */}
          <div className="plant-machines-card">
            <div className="card-top-bar">
              <h3>Live Finishing & Printing Machines Telemetry</h3>
              <span className="badge-live-feed">Real-time SCADA Feeds Active</span>
            </div>
            <div className="table-responsive">
              <table className="scada-table">
                <thead>
                  <tr>
                    <th>Machine ID</th>
                    <th>Type & Description</th>
                    <th>Status</th>
                    <th>Current Speed</th>
                    <th>Active Job Card</th>
                    <th>Operator</th>
                    <th>Chamber Temp</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMachines.map((m) => (
                    <tr key={m.id}>
                      <td className="font-mono"><strong>{m.id}</strong></td>
                      <td>{m.name}</td>
                      <td>
                        <span className={`status-tag ${m.status}`}>
                          <span className="dot"></span> {m.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="font-mono">{m.speed}</td>
                      <td className="font-sub">{m.jobCard}</td>
                      <td>{m.operator}</td>
                      <td className="font-mono">{m.temperature} °C</td>
                      <td>
                        <div className="eff-cell">
                          <span className="font-mono">{m.efficiency}%</span>
                          <div className="eff-bar">
                            <div className="eff-bar-inner" style={{ width: `${m.efficiency}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
