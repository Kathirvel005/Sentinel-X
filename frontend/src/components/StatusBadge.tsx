import React from 'react';
import { Cpu, Zap, Shield, AlertTriangle, Cloud } from 'lucide-react';

interface StatusBadgeProps {
  runtime?: string;
  executionProvider?: string;
  hardware?: string;
  fallback?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  runtime = 'local',
  executionProvider = 'cpu',
  hardware = 'cpu',
  fallback = false,
  className = ''
}) => {
  const isQnn = executionProvider.toLowerCase().includes('qnn') || hardware === 'npu';
  const isDml = executionProvider.toLowerCase().includes('dml');
  const isSimulation = hardware === 'simulated' || runtime === 'demo';

  if (isQnn) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ${className}`}>
        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>NPU (Snapdragon QNN)</span>
      </span>
    );
  }

  if (isDml) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 ${className}`}>
        <Cpu className="w-3.5 h-3.5 text-blue-400" />
        <span>GPU (DirectML)</span>
      </span>
    );
  }

  if (isSimulation) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
        <span>SIMULATED DEMO</span>
      </span>
    );
  }

  if (runtime === 'cloud') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 ${className}`}>
        <Cloud className="w-3.5 h-3.5 text-amber-400" />
        <span>CLOUD EXECUTION</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60 ${className}`}>
      <Cpu className="w-3.5 h-3.5 text-slate-400" />
      <span>{fallback ? 'CPU FALLBACK' : 'REAL LOCAL CPU'}</span>
    </span>
  );
};
