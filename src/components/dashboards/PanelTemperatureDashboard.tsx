import React, { useMemo, useState } from 'react';
import { machineValue, processingMachines } from '../../data/processingMachines';
import { MachineSelect } from './MachineSelect';

export const PanelTemperatureDashboard: React.FC = () => {
  const [machineId, setMachineId] = useState(processingMachines.find((item) => item.category === 'Dyeing')?.id ?? processingMachines[0].id);
  const machine = processingMachines.find((item) => item.id === machineId) ?? processingMachines[0];
  const setTemp = 28;

  const panels = useMemo(() => {
    const probes = [1, 2].map((index) => {
      const temp = machineValue(`${machine.id}-panel-${index}`, 28, 18, 1);
      const difference = Number((temp - setTemp).toFixed(1));
      return {
        name: `Panel Temp. ${index}`,
        temp,
        alert: Math.abs(difference) > 5,
        difference,
        tolerance: 5,
        date: '9/30/2026 9:09:32 PM',
        tag: `DB13.DBD${machineValue(machine.id, 200, 300, 0) + index}`,
      };
    });
    return [{ id: machine.id, name: machine.name, setTemp, probes }];
  }, [machine]);

  const alerts = panels.flatMap((panel) =>
    panel.probes
      .filter((probe) => probe.alert)
      .map((probe) => ({ machine: panel.name, setTemp: panel.setTemp, ...probe }))
  );
  const thermalProbes = panels.flatMap((panel) =>
    panel.probes.map((probe) => ({
      ...probe,
      setTemp: panel.setTemp,
      machine: panel.name,
    }))
  );
  const hottest = alerts.length
    ? alerts.reduce((peak, probe) => (probe.temp > peak.temp ? probe : peak), alerts[0])
    : thermalProbes[0];

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>Electric Panel Room</h2>
          <p className="content-subtitle">Lucky Textile • {machine.category} • {machine.name}</p>
        </div>
        <div className="header-actions-group">
          <MachineSelect value={machine.id} onChange={setMachineId} />
          <span className={`badge-tag ${alerts.length ? 'yellow' : 'green'}`}>{alerts.length} PANEL ALERTS</span>
          <button className="btn-export">Export Thermal Report</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">MAX PANEL TEMPERATURE</span>
            <span className={`metric-badge ${alerts.length ? 'yellow' : 'green'}`}>{alerts.length ? 'ALERT' : 'NORMAL'}</span>
          </div>
          <div className="metric-body">
            <span className="metric-number text-yellow">{hottest.temp}</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            {hottest.machine} · {hottest.name} · Set {hottest.setTemp}°C
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">SET TEMPERATURE</span>
            <span className="metric-badge normal">PANEL SET</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">28</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-footer">
            Set on {machine.name}
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PANEL READINGS</span>
            <span className="metric-badge green">LIVE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{panels.reduce((sum, panel) => sum + panel.probes.length, 0)}</span>
            <span className="metric-unit">Points</span>
          </div>
          <div className="metric-footer">
            {machine.name} in the electric panel room
          </div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">PANEL ALERTS</span>
            <span className="metric-badge yellow">{alerts.length} OPEN</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">{alerts.length}</span>
            <span className="metric-unit">ALERTS</span>
          </div>
          <div className="metric-footer">
            Off the 28°C set by more than 5°C
          </div>
        </div>
      </div>

      {/* Panel Selection and Probes */}
      <div className="scada-two-col">
        {/* Switchgear Panels List */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Panel temperature by machine</h3>
            <span className="badge-tag">{thermalProbes.length} Entries</span>
          </div>

          <div className="panel-selector-list">
            {panels.map((p) => {
              const panelAlerts = p.probes.filter((probe) => probe.alert);
              const peak = panelAlerts.reduce((top, probe) => (probe.temp > top.temp ? probe : top), panelAlerts[0]);
              return (
                <div
                  key={p.id}
                  className={`panel-select-card active ${panelAlerts.length ? 'has-warning' : ''}`}
                >
                  <div className="p-header">
                    <strong>{p.name}</strong>
                    <span className={`status-pill ${panelAlerts.length ? 'warning' : 'normal'}`}>
                      {panelAlerts.length ? `ALERT ${peak.temp}°C` : 'NORMAL'}
                    </span>
                  </div>
                  <div className="p-details">
                    <span>Set temperature: <strong className="font-mono">{p.setTemp}°C</strong></span>
                  </div>
                  {p.probes.map((probe) => (
                    <div key={probe.name} className={probe.alert ? 'hotspot-flag' : 'p-details'}>
                      {probe.alert ? '⚠️ ' : ''}{probe.name}: {probe.temp}°C · Set {p.setTemp}°C
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Thermal Probes Matrix for Selected Panel */}
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Panel readings · All</h3>
            <span className="font-sub">{thermalProbes.length} entries · Set temperature 28°C</span>
          </div>

          <div className="probe-list">
            {thermalProbes.map((probe) => (
              <div key={`${probe.machine}-${probe.name}`} className={`probe-row ${probe.alert ? 'probe-alert' : ''}`}>
                <div className="probe-info">
                  <span className="probe-name">{probe.machine} · {probe.name}</span>
                  <span className="probe-limit font-sub">
                    Set {probe.setTemp}°C · Difference {probe.difference > 0 ? '+' : ''}{probe.difference}°C · Tolerance {probe.tolerance}°C · {probe.date}
                    {probe.tag ? ` · ${probe.tag}` : ''}
                    {probe.alert ? ' · Alert' : ' · Normal'}
                  </span>
                </div>
                <div className="probe-bar-wrapper">
                  <div
                    className="probe-bar-fill"
                    style={{
                      width: `${Math.min(100, probe.temp)}%`,
                      backgroundColor: probe.alert ? '#ef4444' : '#10b981',
                    }}
                  ></div>
                </div>
                <div className="probe-temp font-mono">
                  <strong className={probe.alert ? 'text-red' : ''}>{probe.temp} °C</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="thermal-action-box">
            <h4>Panel alerts</h4>
            <p>
              {alerts.map((alert) => `${alert.machine} · ${alert.name} is ${alert.temp}°C against a set temperature of ${alert.setTemp}°C.`).join(' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
