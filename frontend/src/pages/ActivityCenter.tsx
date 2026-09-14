import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Trash2, 
  Filter, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  Cpu,
  Lock
} from 'lucide-react';
import { ActivityEvent } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const ActivityCenter: React.FC = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getActivity(50);
      setEvents(res.data);
    } catch (err) {
      console.warn('Activity fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClear = async () => {
    if (confirm("Clear local guardian activity logs?")) {
      await api.clearActivity();
      setEvents([]);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.details && e.details.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Audit Trail & Telemetry Logs
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Activity Center
          </h1>
          <p className="text-xs text-slate-400">
            Local audit trail of all AI orchestrations, scam scans, privacy redactions, and benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="btn-ghost text-xs px-3 py-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 glass-panel flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action logs..."
            className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SECURITY', 'PRIVACY', 'DOCUMENT', 'VOICE', 'ASSISTANT', 'PERFORMANCE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 font-mono uppercase text-slate-400 text-[10px]">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Runtime</th>
                <th className="py-3 px-4">Privacy Level</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(ev.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{ev.action}</div>
                      {ev.details && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ev.details}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-white/5 text-slate-300 border border-white/10">
                        {ev.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        runtime={ev.runtime} 
                        executionProvider={ev.execution_provider} 
                        hardware="cpu" 
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <Lock className="w-3 h-3" />
                        <span>{ev.privacy_level}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No activity logs found for current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
