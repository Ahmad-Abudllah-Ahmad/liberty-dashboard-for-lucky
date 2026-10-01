import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BrowserSimulationBar } from './components/BrowserSimulationBar';
import { HomeDashboard } from './components/dashboards/HomeDashboard';
import { SteamFlowDashboard } from './components/dashboards/SteamFlowDashboard';
import { MoistureDashboard } from './components/dashboards/MoistureDashboard';
import { PanelTemperatureDashboard } from './components/dashboards/PanelTemperatureDashboard';
import { AlarmsDashboard } from './components/dashboards/AlarmsDashboard';
import {
  QualityParametersPage,
  LiveMonitoringPage,
  EnergyGaugesPage,
  UtilitiesProductionPage,
  UtilitiesLotwisePage,
  UtilitiesStoppagePage,
  ActivityLogPage,
  MachineStoppagesPage,
  BoilerPerformancePage,
  BoilerStatusPage,
  HeatExchangerCardsPage,
  CompressorMonitorPage,
  GenesetMonitorPage,
  HVACMonitorPage,
  WaterPumpMonitorPage,
  SolarPVMonitorPage,
  ChillersMonitorPage,
  DevicesGridPage,
  GridDashboardPage,
  GridDashboard2Page,
  GridStatusPage,
  ETPDashboardPage,
  ETPStatusPage,
  RONetworkPage,
} from './components/dashboards/PortalPages';
import { mockAlarmsList } from './data/mockPlantData';
import type { AlarmRecord } from './types';
import './App.css';

export const App: React.FC = () => {
  // Navigation State
  const [activeId, setActiveId] = useState<string>('home');
  const [breadcrumb, setBreadcrumb] = useState<string>('Home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showBrowserFrame, setShowBrowserFrame] = useState<boolean>(false);

  // Submenus state: In screenshot 2, Dashboard, Printing, and Dyeing are expanded
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true,
    printing: true,
    dyeing: true,
  });

  // Alarms State (140 Alarms)
  const [alarms, setAlarms] = useState<AlarmRecord[]>(mockAlarmsList);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleSelect = (id: string, newBreadcrumb?: string) => {
    setActiveId(id);
    if (newBreadcrumb) {
      setBreadcrumb(newBreadcrumb);
    }
    // Scroll content container to top
    const mainEl = document.querySelector('.main-content-scroll');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  };

  const handleAcknowledgeAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((alm) => (alm.id === id ? { ...alm, acknowledged: true } : alm))
    );
  };

  const handleAcknowledgeAllAlarms = () => {
    setAlarms((prev) => prev.map((alm) => ({ ...alm, acknowledged: true })));
  };

  const unacknowledgedCount = alarms.filter((a) => !a.acknowledged).length;

  const renderActiveDashboard = () => {
    switch (activeId) {
      case 'home':
        return (
          <HomeDashboard
            onNavigate={handleSelect}
            unacknowledgedAlarmsCount={unacknowledgedCount}
          />
        );
      case 'energy-dashboard':
        return <EnergyGaugesPage />;
      case 'steam-flow':
        return <SteamFlowDashboard />;
      case 'moisture':
        return <MoistureDashboard />;
      case 'panel-temperature':
        return <PanelTemperatureDashboard />;
      case 'printing-quality':
      case 'dyeing-quality':
        return <QualityParametersPage />;
      case 'printing-live':
      case 'dyeing-live':
        return <LiveMonitoringPage />;
      case 'alarms':
        return (
          <AlarmsDashboard
            alarms={alarms}
            onAcknowledge={handleAcknowledgeAlarm}
            onAcknowledgeAll={handleAcknowledgeAllAlarms}
          />
        );
      case 'utilities':
      case 'utilities-production':
        return <UtilitiesProductionPage />;
      case 'utilities-lotwise':
        return <UtilitiesLotwisePage />;
      case 'utilities-stoppage':
        return <UtilitiesStoppagePage />;
      case 'activity-log':
        return <ActivityLogPage />;
      case 'machine-stoppages':
        return <MachineStoppagesPage />;
      case 'boilers':
      case 'boiler-performance':
        return <BoilerPerformancePage />;
      case 'boiler-status':
        return <BoilerStatusPage />;
      case 'heat-exchanger':
        return <HeatExchangerCardsPage />;
      case 'geneset':
        return <GenesetMonitorPage />;
      case 'compressor':
        return <CompressorMonitorPage />;
      case 'hvac':
        return <HVACMonitorPage />;
      case 'grid':
      case 'grid-dashboard':
        return <GridDashboardPage />;
      case 'grid-dashboard-2':
        return <GridDashboard2Page />;
      case 'grid-status':
        return <GridStatusPage />;
      case 'solarpv':
        return <SolarPVMonitorPage />;
      case 'chillers':
        return <ChillersMonitorPage />;
      case 'water-pump':
        return <WaterPumpMonitorPage />;
      case 'etp':
      case 'etp-dashboard':
        return <ETPDashboardPage />;
      case 'etp-status':
        return <ETPStatusPage />;
      case 'ro':
        return <RONetworkPage />;
      case 'devices':
        return <DevicesGridPage />;
      default:
        return (
          <HomeDashboard
            onNavigate={handleSelect}
            unacknowledgedAlarmsCount={unacknowledgedCount}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Optional Windows 11 Chrome Browser Frame Toggle */}
      <BrowserSimulationBar
        showFrame={showBrowserFrame}
        onToggleFrame={() => setShowBrowserFrame(!showBrowserFrame)}
      />

      <div className="app-body">
        {/* Exact Left Sidebar */}
        <Sidebar
          activeId={activeId}
          onSelect={handleSelect}
          collapsed={sidebarCollapsed}
          openMenus={openMenus}
          toggleMenu={toggleMenu}
        />

        {/* Main Content Area */}
        <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
          {/* Header */}
          <Header
            breadcrumb={breadcrumb}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            alarms={alarms}
            onOpenAlarms={() => handleSelect('alarms', 'Alarms')}
            onNavigate={handleSelect}
          />

          {/* Scrollable Dashboard View */}
          <main className="main-content-scroll">
            {renderActiveDashboard()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
