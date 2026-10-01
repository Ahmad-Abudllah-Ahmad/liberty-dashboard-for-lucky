import React, { useState } from 'react';
import { SplitMonitor } from '../scada/SplitMonitor';
import {
  qualityMachines,
  liveMachines,
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
    machines={qualityMachines}
    mode="quality"
    defaultId="bleaching-01"
  />
);

export const LiveMonitoringPage: React.FC = () => (
  <SplitMonitor
    title="Live Monitoring"
    breadcrumb="Live Monitoring"
    machines={liveMachines}
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

const GaugeRing: React.FC<{
  label: string;
  color: string;
  percent: number;
  icon: string;
}> = ({ label, color, percent, icon }) => {
  const deg = Math.max(0, Math.min(100, percent)) * 3.6;
  return (
    <div className="energy-gauge">
      <div
        className="energy-gauge-ring"
        style={{ background: `conic-gradient(${color} ${deg}deg, #e5e7eb ${deg}deg)` }}
      >
        <div className="energy-gauge-inner">
          <span className="energy-gauge-icon" style={{ color }}>{icon}</span>
        </div>
      </div>
      <span className="energy-gauge-label">{label}</span>
    </div>
  );
};

export const EnergyGaugesPage: React.FC = () => {
  const [tab, setTab] = useState<'steam' | 'gas' | 'power' | 'water'>('steam');

  return (
    <div className="portal-page energy-gauges-page">
      <div className="portal-page-head">
        <h2>Energy Dashboard</h2>
        <p className="portal-crumb">Home / Energy Dashboard</p>
      </div>

      <div className="energy-gauge-row">
        <GaugeRing label="Steam" color="#7c3aed" percent={72} icon="♨" />
        <GaugeRing label="Electricity" color="#f59e0b" percent={64} icon="⚡" />
        <GaugeRing label="Gas" color="#ef4444" percent={58} icon="🔥" />
        <GaugeRing label="Water" color="#14b8a6" percent={46} icon="💧" />
      </div>

      <div className="energy-stat-row">
        <div className="energy-stat steam">
          Steam Consumed : 527.05 Ton<br />Cost Rs/Ton : 50,000
        </div>
        <div className="energy-stat power">
          Electric Consumed : 18,926.93 kWh<br />Cost Rs/kWh : 38
        </div>
        <div className="energy-stat gas">
          Gas Consumed : 34,233.00 M³<br />Cost Rs/M³ : 40
        </div>
        <div className="energy-stat water">
          Water Consumed : 3,209.01 M³<br />Cost Rs/M³ : 1,400
        </div>
      </div>

      <div className="energy-chart-tabs">
        {(['steam', 'gas', 'power', 'water'] as const).map((key) => (
          <button key={key} type="button" className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="energy-charts-grid">
        <div className="portal-card">
          <h3>Steam Consumption (Tons)</h3>
          <div className="bar-chart">
            <div className="bar-col">
              <span className="bar-value">440.77</span>
              <div className="bar-fill steam-bar" style={{ height: '78%' }} />
              <span className="bar-name">Consumption</span>
            </div>
            <div className="bar-col">
              <span className="bar-value">86.27</span>
              <div className="bar-fill waste-bar" style={{ height: '16%' }} />
              <span className="bar-name">Wastage</span>
            </div>
          </div>
        </div>

        <div className="portal-card">
          <h3>Steam Generation</h3>
          <div className="donut-wrap">
            <div className="donut" style={{ background: 'conic-gradient(#111827 0 90.36deg, #14b8a6 90.36deg 360deg)' }} />
            <ul className="donut-legend">
              <li><span className="swatch coal" /> Coal : 25.10%</li>
              <li><span className="swatch gas" /> Gas : 74.90%</li>
            </ul>
          </div>
        </div>

        <div className="portal-card">
          <h3>Dyeing Unit (Steam Consumption in Ton)</h3>
          <div className="donut-wrap">
            <div className="donut" style={{ background: 'conic-gradient(#111827 0 186.5deg, #3b82f6 186.5deg 230deg, #f472b6 230deg 360deg)' }} />
            <ul className="donut-legend">
              <li>Goller Mercerize 2 — 12.25</li>
              <li>Goller Mercerize 3 — 0.15</li>
              <li>Pad Stenter 2 — 0.06</li>
              <li>Sanforize 4 — 51.82</li>
            </ul>
          </div>
        </div>

        <div className="portal-card">
          <h3>Printing Unit (Steam Consumption in Ton)</h3>
          <div className="donut-wrap">
            <div className="donut rainbow" />
            <ul className="donut-legend compact">
              <li>BLEACHING-01 — 85.83</li>
              <li>BLEACHING-02 — 79.46</li>
              <li>BLEACHING-03 — 76.45</li>
              <li>MERCERIZE — 47.63</li>
              <li>DESIZE-01 — 27.18</li>
              <li>DESIZE-02 — 22.51</li>
              <li>PAD STEAM DYEING — 17.98</li>
              <li>CANLAR 150 / 750 / 1500 — 24.75</li>
              <li>SANFORIZING — 13.91</li>
            </ul>
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
        <p className="portal-crumb">Home / Utilities with Production</p>
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
        <p className="portal-crumb">Home / Utilities with Lotwise Production</p>
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
      <p className="portal-crumb">Home / Utilities with Stoppage</p>
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
      <p className="portal-crumb">Home / Activity Log</p>
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
      <p className="portal-crumb">Home / Machine Stoppages</p>
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
        <p className="portal-crumb">Home / Boilers</p>
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
        <p className="portal-crumb">Home / Boilers Status</p>
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
      <p className="portal-crumb">Home / Heat Exchangers</p>
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
      <p className="portal-crumb">Home / Devices</p>
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
      <p className="portal-crumb">Home / Grid Dashboard</p>
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
      <p className="portal-crumb">Home / Grid Dashboard-2</p>
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
      <p className="portal-crumb">Home / Grid Status</p>
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
      <p className="portal-crumb">Home / ETP Dashboard</p>
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
      <p className="portal-crumb">Home / RO</p>
    </div>
    <div className="pfd-board ro-board">
      <div className="pfd-row">
        <div className="pfd-tank wide aqua">HP Pump Station</div>
        <div className="pfd-tank wide aqua">Petrol Office Pumping Station</div>
      </div>
      <div className="pfd-row">
        <div className="pfd-tank wide">Liberty Mills Limited</div>
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
