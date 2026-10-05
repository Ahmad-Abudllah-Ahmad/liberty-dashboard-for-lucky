import React, { useState } from 'react';

export const ETPNetworkDashboard: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('mbr');

  return (
    <div className="dashboard-content etp-network-container">
      {/* Header */}
      <div className="content-header-row">
        <div>
          <h2>ETP Network • Effluent Treatment &amp; Water Recovery Flow Diagram</h2>
          <p className="content-subtitle">Lucky Textile • Biological MBR &amp; Reverse Osmosis Recycling Network (10.252.1.247:8018/etp/35)</p>
        </div>
        <div className="header-actions-group">
          <span className="badge-tag green">RECYCLING EFFICIENCY: 78.5% RECOVERED</span>
          <button className="btn-export">Export ETP Log</button>
        </div>
      </div>

      {/* Top Telemetry Strip */}
      <div className="metric-cards-row">
        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">INFLUENT RAW FLOW</span>
            <span className="metric-badge normal">INLET</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">235.0</span>
            <span className="metric-unit">m³/h</span>
          </div>
          <div className="metric-footer">pH: 9.4 • COD: 1,850 mg/L</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">RO PERMEATE RECOVERED</span>
            <span className="metric-badge green">CLEAN REUSE</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">184.5</span>
            <span className="metric-unit">m³/h</span>
          </div>
          <div className="metric-footer">Returned to Dyeing &amp; Boilers (TDS 38 ppm)</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">FINAL DISCHARGE TO DRAIN</span>
            <span className="metric-badge green">NEQS COMPLIANT</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">50.5</span>
            <span className="metric-unit">m³/h</span>
          </div>
          <div className="metric-footer">COD: 135 mg/L • BOD: 38 mg/L</div>
        </div>

        <div className="scada-metric-card">
          <div className="metric-header">
            <span className="metric-title">AERATION BASIN DISSOLVED O₂</span>
            <span className="metric-badge green">OPTIMAL</span>
          </div>
          <div className="metric-body">
            <span className="metric-number">2.45</span>
            <span className="metric-unit">mg/L</span>
          </div>
          <div className="metric-footer">4 Roots Blowers Active @ 45 Hz</div>
        </div>
      </div>

      {/* Interactive Visual Flow Chart Matching WhatsApp Image 2026-10-01 at 11.41.04 & 11.41.05 */}
      <div className="scada-panel flow-diagram-panel">
        <div className="panel-title-bar">
          <h3>ETP Network Process Flow Diagram (PFD)</h3>
          <span className="badge-tag">Click any node to view detailed instrumentation</span>
        </div>

        <div className="pfd-canvas">
          {/* Flow Chart Node 1: Equalization Tank */}
          <div
            className={`pfd-node-card ${selectedNode === 'eq' ? 'active' : ''}`}
            onClick={() => setSelectedNode('eq')}
          >
            <div className="pfd-node-header eq-header">
              <span className="pfd-node-icon">🛢️</span>
              <span className="pfd-node-title">Equilization Tank</span>
            </div>
            <div className="pfd-node-body">
              <div className="pfd-metric-line"><span>Volume Level:</span> <strong className="font-mono">76.4%</strong></div>
              <div className="pfd-metric-line"><span>Influent pH:</span> <strong className="font-mono">9.42 pH</strong></div>
              <div className="pfd-metric-line"><span>Temperature:</span> <strong className="font-mono">42.5 °C</strong></div>
              <div className="pfd-metric-line"><span>Agitators:</span> <strong className="text-green">4/4 Running</strong></div>
            </div>
            <div className="pfd-liquid-bar">
              <div className="pfd-liquid-fill" style={{ width: '76.4%', background: '#f59e0b' }}></div>
            </div>
          </div>

          <div className="pfd-arrow">
            <span className="flow-line-text">235 m³/h</span>
            <div className="flow-arrow-graphic">➔</div>
          </div>

          {/* Flow Chart Node 2: Chemical Treatment Tank */}
          <div
            className={`pfd-node-card ${selectedNode === 'chem' ? 'active' : ''}`}
            onClick={() => setSelectedNode('chem')}
          >
            <div className="pfd-node-header chem-header">
              <span className="pfd-node-icon">🧪</span>
              <span className="pfd-node-title">Chemical Treatment Tank</span>
            </div>
            <div className="pfd-node-body">
              <div className="pfd-metric-line"><span>Alum / PAC Dosing:</span> <strong className="font-mono">45 ppm</strong></div>
              <div className="pfd-metric-line"><span>Polymer Flocculant:</span> <strong className="font-mono">2.5 ppm</strong></div>
              <div className="pfd-metric-line"><span>Corrected pH:</span> <strong className="font-mono text-green">7.20 pH</strong></div>
              <div className="pfd-metric-line"><span>Floc Formation:</span> <strong className="text-green">Excellent</strong></div>
            </div>
            <div className="pfd-liquid-bar">
              <div className="pfd-liquid-fill" style={{ width: '68%', background: '#8b5cf6' }}></div>
            </div>
          </div>

          <div className="pfd-arrow">
            <span className="flow-line-text">Flocculated</span>
            <div className="flow-arrow-graphic">➔</div>
          </div>

          {/* Flow Chart Node 3: MBR 1, MBR 2, MBR 3, MBR 4 */}
          <div
            className={`pfd-node-card mbr-card ${selectedNode === 'mbr' ? 'active' : ''}`}
            onClick={() => setSelectedNode('mbr')}
          >
            <div className="pfd-node-header mbr-header">
              <span className="pfd-node-icon">🧬</span>
              <span className="pfd-node-title">MBR 1, MBR 2, MBR 3, MBR 4</span>
            </div>
            <div className="pfd-node-body">
              <div className="mbr-trains-grid">
                <div className="train-chip online">MBR-1: 58 m³/h</div>
                <div className="train-chip online">MBR-2: 60 m³/h</div>
                <div className="train-chip online">MBR-3: 59 m³/h</div>
                <div className="train-chip online">MBR-4: 58 m³/h</div>
              </div>
              <div className="pfd-metric-line"><span>MLSS Concentration:</span> <strong className="font-mono">3,500 mg/L</strong></div>
              <div className="pfd-metric-line"><span>TMP Differential:</span> <strong className="font-mono">-0.18 Bar</strong></div>
              <div className="pfd-metric-line"><span>DO Aeration:</span> <strong className="font-mono text-green">2.45 mg/L</strong></div>
            </div>
            <div className="pfd-liquid-bar">
              <div className="pfd-liquid-fill" style={{ width: '85%', background: '#3a42a8' }}></div>
            </div>
          </div>

          <div className="pfd-arrow">
            <span className="flow-line-text">Clarified</span>
            <div className="flow-arrow-graphic">➔</div>
          </div>

          {/* Flow Chart Node 4: RO Feed Tank */}
          <div
            className={`pfd-node-card ${selectedNode === 'rofeed' ? 'active' : ''}`}
            onClick={() => setSelectedNode('rofeed')}
          >
            <div className="pfd-node-header rofeed-header">
              <span className="pfd-node-icon">💧</span>
              <span className="pfd-node-title">RO Feed Tank</span>
            </div>
            <div className="pfd-node-body">
              <div className="pfd-metric-line"><span>Tank Level:</span> <strong className="font-mono">82.1%</strong></div>
              <div className="pfd-metric-line"><span>SDI (Silt Density):</span> <strong className="font-mono text-green">2.4 (Pass)</strong></div>
              <div className="pfd-metric-line"><span>Turbidity:</span> <strong className="font-mono">0.15 NTU</strong></div>
              <div className="pfd-metric-line"><span>Booster Pumps:</span> <strong className="text-green">2 Running</strong></div>
            </div>
            <div className="pfd-liquid-bar">
              <div className="pfd-liquid-fill" style={{ width: '82.1%', background: '#4a51b0' }}></div>
            </div>
          </div>

          <div className="pfd-branch-split">
            <div className="branch-arrow top">
              <span className="flow-line-text text-green">➔ 184.5 m³/h</span>
              {/* Node 5: R/O Permeate */}
              <div
                className={`pfd-node-card branch-node ${selectedNode === 'ropermeate' ? 'active' : ''}`}
                onClick={() => setSelectedNode('ropermeate')}
              >
                <div className="pfd-node-header roperm-header">
                  <span className="pfd-node-icon">✨</span>
                  <span className="pfd-node-title">R/O Permeate</span>
                </div>
                <div className="pfd-node-body">
                  <div className="pfd-metric-line"><span>TDS:</span> <strong className="font-mono text-green">38.5 ppm</strong></div>
                  <div className="pfd-metric-line"><span>Conductivity:</span> <strong className="font-mono">68 µS/cm</strong></div>
                  <div className="pfd-metric-line"><span>Destination:</span> <strong>Dyeing House</strong></div>
                </div>
              </div>
            </div>

            <div className="branch-arrow bottom">
              <span className="flow-line-text text-red">➔ 50.5 m³/h</span>
              {/* Node 6: R/O Reject */}
              <div
                className={`pfd-node-card branch-node ${selectedNode === 'roreject' ? 'active' : ''}`}
                onClick={() => setSelectedNode('roreject')}
              >
                <div className="pfd-node-header rorej-header">
                  <span className="pfd-node-icon">⚠️</span>
                  <span className="pfd-node-title">R/O Reject</span>
                </div>
                <div className="pfd-node-body">
                  <div className="pfd-metric-line"><span>TDS:</span> <strong className="font-mono">4,850 ppm</strong></div>
                  <div className="pfd-metric-line"><span>Discharge COD:</span> <strong className="font-mono">135 mg/L</strong></div>
                  <div className="pfd-metric-line"><span>Destination:</span> <strong>NEQS Drain / MEE</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Deep Telemetry */}
      <div className="scada-two-col">
        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Membrane Bioreactor (MBR) Filtration Trains Status</h3>
            <span className="badge-tag">GE Zenon ZeeWeed Ultrafiltration</span>
          </div>

          <div className="mbr-status-table-wrap">
            <table className="scada-table">
              <thead>
                <tr>
                  <th>Train</th>
                  <th>Permeate Flow</th>
                  <th>Transmembrane Pressure (TMP)</th>
                  <th>Relaxation / Backwash</th>
                  <th>Turbidity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>MBR Train #1</strong></td>
                  <td className="font-mono">58.2 m³/h</td>
                  <td className="font-mono text-green">-0.18 Bar</td>
                  <td><span className="status-tag running">FILTRATING</span></td>
                  <td className="font-mono">0.12 NTU</td>
                </tr>
                <tr>
                  <td><strong>MBR Train #2</strong></td>
                  <td className="font-mono">60.1 m³/h</td>
                  <td className="font-mono text-green">-0.19 Bar</td>
                  <td><span className="status-tag running">FILTRATING</span></td>
                  <td className="font-mono">0.14 NTU</td>
                </tr>
                <tr>
                  <td><strong>MBR Train #3</strong></td>
                  <td className="font-mono">59.0 m³/h</td>
                  <td className="font-mono text-green">-0.17 Bar</td>
                  <td><span className="status-tag running">FILTRATING</span></td>
                  <td className="font-mono">0.11 NTU</td>
                </tr>
                <tr>
                  <td><strong>MBR Train #4</strong></td>
                  <td className="font-mono">57.8 m³/h</td>
                  <td className="font-mono text-green">-0.20 Bar</td>
                  <td><span className="status-tag running">FILTRATING</span></td>
                  <td className="font-mono">0.15 NTU</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="scada-panel">
          <div className="panel-title-bar">
            <h3>Sindh EPA / NEQS Environmental Compliance Benchmarks</h3>
            <span className="badge-tag green">100% PASS</span>
          </div>
          <div className="table-responsive">
            <table className="scada-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Raw Effluent</th>
                  <th>Treated Discharge</th>
                  <th>NEQS Limit</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>pH Value</strong></td>
                  <td className="font-mono">9.42 pH</td>
                  <td className="font-mono">7.35 pH</td>
                  <td className="font-mono">6.0 - 9.0</td>
                  <td><span className="text-green font-bold">COMPLIANT</span></td>
                </tr>
                <tr>
                  <td><strong>Chemical Oxygen Demand (COD)</strong></td>
                  <td className="font-mono">1,850 mg/L</td>
                  <td className="font-mono">135 mg/L</td>
                  <td className="font-mono">&lt; 150 mg/L</td>
                  <td><span className="text-green font-bold">COMPLIANT</span></td>
                </tr>
                <tr>
                  <td><strong>Biochemical Oxygen Demand (BOD)</strong></td>
                  <td className="font-mono">650 mg/L</td>
                  <td className="font-mono">38 mg/L</td>
                  <td className="font-mono">&lt; 80 mg/L</td>
                  <td><span className="text-green font-bold">COMPLIANT</span></td>
                </tr>
                <tr>
                  <td><strong>Total Suspended Solids (TSS)</strong></td>
                  <td className="font-mono">420 mg/L</td>
                  <td className="font-mono">42 mg/L</td>
                  <td className="font-mono">&lt; 200 mg/L</td>
                  <td><span className="text-green font-bold">COMPLIANT</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
