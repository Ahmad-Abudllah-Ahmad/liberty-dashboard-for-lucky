import React, { useMemo, useState } from 'react';
import { ScadaContentHeader } from '../portal/ScadaContentHeader';
import { formatNumber, wobble } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';

type StenterKey = 'STN-24' | 'STN-21' | 'STN-18';

const stentersMeta: Record<
  StenterKey,
  {
    name: string;
    fabric: string;
    speed: number;
    entryMoisture: number;
    exitMoisture: number;
    targetMoisture: number;
    tolerance: string;
    chambers: number[];
    setpoints: number[];
    exhaustHumidity: number;
    status: string;
  }
> = {
  'STN-24': {
    name: 'Stenter-24 (Monforts 10-Chamber)',
    fabric: '100% Combed Cotton Satin 140 GSM (Width: 240 cm)',
    speed: 48.5,
    entryMoisture: 52.4,
    exitMoisture: 4.8,
    targetMoisture: 5.0,
    tolerance: '±0.5%',
    chambers: [175, 180, 182, 183, 182, 180, 178, 175, 170, 160],
    setpoints: [175, 180, 182, 180, 182, 180, 178, 175, 170, 155],
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
    setpoints: [165, 170, 175, 175, 175, 172, 168, 160],
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
    setpoints: [170, 172, 175, 178, 178, 175, 170, 162],
    exhaustHumidity: 82,
    status: 'WARNING: OVER-DRYING',
  },
};

function chamberColor(temp: number): string {
  if (temp > 180) return '#ef4444';
  if (temp > 170) return '#f59e0b';
  return '#3b82f6';
}

function zoneLabel(index: number, total: number): string {
  if (index === 0) return 'Entry';
  if (index === total - 1) return 'Exit';
  return 'Dry';
}

export const MoistureDashboard: React.FC = () => {
  const [selectedStenter, setSelectedStenter] = useState<StenterKey>('STN-24');
  const tick = useTelemetryTick();

  const meta = stentersMeta[selectedStenter];
  const chamberCount = meta.chambers.length;

  const liveChambers = useMemo(
    () =>
      meta.chambers.map((base, index) =>
        Number(wobble(base, tick, 1.4, index + 1).toFixed(1)),
      ),
    [meta.chambers, tick],
  );

  const liveExitMoisture = Number(wobble(meta.exitMoisture, tick, 0.08, 12).toFixed(2));
  const liveEntryMoisture = Number(wobble(meta.entryMoisture, tick, 0.15, 11).toFixed(1));
  const liveSpeed = Number(wobble(meta.speed, tick, 0.35, 8).toFixed(1));
  const liveExhaust = Number(wobble(meta.exhaustHumidity, tick, 0.6, 13).toFixed(0));

  const gridClass = chamberCount >= 10 ? 'cols-10-strip' : 'cols-8-strip';

  return (
    <div className="dashboard-content">
      <ScadaContentHeader
        title="Fabric Moisture Telemetry & Stenter Regulation"
        subtitle="Liberty Mills Limited • Online Mahlo Radiometric Fabric Moisture Control"
        actions={
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
        }
      />

      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">FABRIC EXIT MOISTURE</span>
            <span className={`metric-badge ${liveExitMoisture < 4.5 ? 'yellow' : 'green'}`}>
              {liveExitMoisture < 4.5 ? 'WARNING' : 'ON TARGET'}
            </span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{liveExitMoisture}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-footer">
            Target: {meta.targetMoisture}% • Tol: {meta.tolerance}
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PAD MANGLE ENTRY MOISTURE</span>
            <span className="metric-badge blue">ENTRY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{liveEntryMoisture}</span>
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
            <span className="metric-number">{liveSpeed}</span>
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
            <span className="metric-number">{liveExhaust}</span>
            <span className="metric-unit">g/kg</span>
          </div>
          <div className="metric-footer">
            Damper Opening: 68% • Heat Exchanger: 82%
          </div>
        </div>
      </div>

      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>{meta.name} • Thermal Chamber Temperature Gradient Profile</h3>
          <span className="badge-tag">{meta.fabric}</span>
        </div>

        <div className="stenter-chamber-flow">
          <span>Entry</span>
          <i>→</i>
          <span>Drying zones</span>
          <i>→</i>
          <span>Exit</span>
        </div>

        <div className={`stenter-zone-grid ${gridClass}`}>
          {liveChambers.map((temp, idx) => {
            const set = meta.setpoints[idx] ?? temp;
            const delta = temp - set;
            const color = chamberColor(temp);
            return (
              <div
                key={idx}
                className="stenter-zone-tile"
                tabIndex={0}
                style={{ borderTopColor: color }}
              >
                <div className="stenter-zone-tip">
                  Set: {formatNumber(set, 1)} °C · Δ {delta >= 0 ? '+' : ''}
                  {formatNumber(delta, 1)} °C · Fan {1450 + idx * 12} RPM
                </div>
                <span className="stenter-zone-num">Zone {idx + 1}</span>
                <span className="stenter-zone-temp font-mono">{temp}°</span>
                <div className="stenter-zone-meter" aria-hidden>
                  <div
                    className="stenter-zone-meter-fill"
                    style={{
                      width: `${Math.min(100, (temp / 200) * 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="stenter-zone-role">{zoneLabel(idx, chamberCount)}</span>
              </div>
            );
          })}
        </div>

        <div className="chamber-legend-bar">
          <span>Target Moisture: <strong>{meta.targetMoisture}%</strong></span>
          <span>Actual Moisture: <strong>{liveExitMoisture}%</strong></span>
          <span>Line Status: <strong>{meta.status}</strong></span>
          <span>Moisture Sensor: <strong>Mahlo Textometer RMS-12</strong></span>
        </div>
      </div>

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
              <span className="loop-val font-mono">{(liveExitMoisture - meta.targetMoisture).toFixed(2)} %</span>
            </div>
            <div className="loop-card">
              <span className="loop-lbl">PID Loop Output</span>
              <span className="loop-val font-mono">0.0 m/min trim</span>
            </div>
            <div className="loop-card">
              <span className="loop-lbl">Circulation Fans</span>
              <span className="loop-val font-mono">{chamberCount} Units @ 1,450 RPM</span>
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
            <div><span className="b-lbl">Finished Width:</span> <strong>240 cm (94.5&quot;)</strong></div>
            <div><span className="b-lbl">Chemical Finish:</span> <strong>Easy Care Resin + Softener</strong></div>
            <div><span className="b-lbl">Shift Production:</span> <strong>18,450 meters</strong></div>
            <div><span className="b-lbl">Shift Leader:</span> <strong>M. Tariq</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
