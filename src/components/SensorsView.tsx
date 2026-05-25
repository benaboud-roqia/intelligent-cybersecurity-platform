import React, { useState } from 'react';
import { 
  Radio, 
  Plus, 
  Search, 
  Power, 
  RefreshCw, 
  Sliders, 
  X, 
  TrendingUp, 
  Server, 
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { Sensor } from '../types';

interface SensorsViewProps {
  sensors: Sensor[];
  onTriggerReboot: (id: string) => void;
  onTogglePower: (id: string) => void;
  onAddSensor: (sensor: Omit<Sensor, 'id' | 'status' | 'load' | 'lastActive'>) => void;
}

export default function SensorsView({
  sensors,
  onTriggerReboot,
  onTogglePower,
  onAddSensor
}: SensorsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'gateway' | 'hub' | 'compute' | 'firewall'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'rebooting'>('all');
  const [isAdding, setIsAdding] = useState(false);
  
  // Custom new sensor form values
  const [newName, setNewName] = useState('');
  const [newIp, setNewIp] = useState('10.0.1.12');
  const [newLocation, setNewLocation] = useState('Paris DC 05');
  const [newType, setNewType] = useState<'gateway' | 'hub' | 'compute' | 'firewall'>('gateway');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newIp.trim() || !newLocation.trim()) return;
    
    onAddSensor({
      name: newName,
      ip: newIp,
      location: newLocation,
      type: newType
    });
    
    // reset
    setNewName('');
    setIsAdding(false);
  };

  const autofillIp = () => {
    const octet1 = [10, 192, 172][Math.floor(Math.random() * 3)];
    const octet2 = octet1 === 192 ? 168 : Math.floor(Math.random() * 254) + 1;
    const octet3 = Math.floor(Math.random() * 254) + 1;
    const octet4 = Math.floor(Math.random() * 254) + 1;
    setNewIp(`${octet1}.${octet2}.${octet3}.${octet4}`);
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sensor.ip.includes(searchTerm) ||
                          sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || sensor.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || sensor.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-display text-xs font-black text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            ACTIVE PROBE
          </span>
        );
      case 'rebooting':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-display text-xs font-black text-amber-800">
            <RefreshCw className="h-3 w-3 animate-spin" />
            RESTARTING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 font-display text-xs font-black text-rose-800">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            ISOLATED / DOWN
          </span>
        );
    }
  };

  const totalLoad = sensors.reduce((acc, current) => acc + (current.status === 'online' ? current.load : 0), 0);
  const averageLoad = sensors.length > 0 ? Math.round(totalLoad / sensors.filter(s => s.status === 'online').length) : 0;

  return (
    <div className="space-y-6">
      {/* Mini Stats Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-surface-container-lowest p-4 glass-panel flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Fleet Average Load</span>
            <span className="font-mono text-2xl font-black text-primary">{averageLoad}%</span>
          </div>
          <Cpu className="h-8 w-8 text-primary/30" />
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-4 glass-panel flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Discovered Nodes</span>
            <span className="font-mono text-2xl font-black text-secondary">{sensors.length} Nodes</span>
          </div>
          <Layers className="h-8 w-8 text-secondary/30" />
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-4 glass-panel flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Inactive Mesh Redundancy</span>
            <span className="font-mono text-2xl font-black text-emerald-600">Secure (Active)</span>
          </div>
          <Sparkles className="h-8 w-8 text-emerald-500/30" />
        </div>
      </div>

      {/* Control panel: search, filter controls, Add sensor trigger */}
      <div className="rounded-2xl bg-surface-container-lowest p-6 glass-panel space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-lg font-extrabold text-on-surface">Integrated Active Probes</h2>
            <p className="text-[11px] font-mono text-on-surface-variant/70 text-left">Deploy, test, and isolate individual sensor probes</p>
          </div>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-display text-xs font-extrabold text-white shadow-sm hover:opacity-90 transition-opacity self-start md:self-auto uppercase tracking-wide"
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isAdding ? 'Close Portal' : 'Integrate New Sensor'}
          </button>
        </div>

        {/* Add Sensor Portal Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
            <h3 className="font-display text-sm font-bold text-primary uppercase tracking-wider">Deploy Interactive Active Probe</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase">Sensor Probe Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. EU-West Core Sentry"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase flex justify-between items-center">
                  IP Netblock Address
                  <button type="button" onClick={autofillIp} className="text-primary hover:underline text-[9px] font-semibold uppercase">Generate Random</button>
                </label>
                <input 
                  type="text" 
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="e.g. 10.0.1.55"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase">Physical Location</label>
                <input 
                  type="text" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. London DC 2"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase">Functional Topology</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="gateway">Gateway (Broad Perimeter)</option>
                  <option value="hub">Regional Central Hub</option>
                  <option value="compute">Compute Cluster Daemon</option>
                  <option value="firewall">Static Packet Filter Shield</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold font-display">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-slate-700"
              >
                Dismiss Form
              </button>
              <button 
                type="submit" 
                className="rounded-lg bg-primary px-5 py-2 text-white"
              >
                Provision Live Node
              </button>
            </div>
          </form>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 py-2 md:flex-row md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by probe name, location, or IP range..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 border border-slate-100 rounded-lg p-1 bg-white">
              <span className="text-[9px] font-black text-on-surface-variant uppercase px-2">Type :</span>
              {(['all', 'gateway', 'hub', 'compute', 'firewall'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${
                    typeFilter === t
                      ? 'bg-slate-900 text-white'
                      : 'text-on-surface-variant hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border border-slate-100 rounded-lg p-1 bg-white">
              <span className="text-[9px] font-black text-on-surface-variant uppercase px-2">Status :</span>
              {(['all', 'online', 'offline', 'rebooting'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${
                    statusFilter === s
                      ? 'bg-slate-900 text-white'
                      : 'text-on-surface-variant hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSensors.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs font-mono text-on-surface-variant/60">
              No registered fleet probes align with filter properties.
            </div>
          ) : (
            filteredSensors.map(sensor => (
              <div 
                key={sensor.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all bg-white relative overflow-hidden ${
                  sensor.status === 'offline' 
                    ? 'border-rose-100 shadow-sm opacity-85' 
                    : sensor.status === 'rebooting'
                    ? 'border-amber-200 animate-pulse'
                    : 'border-slate-100 shadow-sm hover:border-primary/20'
                }`}
              >
                {/* Visual scan overlay for active sensors */}
                {sensor.status === 'online' && sensor.load > 65 && (
                  <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-error m-3 animate-ping"></div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-display text-sm font-extrabold text-on-surface">{sensor.name}</h3>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase font-semibold">
                        {sensor.type} Group
                      </span>
                    </div>
                    {getStatusBadge(sensor.status)}
                  </div>

                  <div className="space-y-2 border-y border-slate-50 py-3 mb-4 font-sans text-xs">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Network Point IP:</span>
                      <strong className="font-mono text-on-surface text-[11px] font-semibold">{sensor.ip}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Cluster Zone:</span>
                      <strong className="text-on-surface font-semibold">{sensor.location}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Discovered Check:</span>
                      <strong className="text-on-surface font-medium italic">{sensor.lastActive}</strong>
                    </div>
                  </div>

                  {/* Dynamic Load Progress */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                      <span>Probing Load Density</span>
                      <span className="font-semibold font-mono text-xs text-primary">
                        {sensor.status === 'online' ? `${sensor.load}%` : '0%'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 rounded-full ${
                          sensor.load > 70 
                            ? 'bg-error shadow-sm' 
                            : sensor.load > 45 
                            ? 'bg-amber-500' 
                            : 'bg-primary'
                        }`}
                        style={{ width: `${sensor.status === 'online' ? sensor.load : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Operations Actions bar */}
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                  <button 
                    onClick={() => onTogglePower(sensor.id)}
                    disabled={sensor.status === 'rebooting'}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-display text-[11px] font-bold border transition-colors ${
                      sensor.status === 'offline'
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                        : 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50'
                    } disabled:opacity-50`}
                  >
                    <Power className="h-3 w-3" />
                    {sensor.status === 'offline' ? 'BOOT SYSTEM' : 'ISOLATE / KILL'}
                  </button>

                  <button 
                    onClick={() => onTriggerReboot(sensor.id)}
                    disabled={sensor.status !== 'online'}
                    className="flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-display text-[11px] font-bold disabled:opacity-40"
                    title="Soft power cycle and check firmware sync"
                  >
                    <RefreshCw className="h-3 w-3" />
                    RECYCLE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
