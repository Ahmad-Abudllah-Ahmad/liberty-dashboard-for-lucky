import React, { useEffect, useMemo, useState } from 'react';
import { ChartHoverTip } from '../charts/PortalCharts';

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
  group?: string;
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

type ViewMode = 'table' | 'chart' | 'report' | 'hmi';
type SortKey = 'label' | 'tag' | 'date' | 'tolerance' | 'unit' | 'setValue' | 'value' | 'difference';

const HMI_SCREENS: Record<string, string[]> = {
  '/hmi/scada-main-screen.html': [
    'bleaching-01',
    'bleaching-02',
    'bleaching-03',
    'bleaching-01-live',
    'bleaching-02-live',
    'bleaching-03-live',
  ],
  '/hmi/canlar.html': ['canlar-150', 'canlar-1500', 'canlar-50'],
  '/hmi/reggiani.html': ['reggiani-01', 'reggiani-02', 'reggiani-03', 'reggiani-04', 'reggiani-05', 'reggiani-06'],
  '/hmi/stenter-monforts.html': ['stenter-14', 'stenter-15', 'stenter-22'],
  '/hmi/stenter-redflag.html': ['stenter-19', 'stenter-20', 'stenter-21'],
  '/hmi/mercerize.html': ['mercerize'],
  '/hmi/pad-steam.html': ['pad-steam-01', 'pad-steam-02'],
  '/hmi/thermosol.html': ['thermosol-dyeing'],
};

const MACHINE_HMI: Record<string, string> = Object.fromEntries(
  Object.entries(HMI_SCREENS).flatMap(([src, ids]) => ids.map((id) => [id, src])),
);

const machineHasHmi = (machine: { id: string }) => Boolean(MACHINE_HMI[machine.id]);

const statusClass = (tone?: MonitorRow['tone']) => {
  if (tone === 'ok') return 'is-ok';
  if (tone === 'bad') return 'is-bad';
  if (tone === 'warn') return 'is-warn';
  return '';
};

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

const signedValue = (value: string | number | undefined) => {
  const numeric = parseNum(value);
  if (numeric === null || numeric <= 0 || value === undefined) return value ?? '';
  const text = String(value);
  return text.startsWith('+') || text.startsWith('(') ? text : `+${text}`;
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

type Sample = { t: number; v: number };

const formatTime = (time: number) =>
  new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

const axisDecimals = (span: number) => (span >= 100 ? 0 : span >= 10 ? 1 : span >= 1 ? 2 : 3);

const Sparkline: React.FC<{ samples: Sample[]; tone?: MonitorRow['tone']; label: string; unit?: string }> = ({
  samples,
  tone,
  label,
  unit,
}) => {
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const color = tone === 'bad' ? '#dc2626' : tone === 'warn' ? '#d97706' : '#283090';
  if (samples.length < 2) {
    return <div className="spark-empty">Collecting live samples…</div>;
  }
  const points = samples.map((sample) => sample.v);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const width = 320;
  const height = 88;
  const pad = 6;
  const headroom = max - min ? (max - min) * 0.1 : Math.max(Math.abs(max) * 0.05, 0.5);
  const lo = min - headroom;
  const hi = max + headroom;
  const span = hi - lo;
  const plotted = points.map((point, index) => {
    const x = pad + (index / (points.length - 1)) * (width - pad * 2);
    const y = height - pad - ((point - lo) / span) * (height - pad * 2);
    return { x, y, value: point, index };
  });
  const coords = plotted.map((point) => `${point.x},${point.y}`).join(' ');
  const tip = hover ? plotted[hover.index] : null;
  const decimals = axisDecimals(span);
  const yTicks = [hi, (hi + lo) / 2, lo].map((value, i) => ({
    value: value.toFixed(decimals),
    y: pad + (i / 2) * (height - pad * 2),
  }));
  const mid = Math.floor((samples.length - 1) / 2);
  const xTicks = [
    { time: samples[0].t, align: 'start' },
    { time: samples[mid].t, align: 'center', left: plotted[mid].x },
    { time: samples[samples.length - 1].t, align: 'end' },
  ];

  return (
    <div className="sparkline-wrap">
      <div className="spark-y-axis" aria-hidden="true">
        {yTicks.map((tick, i) => (
          <span key={i} style={{ top: tick.y }}>
            {tick.value}
          </span>
        ))}
      </div>
      <div className="spark-plot chart-interactive">
        {tip && (
          <ChartHoverTip
            className="chart-hover-tip-float"
            style={{ left: `${(tip.x / width) * 100}%`, top: Math.max(8, tip.y - 8) }}
            title={`${label} · ${tip.index + 1}/${points.length}`}
            status={{
              label: tone === 'bad' ? 'Alert' : tone === 'warn' ? 'Watch' : 'Stable',
              tone: tone === 'bad' ? 'bad' : tone === 'warn' ? 'warn' : 'ok',
            }}
            stats={[
              { label: 'Value', value: `${tip.value.toFixed(2)} ${unit || ''}`.trim() },
              { label: 'Time', value: formatTime(samples[tip.index].t) },
              { label: 'Min', value: min.toFixed(2) },
              { label: 'Max', value: max.toFixed(2) },
            ]}
          />
        )}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="sparkline"
          preserveAspectRatio="none"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - box.left) / box.width) * width;
            let nearest = plotted[0];
            let best = Math.abs(plotted[0].x - x);
            plotted.forEach((point) => {
              const distance = Math.abs(point.x - x);
              if (distance < best) {
                best = distance;
                nearest = point;
              }
            });
            setHover({ index: nearest.index, x: nearest.x, y: nearest.y });
          }}
        >
          {yTicks.map((tick, i) => (
            <line
              key={i}
              x1={0}
              x2={width}
              y1={tick.y}
              y2={tick.y}
              className="spark-grid"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            points={coords}
            vectorEffect="non-scaling-stroke"
          />
          {tip && (
            <>
              <line
                x1={tip.x}
                x2={tip.x}
                y1={pad}
                y2={height - pad}
                stroke={color}
                strokeDasharray="3 3"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={tip.x} cy={tip.y} r="4.5" fill="#ffffff" stroke={color} strokeWidth="2" />
            </>
          )}
        </svg>
      </div>
      <div className="spark-x-axis" aria-hidden="true">
        {xTicks.map((tick, i) => (
          <span
            key={i}
            className={`is-${tick.align}`}
            style={tick.left !== undefined ? { left: `${(tick.left / width) * 100}%` } : undefined}
          >
            {formatTime(tick.time)}
          </span>
        ))}
      </div>
    </div>
  );
};

const PIE_COLORS = ['#283090', '#14b8a6', '#f59e0b', '#7c3aed', '#4a51b0', '#84cc16', '#f472b6', '#64748b'];
const TREND_COLORS = ['#283090', '#7c3aed', '#3a42a8', '#d97706', '#db2777', '#16a34a'];

const movementOf = (row: MonitorRow, samples?: Sample[]): number | null => {
  const actual = parseNum(row.value);
  if (actual === null) return null;
  const setPoint = parseNum(row.setValue);
  if (setPoint !== null && setPoint !== 0) return ((actual - setPoint) / Math.abs(setPoint)) * 100;
  const base = samples?.[0]?.v;
  if (base === undefined || base === 0) return 0;
  return ((actual - base) / Math.abs(base)) * 100;
};

const ReportVisuals: React.FC<{
  rows: MonitorRow[];
  history: Record<string, Sample[]>;
  mode: 'quality' | 'tags';
}> = ({ rows, history, mode }) => {
  const [hover, setHover] = useState<string | null>(null);
  const [barHover, setBarHover] = useState<string | null>(null);
  const [trendTip, setTrendTip] = useState<{ x: number; time: number; rows: { label: string; move: number }[] } | null>(null);
  const numeric = rows.filter((row) => parseNum(row.value) !== null);
  const ranked = numeric.map((row, index) => ({
    row,
    index,
    move: movementOf(row, history[row.label]) ?? 0,
  }));
  const pieParts = [...ranked]
    .sort((a, b) => Math.abs(b.move) - Math.abs(a.move))
    .slice(0, 6)
    .map((item, index) => ({
      label: item.row.label,
      value: Math.max(Math.abs(item.move), 0.2),
      move: item.move,
      tone: item.row.tone,
      color: item.row.tone === 'bad' ? '#dc2626' : PIE_COLORS[index % PIE_COLORS.length],
    }));
  const pieTotal = pieParts.reduce((sum, part) => sum + part.value, 0) || 1;
  const pieCenter = 66;
  const pieRadius = 60;
  let pieCursor = 0;
  const pieSlices = pieParts.map((part) => {
    const sweep = (part.value / pieTotal) * 360;
    const start = pieCursor;
    pieCursor += sweep;
    const end = start + sweep;
    const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const x1 = pieCenter + pieRadius * Math.cos(rad(start));
    const y1 = pieCenter + pieRadius * Math.sin(rad(start));
    const x2 = pieCenter + pieRadius * Math.cos(rad(end));
    const y2 = pieCenter + pieRadius * Math.sin(rad(end));
    const large = sweep > 180 ? 1 : 0;
    const d =
      sweep >= 359.9
        ? ''
        : `M ${pieCenter} ${pieCenter} L ${x1} ${y1} A ${pieRadius} ${pieRadius} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...part, d, full: sweep >= 359.9 };
  });
  const scale = 10;
  const insideScale = ranked.filter((item) => Math.abs(item.move) <= 10);
  const trendRows = (insideScale.length ? insideScale : ranked).slice(0, 6);
  const trend = trendRows
    .map((item, index) => {
      const samples = history[item.row.label] || [];
      const setPoint = parseNum(item.row.setValue);
      const base = samples[0]?.v;
      const points = samples.map((sample) => {
        const move =
          setPoint !== null && setPoint !== 0
            ? ((sample.v - setPoint) / Math.abs(setPoint)) * 100
            : base
              ? ((sample.v - base) / Math.abs(base)) * 100
              : 0;
        return { t: sample.t, move };
      });
      return { label: item.row.label, color: TREND_COLORS[index % TREND_COLORS.length], points };
    })
    .filter((series) => series.points.length > 1);
  const trendLo = -10;
  const trendHi = 10;
  const trendSpan = trendHi - trendLo;
  const times = trend.flatMap((series) => series.points.map((point) => point.t));
  const t0 = times.length ? Math.min(...times) : 0;
  const t1 = times.length ? Math.max(...times) : 1;
  const plot = { w: 640, h: 220, l: 36, r: 12, t: 16, b: 24 };
  const xOf = (time: number) =>
    plot.l + ((t1 === t0 ? 0.5 : (time - t0) / (t1 - t0)) * (plot.w - plot.l - plot.r));
  const yOf = (move: number) => {
    const clamped = Math.max(trendLo, Math.min(trendHi, move));
    return plot.t + ((trendHi - clamped) / trendSpan) * (plot.h - plot.t - plot.b);
  };
  const hovered = pieParts.find((part) => part.label === hover);
  const hoveredBar = ranked.find((item) => item.row.label === barHover);

  return (
    <div className="report-visuals">
      <article className="report-visual-card">
        <h4>{mode === 'quality' ? 'Deviation share' : 'Live change share'}</h4>
        <p>Pie updates with every sample</p>
        <div className="report-donut chart-interactive" onMouseLeave={() => setHover(null)}>
          {hovered && (
            <ChartHoverTip
              title={hovered.label}
              status={{
                label: hovered.tone === 'bad' ? 'Out of tolerance' : 'In tolerance',
                tone: hovered.tone === 'bad' ? 'bad' : 'ok',
              }}
              stats={[
                { label: 'Move', value: `${hovered.move.toFixed(2)}%` },
                { label: 'Share', value: `${((hovered.value / pieTotal) * 100).toFixed(1)}%` },
              ]}
            />
          )}
          <div className="report-pie-block">
          <svg viewBox="0 0 132 132" className="report-pie" role="img" aria-label="Live deviation pie">
            <circle cx={pieCenter} cy={pieCenter} r={pieRadius} fill="#f1f5f9" />
            {pieSlices.map((part) =>
              part.full ? (
                <circle
                  key={part.label}
                  cx={pieCenter}
                  cy={pieCenter}
                  r={pieRadius}
                  fill={part.color}
                  onMouseEnter={() => setHover(part.label)}
                />
              ) : (
                <path
                  key={part.label}
                  d={part.d}
                  fill={part.color}
                  onMouseEnter={() => setHover(part.label)}
                />
              ),
            )}
          </svg>
          <div className="report-pie-count">
            <strong>{numeric.length}</strong>
            <span>live tags</span>
          </div>
          </div>
          <ul className="report-donut-legend">
            {pieParts.map((part) => (
              <li key={part.label} onMouseEnter={() => setHover(part.label)}>
                <i style={{ background: part.color }} />
                <span>{part.label}</span>
                <b>
                  {((part.value / pieTotal) * 100) < 1
                    ? '<1%'
                    : `${((part.value / pieTotal) * 100).toFixed(0)}%`}
                </b>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <article className="report-visual-card chart-interactive" onMouseLeave={() => setBarHover(null)}>
        {hoveredBar && (
          <ChartHoverTip
            title={hoveredBar.row.label}
            status={{
              label: hoveredBar.row.tone === 'bad' ? 'Out of tolerance' : 'In tolerance',
              tone: hoveredBar.row.tone === 'bad' ? 'bad' : 'ok',
            }}
            stats={[
              { label: 'Actual', value: `${hoveredBar.row.value}${hoveredBar.row.unit ? ` ${hoveredBar.row.unit}` : ''}` },
              { label: 'Set', value: hoveredBar.row.setValue === undefined || hoveredBar.row.setValue === '' ? '—' : String(hoveredBar.row.setValue) },
              { label: 'Difference', value: hoveredBar.row.difference === undefined || hoveredBar.row.difference === '' ? '—' : String(hoveredBar.row.difference) },
              { label: 'Move', value: `${hoveredBar.move >= 0 ? '+' : ''}${hoveredBar.move.toFixed(2)}%` },
            ]}
          />
        )}
        <h4>{mode === 'quality' ? 'Deviation from set' : 'Change since the report opened'}</h4>
        <p>Percent, drawn from the centre • live</p>
        <div className="report-bars">
          {ranked.map((item) => {
            const width = Math.min(50, (Math.abs(item.move) / scale) * 50);
            const positive = item.move >= 0;
            return (
              <div
                key={item.row.label}
                className={`report-bar${barHover === item.row.label ? ' is-hot' : ''}`}
                onMouseEnter={() => setBarHover(item.row.label)}
              >
                <span className="report-bar-name">{item.row.label}</span>
                <span className="report-bar-track">
                  <span className="report-bar-zero" />
                  <i
                    style={{
                      width: `${width}%`,
                      left: positive ? '50%' : `${50 - width}%`,
                      background: item.row.tone === 'bad' ? '#dc2626' : item.move >= 0 ? '#16a34a' : '#283090',
                    }}
                  />
                </span>
                <span className={`report-bar-value ${statusClass(item.row.tone)}`}>
                  {item.move >= 0 ? '+' : ''}
                  {item.move.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </article>

      <article className="report-visual-card is-wide chart-interactive" onMouseLeave={() => setTrendTip(null)}>
        {trendTip && (
          <ChartHoverTip
            title={formatTime(trendTip.time)}
            status={{ label: 'Live sample', tone: 'ok' }}
            stats={trendTip.rows.map((row) => ({
              label: row.label,
              value: `${row.move >= 0 ? '+' : ''}${row.move.toFixed(2)}%`,
            }))}
          />
        )}
        <h4>Live trend</h4>
        <p>Percent, fixed scale from -10 to +10, newest sample on the right</p>
        {trend.length === 0 ? (
          <div className="spark-empty">Collecting live samples…</div>
        ) : (
          <>
            <svg
              viewBox={`0 0 ${plot.w} ${plot.h}`}
              className="report-trend"
              role="img"
              aria-label="Live trend"
              preserveAspectRatio="none"
              onMouseLeave={() => setTrendTip(null)}
              onMouseMove={(event) => {
                if (t1 === t0) return;
                const box = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - box.left) / box.width) * plot.w;
                const span = plot.w - plot.l - plot.r;
                const ratio = Math.min(1, Math.max(0, (x - plot.l) / span));
                const time = t0 + ratio * (t1 - t0);
                const rows = trend.map((series) => {
                  let nearest = series.points[0];
                  let best = Math.abs(nearest.t - time);
                  series.points.forEach((point) => {
                    const distance = Math.abs(point.t - time);
                    if (distance < best) {
                      best = distance;
                      nearest = point;
                    }
                  });
                  return { label: series.label, move: nearest.move };
                });
                setTrendTip({ x: xOf(time), time, rows });
              }}
            >
              {[0, 0.5, 1].map((step) => {
                const value = trendLo + trendSpan * (1 - step);
                const y = yOf(value);
                return (
                  <g key={step}>
                    <line x1={plot.l} x2={plot.w - plot.r} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <text x={plot.l - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                      {value.toFixed(0)}
                    </text>
                  </g>
                );
              })}
              <line x1={plot.l} x2={plot.w - plot.r} y1={yOf(0)} y2={yOf(0)} stroke="#cbd5e1" />
              {trendTip && (
                <line x1={trendTip.x} x2={trendTip.x} y1={plot.t} y2={plot.h - plot.b} stroke="#64748b" strokeDasharray="3 3" />
              )}
              {trend.map((series) => (
                <polyline
                  key={series.label}
                  fill="none"
                  stroke={series.color}
                  strokeWidth="2"
                  points={series.points.map((point) => `${xOf(point.t)},${yOf(point.move)}`).join(' ')}
                />
              ))}
              <text x={plot.l} y={plot.h - 6} fontSize="10" fill="#94a3b8">
                {formatTime(t0)}
              </text>
              <text x={plot.w - plot.r} y={plot.h - 6} textAnchor="end" fontSize="10" fill="#94a3b8">
                {formatTime(t1)}
              </text>
            </svg>
            <ul className="report-trend-legend">
              {trend.map((series) => (
                <li key={series.label}>
                  <i style={{ background: series.color }} />
                  {series.label}
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
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
  void breadcrumb;
  const [selectedId, setSelectedId] = useState<string>(defaultId || machines[0]?.id);
  const [tab, setTab] = useState<'tags' | 'consumption'>('tags');
  const [query, setQuery] = useState('');
  const [rowQuery, setRowQuery] = useState('');
  const [toneFilter, setToneFilter] = useState<'all' | 'ok' | 'bad'>('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>('report');
  const [clock, setClock] = useState<Date>(() => new Date());
  const [liveRows, setLiveRows] = useState<MonitorRow[]>([]);
  const [history, setHistory] = useState<Record<string, Sample[]>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return machines;
    return machines.filter((m) => m.name.toLowerCase().includes(q));
  }, [machines, query]);

  const selected = machines.find((m) => m.id === selectedId) || machines[0];
  const activeMode: 'quality' | 'tags' = selected.rows.some((row) => row.setValue !== undefined)
    ? 'quality'
    : selected.rows.some((row) => row.tag !== undefined)
      ? 'tags'
      : mode;

  useEffect(() => {
    setRowQuery('');
    setToneFilter('all');
    setSort(null);
    setActiveRow(null);
    setLiveRows(selected.rows);
    const seed: Record<string, Sample[]> = {};
    const t = Date.now();
    selected.rows.forEach((row) => {
      const numeric = parseNum(row.value);
      if (numeric !== null) seed[row.label] = [{ t, v: numeric }];
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
          const nextHist: Record<string, Sample[]> = { ...hist };
          const t = now.getTime();
          nextRows.forEach((row) => {
            const numeric = parseNum(row.value);
            if (numeric === null) return;
            const series = nextHist[row.label] || [];
            if (series[series.length - 1]?.t === t) return;
            nextHist[row.label] = [...series, { t, v: numeric }].slice(-40);
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

  const tableColumns: { key: SortKey; label: string; numeric?: boolean }[] =
    activeMode === 'quality'
      ? [
          { key: 'label', label: 'Label' },
          { key: 'date', label: 'Date' },
          { key: 'tolerance', label: 'Tolerance %', numeric: true },
          { key: 'unit', label: 'Unit' },
          { key: 'setValue', label: 'Set Value', numeric: true },
          { key: 'value', label: 'Act. Value', numeric: true },
          { key: 'difference', label: 'Difference', numeric: true },
        ]
      : [
          { key: 'label', label: 'Label' },
          { key: 'tag', label: 'Tag' },
          { key: 'date', label: 'Date' },
          { key: 'unit', label: 'Unit' },
          { key: 'value', label: 'Value', numeric: true },
        ];

  const tableRows = useMemo(() => {
    const q = rowQuery.trim().toLowerCase();
    let rows = selected.rows.map((row, index) => ({ row, index }));
    if (q) {
      rows = rows.filter(({ row }) =>
        `${row.label} ${row.tag ?? ''} ${row.unit ?? ''} ${row.value}`.toLowerCase().includes(q),
      );
    }
    if (activeMode === 'quality' && toneFilter !== 'all') {
      rows = rows.filter(({ row }) => row.tone === toneFilter);
    }
    if (sort) {
      const { key, dir } = sort;
      rows = [...rows].sort((a, b) => {
        const left = a.row[key];
        const right = b.row[key];
        const leftNum = parseNum(left);
        const rightNum = parseNum(right);
        const cmp =
          leftNum !== null && rightNum !== null
            ? leftNum - rightNum
            : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true });
        return dir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [selected.rows, rowQuery, toneFilter, sort, activeMode]);

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current?.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    );
  };

  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>{title}</h2>
      </div>

      <div className={`split-monitor ${view === 'hmi' ? 'is-hmi' : 'is-live'}`}>
        <aside className="split-list">
          <button
            type="button"
            className={`split-list-head ${parentLabel ? 'is-parent' : ''}`}
            onClick={() => setView('report')}
          >
            {parentLabel || listHeader}
          </button>
          <div className="split-list-search">
            <input
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="split-list-body">
            {filtered.map((machine, index) => (
              <div key={machine.id}>
                {machine.group && machine.group !== filtered[index - 1]?.group && (
                  <div className="split-list-group">{machine.group}</div>
                )}
              <div
                className={`split-list-row ${machine.id === selected.id ? 'active' : ''}`}
              >
                {machineHasHmi(machine) && (
                  <button
                    type="button"
                    className="split-hmi-btn"
                    title={`${machine.name} HMI`}
                    onClick={() => {
                      setSelectedId(machine.id);
                      setView('hmi');
                    }}
                  >
                    HMI
                  </button>
                )}
                <button
                  type="button"
                  className="split-list-item"
                  onClick={() => {
                    setSelectedId(machine.id);
                    setView('report');
                  }}
                >
                  {machine.name}
                </button>
              </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="split-detail">
          <div className="split-detail-bar">
            <h3>{selected.name}</h3>
            <div className="split-detail-actions">
              {machineHasHmi(selected) && (
                <button
                  type="button"
                  className={`btn-ghost-link ${view === 'hmi' ? 'active' : ''}`}
                  onClick={() => toggleView('hmi')}
                >
                  HMI
                </button>
              )}
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

          {activeMode === 'tags' && view === 'table' && (
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

          {view === 'hmi' && machineHasHmi(selected) && (
            <div className="hmi-pane">
              <iframe
                key={MACHINE_HMI[selected.id]}
                title={`${selected.name} HMI`}
                src={MACHINE_HMI[selected.id]}
              />
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
                    <article key={row.label} className={`live-chart-card${row.tone === 'bad' ? ' is-red' : ''}`}>
                      <header>
                        <h4>{row.label}</h4>
                        <strong className={toneClass(row.tone)}>
                          {row.value} <small>{row.unit}</small>
                        </strong>
                      </header>
                      <Sparkline samples={history[row.label] || []} tone={row.tone} label={row.label} unit={row.unit} />
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'report' && (
            <div className="live-pane report-pane">
              <div className="live-report">
                <div className="report-first">
                <header className="report-head">
                  <h3>Lucky Textile</h3>
                  <div className="live-pane-meta">
                    <span className="live-dot" />
                    <strong>LIVE REPORT</strong>
                    <span>Refreshed {formatClock(clock)}</span>
                  </div>
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
                <ReportVisuals rows={liveRows} history={history} mode={activeMode} />
                </div>
                <table className="portal-table">
                  <thead>
                    {activeMode === 'quality' ? (
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
                        <td>
                          <span className="tag-label">
                            <i className={`tag-dot ${statusClass(row.tone)}`} />
                            {row.label}
                          </span>
                        </td>
                        {activeMode === 'quality' ? (
                          <>
                            <td>{row.date}</td>
                            <td>{row.tolerance}</td>
                            <td>{row.unit}</td>
                            <td><span className="tag-set">{row.setValue}</span></td>
                            <td><span className={`tag-pill ${statusClass(row.tone)}`}>{row.value}</span></td>
                            <td><span className={`tag-pill ${statusClass(row.tone)}`}>{row.difference}</span></td>
                          </>
                        ) : (
                          <>
                            <td>{row.tag ?? ''}</td>
                            <td>{row.date}</td>
                            <td>{row.unit}</td>
                            <td><span className={`tag-pill ${statusClass(row.tone)}`}>{row.value}</span></td>
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
            <div className="split-table-panel">
              {!(tab === 'consumption' && activeMode === 'tags') && (
                <div className="split-table-tools">
                  <input
                    type="search"
                    placeholder="Filter parameters…"
                    value={rowQuery}
                    onChange={(e) => setRowQuery(e.target.value)}
                    aria-label="Filter parameters"
                  />
                  {activeMode === 'quality' && (
                    <div className="split-table-filters" role="group" aria-label="Tolerance filter">
                      <button type="button" className={toneFilter === 'all' ? 'active' : ''} onClick={() => setToneFilter('all')}>
                        All <b>{selected.rows.length}</b>
                      </button>
                      <button type="button" className={toneFilter === 'ok' ? 'active' : ''} onClick={() => setToneFilter('ok')}>
                        In tolerance <b>{selected.rows.filter((row) => row.tone === 'ok').length}</b>
                      </button>
                      <button type="button" className={toneFilter === 'bad' ? 'active' : ''} onClick={() => setToneFilter('bad')}>
                        Out of tolerance <b>{selected.rows.filter((row) => row.tone === 'bad').length}</b>
                      </button>
                    </div>
                  )}
                  <span className="split-table-count">
                    {tableRows.length} shown
                  </span>
                </div>
              )}
              <div className="split-table-wrap">
                <table className="portal-table split-table">
                  <thead>
                    <tr>
                      {tableColumns.map((column) => (
                        <th
                          key={column.key}
                          className={column.numeric ? 'is-num' : undefined}
                          aria-sort={
                            sort?.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'
                          }
                        >
                          <button type="button" onClick={() => toggleSort(column.key)}>
                            {column.label}
                            <span className={`sort-mark${sort?.key === column.key ? ` is-${sort.dir}` : ''}`} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tab === 'consumption' && activeMode === 'tags' ? (
                      <tr>
                        <td colSpan={tableColumns.length} className="empty-table-note">
                          Consumption history is available after the selected shift closes.
                        </td>
                      </tr>
                    ) : tableRows.length === 0 ? (
                      <tr>
                        <td colSpan={tableColumns.length} className="empty-table-note">
                          No parameters match this filter.
                        </td>
                      </tr>
                    ) : (
                      tableRows.map(({ row, index }) => (
                        <tr
                          key={`${selected.id}-${index}`}
                          className={activeRow === index ? 'is-selected' : undefined}
                          onClick={() => setActiveRow((current) => (current === index ? null : index))}
                        >
                          {tableColumns.map((column) => (
                            <td key={column.key} className={column.numeric ? 'is-num' : undefined}>
                              {column.key === 'label' ? (
                                <span className="tag-label">
                                  <i className={`tag-dot ${statusClass(row.tone)}`} />
                                  {row.label}
                                </span>
                              ) : column.key === 'value' || column.key === 'difference' ? (
                                <span className={`tag-pill ${statusClass(row.tone)}`}>
                                  {column.key === 'difference' ? signedValue(row.difference) : row.value}
                                </span>
                              ) : column.key === 'setValue' ? (
                                <span className="tag-set">{row.setValue}</span>
                              ) : (
                                row[column.key] ?? ''
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
