import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2, 
  Filter, 
  Terminal, 
  ChevronRight, 
  Activity,
  UserX,
  Search,
  Check
} from 'lucide-react';
import { Alert } from '../types';

interface AlertsViewProps {
  alerts: Alert[];
  onMitigateAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
  onMitigateAll: () => void;
}

export default function AlertsView({
  alerts,
  onMitigateAlert,
  onDismissAlert,
  onMitigateAll
}: AlertsViewProps) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'mitigated'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700 font-extrabold';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-700 font-bold';
      case 'medium':
        return 'bg-amber-50 border-amber-200 text-amber-700 font-semibold';
      default:
        return 'bg-sky-50 border-sky-100 text-sky-700';
    }
  };

  const getSeverityPointColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-sky-500';
    }
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Alert Header Summary & Mitigate All action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-surface-container-lowest p-6 glass-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-on-surface">Emergency Response Command Panel</h2>
            <p className="text-[11px] font-mono text-on-surface-variant/70 text-left">
              Real-time heuristic threat queue • <strong className="text-rose-600 font-bold">{activeAlertsCount} threats active</strong>
            </p>
          </div>
        </div>

        {activeAlertsCount > 0 && (
          <button
            onClick={onMitigateAll}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 font-display text-xs font-bold text-white shadow-sm transition-colors uppercase tracking-wider"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            Mitigate All Intercepts
          </button>
        )}
      </div>

      {/* Main Alert center splitting into list + details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Threat Queue list */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter alert logs by keywords..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-between">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-1">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase px-2">Severity:</span>
                  {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`rounded px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all ${
                        severityFilter === sev
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-1">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase px-2">Status:</span>
                  {(['all', 'active', 'mitigated'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`rounded px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all ${
                        statusFilter === st
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render items */}
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-on-surface-variant/60">
                  No alerts listed in the active perimeter timeline.
                </div>
              ) : (
                filteredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`group flex items-start gap-4 rounded-xl border p-4 transition-all hover:bg-slate-50 cursor-pointer ${
                      selectedAlert?.id === alert.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm'
                        : alert.status === 'mitigated'
                        ? 'border-slate-100 opacity-60 bg-slate-50/55'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    {/* Bullet type with dynamic pulse */}
                    <div className="mt-1 flex-shrink-0">
                      <span className="relative flex h-3.5 w-3.5">
                        {alert.status === 'active' && (
                          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${getSeverityPointColor(alert.severity)}`}></span>
                        )}
                        <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${getSeverityPointColor(alert.severity)}`}></span>
                      </span>
                    </div>

                    <div className="flex-grow space-y-1.5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span className={`rounded-full border px-2 py-0.5 font-display text-[9px] uppercase tracking-wider ${getSeverityStyles(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {alert.timestamp}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {alert.title}
                          {alert.status === 'mitigated' && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                        </h3>
                        <p className="font-mono text-[11px] text-slate-500 font-medium">
                          Source Segment: <span className="text-secondary font-mono font-semibold">{alert.source}</span>
                        </p>
                      </div>

                      <p className="font-sans text-xs text-on-surface-variant font-normal line-clamp-1">
                        {alert.description}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 self-center group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Alert triage workspace */}
        <div className="lg:col-span-5">
          {selectedAlert ? (
            <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel border border-primary/10 shadow-sm space-y-5 sticky top-24">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-display text-base font-extrabold text-on-surface leading-tight">
                    {selectedAlert.title}
                  </h3>
                  <p className="font-mono text-[10px] text-slate-400 mt-1">
                    Threat vector ID: {selectedAlert.id}
                  </p>
                </div>

                <span className={`rounded-xl border px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${getSeverityStyles(selectedAlert.severity)}`}>
                  {selectedAlert.severity}
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="rounded-lg bg-slate-50 p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Incident Source:</span>
                    <strong className="font-mono text-on-surface font-semibold text-[11px]">{selectedAlert.source}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Telemetry Trigger:</span>
                    <strong className="font-mono text-on-surface text-[11px]">{selectedAlert.timestamp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Perimeter Status:</span>
                    <strong className={`uppercase font-bold tracking-wider font-display ${selectedAlert.status === 'active' ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {selectedAlert.status}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Diagnostic Analysis Narrative</span>
                  <p className="text-xs text-on-surface leading-normal bg-white p-3 border border-slate-50 rounded-lg">
                    {selectedAlert.description}
                  </p>
                </div>
              </div>

              {/* Action Operations */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedAlert.status === 'active' ? (
                  <>
                    <button
                      onClick={() => {
                        onMitigateAlert(selectedAlert.id);
                        // refresh selectedAlert state locally
                        setSelectedAlert(prev => prev ? { ...prev, status: 'mitigated' } : null);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-90 py-2.5 font-display text-xs font-extrabold text-white shadow-sm uppercase tracking-wider transition-colors"
                    >
                      <ShieldCheck className="h-4.5 w-4.5" />
                      AUTOSHIELD TARGET (MITIGATE)
                    </button>

                    <button
                      onClick={() => {
                        onDismissAlert(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-rose-100 hover:bg-rose-50 py-2 text-xs font-bold text-rose-600 font-display transition-colors"
                    >
                      <UserX className="h-4 w-4" />
                      DISMISS INCIDENT FROM QUEUE
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex flex-col items-center gap-2 text-center text-emerald-800">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                    <span className="font-display text-xs font-extrabold uppercase tracking-wide">Threat Vector Mitigated</span>
                    <p className="text-[11px] leading-relaxed">
                      This incident is cataloged as resolved. Firewall policy rules are updated, and scanning frequency is increased on affected local channels.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center space-y-3 sticky top-24">
              <Terminal className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="font-display text-sm font-bold text-on-surface">No Alert Selected</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Click on any active thread alert in the Emergency Monitor panel to run full diagnosis diagnostics, configure port filters, or deploy immediate automated mitigations.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Cyber Incident advice */}
      <div className="rounded-2xl border border-primary/5 bg-slate-50 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="space-y-1 flex-grow">
          <span className="text-[9px] font-black text-primary px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 uppercase tracking-widest">PERIMETER SAFEGUARDING</span>
          <h3 className="font-display text-sm font-bold text-on-surface pt-1">Active Automated IDS (Intrusion Detection System) Guard</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The CyberGuardian heuristic engine actively scans for packet drift, brute SSH attempts, and known exploits. When a threat triggers, the score drops. Resolve threats to restore optimal system capabilities.
          </p>
        </div>
        <div className="h-12 w-px bg-slate-200 hidden sm:block mx-4"></div>
        <div className="font-mono text-[10px] text-slate-500 self-start sm:self-center">
          Active system rules: <strong>249 rules</strong> • Threat library updated: <strong>Now</strong>
        </div>
      </div>
    </div>
  );
}
