import React, { useState } from 'react';
import { processingMachines, machineValue } from '../../data/processingMachines';
import { MachineSelect } from './MachineSelect';

export const SteamFlowDashboard: React.FC = () => {
  const [machineId, setMachineId] = useState(processingMachines[0].id);
  const machine = processingMachines.find((item) => item.id === machineId) ?? processingMachines[0];
  const boilerOne = machineValue(machine.id, 18.2, 6);
  const boilerTwo = machineValue(machine.id, 16.8, 5);
  const recovery = machineValue(machine.id, 7.5, 3);
  const total = Number((boilerOne + boilerTwo + recovery).toFixed(2));
  const pressure = machineValue(machine.id, 10.24, 0.8, 2);
  const headerTemp = machineValue(machine.id, 184.2, 4);
  const recoveryPct = machineValue(machine.id, 78.4, 8);
  const machineFlow = machineValue(machine.id, 12.4, 8);
  const machineShare = Math.min(68, Math.max(12, Number(((machineFlow / total) * 100).toFixed(1))));

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Steam Flow & Thermal Energy Distribution</h2>
        </div>
        <div className="header-actions-group">
          <MachineSelect value={machine.id} onChange={setMachineId} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL STEAM GENERATION</span>
            <span className="metric-badge green">NORMAL</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{total.toFixed(2)}</span>
            <span className="metric-unit">TPH</span>
          </div>
          <div className="metric-footer">
            Boiler 1: {boilerOne} • Boiler 2: {boilerTwo} • WHRB: {recovery} TPH
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MAIN HEADER PRESSURE</span>
            <span className="metric-badge green">STABLE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{pressure.toFixed(2)}</span>
            <span className="metric-unit">Bar</span>
          </div>
          <div className="metric-footer">
            Setpoint: 10.00 Bar • Safety Relief: 12.50 Bar
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">STEAM HEADER TEMP</span>
            <span className="metric-badge normal">SATURATED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{headerTemp.toFixed(1)}</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Saturation: 181.1°C • Superheat: +3.1°C
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">CONDENSATE RECOVERY</span>
            <span className="metric-badge green">HIGH EFFICIENCY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{recoveryPct.toFixed(1)}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">
            Return Temp: 88.5°C • Fuel Saving: PKR 480k/day
          </div>
        </div>
      </div>

      {/* Steam Flow Generation & Consumers */}
      <div className="scada-two-col">
        {/* Steam Generation Units */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Steam Generation Sources</h3>
            <span className="badge-tag">3 Operating Units</span>
          </div>

          <div className="sources-breakdown">
            <div className="boiler-unit-row">
              <div className="b-header">
                <div>
                  <strong>Boiler #1 (Gas / Dual-Fuel Firetube)</strong>
                  <span className="b-sub">Rated: 25 TPH • Natural Gas 1,420 m³/h</span>
                </div>
                <span className="badge-status-running">RUNNING</span>
              </div>
              <div className="b-metrics-grid">
                <div><span>Flow Rate:</span> <strong className="font-mono">{boilerOne} TPH</strong></div>
                <div><span>Pressure:</span> <strong className="font-mono">10.4 Bar</strong></div>
                <div><span>Stack Temp:</span> <strong className="font-mono">152 °C</strong></div>
                <div><span>O₂ Excess:</span> <strong className="font-mono">3.4%</strong></div>
              </div>
            </div>

            <div className="boiler-unit-row">
              <div className="b-header">
                <div>
                  <strong>Boiler #2 (Multi-Fuel Water-tube)</strong>
                  <span className="b-sub">Rated: 30 TPH • Biomass & Gas</span>
                </div>
                <span className="badge-status-running">RUNNING</span>
              </div>
              <div className="b-metrics-grid">
                <div><span>Flow Rate:</span> <strong className="font-mono">{boilerTwo} TPH</strong></div>
                <div><span>Pressure:</span> <strong className="font-mono">10.3 Bar</strong></div>
                <div><span>Stack Temp:</span> <strong className="font-mono">164 °C</strong></div>
                <div><span>O₂ Excess:</span> <strong className="font-mono">3.8%</strong></div>
              </div>
            </div>

            <div className="boiler-unit-row">
              <div className="b-header">
                <div>
                  <strong>WHRB (Waste Heat Recovery Boiler)</strong>
                  <span className="b-sub">Jenbacher Genset Exhaust Recovery</span>
                </div>
                <span className="badge-status-running">OPTIMAL RECOVERY</span>
              </div>
              <div className="b-metrics-grid">
                <div><span>Flow Rate:</span> <strong className="font-mono">{recovery} TPH</strong></div>
                <div><span>Pressure:</span> <strong className="font-mono">9.8 Bar</strong></div>
                <div><span>Inlet Gas:</span> <strong className="font-mono">485 °C</strong></div>
                <div><span>Outlet Gas:</span> <strong className="font-mono">142 °C</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Consumers */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Departmental Steam Consumers</h3>
            <span className="badge-tag">Total: {total.toFixed(1)} TPH</span>
          </div>

          <div className="consumer-list">
            <div className="consumer-item">
              <div className="consumer-header">
                <span className="c-name">{machine.name}</span>
                <span className="c-flow font-mono">{machineFlow.toFixed(1)} TPH ({machineShare}%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill dye-fill" style={{ width: `${machineShare}%` }}></div>
              </div>
            </div>

            <div className="consumer-item">
              <div className="consumer-header">
                <span className="c-name">Stenter Finishing Frames (Stenter-24, Stenter-21)</span>
                <span className="c-flow font-mono">11.6 TPH (27.5%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill stenter-fill" style={{ width: '27.5%' }}></div>
              </div>
            </div>

            <div className="consumer-item">
              <div className="consumer-header">
                <span className="c-name">Printing Mill (Loop Steam Agers, Dryers)</span>
                <span className="c-flow font-mono">9.4 TPH (22.3%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill print-fill" style={{ width: '22.3%' }}></div>
              </div>
            </div>

            <div className="consumer-item">
              <div className="consumer-header">
                <span className="c-name">Desizing, Bleaching & Mercerizing</span>
                <span className="c-flow font-mono">3.3 TPH (7.9%)</span>
              </div>
              <div className="source-bar">
                <div className="source-fill other-fill" style={{ width: '7.9%' }}></div>
              </div>
            </div>
          </div>

          <div className="steam-safety-card">
            <h4>Steam Safety & Enthalpy Efficiency</h4>
            <div className="safety-grid">
              <div><span>Steam/Gas Ratio:</span> <strong>12.8 kg/m³</strong></div>
              <div><span>Feedwater Temp:</span> <strong>104.5 °C</strong></div>
              <div><span>Deaerator Pressure:</span> <strong>0.35 Bar</strong></div>
              <div><span>Blowdown TDS:</span> <strong>2,480 ppm</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
