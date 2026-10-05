import React, { useState } from 'react';
import { navigationMenu } from '../data/mockPlantData';
import {
  IconDashboard,
  IconPrinting,
  IconDyeing,
  IconAlarms,
  IconUtilities,
  IconBoilers,
  IconHeatExchanger,
  IconGeneset,
  IconCompressor,
  IconHVAC,
  IconGrid,
  IconSolarPV,
  IconChillers,
  IconWaterPump,
  IconETP,
  IconRO,
  IconDevices,
  IconSubmenuCircle,
  IconSubmenuImage,
  IconSubmenuCopy,
  IconSteam,
  IconMoisture,
  IconTemperature,
  IconQuality,
  IconLive,
  IconStatus,
  IconPerformance,
  IconLog,
  IconStoppage,
} from './Icons';

interface SidebarProps {
  activeId: string;
  onSelect: (id: string, breadcrumb: string) => void;
  collapsed: boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelect,
  collapsed,
  openMenus,
  toggleMenu,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [isHoveringRail, setIsHoveringRail] = useState(false);
  const [isHoveringFlyout, setIsHoveringFlyout] = useState(false);
  const [flyoutTop, setFlyoutTop] = useState(16);

  const renderIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'dashboard':
        return <IconDashboard size={size} />;
      case 'printing':
        return <IconPrinting size={size} />;
      case 'dyeing':
        return <IconDyeing size={size} />;
      case 'job-card':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        );
      case 'batch-trace':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6v12M7 6v12M9 6v12M12 6v12M14 6v12M16 6v12M19 6v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        );
      case 'alarms':
        return <IconAlarms size={size} />;
      case 'utilities':
        return <IconUtilities size={size} />;
      case 'boilers':
        return <IconBoilers size={size} />;
      case 'heat-exchanger':
        return <IconHeatExchanger size={size} />;
      case 'geneset':
        return <IconGeneset size={size} />;
      case 'compressor':
        return <IconCompressor size={size} />;
      case 'hvac':
        return <IconHVAC size={size} />;
      case 'grid':
        return <IconGrid size={size} />;
      case 'solarpv':
        return <IconSolarPV size={size} />;
      case 'chillers':
        return <IconChillers size={size} />;
      case 'water-pump':
        return <IconWaterPump size={size} />;
      case 'etp':
        return <IconETP size={size} />;
      case 'ro':
        return <IconRO size={size} />;
      case 'devices':
        return <IconDevices size={size} />;
      default:
        return <IconDashboard size={size} />;
    }
  };

  const renderSubmenuIcon = (subId: string, iconType?: 'circle' | 'image' | 'copy') => {
    switch (subId) {
      case 'energy-dashboard':
      case 'grid-dashboard':
      case 'grid-dashboard-2':
      case 'etp-dashboard':
        return <IconDashboard size={18} />;
      case 'steam-flow':
        return <IconSteam size={18} />;
      case 'moisture':
        return <IconMoisture size={18} />;
      case 'panel-temperature':
        return <IconTemperature size={18} />;
      case 'printing-quality':
      case 'dyeing-quality':
        return <IconQuality size={18} />;
      case 'printing-live':
      case 'dyeing-live':
        return <IconLive size={18} />;
      case 'boiler-status':
      case 'grid-status':
      case 'etp-status':
        return <IconStatus size={18} />;
      case 'boiler-performance':
        return <IconPerformance size={18} />;
      case 'activity-log':
        return <IconLog size={18} />;
      case 'utilities-stoppage':
      case 'machine-stoppages':
        return <IconStoppage size={18} />;
      case 'utilities-production':
      case 'utilities-lotwise':
        return <IconUtilities size={18} />;
      default:
        if (iconType === 'image') return <IconSubmenuImage size={18} />;
        if (iconType === 'copy') return <IconSubmenuCopy size={18} />;
        return <IconSubmenuCircle size={18} />;
    }
  };

  const peek = collapsed && !isHoveringFlyout && (isHoveringRail || Boolean(hoveredId));
  const hoveredParent = navigationMenu.find((item) => item.id === hoveredId);
  const openFlyoutId = hoveredParent?.hasSubmenu
    ? hoveredId
    : isHoveringFlyout && pinnedId && navigationMenu.find((item) => item.id === pinnedId)?.hasSubmenu
      ? pinnedId
      : hoveredId
        ? null
        : pinnedId && navigationMenu.find((item) => item.id === pinnedId)?.hasSubmenu
          ? pinnedId
          : null;
  const flyoutItem = navigationMenu.find((item) => item.id === openFlyoutId);
  const flyoutExpanded = Boolean(flyoutItem && isHoveringFlyout);

  const placeFlyout = (target: HTMLElement) => {
    const rail = target.closest('.sidebar');
    if (!rail) return;
    const railBox = rail.getBoundingClientRect();
    const itemBox = target.getBoundingClientRect();
    const nextTop = itemBox.top - railBox.top;
    setFlyoutTop(Math.max(8, Math.min(nextTop, railBox.height - 72)));
  };

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${peek ? 'is-peek' : ''} ${isHoveringFlyout ? 'is-on-child' : ''}`}
      onMouseLeave={() => {
        setIsHoveringRail(false);
        setHoveredId(null);
        setIsHoveringFlyout(false);
      }}
    >
      <div
        className="sidebar-menu-scroll"
        onMouseEnter={() => setIsHoveringRail(true)}
        onMouseLeave={() => setIsHoveringRail(false)}
      >
        <ul className="sidebar-nav">
          {navigationMenu.map((item) => {
            const isParentActive =
              pinnedId === item.id ||
              activeId === item.id ||
              (item.subitems && item.subitems.some((sub) => sub.id === activeId));
            const isFlyoutOpen = openFlyoutId === item.id;

            return (
              <li
                key={item.id}
                className={`nav-item ${isParentActive ? 'active-parent' : ''} ${isFlyoutOpen ? 'flyout-open' : ''}`}
                onMouseEnter={(event) => {
                  setHoveredId(item.id);
                  if (item.hasSubmenu) {
                    placeFlyout(event.currentTarget);
                  }
                }}
              >
                <div
                  className={`nav-link ${isParentActive ? 'active' : ''}`}
                  onClick={(event) => {
                    if (item.hasSubmenu) {
                      setPinnedId((current) => (current === item.id ? null : item.id));
                      toggleMenu(item.id);
                      placeFlyout(event.currentTarget);
                    } else {
                      setPinnedId(null);
                      onSelect(item.id, item.label);
                    }
                  }}
                >
                  <span className="nav-icon">{renderIcon(item.icon)}</span>
                  <span className="nav-text">{item.label}</span>
                  {item.badge !== undefined && <span className="nav-badge-pill">{item.badge}</span>}
                </div>

                {item.hasSubmenu && item.subitems && !collapsed && openMenus[item.id] && !isFlyoutOpen && (
                  <ul className="nav-treeview show">
                    {item.subitems.map((sub) => (
                      <li key={sub.id} className="nav-subitem">
                        <div
                          className={`nav-sublink ${activeId === sub.id ? 'active' : ''}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(sub.id, `${item.label} / ${sub.label}`);
                          }}
                        >
                          <span className="sub-icon">{renderSubmenuIcon(sub.id, sub.iconType)}</span>
                          <span className="sub-text">{sub.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {flyoutItem?.subitems && (
        <div
          className={`sidebar-flyout ${flyoutExpanded ? 'is-expanded' : 'is-icons'}`}
          role="menu"
          style={{ top: flyoutTop }}
          onMouseEnter={() => setIsHoveringFlyout(true)}
          onMouseLeave={() => setIsHoveringFlyout(false)}
        >
          {flyoutExpanded && <p className="sidebar-flyout-title">{flyoutItem.label}</p>}
          <ul>
            {flyoutItem.subitems.map((sub) => (
              <li key={sub.id}>
                <button
                  type="button"
                  className={`sidebar-flyout-link ${activeId === sub.id ? 'active' : ''}`}
                  onClick={() => {
                    setPinnedId(flyoutItem.id);
                    onSelect(sub.id, `${flyoutItem.label} / ${sub.label}`);
                  }}
                >
                  <span className="sub-icon">{renderSubmenuIcon(sub.id, sub.iconType)}</span>
                  <span className="sidebar-flyout-label">{sub.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};
