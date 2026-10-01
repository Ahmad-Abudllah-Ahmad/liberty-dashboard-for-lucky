import React, { useState } from 'react';
import type { AlarmRecord } from '../../types';
import { PortalPageHead } from '../portal/PortalPageHead';
import { ScadaContentHeader } from '../portal/ScadaContentHeader';
import { formatNumber, wobble } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';

interface AlarmsDashboardProps {
  alarms: AlarmRecord[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export const AlarmsDashboard: React.FC<AlarmsDashboardProps> = ({
  alarms,
  onAcknowledge,
  onAcknowledgeAll,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unack' | 'ack'>('all');
  const [sirenMuted, setSirenMuted] = useState<boolean>(false);
  const [view, setView] = useState<'abnormals' | 'events'>('abnormals');
  const [unit, setUnit] = useState('Printing Unit');
  const [section, setSection] = useState('FINISHING');
  const [shownUnit, setShownUnit] = useState('Printing Unit');
  const tick = useTelemetryTick();

  const filteredAlarms = alarms.filter((alm) => {
    if (severityFilter !== 'all' && alm.severity !== severityFilter) return false;
    if (areaFilter !== 'all' && alm.area !== areaFilter) return false;
    if (statusFilter === 'unack' && alm.acknowledged) return false;
    if (statusFilter === 'ack' && !alm.acknowledged) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alm.tag.toLowerCase().includes(q) ||
        alm.description.toLowerCase().includes(q) ||
        alm.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = alarms.filter((a) => a.severity === 'critical').length;
  const majorCount = alarms.filter((a) => a.severity === 'major').length;
  const minorCount = alarms.filter((a) => a.severity === 'minor').length;
  const unackCount = alarms.filter((a) => !a.acknowledged).length;
  const totalAlarms = alarms.length;
  const ackCount = totalAlarms - unackCount;
  const infoCount = alarms.filter((a) => a.severity === 'info').length;

  const printingPairs = [
    {
      name: 'STENTER-20 (RED FLAG)',
      rows: [
        { label: 'Speed', set: 65, actual: 26.1 },
        { label: 'Burner 06', set: 140, actual: 129 },
        { label: 'Moisture', set: 4, actual: 5.1 },
      ],
    },
    {
      name: 'STENTER-15 (NEW MONFORTS)',
      rows: [
        { label: 'Burner 06', set: 190, actual: 142 },
        { label: 'Burner 09', set: 190, actual: 124 },
        { label: 'Moisture', set: 5, actual: 2.2 },
        { label: 'Panel Temperature', set: 28, actual: 31.6 },
      ],
    },
  ];
  const dyeingPairs = [
    {
      name: 'BLEACHING-01',
      rows: [
        { label: 'Speed', set: 85, actual: 34.5 },
        { label: 'Steamer Main Temp', set: 102, actual: 103.6 },
        { label: 'Moisture', set: 8.77, actual: 6.57 },
      ],
    },
    {
      name: 'BLEACHING-02',
      rows: [
        { label: 'Speed', set: 95, actual: 100 },
        { label: 'Chamber 06 Water Flow', set: 7.7, actual: 12.6 },
        { label: 'pH', set: 4, actual: 4.06 },
      ],
    },
  ];
  const pairs = shownUnit === 'Dyeing Unit' ? dyeingPairs : printingPairs;

  return (
    <div className="dashboard-content">
      <div className="energy-chart-tabs alarm-view-tabs">
        <button type="button" className={view === 'abnormals' ? 'active' : ''} onClick={() => setView('abnormals')}>
          ABNORMALS
        </button>
        <button type="button" className={view === 'events' ? 'active' : ''} onClick={() => setView('events')}>
          EVENT LOG
        </button>
      </div>

      {view === 'abnormals' && (
        <div className="portal-page">
          <PortalPageHead title="Alarms" crumb="Home / Alarms" layout="split" />
          <div className="filter-bar">
            <label>
              Unit
              <select value={unit} onChange={(event) => setUnit(event.target.value)}>
                <option>Printing Unit</option>
                <option>Dyeing Unit</option>
              </select>
            </label>
            <label>
              Section
              <select value={section} onChange={(event) => setSection(event.target.value)}>
                <option>FINISHING</option>
                <option>PRE-TREATMENT</option>
              </select>
            </label>
            <button type="button" className="btn-display" onClick={() => setShownUnit(unit)}>
              Display
            </button>
          </div>
          <div className="abnormal-grid">
            {pairs.map((machine, machineIndex) => (
              <article key={machine.name} className="abnormal-card">
                <h3>{machine.name}</h3>
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Tol.%</th>
                      <th>Set</th>
                      <th>Act.</th>
                      <th>Diff.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machine.rows.map((row, rowIndex) => {
                      const actual = wobble(row.actual, tick, Math.max(Math.abs(row.actual) * 0.008, 0.05), machineIndex * 10 + rowIndex);
                      const diff = Number((actual - row.set).toFixed(1));
                      const within = row.set === 0 ? Math.abs(diff) < 0.2 : (Math.abs(diff) / Math.abs(row.set)) * 100 <= 5;
                      return (
                        <tr key={row.label}>
                          <td>{row.label}</td>
                          <td>5</td>
                          <td className="cell-set">{row.set}</td>
                          <td className="cell-act">{formatNumber(actual, 1)}</td>
                          <td className={within ? 'cell-ok' : 'cell-bad'}>{formatNumber(diff, 1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
          <p className="portal-crumb">Showing {shownUnit} · {section}</p>
        </div>
      )}

      {view === 'events' && (
    <div className="dashboard-content">
      <ScadaContentHeader
        title="Central SCADA Alarms & Event Management Console"
        subtitle={`Liberty Mills Limited • Real-time ISA-18.2 Plant-wide Alarm Monitoring (${totalAlarms} Total Alarms)`}
        actions={
          <>
            <button
              type="button"
              className={`btn-siren ${sirenMuted ? 'muted' : 'active'}`}
              onClick={() => setSirenMuted(!sirenMuted)}
              title="Toggle Plant Alarm Siren Sound"
            >
              {sirenMuted ? '🔕 Siren Muted' : '🔔 Plant Horn Active'}
            </button>
            <button type="button" className="btn-ack-all" onClick={onAcknowledgeAll}>
              Acknowledge All ({unackCount})
            </button>
            <button type="button" className="btn-export">Export Alarms CSV</button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL REGISTERED ALARMS</span>
            <span className="metric-badge red">{unackCount} ACTIVE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number text-red">{totalAlarms}</span>
            <span className="metric-unit">Alarms</span>
          </div>
          <div className="metric-footer">
            {unackCount} Unacknowledged • {ackCount} Acknowledged
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">CRITICAL (PRIORITY 1)</span>
            <span className="metric-badge red">EMERGENCY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number text-red">{criticalCount}</span>
            <span className="metric-unit">Events</span>
          </div>
          <div className="metric-footer">
            Requires immediate control room intervention
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MAJOR (PRIORITY 2)</span>
            <span className="metric-badge yellow">ELEVATED</span>
          </div>
          <div className="metric-body">
            <span className="metric-number text-yellow">{majorCount}</span>
            <span className="metric-unit">Events</span>
          </div>
          <div className="metric-footer">
            Process deviations &amp; thermal thresholds
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MINOR & INFO</span>
            <span className="metric-badge blue">ADVISORY</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{minorCount + infoCount}</span>
            <span className="metric-unit">Events</span>
          </div>
          <div className="metric-footer">
            Routine equipment maintenance notices
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="alarm-filters-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by Tag (e.g. BLR-02, STN-24, LT-01) or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="alarm-search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="filter-selects">
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="all">All Severities ({totalAlarms})</option>
            <option value="critical">Critical Only ({criticalCount})</option>
            <option value="major">Major Only ({majorCount})</option>
            <option value="minor">Minor Only ({minorCount})</option>
            <option value="info">Info Advisory</option>
          </select>

          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <option value="all">All Plant Areas</option>
            <option value="Boilers">Boilers House</option>
            <option value="Printing">Printing & Stenters</option>
            <option value="Dyeing">Dyeing House</option>
            <option value="Electrical">Electrical Substation</option>
            <option value="ETP">ETP & Water Treatment</option>
            <option value="Compressor">Air Compressors</option>
            <option value="HVAC">HVAC & Chillers</option>
            <option value="SolarPV">Solar PV Array</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">All Statuses</option>
            <option value="unack">Unacknowledged Only ({unackCount})</option>
            <option value="ack">Acknowledged Only ({ackCount})</option>
          </select>
        </div>
      </div>

      {/* Alarms Table */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Active Alarms Table (Showing {filteredAlarms.length} of {totalAlarms})</h3>
          <span className="font-sub">Click 'Ack' to acknowledge alarm</span>
        </div>

        <div className="table-responsive">
          <table className="scada-table alarms-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Tag Name</th>
                <th>Area</th>
                <th>Description</th>
                <th>Live Value</th>
                <th>Setpoint</th>
                <th>Time (PKT)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-table-note">
                    No alarms match the current filters. Clear search or change severity / status.
                  </td>
                </tr>
              ) : (
              filteredAlarms.map((alm) => (
                <tr key={alm.id} className={`alarm-row ${alm.severity} ${!alm.acknowledged ? 'unacknowledged' : ''}`}>
                  <td>
                    <span className={`severity-tag ${alm.severity}`}>
                      {alm.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="font-mono"><strong>{alm.tag}</strong></td>
                  <td><span className="area-badge">{alm.area}</span></td>
                  <td>{alm.description}</td>
                  <td className="font-mono font-bold">{alm.value}</td>
                  <td className="font-mono text-muted">{alm.setpoint}</td>
                  <td className="font-sub font-mono">{alm.timestamp}</td>
                  <td>
                    {alm.acknowledged ? (
                      <span className="status-ack">ACK</span>
                    ) : (
                      <span className="status-unack">UNACK</span>
                    )}
                  </td>
                  <td>
                    {!alm.acknowledged ? (
                      <button
                        className="btn-ack-single"
                        onClick={() => onAcknowledge(alm.id)}
                      >
                        Ack
                      </button>
                    ) : (
                      <span className="text-muted">✓</span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      )}
    </div>
  );
};
