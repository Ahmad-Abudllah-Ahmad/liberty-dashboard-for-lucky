import React, { useState } from 'react';
import { AxisBarChart, ChartHoverTip, SliceChart } from '../charts/PortalCharts';
import { SplitMonitor } from '../scada/SplitMonitor';
import {
  ltm4Machines,
  compressorMachines,
  solarMachines,
  chillerMachines,
  etpStatusMachines,
  genesetMachines,
  hvacMachines,
  waterPumpMachines,
  heatExchangerCards,
  utilityProductionRows,
  lotwiseRows,
  stoppageRows,
  activityLogRows,
  deviceCards,
} from '../../data/portalPageData';

export const QualityParametersPage: React.FC = () => (
  <SplitMonitor
    title="Quality Parameters Checking"
    breadcrumb="Quality Parameters Checking"
    machines={ltm4Machines}
    listHeader="LTM 4"
    parentLabel="LTM 4"
    mode="quality"
    defaultId="bleaching-01"
  />
);

export const LiveMonitoringPage: React.FC = () => (
  <SplitMonitor
    title="Live Monitoring"
    breadcrumb="Live Monitoring"
    machines={ltm4Machines}
    listHeader="LTM 4"
    parentLabel="LTM 4"
    mode="tags"
    defaultId="bleaching-01-live"
  />
);

export const CompressorMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Compressor Monitoring"
    breadcrumb="Compressor Monitoring"
    machines={compressorMachines}
    listHeader="Compressor"
    parentLabel="Compressor"
    mode="tags"
    defaultId="compressor"
  />
);

export const SolarPVMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Solar PV"
    breadcrumb="Solar PV"
    machines={solarMachines}
    listHeader="Solar PV"
    parentLabel="Solar PV"
    mode="tags"
    defaultId="al-abid-solar-5"
  />
);

export const ChillersMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Chillers"
    breadcrumb="Chillers"
    machines={chillerMachines}
    mode="tags"
    defaultId="chiller-4"
  />
);

export const ETPStatusPage: React.FC = () => (
  <SplitMonitor
    title="ETP Monitoring"
    breadcrumb="ETP Monitoring"
    machines={etpStatusMachines}
    listHeader="ETP"
    parentLabel="ETP"
    mode="tags"
    defaultId="bio-1-2"
  />
);

export const GenesetMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Geneset"
    breadcrumb="Geneset"
    machines={genesetMachines}
    mode="tags"
    defaultId="gen-05"
  />
);

export const HVACMonitorPage: React.FC = () => (
  <SplitMonitor
    title="HVAC"
    breadcrumb="HVAC"
    machines={hvacMachines}
    mode="tags"
    defaultId="ahu-01"
  />
);

export const WaterPumpMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Water Pump"
    breadcrumb="Water Pump"
    machines={waterPumpMachines}
    mode="tags"
    defaultId="hp-pump-1"
  />
);

const utilityEmoji: Record<string, string> = {
  Steam: '♨️',
  Electricity: '⚡',
  Gas: '🔥',
  Water: '💧',
};

export const EnergyGaugesPage: React.FC = () => {
  const [tab, setTab] = useState<'steam' | 'gas' | 'power' | 'water'>('steam');
  const [hover, setHover] = useState<'steam' | 'gas' | 'power' | 'water' | null>(null);

  const bars =
    tab === 'gas'
      ? {
          title: 'Gas Consumption (M³)',
          max: 40000,
          items: [
            { label: 'Consumption', value: 28420, color: '#d16b6b' },
            { label: 'Wastage', value: 5813, color: '#f0d0d0' },
          ],
        }
      : tab === 'power'
        ? {
            title: 'Power Consumption (kWh)',
            max: 22000,
            items: [
              { label: 'Consumption', value: 16240, color: '#f59e0b' },
              { label: 'Wastage', value: 2686, color: '#fbbf24' },
            ],
          }
        : tab === 'water'
          ? {
              title: 'Water Consumption (M³)',
              max: 4000,
              items: [
                { label: 'Consumption', value: 2740, color: '#5c9aa8' },
                { label: 'Wastage', value: 469, color: '#d4e6ea' },
              ],
            }
          : {
              title: 'Steam Consumption (Tons)',
              max: 500,
              items: [
                { label: 'Consumption', value: 440.77, color: '#2f8f8a' },
                { label: 'Wastage', value: 86.27, color: '#d7eeec' },
              ],
            };

  const generation =
    tab === 'gas'
      ? {
          title: 'Gas Supply Mix',
          slices: [
            { label: 'Line gas', value: 81.4, color: '#d16b6b' },
            { label: 'Captive', value: 18.6, color: '#8b93a7' },
          ],
        }
      : tab === 'power'
        ? {
            title: 'Power Generation',
            slices: [
              { label: 'Grid', value: 46.2, color: '#c4923a' },
              { label: 'Genset', value: 31.5, color: '#8b93a7' },
              { label: 'Solar', value: 22.3, color: '#5c9aa8' },
            ],
          }
        : tab === 'water'
          ? {
              title: 'Water Source',
              slices: [
                { label: 'RO', value: 58.2, color: '#5c9aa8' },
                { label: 'Raw', value: 41.8, color: '#8b93a7' },
              ],
            }
          : {
              title: 'Steam Generation',
              slices: [
                { label: 'Coal', value: 25.1, color: '#8b93a7' },
                { label: 'Gas', value: 74.9, color: '#2f8f8a' },
              ],
            };

  const utilities: {
    key: 'steam' | 'gas' | 'power' | 'water';
    label: string;
    color: string;
    percent: number;
    consumed: string;
    measure: string;
    cost: string;
    rate: string;
  }[] = [
    { key: 'steam', label: 'Steam', color: '#2f8f8a', percent: 72, consumed: '527.05', measure: 'Ton', cost: '50,000', rate: 'Rs/Ton' },
    { key: 'power', label: 'Electricity', color: '#c4923a', percent: 64, consumed: '18,926.93', measure: 'kWh', cost: '38', rate: 'Rs/kWh' },
    { key: 'gas', label: 'Gas', color: '#d16b6b', percent: 58, consumed: '34,233.00', measure: 'M³', cost: '40', rate: 'Rs/M³' },
    { key: 'water', label: 'Water', color: '#5c9aa8', percent: 46, consumed: '3,209.01', measure: 'M³', cost: '1,400', rate: 'Rs/M³' },
  ];
  const active = utilities.find((item) => item.key === tab) ?? utilities[0];

  return (
    <div className="portal-page energy-gauges-page">
      <div className="portal-page-head">
        <h2>Energy Dashboard</h2>
      </div>

      <div className="energy-board" role="tablist" aria-label="Utilities">
        {utilities.map((item) => {
          const selected = tab === item.key;
          const high = item.percent >= 80;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`energy-util${selected ? ' is-selected' : ''}`}
              style={{ ['--util' as string]: item.color }}
              onClick={() => setTab(item.key)}
            >
              <span className="energy-util-top">
                <span
                  className="energy-util-ring chart-interactive"
                  onMouseEnter={() => setHover(item.key)}
                  onMouseLeave={() => setHover((current) => (current === item.key ? null : current))}
                >
                  {hover === item.key && (
                    <ChartHoverTip
                      title={item.label}
                      status={{ label: high ? 'High Load' : 'Nominal', tone: high ? 'bad' : 'ok' }}
                      stats={[
                        { label: 'Load', value: `${item.percent.toFixed(1)}%` },
                        { label: 'Headroom', value: `${(100 - item.percent).toFixed(1)}%` },
                        { label: 'Consumed', value: `${item.consumed} ${item.measure}` },
                        { label: 'Unit cost', value: `${item.cost} ${item.rate}` },
                      ]}
                    />
                  )}
                  <svg viewBox="0 0 40 40" aria-hidden="true">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#e8edf3" strokeWidth="3.5" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={`${(item.percent / 100) * 100.53} ${100.53 - (item.percent / 100) * 100.53}`}
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                  <span className="energy-util-emoji" aria-hidden="true">
                    {utilityEmoji[item.label]}
                  </span>
                </span>
                <span className="energy-util-name">
                  <strong>{item.label}</strong>
                  <em className={high ? 'is-high' : ''}>{high ? 'High load' : 'Nominal'}</em>
                </span>
                <span className="energy-util-pct">
                  {item.percent}
                  <small>%</small>
                </span>
              </span>
              <span className="energy-util-room">{100 - item.percent}% headroom</span>
              <span className="energy-util-metrics">
                <span>
                  <em>Consumed</em>
                  <strong>{item.consumed}</strong>
                  <small>{item.measure}</small>
                </span>
                <span>
                  <em>Unit cost</em>
                  <strong>{item.cost}</strong>
                  <small>{item.rate}</small>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="energy-analysis">
        <div className="energy-analysis-label">
          <span style={{ background: active.color }} />
          <strong>{active.label} breakdown</strong>
        </div>
        <div className="energy-charts-grid">
          <div className="portal-card">
            <h3>{bars.title}</h3>
            <AxisBarChart bars={bars.items} max={bars.max} category={tab} />
          </div>
          <div className="portal-card">
            <h3>{generation.title}</h3>
            <SliceChart slices={generation.slices} donut suffix="%" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterBar: React.FC<{
  plant: string;
  machine: string;
  from: string;
  to: string;
  onPlant: (v: string) => void;
  onMachine: (v: string) => void;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}> = ({ plant, machine, from, to, onPlant, onMachine, onFrom, onTo }) => (
  <div className="filter-bar">
    <label>
      Select a plant
      <select value={plant} onChange={(e) => onPlant(e.target.value)}>
        <option>Printing Unit</option>
        <option>Dyeing Unit</option>
      </select>
    </label>
    <label>
      Select a machine
      <select value={machine} onChange={(e) => onMachine(e.target.value)}>
        <option>BLEACHING-01</option>
        <option>MERCERIZE</option>
        <option>PAD STEAM DYEING 02</option>
        <option>STENTER-15 (NEW MONFORTS)</option>
      </select>
    </label>
    <label>
      From
      <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} />
    </label>
    <label>
      To
      <input type="date" value={to} onChange={(e) => onTo(e.target.value)} />
    </label>
    <button type="button" className="btn-display">Display</button>
  </div>
);

export const UtilitiesProductionPage: React.FC = () => {
  const [plant, setPlant] = useState('Printing Unit');
  const [machine, setMachine] = useState('BLEACHING-01');
  const [from, setFrom] = useState('2026-09-28');
  const [to, setTo] = useState('2026-09-29');

  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>Utilities with Production</h2>
      </div>
      <FilterBar plant={plant} machine={machine} from={from} to={to} onPlant={setPlant} onMachine={setMachine} onFrom={setFrom} onTo={setTo} />
      <button type="button" className="btn-excel">Excel Export</button>
      <div className="split-table-wrap wide">
        <table className="portal-table sticky">
          <thead>
            <tr>
              <th>Machine</th>
              <th>Date</th>
              <th>Production (Meter)</th>
              <th>Production (Kg)</th>
              <th>Steam Cons (Kg)</th>
              <th>Steam Waste (Kg)</th>
              <th>Steam Total (Kg)</th>
              <th>Steam Wastage %</th>
              <th>Steam Kg/Kg with waste</th>
              <th>Steam Kg/Kg without waste</th>
              <th>Water M³/Kg with waste</th>
              <th>Water M³/Kg without waste</th>
              <th>Gas Cons (M³)</th>
              <th>Gas Waste (M³)</th>
              <th>Gas Total (M³)</th>
              <th>Gas Wastage %</th>
              <th>Power Cons (kWh)</th>
              <th>Power Waste (kWh)</th>
              <th>Power Total (kWh)</th>
              <th>Power Wastage %</th>
              <th>Power kW/Kg with waste</th>
              <th>Power kW/Kg without waste</th>
            </tr>
          </thead>
          <tbody>
            {utilityProductionRows.map((row, i) => (
              <tr key={i} className={i % 2 ? 'alt' : ''}>
                <td>{row.machine}</td>
                <td>{row.date}</td>
                <td>{row.prodM}</td>
                <td>{row.prodKg}</td>
                <td>{row.steamCons}</td>
                <td>{row.steamWaste}</td>
                <td>{row.steamTotal}</td>
                <td>{row.steamWastePct}</td>
                <td>{row.steamKgWith}</td>
                <td>{row.steamKgWithout}</td>
                <td>{row.waterM3KgWith}</td>
                <td>{row.waterM3KgWithout}</td>
                <td>{row.gasCons}</td>
                <td>{row.gasWaste}</td>
                <td>{row.gasTotal}</td>
                <td>{row.gasWastePct}</td>
                <td>{row.powerCons}</td>
                <td>{row.powerWaste}</td>
                <td>{row.powerTotal}</td>
                <td>{row.powerWastePct}</td>
                <td>{row.powerKwWith}</td>
                <td>{row.powerKwWithout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const UtilitiesLotwisePage: React.FC = () => {
  const [plant, setPlant] = useState('Printing Unit');
  const [machine, setMachine] = useState('MERCERIZE');
  const [from, setFrom] = useState('2026-09-28');
  const [to, setTo] = useState('2026-09-29');

  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>Utilities with Lotwise Production</h2>
      </div>
      <FilterBar plant={plant} machine={machine} from={from} to={to} onPlant={setPlant} onMachine={setMachine} onFrom={setFrom} onTo={setTo} />
      <button type="button" className="btn-excel">Excel Export</button>
      <div className="split-table-wrap wide">
        <table className="portal-table sticky">
          <thead>
            <tr>
              <th>Machine</th>
              <th>Lot #</th>
              <th>Dyestuff</th>
              <th>Process</th>
              <th>Shift</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Meters</th>
              <th>Steam Cons (Ton)</th>
              <th>Gas Cons (M³)</th>
              <th>Power Cons (kWh)</th>
              <th>Water Cons (M³)</th>
            </tr>
          </thead>
          <tbody>
            {lotwiseRows.map((row, i) => (
              <tr key={`${row.lot}-${i}`} className={i % 2 ? 'alt' : ''}>
                <td>{row.machine}</td>
                <td>{row.lot}</td>
                <td>{row.dye}</td>
                <td>{row.process}</td>
                <td>{row.shift}</td>
                <td>{row.start}</td>
                <td>{row.end}</td>
                <td>{row.meters}</td>
                <td>{row.steam}</td>
                <td>{row.gas}</td>
                <td>{row.power}</td>
                <td>{row.water}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const UtilitiesStoppagePage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Utilities with Stoppage</h2>
    </div>
    <div className="split-table-wrap">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Machine</th>
            <th>Reason</th>
            <th>Start</th>
            <th>End</th>
            <th>Minutes</th>
            <th>Shift</th>
          </tr>
        </thead>
        <tbody>
          {stoppageRows.map((row) => (
            <tr key={`${row.machine}-${row.start}`}>
              <td>{row.machine}</td>
              <td>{row.reason}</td>
              <td>{row.start}</td>
              <td>{row.end}</td>
              <td>{row.minutes}</td>
              <td>{row.shift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ActivityLogPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Activity Log</h2>
    </div>
    <div className="split-table-wrap">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {activityLogRows.map((row) => (
            <tr key={`${row.time}-${row.action}`}>
              <td>{row.time}</td>
              <td>{row.user}</td>
              <td>{row.action}</td>
              <td>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const MachineStoppagesPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Machine Stoppages</h2>
    </div>
    <div className="split-table-wrap">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Machine</th>
            <th>Reason</th>
            <th>Start</th>
            <th>End</th>
            <th>Minutes</th>
            <th>Shift</th>
          </tr>
        </thead>
        <tbody>
          {stoppageRows.map((row) => (
            <tr key={`${row.machine}-${row.start}`}>
              <td>{row.machine}</td>
              <td>{row.reason}</td>
              <td>{row.start}</td>
              <td>{row.end}</td>
              <td>{row.minutes}</td>
              <td>{row.shift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const BoilerPerformancePage: React.FC = () => {
  const [from, setFrom] = useState('2026-09-29');
  const [to, setTo] = useState('2026-09-30');

  const generated = [
    { label: 'Gas Boiler 16 Ton', value: '0.00' },
    { label: 'Gas Boiler 25 Ton', value: '0.00' },
    { label: 'Gas Boiler 30 Ton', value: '0.00' },
    { label: 'Bio Mass', value: '1,085.50' },
    { label: 'Bio Mass 40 Ton', value: '529.70' },
  ];
  const consumed = [
    { label: 'Muslim Cotton', value: '127' },
    { label: 'Distribution Steam Printing', value: '1,071.4' },
    { label: 'Distribution Steam Dyeing', value: '154' },
    { label: 'Dyeing CRP', value: '43.98' },
    { label: 'Bio Mass - Soot Blower', value: '8' },
    { label: 'Bio Mass 40 Ton (SOOT BLOWER)', value: '3.209' },
    { label: 'Deaerator Steam', value: '102.49' },
  ];

  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>Boilers Performance</h2>
      </div>
      <div className="filter-bar">
        <label>From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button type="button" className="btn-display">Display</button>
      </div>
      <h3 className="section-title">Steam Generation and Consumption Report</h3>
      <div className="boiler-kpi-row">
        <div className="boiler-kpi green"><span className="kpi-gear">⚙</span><div><strong>Gas consumed</strong><b>0.00</b><small>NaN (M³)</small></div></div>
        <div className="boiler-kpi blue"><span className="kpi-gear">⚙</span><div><strong>Feed Water</strong><b>1,651.10</b><small>1.02 (M³)</small></div></div>
        <div className="boiler-kpi teal"><span className="kpi-gear">⚙</span><div><strong>Condensate Water</strong><b>553.60</b><small>(M³)</small></div></div>
        <div className="boiler-kpi amber"><span className="kpi-gear">⚙</span><div><strong>RO Water</strong><b>1,097.50</b><small>(M³)</small></div></div>
      </div>
      <div className="boiler-split">
        <div>
          <h4>Steam Generated (Tons)</h4>
          {generated.map((row) => (
            <div key={row.label} className="boiler-line generated"><span>{row.label}</span><span>{row.value}</span></div>
          ))}
        </div>
        <div>
          <h4>Steam Consumed (Tons)</h4>
          {consumed.map((row) => (
            <div key={row.label} className="boiler-line consumed"><span>{row.label}</span><span>{row.value}</span></div>
          ))}
        </div>
      </div>
      <div className="boiler-footer-stats">
        <div><b>1,615.20</b><span>TOTAL GENERATED</span></div>
        <div><b>1,510.08</b><span>TOTAL CONSUMED</span></div>
        <div><b className="text-red">105.12</b><span>DIFFERENCE</span></div>
        <div><b>93.49</b><span>PERCENT</span></div>
      </div>
    </div>
  );
};

export const BoilerStatusPage: React.FC = () => {
  const units = [
    { name: 'Gas Boiler 16 Ton', status: 'stopped', steam: '0.00 TPH', pressure: '0.00 Bar' },
    { name: 'Gas Boiler 25 Ton', status: 'stopped', steam: '0.00 TPH', pressure: '0.00 Bar' },
    { name: 'Gas Boiler 30 Ton', status: 'stopped', steam: '0.00 TPH', pressure: '0.00 Bar' },
    { name: 'Bio Mass', status: 'running', steam: '22.40 TPH', pressure: '10.2 Bar' },
    { name: 'Bio Mass 40 Ton', status: 'running', steam: '18.10 TPH', pressure: '9.8 Bar' },
    { name: 'Deaerator', status: 'running', steam: '4.26 TPH', pressure: '0.25 Bar' },
  ];
  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>Boilers Status</h2>
      </div>
      <div className="hx-legend">
        <span><i className="dot running" /> Running</span>
        <span><i className="dot stopped" /> Stopped</span>
        <span><i className="dot disconnected" /> Disconnected</span>
      </div>
      <div className="status-card-grid">
        {units.map((unit) => (
          <div key={unit.name} className={`status-card ${unit.status}`}>
            <div className="status-card-head">
              <h3>{unit.name}</h3>
              <span className={`power-dot ${unit.status}`}>⏻</span>
            </div>
            <p>Steam: {unit.steam}</p>
            <p>Pressure: {unit.pressure}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HeatExchangerCardsPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Heat Exchangers</h2>
    </div>
    <div className="hx-legend">
      <span><i className="dot running" /> Running</span>
      <span><i className="dot stopped" /> Stopped</span>
      <span><i className="dot disconnected" /> Disconnected</span>
    </div>
    <div className="hx-grid">
      {heatExchangerCards.map((card) => (
        <article key={card.id} className="hx-card">
          <header>
            <h3>{card.name}</h3>
            <span className={`power-dot ${card.status}`}>⏻</span>
          </header>
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Unit</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {card.rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.unit}</td>
                  <td className={`hx-val ${card.status}`}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      ))}
    </div>
  </div>
);

export const DevicesGridPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Devices</h2>
    </div>
    <div className="device-grid">
      {deviceCards.map((device) => (
        <article key={device.id} className="device-card">
          <div className="device-card-top">
            <div>
              <h3>{device.title}</h3>
              <p>{device.protocol}</p>
              <p className="device-addr">{device.address}</p>
            </div>
            <span className="device-gauge">◷</span>
          </div>
          <button type="button" className="device-more">More info ℹ</button>
        </article>
      ))}
    </div>
  </div>
);

export const GridDashboardPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Grid Dashboard</h2>
    </div>
    <div className="sld-canvas">
      <div className="gen-row">
        {['G', 'G', 'G', 'G', 'G', 'D', 'D'].map((mark, i) => (
          <div key={i} className={`gen-circle ${mark === 'D' ? 'diesel' : ''}`}>{mark}</div>
        ))}
      </div>
      <div className="sld-body">
        <div className="sld-left">
          <div className="tf-row">
            <div className="tf-box">Transformer #03<br />2500 kVA</div>
            <div className="tf-box">Transformer #02<br />2500 kVA</div>
            <div className="tf-box">Transformer #01<br />2500 kVA</div>
          </div>
          <div className="feeder-box">
            <strong>K.E 1 (Dedicated Feeder)</strong>
            <span>Sanctioned load 4.8 MW</span>
          </div>
        </div>
        <div className="sld-right">
          {[
            ['Sub Station 2', '1091 kW'],
            ['Sub Station 3', '1500 kVA'],
            ['Sub Station 4', '1500 kVA'],
            ['Sub Station 5A', '1000 kVA'],
            ['Sub Station 5B', '1500 kVA'],
            ['Sub Station 7', '1600 kVA'],
            ['Sub Station 9', '1500 kVA'],
          ].map(([name, load]) => (
            <div key={name} className="sub-row">
              <div className="sub-box">{name}<small>{load}</small></div>
              <div className="dist-box">Distribution</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const GridDashboard2Page: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Grid Dashboard-2</h2>
    </div>
    <div className="sld-canvas tall">
      <div className="gen-row labeled">
        {['Gen #05', 'Gen #06', 'Gen #07', 'Gen #08', 'Gen #09', 'DG #01', 'DG #02'].map((name, i) => (
          <div key={name} className="gen-stack">
            <small>{name}</small>
            <div className={`gen-circle ${i > 4 ? 'diesel' : ''}`}>{i > 4 ? 'D' : 'G'}</div>
          </div>
        ))}
      </div>
      <div className="sld-dual">
        <div className="feeder-col">
          <div className="tower-card">
            <div className="tower-icon">⚡</div>
            <strong>K.E 1 (Dedicated Feeder)</strong>
            <span>Sanctioned load 4.8 MW</span>
          </div>
          <div className="tower-card">
            <div className="tower-icon">⚡</div>
            <strong>K.E 2 (Local Feeder)</strong>
            <span>Sanctioned load 0.3 MW</span>
          </div>
        </div>
        <div className="sld-right">
          {[
            'Sub Station 2 — 1500 kVA',
            'Sub Station 3 — 1500 kVA',
            'Sub Station 4 — 1500 kVA',
            'Sub Station 5A — 1000 kVA',
            'Sub Station 5B — 1500 kVA',
            'Sub Station 7 — 1600 kVA',
            'Sub Station 9 — 1500 kVA',
            'Workshop LT — 750 kVA',
            'ZTA LT — 750 kVA',
            'Sub Station 1 — 1500 kVA',
            'Sub Station 8 — 1500 kVA',
            'Sub Station 10 Panel — 1500 kVA',
          ].map((item) => (
            <div key={item} className="sub-row">
              <div className="sub-box">{item}</div>
              <div className="dist-box">Distribution</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const GridStatusPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>Grid Status</h2>
    </div>
    <div className="split-table-wrap">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Feeder / Substation</th>
            <th>Capacity</th>
            <th>Load</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>K.E 1 Dedicated Feeder</td><td>4.8 MW</td><td>3.92 MW</td><td className="cell-ok">Online</td></tr>
          <tr><td>K.E 2 Local Feeder</td><td>0.3 MW</td><td>0.18 MW</td><td className="cell-ok">Online</td></tr>
          <tr><td>Transformer #01</td><td>2500 kVA</td><td>1,820 kVA</td><td className="cell-ok">Loaded</td></tr>
          <tr><td>Transformer #02</td><td>2500 kVA</td><td>1,640 kVA</td><td className="cell-ok">Loaded</td></tr>
          <tr><td>Transformer #03</td><td>2500 kVA</td><td>1,091 kVA</td><td className="cell-ok">Loaded</td></tr>
          <tr><td>Sub Station 5B</td><td>1500 kVA</td><td>1,210 kVA</td><td className="cell-warn">High</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const ETPDashboardPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>ETP Dashboard</h2>
    </div>
    <div className="pfd-board">
      <div className="pfd-row">
        <div className="pfd-tank wide">Equalization Tank</div>
      </div>
      <div className="pfd-row pumps">
        <span>C1</span><span>C2</span><span>C3</span><span>C4</span>
        <em>Cooling Tower</em>
      </div>
      <div className="pfd-row">
        <div className="pfd-tank">Chemical Treatment Tank</div>
      </div>
      <div className="pfd-row fans">
        <div className="fan-col"><div className="fan">✦</div><small>132 kW</small><div className="fan">✦</div><small>75 kW</small></div>
        <div className="aero-col">
          <div className="aero">Aeration-1</div>
          <div className="mbr-row"><b>MBR 1</b><b>MBR 2</b></div>
        </div>
        <div className="aero-col">
          <div className="aero">Aeration-2</div>
          <div className="mbr-row"><b>MBR 3</b><b>MBR 4</b></div>
        </div>
        <div className="fan-col"><div className="fan">✦</div><small>132 kW</small><div className="fan">✦</div><small>75 kW</small></div>
      </div>
      <div className="pfd-row">
        <div className="pfd-tank light">RO Feed Tank</div>
      </div>
      <div className="pfd-row">
        <div className="pfd-chip">R/O-1</div>
        <div className="pfd-chip">R/O-2</div>
        <div className="pfd-tank aqua">Polishing R/O</div>
      </div>
    </div>
  </div>
);

export const RONetworkPage: React.FC = () => (
  <div className="portal-page">
    <div className="portal-page-head">
      <h2>RO</h2>
    </div>
    <div className="pfd-board ro-board">
      <div className="pfd-row">
        <div className="pfd-tank wide aqua">HP Pump Station</div>
        <div className="pfd-tank wide aqua">Petrol Office Pumping Station</div>
      </div>
      <div className="pfd-row">
        <div className="pfd-tank wide">Lucky Textile</div>
      </div>
      <div className="pfd-row tanks">
        {['Tank 1', 'Tank 2', 'Tank 3', 'Tank 4', 'Tank 5', 'Tank 6'].map((t) => (
          <div key={t} className="mini-tank">{t}</div>
        ))}
      </div>
      <div className="pfd-row">
        <div className="pfd-tank">Softener Feed</div>
        <div className="pfd-tank">RO Product</div>
        <div className="pfd-tank">Product Tank</div>
      </div>
      <div className="pfd-row">
        <div className="pfd-tank">Overhead Tank</div>
        <div className="pfd-tank">RO Water Main Tank</div>
        <div className="pfd-tank wide">Mineral RO 35,000 Gal/Day</div>
      </div>
      <div className="pfd-row">
        <div className="pfd-chip">SOS Tank</div>
        <div className="pfd-chip">Dyeing</div>
        <div className="pfd-chip">Color Kitchen</div>
        <div className="pfd-chip">Canlar</div>
        <div className="pfd-chip">Fongs</div>
        <div className="pfd-tank">Product Tank (Zakaria Tank)</div>
      </div>
      <div className="motor-pair">
        <div className="motor-badge">M<br /><small>100 kW</small></div>
        <div className="motor-badge">M<br /><small>30 kW</small></div>
      </div>
    </div>
  </div>
);
