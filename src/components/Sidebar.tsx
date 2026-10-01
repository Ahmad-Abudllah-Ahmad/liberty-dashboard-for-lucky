import React from 'react';
import { navigationMenu } from '../data/mockPlantData';
import {
  LibertyLogo,
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
  IconChevronRight,
  IconChevronDown,
  IconSubmenuCircle,
  IconSubmenuImage,
  IconSubmenuCopy,
} from './Icons';

interface SidebarProps {
  activeId: string;
  onSelect: (id: string, breadcrumb: string) => void;
  collapsed: boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
  alarmBadgeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelect,
  collapsed,
  openMenus,
  toggleMenu,
  alarmBadgeCount,
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return <IconDashboard size={18} />;
      case 'printing':
        return <IconPrinting size={18} />;
      case 'dyeing':
        return <IconDyeing size={18} />;
      case 'alarms':
        return <IconAlarms size={18} />;
      case 'utilities':
        return <IconUtilities size={18} />;
      case 'boilers':
        return <IconBoilers size={18} />;
      case 'heat-exchanger':
        return <IconHeatExchanger size={18} />;
      case 'geneset':
        return <IconGeneset size={18} />;
      case 'compressor':
        return <IconCompressor size={18} />;
      case 'hvac':
        return <IconHVAC size={18} />;
      case 'grid':
        return <IconGrid size={18} />;
      case 'solarpv':
        return <IconSolarPV size={18} />;
      case 'chillers':
        return <IconChillers size={18} />;
      case 'water-pump':
        return <IconWaterPump size={18} />;
      case 'etp':
        return <IconETP size={18} />;
      case 'ro':
        return <IconRO size={18} />;
      case 'devices':
        return <IconDevices size={18} />;
      default:
        return <IconDashboard size={18} />;
    }
  };

  const renderSubmenuIcon = (iconType?: 'circle' | 'image' | 'copy') => {
    switch (iconType) {
      case 'image':
        return <IconSubmenuImage size={15} />;
      case 'copy':
        return <IconSubmenuCopy size={15} />;
      case 'circle':
      default:
        return <IconSubmenuCircle size={14} />;
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => onSelect('home', 'Home')} title="Liberty Mills Limited Home">
        <LibertyLogo size={32} />
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-menu-scroll">
        <ul className="sidebar-nav">
          {navigationMenu.map((item) => {
            const isOpen = !!openMenus[item.id];
            const isParentActive =
              activeId === item.id ||
              (item.subitems && item.subitems.some((sub) => sub.id === activeId));

            return (
              <li
                key={item.id}
                className={`nav-item ${isOpen ? 'menu-open' : ''} ${isParentActive ? 'active-parent' : ''}`}
              >
                <div
                  className={`nav-link ${activeId === item.id ? 'active' : ''}`}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.id);
                    } else {
                      onSelect(item.id, item.label);
                    }
                  }}
                >
                  <span className="nav-icon">{renderIcon(item.icon)}</span>
                  <span className="nav-text">{item.label}</span>

                  {item.id === 'alarms' && alarmBadgeCount !== undefined ? (
                    <span className="nav-badge-pill">{alarmBadgeCount}</span>
                  ) : (
                    item.badge !== undefined && <span className="nav-badge-pill">{item.badge}</span>
                  )}

                  {item.hasSubmenu && (
                    <span className="nav-arrow">
                      {isOpen ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
                    </span>
                  )}
                </div>

                {/* Submenu Dropdown */}
                {item.hasSubmenu && item.subitems && (
                  <ul className={`nav-treeview ${isOpen ? 'show' : ''}`}>
                    {item.subitems.map((sub) => {
                      const isSubActive = activeId === sub.id;
                      return (
                        <li key={sub.id} className="nav-subitem">
                          <div
                            className={`nav-sublink ${isSubActive ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(sub.id, `${item.label} / ${sub.label}`);
                            }}
                          >
                            <span className="sub-icon">{renderSubmenuIcon(sub.iconType)}</span>
                            <span className="sub-text">{sub.label}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
