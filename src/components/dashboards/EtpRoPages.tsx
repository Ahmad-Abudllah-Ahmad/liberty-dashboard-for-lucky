import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PortalPageHead } from '../portal/PortalPageHead';
import { formatNumber, wobble } from '../../lib/liveValue';
import { LiveValue, useTelemetryTick } from '../../lib/LiveTelemetry';

type TipRow = { label: string; value: React.ReactNode };

const PfdHover: React.FC<{
  className?: string;
  tipTitle?: string;
  rows: TipRow[];
  children: React.ReactNode;
  tipPlacement?: 'above' | 'below';
  trigger?: 'hover' | 'click';
  tipWide?: boolean;
}> = ({
  className = '',
  tipTitle,
  rows,
  children,
  tipPlacement = 'below',
  trigger = 'hover',
  tipWide = false,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger !== 'click' || !open) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open, trigger]);

  const placementClass = tipPlacement === 'below' ? 'pfd-tip-below' : 'pfd-tip-above';

  return (
    <div
      ref={rootRef}
      className={`pfd-hover-wrap ${placementClass} ${open ? 'is-tip-open' : ''} ${className}`.trim()}
      {...(trigger === 'hover'
        ? {
            onMouseEnter: () => setOpen(true),
            onMouseLeave: () => setOpen(false),
            onFocus: () => setOpen(true),
            onBlur: () => setOpen(false),
          }
        : {
            onClick: (event: React.MouseEvent) => {
              event.stopPropagation();
              setOpen((value) => !value);
            },
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setOpen((value) => !value);
              }
              if (event.key === 'Escape') setOpen(false);
            },
          })}
      tabIndex={0}
      role={trigger === 'click' ? 'button' : undefined}
      aria-expanded={trigger === 'click' ? open : undefined}
    >
      {children}
      {open ? (
        <div
          className={`pfd-hover-tip ${tipWide ? 'pfd-hover-tip-wide' : ''}`.trim()}
          role="tooltip"
        >
          {tipTitle ? <strong>{tipTitle}</strong> : null}
          {rows.map((row) => (
            <div key={row.label} className="pfd-tip-row">
              <span>{row.label}</span>
              <span className="pfd-tip-val font-mono">{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const EtpFlowArrow: React.FC = () => <div className="etp-flow-arrow etp-flow-arrow-anim" aria-hidden="true" />;

const EtpKwNode: React.FC<{ label?: string; kw: number; title: string }> = ({ label, kw, title }) => {
  const active = kw > 40;
  return (
    <div className="etp-kw-stack">
      {label ? <span className="ro-note etp-kw-label">{label}</span> : null}
      <div className={`fan etp-kw-ring ${active ? 'fan-running' : ''}`} title={title}>
        <span className="etp-kw-plus">+</span>
      </div>
      <small className="etp-kw-value font-mono">{formatNumber(kw, 1)} kW</small>
    </div>
  );
};

type LiveTankProps = {
  title: string;
  metric: string;
  base: number;
  seed: number;
  amplitude?: number;
  unit: string;
  digits?: number;
  level?: number;
  className?: string;
  extraRows?: TipRow[];
};

const LiveTank: React.FC<LiveTankProps> = ({
  title,
  metric,
  base,
  seed,
  amplitude,
  unit,
  digits = 1,
  level,
  className = '',
  extraRows = [],
}) => {
  const tick = useTelemetryTick();
  const lvl = level ?? wobble(68, tick, 2.5, seed + 40);
  const suffix = unit ? ` ${unit}` : '';
  const rows: TipRow[] = [
    {
      label: metric,
      value: (
        <LiveValue value={base} seed={seed} amplitude={amplitude} digits={digits} suffix={suffix} />
      ),
    },
    ...(metric.toLowerCase() !== 'level'
      ? [{ label: 'Level', value: `${formatNumber(lvl, 0)}%` }]
      : []),
    ...extraRows,
  ];
  return (
    <PfdHover
      className={`pfd-tank etp-node ${className}`.trim()}
      tipTitle={title}
      tipPlacement="below"
      rows={rows}
    >
      {title}
    </PfdHover>
  );
};

type LiveChipProps = {
  title: string;
  value: number;
  seed: number;
  unit: string;
  on?: boolean;
  amplitude?: number;
};

const LiveChip: React.FC<LiveChipProps> = ({ title, value, seed, unit, on, amplitude = 0.35 }) => (
  <PfdHover
    className={`pfd-chip etp-node ${on ? 'on' : ''}`.trim()}
    tipTitle={title}
    tipPlacement="below"
    rows={[
      {
        label: 'Live',
        value: (
          <LiveValue value={value} seed={seed} amplitude={amplitude} digits={1} suffix={` ${unit}`} />
        ),
      },
    ]}
  >
    {title}
  </PfdHover>
);

const LiveMiniTank: React.FC<{ name: string; level: number }> = ({ name, level }) => (
  <PfdHover
    className="mini-tank etp-node"
    tipTitle={name}
    tipPlacement="below"
    rows={[{ label: 'Level', value: `${formatNumber(level, 0)}%` }]}
  >
    {name}
  </PfdHover>
);

const InlineSummary: React.FC<{ title: string; rows: TipRow[] }> = ({ title, rows }) => (
  <div className="etp-inline-summary" role="region" aria-label={title}>
    <p className="etp-inline-summary-title">{title}</p>
    <dl className="etp-inline-summary-grid">
      {rows.map((row) => (
        <div key={row.label} className="etp-inline-summary-item">
          <dt>{row.label}</dt>
          <dd className="font-mono">{row.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export const ETPDashboardPage: React.FC = () => {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const tick = useTelemetryTick();

  const blowers = useMemo(
    () => [132.2, 74.7, 131.2, 74.0].map((base, index) => wobble(base, tick, 1.1, index + 2)),
    [tick],
  );
  const totalKw = blowers.reduce((a, b) => a + b, 0);

  const influentPrint = wobble(42.8, tick, 0.9, 10);
  const influentZaib = wobble(28.4, tick, 0.6, 11);
  const eqLevel = wobble(72, tick, 2.2, 12);
  const doAer = wobble(3.2, tick, 0.08, 13);
  const tssOut = wobble(18, tick, 0.6, 14);
  const roFeedCond = wobble(890, tick, 12, 15);
  const mlss = wobble(8.4, tick, 0.15, 17);

  const cooling = useMemo(() => {
    const ids = ['C1', 'C3', 'C2', 'C4'] as const;
    return ids.map((id, i) => ({
      id,
      temp: wobble(32.5 + i * 0.4, tick, 0.25, 20 + i),
      seed: 20 + i,
    }));
  }, [tick]);

  const bannerRows: TipRow[] = [
    { label: 'Total influent', value: `${formatNumber(influentPrint + influentZaib, 1)} m³/h` },
    { label: 'EQ level', value: `${formatNumber(eqLevel, 0)}%` },
    { label: 'Aeration D.O.', value: `${formatNumber(doAer, 2)} mg/L` },
    { label: 'Effluent TSS', value: `${formatNumber(tssOut, 1)} mg/L` },
    { label: 'RO feed cond.', value: `${formatNumber(roFeedCond, 0)} µS/cm` },
    { label: 'Plant load', value: `${formatNumber(totalKw, 1)} kW` },
  ];

  return (
    <div className="portal-page">
      <PortalPageHead title="ETP Dashboard" crumb="Home / ETP Dashboard" layout="split" />

      <div className="pfd-board etp-dashboard">
        <button
          type="button"
          className="etp-banner etp-banner-wide etp-banner-toggle"
          onClick={() => setSummaryOpen((open) => !open)}
          aria-expanded={summaryOpen}
        >
          ETP Network
          <span className="etp-live-dot" title="Live telemetry">
            <span className="live-pulse" aria-hidden />
          </span>
          <span className="etp-banner-hint">{summaryOpen ? 'Hide summary' : 'Show summary'}</span>
        </button>
        {summaryOpen ? <InlineSummary title="Plant summary" rows={bannerRows} /> : null}

        <div className="etp-flow" role="img" aria-label="ETP process flow from influent to RO and boiler house">
          <section className="etp-stage">
            <div className="etp-inflow-head">
              <span className="ro-note">Flow Meters</span>
              <span className="ro-note etp-inflow-pumps">Pumps RUN</span>
            </div>
            <div className="pfd-row etp-inflow-sources">
              <LiveTank
                title="Printing (G1+G2)"
                metric="Flow"
                base={42.8}
                seed={10}
                amplitude={0.9}
                unit="m³/h"
                className="aqua"
              />
              <LiveTank title="Zaibtan" metric="Flow" base={28.4} seed={11} amplitude={0.6} unit="m³/h" className="aqua" />
            </div>
          </section>

          <EtpFlowArrow />

          <section className="etp-stage">
            <LiveTank
              title="Equalization Tank"
              metric="Level"
              base={72}
              seed={12}
              amplitude={2.2}
              unit="%"
              digits={0}
              className="wide etp-eq-tank"
              level={eqLevel}
            />
          </section>

          <EtpFlowArrow />

          <section className="etp-stage">
            <div className="etp-cooling-grid">
              <LiveChip title={cooling[0].id} value={cooling[0].temp} seed={cooling[0].seed} unit="°C" on />
              <LiveChip title={cooling[1].id} value={cooling[1].temp} seed={cooling[1].seed} unit="°C" on />
              <em className="etp-cooling-label">Cooling Tower</em>
              <LiveChip title={cooling[2].id} value={cooling[2].temp} seed={cooling[2].seed} unit="°C" on />
              <LiveChip title={cooling[3].id} value={cooling[3].temp} seed={cooling[3].seed} unit="°C" on />
            </div>
          </section>

          <EtpFlowArrow />

          <section className="etp-stage">
            <LiveTank
              title="Chemical Treatment Tank"
              metric="pH"
              base={7.2}
              seed={16}
              amplitude={0.06}
              unit=""
              digits={2}
              className="wide"
            />
          </section>

          <EtpFlowArrow />

          <section className="etp-stage etp-aeration-stage">
            <div className="etp-aeration-panel">
              <div className="pfd-row fans etp-aeration-row">
                <div className="fan-col etp-side-power">
                  <EtpKwNode label="Ro" kw={blowers[0]} title="Return pump motor A" />
                  <EtpKwNode kw={blowers[1]} title="Return pump motor B" />
                </div>
                <div className="aero-col">
                  <PfdHover
                    className="aero on"
                    tipTitle="Aeration-1"
                    tipPlacement="below"
                    rows={[
                      { label: 'D.O.', value: `${formatNumber(doAer, 2)} mg/L` },
                      { label: 'MLSS', value: `${formatNumber(mlss, 1)} g/L` },
                    ]}
                  >
                    Aeration-1
                  </PfdHover>
                  <div className="mbr-row">
                    <LiveChip title="MBR 1" value={wobble(12.1, tick, 0.25, 21)} seed={21} unit="m³/h" on />
                    <LiveChip title="MBR 2" value={wobble(11.8, tick, 0.25, 22)} seed={22} unit="m³/h" on />
                  </div>
                </div>
                <div className="aero-col">
                  <PfdHover
                    className="aero on"
                    tipTitle="Aeration-2"
                    tipPlacement="below"
                    rows={[{ label: 'D.O.', value: `${formatNumber(wobble(3.1, tick, 0.08, 19), 2)} mg/L` }]}
                  >
                    Aeration-2
                  </PfdHover>
                  <div className="mbr-row">
                    <LiveChip title="MBR 3" value={wobble(12.4, tick, 0.25, 23)} seed={23} unit="m³/h" on />
                    <LiveChip title="MBR 4" value={wobble(11.5, tick, 0.25, 24)} seed={24} unit="m³/h" on />
                  </div>
                </div>
                <div className="fan-col etp-side-power">
                  <EtpKwNode kw={blowers[2]} title="Blower motor A" />
                  <EtpKwNode kw={blowers[3]} title="Blower motor B" />
                  <small className="blower-tag">Blower</small>
                </div>
              </div>
            </div>
          </section>

          <EtpFlowArrow />

          <section className="etp-stage">
            <LiveTank
              title="RO Feed Tank"
              metric="Cond."
              base={roFeedCond}
              seed={15}
              amplitude={12}
              unit="µS/cm"
              digits={0}
              className="light etp-ro-feed wide"
            />
          </section>

          <EtpFlowArrow />

          <section className="etp-stage">
            <div className="pfd-row etp-ro-trains">
              <LiveChip title="R/O-1" value={wobble(8.2, tick, 0.2, 25)} seed={25} unit="m³/h" on />
              <LiveChip title="R/O-2" value={wobble(7.9, tick, 0.2, 26)} seed={26} unit="m³/h" on />
              <LiveTank title="Polishing R/O" metric="Flow" base={4.1} seed={27} amplitude={0.12} unit="m³/h" className="aqua" />
            </div>
          </section>

          <EtpFlowArrow />

          <section className="etp-stage etp-outlets">
            <div className="pfd-row">
              <LiveChip title="R/O Reject" value={wobble(3.2, tick, 0.15, 28)} seed={28} unit="m³/h" on />
              <LiveTank title="R/O Departments" metric="Supply" base={6.8} seed={29} amplitude={0.2} unit="m³/h" className="light" />
              <LiveTank
                title="Boiler House"
                metric="Make-up"
                base={2.4}
                seed={30}
                amplitude={0.1}
                unit="m³/h"
                className="amber"
                extraRows={[{ label: 'Effluent TSS', value: `${formatNumber(tssOut, 1)} mg/L` }]}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const RO_TANKS = ['Tank 1', 'Tank 2', 'Tank 3', 'Tank 4', 'Tank 5', 'Tank 6'] as const;

export const RONetworkPage: React.FC = () => {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const tick = useTelemetryTick();
  const motorLarge = wobble(100, tick, 1.5, 3);
  const motorSmall = wobble(30, tick, 0.5, 4);
  const rawIn = wobble(124, tick, 2.2, 60);
  const productFlow = wobble(86, tick, 1.4, 61);
  const tds = wobble(142, tick, 3.5, 62);
  const recovery = wobble(72.5, tick, 0.4, 63);

  const tankLevels = useMemo(
    () => RO_TANKS.map((_, i) => wobble(55 + (i % 3) * 8, tick, 2, 70 + i)),
    [tick],
  );

  const roBannerRows: TipRow[] = [
    { label: 'Raw inflow', value: `${formatNumber(rawIn, 1)} m³/h` },
    { label: 'RO product', value: `${formatNumber(productFlow, 1)} m³/h` },
    { label: 'Permeate TDS', value: `${formatNumber(tds, 0)} ppm` },
    { label: 'Recovery', value: `${formatNumber(recovery, 1)}%` },
    { label: 'HP pump', value: `${formatNumber(motorLarge, 1)} kW` },
    { label: 'Booster', value: `${formatNumber(motorSmall, 1)} kW` },
  ];

  return (
    <div className="portal-page">
      <PortalPageHead title="RO" crumb="Home / RO" layout="split" />

      <div className="pfd-board ro-board">
        <button
          type="button"
          className="ro-banner etp-banner-toggle"
          onClick={() => setSummaryOpen((open) => !open)}
          aria-expanded={summaryOpen}
        >
          RO Network
          <span className="etp-live-dot">
            <span className="live-pulse" aria-hidden />
          </span>
          <span className="etp-banner-hint">{summaryOpen ? 'Hide summary' : 'Show summary'}</span>
        </button>
        {summaryOpen ? <InlineSummary title="RO summary" rows={roBannerRows} /> : null}

        <div className="ro-sources">
          <PfdHover
            className="ro-source-block"
            tipTitle="Site supply"
            rows={[
              {
                label: 'IN-1',
                value: `${formatNumber(wobble(48, tick, 0.8, 80), 1)} m³/h`,
              },
              {
                label: 'IN-2',
                value: `${formatNumber(wobble(52, tick, 0.8, 81), 1)} m³/h`,
              },
            ]}
          >
            <b>Site supply</b>
          </PfdHover>
          <PfdHover
            className="ro-source-block"
            tipTitle="Purchased lines"
            rows={[
              {
                label: 'Flow',
                value: `${formatNumber(wobble(24, tick, 0.5, 82), 1)} m³/h`,
              },
            ]}
          >
            <b>Purchased water lines</b>
          </PfdHover>
          <PfdHover
            className="ro-source-block"
            tipTitle="Water board"
            rows={[
              {
                label: 'Est. flow',
                value: `${formatNumber(wobble(18, tick, 0.4, 83), 1)} m³/h`,
              },
            ]}
          >
            <b>Water board</b>
          </PfdHover>
        </div>

        <div className="pfd-row">
          <LiveTank title="HP Pumping Station" metric="Discharge" base={68} seed={84} unit="m³/h" className="wide aqua" />
          <PfdHover
            className="pfd-chip warn"
            tipTitle="Overflow line"
            rows={[
              {
                label: 'Flow',
                value: <LiveValue value={0.8} seed={85} amplitude={0.15} digits={2} suffix=" m³/h" />,
              },
            ]}
          >
            Overflow line
          </PfdHover>
          <LiveTank
            title="Post Office Pumping Station"
            metric="Discharge"
            base={56}
            seed={86}
            unit="m³/h"
            className="wide aqua"
          />
        </div>

        <div className="pfd-row">
          <span className="ro-note">Direct Line</span>
          <LiveTank
            title="Liberty Mills Limited"
            metric="Header"
            base={rawIn}
            seed={60}
            amplitude={2.2}
            unit="m³/h"
            className="wide"
          />
          <span className="ro-note">Direct Line</span>
        </div>

        <p className="ro-note">Hover tanks &amp; nodes for live levels · sync ~2s</p>

        <div className="pfd-row tanks ro-tank-grid">
          {RO_TANKS.map((t, i) => (
            <LiveMiniTank key={t} name={t} level={tankLevels[i]} />
          ))}
        </div>

        <div className="pfd-row">
          <LiveMiniTank name="Tank 7" level={wobble(62, tick, 2, 76)} />
          <LiveTank title="Softner Feed" metric="Flow" base={22} seed={87} unit="m³/h" />
          <LiveTank title="Ro Product" metric="Flow" base={productFlow} seed={61} amplitude={1.4} unit="m³/h" className="aqua" />
          <LiveMiniTank name="Tank 8" level={wobble(71, tick, 2, 77)} />
          <LiveTank title="Product Tank" metric="Level" base={74} seed={78} unit="%" digits={0} />
          <LiveMiniTank name="Tank 9" level={wobble(58, tick, 2, 79)} />
        </div>

        <div className="ro-plant">
          <LiveChip title="ETP RO" value={wobble(14.2, tick, 0.3, 88)} seed={88} unit="m³/h" on />
          <div className="motor-pair">
            <PfdHover
              className="motor-badge fan-running"
              tipTitle="HP motor"
              rows={[{ label: 'Load', value: `${formatNumber(motorLarge, 1)} kW` }]}
            >
              M<small className="font-mono">{formatNumber(motorLarge, 0)} kW</small>
            </PfdHover>
            <PfdHover
              className="motor-badge fan-running"
              tipTitle="Booster"
              rows={[{ label: 'Load', value: `${formatNumber(motorSmall, 1)} kW` }]}
            >
              M<small className="font-mono">{formatNumber(motorSmall, 0)} kW</small>
            </PfdHover>
          </div>
          <LiveChip title="Grey Water Pump Room" value={wobble(9.1, tick, 0.25, 89)} seed={89} unit="m³/h" />
          <LiveChip title="ETP" value={wobble(3.4, tick, 0.12, 90)} seed={90} unit="m³/h return" />
          <span className="ro-note font-mono">Waste {formatNumber(wobble(2.1, tick, 0.1, 91), 2)} m³/h</span>
        </div>

        <div className="pfd-row">
          <LiveTank title="Overhead Tank" metric="Level" base={82} seed={92} unit="%" digits={0} />
          <LiveTank title="Overhead Tank RO Water Main Tank" metric="Level" base={76} seed={93} unit="%" digits={0} />
          <LiveTank title="Mineral RO 35,000 Gall/Day" metric="Output" base={5.5} seed={94} unit="m³/h" className="wide" />
        </div>

        <section className="ro-customers-section" aria-label="Product tank distribution">
          <p className="ro-section-label">Product Tank</p>
          <div className="ro-customers-grid">
            <div className="ro-customers-col">
              <LiveChip title="SOS Tank" value={wobble(4.2, tick, 0.1, 95)} seed={95} unit="m³/h" on />
              <div className="ro-customers-subrow">
                <LiveChip title="Dyeing Machines" value={wobble(28, tick, 0.6, 96)} seed={96} unit="m³/h" />
                <LiveChip title="Finishing Machines" value={wobble(22, tick, 0.5, 97)} seed={97} unit="m³/h" />
              </div>
            </div>
            <div className="ro-customers-col ro-customers-mid">
              <LiveChip title="Dyeing" value={wobble(18, tick, 0.4, 98)} seed={98} unit="m³/h" />
              <LiveChip title="Color Kitchen" value={wobble(6.2, tick, 0.15, 99)} seed={99} unit="m³/h" />
              <LiveChip title="Canlars" value={wobble(4.8, tick, 0.12, 100)} seed={100} unit="m³/h" />
              <LiveChip title="Fongs" value={wobble(3.1, tick, 0.1, 101)} seed={101} unit="m³/h" />
            </div>
            <div className="ro-customers-col">
              <LiveTank title="Product Tank (Zakaria Tank)" metric="Level" base={68} seed={102} unit="%" digits={0} />
              <span className="ro-note ro-note-center">Mag flow commissioning</span>
            </div>
          </div>
        </section>

        <div className="pfd-row ro-outlets-row">
          {['Muslim Cotton', 'Al-Abid', 'Masola', 'Zakria'].map((name, i) => (
            <LiveChip
              key={name}
              title={name}
              value={wobble(8 + i * 2, tick, 0.3, 110 + i)}
              seed={110 + i}
              unit="m³/h"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
