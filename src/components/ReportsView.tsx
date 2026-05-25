import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Download, 
  AlertOctagon, 
  ShieldCheck, 
  RefreshCw,
  Cpu,
  Smartphone,
  Eye,
  FileCheck
} from 'lucide-react';
import { Sensor } from '../types';

interface ReportsViewProps {
  sensors: Sensor[];
  onAddLog: (message: string, source: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function ReportsView({ sensors, onAddLog }: ReportsViewProps) {
  const [selectedSensorId, setSelectedSensorId] = useState('all');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [completedScansCount, setCompletedScansCount] = useState(3);
  
  // Scans history data
  const [scanHistory, setScanHistory] = useState([
    {
      id: 'scan-x3',
      date: '2026-05-25 18:22 UTC',
      target: 'All Registered Fleet Probes',
      result: 'No critical malware or leaks detected',
      vulnerabilities: 0,
      score: '94/100',
      status: 'Passed'
    },
    {
      id: 'scan-x2',
      date: '2026-05-25 15:10 UTC',
      target: 'Primary Gateway Alpha',
      result: 'Automatic firmware updates successfully signed',
      vulnerabilities: 1,
      score: '91/100',
      status: 'Patched'
    },
    {
      id: 'scan-x1',
      date: '2026-05-24 10:30 UTC',
      target: 'Compute Cluster Gamma',
      result: 'Memory leakage detected on Local Cluster',
      vulnerabilities: 3,
      score: '84/100',
      status: 'Mitigated'
    }
  ]);

  const targetLabel = selectedSensorId === 'all' 
    ? 'All Registered Fleet Probes' 
    : (sensors.find(s => s.id === selectedSensorId)?.name || 'Specified node');

  // Multi-step scanning simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScanning) {
      if (scanProgress < 100) {
        timer = setTimeout(() => {
          const nextProgress = scanProgress + 10;
          setScanProgress(nextProgress);
          
          // Phase commentary
          if (nextProgress === 10) {
            setScanStage('Initializing diagnostic routines...');
            setScanLogs(prev => [...prev, '✓ Loaded CyberGuardian heuristic rules core.']);
          } else if (nextProgress === 30) {
            setScanStage(`Resolving network routing coordinates for ${targetLabel}...`);
            setScanLogs(prev => [...prev, `→ Mapping endpoint addresses for target zone.`]);
          } else if (nextProgress === 50) {
            setScanStage('Searching port bounds (SSH, HTTP, SSL)...');
            setScanLogs(prev => [...prev, `✓ Port check: Port 22 (SSH) secure.`, `✓ Port check: Port 443 (SSL) cryptographically verified.`]);
          } else if (nextProgress === 70) {
            setScanStage('Auditing system daemon integrity & checking firmware sync...');
            setScanLogs(prev => [...prev, `→ Inspecting stack memory registers. Integrity checksum looks stable.`]);
          } else if (nextProgress === 90) {
            setScanStage('Analyzing log anomalies & brute force block tables...');
            setScanLogs(prev => [...prev, '✓ Firewall check: IP blacklist properly mounted.']);
          } else if (nextProgress === 100) {
            setScanStage('Heuristics completed. All secure.');
            setScanLogs(prev => [...prev, '✓ Final system health index validated: 100% stable.']);
          }
        }, 350);
      } else {
        setIsScanning(false);
        setCompletedScansCount(prev => prev + 1);
        
        // Append scan to history
        const newRecord = {
          id: `scan-${Math.floor(Math.random() * 9000) + 1000}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
          target: targetLabel,
          result: 'Heuristics verified and blacklists synced',
          vulnerabilities: 0,
          score: '96/100',
          status: 'Passed'
        };
        
        setScanHistory(prev => [newRecord, ...prev]);
        onAddLog(`Manual vulnerability probe completed successfully on "${targetLabel}".`, 'Diagnostic Scanner', 'success');
      }
    }
    return () => clearTimeout(timer);
  }, [isScanning, scanProgress, selectedSensorId]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStage('Contacting network probes...');
    setScanLogs(['Initializing secure probe envelope...', `Target: ${targetLabel}`]);
  };

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const simulateDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`[Simulation] Cybersecurity report ${id} downloaded successfully to local storage as decrypted CSV.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Interactive Area: Diagnostic Scanner */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Core scan controller and parameters */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel lg:col-span-1 space-y-4">
          <div>
            <h2 className="font-display text-base font-extrabold text-on-surface">System Diagnostic Scan</h2>
            <p className="text-[11px] font-mono text-on-surface-variant/70 text-left">Deploy complete vulnerability analysis over endpoints</p>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-on-surface-variant uppercase">Select Node Target</label>
              <select
                disabled={isScanning}
                value={selectedSensorId}
                onChange={(e) => setSelectedSensorId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="all">Check Entire Fleet Mesh (All)</option>
                {sensors.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.ip})</option>
                ))}
              </select>
            </div>

            <button
              disabled={isScanning}
              onClick={handleStartScan}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:opacity-90 py-2.5 font-display text-xs font-extrabold text-white shadow-sm uppercase tracking-wider transition-opacity disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  ANALYSIS RUNNING ({scanProgress}%)...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white text-white" />
                  Run Full Vulnerability Probe
                </>
              )}
            </button>
          </div>

          {/* Real-time Loading Progress wheel representation */}
          {isScanning && (
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                <span>Scanner progress</span>
                <span className="font-mono text-xs">{scanProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <div className="font-mono text-[10px] text-primary italic font-semibold pt-1">
                ⇒ {scanStage}
              </div>
            </div>
          )}
        </div>

        {/* Real-time scanner Shell telemetry terminal */}
        <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary-container" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">Heuristics Shell Output</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            </div>

            <div className="font-mono text-xs space-y-2 h-44 overflow-y-auto font-medium">
              {scanLogs.length === 0 ? (
                <div className="text-slate-500 text-center py-10 italic">
                  CyberGuardian scanning terminal. Configure a node and select "Run Full Vulnerability Probe" to inspect the audit log stream.
                </div>
              ) : (
                scanLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap">
                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-right border-t border-white/5 pt-2">
            Completed: {completedScansCount} total scan cycles
          </div>
        </div>

      </div>

      {/* Scans History Ledger List */}
      <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="font-display text-lg font-extrabold text-on-surface">Historical Diagnostic Reports Ledgers</h2>
            <p className="text-[11px] font-mono text-on-surface-variant/70 text-left">Previous scans and verified compliance indexes</p>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3 py-1 text-emerald-800 border border-emerald-100 flex items-center gap-1.5 text-xs font-bold font-display">
            <FileCheck className="h-4 w-4 text-primary" />
            ISO 27001 Regulatory Verified
          </div>
        </div>

        {/* Audit reports table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-on-surface-variant uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Checked Boundary Target</th>
                <th className="py-3 px-4 text-center">Security Score</th>
                <th className="py-3 px-4">Verification Health</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scanHistory.map((history) => (
                <tr key={history.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{history.id}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{history.date}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-on-surface">{history.target}</div>
                    <div className="text-[10px] text-on-surface-variant/70">{history.result}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-bold text-on-surface">
                      {history.score}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block font-display text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      history.status === 'Passed' ? 'bg-emerald-50 text-emerald-800' :
                      history.status === 'Patched' ? 'bg-indigo-50 text-indigo-800' :
                      'bg-amber-50 text-amber-800'
                    }`}>
                      {history.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => simulateDownload(history.id)}
                      disabled={downloadingId === history.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs text-slate-700 font-semibold font-display disabled:opacity-40"
                    >
                      {downloadingId === history.id ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />
                          saving...
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5 text-slate-500" />
                          Download Decrypted CSV
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
