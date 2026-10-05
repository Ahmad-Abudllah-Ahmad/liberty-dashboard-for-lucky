import React, { useLayoutEffect, useRef, useState } from 'react';

export type ChartSlice = {
  label: string;
  value: number;
  color: string;
};

export type ChartTipStat = { label: string; value: string };
export type ChartTipStatus = { label: string; tone?: 'ok' | 'bad' | 'warn' };

export const ChartHoverTip: React.FC<{
  title: string;
  status?: ChartTipStatus;
  stats?: ChartTipStat[];
  detail?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ title, status, stats, detail, className, style }) => (
  <div className={`chart-hover-tip ${className || ''}`.trim()} role="status" style={style}>
    <div className="chart-hover-tip-head">
      <strong>{title}</strong>
      {status && <span className={`chart-hover-tip-status is-${status.tone || 'ok'}`}>{status.label}</span>}
    </div>
    {stats && stats.length > 0 ? (
      <div className="chart-hover-tip-grid">
        {stats.map((stat) => (
          <span key={stat.label}>
            {stat.label}: <b>{stat.value}</b>
          </span>
        ))}
      </div>
    ) : (
      detail && <span className="chart-hover-tip-detail">{detail}</span>
    )}
  </div>
);

const useBoxSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const width = Math.round(el.clientWidth);
      const height = Math.round(el.clientHeight);
      if (width > 0 && height > 0) {
        setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
      }
    };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return [ref, size] as const;
};

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
        <ChartHoverTip
          title={label}
          status={{ label: clamped >= 80 ? 'High Load' : 'Nominal', tone: clamped >= 80 ? 'bad' : 'ok' }}
          stats={[
            { label: 'Load', value: `${clamped.toFixed(1)}%` },
            { label: 'Headroom', value: `${(100 - clamped).toFixed(1)}%` },
          ]}
        />
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
  const [boxRef, box] = useBoxSize();
  const width = box?.width ?? 520;
  const height = box?.height ?? 260;
  const padL = 48;
  const padB = 36;
  const padT = 16;
  const padR = 16;
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
          status={{
            label: hoverBar.value / safeMax >= 0.8 ? 'High Share' : 'In Range',
            tone: hoverBar.value / safeMax >= 0.8 ? 'bad' : 'ok',
          }}
          stats={[
            { label: 'Value', value: hoverBar.value.toFixed(2) },
            { label: 'Share', value: `${((hoverBar.value / safeMax) * 100).toFixed(0)}%` },
          ]}
        />
      )}
      <div ref={boxRef} className="chart-fit-box">
        {box && (
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
                <g key={bar.label} onMouseEnter={() => setActive(index)}>
                  <rect x={x} y={padT} width={barW} height={plotH} fill="transparent" />
                  <rect x={x} y={y} width={barW} height={h} rx={2} fill={bar.color} pointerEvents="none" />
                  <text
                    x={x + barW / 2}
                    y={h > 28 ? y + 16 : y - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fill={h > 28 ? '#ffffff' : '#475569'}
                  >
                    {bar.value.toFixed(2)}
                  </text>
                  {!category && (
                    <text x={x + barW / 2} y={height - 12} textAnchor="middle" fontSize="11" fill="#64748b">
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
        )}
      </div>
      <ul className="chart-legend chart-legend-interactive">
        {bars.map((bar, index) => (
          <li key={bar.label} onMouseEnter={() => setActive(index)} className={active === index ? 'is-active' : ''}>
            <i style={{ background: bar.color }} />
            {bar.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const spreadLabels = <T extends { ly: number }>(
  items: T[],
  minY: number,
  maxY: number,
  gap: number
) => {
  const sorted = [...items].sort((a, b) => a.ly - b.ly);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].ly - sorted[i - 1].ly < gap) {
      sorted[i].ly = sorted[i - 1].ly + gap;
    }
  }
  const last = sorted[sorted.length - 1];
  if (last && last.ly > maxY) {
    const shift = last.ly - maxY;
    sorted.forEach((item) => {
      item.ly -= shift;
    });
  }
  if (sorted[0] && sorted[0].ly < minY) {
    const shift = minY - sorted[0].ly;
    sorted.forEach((item) => {
      item.ly += shift;
    });
  }
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].ly - sorted[i - 1].ly < gap) {
      sorted[i].ly = sorted[i - 1].ly + gap;
    }
  }
  return sorted;
};

export const SliceChart: React.FC<{
  slices: ChartSlice[];
  donut?: boolean;
  suffix?: string;
}> = ({ slices, donut = false, suffix = '' }) => {
  const [active, setActive] = useState<number | null>(null);
  const [boxRef, box] = useBoxSize();
  const width = box?.width ?? 520;
  const height = box?.height ?? 280;
  const cx = width / 2;
  const cy = height / 2;
  const r = donut
    ? Math.max(28, Math.min(72, height / 2 - 20, width / 2 - 88))
    : Math.max(28, Math.min(86, height / 2 - 14, width / 2 - 40));
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
    const [lx, ly] = polar(cx, cy, r * 0.58, mid);
    const [ox, oy] = polar(cx, cy, r, mid);
    const [mx, my] = polar(cx, cy, r + 16, mid);
    const pct = (slice.value / total) * 100;
    const right = Math.cos(((mid - 90) * Math.PI) / 180) >= 0;
    return { ...slice, d, lx, ly, ox, oy, mx, my, mid, pct, right };
  });

  const needsCallout = (pct: number) => donut || pct < 8;
  const rawCallouts = paths.filter((slice) => needsCallout(slice.pct)).map((slice) => ({
    label: slice.label,
    ly: slice.my,
    right: slice.right,
    ox: slice.ox,
    oy: slice.oy,
    mx: slice.mx,
    text: donut ? `${slice.label}: ${slice.value.toFixed(2)}${suffix}` : `${slice.pct.toFixed(1)}%`,
  }));
  const leftCallouts = spreadLabels(
    rawCallouts.filter((item) => !item.right),
    16,
    height - 12,
    18
  );
  const rightCallouts = spreadLabels(
    rawCallouts.filter((item) => item.right),
    16,
    height - 12,
    18
  );
  const callouts = [...leftCallouts, ...rightCallouts];
  const calloutLabels = new Set(callouts.map((item) => item.label));

  const hoverSlice = active !== null ? paths[active] : null;

  return (
    <div className="slice-chart chart-interactive" onMouseLeave={() => setActive(null)}>
      {hoverSlice && (
        <ChartHoverTip
          title={hoverSlice.label}
          status={{
            label: hoverSlice.pct >= 40 ? 'High Share' : 'In Range',
            tone: hoverSlice.pct >= 40 ? 'warn' : 'ok',
          }}
          stats={[
            { label: 'Value', value: `${hoverSlice.value.toFixed(2)}${suffix}` },
            { label: 'Share', value: `${hoverSlice.pct.toFixed(1)}%` },
          ]}
        />
      )}
      <div ref={boxRef} className="chart-fit-box">
        {box && (
          <svg viewBox={`0 0 ${width} ${height}`} role="img">
            {paths.map((slice, index) => (
              <path key={slice.label} d={slice.d} fill={slice.color} onMouseEnter={() => setActive(index)} />
            ))}
            {donut && <circle cx={cx} cy={cy} r={(r * 5) / 9} fill="#ffffff" />}
            {!donut &&
              paths
                .filter((slice) => !calloutLabels.has(slice.label))
                .map((slice) => (
                  <text
                    key={`${slice.label}-label`}
                    x={slice.lx}
                    y={slice.ly}
                    textAnchor="middle"
                    fontSize={slice.pct >= 10 ? 12 : 10}
                    fontWeight="600"
                    fill={slice.color === '#c9cef0' || slice.color === '#fbbf24' ? '#0f172a' : '#ffffff'}
                  >
                    {slice.pct.toFixed(1)}%
                  </text>
                ))}
            {callouts.map((item) => {
              const source = paths.find((slice) => slice.label === item.label);
              if (!source) return null;
              const labelX = item.right ? width - 12 : 12;
              const elbowX = item.right ? Math.min(source.mx + 10, labelX - 6) : Math.max(source.mx - 10, labelX + 6);
              const textW = item.text.length * 6.3 + 6;
              const lineEndX = item.right ? Math.max(elbowX, labelX - textW) : Math.min(elbowX, labelX + textW);
              return (
                <g key={`${item.label}-callout`}>
                  <polyline
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    points={`${source.ox},${source.oy} ${source.mx},${source.my} ${elbowX},${item.ly} ${lineEndX},${item.ly}`}
                  />
                  <text
                    x={labelX}
                    y={item.ly + 3}
                    textAnchor={item.right ? 'end' : 'start'}
                    fontSize="11"
                    fontWeight="600"
                    fill="#475569"
                  >
                    {item.text}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
      <ul className="donut-legend compact chart-legend-interactive">
        {paths.map((slice, index) => (
          <li key={slice.label} onMouseEnter={() => setActive(index)} className={active === index ? 'is-active' : ''}>
            <i className="swatch" style={{ background: slice.color }} />
            <span>
              {slice.label} — {slice.value >= 100 ? slice.value.toFixed(0) : slice.value.toFixed(2)}
              {suffix} ({slice.pct.toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
