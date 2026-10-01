import React from 'react';
import { ShareBarChart, TrendSpark } from '../charts/PortalCharts';
import { ScadaContentHeader } from '../portal/ScadaContentHeader';
import { formatNumber, wobble } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';

export const SteamFlowDashboard: React.FC = () => {
  const tick = useTelemetryTick();
  const total = wobble(42.5, tick, 0.35, 1);
  const pressure = wobble(10.24, tick, 0.04, 2);
  const temp = wobble(184.2, tick, 0.25, 3);
  const condensate = wobble(78.4, tick, 0.3, 4);
  const b1 = wobble(18.2, tick, 0.15, 5);
  const b2 = wobble(16.8, tick, 0.15, 6);
  const whrb = wobble(7.5, tick, 0.1, 7);
  const dyeing = wobble(17.8, tick, 0.2, 8);
  const stenter = wobble(11.6, tick, 0.15, 9);
  const printing = wobble(9.4, tick, 0.12, 10);
  const bleach = wobble(3.3, tick, 0.08, 11);
  const consumerTotal = dyeing + stenter + printing + bleach;
  const trend = Array.from({ length: 24 }, (_, index) => wobble(42.2, tick + index, 0.8, index));

  return (
    <div className="dashboard-content">
      <ScadaContentHeader
        title="Steam Flow & Thermal Energy Distribution"
        subtitle="Liberty Mills Limited • Central Steam Headers, Boilers & Process Lines"
        actions={
          <>
            <span className="badge-tag green">STEAM BALANCE: BALANCED (±0.4%)</span>
            <button type="button" className="btn-export">Export Enthalpy Report</button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL STEAM GENERATION</span>
            <span className="metric-badge green">NORMAL</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{formatNumber(total)}</span>
            <span className="metric-unit">TPH</span>
          </div>
          <div className="metric-footer">
            Boiler 1: {formatNumber(b1, 1)} • Boiler 2: {formatNumber(b2, 1)} • WHRB: {formatNumber(whrb, 1)} TPH
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MAIN HEADER PRESSURE</span>
            <span className="metric-badge green">STABLE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{formatNumber(pressure)}</span>
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
            <span className="metric-number">{formatNumber(temp, 1)}</span>
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
            <span className="metric-number">{formatNumber(condensate, 1)}</span>
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
          <TrendSpark points={trend} color="#2563eb" unit="TPH" />

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
                <div><span>Flow Rate:</span> <strong className="font-mono">{formatNumber(b1, 1)} TPH</strong></div>
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
                <div><span>Flow Rate:</span> <strong className="font-mono">{formatNumber(b2, 1)} TPH</strong></div>
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
                <div><span>Flow Rate:</span> <strong className="font-mono">{formatNumber(whrb, 1)} TPH</strong></div>
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
            <span className="badge-tag">Total: {formatNumber(consumerTotal, 1)} TPH</span>
          </div>

          <ShareBarChart
            layout="consumer"
            rows={[
              { label: "Dyeing House (Fong's, Thies, Jiggers)", value: dyeing, fillClass: 'dye-fill', unit: 'TPH' },
              { label: 'Stenter Finishing Frames (Stenter-24, Stenter-21)', value: stenter, fillClass: 'stenter-fill', unit: 'TPH' },
              { label: 'Printing Mill (Loop Steam Agers, Dryers)', value: printing, fillClass: 'print-fill', unit: 'TPH' },
              { label: 'Desizing, Bleaching & Mercerizing', value: bleach, fillClass: 'other-fill', unit: 'TPH' },
            ]}
          />

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
