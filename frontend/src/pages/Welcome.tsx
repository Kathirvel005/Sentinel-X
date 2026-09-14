import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Cpu, 
  Eye, 
  Mic, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';
import { ThreeAiCore } from '../components/ThreeAiCore';
import { PageRoute, HardwareTelemetry } from '../types';

interface WelcomeProps {
  onNavigate: (route: PageRoute) => void;
  onStartJudgeDemo: () => void;
  telemetry: HardwareTelemetry | null;
}

export const Welcome: React.FC<WelcomeProps> = ({
  onNavigate,
  onStartJudgeDemo,
  telemetry
}) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex justify-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(0,210,255,0.2)]">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Snapdragon AI Lab Build & Present Challenge</span>
        </div>
      </div>

      {/* Center Hero: 3D Core + Branding */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-4xl mx-auto space-y-6">
        <ThreeAiCore isProcessing={false} size={260} />

        <div className="space-y-3">
          <h1 className="font-['Orbitron',sans-serif] text-4xl sm:text-6xl font-black tracking-widest text-white">
            SENTINEL<span className="text-cyan-400">-X</span>
          </h1>
          <p className="text-sm sm:text-base font-medium tracking-[0.25em] text-cyan-300 uppercase">
            "See. Hear. Understand. Protect. Act."
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed pt-2">
            Private On-Device Multimodal AI Guardian tailored for Snapdragon-powered Windows PCs. 
            Real local inference, zero cloud telemetry for sensitive data, and Qualcomm Hexagon NPU acceleration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-cyan px-6 py-3 text-sm cursor-pointer"
          >
            <span>ENTER SENTINEL-X</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartJudgeDemo}
            className="px-6 py-3 rounded-xl text-sm font-bold text-cyan-300 bg-white/5 hover:bg-cyan-500/10 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.15)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>START 3-MIN JUDGE DEMO</span>
          </button>

          <button
            onClick={() => onNavigate('performance')}
            className="btn-ghost px-5 py-3 text-sm cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-slate-400" />
            <span>HARDWARE BENCHMARK</span>
          </button>
        </div>
      </div>

      {/* Bottom Feature Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto w-full z-10 pt-8 border-t border-white/5">
        <div className="p-3 glass-card rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">Scam Detector</span>
            <span className="text-[11px] text-slate-400">Phishing & fraud triage</span>
          </div>
        </div>

        <div className="p-3 glass-card rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">Privacy Shield</span>
            <span className="text-[11px] text-slate-400">Zero-retention PII mask</span>
          </div>
        </div>

        <div className="p-3 glass-card rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">Vision Lab</span>
            <span className="text-[11px] text-slate-400">Local scene & screen guard</span>
          </div>
        </div>

        <div className="p-3 glass-card rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">Snapdragon NPU</span>
            <span className="text-[11px] text-slate-400">45 TOPS Hexagon Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
