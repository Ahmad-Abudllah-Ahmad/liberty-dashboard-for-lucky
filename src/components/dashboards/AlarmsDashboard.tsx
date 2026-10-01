import React, { useState } from 'react';
import type { AlarmRecord } from '../../types';

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

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Central SCADA Alarms & Event Management Console</h2>
          <p className="content-subtitle">Liberty Mills Limited • Real-time ISA-18.2 Plant-wide Alarm Monitoring (140 Total Alarms)</p>
        </div>
        <div className="header-actions-group">
          <button
            className={`btn-siren ${sirenMuted ? 'muted' : 'active'}`}
            onClick={() => setSirenMuted(!sirenMuted)}
            title="Toggle Plant Alarm Siren Sound"
          >
            {sirenMuted ? '🔕 Siren Muted' : '🔔 Plant Horn Active'}
          </button>
          <button className="btn-ack-all" onClick={onAcknowledgeAll}>
            Acknowledge All ({unackCount})
          </button>
          <button className="btn-export">Export Alarms CSV</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL REGISTERED ALARMS</span>
            <span className="metric-badge red">140 ACTIVE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number text-red">140</span>
            <span className="metric-unit">Alarms</span>
          </div>
          <div className="metric-footer">
            {unackCount} Unacknowledged • {140 - unackCount} Acknowledged
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
            <span className="metric-number">{minorCount + (140 - criticalCount - majorCount - minorCount)}</span>
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
            <option value="all">All Severities (140)</option>
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
            <option value="ack">Acknowledged Only ({140 - unackCount})</option>
          </select>
        </div>
      </div>

      {/* Alarms Table */}
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Active Alarms Table (Showing {filteredAlarms.length} of 140)</h3>
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
              {filteredAlarms.map((alm) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
