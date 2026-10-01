import React, { useState } from 'react';

export const BoilerSCADADashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('Sep 29, 2026 - Sep 30, 2026');

  // Exact data from reference screenshot: boilerdashboard
  const generatedRows = [
    { label: 'Gas Boiler 16 Ton', value: 0.00 },
    { label: 'Gas Boiler 25 Ton', value: 0.00 },
    { label: 'Gas Boiler 30 Ton', value: 0.00 },
    { label: 'Bio Mass', value: 1085.50 },
    { label: 'Bio Mass 40 Ton', value: 529.70 },
  ];

  const consumedRows = [
    { label: 'Muslim Cotton', value: 127 },
    { label: 'Distribution Steam Printing', value: 1071.4 },
    { label: 'Distribution Steam Dyeing', value: 154 },
    { label: 'Dyeing Crp', value: 43.98 },
    { label: 'Bio Mass - Soot Blower', value: 8 },
    { label: 'Bio Mass 40 Ton (SOOT BLOWER)', value: 3.209 },
    { label: 'Deaerator Steam', value: 102.49 },
  ];

  const totalGenerated = 1615.20;
  const totalConsumed = 1510.08;
  const difference = 105.12;
  const percent = 93.49;

  return (
    <div className="dashboard-content boiler-scada-container">
      {/* Title */}
      <div className="boiler-scada-title">
        <h2>Steam Generation and Consumption Report</h2>
        <div className="boiler-date-picker">
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="boiler-date-input"
          />
          <button className="btn-display">Display</button>
        </div>
      </div>

      {/* Top Metric Cards - Gear Icons */}
      <div className="boiler-metric-strip">
        <div className="boiler-metric-card green-bg">
          <div className="gear-icon">⚙</div>
          <div className="boiler-metric-info">
            <span className="boiler-metric-label">Gas consumed</span>
            <span className="boiler-metric-value">0.00</span>
            <span className="boiler-metric-unit">NaN (M³)</span>
          </div>
        </div>
        <div className="boiler-metric-card blue-bg">
          <div className="gear-icon">⚙</div>
          <div className="boiler-metric-info">
            <span className="boiler-metric-label">Feed Water</span>
            <span className="boiler-metric-value">1651.10</span>
            <span className="boiler-metric-unit">1.02 (M³)</span>
          </div>
        </div>
        <div className="boiler-metric-card green-bg">
          <div className="gear-icon">⚙</div>
          <div className="boiler-metric-info">
            <span className="boiler-metric-label">Condensate Water</span>
            <span className="boiler-metric-value">553.60 (M³)</span>
          </div>
        </div>
        <div className="boiler-metric-card gray-bg">
          <div className="gear-icon">⚙</div>
          <div className="boiler-metric-info">
            <span className="boiler-metric-label">RO Water</span>
            <span className="boiler-metric-value">1097.50 (M³)</span>
          </div>
        </div>
      </div>

      {/* Two Column: Steam Generated & Steam Consumed */}
      <div className="boiler-two-col">
        {/* Steam Generated */}
        <div className="boiler-col">
          <h3 className="boiler-col-title">Steam Generated (Tons)</h3>
          <div className="boiler-rows-list">
            {generatedRows.map((row, i) => (
              <div key={i} className="boiler-row generated-row">
                <span className="boiler-row-label">{row.label}</span>
                <span className="boiler-row-value">{row.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steam Consumed */}
        <div className="boiler-col">
          <h3 className="boiler-col-title">Steam Consumed (Tons)</h3>
          <div className="boiler-rows-list">
            {consumedRows.map((row, i) => (
              <div key={i} className="boiler-row consumed-row">
                <span className="boiler-row-label">{row.label}</span>
                <span className="boiler-row-value">{typeof row.value === 'number' ? row.value : row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="boiler-summary-footer">
        <div className="boiler-summary-item">
          <span className="boiler-summary-value">{totalGenerated.toFixed(2)}</span>
          <span className="boiler-summary-label">TOTAL GENERATED</span>
        </div>
        <div className="boiler-summary-item">
          <span className="boiler-summary-value">{totalConsumed.toFixed(2)}</span>
          <span className="boiler-summary-label">TOTAL CONSUMED</span>
        </div>
        <div className="boiler-summary-item">
          <span className="boiler-summary-value red">{difference.toFixed(2)}</span>
          <span className="boiler-summary-label">DIFFERENCE</span>
        </div>
        <div className="boiler-summary-item">
          <span className="boiler-summary-value">{percent.toFixed(2)}</span>
          <span className="boiler-summary-label">PERCENT</span>
        </div>
      </div>
    </div>
  );
};

export default BoilerSCADADashboard;
