import type { NavigationItem, AlarmRecord, MachineLiveStatus } from '../types';

export const navigationMenu: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    hasSubmenu: true,
    subitems: [
      { id: 'energy-dashboard', label: 'Energy Dashboard', iconType: 'circle' },
      { id: 'steam-flow', label: 'Steam Flow', iconType: 'circle' },
      { id: 'moisture', label: 'Moisture', iconType: 'circle' },
      { id: 'panel-temperature', label: 'Panel Temperature', iconType: 'circle' },
    ],
  },
  {
    id: 'ltm-4',
    label: 'LTM 4',
    icon: 'dyeing',
  },
  {
    id: 'alarms',
    label: 'Alarms',
    icon: 'alarms',
    badge: 140,
  },
  {
    id: 'utilities',
    label: 'Utilities',
    icon: 'utilities',
    hasSubmenu: true,
    subitems: [
      { id: 'utilities-production', label: 'Utilities with Production', iconType: 'circle' },
      { id: 'utilities-lotwise', label: 'Utilities with Lotwise Production', iconType: 'circle' },
      { id: 'utilities-stoppage', label: 'Utilities with Stoppage', iconType: 'circle' },
      { id: 'activity-log', label: 'Activity Log', iconType: 'circle' },
      { id: 'machine-stoppages', label: 'Machine Stoppages', iconType: 'circle' },
    ],
  },
  {
    id: 'boilers',
    label: 'Boilers',
    icon: 'boilers',
    hasSubmenu: true,
    subitems: [
      { id: 'boiler-status', label: 'Boilers Status', iconType: 'circle' },
      { id: 'boiler-performance', label: 'Boilers Performance', iconType: 'circle' },
    ],
  },
  {
    id: 'heat-exchanger',
    label: 'Heat Exchanger',
    icon: 'heat-exchanger',
  },
  {
    id: 'geneset',
    label: 'Geneset',
    icon: 'geneset',
  },
  {
    id: 'compressor',
    label: 'Compressor',
    icon: 'compressor',
  },
  {
    id: 'hvac',
    label: 'HVAC',
    icon: 'hvac',
  },
  {
    id: 'grid',
    label: 'Grid',
    icon: 'grid',
    hasSubmenu: true,
    subitems: [
      { id: 'grid-dashboard', label: 'Grid Dashboard', iconType: 'circle' },
      { id: 'grid-dashboard-2', label: 'Grid Dashboard-2', iconType: 'circle' },
      { id: 'grid-status', label: 'Grid Status', iconType: 'circle' },
    ],
  },
  {
    id: 'solarpv',
    label: 'SolarPV',
    icon: 'solarpv',
  },
  {
    id: 'chillers',
    label: 'Chillers',
    icon: 'chillers',
  },
  {
    id: 'water-pump',
    label: 'Water Pump',
    icon: 'water-pump',
  },
  {
    id: 'etp',
    label: 'ETP',
    icon: 'etp',
    hasSubmenu: true,
    subitems: [
      { id: 'etp-dashboard', label: 'ETP Dashboard', iconType: 'circle' },
      { id: 'etp-status', label: 'ETP Status', iconType: 'circle' },
    ],
  },
  {
    id: 'ro',
    label: 'RO',
    icon: 'ro',
  },
  {
    id: 'devices',
    label: 'Devices',
    icon: 'devices',
  },
];

// Generate 140 realistic SCADA alarms matching the badge
const generateAlarms = (): AlarmRecord[] => {
  const templates = [
    { tag: 'BLR-02-PT01', desc: 'Boiler #2 Main Steam Header Pressure High', area: 'Boilers' as const, sev: 'critical' as const, val: '10.85 Bar', sp: '10.00 Bar' },
    { tag: 'STN-24-TC04', desc: 'Stenter-24 Chamber 4 Drying Zone Over-Temperature', area: 'Printing' as const, sev: 'critical' as const, val: '194.2 °C', sp: '180.0 °C' },
    { tag: 'PAN-LT-TR01', desc: 'LT Switchgear Busbar Phase B Overheating Warning', area: 'Electrical' as const, sev: 'major' as const, val: '82.4 °C', sp: '75.0 °C' },
    { tag: 'DYG-03-LV02', desc: 'Fong Dyeing Machine #3 Add Tank Level Low', area: 'Dyeing' as const, sev: 'minor' as const, val: '14.2 %', sp: '20.0 %' },
    { tag: 'CMP-01-DP01', desc: 'Atlas Copco Compressor #1 Air Filter Differential Pressure High', area: 'Compressor' as const, sev: 'minor' as const, val: '0.92 Bar', sp: '0.80 Bar' },
    { tag: 'ETP-PH-01', desc: 'ETP Equalization Tank pH Deviation', area: 'ETP' as const, sev: 'major' as const, val: '9.42 pH', sp: '6.5 - 8.5 pH' },
    { tag: 'GEN-01-JW02', desc: 'Jenbacher Gas Genset #1 Jacket Water Temp High', area: 'Electrical' as const, sev: 'major' as const, val: '91.8 °C', sp: '88.0 °C' },
    { tag: 'SOL-INV-07', desc: 'Solar Rooftop Inverter #7 String 3 Ground Fault', area: 'SolarPV' as const, sev: 'critical' as const, val: 'Trip', sp: 'Normal' },
    { tag: 'HVAC-AHU-05', desc: 'Weaving Finishing Hall AHU-5 Air Filter Choked', area: 'HVAC' as const, sev: 'info' as const, val: '185 Pa', sp: '150 Pa' },
    { tag: 'PRN-ROT-01', desc: 'Reggiani Rotary Screen 4 Color Viscosity Fluctuation', area: 'Printing' as const, sev: 'minor' as const, val: '4,850 cP', sp: '4,200 cP' },
    { tag: 'BLR-01-O2', desc: 'Boiler #1 Flue Gas O2 Level Low (Incomplete Combustion)', area: 'Boilers' as const, sev: 'major' as const, val: '1.2 %', sp: '3.0 - 4.5 %' },
    { tag: 'WTR-RO-TDS', desc: 'RO Permeate High Conductivity / TDS Alert', area: 'ETP' as const, sev: 'major' as const, val: '115 ppm', sp: '50 ppm' },
    { tag: 'GRD-PF-01', desc: '11kV Grid Incomer Power Factor Low (Lagging)', area: 'Electrical' as const, sev: 'minor' as const, val: '0.87 PF', sp: '0.95 PF' },
    { tag: 'STN-21-MST', desc: 'Stenter-21 Fabric Exit Moisture Below Setpoint (Over-drying)', area: 'Printing' as const, sev: 'minor' as const, val: '2.1 %', sp: '4.5 %' },
  ];

  const alarms: AlarmRecord[] = [];
  const baseDate = new Date();

  for (let i = 0; i < 140; i++) {
    const t = templates[i % templates.length];
    const minsAgo = Math.floor(i * 3.5) + 1;
    const time = new Date(baseDate.getTime() - minsAgo * 60000);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    alarms.push({
      id: `ALM-${1000 + i}`,
      tag: `${t.tag}-${String(Math.floor(i / templates.length) + 1).padStart(2, '0')}`,
      timestamp: `Today ${timeStr}`,
      description: `${t.desc} (Unit ${Math.floor(i / 10) + 1})`,
      area: t.area,
      severity: i % 7 === 0 ? 'critical' : i % 3 === 0 ? 'major' : i % 2 === 0 ? 'minor' : 'info',
      value: t.val,
      setpoint: t.sp,
      acknowledged: i > 25,
    });
  }
  return alarms;
};

export const mockAlarmsList = generateAlarms();

export const mockMachines: MachineLiveStatus[] = [
  {
    id: 'STN-24',
    name: 'Stenter-24 (Monforts 10-Chamber)',
    type: 'Finishing & Heat Setting',
    status: 'running',
    speed: '48.5 m/min',
    jobCard: 'JC-LML-2026-9481 (100% Cotton Satin)',
    operator: 'M. Tariq / Shift A',
    efficiency: 94.2,
    temperature: 182.5,
    moisture: 4.8,
    uptime: '18h 42m',
  },
  {
    id: 'STN-21',
    name: 'Stenter-21 (Bruckner 8-Chamber)',
    type: 'Pre-treatment & Drying',
    status: 'running',
    speed: '55.0 m/min',
    jobCard: 'JC-LML-2026-9477 (Poly-Cotton Sheeting)',
    operator: 'Zahid Khan / Shift A',
    efficiency: 91.8,
    temperature: 165.0,
    moisture: 5.2,
    uptime: '14h 15m',
  },
  {
    id: 'PRN-ROT-1',
    name: 'Reggiani Rotary 12-Color',
    type: 'Fabric Rotary Printing',
    status: 'running',
    speed: '62.0 m/min',
    jobCard: 'JC-LML-2026-9460 (Reactive Print 120 GSM)',
    operator: 'Nadeem Akhtar',
    efficiency: 96.0,
    temperature: 145.0,
    uptime: '22h 10m',
  },
  {
    id: 'PRN-ZIM-2',
    name: 'Zimmer Flatbed Printer',
    type: 'Specialty Border & Panel Print',
    status: 'warning',
    speed: '28.5 m/min',
    jobCard: 'JC-LML-2026-9452 (Jacquard Bedspreads)',
    operator: 'Shahid Iqbal',
    efficiency: 78.4,
    temperature: 135.0,
    uptime: '6h 30m',
  },
  {
    id: 'DYG-FNG-01',
    name: "Fong's Eco-8 High Temp Dyeing",
    type: 'Exhaust Dyeing Vessel',
    status: 'running',
    speed: '320 m/min (Fabric Run)',
    jobCard: 'JC-LML-2026-9490 (Reactive Deep Navy 2000kg)',
    operator: 'Irfan Ullah',
    efficiency: 98.1,
    temperature: 98.4,
    uptime: '11h 20m',
  },
  {
    id: 'DYG-THS-02',
    name: 'Thies Soft-Flow Jigger Vessel',
    type: 'Delicate Knits Dyeing',
    status: 'idle',
    speed: '0 m/min',
    jobCard: 'Waiting Next Lot #9495 (Washing Phase)',
    operator: 'Kamran Ali',
    efficiency: 85.0,
    temperature: 42.0,
    uptime: '0h 45m',
  },
];
