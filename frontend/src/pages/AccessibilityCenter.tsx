import React, { useState } from 'react';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Navigation, 
  Brain, 
  Check, 
  Sparkles,
  Contrast,
  Sliders,
  Type
} from 'lucide-react';

interface AccessibilityProps {
  highContrast: boolean;
  reducedMotion: boolean;
  onToggleHighContrast: () => void;
  onToggleReducedMotion: () => void;
}

export const AccessibilityCenter: React.FC<AccessibilityProps> = ({
  highContrast,
  reducedMotion,
  onToggleHighContrast,
  onToggleReducedMotion
}) => {
  const [activeMode, setActiveMode] = useState<'standard' | 'visual' | 'voice' | 'focus'>('standard');
  const [largeText, setLargeText] = useState(false);
  const [liveCaptions, setLiveCaptions] = useState(true);
  const [stepByStep, setStepByStep] = useState(true);

  const modes = [
    { id: 'standard', title: 'Standard Mode', desc: 'Balanced default interface with ambient glow.' },
    { id: 'visual', title: 'Visual Assistance', desc: 'High contrast text, large typography & voice readouts.' },
    { id: 'voice', title: 'Voice Nav Mode', desc: 'Optimized for speech input & hands-free control.' },
    { id: 'focus', title: 'Cognitive Focus', desc: 'Simplified step-by-step UI with distractions suppressed.' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <Accessibility className="w-4 h-4 text-cyan-400" />
            Universal Design & Accessibility
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Accessibility Center
          </h1>
          <p className="text-xs text-slate-400">
            Dedicated multimodal assistance for vision, hearing, mobility, and cognitive accessibility.
          </p>
        </div>
      </div>

      {/* Preset Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id as any)}
            className={`p-5 glass-card text-left flex flex-col justify-between rounded-xl transition-all cursor-pointer ${
              activeMode === m.id
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                : 'hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{m.title}</span>
                {activeMode === m.id && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Assistance Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vision Support */}
        <div className="p-6 glass-panel space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-400 border-b border-white/5 pb-3 font-bold text-sm">
            <Eye className="w-4 h-4" />
            <span>Vision Support Tools</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-400">Crisp white/silver borders for maximum legibility</span>
              </div>
              <button
                onClick={onToggleHighContrast}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  highContrast ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                {highContrast ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Reduced Motion</span>
                <span className="text-[11px] text-slate-400">Suspends 3D rotations and particle oscillations</span>
              </div>
              <button
                onClick={onToggleReducedMotion}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  reducedMotion ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                {reducedMotion ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Large Typography</span>
                <span className="text-[11px] text-slate-400">Enlarges UI font scale for readable distance</span>
              </div>
              <button
                onClick={() => setLargeText(!largeText)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  largeText ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                {largeText ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* Cognitive & Hearing Support */}
        <div className="p-6 glass-panel space-y-4">
          <div className="flex items-center gap-2.5 text-purple-400 border-b border-white/5 pb-3 font-bold text-sm">
            <Brain className="w-4 h-4" />
            <span>Cognitive & Hearing Support</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Step-by-Step Task Breakdown</span>
                <span className="text-[11px] text-slate-400">AI decomposes complex answers into sequenced bullet steps</span>
              </div>
              <button
                onClick={() => setStepByStep(!stepByStep)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  stepByStep ? 'bg-purple-500 text-black font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                {stepByStep ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Live Speech Captions</span>
                <span className="text-[11px] text-slate-400">Displays real-time subtitles during voice responses</span>
              </div>
              <button
                onClick={() => setLiveCaptions(!liveCaptions)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  liveCaptions ? 'bg-purple-500 text-black font-bold' : 'bg-white/10 text-slate-300'
                }`}
              >
                {liveCaptions ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Keyboard Navigation Shortcuts</span>
                <span className="text-[11px] text-slate-400">Full tab navigation with visible focus rings</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-1">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
