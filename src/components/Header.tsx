import { Shield, Radio, Bell, FileText, CheckCircle2 } from 'lucide-react';
import { TabKey } from '../types';

interface HeaderProps {
  currentTab: TabKey;
  setTab: (tab: TabKey) => void;
  activeAlertCount: number;
  overallScore: number;
}

export default function Header({ currentTab, setTab, activeAlertCount, overallScore }: HeaderProps) {
  // Determine if overall network is stable or compromised
  const isHealthy = overallScore > 80;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-surface-container-high/70 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand logo */}
        <div 
          onClick={() => setTab('dashboard')} 
          className="flex cursor-pointer items-center gap-3 transition-opacity active:opacity-85"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-6 w-6 stroke-[2]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isHealthy ? 'bg-primary' : 'bg-error'}`}></span>
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isHealthy ? 'bg-primary' : 'bg-error'}`}></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-extrabold tracking-tight text-primary">CyberGuardian</h1>
              <span className="hidden rounded-md bg-secondary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-secondary uppercase md:inline-block">
                v2.4
              </span>
            </div>
            <p className="hidden font-mono text-[9px] tracking-widest text-on-surface-variant/70 uppercase md:block">
              Network Threat Shield IP-6
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-semibold transition-all duration-150 ${
              currentTab === 'dashboard'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface'
            }`}
          >
            <Shield className="h-4 w-4" />
            Dashboard
          </button>
          
          <button
            onClick={() => setTab('sensors')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-semibold transition-all duration-150 ${
              currentTab === 'sensors'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface'
            }`}
          >
            <Radio className="h-4 w-4" />
            Sensors
          </button>

          <button
            onClick={() => setTab('alerts')}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-semibold transition-all duration-150 ${
              currentTab === 'alerts'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface'
            }`}
          >
            <Bell className="h-4 w-4" />
            Alerts
            {activeAlertCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white shadow-sm">
                {activeAlertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('reports')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-semibold transition-all duration-150 ${
              currentTab === 'reports'
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface'
            }`}
          >
            <FileText className="h-4 w-4" />
            Reports
          </button>
        </nav>

        {/* System Secure indicator \& Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-primary animate-pulse-slow' : 'bg-error animate-pulse'}`}></span>
            <span className="font-display text-xs font-bold tracking-wider text-primary uppercase">
              {isHealthy ? 'SYSTEM SECURE' : 'THREAT ACTIVE'}
            </span>
          </div>

          <div 
            onClick={() => setTab('reports')} 
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-200 border border-slate-300 shadow-sm transition-transform hover:scale-105 active:scale-95"
            title="Administrator Profile"
          >
            <span className="font-display text-xs font-bold text-primary">ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
}
