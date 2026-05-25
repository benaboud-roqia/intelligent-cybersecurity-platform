import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SensorsView from './components/SensorsView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import FooterMobile from './components/FooterMobile';
import { Sensor, Alert, LogEntry, TabKey } from './types';
import { initialSensors, initialAlerts, initialLogs } from './mockData';
import { ShieldCheck, Plus, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState<TabKey>('dashboard');
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  
  // Real-time Traffic state
  const [trafficMetrics, setTrafficMetrics] = useState({
    inbound: 1.42,
    outbound: 842.1,
    latency: 0.02
  });

  // Calculate overall security score dynamically based on active alerts and offline/rebooting sensors
  const calculateSecurityScore = () => {
    let score = 100;

    // Subtraction for active critical/high/medium threats
    const activeAlerts = alerts.filter(a => a.status === 'active');
    activeAlerts.forEach(alert => {
      if (alert.severity === 'critical') score -= 15;
      else if (alert.severity === 'high') score -= 8;
      else if (alert.severity === 'medium') score -= 4;
      else score -= 1;
    });

    // Subtraction for offline or rebooting core sensors
    const offlineSensorsCount = sensors.filter(s => s.status !== 'online').length;
    score -= (offlineSensorsCount * 5);

    return Math.max(10, Math.min(100, score));
  };

  const overallScore = calculateSecurityScore();

  // Helper logic to add custom logs
  const addLog = (message: string, source: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      message,
      source,
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Sensor Actions Real Handlers
  const triggerReboot = (id: string) => {
    const updated = sensors.map(s => {
      if (s.id === id) {
        addLog(`Power recycling sequence initiated on node "${s.name}".`, s.name, 'info');
        return { ...s, status: 'rebooting' as const, load: 0 };
      }
      return s;
    });
    setSensors(updated);
  };

  const togglePower = (id: string) => {
    const updated = sensors.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'online' ? 'offline' : 'online';
        if (nextStatus === 'offline') {
          addLog(`Sensor node isolated & killed: "${s.name}". Network redundancy lost.`, s.name, 'warning');
        } else {
          addLog(`Booting probe sensor node back to online cluster state: "${s.name}".`, s.name, 'success');
        }
        return { 
          ...s, 
          status: nextStatus as 'online' | 'offline', 
          load: nextStatus === 'online' ? Math.floor(Math.random() * 40) + 15 : 0 
        };
      }
      return s;
    });
    setSensors(updated);
  };

  const addSensor = (newDesc: Omit<Sensor, 'id' | 'status' | 'load' | 'lastActive'>) => {
    const newSensor: Sensor = {
      ...newDesc,
      id: `sensor-${Date.now()}`,
      status: 'online',
      load: Math.floor(Math.random() * 40) + 10,
      lastActive: 'Just registered'
    };
    setSensors(prev => [...prev, newSensor]);
    addLog(`New active sensor integrated into fleet mesh: "${newSensor.name}" at IP ${newSensor.ip}.`, 'Fleet Deployer', 'success');
  };

  // Alert Actions Real Handlers
  const mitigateAlert = (id: string) => {
    const alertItem = alerts.find(a => a.id === id);
    if (!alertItem) return;

    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'mitigated' as const } : a));
    addLog(`Automated firewall & traffic shielding deployed for: "${alertItem.title}". Trigger origin [${alertItem.source}] isolated.`, 'IDS Engine', 'success');
  };

  const dismissAlert = (id: string) => {
    const alertItem = alerts.find(a => a.id === id);
    if (!alertItem) return;

    setAlerts(prev => prev.filter(a => a.id !== id));
    addLog(`Incident record completely dismissed from active alert timeline: "${alertItem.title}".`, 'Admin Console', 'info');
  };

  const mitigateAll = () => {
    const activeCount = alerts.filter(a => a.status === 'active').length;
    if (activeCount === 0) return;

    setAlerts(prev => prev.map(a => ({ ...a, status: 'mitigated' as const })));
    addLog(`Bulk firewall shielding executed! Mitigated ${activeCount} active threat vectors. Cluster integrity restored.`, 'Global Shield Command', 'success');
  };

  // Background Simulations
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Gently flutters traffic metrics live to give real state animation feel!
      setTrafficMetrics(prev => {
        const randomFactor1 = (Math.random() - 0.5) * 0.15;
        const randomFactor2 = (Math.random() - 0.5) * 40;
        const randomFactor3 = (Math.random() - 0.5) * 0.005;

        return {
          inbound: Math.max(0.5, prev.inbound + randomFactor1),
          outbound: Math.max(100.0, prev.outbound + randomFactor2),
          latency: Math.max(0.001, prev.latency + randomFactor3)
        };
      });

      // 2. Random minor load changes for online sensors to manifest lively activity
      setSensors(prev => prev.map(s => {
        if (s.status === 'online') {
          const loadFluc = Math.floor(Math.random() * 7) - 3;
          return {
            ...s,
            load: Math.max(5, Math.min(99, s.load + loadFluc))
          };
        }
        return s;
      }));

    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Soft/forced reboots monitoring threads
  useEffect(() => {
    const interval = setInterval(() => {
      const rebootingSensors = sensors.filter(s => s.status === 'rebooting');
      if (rebootingSensors.length > 0) {
        // Randomly boot back a rebooting sensor after a few ticks
        const targets = rebootingSensors.map(s => s.id);
        const choice = targets[Math.floor(Math.random() * targets.length)];

        setSensors(prev => prev.map(s => {
          if (s.id === choice) {
            addLog(`Node cycle reboot completed. Firmware synchronization accepted. Node "${s.name}" is back online.`, s.name, 'success');
            return {
              ...s,
              status: 'online' as const,
              load: Math.floor(Math.random() * 30) + 20,
              lastActive: 'Just now'
            };
          }
          return s;
        }));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [sensors]);

  // Periodic simulated mock alerts inside background thread to make playground realistic
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to trigger a generic non-critical threat sweep warning every 45s
      if (Math.random() < 0.15) {
        const titles = [
          'Unusual API query volume',
          'Database replica lagging behind master cluster',
          'SSL Certificate nearing expiration bounds',
          'Repeated SSH ping responses detected',
          'Minor DNS resolution failure'
        ];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const severities = ['high', 'medium', 'low'] as const;
        const randomSeverity = severities[Math.floor(Math.random() * severities.length)];

        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          title: randomTitle,
          severity: randomSeverity,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
          source: 'System Heuristics Core',
          status: 'active',
          description: `An automated heuristic flag was raised regarding ${randomTitle.toLowerCase()}. This is listed under persistent monitoring for anomaly evaluation.`
        };

        setAlerts(prev => [newAlert, ...prev]);
        addLog(`System alarm: "${randomTitle}" flagged under [${randomSeverity.toUpperCase()}] security profile.`, 'Threat Analyzer core', 'warning');
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Quick automated alert instantiator for floating action button
  const quickTriggerAlertSimulation = () => {
    const titles = [
      'Anomalous TCP flood attempt',
      'Unauthorized SSH credential audit trail',
      'Infiltrated segment proxy mismatch',
      'Malicious payload download blocked',
      'Internal IP mapping scan detected'
    ];
    const sourceIps = ['198.51.100.12', '203.0.113.111', '192.0.2.74', '185.190.140.231'];
    
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomIp = sourceIps[Math.floor(Math.random() * sourceIps.length)];
    const randomSeverity = (['critical', 'high', 'medium'] as const)[Math.floor(Math.random() * 3)];

    const cyberAlert: Alert = {
      id: `alert-${Date.now()}`,
      title: randomTitle,
      severity: randomSeverity,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      source: randomIp,
      status: 'active',
      description: `A simulated cyber safety scenario has been initialized by administrator intervention. Origin telemetry: IP ${randomIp}. The intrusion prevention filter is actively capturing packet traces for quarantine.`
    };

    setAlerts(prev => [cyberAlert, ...prev]);
    addLog(`ADMIN TRIGGERED INCIDENT SCENARIO: "${randomTitle}" on IP origin [${randomIp}].`, 'Simulated Portal', 'error');
    setTab('alerts');
  };

  const activeAlertCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-background grid-bg pb-24 text-on-surface font-sans md:pb-6">
      {/* Dynamic top bar navigation */}
      <Header 
        currentTab={currentTab} 
        setTab={setTab} 
        activeAlertCount={activeAlertCount}
        overallScore={overallScore}
      />

      {/* Primary Responsive Workspace */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        
        {currentTab === 'dashboard' && (
          <DashboardView
            overallScore={overallScore}
            sensors={sensors}
            alerts={alerts}
            logs={logs}
            onTriggerReboot={triggerReboot}
            onMitigateAlert={mitigateAlert}
            onAddLog={addLog}
            setTab={setTab}
            trafficMetrics={trafficMetrics}
          />
        )}

        {currentTab === 'sensors' && (
          <SensorsView
            sensors={sensors}
            onTriggerReboot={triggerReboot}
            onTogglePower={togglePower}
            onAddSensor={addSensor}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            onMitigateAlert={mitigateAlert}
            onDismissAlert={dismissAlert}
            onMitigateAll={mitigateAll}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            sensors={sensors}
            onAddLog={addLog}
          />
        )}

      </main>

      {/* Floating Action Button - Inject dynamic alert threat scenario */}
      <div className="fixed bottom-24 right-6 z-50 md:bottom-8 md:right-8">
        <button
          onClick={quickTriggerAlertSimulation}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:shadow-primary/25 hover:bg-primary-container/85 hover:scale-105 active:scale-95 transition-all text-sm font-bold group"
          title="Inject Simulated System Cyber Threat (Scenario)"
        >
          {/* Pulsing red warning bubble underneath if alerts are active */}
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] text-white font-mono items-center justify-center">!</span>
            </span>
          )}
          <AlertTriangle className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Bottom Navigation tab-bar exclusively on smaller layouts */}
      <FooterMobile 
        currentTab={currentTab} 
        setTab={setTab} 
        activeAlertCount={activeAlertCount}
      />
    </div>
  );
}
