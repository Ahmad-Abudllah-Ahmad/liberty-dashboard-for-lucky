export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  hasSubmenu?: boolean;
  badge?: number;
  subitems?: {
    id: string;
    label: string;
    iconType?: 'circle' | 'image' | 'copy';
  }[];
};

export type AlarmSeverity = 'critical' | 'major' | 'minor' | 'info';

export type AlarmRecord = {
  id: string;
  tag: string;
  timestamp: string;
  description: string;
  area: 'Boilers' | 'Printing' | 'Dyeing' | 'Electrical' | 'ETP' | 'Compressor' | 'HVAC' | 'SolarPV';
  severity: AlarmSeverity;
  value: string;
  setpoint: string;
  acknowledged: boolean;
};

export type MetricCardData = {
  title: string;
  value: string | number;
  unit: string;
  delta?: string;
  isPositive?: boolean;
  status?: 'normal' | 'warning' | 'critical';
  trend?: number[];
};

export type MachineLiveStatus = {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'stopped' | 'warning';
  speed: string;
  jobCard: string;
  operator: string;
  efficiency: number;
  temperature: number;
  moisture?: number;
  uptime: string;
};
