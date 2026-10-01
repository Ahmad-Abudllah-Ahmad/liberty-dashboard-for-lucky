import React, { useEffect, useMemo, useState } from 'react';

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

type ViewMode = 'table' | 'chart' | 'report';

const toneClass = (tone?: MonitorRow['tone']) => {
  if (tone === 'ok') return 'cell-ok';
  if (tone === 'bad') return 'cell-bad';
  if (tone === 'warn') return 'cell-warn';
  return '';
};

const parseNum = (value: string | number | undefined): number | null => {
  if (value === undefined || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value).trim();
  const wrapped = text.match(/^\((.+)\)$/);
  const raw = (wrapped ? `-${wrapped[1]}` : text).replace(/,/g, '');
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNum = (value: number, sample: string | number): string | number => {
  if (typeof sample === 'number') {
    const decimals = String(sample).includes('.') ? (String(sample).split('.')[1] || '').length : 0;
    return Number(value.toFixed(Math.min(decimals || 2, 3)));
  }
  const text = String(sample);
  if (/^\(.+\)$/.test(text)) return `(${Math.abs(value).toFixed(1)})`;
  if (text.includes(',')) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
  const decimals = (text.split('.')[1] || '').length;
  return value.toFixed(decimals || (Number.isInteger(value) ? 0 : 2));
};

const formatClock = (date: Date) =>
  date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

const Sparkline: React.FC<{ points: number[]; tone?: MonitorRow['tone'] }> = ({ points, tone }) => {
  const color = tone === 'bad' ? '#dc2626' : tone === 'warn' ? '#d97706' : '#2563eb';
  if (points.length < 2) {
    return <div className="spark-empty">Collecting live samples…</div>;
  }
  const width = 320;
  const height = 88;
  const pad = 6;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points
    .map((point, index) => {
      const x = pad + (index / (points.length - 1)) * (width - pad * 2);
      const y = height - pad - ((point - min) / span) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2.2" points={coords} />
    </svg>
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
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('table');
  const [clock, setClock] = useState<Date>(() => new Date());
  const [liveRows, setLiveRows] = useState<MonitorRow[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return machines;
    return machines.filter((m) => m.name.toLowerCase().includes(q));
  }, [machines, query]);

  const selected = machines.find((m) => m.id === selectedId) || machines[0];

  useEffect(() => {
    setLiveRows(selected.rows);
    const seed: Record<string, number[]> = {};
    selected.rows.forEach((row) => {
      const numeric = parseNum(row.value);
      if (numeric !== null) seed[row.label] = [numeric];
    });
    setHistory(seed);
  }, [selected.id, selected.rows]);

  useEffect(() => {
    if (view === 'table') return undefined;
    const timer = window.setInterval(() => {
      const now = new Date();
      setClock(now);
      const stamp = formatClock(now);
      setLiveRows((prev) => {
        const nextRows = prev.map((row) => {
          const current = parseNum(row.value);
          if (current === null) return { ...row, date: stamp };
          const drift = Math.max(0.02, Math.abs(current) * 0.004);
          const next = current + (Math.random() - 0.48) * drift * 2;
          const setPoint = parseNum(row.setValue);
          const tolerance = parseNum(row.tolerance) ?? 5;
          let tone = row.tone;
          let difference = row.difference;
          if (setPoint !== null) {
            const delta = next - setPoint;
            difference = formatNum(delta, row.difference ?? delta);
            const percent = setPoint === 0 ? (next === 0 ? 0 : 100) : Math.abs(delta / setPoint) * 100;
            tone = percent <= tolerance ? 'ok' : 'bad';
          }
          return {
            ...row,
            value: formatNum(next, row.value),
            difference,
            tone,
            date: stamp,
          };
        });
        setHistory((hist) => {
          const nextHist: Record<string, number[]> = { ...hist };
          nextRows.forEach((row) => {
            const numeric = parseNum(row.value);
            if (numeric === null) return;
            nextHist[row.label] = [...(nextHist[row.label] || []), numeric].slice(-40);
          });
          return nextHist;
        });
        return nextRows;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [view]);

  const toggleView = (next: ViewMode) => {
    setView((current) => (current === next ? 'table' : next));
  };

  const chartRows = liveRows.filter((row) => parseNum(row.value) !== null);
  const passCount = liveRows.filter((row) => row.tone === 'ok').length;
  const failCount = liveRows.filter((row) => row.tone === 'bad').length;

  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>{title}</h2>
        <p className="portal-crumb">Home / {breadcrumb}</p>
      </div>

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
            />
          </div>
          <div className="split-list-body">
            {filtered.map((machine) => (
              <button
                key={machine.id}
                type="button"
                className={`split-list-item ${machine.id === selected.id ? 'active' : ''}`}
                onClick={() => setSelectedId(machine.id)}
              >
                {machine.name}
              </button>
            ))}
          </div>
        </aside>

        <section className="split-detail">
          <div className="split-detail-bar">
            <h3>{selected.name}</h3>
            <div className="split-detail-actions">
              <button
                type="button"
                className={`btn-ghost-link ${view === 'chart' ? 'active' : ''}`}
                onClick={() => toggleView('chart')}
              >
                Chart
              </button>
              <button
                type="button"
                className={`btn-ghost-link ${view === 'report' ? 'active' : ''}`}
                onClick={() => toggleView('report')}
              >
                Report
              </button>
            </div>
          </div>

          {mode === 'tags' && view === 'table' && (
            <div className="split-tabs">
              <button
                type="button"
                className={tab === 'tags' ? 'active' : ''}
                onClick={() => setTab('tags')}
              >
                TAGS
              </button>
              <button
                type="button"
                className={tab === 'consumption' ? 'active' : ''}
                onClick={() => setTab('consumption')}
              >
                CONSUMPTION
              </button>
            </div>
          )}

          {view === 'chart' && (
            <div className="live-pane">
              <div className="live-pane-meta">
                <span className="live-dot" />
                <strong>LIVE CHART</strong>
                <span>{selected.name} • {formatClock(clock)}</span>
              </div>
              {chartRows.length === 0 ? (
                <p className="empty-table-note">No numeric tags are available for this machine.</p>
              ) : (
                <div className="live-chart-grid">
                  {chartRows.map((row) => (
                    <article key={row.label} className="live-chart-card">
                      <header>
                        <h4>{row.label}</h4>
                        <strong className={toneClass(row.tone)}>
                          {row.value} <small>{row.unit}</small>
                        </strong>
                      </header>
                      <Sparkline points={history[row.label] || []} tone={row.tone} />
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'report' && (
            <div className="live-pane report-pane">
              <div className="live-pane-meta">
                <span className="live-dot" />
                <strong>LIVE REPORT</strong>
                <span>Refreshed {formatClock(clock)}</span>
              </div>
              <div className="live-report">
                <header>
                  <h3>Liberty Mills Limited</h3>
                  <p>{title} • {selected.name}</p>
                  <p>Generated {formatClock(clock)} • Real-time SCADA feed</p>
                </header>
                <div className="report-kpis">
                  <div>
                    <b>{liveRows.length}</b>
                    <span>Parameters</span>
                  </div>
                  <div>
                    <b className="ok">{passCount}</b>
                    <span>In tolerance</span>
                  </div>
                  <div>
                    <b className="bad">{failCount}</b>
                    <span>Out of tolerance</span>
                  </div>
                </div>
                <table className="portal-table">
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
                    {liveRows.map((row, index) => (
                      <tr key={`${selected.id}-report-${index}`}>
                        <td>{row.label}</td>
                        {mode === 'quality' ? (
                          <>
                            <td>{row.date}</td>
                            <td>{row.tolerance}</td>
                            <td>{row.unit}</td>
                            <td className="cell-set">{row.setValue}</td>
                            <td className={`cell-act ${toneClass(row.tone)}`}>{row.value}</td>
                            <td className={toneClass(row.tone)}>{row.difference}</td>
                          </>
                        ) : (
                          <>
                            <td>{row.tag ?? ''}</td>
                            <td>{row.date}</td>
                            <td>{row.unit}</td>
                            <td className={toneClass(row.tone)}>{row.value}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'table' && (
            <div className="split-table-wrap">
              <table className="portal-table">
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
                  {tab === 'consumption' && mode === 'tags' ? (
                    <tr>
                      <td colSpan={5} className="empty-table-note">
                        Consumption history is available after the selected shift closes.
                      </td>
                    </tr>
                  ) : (
                    selected.rows.map((row, index) => (
                      <tr key={`${selected.id}-${index}`}>
                        <td>{row.label}</td>
                        {mode === 'quality' ? (
                          <>
                            <td>{row.date}</td>
                            <td>{row.tolerance}</td>
                            <td>{row.unit}</td>
                            <td className="cell-set">{row.setValue}</td>
                            <td className={`cell-act ${toneClass(row.tone)}`}>{row.value}</td>
                            <td className={toneClass(row.tone)}>{row.difference}</td>
                          </>
                        ) : (
                          <>
                            <td>{row.tag ?? ''}</td>
                            <td>{row.date}</td>
                            <td>{row.unit}</td>
                            <td className={toneClass(row.tone)}>{row.value}</td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
