import React, { useMemo, useState } from 'react';

export type MonitorRow = {
  label: string;
  tag?: string | number;
  date?: string;
  unit?: string;
  value: string | number;
  setValue?: string | number;
  tolerance?: string | number;
  difference?: string | number;
  tone?: 'ok' | 'bad' | 'warn' | 'neutral';
};

export type MonitorMachine = {
  id: string;
  name: string;
  rows: MonitorRow[];
};

interface SplitMonitorProps {
  title: string;
  breadcrumb: string;
  machines: MonitorMachine[];
  listHeader?: string;
  mode: 'quality' | 'tags';
  defaultId?: string;
  parentLabel?: string;
}

const toneClass = (tone?: MonitorRow['tone']) => {
  if (tone === 'ok') return 'cell-ok';
  if (tone === 'bad') return 'cell-bad';
  if (tone === 'warn') return 'cell-warn';
  return '';
};

export const SplitMonitor: React.FC<SplitMonitorProps> = ({
  title,
  breadcrumb,
  machines,
  listHeader = 'Machines',
  mode,
  defaultId,
  parentLabel,
}) => {
  const [selectedId, setSelectedId] = useState<string>(defaultId || machines[0]?.id);
  const [tab, setTab] = useState<'tags' | 'consumption'>('tags');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return machines;
    return machines.filter((m) => m.name.toLowerCase().includes(q));
  }, [machines, query]);

  const selected = machines.find((m) => m.id === selectedId) || machines[0];

  return (
    <div className="portal-page">
      <div className="portal-page-head">
        <h2>{title}</h2>
        <p className="portal-crumb">Home / {breadcrumb}</p>
      </div>

      <div className="split-monitor">
        <aside className="split-list">
          <div className={`split-list-head ${parentLabel ? 'is-parent' : ''}`}>
            {parentLabel || listHeader}
          </div>
          <div className="split-list-search">
            <input
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="split-list-body">
            {filtered.map((machine) => (
              <button
                key={machine.id}
                type="button"
                className={`split-list-item ${machine.id === selected.id ? 'active' : ''}`}
                onClick={() => setSelectedId(machine.id)}
              >
                {machine.name}
              </button>
            ))}
          </div>
        </aside>

        <section className="split-detail">
          <div className="split-detail-bar">
            <h3>{selected.name}</h3>
            <div className="split-detail-actions">
              <button type="button" className="btn-ghost-link">Chart</button>
              <button type="button" className="btn-ghost-link">Report</button>
            </div>
          </div>

          {mode === 'tags' && (
            <div className="split-tabs">
              <button
                type="button"
                className={tab === 'tags' ? 'active' : ''}
                onClick={() => setTab('tags')}
              >
                TAGS
              </button>
              <button
                type="button"
                className={tab === 'consumption' ? 'active' : ''}
                onClick={() => setTab('consumption')}
              >
                CONSUMPTION
              </button>
            </div>
          )}

          <div className="split-table-wrap">
            <table className="portal-table">
              <thead>
                {mode === 'quality' ? (
                  <tr>
                    <th>Label</th>
                    <th>Date</th>
                    <th>Tolerance %</th>
                    <th>Unit</th>
                    <th>Set Value</th>
                    <th>Act. Value</th>
                    <th>Difference</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Label</th>
                    <th>Tag</th>
                    <th>Date</th>
                    <th>Unit</th>
                    <th>Value</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {tab === 'consumption' && mode === 'tags' ? (
                  <tr>
                    <td colSpan={5} className="empty-table-note">
                      Consumption history is available after the selected shift closes.
                    </td>
                  </tr>
                ) : (
                  selected.rows.map((row, index) => (
                    <tr key={`${selected.id}-${index}`}>
                      <td>{row.label}</td>
                      {mode === 'quality' ? (
                        <>
                          <td>{row.date}</td>
                          <td>{row.tolerance}</td>
                          <td>{row.unit}</td>
                          <td className="cell-set">{row.setValue}</td>
                          <td className={`cell-act ${toneClass(row.tone)}`}>{row.value}</td>
                          <td className={toneClass(row.tone)}>{row.difference}</td>
                        </>
                      ) : (
                        <>
                          <td>{row.tag ?? ''}</td>
                          <td>{row.date}</td>
                          <td>{row.unit}</td>
                          <td className={toneClass(row.tone)}>{row.value}</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
