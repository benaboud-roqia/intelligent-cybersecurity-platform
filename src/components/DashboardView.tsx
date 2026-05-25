import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  AlertTriangle, 
  Router, 
  Network, 
  Database,
  Search,
  Filter,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Sensor, Alert, LogEntry } from '../types';

interface DashboardViewProps {
  overallScore: number;
  sensors: Sensor[];
  alerts: Alert[];
  logs: LogEntry[];
  onTriggerReboot: (id: string) => void;
  onMitigateAlert: (id: string) => void;
  onAddLog: (message: string, source: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  setTab: (tab: 'dashboard' | 'sensors' | 'alerts' | 'reports') => void;
  trafficMetrics: { inbound: number; outbound: number; latency: number };
}

export default function DashboardView({
  overallScore,
  sensors,
  alerts,
  logs,
  onTriggerReboot,
  onMitigateAlert,
  onAddLog,
  setTab,
  trafficMetrics
}: DashboardViewProps) {
  const [graphMode, setGraphMode] = useState<'live' | 'history'>('live');
  const [logFilter, setLogFilter] = useState<'all' | 'success' | 'error' | 'info' | 'warning'>('all');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [customLogMsg, setCustomLogMsg] = useState('');
  const [customLogSrc, setCustomLogSrc] = useState('Admin Console');
  const [customLogType, setCustomLogType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [showLogCreator, setShowLogCreator] = useState(false);

  // Generate SVG path coordinate strings that animate slightly over time
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    if (graphMode === 'live') {
      const timer = setInterval(() => {
        setWaveOffset(prev => (prev + 1) % 100);
      }, 500);
      return () => clearInterval(timer);
    }
  }, [graphMode]);

  // Dynamic SVG path for the wave based on waveOffset
  const getDynamicPath = () => {
    const points = [];
    const step = 100;
    const peakFreq = 0.04;
    const animateMultiplier = Math.sin(waveOffset * 0.1) * 8;
    
    for (let x = 0; x <= 1000; x += step) {
      // Create a nice sine wave sequence combined with natural jitter
      const baselineY = 160;
      const wave1 = Math.sin(x * peakFreq + waveOffset * 0.12) * 50;
      const wave2 = Math.cos(x * 0.015 - waveOffset * 0.07) * 25;
      const jitter = Math.sin(x * 0.1 + waveOffset * 0.2) * (graphMode === 'live' ? 4 : 0);
      const y = baselineY + wave1 + wave2 + jitter + animateMultiplier;
      points.push(`${x} ${Math.min(270, Math.max(30, y))}`);
    }

    return {
      fillPath: `M 0 300 L 0 240 ${points.map((p, idx) => `L ${p}`).join(' ')} L 1000 300 Z`,
      strokePath: `M 0 240 ${points.map((p, idx) => `L ${p}`).join(' ')}`
    };
  };

  const wavePaths = getDynamicPath();

  // Filter logs based on type
  const filteredLogs = logs.filter(l => {
    if (logFilter === 'all') return true;
    return l.type === logFilter;
  });

  const activeSensorsCount = sensors.filter(s => s.status === 'online').length;
  const totalSensorsCount = sensors.length;

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLogMsg.trim()) return;
    onAddLog(customLogMsg.trim(), customLogSrc, customLogType);
    setCustomLogMsg('');
    setShowLogCreator(false);
  };

  const getLogTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'error': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'gateway': return <Router className="h-5 w-5 text-primary" />;
      case 'hub': return <Network className="h-5 w-5 text-secondary" />;
      default: return <Database className="h-5 w-5 text-tertiary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Status Cards: Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Security Score Widget */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 glass-panel md:col-span-4 flex flex-col justify-between">
          {/* Animated Scanner Scanline */}
          <div className="scanline top-0 left-0 animate-scan pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                Overall Security Score
              </h2>
              <p className="text-[11px] font-mono text-on-surface-variant/70 mt-0.5">IDS Auto-Heuristic</p>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          {/* Radial progress ring */}
          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="h-44 w-44 -rotate-90">
                {/* Background Ring */}
                <circle
                  className="text-slate-100"
                  cx="88"
                  cy="88"
                  fill="transparent"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                {/* Dynamic Glowing Progress */}
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  cx="88"
                  cy="88"
                  fill="transparent"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="490"
                  strokeDashoffset={490 - (490 * overallScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-5xl font-black text-on-surface tracking-tight">
                  {overallScore}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-black tracking-wider text-white uppercase ${
                  overallScore >= 90 ? 'bg-primary' : overallScore >= 75 ? 'bg-amber-600' : 'bg-error'
                }`}>
                  {overallScore >= 90 ? 'OPTIMAL' : overallScore >= 75 ? 'WARNING' : 'COMPROMISED'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <p className="font-sans text-xs text-on-surface-variant">
              Active network defenses are performing <strong className="text-primary font-semibold">12% above</strong> the quarterly regulatory baseline.
            </p>
          </div>
        </div>

        {/* Real-time Traffic Graph */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel md:col-span-8 flex flex-col justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2 text-secondary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-on-surface">
                  Network Traffic Analyzer
                </h2>
                <p className="text-[11px] font-mono text-on-surface-variant/70">Packet inspection latency loop</p>
              </div>
            </div>
            
            <div className="flex gap-1.5 self-start sm:self-auto">
              <button
                onClick={() => setGraphMode('live')}
                className={`rounded-lg px-3 py-1 font-display text-xs font-bold transition-all ${
                  graphMode === 'live'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-on-surface-variant hover:bg-slate-200'
                }`}
              >
                Live Stream
              </button>
              <button
                onClick={() => setGraphMode('history')}
                className={`rounded-lg px-3 py-1 font-display text-xs font-bold transition-all ${
                  graphMode === 'history'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-on-surface-variant hover:bg-slate-200'
                }`}
              >
                24h History
              </button>
            </div>
          </div>

          {/* Graph visual area */}
          <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-950/20 shadow-inner">
            {/* Grid background lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 opacity-15">
              <div className="border-t border-white w-full h-px"></div>
              <div className="border-t border-white w-full h-px"></div>
              <div className="border-t border-white w-full h-px"></div>
              <div className="border-t border-white w-full h-px"></div>
              <div className="border-t border-white w-full h-px"></div>
            </div>

            {/* SVG Plot */}
            <svg className="absolute inset-0 h-full w-full opacity-90" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="trafficGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#00677c" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#5d3fe0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path 
                className="transition-all duration-300"
                d={wavePaths.fillPath} 
                fill="url(#trafficGradient)" 
              />
              {/* Stroke */}
              <path 
                className="transition-all duration-300"
                d={wavePaths.strokePath} 
                fill="none" 
                stroke="#4dc8e8" 
                strokeWidth="2.5" 
              />

              {/* Glowing anchor dots */}
              {graphMode === 'live' && (
                <>
                  <circle cx="300" cy="180" r="5" fill="#4dc8e8" className="animate-ping" />
                  <circle cx="300" cy="180" r="3.5" fill="#00677c" />

                  <circle cx="700" cy="100" r="5" fill="#c9bfff" className="animate-ping" />
                  <circle cx="700" cy="100" r="3.5" fill="#5d3fe0" />
                </>
              )}
            </svg>

            {/* Micro scan bar overlay */}
            {graphMode === 'live' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 animate-pulse bg-primary-container/30 border-r border-primary/20 pointer-events-none" style={{
                animation: 'pulse 1.5s infinite ease-in-out'
              }}></div>
            )}

            <span className="absolute bottom-3 left-4 rounded-md bg-slate-800/80 px-2 py-0.5 font-mono text-[9px] tracking-widest text-[#4dc8e8] border border-slate-700/50 uppercase">
              {graphMode === 'live' ? 'AUTO-MONITOR ACTIVE' : 'ARCHIVED ROLLING BASELINE'}
            </span>
            <span className="absolute top-3 right-4 font-mono text-[10px] text-slate-400">
              {graphMode === 'live' ? 'Telemetry ticks: 1s' : 'Logs offset: static'}
            </span>
          </div>

          {/* Analytics Stats bar */}
          <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl border border-primary/5 bg-slate-50 p-4">
            <div className="flex flex-col">
              <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Inbound Stream
              </span>
              <span className="font-mono text-base font-bold text-primary">
                {trafficMetrics.inbound.toFixed(2)} GB/s
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Outbound Stream
              </span>
              <span className="font-mono text-base font-bold text-secondary">
                {trafficMetrics.outbound.toFixed(1)} MB/s
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Latent Packets
              </span>
              <span className={`font-mono text-base font-bold ${trafficMetrics.latency > 0.05 ? 'text-error' : 'text-emerald-600'}`}>
                {trafficMetrics.latency.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensors Overview \& Live Log Stream */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Sensors panel */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-extrabold text-on-surface">
                Fleet Status Overview
              </h2>
              <p className="text-[11px] font-mono text-on-surface-variant/70">Online network node probes</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
              {activeSensorsCount} ONLINE / {totalSensorsCount - activeSensorsCount} OFFLINE
            </span>
          </div>

          <div className="space-y-3">
            {/* Take only first 3 sensors to match exact user screen dashboard design constraint */}
            {sensors.slice(0, 3).map((sensor) => (
              <div 
                key={sensor.id}
                onClick={() => setSelectedSensor(selectedSensor?.id === sensor.id ? null : sensor)}
                className={`group flex flex-col gap-3 rounded-xl border p-4 transition-all hover:bg-slate-50 cursor-pointer ${
                  selectedSensor?.id === sensor.id 
                    ? 'bg-slate-50 border-primary/40 shadow-sm'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left Column: Icon \& Info */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/5 p-2 transition-transform group-hover:scale-105">
                      {getSensorIcon(sensor.type)}
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-on-surface flex items-center gap-2">
                        {sensor.name}
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                          sensor.status === 'online' ? 'bg-primary' : sensor.status === 'rebooting' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'
                        }`}></span>
                      </h3>
                      <p className="font-mono text-[11px] text-on-surface-variant/80">
                        IP: {sensor.ip} • DC: <span className="font-medium">{sensor.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Mini gauge indicator */}
                  <div className="flex items-center gap-4 self-start sm:self-auto">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              sensor.load > 70 ? 'bg-error' : sensor.load > 40 ? 'bg-amber-500' : 'bg-primary'
                            }`}
                            style={{ width: `${sensor.status === 'online' ? sensor.load : 0}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-on-surface-variant min-w-[28px] text-right">
                          {sensor.status === 'online' ? `${sensor.load}%` : '0%'}
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/70 italic uppercase tracking-wider">
                        Probe Load Density
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded details click action */}
                {selectedSensor?.id === sensor.id && (
                  <div className="mt-2 border-t border-slate-100 pt-3 flex flex-wrap gap-2 items-center justify-between text-xs bg-primary/5 -mx-4 -mb-4 p-4 rounded-b-xl">
                    <div className="text-on-surface-variant">
                      Status: <span className="font-mono font-bold uppercase tracking-wider text-primary">{sensor.status}</span> • Logged: <span className="font-medium text-on-surface">{sensor.lastActive}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerReboot(sensor.id);
                        }}
                        disabled={sensor.status === 'rebooting'}
                        className="rounded bg-primary px-2.5 py-1 font-display text-[11px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {sensor.status === 'rebooting' ? 'REBOOTING...' : 'FORCE REBOOT'}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTab('sensors');
                        }}
                        className="rounded border border-primary/20 bg-white px-2.5 py-1 font-display text-[11px] font-bold text-primary hover:bg-slate-100"
                      >
                        MANAGE FLEET
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setTab('sensors')}
              className="font-display text-xs font-bold text-primary hover:underline hover:text-primary-container p-1"
            >
              Configure all {totalSensorsCount} registered system probes →
            </button>
          </div>
        </div>

        {/* Live Logs Stream with left accent border to duplicate source screenshot exactly */}
        <div className="rounded-2xl border-l-4 border-primary bg-surface-container-lowest p-6 glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-extrabold text-on-surface">
                  Active Log Stream
                </h2>
                <p className="text-[11px] font-mono text-on-surface-variant/70">Audit security logs ledger</p>
              </div>

              <div className="flex items-center gap-1">
                {/* Plus circle to create simulated logs and demonstrate fidelity */}
                <button 
                  onClick={() => setShowLogCreator(!showLogCreator)}
                  className="rounded-full hover:bg-slate-100 p-1 bg-white border border-slate-200 text-slate-600 transition-colors"
                  title="Inject Audit Log Entry"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Custom Log Injector Form */}
            {showLogCreator && (
              <form onSubmit={handleQuickLogSubmit} className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2.5">
                <div className="text-xs font-bold text-primary uppercase tracking-wider">Quick Log Injection</div>
                
                <input 
                  type="text" 
                  value={customLogMsg}
                  onChange={(e) => setCustomLogMsg(e.target.value)}
                  placeholder="Log message..." 
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />

                <div className="flex gap-2 justify-between">
                  <select 
                    value={customLogType} 
                    onChange={(e) => setCustomLogType(e.target.value as any)}
                    className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] focus:outline-none"
                  >
                    <option value="info">INFO TYPE</option>
                    <option value="success">SUCCESS TYPE</option>
                    <option value="warning">WARN TYPE</option>
                    <option value="error">ERROR TYPE</option>
                  </select>

                  <div className="flex gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => setShowLogCreator(false)}
                      className="rounded bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 font-display"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="rounded bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white font-display"
                    >
                      Inject Now
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Filter tags panel */}
            <div className="flex flex-wrap gap-1.5 mb-4 border-b border-slate-100 pb-3">
              {(['all', 'success', 'error', 'info', 'warning'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-all tracking-wide ${
                    logFilter === f 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-on-surface-variant hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Logs' : f}
                </button>
              ))}
            </div>

            {/* Log Stream Timeline list */}
            <div className="space-y-4 relative py-1">
              {/* Connecting line pattern inside log stream to reflect source image dashboard exactly */}
              <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-100"></div>

              {filteredLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-on-surface-variant/60 font-mono">
                  No matching log events recorded.
                </div>
              ) : (
                filteredLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="relative pl-8 transition-transform hover:translate-x-0.5">
                    {/* Circle bullet nodes */}
                    <div className={`absolute left-[9px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${
                      log.type === 'error' ? 'bg-rose-500 shadow-sm' :
                      log.type === 'success' ? 'bg-primary' :
                      log.type === 'warning' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></div>

                    <div className="flex flex-col gap-0.5 text-xs">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="font-mono text-[10px] font-semibold text-on-surface-variant">
                          {log.time}
                        </span>
                        <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold uppercase">
                          {log.source.split(' ')[0]}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-on-surface/90 leading-relaxed font-medium">
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => setTab('reports')}
            className="w-full mt-4 py-2 border border-outline text-on-surface-variant rounded-lg font-mono text-xs hover:bg-slate-50 transition-all font-bold tracking-wider"
          >
            VIEW FULL AUDIT HISTORY
          </button>
        </div>
      </div>
    </div>
  );
}
