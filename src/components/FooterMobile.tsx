import { Shield, Radio, Bell, FileText } from 'lucide-react';
import { TabKey } from '../types';

interface FooterMobileProps {
  currentTab: TabKey;
  setTab: (tab: TabKey) => void;
  activeAlertCount: number;
}

export default function FooterMobile({ currentTab, setTab, activeAlertCount }: FooterMobileProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-surface-container-lowest/80 py-2.5 backdrop-blur-xl md:hidden">
      <div className="flex justify-around items-center px-4">
        {/* Dashboard */}
        <button
          onClick={() => setTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
            currentTab === 'dashboard'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <div className={`rounded-xl px-4 py-1 flex items-center justify-center transition-all ${
            currentTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
          }`}>
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-display text-[11px] font-bold">Dashboard</span>
        </button>

        {/* Sensors */}
        <button
          onClick={() => setTab('sensors')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
            currentTab === 'sensors'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <div className={`rounded-xl px-4 py-1 flex items-center justify-center transition-all ${
            currentTab === 'sensors' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
          }`}>
            <Radio className="h-5 w-5" />
          </div>
          <span className="font-display text-[11px] font-bold">Sensors</span>
        </button>

        {/* Alerts */}
        <button
          onClick={() => setTab('alerts')}
          className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
            currentTab === 'alerts'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <div className={`rounded-xl px-4 py-1 flex items-center justify-center transition-all ${
            currentTab === 'alerts' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
          }`}>
            <Bell className="h-5 w-5" />
            {activeAlertCount > 0 && (
              <span className="absolute top-0 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-white shadow-sm animate-bounce">
                {activeAlertCount}
              </span>
            )}
          </div>
          <span className="font-display text-[11px] font-bold">Alerts</span>
        </button>

        {/* Reports */}
        <button
          onClick={() => setTab('reports')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
            currentTab === 'reports'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <div className={`rounded-xl px-4 py-1 flex items-center justify-center transition-all ${
            currentTab === 'reports' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
          }`}>
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-display text-[11px] font-bold">Reports</span>
        </button>
      </div>
    </nav>
  );
}
