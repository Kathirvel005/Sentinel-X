import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Eye,
  Mic,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Accessibility,
  Workflow,
  Activity,
  Gauge,
  Settings,
  Info,
  Zap,
  Sparkles,
  Lock
} from 'lucide-react';
import { PageRoute, HardwareTelemetry } from '../types';

interface SidebarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  telemetry: HardwareTelemetry | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  telemetry
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'vision', label: 'Vision Lab', icon: Eye },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'security', label: 'Security & Scam', icon: ShieldAlert, badge: 'Crucial' },
    { id: 'privacy', label: 'Privacy Shield', icon: ShieldCheck },
    { id: 'documents', label: 'Document Intel', icon: FileText },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'agent-lab', label: 'Agent Lab', icon: Workflow },
    { id: 'performance', label: 'Performance Lab', icon: Gauge, badge: 'Snapdragon' },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About & Tech', icon: Info },
  ];

  return (
    <aside className="w-64 bg-[#090C12] border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 select-none z-50">
      {/* Top: Logo Branding */}
      <div>
        <div 
          onClick={() => onNavigate('dashboard')}
          className="p-5 flex items-center gap-3 cursor-pointer group border-b border-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-[0_0_20px_rgba(0,210,255,0.3)]">
            <div className="w-full h-full bg-[#090C12] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Orbitron',sans-serif] font-black text-base tracking-widest text-white">
                SENTINEL<span className="text-cyan-400">-X</span>
              </span>
            </div>
            <p className="text-[10px] tracking-wider text-slate-400 uppercase font-medium">
              Snapdragon AI Guardian
            </p>
          </div>
        </div>

        {/* Navigation Link List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PageRoute)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,210,255,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    item.badge === 'Snapdragon'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Hardware Status & AI Runtime Summary Card */}
      <div className="p-3 border-t border-white/5 bg-black/30">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-[11px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Runtime:</span>
            </span>
            <span className="font-semibold text-white">
              {telemetry?.npu_available ? 'Snapdragon NPU' : 'CPU Local'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Shield:</span>
            </span>
            <span className="font-semibold text-emerald-300">Protected</span>
          </div>

          <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
            <span>Provider: {telemetry?.active_provider || 'CPUExecutionProvider'}</span>
            <span className="text-cyan-400 font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
