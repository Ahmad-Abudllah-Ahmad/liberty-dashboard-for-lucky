import React, { useContext } from 'react';

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

const GalleryOpen = React.createContext<{ only?: string; onOpen?: (title: string) => void }>({});

const lineMark = (label: string, points: { t: number; v: number }[], kind = 'percent') => ({
  'data-label': label,
  'data-kind': kind,
  'data-values': points.map((point) => String(point.v)).join(','),
  ...(points[0] && points[0].t > 1e11 ? { 'data-times': points.map((point) => String(point.t)).join(',') } : {}),
});

const barMark = (label: string, value: string, status: string) => ({
  'data-label': label,
  'data-value': value,
  'data-status': status,
});

const readingStatus = (percent: number) => (
  Math.abs(percent - 100) <= 5 ? 'In tolerance' : percent > 100 ? 'Above set' : 'Below set'
);

const screenPoint = (node: SVGGraphicsElement, x: number, y: number) => {
  const matrix = node.getScreenCTM();
  if (!matrix) return null;
  return new DOMPoint(x, y).matrixTransform(matrix);
};

const markDetail = (node: Element, index: number): { title: string; detail: Detail } => {
  const label = node.getAttribute('data-label') || 'Reading';
  const direct = node.getAttribute('data-value');
  const values = (node.getAttribute('data-values') || '').split(',').filter(Boolean);
  const times = (node.getAttribute('data-times') || '').split(',').filter(Boolean);
  const raw = direct ?? values[index];
  const numeric = raw === undefined ? NaN : Number(raw);
  const kind = node.getAttribute('data-kind');
  const status = node.getAttribute('data-status')
    || (kind === 'rank' && Number.isFinite(numeric) ? `Rank ${Math.round(numeric)}` : Number.isFinite(numeric) ? readingStatus(numeric) : 'Live');
  const time = times[index] ? new Date(Number(times[index])).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
  const value = direct
    || (Number.isFinite(numeric)
      ? kind === 'rank'
        ? `Rank ${Math.round(numeric)}`
        : kind === 'level'
          ? fmt(numeric)
          : `${fmt(numeric)}% of set`
      : '—');
  return {
    title: label,
    detail: [
      { label: 'Status', value: status },
      { label: 'Value', value },
      ...(time ? [{ label: 'Time', value: time }] : []),
    ],
  };
};

type SegmentHit = { distance: number; t: number; x: number; y: number };

const distToSegment = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): SegmentHit => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) {
    return { distance: Math.hypot(px - x1, py - y1), t: 0, x: x1, y: y1 };
  }
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  const x = x1 + t * dx;
  const y = y1 + t * dy;
  return { distance: Math.hypot(px - x, py - y), t, x, y };
};

type MarkHit = { x: number; y: number; node: Element; index: number };

const hitMark = (
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  stretch = false,
): MarkHit | null => {
  let best: MarkHit | null = null;
  let bestDistance = stretch ? 34 : 22;
  svg.querySelectorAll('polyline').forEach((line) => {
    const node = line as SVGPolylineElement;
    if (node.getAttribute('stroke') === '#e2e8f0' || node.getAttribute('stroke') === '#e8eaed') return;
    const points = node.points;
    for (let index = 0; index < points.numberOfItems - 1; index += 1) {
      const start = points.getItem(index);
      const end = points.getItem(index + 1);
      const s1 = screenPoint(node, start.x, start.y);
      const s2 = screenPoint(node, end.x, end.y);
      if (!s1 || !s2) continue;
      const hit = distToSegment(clientX, clientY, s1.x, s1.y, s2.x, s2.y);
      if (hit.distance < bestDistance) {
        bestDistance = hit.distance;
        best = { x: hit.x, y: hit.y, node, index: hit.t >= 0.5 ? index + 1 : index };
      }
    }
    if (points.numberOfItems === 1) {
      const point = points.getItem(0);
      const screen = screenPoint(node, point.x, point.y);
      if (!screen) return;
      const distance = Math.hypot(screen.x - clientX, screen.y - clientY);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { x: screen.x, y: screen.y, node, index: 0 };
      }
    }
  });
  svg.querySelectorAll('rect[data-label], path[data-label], circle[data-label]').forEach((mark) => {
    const node = mark as SVGGraphicsElement;
    const box = node.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    if (clientX < box.left || clientX > box.right || clientY < box.top || clientY > box.bottom) return;
    const distance = Math.hypot(clientX - (box.left + box.width / 2), clientY - (box.top + box.height / 2));
    if (distance < bestDistance) {
      bestDistance = distance;
      best = { x: clientX, y: clientY, node, index: 0 };
    }
  });
  return best;
};

const Card: React.FC<{
  title: string;
  detail: Detail;
  y: string[];
  x: string[];
  onTip: Tip;
  onHide: () => void;
  children: React.ReactNode;
}> = ({ title, detail, y, x, onTip, onHide, children }) => {
  const { only, onOpen } = useContext(GalleryOpen);
  if (only && only !== title) return null;
  void detail;
  void y;
  void x;
  const showPoint = (event: React.MouseEvent<SVGSVGElement>) => {
    const hit = hitMark(event.currentTarget, event.clientX, event.clientY, Boolean(only));
    if (!hit) {
      onHide();
      return;
    }
    const info = markDetail(hit.node, hit.index);
    onTip({ clientX: hit.x, clientY: hit.y } as React.MouseEvent, info.title, info.detail);
  };
  return (
  <article
    className="sum-gallery-card"
    onClick={() => {
      if (!only) onOpen?.(title);
    }}
    onMouseLeave={onHide}
  >
    <div className="sum-gallery-plot">
      <Frame y={y} x={x} stretch={Boolean(only)} onMove={showPoint} onLeave={onHide}>{children}</Frame>
    </div>
  </article>
  );
};

const Frame: React.FC<{
  y?: string[];
  x?: string[];
  stretch?: boolean;
  onMove?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onLeave?: () => void;
  children: React.ReactNode;
}> = ({ y = [], x = [], stretch = false, onMove, onLeave, children }) => {
  const axisX = stretch ? 22 : 58;
  const axisY = stretch ? 100 : 78;
  const plotX = stretch ? 24 : 60;
  const plotY = stretch ? 2 : 4;
  const plotW = stretch ? 134 : 96;
  const plotH = stretch ? 96 : 72;
  const font = stretch ? 3.1 : 7;
  return (
  <svg viewBox="0 0 160 112" preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'} onMouseMove={onMove} onMouseLeave={onLeave}>
    <line x1={axisX} y1={plotY} x2={axisX} y2={axisY} stroke="#e2e8f0" strokeWidth="0.8" />
    <line x1={axisX} y1={axisY} x2="158" y2={axisY} stroke="#e2e8f0" strokeWidth="0.8" />
    {y.map((label, index) => (
      <text
        key={`y-${index}`}
        x={axisX - 1.5}
        y={6 + (y.length > 1 ? (index * (axisY - 8)) / (y.length - 1) : 0)}
        fontSize={font}
        fill="#64748b"
        textAnchor="end"
        lengthAdjust="spacingAndGlyphs"
        textLength={label.length > 9 ? (stretch ? 18 : 52) : undefined}
      >
        {label}
      </text>
    ))}
    {x.map((label, index) => {
      const last = index === x.length - 1;
      const first = index === 0;
      const span = 158 - plotX;
      return (
        <text
          key={`x-${index}`}
          x={first ? plotX : last ? 158 : plotX + (index * span) / (x.length - 1)}
          y={stretch ? 108 : 96}
          fontSize={font}
          fill="#64748b"
          textAnchor={first ? 'start' : last ? 'end' : 'middle'}
          lengthAdjust="spacingAndGlyphs"
          textLength={label.length > 7 ? (stretch ? 16 : 28) : undefined}
        >
          {label}
        </text>
      );
    })}
    <g transform={`translate(${plotX} ${plotY}) scale(${plotW / 160} ${plotH / 96})`}>
      {children}
    </g>
  </svg>
  );
};

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
  only?: string;
  onOpen?: (title: string) => void;
}> = ({ machine, series, onTip, onHide, only, onOpen }) => {
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
  const pick = (items: GallerySeries[]) => [items[0], items[Math.floor((items.length - 1) / 2)], items[items.length - 1]].filter(Boolean);
  const barPeak = Math.max(...bars.map((item) => Math.abs(item.actual)), 1);
  const barY = pick(bars).map((item) => item.label);
  const barX = ['0', fmt(barPeak / 2), fmt(barPeak)];
  const colPeak = Math.max(...bars.map((item) => Math.abs(item.average)), 1);
  const colY = [fmt(colPeak), fmt(colPeak / 2), '0'];
  const colX = pick(bars).map((item) => item.label);
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
    <GalleryOpen.Provider value={{ only, onOpen }}>
    <div className={`sum-gallery${only ? ' is-focus' : ''}`}>
      <Card title="Line chart" y={lineY} x={lineX} detail={detail([{ label: 'Latest', value: lead ? `${fmt(lead.actual)} ${lead.unit}` : '—' }])} onTip={onTip} onHide={onHide}>
          {mapped.points.map((points, index) => (
            <polyline key={lines[index]?.label ?? index} {...lineMark(lines[index]?.label ?? 'Series', points)} fill="none" stroke={BLUE[index % BLUE.length]} strokeWidth="2" points={poly(points, mapped.x, mapped.y)} />
          ))}
      </Card>

      <Card title="Line chart (projected)" y={lineY} x={lineX} detail={detail([{ label: 'Projected from', value: lead?.label ?? machine }])} onTip={onTip} onHide={onHide}>
          <polyline {...(lead ? lineMark(lead.label, leadPoints) : {})} fill="none" stroke="#1a73e8" strokeWidth="2" points={poly(leadPoints, mapped.x, mapped.y)} />
          {projected.length > 1 && (
            <polyline {...(lead ? lineMark(`${lead.label} projected`, projected.slice(-2), 'percent') : {})} fill="none" stroke="#8ab4f8" strokeWidth="2" strokeDasharray="4 3" points={poly(projected.slice(-2), (index) => mapped.x(leadPoints.length - 2 + index, leadPoints.length + 1), mapped.y)} />
          )}
      </Card>

      <Card title="Line chart (searchable)" y={lineY} x={lineX} detail={detail(lines.map((item) => ({ label: item.label, value: `${fmt(item.actual)} ${item.unit}` })))} onTip={onTip} onHide={onHide}>
          {mapped.points.map((points, index) => (
            <polyline key={index} {...lineMark(lines[index]?.label ?? 'Series', points)} fill="none" stroke={BLUE[index % BLUE.length]} strokeWidth="1.6" points={poly(points, mapped.x, mapped.y)} />
          ))}
          {mapped.points[0] && (
            <circle cx={mapped.x(mapped.points[0].length - 1, mapped.points[0].length)} cy={mapped.y(mapped.points[0][mapped.points[0].length - 1].v)} r="3.5" fill="#1a73e8" />
          )}
      </Card>

      <Card title="Line chart (with highlight)" y={lineY} x={lineX} detail={detail([{ label: 'Highlighted', value: lead?.label ?? machine }])} onTip={onTip} onHide={onHide}>
          {mapped.points.map((points, index) => (
            <polyline key={index} {...lineMark(lines[index]?.label ?? 'Series', points)} fill="none" stroke={index === 0 ? '#1a73e8' : '#dadce0'} strokeWidth={index === 0 ? 2.4 : 1.4} points={poly(points, mapped.x, mapped.y)} />
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
            return (
              <g key={index}>
                <path d={d} fill={BLUE[index % BLUE.length]} opacity={0.9 - index * 0.12} />
                <polyline {...lineMark(lines[index]?.label ?? 'Series', top)} fill="none" stroke="transparent" strokeWidth="8" points={top.map((point, step) => `${mapped.x(step, top.length)},${yPct(point.v)}`).join(' ')} />
              </g>
            );
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
            return (
              <g key={index}>
                <path d={d} fill={BLUE[index % BLUE.length]} opacity="0.85" />
                <polyline {...lineMark(lines[index]?.label ?? 'Series', upper, 'level')} fill="none" stroke="transparent" strokeWidth="8" points={upper.map((point, step) => `${mapped.x(step, upper.length)},${yStack(point.v)}`).join(' ')} />
              </g>
            );
          })}
      </Card>

      <Card title="Bar chart" y={barY} x={barX} detail={detail(bars.slice(0, 3).map((item) => ({ label: item.label, value: `${fmt(item.actual)} ${item.unit}` })))} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const width = Math.max(8, Math.min(132, (Math.abs(item.actual) / Math.max(...bars.map((row) => Math.abs(row.actual)), 1)) * 132));
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.actual)} ${item.unit}`, readingStatus((item.actual / item.setPoint) * 100))} x="22" y={10 + index * 13} width={width} height="8" rx="2" fill={BLUE[index % BLUE.length]} />;
          })}
      </Card>

      <Card title="Bar chart (proportional)" y={barY} x={barX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const total = bars.reduce((sum, row) => sum + Math.abs(row.actual), 0) || 1;
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.actual)} ${item.unit}`, readingStatus((item.actual / item.setPoint) * 100))} x="22" y={10 + index * 13} width={(Math.abs(item.actual) / total) * 132} height="8" rx="2" fill={BLUE[index % 3]} />;
          })}
      </Card>

      <Card title="Bar chart (stacked)" y={barY} x={['0', '100', '180']} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const pct = Math.min(180, Math.max(0, (item.actual / item.setPoint) * 100));
            const base = Math.min(pct, 100) / 180 * 120;
            const extra = Math.max(pct - 100, 0) / 180 * 120;
            return (
              <g key={item.label}>
                <rect {...barMark(item.label, `${fmt(pct)}% of set`, readingStatus(pct))} x="22" y={10 + index * 13} width={Math.max(base + extra, 8)} height="8" rx="2" fill="#1a73e8" />
              </g>
            );
          })}
      </Card>

      <Card title="Column + line" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const height = Math.min(70, (item.average / 180) * 70);
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.average)}% of set`, readingStatus(item.average))} x={16 + index * 22} y={82 - height} width="12" height={height} rx="2" fill="#8ab4f8" />;
          })}
          <polyline {...lineMark('Actual', bars.map((item) => ({ t: 0, v: (item.actual / item.setPoint) * 100 })))} fill="none" stroke="#1a73e8" strokeWidth="2" points={bars.map((item, index) => `${22 + index * 22},${82 - Math.min(70, (item.actual / item.setPoint) * 40)}`).join(' ')} />
      </Card>

      <Card title="Line + area" y={lineY} x={lineX} detail={detail([{ label: lead?.label ?? 'Series', value: lead ? `${fmt(lead.average)}% of set` : '—' }])} onTip={onTip} onHide={onHide}>
          <polygon points={area(leadPoints, mapped.x, mapped.y)} fill="#d2e3fc" />
          <polyline {...(lead ? lineMark(lead.label, leadPoints) : {})} fill="none" stroke="#1a73e8" strokeWidth="2" points={poly(leadPoints, mapped.x, mapped.y)} />
      </Card>

      <Card title="Column chart" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const height = Math.min(72, (item.average / 180) * 72);
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.average)}% of set`, readingStatus(item.average))} x={18 + index * 22} y={84 - height} width="14" height={Math.max(height, 2)} rx="2" fill={index % 2 ? '#8ab4f8' : '#1a73e8'} />;
          })}
      </Card>

      <Card title="Column chart (grouped)" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const actualH = Math.min(68, Math.abs(item.actual / item.setPoint) * 40);
            return (
              <g key={item.label}>
                <rect {...barMark(`${item.label} set`, `${fmt(item.setPoint)} ${item.unit}`, 'Set')} x={14 + index * 36} y={82 - 46} width="10" height="46" rx="2" fill="#d2e3fc" />
                <rect {...barMark(item.label, `${fmt(item.actual)} ${item.unit}`, readingStatus((item.actual / item.setPoint) * 100))} x={26 + index * 36} y={82 - actualH} width="10" height={Math.max(actualH, 2)} rx="2" fill="#1a73e8" />
              </g>
            );
          })}
      </Card>

      <Card title="Column chart (proportional)" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {bars.map((item, index) => {
            const total = bars.reduce((sum, row) => sum + Math.abs(row.average), 0) || 1;
            const height = (Math.abs(item.average) / total) * 220;
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.average)}% of set`, readingStatus(item.average))} x={18 + index * 22} y={84 - Math.min(height, 72)} width="14" height={Math.max(Math.min(height, 72), 2)} rx="2" fill="#1a73e8" opacity={1 - index * 0.1} />;
          })}
      </Card>

      <Card title="Custom grid (columns)" y={barY} x={['1', '4', '8']} detail={detail()} onTip={onTip} onHide={onHide}>
          {stacked.slice(0, 5).map((row, rowIndex) =>
            thin(row, 8).map((point, col) => {
              const shade = Math.min(1, Math.max(0.15, point.v / 160));
              return <rect key={`${rowIndex}-${col}`} {...barMark(lines[rowIndex]?.label ?? 'Series', `${fmt(point.v)}% of set`, readingStatus(point.v))} x={18 + col * 16} y={12 + rowIndex * 15} width="12" height="11" rx="2" fill="#1a73e8" opacity={shade} />;
            })
          )}
      </Card>

      <Card title="Donut chart" y={[String(series.length), String(Math.round(series.length / 2)), '0']} x={[String(inCount), String(outCount), String(series.length)]} detail={detail([{ label: 'In tolerance', value: String(inCount) }, { label: 'Out of tolerance', value: String(outCount) }])} onTip={onTip} onHide={onHide}>
          <g transform="translate(80 48)">
            <circle r="26" fill="none" stroke="#e8f0fe" strokeWidth="14" />
            <circle r="26" fill="none" stroke="#1a73e8" strokeWidth="14" strokeDasharray={`${(inCount / (series.length || 1)) * 163} 163`} transform="rotate(-90)" strokeLinecap="butt" />
            <circle r="16" fill="#fff" />
            <circle {...barMark('In tolerance', String(inCount), 'In tolerance')} r="26" fill="transparent" stroke="transparent" strokeWidth="14" />
            <circle {...barMark('Out of tolerance', String(outCount), 'Out of tolerance')} r="26" fill="transparent" stroke="transparent" strokeWidth="14" strokeDasharray={`${(outCount / (series.length || 1)) * 163} 163`} transform="rotate(-90)" />
          </g>
      </Card>

      <Card title="Fan chart" y={lineY} x={lineX} detail={detail()} onTip={onTip} onHide={onHide}>
          {envelope.length > 1 && (
            <polygon
              points={`${envelope.map((point, index) => `${mapped.x(index, envelope.length)},${mapped.y(point.max)}`).join(' ')} ${envelope.slice().reverse().map((point, index) => `${mapped.x(envelope.length - 1 - index, envelope.length)},${mapped.y(point.min)}`).join(' ')}`}
              fill="#d2e3fc"
            />
          )}
          <polyline {...lineMark(lead?.label ?? 'Series', envelope.map((point) => ({ t: 0, v: point.mid })))} fill="none" stroke="#1a73e8" strokeWidth="2" points={envelope.map((point, index) => `${mapped.x(index, envelope.length)},${mapped.y(point.mid)}`).join(' ')} />
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
                <polyline {...lineMark(item.label, local)} fill="none" stroke="#1a73e8" strokeWidth="1.4" points={coords.join(' ')} />
              </g>
            );
          })}
      </Card>

      <Card title="Grid of bar charts" y={barY} x={barX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const ox = (index % 2) * 78 + 10;
            const oy = Math.floor(index / 2) * 46 + 10;
            return [0.45, 0.7, 0.55, 0.9].map((scale, bar) => (
              <rect key={`${item.label}-${bar}`} {...barMark(item.label, `${fmt(item.average)}% of set`, readingStatus(item.average))} x={ox} y={oy + bar * 8} width={56 * (0.4 + ((item.average / 100) * scale) % 0.6)} height="5" rx="1" fill={bar % 2 ? '#8ab4f8' : '#1a73e8'} />
            ));
          })}
      </Card>

      <Card title="Grid of column charts" y={colY} x={colX} detail={detail()} onTip={onTip} onHide={onHide}>
          {lines.map((item, index) => {
            const ox = (index % 2) * 78 + 14;
            const oy = Math.floor(index / 2) * 46 + 8;
            return [0.5, 0.8, 0.62, 0.95].map((scale, bar) => {
              const height = 8 + scale * 22 * Math.min(item.average / 100, 1.4);
              return <rect key={`${item.label}-${bar}`} {...barMark(item.label, `${fmt(item.average)}% of set`, readingStatus(item.average))} x={ox + bar * 14} y={oy + 32 - height} width="8" height={height} rx="1" fill={bar % 2 ? '#8ab4f8' : '#1a73e8'} />;
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
                <circle {...barMark(item.label, `${Math.round(item.insideShare * 100)}%`, readingStatus(item.average))} cx={cx} cy={cy} r="14" fill="transparent" />
              </g>
            );
          })}
      </Card>

      <Card title="Line bump chart" y={['1', '2', '3', '4']} x={lineX} detail={detail(lines.map((item, index) => ({ label: item.label, value: `Rank ${ranks[index]?.[ranks[index].length - 1]?.rank + 1 || index + 1}` })))} onTip={onTip} onHide={onHide}>
          {ranks.map((row, index) => (
            <polyline
              key={lines[index]?.label ?? index}
              {...lineMark(lines[index]?.label ?? 'Series', row.map((point) => ({ t: point.t, v: point.rank + 1 })), 'rank')}
              fill="none"
              stroke={BLUE[index % BLUE.length]}
              strokeWidth="2"
              points={row.map((point, step) => `${mapped.x(step, row.length)},${16 + point.rank * 16}`).join(' ')}
            />
          ))}
      </Card>

      <Card title="Pie chart" y={['100%', '50%', '0%']} x={[`${Math.round(timeInside * 100)}%`, `${Math.round(50)}%`, `${Math.round((1 - timeInside) * 100)}%`]} detail={detail([{ label: 'Inside tolerance', value: `${Math.round(timeInside * 100)}%` }, { label: 'Outside tolerance', value: `${Math.round((1 - timeInside) * 100)}%` }])} onTip={onTip} onHide={onHide}>
          <g transform="translate(80 48)">
            <path {...barMark('Inside tolerance', `${Math.round(timeInside * 100)}%`, 'In tolerance')} d={wedge(0, timeInside, 30)} fill="#1a73e8" />
            <path {...barMark('Outside tolerance', `${Math.round((1 - timeInside) * 100)}%`, 'Out of tolerance')} d={wedge(timeInside, 1, 30)} fill="#aecbfa" />
          </g>
      </Card>

      <Card title="Population pyramid" y={barY} x={['−', '0', '+']} detail={detail([{ label: 'Above set', value: String(above.length) }, { label: 'Below set', value: String(below.length) }])} onTip={onTip} onHide={onHide}>
          {below.map((item, index) => {
            const width = Math.min(58, Math.abs(1 - item.actual / item.setPoint) * 70);
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.actual)} ${item.unit}`, 'Below set')} x={72 - width} y={14 + index * 14} width={width} height="9" rx="2" fill="#8ab4f8" />;
          })}
          {above.map((item, index) => {
            const width = Math.min(58, Math.abs(item.actual / item.setPoint - 1) * 70);
            return <rect key={item.label} {...barMark(item.label, `${fmt(item.actual)} ${item.unit}`, 'Above set')} x="80" y={14 + index * 14} width={width} height="9" rx="2" fill="#1a73e8" />;
          })}
          <line x1="76" x2="76" y1="8" y2="88" stroke="#e8eaed" />
      </Card>
    </div>
    </GalleryOpen.Provider>
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
