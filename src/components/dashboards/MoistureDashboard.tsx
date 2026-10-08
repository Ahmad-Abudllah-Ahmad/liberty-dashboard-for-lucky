import React, { useMemo, useState } from 'react';
import { machineValue, processingMachines } from '../../data/processingMachines';
import { MachineSelect } from './MachineSelect';

const roundTo = (value: number, digits: number) => Number(value.toFixed(digits));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const MoistureDashboard: React.FC = () => {
  const [machineId, setMachineId] = useState(processingMachines.find((item) => item.category === 'Bleaching')?.id ?? processingMachines[0].id);
  const [dryStackSet, setDryStackSet] = useState('100');
  const machine = processingMachines.find((item) => item.id === machineId) ?? processingMachines[0];
  const isBleaching = machine.category === 'Bleaching';
  const parsedSet = Number(dryStackSet);
  const setPoint = dryStackSet.trim() !== '' && Number.isFinite(parsedSet) ? parsedSet : 100;
  const dryStackDelta = isBleaching ? setPoint - 100 : 0;
  const base = useMemo(() => {
    const zones = 6 + (machineValue(machine.id, 3, 4, 0) % 5);
    const chambers = Array.from({ length: zones }, (_, index) =>
      Math.round(machineValue(`${machine.id}-zone-${index}`, 172, 24, 0))
    );
    const exitMoisture = machineValue(machine.id, 5.1, 1.6, 1);
    return {
      name: machine.name,
      fabric: `${machine.category} line • Width ${machineValue(machine.id, 240, 40, 0)} cm`,
      speed: machineValue(machine.id, 46, 18, 1),
      entryMoisture: machineValue(machine.id, 52, 12, 1),
      exitMoisture,
      targetMoisture: 5.0,
      tolerance: '±0.5%',
      chambers,
      exhaustHumidity: machineValue(machine.id, 80, 16, 0),
      dryStack: machineValue(`${machine.id}-dry-stack`, 100, 4, 1),
      status: exitMoisture < 4.5 ? 'WARNING: OVER-DRYING' : 'OPTIMAL CONTROL',
    };
  }, [machine]);
  const current = {
    ...base,
    speed: roundTo(clamp(base.speed + dryStackDelta * 0.12, 8, 120), 1),
    entryMoisture: roundTo(clamp(base.entryMoisture - dryStackDelta * 0.03, 20, 80), 1),
    exitMoisture: roundTo(clamp(base.exitMoisture - dryStackDelta * 0.045, 0.4, 18), 1),
    exhaustHumidity: roundTo(clamp(base.exhaustHumidity + dryStackDelta * 0.25, 20, 160), 0),
    chambers: base.chambers.map((temp, index) => {
      const towardExit = index / Math.max(1, base.chambers.length - 1);
      return Math.round(clamp(temp + dryStackDelta * (0.2 + towardExit * 0.8), 90, 220));
    }),
    dryStack: roundTo(clamp(base.dryStack + dryStackDelta, 40, 180), 1),
  };
  const dryStackDifference = roundTo(current.dryStack - setPoint, 1);

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Fabric Moisture Telemetry & Stenter Regulation</h2>
          <p className="content-subtitle">Lucky Textile • {machine.category} • {machine.name}</p>
        </div>
        <div className="header-actions-group">
          <MachineSelect value={machine.id} onChange={setMachineId} />
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
            VFD Drive: {current.speed} Hz • Weft Straightener: Active
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

        {isBleaching && (
          <div className="scada-metric-card">
            <div className="metric-header">
              <span className="metric-title">DRY STACK TEMPERATURE</span>
              <span className={`metric-badge ${Math.abs(dryStackDifference) > 3 ? 'yellow' : 'green'}`}>
                {Math.abs(dryStackDifference) > 3 ? 'OFF SET' : 'ON SET'}
              </span>
            </div>
            <div className="metric-body">
              <span className="metric-number">{current.dryStack.toFixed(1)}</span>
              <span className="metric-unit">°C</span>
            </div>
            <div className="metric-footer">
              Set{' '}
              <input
                className="tag-set-input"
                type="number"
                value={dryStackSet}
                aria-label="Dry stack set temperature"
                onChange={(event) => setDryStackSet(event.target.value)}
              />
              {' '}°C • Difference {dryStackDifference > 0 ? '+' : ''}{dryStackDifference.toFixed(1)}°C
            </div>
          </div>
        )}
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
                    backgroundColor: temp > 180 ? '#ef4444' : temp > 170 ? '#f59e0b' : '#6d76cc',
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
              <span className="loop-val font-mono">
                {isBleaching ? `${((current.targetMoisture - current.exitMoisture) * 1.2).toFixed(1)} m/min trim` : '0.0 m/min trim'}
              </span>
            </div>
            <div className="loop-card">
              <span className="loop-lbl">Circulation Fans</span>
              <span className="loop-val font-mono">
                {isBleaching
                  ? `10 Units @ ${Math.round(1450 + dryStackDelta * 3)} RPM`
                  : '10 Units @ 1,450 RPM'}
              </span>
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
