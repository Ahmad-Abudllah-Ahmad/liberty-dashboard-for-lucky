import React from 'react';

interface BrowserSimulationBarProps {
  onToggleFrame?: () => void;
  showFrame: boolean;
}

export const BrowserSimulationBar: React.FC<BrowserSimulationBarProps> = ({
  showFrame,
  onToggleFrame,
}) => {
  if (!showFrame) {
    return (
      <div className="simulation-toggle-banner">
        <span>🏭 Liberty Mills Limited Central SCADA Portal</span>
        <button className="btn-toggle-frame" onClick={onToggleFrame}>
          Toggle Desktop Browser Frame (10.252.1.247:8018)
        </button>
      </div>
    );
  }

  return (
    <div className="chrome-simulation-frame">
      {/* Chrome Tab Bar */}
      <div className="chrome-tab-bar">
        <div className="chrome-tabs-list">
          <div className="chrome-tab">
            <span className="tab-favicon tab-shop">🛍️</span>
            <span className="tab-title">Shop - Purchase Re...</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-tab">
            <span className="tab-favicon">🏢</span>
            <span className="tab-title">LIBERTY MILLS LIM...</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-tab">
            <span className="tab-favicon">🏢</span>
            <span className="tab-title">LIBERTY MILLS LIM...</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-tab">
            <span className="tab-favicon">📄</span>
            <span className="tab-title">Documents</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-tab">
            <span className="tab-favicon">⚙️</span>
            <span className="tab-title">Stenter-24_PMS_Tr...</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-tab">
            <span className="tab-favicon">📋</span>
            <span className="tab-title">Job Card</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-tab">
            <span className="tab-favicon tab-wa">💬</span>
            <span className="tab-title">(6) WhatsApp</span>
            <span className="tab-close">×</span>
          </div>
          {/* Active Tab */}
          <div className="chrome-tab active-tab">
            <span className="tab-favicon-active">A</span>
            <span className="tab-title">Liberty</span>
            <span className="tab-close">×</span>
          </div>
          <div className="chrome-new-tab" title="New Tab">+</div>
        </div>

        <div className="window-controls">
          <button className="btn-hide-frame" onClick={onToggleFrame} title="Hide simulated browser chrome">
            ✕ Full Screen
          </button>
        </div>
      </div>

      {/* Chrome Navigation & URL Bar */}
      <div className="chrome-url-bar-row">
        <div className="nav-nav-buttons">
          <button className="btn-nav-arrow" title="Back">←</button>
          <button className="btn-nav-arrow" title="Forward">→</button>
          <button className="btn-nav-arrow" title="Reload">↻</button>
        </div>

        <div className="url-address-box">
          <span className="url-security-warning">⚠ Not secure</span>
          <span className="url-divider">|</span>
          <span className="url-text">10.252.1.247:8018</span>
          <span className="url-star" title="Bookmark">★</span>
        </div>

        <div className="chrome-actions-right">
          <span className="chrome-ext-icon" title="Extensions">🧩</span>
          <div className="chrome-user-avatar" title="Plant Operator">👤</div>
          <div className="chrome-ai-chat-badge" title="SCADA Copilot">
            <span className="ai-icon">✨</span> Chat
          </div>
        </div>
      </div>
    </div>
  );
};
