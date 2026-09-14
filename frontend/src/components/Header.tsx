import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Bell, 
  User, 
  Activity, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { HardwareTelemetry, PageRoute } from '../types';

interface HeaderProps {
  telemetry: HardwareTelemetry | null;
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onStartJudgeDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  activeRoute,
  onNavigate,
  onStartJudgeDemo
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const npuActive = telemetry?.npu_available;

  return (
    <header className="h-16 border-b border-white/5 bg-[#080B11]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Current Time & Device Telemetry Pill */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-slate-400 font-medium tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
          {timeStr || '12:00:00'}
        </span>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium hidden sm:inline text-slate-400">Host:</span>
          <span className="text-white font-semibold">{telemetry?.device || 'Scanning Hardware...'}</span>
        </div>
      </div>

      {/* Right: NPU Indicator, Privacy Pill, Judge Demo Button, Profile */}
      <div className="flex items-center gap-3">
        {/* Judge Demo Quick Action */}
        <button
          onClick={onStartJudgeDemo}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>JUDGE DEMO (3 MIN)</span>
        </button>

        {/* NPU Status Indicator */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
          npuActive 
            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' 
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <Zap className={`w-3.5 h-3.5 ${npuActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">NPU:</span>
          <span>{npuActive ? 'Hexagon 45 TOPS' : 'Simulation Mode'}</span>
        </div>

        {/* Privacy Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Privacy:</span>
          <span>LOCAL ONLY</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 p-3 glass-panel-glow shadow-2xl z-50 text-xs">
              <div className="font-semibold text-white mb-2 flex items-center justify-between border-b border-white/10 pb-1.5">
                <span>Guardian Alerts</span>
                <span className="text-[10px] text-cyan-400">All Systems Normal</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="font-medium text-white block">Local Execution Active</span>
                  <span className="text-slate-400 text-[11px]">Zero network egress for sensitive inference.</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="font-medium text-white block">Snapdragon Optimization</span>
                  <span className="text-slate-400 text-[11px]">ONNX & QNN Execution Provider ready.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User / Sentinel Avatar */}
        <div 
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-black">
            SX
          </div>
          <span className="text-xs font-medium text-slate-200 hidden lg:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};
