import React from 'react';

export type GallerySeries = {
  label: string;
  unit: string;
  actual: number;
  setPoint: number;
  average: number;
  insideShare: number;
  color: string;
  points: { t: number; v: number }[];
};

type Detail = { label: string; value: string }[];
type Tip = (event: React.MouseEvent, title: string, detail: Detail) => void;

const BLUE = ['#1a73e8', '#8ab4f8', '#174ea6', '#aecbfa', '#669df6', '#4285f4'];

const thin = (points: { t: number; v: number }[], count = 18) => {
  if (points.length <= count) return points;
  const step = (points.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, index) => points[Math.round(index * step)]);
};

const fmt = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

const Card: React.FC<{
  title: string;
  detail: Detail;
  y: string[];
  x: string[];
  onTip: Tip;
  onHide: () => void;
  children: React.ReactNode;
}> = ({ title, detail, y, x, onTip, onHide, children }) => (
  <article
    className="sum-gallery-card"
    onMouseEnter={(event) => onTip(event, title, [
      ...detail,
      { label: 'Vertical', value: y.join('  ·  ') },
      { label: 'Horizontal', value: x.join('  ·  ') },
    ])}
    onMouseMove={(event) => onTip(event, title, [
      ...detail,
      { label: 'Vertical', value: y.join('  ·  ') },
      { label: 'Horizontal', value: x.join('  ·  ') },
    ])}
    onMouseLeave={onHide}
  >
    <div className="sum-gallery-plot">
      <Frame y={y} x={x}>{children}</Frame>
    </div>
    <span>{title}</span>
  </article>
);

const Frame: React.FC<{ y?: string[]; x?: string[]; children: React.ReactNode }> = ({ y = [], x = [], children }) => (
  <svg viewBox="0 0 160 104" preserveAspectRatio="none">
    <line x1="36" y1="6" x2="36" y2="80" stroke="#e2e8f0" strokeWidth="0.8" />
    <line x1="36" y1="80" x2="156" y2="80" stroke="#e2e8f0" strokeWidth="0.8" />
    {y.map((label, index) => (
      <text
        key={`y-${index}`}
        x="34"
        y={12 + (y.length > 1 ? (index * 64) / (y.length - 1) : 0)}
        fontSize="8"
        fill="#64748b"
        textAnchor="end"
      >
        {label}
      </text>
    ))}
    {x.map((label, index) => (
      <text
        key={`x-${index}`}
        x={40 + (x.length > 1 ? (index * 110) / (x.length - 1) : 0)}
        y="96"
        fontSize="8"
        fill="#64748b"
        textAnchor={index === 0 ? 'start' : index === x.length - 1 ? 'end' : 'middle'}
      >
        {label}
      </text>
    ))}
    <svg x="38" y="4" width="116" height="74" viewBox="0 0 160 96" preserveAspectRatio="none">
      {children}
    </svg>
  </svg>
);

const plot = (series: GallerySeries[]) => {
  const points = series.map((item) => thin(item.points));
  const values = points.flatMap((row) => row.map((point) => point.v));
  const min = Math.min(...values, 70);
  const max = Math.max(...values, 130);
  const span = max - min || 1;
  const x = (index: number, count: number) => 8 + (count <= 1 ? 0 : index / (count - 1)) * 144;
  const y = (value: number) => 8 + ((max - value) / span) * 78;
  return { points, x, y, min, max };
};

const poly = (points: { t: number; v: number }[], x: (index: number, count: number) => number, y: (value: number) => number) =>
  points.map((point, index) => `${x(index, points.length)},${y(point.v)}`).join(' ');

const area = (points: { t: number; v: number }[], x: (index: number, count: number) => number, y: (value: number) => number) => {
  const line = poly(points, x, y);
  const last = x(points.length - 1, points.length);
  const first = x(0, points.length);
  return `${line} ${last},86 ${first},86`;
};

export const SummaryGallery: React.FC<{
  machine: string;
  series: GallerySeries[];
  onTip: Tip;
  onHide: () => void;
}> = ({ machine, series, onTip, onHide }) => {
  const lines = series.slice(0, 4);
  const bars = series.slice(0, 6);
  const inCount = series.filter((item) => Math.abs((item.actual - item.setPoint) / item.setPoint) * 100 <= 5).length;
  const outCount = Math.max(series.length - inCount, 0);
  const timeInside = series.length ? series.reduce((sum, item) => sum + item.insideShare, 0) / series.length : 0;
  const above = series.filter((item) => item.actual >= item.setPoint).slice(0, 5);
  const below = series.filter((item) => item.actual < item.setPoint).slice(0, 5);
  const detail = (extra: Detail = []): Detail => [
    { label: 'Machine', value: machine },
    { label: 'Parameters', value: String(series.length) },
    ...extra,
  ];

  const mapped = plot(lines.length ? lines : series.slice(0, 1));
  const lead = lines[0] ?? series[0];
  const leadPoints = lead ? thin(lead.points) : [];
  const clock = (time: number) => new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const marks = lead?.points ?? [];
  const lineX = marks.length
    ? [clock(marks[0].t), clock(marks[Math.floor((marks.length - 1) / 2)].t), clock(marks[marks.length - 1].t)]
    : ['—', '—', '—'];
  const lineY = [fmt(mapped.max), fmt((mapped.max + mapped.min) / 2), fmt(mapped.min)];
  const short = (label: string) => (label.length > 7 ? `${label.slice(0, 6)}…` : label);
  const pick = (items: GallerySeries[]) => [items[0], items[Math.floor((items.length - 1) / 2)], items[items.length - 1]].filter(Boolean);
  const barPeak = Math.max(...bars.map((item) => Math.abs(item.actual)), 1);
  const barY = pick(bars).map((item) => short(item.label));
  const barX = ['0', fmt(barPeak / 2), fmt(barPeak)];
  const colPeak = Math.max(...bars.map((item) => Math.abs(item.average)), 1);
  const colY = [fmt(colPeak), fmt(colPeak / 2), '0'];
  const colX = pick(bars).map((item) => short(item.label));
  const projected = leadPoints.length
    ? [...leadPoints, { t: leadPoints[leadPoints.length - 1].t, v: leadPoints[leadPoints.length - 1].v + (leadPoints[leadPoints.length - 1].v - leadPoints[Math.max(0, leadPoints.length - 4)].v) }]
    : [];

  const stacked = lines.map((item) => thin(item.points));
  const stackPeak = Math.max(...stacked.flatMap((row) => row.map((point) => point.v)), 1);
  const stackY = [fmt(stackPeak), fmt(stackPeak / 2), '0'];
  const stackCount = stacked[0]?.length ?? 0;
  const stackTotals = Array.from({ length: stackCount }, (_, index) =>
    stacked.reduce((sum, row) => sum + Math.max(row[index]?.v ?? 0, 0), 0) || 1
  );

  const envelope = Array.from({ length: stackCount }, (_, index) => {
    const column = stacked.map((row) => row[index]?.v ?? 0);
    return { min: Math.min(...column), max: Math.max(...column), mid: column.reduce((sum, value) => sum + value, 0) / (column.length || 1) };
  });

  const ranks = stacked.map((row, rowIndex) =>
    row.map((point, index) => {
      const column = stacked.map((entry) => entry[index]?.v ?? 0).sort((a, b) => b - a);
      return { ...point, rank: column.indexOf(point.v), rowIndex };
    })
  );

  return (
    <div className="sum-gallery">
      <Card title="Line chart" y={lineY} x={lineX} detail={detail([{ label: 'Latest', value: lead ? `${fmt(lead.actual)} ${lead.unit}` : '—' }])} onTip={onTip} onHide={onHide}>
          {mapped.points.map((points, index) => (
            <polyline key={lines[index]?.label ?? index} fill="none" stroke={BLUE[index % BLUE.length]} strokeWidth="2" points={poly(points, mapped.x, mapped.y)} />
          ))}
      </Card>

      <Card title="Line chart (projected)" y={lineY} x={lineX} detail={detail([{ label: 'Projected from', value: lead?.label ?? machine }])} onTip={onTip} onHide={onHide}>
          <polyline fill="none" stroke="#1a73e8" strokeWidth="2" points={poly(leadPoints, mapped.x, mapped.y)} />
          {projected.length > 1 && (
            <polyline fill="none" stroke="#8ab4f8" strokeWidth="2" strokeDasharray="4 3" points={poly(projected.slice(-2), (index) => mapped.x(leadPoints.length - 2 + index, leadPoints.length + 1), mapped.y)} />
          )}
      </Card>

      <Card title="Line chart (searchable)" y={lineY} x={lineX} detail={detail(lines.map((item) => ({ label: item.label, value: `${fmt(item.actual)} ${item.unit}` })))} onTip={onTip} onHide={onHide}>
          {mapped.points.map((points, index) => (
            <polyline key={index} fill="none" stroke={BLUE[index % BLUE.length]} strokeWidth="1.6" points={poly(points, mapped.x, mapped.y)} />
          ))}
          {mapped.points[0] && (
            <circle cx={mapped.x(mapped.points[0].length - 1, mapped.points[0].length)} cy={mapped.y(mapped.points[0][mapped.points[0].length - 1].v)} r="3.5" fill="#1a73e8" />
          )}
      </Card>

      <Card title="Line chart (with highlight)" y={lineY} x={lineX} detail={detail([{ label: 'Highlighted', value: lead?.label ?? machine }])} onTip={onTip} onHide={onHide}>
          {mapped.points.map((points, index) => (
            <polyline key={index} fill="none" stroke={index === 0 ? '#1a73e8' : '#dadce0'} strokeWidth={index === 0 ? 2.4 : 1.4} points={poly(points, mapped.x, mapped.y)} />
          ))}
      </Card>

      <Card title="Area chart (proportional)" y={['100%', '50%', '0%']} x={lineX} detail={detail()} onTip={onTip} onHide={onHide}>
          {stacked.map((row, index) => {
            const top = row.map((point, step) => {
              const before = stacked.slice(0, index).reduce((sum, entry) => sum + Math.max(entry[step]?.v ?? 0, 0), 0);
              return { t: point.t, v: ((before + Math.max(point.v, 0)) / stackTotals[step]) * 100 };
            });
            const bottom = row.map((point, step) => {
              const before = stacked.slice(0, index).reduce((sum, entry) => sum + Math.max(entry[step]?.v ?? 0, 0), 0);
              return { t: point.t, v: (before / stackTotals[step]) * 100 };
            });
            const yPct = (value: number) => 8 + ((100 - value) / 100) * 78;
            const d = `${top.map((point, step) => `${step === 0 ? 'M' : 'L'} ${mapped.x(step, top.length)} ${yPct(point.v)}`).join(' ')} ${bottom.slice().reverse().map((point, step) => `L ${mapped.x(bottom.length - 1 - step, bottom.length)} ${yPct(point.v)}`).join(' ')} Z`;
            return <path key={index} d={d} fill={BLUE[index % BLUE.length]} opacity={0.9 - index * 0.12} />;
          })}
      </Card>

      <Card title="Area chart (stacked)" y={stackY} x={lineX} detail={detail()} onTip={onTip} onHide={onHide}>
          {stacked.map((row, index) => {
            const upper = row.map((point, step) => ({
              t: point.t,
              v: stacked.slice(0, index + 1).reduce((sum, entry) => sum + Math.max(entry[step]?.v ?? 0, 0), 0),
            }));
            const lower = row.map((point, step) => ({
              t: point.t,
              v: stacked.slice(0, index).reduce((sum, entry) => sum + Math.max(entry[step]?.v ?? 0, 0), 0),
            }));
            const peak = Math.max(...upper.map((point) => point.v), 1);
            const yStack = (value: number) => 86 - (value / peak) * 74;
            const d = `${upper.map((point, step) => `${step === 0 ? 'M' : 'L'} ${mapped.x(step, upper.length)} ${yStack(point.v)}`).join(' ')} ${lower.slice().reverse().map((point, step) => `L ${mapped.x(lower.length - 1 - step, lower.length)} ${yStack(point.v)}`).join(' ')} Z`;
            return <path key={index} d={d} fill={BLUE[index % BLUE.length]} opacity="0.85" />;
          })}
      </Card>

      <Card title="Bar chart" y={barY} x={barX} detail={detail(bars.slice(0, 3).map((item) => ({ label: item.label, value: `${fmt(item.actual)} ${item.unit}` })))} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const width = Math.max(8, Math.min(132, (Math.abs(item.actual) / Math.max(...bars.map((row) => Math.abs(row.actual)), 1)) * 132));
            return <rect key={item.label} x="22" y={10 + index * 13} width={width} height="8" rx="2" fill={BLUE[index % BLUE.length]} />;
          })}
      </Card>

      <Card title="Bar chart (proportional)" y={barY} x={barX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const total = bars.reduce((sum, row) => sum + Math.abs(row.actual), 0) || 1;
            return <rect key={item.label} x="22" y={10 + index * 13} width={(Math.abs(item.actual) / total) * 132} height="8" rx="2" fill={BLUE[index % 3]} />;
          })}
      </Card>

      <Card title="Bar chart (stacked)" y={barY} x={['0', '100', '180']} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const pct = Math.min(180, Math.max(0, (item.actual / item.setPoint) * 100));
            const base = Math.min(pct, 100) / 180 * 120;
            const extra = Math.max(pct - 100, 0) / 180 * 120;
            return (
              <g key={item.label}>
                <rect x="22" y={10 + index * 13} width={base} height="8" rx="2" fill="#d2e3fc" />
                <rect x={22 + base} y={10 + index * 13} width={extra} height="8" fill="#1a73e8" />
              </g>
            );
          })}
      </Card>

      <Card title="Column + line" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const height = Math.min(70, (item.average / 180) * 70);
            return <rect key={item.label} x={16 + index * 22} y={82 - height} width="12" height={height} rx="2" fill="#8ab4f8" />;
          })}
          <polyline fill="none" stroke="#1a73e8" strokeWidth="2" points={bars.map((item, index) => `${22 + index * 22},${82 - Math.min(70, (item.actual / item.setPoint) * 40)}`).join(' ')} />
      </Card>

      <Card title="Line + area" y={lineY} x={lineX} detail={detail([{ label: lead?.label ?? 'Series', value: lead ? `${fmt(lead.average)}% of set` : '—' }])} onTip={onTip} onHide={onHide}>
          <polygon points={area(leadPoints, mapped.x, mapped.y)} fill="#d2e3fc" />
          <polyline fill="none" stroke="#1a73e8" strokeWidth="2" points={poly(leadPoints, mapped.x, mapped.y)} />
      </Card>

      <Card title="Column chart" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const height = Math.min(72, (item.average / 180) * 72);
            return <rect key={item.label} x={18 + index * 22} y={84 - height} width="14" height={Math.max(height, 2)} rx="2" fill={index % 2 ? '#8ab4f8' : '#1a73e8'} />;
          })}
      </Card>

      <Card title="Column chart (grouped)" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const actualH = Math.min(68, Math.abs(item.actual / item.setPoint) * 40);
            return (
              <g key={item.label}>
                <rect x={14 + index * 36} y={82 - 46} width="10" height="46" rx="2" fill="#d2e3fc" />
                <rect x={26 + index * 36} y={82 - actualH} width="10" height={Math.max(actualH, 2)} rx="2" fill="#1a73e8" />
              </g>
            );
          })}
      </Card>

      <Card title="Column chart (proportional)" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const total = bars.reduce((sum, row) => sum + Math.abs(row.average), 0) || 1;
            const height = (Math.abs(item.average) / total) * 220;
            return <rect key={item.label} x={18 + index * 22} y={84 - Math.min(height, 72)} width="14" height={Math.max(Math.min(height, 72), 2)} rx="2" fill="#1a73e8" opacity={1 - index * 0.1} />;
          })}
      </Card>

      <Card title="Custom grid (columns)" y={barY} x={['1', '4', '8']} detail={detail()} onTip={onTip} onHide={onHide}>
          {stacked.slice(0, 5).map((row, rowIndex) =>
            thin(row, 8).map((point, col) => {
              const shade = Math.min(1, Math.max(0.15, point.v / 160));
              return <rect key={`${rowIndex}-${col}`} x={18 + col * 16} y={12 + rowIndex * 15} width="12" height="11" rx="2" fill="#1a73e8" opacity={shade} />;
            })
          )}
      </Card>

      <Card title="Donut chart" y={[String(series.length), String(Math.round(series.length / 2)), '0']} x={[String(inCount), String(outCount), String(series.length)]} detail={detail([{ label: 'In tolerance', value: String(inCount) }, { label: 'Out of tolerance', value: String(outCount) }])} onTip={onTip} onHide={onHide}>
          <g transform="translate(80 48)">
            <circle r="26" fill="none" stroke="#e8f0fe" strokeWidth="14" />
            <circle r="26" fill="none" stroke="#1a73e8" strokeWidth="14" strokeDasharray={`${(inCount / (series.length || 1)) * 163} 163`} transform="rotate(-90)" strokeLinecap="butt" />
            <circle r="16" fill="#fff" />
          </g>
      </Card>

      <Card title="Fan chart" y={lineY} x={lineX} detail={detail()} onTip={onTip} onHide={onHide}>
          {envelope.length > 1 && (
            <polygon
              points={`${envelope.map((point, index) => `${mapped.x(index, envelope.length)},${mapped.y(point.max)}`).join(' ')} ${envelope.slice().reverse().map((point, index) => `${mapped.x(envelope.length - 1 - index, envelope.length)},${mapped.y(point.min)}`).join(' ')}`}
              fill="#d2e3fc"
            />
          )}
          <polyline fill="none" stroke="#1a73e8" strokeWidth="2" points={envelope.map((point, index) => `${mapped.x(index, envelope.length)},${mapped.y(point.mid)}`).join(' ')} />
      </Card>

      <Card title="Grid of area charts" y={lineY} x={lineX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const local = thin(item.points, 12);
            const ox = (index % 2) * 78 + 8;
            const oy = Math.floor(index / 2) * 46 + 6;
            const coords = local.map((point, step) => {
              const min = Math.min(...local.map((row) => row.v));
              const max = Math.max(...local.map((row) => row.v));
              const px = ox + (step / Math.max(local.length - 1, 1)) * 64;
              const py = oy + 28 - ((point.v - min) / (max - min || 1)) * 24;
              return `${px},${py}`;
            });
            return (
              <g key={item.label}>
                <polygon points={`${coords.join(' ')} ${ox + 64},${oy + 32} ${ox},${oy + 32}`} fill="#d2e3fc" />
                <polyline fill="none" stroke="#1a73e8" strokeWidth="1.4" points={coords.join(' ')} />
              </g>
            );
          })}
      </Card>

      <Card title="Grid of bar charts" y={barY} x={barX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const ox = (index % 2) * 78 + 10;
            const oy = Math.floor(index / 2) * 46 + 10;
            return [0.45, 0.7, 0.55, 0.9].map((scale, bar) => (
              <rect key={`${item.label}-${bar}`} x={ox} y={oy + bar * 8} width={56 * (0.4 + ((item.average / 100) * scale) % 0.6)} height="5" rx="1" fill={bar % 2 ? '#8ab4f8' : '#1a73e8'} />
            ));
          })}
      </Card>

      <Card title="Grid of column charts" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const ox = (index % 2) * 78 + 14;
            const oy = Math.floor(index / 2) * 46 + 8;
            return [0.5, 0.8, 0.62, 0.95].map((scale, bar) => {
              const height = 8 + scale * 22 * Math.min(item.average / 100, 1.4);
              return <rect key={`${item.label}-${bar}`} x={ox + bar * 14} y={oy + 32 - height} width="8" height={height} rx="1" fill={bar % 2 ? '#8ab4f8' : '#1a73e8'} />;
            });
          })}
      </Card>

      <Card title="Grid of donut charts" y={['100%', '50%', '0%']} x={lineX} detail={detail(lines.map((item) => ({ label: item.label, value: `${Math.round(item.insideShare * 100)}%` })))} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const cx = (index % 2) * 78 + 40;
            const cy = Math.floor(index / 2) * 46 + 24;
            const length = item.insideShare * 69;
            return (
              <g key={item.label}>
                <circle cx={cx} cy={cy} r="11" fill="none" stroke="#e8f0fe" strokeWidth="6" />
                <circle cx={cx} cy={cy} r="11" fill="none" stroke="#1a73e8" strokeWidth="6" strokeDasharray={`${length} 69`} transform={`rotate(-90 ${cx} ${cy})`} />
              </g>
            );
          })}
      </Card>

      <Card title="Line bump chart" y={['1', '2', '3', '4']} x={lineX} detail={detail(lines.map((item, index) => ({ label: item.label, value: `Rank ${ranks[index]?.[ranks[index].length - 1]?.rank + 1 || index + 1}` })))} onTip={onTip} onHide={onHide}>
          {ranks.map((row, index) => (
            <polyline
              key={lines[index]?.label ?? index}
              fill="none"
              stroke={BLUE[index % BLUE.length]}
              strokeWidth="2"
              points={row.map((point, step) => `${mapped.x(step, row.length)},${16 + point.rank * 16}`).join(' ')}
            />
          ))}
      </Card>

      <Card title="Pie chart" y={['100%', '50%', '0%']} x={[`${Math.round(timeInside * 100)}%`, `${Math.round(50)}%`, `${Math.round((1 - timeInside) * 100)}%`]} detail={detail([{ label: 'Inside tolerance', value: `${Math.round(timeInside * 100)}%` }, { label: 'Outside tolerance', value: `${Math.round((1 - timeInside) * 100)}%` }])} onTip={onTip} onHide={onHide}>
          <g transform="translate(80 48)">
            <path d={wedge(0, timeInside, 30)} fill="#1a73e8" />
            <path d={wedge(timeInside, 1, 30)} fill="#aecbfa" />
          </g>
      </Card>

      <Card title="Population pyramid" y={barY} x={['−', '0', '+']} detail={detail([{ label: 'Above set', value: String(above.length) }, { label: 'Below set', value: String(below.length) }])} onTip={onTip} onHide={onHide}>
          {below.map((item, index) => {
            const width = Math.min(58, Math.abs(1 - item.actual / item.setPoint) * 70);
            return <rect key={item.label} x={72 - width} y={14 + index * 14} width={width} height="9" rx="2" fill="#8ab4f8" />;
          })}
          {above.map((item, index) => {
            const width = Math.min(58, Math.abs(item.actual / item.setPoint - 1) * 70);
            return <rect key={item.label} x="80" y={14 + index * 14} width={width} height="9" rx="2" fill="#1a73e8" />;
          })}
          <line x1="76" x2="76" y1="8" y2="88" stroke="#e8eaed" />
      </Card>
    </div>
  );
};

const wedge = (start: number, end: number, radius: number) => {
  const sweep = Math.max(end - start, 0);
  if (sweep <= 0.001) return '';
  if (sweep >= 0.999) return `M 0 ${-radius} A ${radius} ${radius} 0 1 1 0 ${radius} A ${radius} ${radius} 0 1 1 0 ${-radius} Z`;
  const angle = (turn: number) => turn * Math.PI * 2 - Math.PI / 2;
  const point = (turn: number) => [Math.cos(angle(turn)) * radius, Math.sin(angle(turn)) * radius];
  const [x0, y0] = point(start);
  const [x1, y1] = point(end);
  return `M 0 0 L ${x0} ${y0} A ${radius} ${radius} 0 ${sweep > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z`;
};
