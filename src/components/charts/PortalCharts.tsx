import React, { useMemo, useState } from 'react';
import { formatNumber, wobble } from '../../lib/liveValue';

export type ChartSlice = {
  label: string;
  value: number;
  color: string;
};

export const ChartHoverTip: React.FC<{ title: string; detail: string }> = ({ title, detail }) => (
  <div className="chart-hover-tip" role="status">
    <strong>{title}</strong>
    <span>{detail}</span>
  </div>
);

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export const RingGauge: React.FC<{
  label: string;
  color: string;
  percent: number;
  icon: string;
}> = ({ label, color, percent, icon }) => {
  const [hover, setHover] = useState(false);
  const size = 110;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = (clamped / 100) * c;

  return (
    <div
      className="energy-gauge chart-interactive"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <ChartHoverTip title={label} detail={`Load ${clamped.toFixed(1)}% · live SCADA gauge`} />
      )}
      <svg className="energy-gauge-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="54%" textAnchor="middle" fontSize="26" fill={color} pointerEvents="none">
          {icon}
        </text>
      </svg>
      <span className="energy-gauge-label">{label}</span>
    </div>
  );
};

export const AxisBarChart: React.FC<{
  bars: ChartSlice[];
  max: number;
  category?: string;
}> = ({ bars, max, category }) => {
  const [active, setActive] = useState<number | null>(null);
  const width = 360;
  const height = 220;
  const padL = 46;
  const padB = 36;
  const padT = 12;
  const padR = 12;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const ticks = 5;
  const safeMax = max > 0 ? max : 1;
  const hoverBar = active !== null ? bars[active] : null;

  return (
    <div className="axis-chart chart-interactive" onMouseLeave={() => setActive(null)}>
      {hoverBar && (
        <ChartHoverTip
          title={hoverBar.label}
          detail={`${hoverBar.value.toFixed(2)} · ${((hoverBar.value / safeMax) * 100).toFixed(0)}% of scale`}
        />
      )}
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const y = padT + plotH - (plotH * i) / ticks;
          const label = (safeMax * i) / ticks;
          return (
            <g key={i}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e5e7eb" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                {label >= 1000 ? `${Math.round(label / 100) / 10}k` : Math.round(label)}
              </text>
            </g>
          );
        })}
        {bars.map((bar, index) => {
          const slot = plotW / bars.length;
          const barW = Math.min(64, slot * 0.55);
          const x = padL + slot * index + (slot - barW) / 2;
          const h = (Math.min(bar.value, safeMax) / safeMax) * plotH;
          const y = padT + plotH - h;
          return (
            <g key={bar.label} onMouseEnter={() => setActive(index)} style={{ cursor: 'default' }}>
              <rect
                x={x}
                y={padT}
                width={barW}
                height={plotH}
                fill="transparent"
                pointerEvents="all"
              />
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={2}
                fill={bar.color}
                opacity={active === null || active === index ? 1 : 0.45}
                pointerEvents="none"
                style={{ transition: 'opacity 0.15s ease' }}
              />
              <text
                x={x + barW / 2}
                y={h > 28 ? y + 16 : y - 6}
                textAnchor="middle"
                fontSize="11"
                fill={h > 28 ? '#ffffff' : '#475569'}
                pointerEvents="none"
              >
                {bar.value >= 100 ? bar.value.toFixed(2) : bar.value.toFixed(2)}
              </text>
              {!category && (
                <text
                  x={x + barW / 2}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                  pointerEvents="none"
                >
                  {bar.label}
                </text>
              )}
            </g>
          );
        })}
        {category && (
          <text x={padL + plotW / 2} y={height - 8} textAnchor="middle" fontSize="12" fill="#64748b">
            {category}
          </text>
        )}
      </svg>
      <ul className="chart-legend chart-legend-interactive">
        {bars.map((bar, index) => (
          <li
            key={bar.label}
            onMouseEnter={() => setActive(index)}
            className={active === index ? 'is-active' : ''}
          >
            <i style={{ background: bar.color }} />
            {bar.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SliceChart: React.FC<{
  slices: ChartSlice[];
  donut?: boolean;
  suffix?: string;
}> = ({ slices, donut = false, suffix = '' }) => {
  const [active, setActive] = useState<number | null>(null);
  const size = donut ? 360 : slices.length > 6 ? 240 : 210;
  const cx = size / 2;
  const cy = size / 2;
  const r = donut ? 78 : 92;
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  let cursor = 0;

  const paths = slices.map((slice) => {
    const sweep = (slice.value / total) * 360;
    const start = cursor;
    const end = cursor + Math.max(sweep, 0.4);
    cursor += sweep;
    const large = sweep > 180 ? 1 : 0;
    const [x1, y1] = polar(cx, cy, r, start);
    const [x2, y2] = polar(cx, cy, r, end);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const mid = start + sweep / 2;
    const [lx, ly] = polar(cx, cy, r * 0.62, mid);
    const [tx, ty] = polar(cx, cy, r + 48, mid);
    const [ox, oy] = polar(cx, cy, r * 0.92, mid);
    const [ex, ey] = polar(cx, cy, r + 22, mid);
    const pct = (slice.value / total) * 100;
    return { ...slice, d, lx, ly, tx, ty, ox, oy, ex, ey, mid, pct, start, sweep };
  });

  const hoverSlice = active !== null ? paths[active] : null;

  return (
    <div className="slice-chart chart-interactive" onMouseLeave={() => setActive(null)}>
      {hoverSlice && (
        <ChartHoverTip
          title={hoverSlice.label}
          detail={`${hoverSlice.value.toFixed(2)}${suffix} · ${hoverSlice.pct.toFixed(1)}% share`}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {paths.map((slice, index) => (
          <g key={slice.label} onMouseEnter={() => setActive(index)} style={{ cursor: 'default' }}>
            <path
              d={slice.d}
              fill={slice.color}
              opacity={active === null || active === index ? 1 : 0.5}
              style={{ transition: 'opacity 0.22s ease' }}
            >
              <title>{`${slice.label}: ${slice.value.toFixed(2)}`}</title>
            </path>
          </g>
        ))}
        {donut && <circle cx={cx} cy={cy} r={40} fill="#ffffff" pointerEvents="none" />}
        {donut &&
          paths.map((slice) => (
            <text
              key={`${slice.label}-call`}
              x={slice.tx}
              y={slice.ty}
              textAnchor="middle"
              fontSize="11"
              fill="#334155"
              pointerEvents="none"
            >
              {slice.label}: {slice.value.toFixed(2)}{suffix}
            </text>
          ))}
        {!donut &&
          paths.map((slice) => {
            const shareLabel = `${slice.pct.toFixed(1)}%`;
            const inner = slice.pct >= 6;
            if (inner) {
              return (
                <text
                  key={`${slice.label}-label`}
                  x={slice.lx}
                  y={slice.ly}
                  textAnchor="middle"
                  fontSize={slice.pct >= 10 ? 11 : 9}
                  fontWeight="600"
                  fill={slice.color === '#93c5fd' || slice.color === '#fbbf24' ? '#0f172a' : '#ffffff'}
                  pointerEvents="none"
                >
                  {shareLabel}
                </text>
              );
            }
            const right = slice.ex >= cx;
            return (
              <g key={`${slice.label}-callout`} pointerEvents="none">
                <line x1={slice.ox} y1={slice.oy} x2={slice.ex} y2={slice.ey} stroke="#94a3b8" strokeWidth="1" />
                <text
                  x={slice.ex + (right ? 6 : -6)}
                  y={slice.ey + 3}
                  textAnchor={right ? 'start' : 'end'}
                  fontSize="9"
                  fontWeight="600"
                  fill="#475569"
                >
                  {shareLabel}
                </text>
              </g>
            );
          })}
      </svg>
      <ul className="donut-legend compact chart-legend-interactive">
        {paths.map((slice, index) => (
          <li
            key={slice.label}
            onMouseEnter={() => setActive(index)}
            className={active === index ? 'is-active' : ''}
          >
            <i className="swatch" style={{ background: slice.color }} />
            <span className="legend-copy">
              <span className="legend-name">{slice.label}</span>
              <span className="legend-meta">
                {slice.value >= 100 ? slice.value.toFixed(0) : slice.value.toFixed(2)}
                {suffix}
                {' · '}
                {slice.pct.toFixed(1)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const TrendSpark: React.FC<{
  points: number[];
  color?: string;
  unit?: string;
}> = ({ points, color = '#2563eb', unit = '' }) => {
  const [active, setActive] = useState<number | null>(null);
  const width = 280;
  const height = 64;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coords = useMemo(
    () =>
      points.map((value, index) => {
        const x = index * step;
        const y = height - 6 - ((value - min) / span) * (height - 14);
        return { x, y, value, index };
      }),
    [points, step, min, span, height],
  );
  const d = coords.map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const tip = active !== null ? coords[active] : null;

  return (
    <div className="trend-spark-wrap chart-interactive">
      {tip && (
        <ChartHoverTip
          title={`Sample ${tip.index + 1}`}
          detail={`${formatNumber(tip.value, 2)}${unit ? ` ${unit}` : ''}`}
        />
      )}
      <svg
        className="trend-spark"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        onMouseLeave={() => setActive(null)}
      >
        <path d={d} fill="none" stroke={color} strokeWidth="2" pointerEvents="none" />
        {coords.map((p) => (
          <circle
            key={p.index}
            cx={p.x}
            cy={p.y}
            r={8}
            fill="transparent"
            onMouseEnter={() => setActive(p.index)}
          />
        ))}
        {coords.map((p) => (
          <circle
            key={`dot-${p.index}`}
            cx={p.x}
            cy={p.y}
            r={active === p.index ? 4 : 2.5}
            fill={color}
            opacity={active === null || active === p.index ? 1 : 0.35}
            pointerEvents="none"
          />
        ))}
      </svg>
    </div>
  );
};

export type ShareBarRow = {
  label: string;
  sublabel?: string;
  value: number;
  fillClass?: string;
  unit?: string;
};

/** Horizontal share bars (steam consumers, power mix, home KPIs). */
export const ShareBarChart: React.FC<{
  rows: ShareBarRow[];
  max?: number;
  layout?: 'consumer' | 'source' | 'kpi';
}> = ({ rows, max, layout = 'consumer' }) => {
  const [active, setActive] = useState<number | null>(null);
  const peak = max ?? Math.max(...rows.map((r) => r.value), 1);
  const total = rows.reduce((sum, r) => sum + r.value, 0) || 1;
  const tip = active !== null ? rows[active] : null;

  return (
    <div className="share-bar-chart chart-interactive" onMouseLeave={() => setActive(null)}>
      {tip && (
        <ChartHoverTip
          title={tip.label}
          detail={`${formatNumber(tip.value, layout === 'kpi' ? 2 : 1)} ${tip.unit ?? ''} · ${((tip.value / total) * 100).toFixed(1)}% of group`.trim()}
        />
      )}
      {rows.map((row, index) => {
        const pct = peak > 0 ? (row.value / peak) * 100 : 0;
        const share = ((row.value / total) * 100).toFixed(1);
        const rowClass =
          layout === 'consumer' ? 'consumer-item' : layout === 'kpi' ? 'kpi-stat-card kpi-bar-card' : 'source-item';
        return (
          <div
            key={row.label}
            className={`${rowClass} share-bar-row ${active === index ? 'is-active' : ''}`}
            onMouseEnter={() => setActive(index)}
            tabIndex={0}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            {layout === 'kpi' ? (
              <>
                <span className="kpi-label">{row.label}</span>
                <div className="kpi-val-row">
                  <span className="kpi-val">{formatNumber(row.value, 2)}</span>
                  {row.unit && <span className="kpi-unit">{row.unit}</span>}
                </div>
                <div className="kpi-bar-wrapper">
                  <div
                    className={`kpi-bar-fill ${row.fillClass ?? ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {row.sublabel && <span className="kpi-footer-note">{row.sublabel}</span>}
              </>
            ) : (
              <>
                <div className={layout === 'consumer' ? 'consumer-header' : 'source-info'}>
                  <span className={layout === 'consumer' ? 'c-name' : 'source-name'}>{row.label}</span>
                  <span className={`${layout === 'consumer' ? 'c-flow' : 'source-kw'} font-mono`}>
                    {formatNumber(row.value, 1)} {row.unit ?? ''} ({share}%)
                  </span>
                </div>
                <div className={layout === 'consumer' ? 'source-bar' : 'source-bar'}>
                  <div
                    className={`source-fill ${row.fillClass ?? ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export type StackBarRow = { label: string; value: number };

/** Boiler performance / stacked horizontal bars. */
export const StackBarChart: React.FC<{
  rows: StackBarRow[];
  variant: 'generated' | 'consumed' | 'probe';
  max?: number;
  unit?: string;
}> = ({ rows, variant, max, unit = '' }) => {
  const [active, setActive] = useState<number | null>(null);
  const peak = max ?? Math.max(...rows.map((r) => r.value), 1);
  const tip = active !== null ? rows[active] : null;

  return (
    <div className="stack-bar-chart chart-interactive" onMouseLeave={() => setActive(null)}>
      {tip && (
        <ChartHoverTip
          title={tip.label}
          detail={`${formatNumber(tip.value, 2)} ${unit} · ${((tip.value / peak) * 100).toFixed(0)}% of peak`.trim()}
        />
      )}
      {rows.map((row, index) => {
        const widthPct = peak > 0 ? Math.min(100, (row.value / peak) * 100) : 0;
        if (variant === 'probe') {
          return (
            <div
              key={row.label}
              className={`probe-row share-bar-row ${active === index ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(index)}
            >
              <div className="probe-info">
                <span className="probe-name">{row.label}</span>
              </div>
              <div className="probe-bar-wrapper">
                <div
                  className="probe-bar-fill"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: row.value >= 75 ? '#ef4444' : row.value > 60 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>
              <div className="probe-temp font-mono">
                <strong>{formatNumber(row.value, 1)} °C</strong>
              </div>
            </div>
          );
        }
        return (
          <div
            key={row.label}
            className={`boiler-line ${variant} share-bar-row ${active === index ? 'is-active' : ''}`}
            onMouseEnter={() => setActive(index)}
          >
            <span className="boiler-line-fill" style={{ width: `${widthPct}%` }} />
            <span>{row.label}</span>
            <span>{formatNumber(row.value, 2)}</span>
          </div>
        );
      })}
    </div>
  );
};

export const DeviceGauge: React.FC<{ seed: number; tick: number; label?: string }> = ({
  seed,
  tick,
  label = 'Device load',
}) => {
  const [hover, setHover] = useState(false);
  const percent = wobble(62, tick, 8, seed);
  const sweep = (Math.max(8, Math.min(96, percent)) / 100) * 180;

  return (
    <div
      className="device-gauge-wrap chart-interactive"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <ChartHoverTip title={label} detail={`${percent.toFixed(1)}% · comms OK`} />
      )}
      <svg className="device-gauge-svg" viewBox="0 0 36 22" aria-hidden="true">
        <path d="M4 18 A14 14 0 0 1 32 18" fill="none" stroke="rgba(15,23,42,0.18)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M4 18 A14 14 0 0 1 32 18"
          fill="none"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(sweep / 180) * 44} 44`}
        />
      </svg>
    </div>
  );
};

export const EfficiencyBar: React.FC<{ value: number }> = ({ value }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="eff-cell chart-interactive"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && <ChartHoverTip title="Machine efficiency" detail={`${value.toFixed(1)}% OEE · live estimate`} />}
      <span className="font-mono">{value.toFixed(1)}%</span>
      <div className="eff-bar">
        <div className="eff-bar-inner" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};
