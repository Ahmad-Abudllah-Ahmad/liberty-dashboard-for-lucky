import React, { useEffect, useState } from 'react';
import { ChartHoverTip } from '../charts/PortalCharts';
import { mockAlarmsList, mockMachines } from '../../data/mockPlantData';

type Slice = { label: string; value: number; color: string; detail?: string };
type Tip = { title: string; tone: 'ok' | 'warn' | 'bad'; status: string; stats: { label: string; value: string }[] };

const steamHours = [390, 372, 368, 401, 448, 486, 512, 504, 491, 470, 452, 441];
const steamForecast = [448, 456, 463, 459, 451, 444];
const hourLabels = ['00', '04', '08', '12', '16', '20', '24', '28', '32', '36'];

const areaIndex = [
  { label: 'Steam', value: 72, color: '#2f8f8a' },
  { label: 'Power', value: 64, color: '#c4923a' },
  { label: 'Gas', value: 58, color: '#d16b6b' },
  { label: 'Water', value: 46, color: '#5c9aa8' },
  { label: 'Moisture', value: 88, color: '#3d7ea6' },
  { label: 'Panel temp', value: 76, color: '#8b93a7' },
  { label: 'LTM quality', value: 94, color: '#283090' },
  { label: 'Boilers', value: 84, color: '#2f8f8a' },
  { label: 'Heat exch.', value: 89, color: '#5c9aa8' },
  { label: 'Geneset', value: 80, color: '#c4923a' },
  { label: 'Compressor', value: 86, color: '#6d76cc' },
  { label: 'HVAC', value: 83, color: '#3d7ea6' },
  { label: 'Grid', value: 92, color: '#283090' },
  { label: 'Solar', value: 77, color: '#2f8f8a' },
  { label: 'Chillers', value: 85, color: '#5c9aa8' },
  { label: 'Pumps', value: 88, color: '#3d7ea6' },
  { label: 'ETP', value: 74, color: '#d16b6b' },
  { label: 'RO', value: 81, color: '#5c9aa8' },
  { label: 'Devices', value: 95, color: '#8b93a7' },
];

const alarmCounts = mockAlarmsList.reduce<Record<string, number>>((map, alarm) => {
  map[alarm.area] = (map[alarm.area] || 0) + 1;
  return map;
}, {});

const alarmBars = Object.entries(alarmCounts).map(([label, value]) => ({
  label,
  value,
  color: '#283090',
}));

const scatter = mockMachines.map((machine) => ({
  label: machine.name,
  x: machine.temperature,
  y: machine.efficiency,
  tone: machine.status === 'warning' ? 'warn' : machine.status === 'idle' ? 'bad' : 'ok',
}));

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

const nudge = (base: number, amp: number, phase: number, seconds: number) =>
  base + Math.sin(seconds * 1.25 + phase) * amp;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const ChartCard: React.FC<{ title: string; note: string; wide?: boolean; children: React.ReactNode }> = ({
  title,
  note,
  wide,
  children,
}) => (
  <section className={`plant-card${wide ? ' is-wide' : ''}`}>
    <header>
      <h3>{title}</h3>
      <span>{note}</span>
    </header>
    {children}
  </section>
);

const Bars: React.FC<{ items: Slice[]; unit: string; axisMax?: number }> = ({ items, unit, axisMax }) => {
  const [tip, setTip] = useState<Tip | null>(null);
  const max = axisMax ?? Math.max(...items.map((item) => item.value)) * 1.18;
  const width = 520;
  const height = 228;
  const padL = 40;
  const padR = 14;
  const padB = 36;
  const padT = 16;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const gap = plotW / items.length;
  const ticks = 4;

  return (
    <div className="plant-plot chart-interactive" onMouseLeave={() => setTip(null)}>
      {tip && <ChartHoverTip title={tip.title} status={{ label: tip.status, tone: tip.tone }} stats={tip.stats} />}
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" role="img">
        {Array.from({ length: ticks + 1 }, (_, step) => {
          const y = padT + plotH - (plotH * step) / ticks;
          const value = (max * step) / ticks;
          return (
            <g key={step}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e8edf3" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#64748b">
                {Math.round(value)}
              </text>
            </g>
          );
        })}
        {items.map((item, index) => {
          const barH = (clamp(item.value, 0, max) / max) * plotH;
          const x = padL + index * gap + gap * 0.22;
          const y = padT + plotH - barH;
          const label = item.label.replace('Electrical', 'Elec.').replace('Compressor', 'Comp.');
          return (
            <g
              key={item.label}
              onMouseEnter={() =>
                setTip({
                  title: item.label,
                  tone: 'ok',
                  status: 'Live',
                  stats: item.detail
                    ? [
                        { label: unit, value: item.detail },
                        { label: 'Load', value: `${item.value.toFixed(1)}%` },
                      ]
                    : [
                        { label: unit, value: item.value.toFixed(0) },
                        { label: 'Register', value: 'Live' },
                      ],
                })
              }
            >
              <rect x={padL + index * gap} y={padT} width={gap} height={plotH} fill="transparent" />
              <rect x={x} y={y} width={Math.max(8, gap * 0.5)} height={barH} rx="3" fill={item.color} />
              <text x={x + gap * 0.25} y={Math.max(padT + 10, y - 4)} textAnchor="middle" fontSize="9" fill="#334155">
                {Math.round(item.value)}
              </text>
              <text x={x + gap * 0.25} y={height - 14} textAnchor="middle" fontSize="9" fill="#64748b">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Pie: React.FC<{ slices: Slice[] }> = ({ slices }) => {
  const [tip, setTip] = useState<Tip | null>(null);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  let cursor = 0;
  const arcs = slices.map((slice) => {
    const start = cursor;
    const sweep = (slice.value / total) * 360;
    cursor += sweep;
    const [x1, y1] = polar(78, 96, 48, start);
    const [x2, y2] = polar(78, 96, 48, start + sweep);
    const large = sweep > 180 ? 1 : 0;
    return { slice, d: `M 78 96 L ${x1} ${y1} A 48 48 0 ${large} 1 ${x2} ${y2} Z` };
  });

  return (
    <div className="plant-plot chart-interactive" onMouseLeave={() => setTip(null)}>
      {tip && <ChartHoverTip title={tip.title} status={{ label: tip.status, tone: tip.tone }} stats={tip.stats} />}
      <svg viewBox="0 0 280 200" preserveAspectRatio="xMidYMid meet" role="img">
        {arcs.map(({ slice, d }) => (
          <path
            key={slice.label}
            d={d}
            fill={slice.color}
            onMouseEnter={() =>
              setTip({
                title: slice.label,
                tone: 'ok',
                status: 'Share',
                stats: [
                  { label: 'Share', value: `${slice.value.toFixed(1)}%` },
                  { label: 'Of mix', value: 'Power' },
                ],
              })
            }
          />
        ))}
        <circle cx="78" cy="96" r="26" fill="#ffffff" pointerEvents="none" />
        <text x="78" y="93" textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="650" pointerEvents="none">
          100
        </text>
        <text x="78" y="106" textAnchor="middle" fontSize="8" fill="#94a3b8" pointerEvents="none">
          %
        </text>
        {slices.map((slice, index) => (
          <g
            key={slice.label}
            transform={`translate(158, ${58 + index * 32})`}
            onMouseEnter={() =>
              setTip({
                title: slice.label,
                tone: 'ok',
                status: 'Share',
                stats: [
                  { label: 'Share', value: `${slice.value.toFixed(1)}%` },
                  { label: 'Of mix', value: 'Power' },
                ],
              })
            }
          >
            <circle r="4" fill={slice.color} />
            <rect x="-8" y="-14" width="110" height="28" fill="transparent" />
            <text x="10" y="-2" fontSize="10" fill="#475569">
              {slice.label}
            </text>
            <text x="10" y="11" fontSize="10" fill="#1e293b">
              {slice.value.toFixed(1)}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const Trend: React.FC<{ series: number[]; forecast?: boolean }> = ({ series, forecast = false }) => {
  const [tip, setTip] = useState<Tip | null>(null);
  const width = 520;
  const height = 228;
  const padL = 46;
  const padR = 28;
  const padB = 34;
  const padT = 26;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const min = 320;
  const max = 560;
  const xAt = (index: number) => padL + (plotW * index) / (series.length - 1);
  const yAt = (value: number) => padT + plotH - ((clamp(value, min, max) - min) / (max - min)) * plotH;
  const path = series.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(value)}`).join(' ');
  const split = steamHours.length - 1;
  const history = series
    .slice(0, split + 1)
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(value)}`)
    .join(' ');
  const future = series
    .slice(split)
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(split + index)} ${yAt(value)}`)
    .join(' ');

  return (
    <div className="plant-plot chart-interactive" onMouseLeave={() => setTip(null)}>
      {tip && <ChartHoverTip title={tip.title} status={{ label: tip.status, tone: tip.tone }} stats={tip.stats} />}
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" role="img">
        {[0, 1, 2, 3, 4].map((step) => {
          const y = padT + plotH - (plotH * step) / 4;
          const value = min + ((max - min) * step) / 4;
          return (
            <g key={step}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e8edf3" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#64748b">
                {Math.round(value)}
              </text>
            </g>
          );
        })}
        {series.map((_, index) => {
          if (index % 3 !== 0 && index !== series.length - 1) return null;
          const x = xAt(index);
          const label = forecast ? (index < steamHours.length ? `${index * 2}` : `+${(index - steamHours.length + 1) * 2}`) : `${index * 2}`;
          return (
            <text key={`x-${index}`} x={x} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748b">
              {label}
            </text>
          );
        })}
        {forecast ? (
          <>
            <path d={history} fill="none" stroke="#283090" strokeWidth="2.4" />
            <path d={future} fill="none" stroke="#2f8f8a" strokeWidth="2.4" strokeDasharray="5 4" />
            <line x1={xAt(split)} x2={xAt(split)} y1={padT} y2={padT + plotH} stroke="#cbd5e1" strokeDasharray="3 3" />
          </>
        ) : (
          <path d={path} fill="none" stroke="#283090" strokeWidth="2.4" />
        )}
        {series.map((value, index) => (
          <g
            key={`${value}-${index}`}
            onMouseEnter={() =>
              setTip({
                title: forecast && index > split ? `+${(index - split) * 2}h forecast` : `${hourLabels[index] || index * 2}h`,
                tone: forecast && index > split ? 'warn' : 'ok',
                status: forecast && index > split ? 'Forecast' : 'Actual',
                stats: [
                  { label: 'Steam', value: `${value.toFixed(0)} ton` },
                  { label: 'Window', value: forecast && index > split ? 'Projected' : 'Recorded' },
                ],
              })
            }
          >
            <circle cx={xAt(index)} cy={yAt(value)} r="12" fill="transparent" />
            <circle cx={xAt(index)} cy={yAt(value)} r="3.5" fill={forecast && index > split ? '#2f8f8a' : '#283090'} />
          </g>
        ))}
      </svg>
    </div>
  );
};

const Scatter: React.FC<{ points: typeof scatter }> = ({ points }) => {
  const [tip, setTip] = useState<Tip | null>(null);
  const width = 520;
  const height = 228;
  const padL = 44;
  const padR = 28;
  const padB = 34;
  const padT = 22;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMin = 0;
  const xMax = 230;
  const yMin = 62;
  const yMax = 108;

  return (
    <div className="plant-plot chart-interactive" onMouseLeave={() => setTip(null)}>
      {tip && <ChartHoverTip title={tip.title} status={{ label: tip.status, tone: tip.tone }} stats={tip.stats} />}
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" role="img">
        {[70, 80, 90, 100].map((value) => {
          const y = padT + plotH - ((value - yMin) / (yMax - yMin)) * plotH;
          return (
            <g key={value}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e8edf3" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#64748b">
                {value}
              </text>
            </g>
          );
        })}
        {[40, 80, 120, 160, 200].map((value) => {
          const x = padL + ((value - xMin) / (xMax - xMin)) * plotW;
          return (
            <text key={value} x={x} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748b">
              {value}
            </text>
          );
        })}
        {points.map((point) => {
          const cx = padL + ((clamp(point.x, xMin, xMax) - xMin) / (xMax - xMin)) * plotW;
          const cy = padT + plotH - ((clamp(point.y, yMin, yMax) - yMin) / (yMax - yMin)) * plotH;
          const fill = point.tone === 'warn' ? '#c4923a' : point.tone === 'bad' ? '#8b93a7' : '#283090';
          return (
            <g
              key={point.label}
              onMouseEnter={() =>
                setTip({
                  title: point.label,
                  tone: point.tone === 'bad' ? 'bad' : point.tone === 'warn' ? 'warn' : 'ok',
                  status: point.tone === 'ok' ? 'Running' : point.tone === 'warn' ? 'Warning' : 'Idle',
                  stats: [
                    { label: 'Temp', value: `${point.x.toFixed(1)} °C` },
                    { label: 'Efficiency', value: `${point.y.toFixed(1)}%` },
                  ],
                })
              }
            >
              <circle cx={cx} cy={cy} r="14" fill="transparent" />
              <circle cx={cx} cy={cy} r="5" fill={fill} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Areas: React.FC<{ areas: { label: string; value: number; color: string }[] }> = ({ areas }) => {
  const [tip, setTip] = useState<Tip | null>(null);
  return (
    <div className="plant-areas chart-interactive" onMouseLeave={() => setTip(null)}>
      {tip && <ChartHoverTip title={tip.title} status={{ label: tip.status, tone: tip.tone }} stats={tip.stats} />}
      <div className="plant-scale">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
      <ul className="plant-systems">
        {areas.map((area) => (
          <li
            key={area.label}
            onMouseEnter={() =>
              setTip({
                title: area.label,
                tone: 'ok',
                status: 'Live',
                stats: [
                  { label: 'Index', value: `${area.value.toFixed(1)}%` },
                  { label: 'Headroom', value: `${(100 - area.value).toFixed(1)}%` },
                ],
              })
            }
          >
            <span>{area.label}</span>
            <i>
              <b style={{ width: `${area.value}%`, background: area.color }} />
            </i>
            <strong>{area.value.toFixed(0)}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LiveRing: React.FC<{ percent: number; color: string; mark: string }> = ({ percent, color, mark }) => {
  const radius = 16;
  const length = 2 * Math.PI * radius;
  const shown = clamp(percent, 0, 100);
  const dash = (shown / 100) * length;
  return (
    <span className="plant-ring-wrap">
      <svg className="plant-ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="#e8edf3" strokeWidth="4.5" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${length - dash}`}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span className="plant-ring-mark" aria-hidden="true">
        {mark}
      </span>
    </span>
  );
};

const formatFigure = (value: number, digits: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const PlantOverviewDashboard: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [kpi, setKpi] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const loop = (now: number) => {
      if (now - last > 140) {
        last = now;
        setSeconds(now / 1000);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const openBase = mockAlarmsList.filter((alarm) => !alarm.acknowledged).length;
  const openAlarms = Math.round(clamp(nudge(openBase, 1.6, 0.4, seconds), 20, 34));
  const steamLoad = clamp(nudge(72, 1.8, 0.2, seconds), 60, 84);
  const powerLoad = clamp(nudge(64, 1.6, 1.1, seconds), 52, 76);
  const gasLoad = clamp(nudge(58, 1.5, 2.2, seconds), 46, 70);
  const waterLoad = clamp(nudge(46, 1.4, 3.1, seconds), 36, 58);
  const quality = clamp(nudge(94, 0.8, 0.8, seconds), 90, 98);
  const steamTon = nudge(527.05, 2.2, 0.5, seconds);
  const powerKwh = nudge(18926.93, 36, 1.4, seconds);
  const gasM3 = nudge(34233, 55, 2.4, seconds);
  const waterM3 = nudge(3209.01, 7, 1.8, seconds);
  const gridShare = clamp(nudge(46.2, 1.2, 0.3, seconds), 40, 52);
  const solarShare = clamp(nudge(22.3, 1.1, 1.7, seconds), 16, 28);
  const gensetShare = Math.max(12, 100 - gridShare - solarShare);
  const mixTotal = gridShare + gensetShare + solarShare;

  const liveEnergy: Slice[] = [
    { label: 'Steam', value: steamLoad, color: '#2f8f8a', detail: `${steamTon.toFixed(2)} Ton` },
    { label: 'Power', value: powerLoad, color: '#c4923a', detail: `${formatFigure(powerKwh, 2)} kWh` },
    { label: 'Gas', value: gasLoad, color: '#d16b6b', detail: `${formatFigure(gasM3, 2)} M³` },
    { label: 'Water', value: waterLoad, color: '#5c9aa8', detail: `${formatFigure(waterM3, 2)} M³` },
  ];
  const liveMix: Slice[] = [
    { label: 'Grid', value: (gridShare / mixTotal) * 100, color: '#283090' },
    { label: 'Genset', value: (gensetShare / mixTotal) * 100, color: '#c4923a' },
    { label: 'Solar', value: (solarShare / mixTotal) * 100, color: '#2f8f8a' },
  ];
  const liveSteam = steamHours.map((value, index) => clamp(nudge(value, 7, index * 0.45, seconds), 330, 550));
  const liveForecast = [
    ...liveSteam,
    ...steamForecast.map((value, index) => clamp(nudge(value, 6, index * 0.6 + 2, seconds), 330, 550)),
  ];
  const liveScatter = scatter.map((point, index) => ({
    ...point,
    x: clamp(nudge(point.x, 1.6, index, seconds), 30, 200),
    y: clamp(nudge(point.y, 0.7, index + 1, seconds), 72, 99),
  }));
  const liveAlarms = alarmBars.map((bar, index) => ({
    ...bar,
    value: Math.max(1, nudge(bar.value, 1.2, index * 0.8, seconds)),
  }));
  const liveAreas = areaIndex.map((area, index) => ({
    ...area,
    value: clamp(nudge(area.value, 1.3, index * 0.35, seconds), 30, 99),
  }));

  return (
    <div className="portal-page plant-overview">
      <div className="portal-page-head">
        <h2>Plant Overview</h2>
      </div>

      <div className="plant-kpis">
        <article className="chart-interactive" onMouseEnter={() => setKpi('alarms')} onMouseLeave={() => setKpi(null)}>
          {kpi === 'alarms' && (
            <ChartHoverTip
              title="Open alarms"
              status={{ label: openAlarms > 30 ? 'High' : 'Nominal', tone: openAlarms > 30 ? 'bad' : 'ok' }}
              stats={[
                { label: 'Open', value: String(openAlarms) },
                { label: 'Register', value: String(mockAlarmsList.length) },
                { label: 'Share', value: `${((openAlarms / mockAlarmsList.length) * 100).toFixed(1)}%` },
                { label: 'Headroom', value: String(mockAlarmsList.length - openAlarms) },
              ]}
            />
          )}
          <LiveRing percent={(openAlarms / mockAlarmsList.length) * 100} color="#d16b6b" mark="🔔" />
          <div>
            <span>Open alarms</span>
            <strong>{openAlarms}</strong>
            <em>{mockAlarmsList.length} on the register</em>
          </div>
        </article>
        <article className="chart-interactive" onMouseEnter={() => setKpi('steam')} onMouseLeave={() => setKpi(null)}>
          {kpi === 'steam' && (
            <ChartHoverTip
              title="Steam"
              status={{ label: steamLoad >= 80 ? 'High Load' : 'Nominal', tone: steamLoad >= 80 ? 'bad' : 'ok' }}
              stats={[
                { label: 'Consumed', value: `${steamTon.toFixed(2)} Ton` },
                { label: 'Load', value: `${steamLoad.toFixed(1)}%` },
                { label: 'Headroom', value: `${(100 - steamLoad).toFixed(1)}%` },
                { label: 'Unit cost', value: '50,000 Rs/Ton' },
              ]}
            />
          )}
          <LiveRing percent={steamLoad} color="#2f8f8a" mark="♨️" />
          <div>
            <span>Steam</span>
            <strong>{steamTon.toFixed(2)}</strong>
            <em>Ton · {steamLoad.toFixed(0)}% load</em>
          </div>
        </article>
        <article className="chart-interactive" onMouseEnter={() => setKpi('power')} onMouseLeave={() => setKpi(null)}>
          {kpi === 'power' && (
            <ChartHoverTip
              title="Electricity"
              status={{ label: powerLoad >= 80 ? 'High Load' : 'Nominal', tone: powerLoad >= 80 ? 'bad' : 'ok' }}
              stats={[
                { label: 'Consumed', value: `${formatFigure(powerKwh, 2)} kWh` },
                { label: 'Load', value: `${powerLoad.toFixed(1)}%` },
                { label: 'Headroom', value: `${(100 - powerLoad).toFixed(1)}%` },
                { label: 'Unit cost', value: '38 Rs/kWh' },
              ]}
            />
          )}
          <LiveRing percent={powerLoad} color="#c4923a" mark="⚡" />
          <div>
            <span>Electricity</span>
            <strong>{formatFigure(powerKwh, 2)}</strong>
            <em>kWh · {powerLoad.toFixed(0)}% load</em>
          </div>
        </article>
        <article className="chart-interactive" onMouseEnter={() => setKpi('gas')} onMouseLeave={() => setKpi(null)}>
          {kpi === 'gas' && (
            <ChartHoverTip
              title="Gas"
              status={{ label: gasLoad >= 80 ? 'High Load' : 'Nominal', tone: gasLoad >= 80 ? 'bad' : 'ok' }}
              stats={[
                { label: 'Consumed', value: `${formatFigure(gasM3, 0)} M³` },
                { label: 'Load', value: `${gasLoad.toFixed(1)}%` },
                { label: 'Headroom', value: `${(100 - gasLoad).toFixed(1)}%` },
                { label: 'Unit cost', value: '40 Rs/M³' },
              ]}
            />
          )}
          <LiveRing percent={gasLoad} color="#d16b6b" mark="🔥" />
          <div>
            <span>Gas</span>
            <strong>{formatFigure(gasM3, 0)}</strong>
            <em>M³ · {gasLoad.toFixed(0)}% load</em>
          </div>
        </article>
        <article className="chart-interactive" onMouseEnter={() => setKpi('water')} onMouseLeave={() => setKpi(null)}>
          {kpi === 'water' && (
            <ChartHoverTip
              title="Water"
              status={{ label: waterLoad >= 80 ? 'High Load' : 'Nominal', tone: waterLoad >= 80 ? 'bad' : 'ok' }}
              stats={[
                { label: 'Consumed', value: `${formatFigure(waterM3, 2)} M³` },
                { label: 'Load', value: `${waterLoad.toFixed(1)}%` },
                { label: 'Headroom', value: `${(100 - waterLoad).toFixed(1)}%` },
                { label: 'Unit cost', value: '1,400 Rs/M³' },
              ]}
            />
          )}
          <LiveRing percent={waterLoad} color="#5c9aa8" mark="💧" />
          <div>
            <span>Water</span>
            <strong>{formatFigure(waterM3, 2)}</strong>
            <em>M³ · {waterLoad.toFixed(0)}% load</em>
          </div>
        </article>
        <article className="chart-interactive" onMouseEnter={() => setKpi('quality')} onMouseLeave={() => setKpi(null)}>
          {kpi === 'quality' && (
            <ChartHoverTip
              title="LTM quality"
              status={{ label: quality >= 90 ? 'Nominal' : 'Watch', tone: quality >= 90 ? 'ok' : 'warn' }}
              stats={[
                { label: 'Quality', value: `${quality.toFixed(1)}%` },
                { label: 'Headroom', value: `${(100 - quality).toFixed(1)}%` },
                { label: 'Machines', value: 'Running' },
                { label: 'Area', value: 'LTM 4' },
              ]}
            />
          )}
          <LiveRing percent={quality} color="#283090" mark="🧵" />
          <div>
            <span>LTM quality</span>
            <strong>{quality.toFixed(0)}%</strong>
            <em>Running machines</em>
          </div>
        </article>
      </div>

      <div className="plant-grid">
        <ChartCard title="Energy consumption" note="Bar · steam, power, gas, water">
          <Bars items={liveEnergy} unit="Consumed" axisMax={100} />
        </ChartCard>
        <ChartCard title="Power source" note="Pie · grid, genset, solar">
          <Pie slices={liveMix} />
        </ChartCard>
        <ChartCard title="Steam through the day" note="Line · hours">
          <Trend series={liveSteam} />
        </ChartCard>
        <ChartCard title="Steam forecast" note="Forecast · hours ahead" wide>
          <Trend series={liveForecast} forecast />
        </ChartCard>
        <ChartCard title="Machines" note="Scatter · °C and efficiency">
          <Scatter points={liveScatter} />
        </ChartCard>
        <ChartCard title="Alarms by area" note="Bar · full alarm register">
          <Bars items={liveAlarms} unit="Alarms" />
        </ChartCard>
        <ChartCard title="Every plant area" note="0 to 100 across the site" wide>
          <Areas areas={liveAreas} />
        </ChartCard>
      </div>
    </div>
  );
};
