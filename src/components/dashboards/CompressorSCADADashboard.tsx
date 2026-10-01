import React, { useState } from 'react';

interface CompressorItem {
  id: string;
  name: string;
  tags: { label: string; tag: number; date: string; unit: string; value: number | string }[];
}

export const CompressorSCADADashboard: React.FC = () => {
  const compressors: CompressorItem[] = [
    {
      id: 'compressor',
      name: 'Compressor',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'digital-printing',
      name: 'Digital Printing 11-K Compressor',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'discharge-dryer',
      name: 'Discharge Dryer',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/hr', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'dry-air-out',
      name: 'Dry Air Out',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:46 AM', unit: 'M3/M', value: '52,591' },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:46 AM', unit: 'M3', value: '73,909,919' },
      ],
    },
    {
      id: 'dyeing-air-flow',
      name: 'Dyeing Air Flow',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'engraving-sample',
      name: 'Engraving And Sample Table',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'ihi-compressor',
      name: 'IHI Compressor',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'ihi-compressor-vfd',
      name: 'IHI Compressor Vfd',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'ihi-esd-445-src',
      name: 'IHI Esd 445 Src',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'ihi-esd-445-src-vsd',
      name: 'IHI Esd-445 Src Vsd',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
    {
      id: 'ihi-main-power',
      name: 'IHI Main Power',
      tags: [
        { label: 'Active Power', tag: 60, date: '10/1/2026 11:29:52 AM', unit: 'KWH', value: '187,470.67' },
        { label: 'L3 Voltage Thd', tag: 52, date: '10/1/2026 11:29:52 AM', unit: '%', value: 3.6 },
      ],
    },
    {
      id: 'kaeser-compressor',
      name: 'Kaeser Compressor',
      tags: [
        { label: 'Air Flow', tag: 0, date: '10/1/2026 11:28:34 AM', unit: 'M3/M', value: 0 },
        { label: 'Air Totalizer', tag: 14, date: '10/1/2026 11:28:34 AM', unit: 'M3', value: 0 },
      ],
    },
  ];

  const [selectedId, setSelectedId] = useState<string>('compressor');
  const [activeTab, setActiveTab] = useState<string>('tags');

  const selectedCompressor = compressors.find((c) => c.id === selectedId) || compressors[0];

  return (
    <div className="dashboard-content compressor-scada-container">
      {/* Breadcrumb */}
      <div className="compressor-breadcrumb">
        <span>Home</span> / <span>Compressor Monitoring</span>
      </div>
      <h2 className="compressor-page-title">Compressor Monitoring</h2>

      <div className="compressor-layout">
        {/* Left Sidebar List */}
        <div className="compressor-sidebar-list">
          {compressors.map((comp) => (
            <div
              key={comp.id}
              className={`compressor-list-item ${selectedId === comp.id ? 'active' : ''} ${comp.id === 'compressor' ? 'parent-item' : ''}`}
              onClick={() => setSelectedId(comp.id)}
            >
              {comp.name}
            </div>
          ))}
        </div>

        {/* Right Detail Panel */}
        <div className="compressor-detail-panel">
          {/* Blue Header */}
          <div className="compressor-detail-header">
            <h3>{selectedCompressor.name}</h3>
          </div>

          {/* Tabs */}
          <div className="compressor-tabs">
            <button
              className={`compressor-tab ${activeTab === 'tags' ? 'active' : ''}`}
              onClick={() => setActiveTab('tags')}
            >
              TAGS
            </button>
            <button
              className={`compressor-tab ${activeTab === 'consumption' ? 'active' : ''}`}
              onClick={() => setActiveTab('consumption')}
            >
              CONSUMPTION
            </button>
          </div>

          {/* Data Table */}
          <div className="compressor-data-table">
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Tag</th>
                  <th>Date</th>
                  <th>Unit</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedCompressor.tags.map((tag, i) => (
                  <tr key={i}>
                    <td className="tag-label-cell">{tag.label}</td>
                    <td>{tag.tag}</td>
                    <td>{tag.date}</td>
                    <td>{tag.unit}</td>
                    <td>{tag.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressorSCADADashboard;
