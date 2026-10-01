import React, { useMemo, useState } from 'react';
import { SplitMonitor } from '../scada/SplitMonitor';
import { AxisBarChart, DeviceGauge, RingGauge, SliceChart, StackBarChart } from '../charts/PortalCharts';
import { PortalPageHead } from '../portal/PortalPageHead';
import { PortalTableEmpty, UtilitiesTableToolbar } from '../portal/PortalTableEmpty';
import { defaultFilterDateRange } from '../../lib/portalDates';
import { formatLike, formatNumber, parseReading, wobble } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';
import {
  getLiveMachinesForUnit,
  getQualityMachinesForUnit,
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

function sumFigures(values: string[]): string {
  const total = values.reduce((sum, value) => sum + (parseReading(value) ?? 0), 0);
  return total.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function avgFigures(values: string[]): string {
  if (values.length === 0) return '0.00';
  const total = values.reduce((sum, value) => sum + (parseReading(value) ?? 0), 0);
  return (total / values.length).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const QualityParametersPage: React.FC<{ unit?: 'printing' | 'dyeing' | 'all' }> = ({ unit = 'all' }) => {
  const machines = useMemo(() => getQualityMachinesForUnit(unit), [unit]);
  const defaultId = unit === 'printing' ? 'stenter-15' : unit === 'dyeing' ? 'pad-steam-02' : 'bleaching-01';
  const breadcrumb =
    unit === 'printing'
      ? 'Printing / Quality Parameters Checks'
      : unit === 'dyeing'
        ? 'Dyeing / Quality Parameters Checks'
        : 'Quality Parameters Checks';

  return (
    <SplitMonitor
      title="Quality Parameters Checks"
      breadcrumb={breadcrumb}
      machines={machines}
      mode="quality"
      defaultId={defaultId}
    />
  );
};

export const LiveMonitoringPage: React.FC<{ unit?: 'printing' | 'dyeing' | 'all' }> = ({ unit = 'all' }) => {
  const machines = useMemo(() => getLiveMachinesForUnit(unit), [unit]);
  const defaultId = unit === 'printing' ? 'reggiani-03-live' : unit === 'dyeing' ? 'pad-steam-02-live' : 'bleaching-01-live';
  const breadcrumb =
    unit === 'printing' ? 'Printing / Live Monitoring' : unit === 'dyeing' ? 'Dyeing / Live Monitoring' : 'Live Monitoring';

  return (
    <SplitMonitor
      title="Live Monitoring"
      breadcrumb={breadcrumb}
      machines={machines}
      mode="tags"
      defaultId={defaultId}
    />
  );
};

export const CompressorMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Compressor Monitoring"
    breadcrumb="Compressor Monitoring"
    machines={compressorMachines}
    listHeader="Compressor"
    parentLabel="Compressor"
    mode="tags"
    defaultId="digital-printing"
  />
);

export const SolarPVMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Solar Monitoring"
    breadcrumb="Solar Monitoring"
    machines={solarMachines}
    listHeader="Solar"
    parentLabel="Solar"
    mode="tags"
    defaultId="zaib-solar-2"
  />
);

export const ChillersMonitorPage: React.FC = () => (
  <SplitMonitor
    title="Chiller Monitoring"
    breadcrumb="Live Monitoring"
    machines={chillerMachines}
    listHeader="Chillers"
    parentLabel="Chillers"
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

const ENERGY_TABS = ['steam', 'gas', 'power', 'water'] as const;
type EnergyTab = (typeof ENERGY_TABS)[number];

export const EnergyGaugesPage: React.FC = () => {
  const [tab, setTab] = useState<EnergyTab>('steam');
  const tick = useTelemetryTick();

  const steam = wobble(527.05, tick, 1.4, 1);
  const power = wobble(18926.93, tick, 18, 2);
  const gas = wobble(34233, tick, 22, 3);
  const water = wobble(3209.01, tick, 2.4, 4);

  const bars = useMemo(() => {
    if (tab === 'gas') {
      return {
        title: 'Gas Consumption (MÂ³)',
        max: 40000,
        items: [
          { label: 'Consumption', value: wobble(28420, tick, 40, 5), color: '#ef4444' },
          { label: 'Wastage', value: wobble(5813, tick, 18, 6), color: '#fbbf24' },
        ],
      };
    }
    if (tab === 'power') {
      return {
        title: 'Power Consumption (kWh)',
        max: 22000,
        items: [
          { label: 'Consumption', value: wobble(16240, tick, 30, 7), color: '#f59e0b' },
          { label: 'Wastage', value: wobble(2686, tick, 12, 8), color: '#fbbf24' },
        ],
      };
    }
    if (tab === 'water') {
      return {
        title: 'Water Consumption (MÂ³)',
        max: 4000,
        items: [
          { label: 'Consumption', value: wobble(2740, tick, 8, 9), color: '#14b8a6' },
          { label: 'Wastage', value: wobble(469, tick, 4, 10), color: '#fbbf24' },
        ],
      };
    }
    return {
      title: 'Steam Consumption (Tons)',
      max: 500,
      items: [
        { label: 'Consumption', value: wobble(440.77, tick, 1.6, 11), color: '#3b82f6' },
        { label: 'Wastage', value: wobble(86.27, tick, 0.8, 12), color: '#fbbf24' },
      ],
    };
  }, [tab, tick]);

  const generation = useMemo(() => {
    if (tab === 'gas') {
      return {
        title: 'Gas Supply Mix',
        slices: [
          { label: 'Line gas', value: wobble(81.4, tick, 0.4, 13), color: '#ef4444' },
          { label: 'Captive', value: wobble(18.6, tick, 0.4, 14), color: '#111827' },
        ],
      };
    }
    if (tab === 'power') {
      return {
        title: 'Power Generation',
        slices: [
          { label: 'Grid', value: wobble(46.2, tick, 0.5, 15), color: '#f59e0b' },
          { label: 'Genset', value: wobble(31.5, tick, 0.4, 16), color: '#111827' },
          { label: 'Solar', value: wobble(22.3, tick, 0.35, 17), color: '#14b8a6' },
        ],
      };
    }
    if (tab === 'water') {
      return {
        title: 'Water Source',
        slices: [
          { label: 'RO', value: wobble(58.2, tick, 0.4, 18), color: '#14b8a6' },
          { label: 'Raw', value: wobble(41.8, tick, 0.4, 19), color: '#111827' },
        ],
      };
    }
    return {
      title: 'Steam Generation',
      slices: [
        { label: 'Coal', value: wobble(25.1, tick, 0.25, 20), color: '#111827' },
        { label: 'Gas', value: wobble(74.9, tick, 0.25, 21), color: '#14b8a6' },
      ],
    };
  }, [tab, tick]);

  const dyeingSlices = [
    { label: 'Sanforize 4', value: wobble(51.82, tick, 0.35, 22), color: '#111827' },
    { label: 'Goller Mercerize 2', value: wobble(12.25, tick, 0.2, 23), color: '#3b82f6' },
    { label: 'Goller Mercerize 3', value: wobble(5.15, tick, 0.12, 24), color: '#f472b6' },
    { label: 'Pad Stenter 2', value: wobble(0.06, tick, 0.01, 25), color: '#94a3b8' },
  ];

  const printingSlices = [
    { label: 'BLEACHING-01', value: wobble(85.83, tick, 0.4, 26), color: '#14b8a6' },
    { label: 'BLEACHING-02', value: wobble(79.46, tick, 0.4, 27), color: '#3b82f6' },
    { label: 'BLEACHING-03', value: wobble(76.45, tick, 0.4, 28), color: '#111827' },
    { label: 'MERCERIZE', value: wobble(47.63, tick, 0.3, 29), color: '#93c5fd' },
    { label: 'DESIZE-01', value: wobble(27.18, tick, 0.25, 30), color: '#a78bfa' },
    { label: 'DESIZE-02', value: wobble(22.51, tick, 0.2, 31), color: '#f472b6' },
    { label: 'PAD STEAM DYEING', value: wobble(17.98, tick, 0.2, 32), color: '#fb7185' },
    { label: 'CANLAR 150+50', value: wobble(14.69, tick, 0.15, 33), color: '#f59e0b' },
    { label: 'CANLAR 750', value: wobble(13.91, tick, 0.15, 34), color: '#22c55e' },
    { label: 'SANFORIZING', value: wobble(8.68, tick, 0.12, 35), color: '#64748b' },
  ];

  return (
    <div className="portal-page energy-gauges-page">
      <PortalPageHead title="Energy Dashboard" crumb="Home / Energy Dashboard" layout="split" />

      <div className="energy-gauge-row">
        <RingGauge label="Steam" color="#7c3aed" percent={wobble(72, tick, 1.2, 1)} icon="â™¨" />
        <RingGauge label="Electricity" color="#f59e0b" percent={wobble(64, tick, 1.1, 2)} icon="âš¡" />
        <RingGauge label="Gas" color="#ef4444" percent={wobble(58, tick, 1.1, 3)} icon="ðŸ”¥" />
        <RingGauge label="Water" color="#14b8a6" percent={wobble(46, tick, 1.0, 4)} icon="ðŸ’§" />
      </div>

      <div className="energy-stat-row">
        <div className="energy-stat steam">
          Steam Consumed : {formatNumber(steam)} Ton<br />Cost Rs/Ton : <b className="cost-mark">5,000</b>
        </div>
        <div className="energy-stat power">
          Electric Consumed : {formatNumber(power)} kWh<br />Cost Rs/kWh : <b className="cost-mark">38</b>
        </div>
        <div className="energy-stat gas">
          Gas Consumed : {formatNumber(gas)} MÂ³<br />Cost Rs/MÂ³ : <b className="cost-mark">40</b>
        </div>
        <div className="energy-stat water">
          Water Consumed : {formatNumber(water)} MÂ³<br />Cost Rs/MÂ³ : <b className="cost-mark">140</b>
        </div>
      </div>

      <div className="energy-chart-tabs">
        {ENERGY_TABS.map((key) => (
          <button key={key} type="button" className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            {key.toUpperCase()}
          </button>
        ))}
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

        <div className="portal-card">
          <h3>Dyeing Unit (Steam Consumption in Ton)</h3>
          <SliceChart slices={dyeingSlices} />
        </div>

        <div className="portal-card">
          <h3>Printing Unit (Steam Consumption in Ton)</h3>
          <SliceChart slices={printingSlices} />
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
  onDisplay?: () => void;
}> = ({ plant, machine, from, to, onPlant, onMachine, onFrom, onTo, onDisplay }) => (
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
    <button type="button" className="btn-display" onClick={onDisplay} aria-label="Apply filters and refresh table">
      Display
    </button>
  </div>
);

export const UtilitiesProductionPage: React.FC = () => {
  const [plant, setPlant] = useState('Printing Unit');
  const [machine, setMachine] = useState('BLEACHING-01');
  const [shownMachine, setShownMachine] = useState('BLEACHING-01');
  const [from, setFrom] = useState(() => defaultFilterDateRange().from);
  const [to, setTo] = useState(() => defaultFilterDateRange().to);
  const tick = useTelemetryTick();
  const rows = utilityProductionRows.filter((row) => row.machine === shownMachine);
  const liveRows = rows.map((row, index) => {
    if (index !== rows.length - 1) return row;
    const meters = parseReading(row.prodM) ?? 0;
    const kilos = parseReading(row.prodKg) ?? 0;
    return {
      ...row,
      prodM: Math.round(wobble(meters, tick, 40, 1)).toLocaleString('en-US'),
      prodKg: Math.round(wobble(kilos, tick, 18, 2)).toLocaleString('en-US'),
    };
  });

  return (
    <div className="portal-page">
      <PortalPageHead title="Utilities with Production" crumb="Home / Utilities with Production" />
      <FilterBar
        plant={plant}
        machine={machine}
        from={from}
        to={to}
        onPlant={setPlant}
        onMachine={setMachine}
        onFrom={setFrom}
        onTo={setTo}
        onDisplay={() => setShownMachine(machine)}
      />
      <UtilitiesTableToolbar meta={`${liveRows.length} shift rows Â· ${shownMachine} Â· ${from} â†’ ${to}`} />
      <div className="split-table-wrap wide scroll-hint">
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
              <th>Water Cons (MÂ³)</th>
              <th>Water Waste (MÂ³)</th>
              <th>Water Total (MÂ³)</th>
              <th>Water Wastage %</th>
              <th>Water MÂ³/Kg with waste</th>
              <th>Water MÂ³/Kg without waste</th>
              <th>Gas Cons (MÂ³)</th>
              <th>Gas Waste (MÂ³)</th>
              <th>Gas Total (MÂ³)</th>
              <th>Gas Wastage %</th>
              <th>Gas MÂ³/Kg with waste</th>
              <th>Gas MÂ³/Kg without waste</th>
              <th>Power Cons (kWh)</th>
              <th>Power Waste (kWh)</th>
              <th>Power Total (kWh)</th>
              <th>Power Wastage %</th>
              <th>Power kW/Kg with waste</th>
              <th>Power kW/Kg without waste</th>
            </tr>
          </thead>
          <tbody>
            {liveRows.length === 0 ? (
              <PortalTableEmpty
                colSpan={27}
                message="No production rows for this machine and date range. Adjust filters and click Display."
              />
            ) : (
            liveRows.map((row, i) => (
              <tr key={`${row.date}-${i}`} className="report-row">
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
                <td>{row.waterCons}</td>
                <td>{row.waterWaste}</td>
                <td>{row.waterTotal}</td>
                <td>{row.waterWastePct}</td>
                <td>{row.waterM3KgWith}</td>
                <td>{row.waterM3KgWithout}</td>
                <td>{row.gasCons}</td>
                <td>{row.gasWaste}</td>
                <td>{row.gasTotal}</td>
                <td>{row.gasWastePct}</td>
                <td>{row.gasKgWith}</td>
                <td>{row.gasKgWithout}</td>
                <td>{row.powerCons}</td>
                <td>{row.powerWaste}</td>
                <td>{row.powerTotal}</td>
                <td>{row.powerWastePct}</td>
                <td>{row.powerKwWith}</td>
                <td>{row.powerKwWithout}</td>
              </tr>
            )))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td />
              <td>{sumFigures(liveRows.map((row) => row.prodM))}</td>
              <td>{sumFigures(liveRows.map((row) => row.prodKg))}</td>
              <td>{sumFigures(liveRows.map((row) => row.steamCons))}</td>
              <td>{sumFigures(liveRows.map((row) => row.steamWaste))}</td>
              <td>{sumFigures(liveRows.map((row) => row.steamTotal))}</td>
              <td>{avgFigures(liveRows.map((row) => row.steamWastePct))}</td>
              <td>{avgFigures(liveRows.map((row) => row.steamKgWith))}</td>
              <td>{avgFigures(liveRows.map((row) => row.steamKgWithout))}</td>
              <td>{sumFigures(liveRows.map((row) => row.waterCons))}</td>
              <td>{sumFigures(liveRows.map((row) => row.waterWaste))}</td>
              <td>{sumFigures(liveRows.map((row) => row.waterTotal))}</td>
              <td>{avgFigures(liveRows.map((row) => row.waterWastePct))}</td>
              <td>{avgFigures(liveRows.map((row) => row.waterM3KgWith))}</td>
              <td>{avgFigures(liveRows.map((row) => row.waterM3KgWithout))}</td>
              <td>{sumFigures(liveRows.map((row) => row.gasCons))}</td>
              <td>{sumFigures(liveRows.map((row) => row.gasWaste))}</td>
              <td>{sumFigures(liveRows.map((row) => row.gasTotal))}</td>
              <td>{avgFigures(liveRows.map((row) => row.gasWastePct))}</td>
              <td>{avgFigures(liveRows.map((row) => row.gasKgWith))}</td>
              <td>{avgFigures(liveRows.map((row) => row.gasKgWithout))}</td>
              <td>{sumFigures(liveRows.map((row) => row.powerCons))}</td>
              <td>{sumFigures(liveRows.map((row) => row.powerWaste))}</td>
              <td>{sumFigures(liveRows.map((row) => row.powerTotal))}</td>
              <td>{avgFigures(liveRows.map((row) => row.powerWastePct))}</td>
              <td>{avgFigures(liveRows.map((row) => row.powerKwWith))}</td>
              <td>{avgFigures(liveRows.map((row) => row.powerKwWithout))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export const UtilitiesLotwisePage: React.FC = () => {
  const [plant, setPlant] = useState('Printing Unit');
  const [machine, setMachine] = useState('MERCERIZE');
  const [shownMachine, setShownMachine] = useState('MERCERIZE');
  const [from, setFrom] = useState(() => defaultFilterDateRange().from);
  const [to, setTo] = useState(() => defaultFilterDateRange().to);
  const rows = shownMachine ? lotwiseRows.filter((row) => row.machine === shownMachine) : lotwiseRows;
  const meters = sumFigures(rows.map((row) => row.meters));
  const steam = sumFigures(rows.map((row) => row.steam));
  const gas = sumFigures(rows.map((row) => row.gas));
  const power = sumFigures(rows.map((row) => row.power));
  const water = sumFigures(rows.map((row) => row.water));

  return (
    <div className="portal-page">
      <PortalPageHead title="Utilities with Lotwise Production" crumb="Home / Utilities with Lotwise Production" />
      <FilterBar
        plant={plant}
        machine={machine}
        from={from}
        to={to}
        onPlant={setPlant}
        onMachine={setMachine}
        onFrom={setFrom}
        onTo={setTo}
        onDisplay={() => setShownMachine(machine)}
      />
      {shownMachine && (
        <button type="button" className="filter-chip" onClick={() => setShownMachine('')}>
          {shownMachine} Ã—
        </button>
      )}
      <UtilitiesTableToolbar
        meta={`${rows.length} lot rows${shownMachine ? ` Â· ${shownMachine}` : ''} Â· ${from} â†’ ${to}`}
      />
      <div className="split-table-wrap wide scroll-hint">
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
              <th>Gas Cons (MÂ³)</th>
              <th>Power Cons (kWh)</th>
              <th>Water Cons (MÂ³)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="lot-group">
              <td colSpan={7}>Machine: {shownMachine || 'All'} - {rows.length} items</td>
              <td>{meters}</td>
              <td>{steam}</td>
              <td>{gas}</td>
              <td>{power}</td>
              <td>{water}</td>
            </tr>
            {rows.length === 0 ? (
              <PortalTableEmpty colSpan={12} message="No lot rows for the current filters. Clear the machine chip or click Display." />
            ) : (
            rows.map((row, i) => (
              <tr key={`${row.lot}-${i}`} className="report-row">
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
            )))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7}>Total</td>
              <td>{meters}</td>
              <td>{steam}</td>
              <td>{gas}</td>
              <td>{power}</td>
              <td>{water}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export const UtilitiesStoppagePage: React.FC = () => (
  <div className="portal-page">
    <PortalPageHead title="Utilities with Stoppage" crumb="Home / Utilities with Stoppage" />
    <UtilitiesTableToolbar meta={`${stoppageRows.length} stoppage records`} />
    <div className="split-table-wrap wide scroll-hint">
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
    <PortalPageHead title="Activity Log" crumb="Home / Activity Log" />
    <UtilitiesTableToolbar meta={`${activityLogRows.length} log entries`} />
    <div className="split-table-wrap wide scroll-hint">
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
    <PortalPageHead title="Machine Stoppages" crumb="Home / Machine Stoppages" />
    <UtilitiesTableToolbar meta={`${stoppageRows.length} stoppage records`} />
    <div className="split-table-wrap wide scroll-hint">
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
  const [from, setFrom] = useState(() => defaultFilterDateRange().from);
  const [to, setTo] = useState(() => defaultFilterDateRange().to);
  const tick = useTelemetryTick();

  const generated = [
    { label: 'Gas Boiler 16 Ton', value: 0 },
    { label: 'Gas Boiler 25 Ton', value: 0 },
    { label: 'Gas Boiler 30 Ton', value: 0 },
    { label: 'Bio Mass', value: wobble(1085.5, tick, 2.4, 1) },
    { label: 'Bio Mass 40 Ton', value: wobble(529.7, tick, 1.6, 2) },
  ];
  const consumed = [
    { label: 'Muslim Cotton', value: wobble(127, tick, 0.6, 3) },
    { label: 'Distribution Steam Printing', value: wobble(1071.4, tick, 2.2, 4) },
    { label: 'Distribution Steam Dyeing', value: wobble(154, tick, 0.8, 5) },
    { label: 'Dyeing CRP', value: wobble(43.98, tick, 0.3, 6) },
    { label: 'Bio Mass - Soot Blower', value: wobble(8, tick, 0.15, 7) },
    { label: 'Bio Mass 40 Ton (SOOT BLOWER)', value: wobble(3.209, tick, 0.08, 8) },
    { label: 'Deaerator Steam', value: wobble(102.49, tick, 0.4, 9) },
  ];
  const genTotal = generated.reduce((sum, row) => sum + row.value, 0);
  const conTotal = consumed.reduce((sum, row) => sum + row.value, 0);
  const diff = genTotal - conTotal;
  const percent = genTotal > 0 ? (conTotal / genTotal) * 100 : 0;
  const feed = wobble(1651.1, tick, 1.5, 10);
  const condensate = wobble(553.6, tick, 0.8, 11);
  const ro = wobble(1097.5, tick, 1.1, 12);

  return (
    <div className="portal-page">
      <PortalPageHead title="Boilers Performance" crumb="Home / Boilers" layout="split" />
      <div className="filter-bar">
        <label>From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button type="button" className="btn-display">Display</button>
      </div>
      <h3 className="section-title">Steam Generation and Consumption Report</h3>
      <div className="boiler-kpi-row">
        <div className="boiler-kpi green"><span className="kpi-gear">âš™</span><div><strong>Gas consumed</strong><b>0.00</b><small>0.00 (MÂ³)</small></div></div>
        <div className="boiler-kpi blue"><span className="kpi-gear">âš™</span><div><strong>Feed Water</strong><b>{formatNumber(feed)}</b><small>1.02 (MÂ³)</small></div></div>
        <div className="boiler-kpi teal"><span className="kpi-gear">âš™</span><div><strong>Condensate Water</strong><b>{formatNumber(condensate)}</b><small>(MÂ³)</small></div></div>
        <div className="boiler-kpi amber"><span className="kpi-gear">âš™</span><div><strong>RO Water</strong><b>{formatNumber(ro)}</b><small>(MÂ³)</small></div></div>
      </div>
      <div className="boiler-split">
        <div>
          <h4>Steam Generated (Tons)</h4>
          <StackBarChart rows={generated} variant="generated" unit="T" max={genTotal || 1} />
        </div>
        <div>
          <h4>Steam Consumed (Tons)</h4>
          <StackBarChart rows={consumed} variant="consumed" unit="T" max={conTotal || 1} />
        </div>
      </div>
      <div className="boiler-footer-stats">
        <div><b>{formatNumber(genTotal)}</b><span>TOTAL GENERATED</span></div>
        <div><b>{formatNumber(conTotal)}</b><span>TOTAL CONSUMED</span></div>
        <div><b className="text-red">{formatNumber(diff)}</b><span>DIFFERENCE</span></div>
        <div><b>{formatNumber(percent)}</b><span>PERCENT</span></div>
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
      <PortalPageHead title="Boilers Status" crumb="Home / Boilers Status" />
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
              <span className={`power-dot ${unit.status}`}>â»</span>
            </div>
            <p>Steam: {unit.steam}</p>
            <p>Pressure: {unit.pressure}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function hxTone(status: string, value: string | number): string {
  if (status === 'disconnected') return 'zero';
  if (status === 'stopped') return 'warn';
  const raw = typeof value === 'string' ? value.replace(/[()]/g, '') : value;
  const numeric = parseReading(raw);
  if (numeric === null || numeric === 0) return 'zero';
  return 'running';
}

function liveHxValue(value: string | number, status: string, tick: number, seed: number): string | number {
  const base = parseReading(value);
  if (base === null || status !== 'running' || base === 0) return value;
  const amp = Math.abs(base) > 1000 ? 0 : Math.max(Math.abs(base) * 0.008, 0.05);
  if (amp === 0) return value;
  return formatLike(value, wobble(base, tick, amp, seed));
}

export const HeatExchangerCardsPage: React.FC = () => {
  const tick = useTelemetryTick();
  const [focusId, setFocusId] = useState('pad-01');
  const focus = heatExchangerCards.find((card) => card.id === focusId) ?? heatExchangerCards[0];
  const deltaRows = (focus?.rows ?? []).filter((row) => row.label.startsWith('Delta T'));

  return (
    <div className="portal-page">
      <PortalPageHead title="Heat Exchangers" crumb="Home / Heat Exchangers" layout="split" />
      <div className="hx-delta">
        <table>
          <tbody>
            {deltaRows.map((row, index) => {
              const value = liveHxValue(row.value, focus.status, tick, index + 20);
              const numeric = parseReading(typeof value === 'string' ? value.replace(/[()]/g, '') : value);
              const alarm = numeric === null || numeric === 0;
              return (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.unit || 'Î”T'}</td>
                  <td className={alarm ? 'alarm' : 'ok'}>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <span className="hx-delta-name">{focus?.name}</span>
      </div>
      <div className="hx-legend">
        <span><i className="dot running" /> Running</span>
        <span><i className="dot stopped" /> Stopped</span>
        <span><i className="dot disconnected" /> Disconnected</span>
      </div>
      <div className="hx-grid">
        {heatExchangerCards.map((card) => (
          <article key={card.id} className={`hx-card ${card.id === focus.id ? 'focused' : ''}`}>
            <header>
              <h3>{card.name}</h3>
              <button
                type="button"
                className={`power-dot ${card.status}`}
                onClick={() => setFocusId(card.id)}
                aria-label={`Show ${card.name} delta`}
              >
                â»
              </button>
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
                {card.rows.map((row, index) => {
                  const value = liveHxValue(row.value, card.status, tick, index + card.name.length);
                  return (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>{row.unit}</td>
                      <td className={`hx-val ${hxTone(card.status, value)}`}>{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        ))}
      </div>
    </div>
  );
};

export const DevicesGridPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const tick = useTelemetryTick();
  const needle = query.trim().toLowerCase();
  const shown = deviceCards.filter((device) => {
    if (!needle) return true;
    return (
      device.title.toLowerCase().includes(needle) ||
      device.protocol.toLowerCase().includes(needle) ||
      device.address.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="portal-page">
      <PortalPageHead
        title="Devices"
        crumb="Home / Devices"
        layout="split"
        metaExtra={<p className="portal-asof portal-online-count">{shown.length} online</p>}
      />
      <div className="device-toolbar">
        <input
          className="device-search"
          type="search"
          placeholder="Search machine, protocol, or IP"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="device-grid">
        {shown.length === 0 ? (
          <p className="device-grid-empty">No devices match your search. Try protocol name or IP octets.</p>
        ) : (
        shown.map((device, index) => {
          const open = openId === device.id;
          const flow = wobble(1.8, tick, 0.35, index + 1);
          const kw = wobble(42, tick, 3.5, index + 4);
          return (
            <article key={device.id} className="device-card">
              <div className="device-card-top">
                <div>
                  <h3>{device.title}</h3>
                  <p>{device.protocol}</p>
                  <p className="device-addr">{device.address}</p>
                </div>
                <DeviceGauge seed={index + 2} tick={tick} label={device.title} />
              </div>
              {open && (
                <p className="device-live">
                  Live Â· {formatNumber(flow)} TPH steam Â· {formatNumber(kw, 1)} kW
                </p>
              )}
              <button type="button" className="device-more" onClick={() => setOpenId(open ? null : device.id)}>
                {open ? 'Hide info' : 'More info'} â„¹
              </button>
            </article>
          );
        }))}
      </div>
    </div>
  );
};

const GRID_STATIONS = [
  { name: 'Sub Station 2', kva: 'Total Load 1,091 kW', tone: 'green', kw: 1091 },
  { name: 'Sub Station 3', kva: '1600 kVA', tone: 'green', kw: 980 },
  { name: 'Sub Station 4', kva: '1500 kVA', tone: 'green', kw: 1090 },
  { name: 'Sub Station 5A', kva: '1000 kVA', tone: 'green', kw: 640 },
  { name: 'Sub Station 5B', kva: '1500 kVA', tone: 'alert', kw: 980 },
  { name: 'Sub Station 7', kva: '1600 kVA', tone: 'green', kw: 1210 },
  { name: 'Sub Station 9', kva: '1600 kVA', tone: 'green', kw: 880 },
  { name: 'Muslim Cotton', kva: '750 kVA', tone: 'teal', kw: 410 },
  { name: 'Sub Station 1', kva: '1500 kVA', tone: 'green', kw: 1320 },
  { name: 'Sub Station 8', kva: '2500 kVA', tone: 'green', kw: 980 },
  { name: 'Sub Station 10', kva: '1500 kVA', tone: 'green', kw: 640 },
];

export const GridDashboardPage: React.FC = () => {
  const tick = useTelemetryTick();
  const feeder = wobble(4.62, tick, 0.04, 2);

  return (
    <div className="portal-page">
      <PortalPageHead title="Grid Dashboard" crumb="Home / Grid Dashboard" layout="split" />
      <div className="sld-canvas">
        <div className="dye-load">
          <span className="tf-bolt">âš¡</span>
          <div>
            <b>Dyeing Load</b>
            <span>0 (KW)</span>
          </div>
        </div>
        <p className="gen-note">Running Load Display For Individual Genset</p>
        <div className="gen-row labeled">
          {[
            ['Gen #05', 'G', 1091],
            ['Gen #06', 'G', 980],
            ['Gen #07', 'G', 0],
            ['Gen #08', 'G', 864],
            ['Gen #09', 'G', 742],
            ['DG #01', 'D', 0],
            ['DG #02', 'D', 0],
          ].map(([name, mark, base], index) => {
            const live = Number(base) === 0 ? 0 : wobble(Number(base), tick, 12, index + 6);
            return (
              <div key={String(name)} className="gen-stack">
                <small>{name}</small>
                <div className={`gen-circle ${mark === 'D' ? 'diesel' : ''}`}>{mark}</div>
                <small>{formatNumber(live, 0)} kW</small>
              </div>
            );
          })}
        </div>
        <div className="sld-power">
          <div className="sld-sources">
            <div className="tf-row">
              {['Transformer #03', 'Transformer #02', 'Transformer #01'].map((name) => (
                <div key={name} className="tf-box">
                  <span className="tf-bolt">âš¡</span>
                  {name}
                  <small>2500 kVA</small>
                </div>
              ))}
            </div>
            <div className="bus-lines" aria-hidden="true">
              <span className="bus blue" />
              <span className="bus red" />
              <span className="bus gold" />
            </div>
            <div className="feeder-box">
              <span className="tower-icon">âš¡</span>
              <strong>K.E 1 (Dedicated Feeder)</strong>
              <span>Sanctioned load 4.8 MW</span>
              <b>{formatNumber(feeder)} MW live</b>
            </div>
            <div className="feeder-box">
              <span className="tower-icon">âš¡</span>
              <strong>K.E 2 (Local Feeder)</strong>
              <span>Sanctioned load 0.3 MW</span>
              <b>{formatNumber(wobble(0.18, tick, 0.01, 9))} MW live</b>
            </div>
          </div>
          <div className="sld-right">
            {GRID_STATIONS.map((station, index) => {
              const liveKw = wobble(station.kw, tick, Math.max(station.kw * 0.012, 4), index + 3);
              return (
                <div key={station.name} className="sub-row">
                  <div className={`sub-box ${station.tone}`}>
                    <span className="tf-bolt">âš¡</span>
                    <span>
                      {station.name}
                      <small>{station.kva}</small>
                      <small className="sub-live">{formatNumber(liveKw, 0)} kW</small>
                    </span>
                  </div>
                  <div className="dist-box">Distribution</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GRID2_STATIONS = [
  { name: 'Sub Station 2', kva: '1500 kVA', tone: 'green', kw: 1091 },
  { name: 'Sub Station 3', kva: '1500 kVA', tone: 'green', kw: 980 },
  { name: 'Sub Station 4', kva: '1500 kVA', tone: 'green', kw: 1040 },
  { name: 'Sub Station 5A', kva: '1000 kVA', tone: 'green', kw: 620 },
  { name: 'Sub Station 5B', kva: '1500 kVA', tone: 'alert', kw: 980 },
  { name: 'Sub Station 7', kva: '1500 kVA', tone: 'green', kw: 1100 },
  { name: 'Sub Station 9', kva: '1500 kVA', tone: 'green', kw: 860 },
  { name: 'Workshop LT', kva: '750 kVA', tone: 'green', kw: 240 },
  { name: 'ZTA LT', kva: '750 kVA', tone: 'green', kw: 190 },
  { name: 'Sub Station 1', kva: '1500 kVA', tone: 'green', kw: 1240 },
  { name: 'Sub Station 8', kva: '1500 kVA', tone: 'green', kw: 770 },
  { name: 'Sub Station 10 Panel', kva: '1500 kVA', tone: 'green', kw: 690 },
  { name: 'Sub Station 10 Panel 2', kva: '1500 kVA', tone: 'green', kw: 540 },
  { name: 'Sub Station 11', kva: '1500 kVA', tone: 'green', kw: 480 },
  { name: 'Muslim Cotton', kva: '1500 kVA', tone: 'green', kw: 410 },
  { name: 'Sub Station 6', kva: '1500 kVA', tone: 'green', kw: 360 },
];

export const GridDashboard2Page: React.FC = () => {
  const tick = useTelemetryTick();
  const dedicated = wobble(3.92, tick, 0.05, 4);
  const local = wobble(0.18, tick, 0.01, 5);

  return (
    <div className="portal-page">
      <PortalPageHead title="Grid Dashboard-2" crumb="Home / Grid Dashboard-2" layout="split" />
      <div className="sld-canvas tall">
        <div className="gen-row labeled">
          {[
            ['Gen #05', 'G', 1091],
            ['Gen #06', 'G', 980],
            ['Gen #07', 'G', 0],
            ['Gen #08', 'G', 864],
            ['Gen #09', 'G', 742],
            ['DG #01', 'D', 0],
            ['DG #02', 'D', 0],
          ].map(([name, mark, base], index) => {
            const live = Number(base) === 0 ? 0 : wobble(Number(base), tick, 12, index + 11);
            return (
              <div key={String(name)} className="gen-stack">
                <small>{name}</small>
                <div className={`gen-circle ${mark === 'D' ? 'diesel' : ''}`}>{mark}</div>
                <small>{formatNumber(live, 0)} kW</small>
              </div>
            );
          })}
        </div>
        <div className="sld-power">
          <div className="sld-sources">
            <div className="tf-row">
              {['T03', 'T02', 'T01'].map((name) => (
                <div key={name} className="tf-box">
                  <span className="tf-bolt">âš¡</span>
                  {name}
                  <small>2500 kVA</small>
                </div>
              ))}
            </div>
            <div className="bus-lines dashed" aria-hidden="true">
              <span className="bus blue" />
              <span className="bus red" />
              <span className="bus gold" />
            </div>
            <div className="feeder-box">
              <span className="tower-icon">âš¡</span>
              <strong>K.E 1 (Dedicated Feeder)</strong>
              <span>Sanctioned load 4.8 MW</span>
              <b>{formatNumber(dedicated)} MW live</b>
            </div>
            <div className="bus-lines" aria-hidden="true">
              <span className="bus gold" />
            </div>
            <div className="feeder-box">
              <span className="tower-icon">âš¡</span>
              <strong>K.E 2 (Local Feeder)</strong>
              <span>Sanctioned load 0.3 MW</span>
              <b>{formatNumber(local)} MW live</b>
            </div>
          </div>
          <div className="sld-right">
            {GRID2_STATIONS.map((station, index) => {
              const liveKw = wobble(station.kw, tick, Math.max(station.kw * 0.012, 3), index + 8);
              return (
                <div key={station.name} className="sub-row">
                  <div className={`sub-box ${station.tone}`}>
                    <span className="tf-bolt">âš¡</span>
                    <span>
                      {station.name}
                      <small>{station.kva}</small>
                      <small className="sub-live">{formatNumber(liveKw, 0)} kW</small>
                    </span>
                  </div>
                  <div className="dist-box">Distribution</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GridStatusPage: React.FC = () => (
  <div className="portal-page">
    <PortalPageHead title="Grid Status" crumb="Home / Grid Status" />
    <div className="split-table-wrap wide scroll-hint">
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

export { ETPDashboardPage, RONetworkPage } from './EtpRoPages';
