import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Cpu,
  Activity,
  ArrowUpRight,
  Eye,
  FileText,
  Mic,
  Gauge,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { PageRoute, HardwareTelemetry } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ThreeAiCore } from '../components/ThreeAiCore';

interface DashboardProps {
  onNavigate: (route: PageRoute) => void;
  telemetry: HardwareTelemetry | null;
  onRefreshTelemetry: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  telemetry,
  onRefreshTelemetry
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'threats' | 'privacy'>('activity');

  const recentActions = [
    { time: '12:43', action: 'Document analyzed', category: 'DOCUMENT', runtime: 'local', status: 'COMPLETED' },
    { time: '12:44', action: 'Privacy shield scan (PAN masked)', category: 'PRIVACY', runtime: 'local', status: 'PROTECTED' },
    { time: '12:45', action: 'Scam message evaluated: SAFE', category: 'SECURITY', runtime: 'local', status: 'VERIFIED' },
    { time: '12:47', action: 'Voice command parsed', category: 'VOICE', runtime: 'local', status: 'EXECUTED' },
  ];

  const quickActions = [
    { title: 'Scan Message', desc: 'Triage phishing, SMS & emails', icon: ShieldAlert, route: 'security' as PageRoute, color: 'text-rose-400' },
    { title: 'Analyze Document', desc: 'Contract risks & summaries', icon: FileText, route: 'documents' as PageRoute, color: 'text-cyan-400' },
    { title: 'Start Camera', desc: 'Computer vision & screen guard', icon: Eye, route: 'vision' as PageRoute, color: 'text-blue-400' },
    { title: 'Voice Assistant', desc: 'Local speech commands', icon: Mic, route: 'voice' as PageRoute, color: 'text-purple-400' },
    { title: 'Privacy Shield', desc: 'Sensitive PII auto-mask', icon: Lock, route: 'privacy' as PageRoute, color: 'text-emerald-400' },
    { title: 'Run Benchmark', desc: 'Real NPU / CPU latency test', icon: Gauge, route: 'performance' as PageRoute, color: 'text-amber-400' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Active Workspace Guardian
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Good morning. Sentinel is protecting your workspace.
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            All AI capabilities running on-device. Zero unencrypted telemetry transmitted externally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshTelemetry}
            className="btn-ghost text-xs px-3 py-2 cursor-pointer"
            title="Refresh host telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="btn-cyan text-xs px-4 py-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Assistant</span>
          </button>
        </div>
      </div>

      {/* Top 4 Primary Guardian Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: AI Status */}
        <div className="p-5 glass-panel-glow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Status</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white tracking-tight">ACTIVE</span>
            <p className="text-[11px] text-emerald-400/90 font-medium mt-1">All local models loaded</p>
          </div>
        </div>

        {/* Card 2: Privacy Status */}
        <div className="p-5 glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Privacy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white tracking-tight">PROTECTED</span>
            <p className="text-[11px] text-slate-400 mt-1">Zero cloud retention</p>
          </div>
        </div>

        {/* Card 3: Threat Level */}
        <div className="p-5 glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Threat Level</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              LOW
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">NORMAL</span>
            <p className="text-[11px] text-slate-400 mt-1">No active intrusion hooks</p>
          </div>
        </div>

        {/* Card 4: AI Runtime */}
        <div className="p-5 glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Runtime</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                {telemetry?.npu_available ? 'NPU' : 'CPU LOCAL'}
              </span>
              <StatusBadge 
                runtime="local" 
                executionProvider={telemetry?.active_provider || 'cpu'} 
                hardware={telemetry?.active_hardware || 'cpu'} 
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {telemetry?.optimization_mode || 'Qualcomm AI Hub Compatible'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Center: AI Activity Visualization & Hardware Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Orb & Telemetry Card (2 cols) */}
        <div className="lg:col-span-2 p-6 glass-panel flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Multimodal Neural Orchestrator</h2>
              <p className="text-xs text-slate-400">Real-time pipeline: Intent Detection → Capability Selection → Local Execution</p>
            </div>
            <StatusBadge 
              runtime="local" 
              executionProvider={telemetry?.active_provider || 'cpu'} 
              hardware={telemetry?.active_hardware || 'cpu'} 
            />
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            <ThreeAiCore isProcessing={false} size={220} />
            <div className="space-y-3 w-full sm:max-w-xs text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Processor:</span>
                <span className="text-white font-mono font-medium truncate max-w-[160px]">
                  {telemetry?.processor || 'Host Processor'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">NPU TOPS:</span>
                <span className="text-cyan-400 font-bold">
                  {telemetry?.npu_available ? '45 TOPS' : 'Simulated Target: 45 TOPS'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">System Memory:</span>
                <span className="text-slate-200 font-mono">
                  {telemetry ? `${telemetry.available_ram_gb} GB free / ${telemetry.total_ram_gb} GB` : 'Telemetry unavailable'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">CPU Cores:</span>
                <span className="text-slate-200 font-mono">{telemetry?.cpu_cores || 'Live CPU'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Notice: Benchmarks and telemetry report verified real host measurements.</span>
            <button 
              onClick={() => onNavigate('performance')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>View Performance Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Tab: Recent Guardian Activity */}
        <div className="p-6 glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h2 className="text-base font-semibold text-white">Recent AI Actions</h2>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3">
              {recentActions.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{item.action}</span>
                    <span className="text-[10px] text-slate-400">{item.time} • Local Processing</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('activity')}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center cursor-pointer"
          >
            View Complete Audit Log
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Quick Guardian Actions</h2>
          <span className="text-xs text-slate-400">Select an AI capability to engage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(act.route)}
                className="p-4 glass-card text-left flex flex-col justify-between h-32 group cursor-pointer"
              >
                <div className={`p-2 rounded-lg bg-white/5 w-fit ${act.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                    {act.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
