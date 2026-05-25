import { Sensor, Alert, LogEntry } from './types';

export const initialSensors: Sensor[] = [
  {
    id: 'sensor-1',
    name: 'Primary Gateway Alpha',
    ip: '192.168.1.104',
    location: 'Data Center 01',
    load: 74,
    status: 'online',
    type: 'gateway',
    lastActive: 'Just now'
  },
  {
    id: 'sensor-2',
    name: 'Node-X Regional Hub',
    ip: '172.16.24.12',
    location: 'Singapore Edge',
    load: 22,
    status: 'online',
    type: 'hub',
    lastActive: '3m ago'
  },
  {
    id: 'sensor-3',
    name: 'Compute Cluster Gamma',
    ip: '10.0.4.55',
    location: 'Cloud Layer 4',
    load: 51,
    status: 'online',
    type: 'compute',
    lastActive: '5m ago'
  },
  {
    id: 'sensor-4',
    name: 'US-East Edge Shield',
    ip: '10.0.2.19',
    location: 'Virginia DC 3',
    load: 18,
    status: 'online',
    type: 'firewall',
    lastActive: '1m ago'
  },
  {
    id: 'sensor-5',
    name: 'EU-West Storage Guard',
    ip: '10.80.3.5',
    location: 'Frankfurt Layer 2',
    load: 40,
    status: 'online',
    type: 'compute',
    lastActive: '12m ago'
  },
  {
    id: 'sensor-6',
    name: 'Backup Syncer Omega',
    ip: '192.168.12.51',
    location: 'Local Storage Vault',
    load: 5,
    status: 'online',
    type: 'gateway',
    lastActive: '30m ago'
  },
  {
    id: 'sensor-7',
    name: 'IoT Isolation Mesh',
    ip: '172.30.90.111',
    location: 'HQ Floor 4 Lab',
    load: 63,
    status: 'online',
    type: 'hub',
    lastActive: 'Just now'
  }
];

export const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Brute-Force Attack Attempt',
    severity: 'critical',
    timestamp: '12:44:21 UTC',
    source: '203.0.113.88',
    status: 'active',
    description: 'Suspicious sequence of authentication requests targeted at local credential vault over SSH. Originating IP traced to offshore hosting provider.'
  },
  {
    id: 'alert-2',
    title: 'Port Scan Detected',
    severity: 'high',
    timestamp: '11:58:05 UTC',
    source: '203.0.113.45',
    status: 'active',
    description: 'Scanning of common services port range (21, 22, 80, 443, 8080) detected on Gateway Alpha. Traffic was automatically cataloged and blocked by router firewall.'
  },
  {
    id: 'alert-3',
    title: 'Anomalous Data Transfer Vol',
    severity: 'medium',
    timestamp: '10:15:30 UTC',
    source: 'Compute Cluster Gamma',
    status: 'active',
    description: 'Outbound transfer volume is 350% above rolling baseline averages. Scheduled backups or unthrottled backup activity suspected.'
  },
  {
    id: 'alert-4',
    title: 'Suspicious SSL Handshake',
    severity: 'low',
    timestamp: '09:40:11 UTC',
    source: '192.168.1.109',
    status: 'mitigated',
    description: 'Expired cipher suite connection accepted temporarily by secure hub. Recommended SSL configuration update executed.'
  },
  {
    id: 'alert-5',
    title: 'Firmware Out of Sync',
    severity: 'low',
    timestamp: '08:22:00 UTC',
    source: 'Backup Syncer Omega',
    status: 'active',
    description: 'A minor firmware patch is available. Please apply the upgrade sequence to stay secure.'
  }
];

export const initialLogs: LogEntry[] = [
  {
    id: 'log-1',
    time: '12:44:21 UTC',
    message: 'Automated firewall update complete on Gateway Alpha.',
    source: 'Gateway Alpha',
    type: 'success'
  },
  {
    id: 'log-2',
    time: '11:58:05 UTC',
    message: 'Port scan detected from [203.0.113.45]. Blocked.',
    source: 'Gateway Alpha',
    type: 'error'
  },
  {
    id: 'log-3',
    time: '11:32:12 UTC',
    message: 'New IoT device authenticated: "Smart-HVAC-04".',
    source: 'IoT Isolation Mesh',
    type: 'info'
  },
  {
    id: 'log-4',
    time: '09:15:44 UTC',
    message: 'Daily heuristic analysis completed. 0 vulnerabilities found.',
    source: 'Global Defense Controller',
    type: 'success'
  },
  {
    id: 'log-5',
    time: '08:12:05 UTC',
    message: 'Scheduled configuration cloud backup established.',
    source: 'Backup Syncer Omega',
    type: 'info'
  },
  {
    id: 'log-6',
    time: '07:30:00 UTC',
    message: 'Active route table synced with 3 peering autonomous systems.',
    source: 'Node-X Regional Hub',
    type: 'info'
  }
];
