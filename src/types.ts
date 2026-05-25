export interface Sensor {
  id: string;
  name: string;
  ip: string;
  location: string;
  load: number;
  status: 'online' | 'offline' | 'rebooting';
  type: 'gateway' | 'hub' | 'compute' | 'firewall';
  lastActive: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  source: string;
  status: 'active' | 'mitigated' | 'dismissed';
  description: string;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  source: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export type TabKey = 'dashboard' | 'sensors' | 'alerts' | 'reports';
