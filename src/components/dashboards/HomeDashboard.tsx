import React, { useMemo, useState } from 'react';

import { mockMachines } from '../../data/mockPlantData';

import { EfficiencyBar, ShareBarChart } from '../charts/PortalCharts';

import { useLiveNumber, useTelemetryTick } from '../../lib/LiveTelemetry';
import { formatNumber, formatPortalAsOf, wobble } from '../../lib/liveValue';



interface HomeDashboardProps {

  onNavigate: (id: string, breadcrumb: string) => void;

  unacknowledgedAlarmsCount: number;

}



export const HomeDashboard: React.FC<HomeDashboardProps> = ({

  onNavigate,

  unacknowledgedAlarmsCount,

}) => {

  const [viewMode, setViewMode] = useState<'standard' | 'overview'>('standard');

  const tick = useTelemetryTick();
  const portalStamp = useMemo(() => formatPortalAsOf(), [tick]);



  const power = useLiveNumber(14.82, 1, 0.08);

  const steam = useLiveNumber(42.5, 2, 0.12);

  const production = useLiveNumber(184520, 3, 120);

  const water = useLiveNumber(2150, 4, 8);



  const kpiBars = useMemo(

    () => [

      {

        label: 'TOTAL PLANT POWER',

        value: power,

        unit: 'MW',

        fillClass: '',

        sublabel: 'Grid: 4.2 MW • Genset: 7.6 MW • Solar: 3.0 MW',

      },

      {

        label: 'STEAM GENERATION',

        value: steam,

        unit: 'TPH',

        fillClass: 'steam-fill',

        sublabel: 'Boiler 1: 18.2 • Boiler 2: 16.8 • WHRB: 7.5 TPH',

      },

      {

        label: 'DAILY PRODUCTION',

        value: production,

        unit: 'Meters',

        fillClass: 'prod-fill',

        sublabel: 'Target: 200,000 m (92.3% of Shift Quota)',

      },

      {

        label: 'PLANT WATER BALANCE',

        value: water,

        unit: 'm³/day',

        fillClass: 'water-fill',

        sublabel: 'RO Permeate: 78% Recovery • ETP: Normal NEQS',

      },

    ],

    [power, steam, production, water],

  );



  const liveMachines = useMemo(

    () =>

      mockMachines.map((m, index) => ({

        ...m,

        liveTemp: Number(wobble(m.temperature, tick, 1.2, index + 1).toFixed(1)),

        liveEff: Number(wobble(m.efficiency, tick, 0.35, index + 5).toFixed(1)),

        liveSpeed:
          m.status === 'running'
            ? wobble(Number.parseFloat(m.speed) || 0, tick, 0.4, index + 9)
            : 0,

      })),

    [tick],

  );



  return (

    <div className="dashboard-content home-view-container">

      <div className="home-top-toolbar">

        <div className="plant-quick-badge">

          <span className="live-pulse"></span>

          <span className="plant-name-badge">LIBERTY MILLS LIMITED</span>

          <span className="plant-tagline">Central SCADA & Industrial Monitoring Portal</span>

          <span className="content-asof home-asof">
            <span className="live-pulse" aria-hidden />
            Last update · {portalStamp}
          </span>

          <button type="button" className="plant-status-pill" onClick={() => onNavigate('alarms', 'Alarms')}>

            {unacknowledgedAlarmsCount} OPEN ALARMS

          </button>

        </div>



        <div className="view-toggle-group">

          <button

            className={`btn-toggle-view ${viewMode === 'standard' ? 'active' : ''}`}

            onClick={() => setViewMode('standard')}

          >

            Clean Canvas View

          </button>

          <button

            className={`btn-toggle-view ${viewMode === 'overview' ? 'active' : ''}`}

            onClick={() => setViewMode('overview')}

          >

            Plant SCADA Overview

          </button>

        </div>

      </div>



      {viewMode === 'standard' ? (

        <div className="clean-home-card" aria-label="Home workspace" />

      ) : (

        <div className="overview-scada-container">

          <div className="kpi-banner-grid">

            <ShareBarChart rows={kpiBars} layout="kpi" max={200000} />

          </div>



          <div className="plant-machines-card">

            <div className="card-top-bar">

              <h3>Live Finishing & Printing Machines Telemetry</h3>

              <span className="badge-live-feed">Real-time SCADA Feeds Active</span>

            </div>

            <div className="table-responsive">

              <table className="scada-table">

                <thead>

                  <tr>

                    <th>Machine ID</th>

                    <th>Type & Description</th>

                    <th>Status</th>

                    <th>Current Speed</th>

                    <th>Active Job Card</th>

                    <th>Operator</th>

                    <th>Chamber Temp</th>

                    <th>Efficiency</th>

                  </tr>

                </thead>

                <tbody>

                  {liveMachines.map((m) => (

                    <tr key={m.id}>

                      <td className="font-mono"><strong>{m.id}</strong></td>

                      <td>{m.name}</td>

                      <td>

                        <span className={`status-tag ${m.status}`}>

                          <span className="dot"></span> {m.status.toUpperCase()}

                        </span>

                      </td>

                      <td className="font-mono">

                        {m.status === 'running' ? `${formatNumber(m.liveSpeed, 1)} m/min` : m.speed}

                      </td>

                      <td className="font-sub">{m.jobCard}</td>

                      <td>{m.operator}</td>

                      <td className="font-mono">{m.liveTemp} °C</td>

                      <td>

                        <EfficiencyBar value={m.liveEff} />

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


