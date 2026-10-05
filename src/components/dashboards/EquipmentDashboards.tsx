import React from 'react';

// Heat Exchanger Dashboard
export const HeatExchangerDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>Heat Exchanger & Thermal Energy Recovery Systems</h2>
        <p className="content-subtitle">Lucky Textile • Plate Heat Exchangers, Caustic & Hot Water Recovery</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">HEAT RECOVERY EFFICIENCY: 84.6%</span>
        <button className="btn-export">Export Thermal Logs</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">RECOVERED THERMAL POWER</span>
          <span className="metric-badge green">ACTIVE</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">3,850</span>
          <span className="metric-unit">kWth</span>
        </div>
        <div className="metric-footer">Saves ~420 m³/h Natural Gas</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">HOT DRAIN INLET TEMP</span>
          <span className="metric-badge normal">DYE DRAIN</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">88.5</span>
          <span className="metric-unit">°C</span>
        </div>
        <div className="metric-footer">Flow: 65.0 m³/h from Fong's vessels</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">PRE-HEATED WATER OUTLET</span>
          <span className="metric-badge green">PRE-HEATED</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">74.2</span>
          <span className="metric-unit">°C</span>
        </div>
        <div className="metric-footer">Feeds Boiler deaerator &amp; dye wash</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">CAUSTIC SODA RECOVERY</span>
          <span className="metric-badge green">92% RECOVERY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">28.4</span>
          <span className="metric-unit">°Bé</span>
        </div>
        <div className="metric-footer">Mercerizing lye concentration plant</div>
      </div>
    </div>

    <div className="scada-panel">
      <div className="panel-title-bar">
        <h3>Plate Heat Exchangers (PHE) Battery Telemetry</h3>
        <span className="badge-tag">Alfa Laval &amp; GEA Units</span>
      </div>
      <div className="table-responsive">
        <table className="scada-table">
          <thead>
            <tr>
              <th>Exchanger Unit</th>
              <th>Service</th>
              <th>Status</th>
              <th>Hot Side In/Out</th>
              <th>Cold Side In/Out</th>
              <th>Heat Transferred</th>
              <th>Log Mean Temp Diff (LMTD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>PHE-01</strong></td>
              <td>Dye House Hot Drain to Fresh Water</td>
              <td><span className="status-tag running"><span className="dot"></span> RUNNING</span></td>
              <td className="font-mono">88.5°C → 42.0°C</td>
              <td className="font-mono">28.0°C → 74.2°C</td>
              <td className="font-mono">1,820 kWth</td>
              <td className="font-mono">11.4 °C</td>
            </tr>
            <tr>
              <td><strong>PHE-02</strong></td>
              <td>Stenter-24 Exhaust Air-to-Water</td>
              <td><span className="status-tag running"><span className="dot"></span> RUNNING</span></td>
              <td className="font-mono">180.0°C → 95.0°C</td>
              <td className="font-mono">30.0°C → 82.0°C</td>
              <td className="font-mono">1,250 kWth</td>
              <td className="font-mono">24.5 °C</td>
            </tr>
            <tr>
              <td><strong>PHE-03</strong></td>
              <td>Boiler Continuous Blowdown Heat Recovery</td>
              <td><span className="status-tag running"><span className="dot"></span> RUNNING</span></td>
              <td className="font-mono">184.0°C → 65.0°C</td>
              <td className="font-mono">25.0°C → 85.0°C</td>
              <td className="font-mono">780 kWth</td>
              <td className="font-mono">14.8 °C</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Geneset Dashboard
export const GenesetDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>In-House Power Generation • Gas & Diesel Gensets</h2>
        <p className="content-subtitle">Lucky Textile • Jenbacher JMS 620 Gas Engines & Standby Caterpillar Gensets</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">GENSET LOAD: 7,620 kW (SYNCHRONIZED)</span>
        <button className="btn-export">Export Genset Telemetry</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TOTAL GENSET OUTPUT</span>
          <span className="metric-badge green">RUNNING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">7,620</span>
          <span className="metric-unit">kW</span>
        </div>
        <div className="metric-footer">Supplying 51.4% of plant electrical load</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">GAS ENGINE EFFICIENCY</span>
          <span className="metric-badge green">44.2% ELEC</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">88.4</span>
          <span className="metric-unit">% CHP</span>
        </div>
        <div className="metric-footer">Combined Heat &amp; Power with WHRB steam</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">AVERAGE RUNNING RPM</span>
          <span className="metric-badge normal">SYNCHRONOUS</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">1,500</span>
          <span className="metric-unit">RPM</span>
        </div>
        <div className="metric-footer">Grid Sync 50.04 Hz • 0.98 Power Factor</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">EXHAUST TEMP TO WHRB</span>
          <span className="metric-badge normal">RECOVERING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">485</span>
          <span className="metric-unit">°C</span>
        </div>
        <div className="metric-footer">Generates 7.5 TPH Steam via WHRB</div>
      </div>
    </div>

    <div className="scada-two-col">
      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Jenbacher JMS 620 GS-N.L (Genset #1 - 3,850 kW)</h3>
          <span className="status-tag running"><span className="dot"></span> ONLINE 3,820 kW</span>
        </div>
        <div className="safety-grid">
          <div><span>Active Power:</span> <strong className="font-mono">3,820 kW (99.2%)</strong></div>
          <div><span>Jacket Water Temp:</span> <strong className="font-mono">88.2 °C</strong></div>
          <div><span>Lube Oil Pressure:</span> <strong className="font-mono">4.8 Bar</strong></div>
          <div><span>Lube Oil Temp:</span> <strong className="font-mono">76.4 °C</strong></div>
          <div><span>Knock Detection:</span> <strong className="font-mono text-green">0.0 (Normal)</strong></div>
          <div><span>Throttle Position:</span> <strong className="font-mono">82.4 %</strong></div>
        </div>
      </div>

      <div className="scada-panel">
        <div className="panel-title-bar">
          <h3>Jenbacher JMS 620 GS-N.L (Genset #2 - 3,850 kW)</h3>
          <span className="status-tag running"><span className="dot"></span> ONLINE 3,800 kW</span>
        </div>
        <div className="safety-grid">
          <div><span>Active Power:</span> <strong className="font-mono">3,800 kW (98.7%)</strong></div>
          <div><span>Jacket Water Temp:</span> <strong className="font-mono">87.8 °C</strong></div>
          <div><span>Lube Oil Pressure:</span> <strong className="font-mono">4.9 Bar</strong></div>
          <div><span>Lube Oil Temp:</span> <strong className="font-mono">75.8 °C</strong></div>
          <div><span>Knock Detection:</span> <strong className="font-mono text-green">0.0 (Normal)</strong></div>
          <div><span>Throttle Position:</span> <strong className="font-mono">81.8 %</strong></div>
        </div>
      </div>
    </div>
  </div>
);

// Compressor Dashboard
export const CompressorDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>Compressed Air Plant SCADA (Atlas Copco Oil-Free)</h2>
        <p className="content-subtitle">Lucky Textile • Central Compressed Air Ring Main & Refrigerant Dryers</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">HEADER PRESSURE: 7.25 BAR (STABLE)</span>
        <button className="btn-export">Export Air Telemetry</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">RING MAIN PRESSURE</span>
          <span className="metric-badge green">OPTIMAL</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">7.25</span>
          <span className="metric-unit">Bar</span>
        </div>
        <div className="metric-footer">Target: 7.00 - 7.50 Bar across plant</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TOTAL AIR FLOW</span>
          <span className="metric-badge normal">DELIVERY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">4,850</span>
          <span className="metric-unit">CFM</span>
        </div>
        <div className="metric-footer">VFD compressor trimming automatically</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">PRESSURE DEW POINT</span>
          <span className="metric-badge green">CLASS 1 DRY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">-40.2</span>
          <span className="metric-unit">°C PDP</span>
        </div>
        <div className="metric-footer">Desiccant dryer zero moisture carryover</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">AIR SPECIFIC POWER</span>
          <span className="metric-badge green">HIGH EFFICIENCY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">6.12</span>
          <span className="metric-unit">kW / 100 CFM</span>
        </div>
        <div className="metric-footer">Power consumption: 1,940 kW</div>
      </div>
    </div>

    <div className="scada-panel">
      <div className="panel-title-bar">
        <h3>Compressed Air Station Units (Atlas Copco ZR-315 &amp; ZR-250)</h3>
        <span className="badge-tag">ISO 8573-1 Class 0 Certified Oil-Free</span>
      </div>
      <div className="table-responsive">
        <table className="scada-table">
          <thead>
            <tr>
              <th>Compressor</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Motor Power</th>
              <th>Discharge Pressure</th>
              <th>Flow (CFM)</th>
              <th>Stage 1 Temp</th>
              <th>Stage 2 Temp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>CMP-01 (Atlas Copco ZR-315 VSD)</strong></td>
              <td>315 kW VFD</td>
              <td><span className="status-tag running"><span className="dot"></span> RUNNING (TRIM)</span></td>
              <td className="font-mono">248 kW (78%)</td>
              <td className="font-mono">7.28 Bar</td>
              <td className="font-mono">1,850 CFM</td>
              <td className="font-mono">172 °C</td>
              <td className="font-mono">168 °C</td>
            </tr>
            <tr>
              <td><strong>CMP-02 (Atlas Copco ZR-315 Fixed)</strong></td>
              <td>315 kW Base</td>
              <td><span className="status-tag running"><span className="dot"></span> RUNNING (BASE)</span></td>
              <td className="font-mono">312 kW (100%)</td>
              <td className="font-mono">7.24 Bar</td>
              <td className="font-mono">2,100 CFM</td>
              <td className="font-mono">175 °C</td>
              <td className="font-mono">171 °C</td>
            </tr>
            <tr>
              <td><strong>CMP-03 (Atlas Copco ZR-250 Fixed)</strong></td>
              <td>250 kW Base</td>
              <td><span className="status-tag running"><span className="dot"></span> RUNNING (BASE)</span></td>
              <td className="font-mono">145 kW (60%)</td>
              <td className="font-mono">7.22 Bar</td>
              <td className="font-mono">900 CFM</td>
              <td className="font-mono">168 °C</td>
              <td className="font-mono">165 °C</td>
            </tr>
            <tr>
              <td><strong>CMP-04 (Standby Unit)</strong></td>
              <td>250 kW</td>
              <td><span className="status-tag idle"><span className="dot"></span> STANDBY READY</span></td>
              <td className="font-mono">0 kW</td>
              <td className="font-mono">0.0 Bar</td>
              <td className="font-mono">0 CFM</td>
              <td className="font-mono">32 °C</td>
              <td className="font-mono">32 °C</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// HVAC Dashboard
export const HVACDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>HVAC, Air Handling Units & Climate Regulation</h2>
        <p className="content-subtitle">Lucky Textile • Textile Finishing, Printing & Weaving Halls Environmental Control</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">HUMIDITY & TEMP COMPLIANCE: 99.4%</span>
        <button className="btn-export">Export Climate Log</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">PRINTING HALL TEMP</span>
          <span className="metric-badge green">COMFORT / QC</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">25.4</span>
          <span className="metric-unit">°C</span>
        </div>
        <div className="metric-footer">Setpoint: 25.0 ± 1.0 °C for ink viscosity</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">PRINTING HALL RH%</span>
          <span className="metric-badge green">CONTROLLED</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">65.2</span>
          <span className="metric-unit">% RH</span>
        </div>
        <div className="metric-footer">Prevents screen drying &amp; static sparks</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TOTAL CHILLED WATER FLOW</span>
          <span className="metric-badge normal">CIRCULATING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">380</span>
          <span className="metric-unit">m³/h</span>
        </div>
        <div className="metric-footer">Supply: 7.2°C • Return: 12.4°C</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">ONLINE AHU UNITS</span>
          <span className="metric-badge green">ALL RUNNING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">12 / 12</span>
          <span className="metric-unit">Units</span>
        </div>
        <div className="metric-footer">1 Filter differential warning (AHU-5)</div>
      </div>
    </div>
  </div>
);

// Grid Dashboard
export const GridDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>K-Electric 11kV Grid Incomer & Substation Telemetry</h2>
        <p className="content-subtitle">Lucky Textile • 132kV/11kV Substation & Synchronizing Incomers</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">TARIFF WINDOW: OFF-PEAK</span>
        <button className="btn-export">Export Billing Log</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">GRID IMPORT POWER</span>
          <span className="metric-badge green">ONLINE</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">4,200</span>
          <span className="metric-unit">kW</span>
        </div>
        <div className="metric-footer">Sanctioned Load: 8,000 kW (KE Feeder 1)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">POWER FACTOR AT INCOMER</span>
          <span className="metric-badge green">OPTIMAL</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">0.985</span>
          <span className="metric-unit">PF</span>
        </div>
        <div className="metric-footer">Zero penalty tariff (Threshold &gt; 0.90)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">GRID VOLTAGE (11kV)</span>
          <span className="metric-badge normal">NORMAL</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">11.18</span>
          <span className="metric-unit">kV</span>
        </div>
        <div className="metric-footer">Phase unbalance: 0.38% (Permitted &lt; 2%)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">PEAK TARIFF COUNTDOWN</span>
          <span className="metric-badge yellow">ALERT</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">03:42:15</span>
          <span className="metric-unit">Time</span>
        </div>
        <div className="metric-footer">Auto-shedding scheduled for Peak Hours</div>
      </div>
    </div>
  </div>
);

// SolarPV Dashboard
export const SolarPVDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>3.5 MWp Rooftop Solar PV Telemetry & Generation</h2>
        <p className="content-subtitle">Lucky Textile • Clean Solar Generation Across Finishing & Weaving Rooftops</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">CLEAN ENERGY RATIO: 20.3% OF PLANT</span>
        <button className="btn-export">Export Solar Data</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">LIVE SOLAR GENERATION</span>
          <span className="metric-badge green">PEAK SUN</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">3,000</span>
          <span className="metric-unit">kW</span>
        </div>
        <div className="metric-footer">Installed capacity: 3,500 kWp (85.7% Output)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">SOLAR IRRADIANCE</span>
          <span className="metric-badge normal">CLEAR SKY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">895</span>
          <span className="metric-unit">W/m²</span>
        </div>
        <div className="metric-footer">Ambient Temp: 30°C • Module Temp: 48.5°C</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TODAY'S SOLAR YIELD</span>
          <span className="metric-badge green">ACCUMULATING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">16.4</span>
          <span className="metric-unit">MWh</span>
        </div>
        <div className="metric-footer">Projected daily total: ~22.5 MWh</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">CO₂ OFFSET TODAY</span>
          <span className="metric-badge green">ESG GREEN</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">12.8</span>
          <span className="metric-unit">Tons</span>
        </div>
        <div className="metric-footer">Equivalent to 620 trees planted</div>
      </div>
    </div>
  </div>
);

// Chillers Dashboard
export const ChillersDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>Central Chilled Water Plant (Centrifugal &amp; Absorption Chillers)</h2>
        <p className="content-subtitle">Lucky Textile • Cooling for Mercerizing, Caustic Cooling, Printing &amp; HVAC</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">CHILLER COP: 5.82 (OPTIMAL)</span>
        <button className="btn-export">Export Chiller Logs</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TOTAL COOLING CAPACITY</span>
          <span className="metric-badge green">RUNNING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">1,850</span>
          <span className="metric-unit">TR</span>
        </div>
        <div className="metric-footer">Total plant cooling load: 1,420 TR</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">CHILLED WATER SUPPLY TEMP</span>
          <span className="metric-badge green">CHILLED</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">6.8</span>
          <span className="metric-unit">°C</span>
        </div>
        <div className="metric-footer">Return Temp: 12.2°C (ΔT = 5.4°C)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">COOLING TOWER CONDENSER</span>
          <span className="metric-badge normal">WATER</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">29.4</span>
          <span className="metric-unit">°C</span>
        </div>
        <div className="metric-footer">Induced draft cooling towers: 4 of 4 active</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">ABSORPTION CHILLER LOAD</span>
          <span className="metric-badge green">STEAM DRIVEN</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">600</span>
          <span className="metric-unit">TR</span>
        </div>
        <div className="metric-footer">Runs on low-pressure boiler waste steam</div>
      </div>
    </div>
  </div>
);

// Water Pump Dashboard
export const WaterPumpDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>Water Pumping Stations & Hydro-pneumatic Network</h2>
        <p className="content-subtitle">Lucky Textile • Deep Wells, Soft Water Boosters &amp; Fire Hydrant Ring</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">RING MAIN PRESSURE: 4.8 BAR</span>
        <button className="btn-export">Export Pump Logs</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">DEEP WELL INTAKE</span>
          <span className="metric-badge green">PUMPING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">142</span>
          <span className="metric-unit">m³/h</span>
        </div>
        <div className="metric-footer">3 Turbine pumps operating @ 45 Hz VFD</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">SOFT WATER BOOSTER</span>
          <span className="metric-badge green">BOOSTING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">95.0</span>
          <span className="metric-unit">m³/h</span>
        </div>
        <div className="metric-footer">Pressure: 4.8 Bar to Dyeing House</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">FIRE HYDRANT JOCKEY PUMP</span>
          <span className="metric-badge green">PRESSURIZED</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">10.5</span>
          <span className="metric-unit">Bar</span>
        </div>
        <div className="metric-footer">Standby diesel fire pump test: Passed</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">STORAGE RESERVOIR LEVEL</span>
          <span className="metric-badge normal">CAPACITY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">88.5</span>
          <span className="metric-unit">%</span>
        </div>
        <div className="metric-footer">Volume: 1,850,000 Liters (18h buffer)</div>
      </div>
    </div>
  </div>
);

// ETP Dashboard
export const ETPDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>Effluent Treatment Plant (ETP) & Environmental Compliance</h2>
        <p className="content-subtitle">Lucky Textile • Combined Chemical &amp; Biological Wastewater Treatment</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">SEPA / NEQS DISCHARGE: 100% COMPLIANT</span>
        <button className="btn-export">Export EPA Compliance Log</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">DISCHARGE PH</span>
          <span className="metric-badge green">NEQS PASS</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">7.35</span>
          <span className="metric-unit">pH</span>
        </div>
        <div className="metric-footer">Permitted limit: 6.0 - 9.0 pH</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">CHEMICAL OXYGEN DEMAND (COD)</span>
          <span className="metric-badge green">COMPLIANT</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">135</span>
          <span className="metric-unit">mg/L</span>
        </div>
        <div className="metric-footer">NEQS Standard: &lt; 150 mg/L (Inlet: 1850)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">BIOCHEMICAL OXYGEN DEMAND (BOD)</span>
          <span className="metric-badge green">COMPLIANT</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">38.0</span>
          <span className="metric-unit">mg/L</span>
        </div>
        <div className="metric-footer">NEQS Standard: &lt; 80 mg/L (Reduction 96%)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TOTAL SUSPENDED SOLIDS (TSS)</span>
          <span className="metric-badge green">COMPLIANT</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">42.0</span>
          <span className="metric-unit">mg/L</span>
        </div>
        <div className="metric-footer">NEQS Standard: &lt; 200 mg/L</div>
      </div>
    </div>
  </div>
);

// RO Dashboard
export const RODashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>Reverse Osmosis (RO) Water Purification Plant</h2>
        <p className="content-subtitle">Lucky Textile • Ultrafiltration &amp; 3-Pass RO for High-Precision Dyeing &amp; Boilers</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">RECOVERY RATE: 78.5% (OPTIMAL)</span>
        <button className="btn-export">Export RO Telemetry</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">RO PERMEATE FLOW</span>
          <span className="metric-badge green">DELIVERING</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">120.5</span>
          <span className="metric-unit">m³/h</span>
        </div>
        <div className="metric-footer">Reject Flow: 33.0 m³/h to Evaporator</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">PERMEATE TDS</span>
          <span className="metric-badge green">PURE WATER</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">38.5</span>
          <span className="metric-unit">ppm</span>
        </div>
        <div className="metric-footer">Inlet Feed TDS: 1,840 ppm (97.9% Salt Rejection)</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">MEMBRANE HIGH PRESSURE</span>
          <span className="metric-badge normal">NORMAL</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">14.8</span>
          <span className="metric-unit">Bar</span>
        </div>
        <div className="metric-footer">Grundfos CRN multistage booster active</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">NORMALIZED PERMEATE FLUX</span>
          <span className="metric-badge green">HEALTHY</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">98.2</span>
          <span className="metric-unit">%</span>
        </div>
        <div className="metric-footer">Next CIP (Clean-in-place) in 28 days</div>
      </div>
    </div>
  </div>
);

// Devices Dashboard
export const DevicesDashboard: React.FC = () => (
  <div className="dashboard-content">
    <div className="content-header-row">
      <div>
        <h2>IoT Gateways, PLC Network & Fieldbus Devices</h2>
        <p className="content-subtitle">Lucky Textile • SCADA Telemetry Network Infrastructure &amp; Modbus TCP Gateways</p>
      </div>
      <div className="header-actions-group">
        <span className="badge-tag green">64 / 64 FIELD GATEWAYS ONLINE</span>
        <button className="btn-export">Scan Network</button>
      </div>
    </div>

    <div className="metric-cards-row">
      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">TOTAL CONNECTED SENSORS</span>
          <span className="metric-badge green">ONLINE</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">1,480</span>
          <span className="metric-unit">Nodes</span>
        </div>
        <div className="metric-footer">Energy meters, thermal probes, flow transmitters</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">MODBUS TCP LATENCY</span>
          <span className="metric-badge green">ULTRA-FAST</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">12</span>
          <span className="metric-unit">ms</span>
        </div>
        <div className="metric-footer">Packet Loss: 0.00% • 10 Gbps Fiber Ring</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">CENTRAL SCADA SERVER IP</span>
          <span className="metric-badge normal">STATIC IP</span>
        </div>
        <div className="metric-body">
          <span className="metric-number" style={{ fontSize: '24px' }}>10.252.1.247</span>
          <span className="metric-unit">:8018</span>
        </div>
        <div className="metric-footer">Redundant Failover Host: 10.252.1.248</div>
      </div>

      <div className="scada-metric-card">
        <div className="metric-header">
          <span className="metric-title">SERVER UPTIME</span>
          <span className="metric-badge green">UNINTERRUPTED</span>
        </div>
        <div className="metric-body">
          <span className="metric-number">184</span>
          <span className="metric-unit">Days</span>
        </div>
        <div className="metric-footer">Zero unpredicted downtime in 2026</div>
      </div>
    </div>
  </div>
);
