import React, { useEffect, useMemo, useState } from 'react';
import { PortalPageHead } from '../portal/PortalPageHead';
import { formatLike, formatPortalAsOf, parseReading } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';

export type MonitorRow = {
  label: string;
  tag?: string | number;
  date?: string;
  unit?: string;
  value: string | number;
  setValue?: string | number;
  tolerance?: string | number;
  difference?: string | number;
  tone?: 'ok' | 'bad' | 'warn' | 'neutral';
};

export type MonitorMachine = {
  id: string;
  name: string;
  rows: MonitorRow[];
  consumptionRows?: MonitorRow[];
};

interface SplitMonitorProps {
  title: string;
  breadcrumb: string;
  machines: MonitorMachine[];
  listHeader?: string;
  mode: 'quality' | 'tags';
  defaultId?: string;
  parentLabel?: string;
}

const toneClass = (tone?: MonitorRow['tone']) => {
  if (tone === 'ok') return 'cell-ok';
  if (tone === 'bad') return 'cell-bad';
  if (tone === 'warn') return 'cell-warn';
  return '';
};

function liveActual(row: MonitorRow, tick: number, seed: number): string | number {
  const base = parseReading(row.value);
  if (base === null || base === 0) return row.value;
  const counter = /totalizer|energy|kwh/i.test(row.label) || Math.abs(base) > 5000;
  if (counter) {
    const step = Math.max(Math.abs(base) * 0.000008, 0.02);
    return formatLike(row.value, base + tick * step);
  }
  const amp = Math.max(Math.abs(base) * 0.006, 0.04);
  const wave = Math.sin(tick * 0.65 + seed) * amp + Math.cos(tick * 0.31 + seed) * amp * 0.35;
  const next = base < 0 ? Math.min(-0.01, base + wave) : Math.max(0, base + wave);
  return formatLike(row.value, next);
}

function qualityTone(setValue: string | number | undefined, actual: string | number, tolerance: string | number | undefined): MonitorRow['tone'] {
  const set = parseReading(setValue);
  const act = parseReading(actual);
  if (set === null || act === null) return 'neutral';
  const tol = Number(tolerance) || 5;
  if (set === 0) return Math.abs(act) < 0.05 ? 'ok' : 'bad';
  return (Math.abs(act - set) / Math.abs(set)) * 100 <= tol ? 'ok' : 'bad';
}

const CompareChart: React.FC<{ rows: MonitorRow[] }> = ({ rows }) => {
  const [active, setActive] = useState<number | null>(null);
  const points = rows
    .map((row) => {
      const set = parseReading(row.setValue);
      const actual = parseReading(row.value);
      if (set === null || actual === null) return null;
      return { label: row.label, set, actual };
    })
    .filter((row): row is { label: string; set: number; actual: number } => row !== null)
    .slice(0, 8);

  if (points.length === 0) {
    return (
      <div className="monitor-chart monitor-chart-empty">
        <p>No numeric set/actual pairs to chart for this machine.</p>
      </div>
    );
  }
  const max = Math.max(...points.flatMap((row) => [row.set, row.actual, 1]));
  const tip = active !== null ? points[active] : null;

  return (
    <div className="monitor-chart monitor-chart-interactive" onMouseLeave={() => setActive(null)}>
      <div className="monitor-chart-key">
        <span><i className="swatch set" /> Set</span>
        <span><i className="swatch act" /> Actual</span>
      </div>
      {tip && (
        <div className="chart-hover-tip" role="status">
          <strong>{tip.label}</strong>
          <span>Set {tip.set.toFixed(2)} · Actual {tip.actual.toFixed(2)} · Δ {(tip.actual - tip.set).toFixed(2)}</span>
        </div>
      )}
      {points.map((row, index) => (
        <div
          key={row.label}
          className={`compare-row ${active === index ? 'is-active' : ''}`}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          <span className="compare-label" title={row.label}>{row.label}</span>
          <div className="compare-tracks">
            <div className="compare-track">
              <div className="compare-fill set" style={{ width: `${(row.set / max) * 100}%` }} />
            </div>
            <div className="compare-track">
              <div className="compare-fill act" style={{ width: `${(row.actual / max) * 100}%` }} />
            </div>
          </div>
          <strong>{row.actual.toFixed(1)}</strong>
        </div>
      ))}
    </div>
  );
};

const ConsumptionChart: React.FC<{ rows: MonitorRow[] }> = ({ rows }) => {
  const [active, setActive] = useState<number | null>(null);
  const points = rows
    .map((row) => {
      const value = parseReading(row.value);
      if (value === null) return null;
      return { label: row.label, value: Math.abs(value), unit: row.unit ?? '' };
    })
    .filter((row): row is { label: string; value: number; unit: string } => row !== null)
    .slice(0, 8);
  if (points.length === 0) return null;
  const max = Math.max(...points.map((row) => row.value), 1);
  const tip = active !== null ? points[active] : null;

  return (
    <div className="monitor-chart monitor-chart-interactive" onMouseLeave={() => setActive(null)}>
      <p className="monitor-chart-title">Shift consumption</p>
      {tip && (
        <div className="chart-hover-tip" role="status">
          <strong>{tip.label}</strong>
          <span>
            {tip.value >= 100 ? tip.value.toFixed(0) : tip.value.toFixed(2)} {tip.unit} ·{' '}
            {((tip.value / max) * 100).toFixed(0)}% of peak
          </span>
        </div>
      )}
      {points.map((row, index) => (
        <div
          key={row.label}
          className={`compare-row ${active === index ? 'is-active' : ''}`}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          <span className="compare-label" title={row.label}>{row.label}</span>
          <div className="compare-track single">
            <div className="compare-fill act" style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
          <strong>
            {row.value >= 100 ? row.value.toFixed(0) : row.value.toFixed(2)} {row.unit}
          </strong>
        </div>
      ))}
    </div>
  );
};

export const SplitMonitor: React.FC<SplitMonitorProps> = ({
  title,
  breadcrumb,
  machines,
  listHeader = 'Machines',
  mode,
  defaultId,
  parentLabel,
}) => {
  const [selectedId, setSelectedId] = useState<string>(defaultId || machines[0]?.id);
  const [tab, setTab] = useState<'tags' | 'consumption'>('tags');

  useEffect(() => {
    const machine = machines.find((item) => item.id === selectedId) ?? machines[0];
    if (!machine) return;
    if (machine.rows.length === 0 && machine.consumptionRows?.length) {
      setTab('consumption');
      return;
    }
    if (!machine.consumptionRows?.length) setTab('tags');
  }, [selectedId, machines]);
  const [query, setQuery] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const tick = useTelemetryTick();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return machines;
    return machines.filter((m) => m.name.toLowerCase().includes(q));
  }, [machines, query]);

  const selected = machines.find((m) => m.id === selectedId) ?? machines[0];
  if (!selected) {
    return (
      <div className="portal-page">
        <PortalPageHead title={title} crumb={`Home / ${breadcrumb}`} layout="split" />
        <p className="empty-table-note">No machines configured for this view.</p>
      </div>
    );
  }
  const stamp = formatPortalAsOf();

  const sourceRows = tab === 'consumption' && selected.consumptionRows?.length
    ? selected.consumptionRows
    : selected.rows;

  const rows = sourceRows.map((row, index) => {
    const value = liveActual(row, tick, index + 3);
    if (mode !== 'quality') return { ...row, value, date: stamp };
    const set = parseReading(row.setValue);
    const actual = parseReading(value);
    const difference = set !== null && actual !== null ? Number((actual - set).toFixed(2)) : row.difference;
    return {
      ...row,
      value,
      date: stamp,
      difference,
      tone: qualityTone(row.setValue, value, row.tolerance),
    };
  });

  const outside = rows.filter((row) => row.tone === 'bad').length;
  const inside = rows.filter((row) => row.tone === 'ok').length;

  return (
    <div className="portal-page">
      <PortalPageHead title={title} crumb={`Home / ${breadcrumb}`} layout="split" />

      <div className="split-monitor">
        <aside className="split-list">
          <div className={`split-list-head ${parentLabel ? 'is-parent' : ''}`}>
            {parentLabel || listHeader}
          </div>
          <div className="split-list-search">
            <input
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Search ${listHeader}`}
            />
            <p className="split-list-meta">
              {filtered.length === machines.length
                ? `${machines.length} machines`
                : `${filtered.length} of ${machines.length} shown`}
            </p>
          </div>
          <div className="split-list-body">
            {filtered.length === 0 ? (
              <p className="split-list-empty">No machines match &ldquo;{query.trim()}&rdquo;</p>
            ) : (
              filtered.map((machine) => (
                <button
                  key={machine.id}
                  type="button"
                  className={`split-list-item ${machine.id === selected?.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(machine.id)}
                >
                  {machine.name}
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="split-detail">
          <div className="split-detail-bar">
            <h3>
              {selected.name}
              <span className="split-detail-count">
                {rows.length} {tab === 'consumption' ? 'meters' : mode === 'quality' ? 'parameters' : 'tags'}
              </span>
            </h3>
            <div className="split-detail-actions">
              <button
                type="button"
                className={`btn-ghost-link ${showChart ? 'on' : ''}`}
                onClick={() => setShowChart((open) => !open)}
                aria-pressed={showChart}
              >
                Chart
              </button>
              <button
                type="button"
                className={`btn-ghost-link ${showReport ? 'on' : ''}`}
                onClick={() => setShowReport((open) => !open)}
                aria-pressed={showReport}
              >
                Report
              </button>
            </div>
          </div>

          {showReport && (
            <p className="monitor-report">
              {inside} within tolerance · {outside} outside tolerance · polled {stamp}
            </p>
          )}

          {mode === 'tags' && (
            <div className="split-tabs">
              <button type="button" className={tab === 'tags' ? 'active' : ''} onClick={() => setTab('tags')}>
                TAGS
              </button>
              <button
                type="button"
                className={tab === 'consumption' ? 'active tab-consumption' : 'tab-consumption'}
                onClick={() => setTab('consumption')}
              >
                CONSUMPTION
              </button>
            </div>
          )}

          {showChart && mode === 'quality' && <CompareChart rows={rows} />}
          {showChart && mode === 'tags' && tab === 'tags' && <ConsumptionChart rows={rows} />}
          {showChart && mode === 'tags' && tab === 'consumption' && <ConsumptionChart rows={rows} />}

          <div className="split-table-wrap">
            <table className="portal-table sticky">
              <thead>
                {mode === 'quality' ? (
                  <tr>
                    <th>Label</th>
                    <th>Date</th>
                    <th>Tolerance %</th>
                    <th>Unit</th>
                    <th>Set Value</th>
                    <th>Act. Value</th>
                    <th>Difference</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Label</th>
                    <th>Tag</th>
                    <th>Date</th>
                    <th>Unit</th>
                    <th>Value</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={mode === 'quality' ? 7 : 5} className="empty-table-note">
                      {tab === 'consumption'
                        ? 'No consumption meters configured for this machine.'
                        : 'No live tags available for this machine.'}
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr key={`${selected.id}-${index}`}>
                      <td className="cell-label">{row.label}</td>
                      {mode === 'quality' ? (
                        <>
                          <td className="num-cell">{row.date}</td>
                          <td className="num-cell">{row.tolerance}</td>
                          <td>{row.unit}</td>
                          <td className="cell-set num-cell">{row.setValue}</td>
                          <td className="cell-act num-cell">{row.value}</td>
                          <td className={`num-cell ${toneClass(row.tone)}`}>{row.difference}</td>
                        </>
                      ) : (
                        <>
                          <td className="num-cell">{row.tag ?? ''}</td>
                          <td className="num-cell">{row.date}</td>
                          <td>{row.unit}</td>
                          <td className={`num-cell ${toneClass(row.tone)}`}>{row.value}</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
