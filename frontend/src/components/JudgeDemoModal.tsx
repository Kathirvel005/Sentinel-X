import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  FileText, 
  Workflow, 
  Gauge, 
  Award,
  ArrowRight
} from 'lucide-react';
import { PageRoute } from '../types';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (route: PageRoute) => void;
}

interface DemoStep {
  timeLabel: string;
  title: string;
  subtitle: string;
  targetRoute: PageRoute;
  icon: any;
  bulletPoints: string[];
  judgeNote: string;
  color: string;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToModule
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const demoSteps: DemoStep[] = [
    {
      timeLabel: "00:00",
      title: "Hardware Status & Qualcomm NPU Architecture",
      subtitle: "Transparent hardware detection & Snapdragon capability check",
      targetRoute: "dashboard",
      icon: Zap,
      bulletPoints: [
        "Probes Windows on ARM64 and Qualcomm Hexagon NPU (45 TOPS).",
        "Discovers ONNX Runtime and QNN Execution Provider (QnnHtp.dll).",
        "Provides transparent fallback to host CPU with zero fabricated telemetry."
      ],
      judgeNote: "Demonstrates true silicon-aware hardware integration rather than a generic cloud wrapper.",
      color: "text-cyan-400"
    },
    {
      timeLabel: "00:20",
      title: "Scam & Phishing Fraud Detection",
      subtitle: "On-device multi-heuristic social engineering triage",
      targetRoute: "security",
      icon: ShieldAlert,
      bulletPoints: [
        "Evaluates urgency hooks, credential requests, authority impersonation, and deceptive URLs.",
        "Generates 0-100 risk score with explicit threat levels (Safe to Critical).",
        "Provides clear actionable user advice (e.g. 'DO NOT CLICK', 'VERIFY SENDER')."
      ],
      judgeNote: "Solves the real-world cybersecurity threat of social engineering entirely on-device.",
      color: "text-rose-400"
    },
    {
      timeLabel: "00:45",
      title: "Privacy Shield & Sensitive Data Sanitizer",
      subtitle: "Zero-retention PII & credential redaction",
      targetRoute: "privacy",
      icon: ShieldCheck,
      bulletPoints: [
        "Detects Indian Government IDs (Aadhaar, PAN), payment cards, bank accounts, and API tokens.",
        "Guarantees ephemeral processing: sensitive strings are masked in memory and never written to disk.",
        "Visual privacy shield allows users to copy clean sanitized text for safe sharing."
      ],
      judgeNote: "Addresses enterprise and regional compliance requirements with zero cloud egress.",
      color: "text-emerald-400"
    },
    {
      timeLabel: "01:10",
      title: "Vision Lab & Screen Privacy Guard",
      subtitle: "Real-time webcam computer vision with display obfuscation",
      targetRoute: "vision",
      icon: Eye,
      bulletPoints: [
        "Runs local object detection and scene understanding.",
        "Applies dynamic privacy mask over laptop screens and smartphone displays in the camera field of view.",
        "Detects face presence without biometric identity tracking, preserving personal privacy."
      ],
      judgeNote: "Brings ambient privacy protection to laptop cameras using local visual acceleration.",
      color: "text-blue-400"
    },
    {
      timeLabel: "01:35",
      title: "Document Intelligence & Legal Risk Audit",
      subtitle: "On-device contract analysis and downloadable briefing reports",
      targetRoute: "documents",
      icon: FileText,
      bulletPoints: [
        "Parses contracts, NDA agreements, invoices, and specs locally.",
        "Extracts executive summaries, action item checklists, and legal liability clauses.",
        "Generates exportable markdown reports with a single click."
      ],
      judgeNote: "Transforms confidential document analysis from a cloud risk into a private local capability.",
      color: "text-cyan-400"
    },
    {
      timeLabel: "02:00",
      title: "Autonomous Agent Lab",
      subtitle: "Multi-step visual workflow execution with safety confirmation gates",
      targetRoute: "agent-lab",
      icon: Workflow,
      bulletPoints: [
        "Sequences complex workflows: file inspection, PII screening, risk extraction, and report saving.",
        "Displays real-time step progress with dedicated tool status badges.",
        "Mandatory confirmation checkpoints prevent silent file writes or unauthorized changes."
      ],
      judgeNote: "Presents practical, governed AI agency that builds user trust.",
      color: "text-purple-400"
    },
    {
      timeLabel: "02:30",
      title: "Verified Hardware Performance Lab",
      subtitle: "Live benchmarking measuring p50/p95 latency and NPU offloading",
      targetRoute: "performance",
      icon: Gauge,
      bulletPoints: [
        "Executes warm-up cycles and N iterations live on host silicon.",
        "Calculates mean, p50, p95, and memory deltas without fabricating numbers.",
        "Compares measured host latency against Qualcomm AI Hub 45 TOPS Hexagon targets."
      ],
      judgeNote: "Validates Qualcomm's core value proposition: 7x energy reduction and real-time responsiveness.",
      color: "text-amber-400"
    },
    {
      timeLabel: "02:50",
      title: "Final Impact & Evaluation Criteria Summary",
      subtitle: "Why Sentinel-X on Snapdragon PCs wins",
      targetRoute: "dashboard",
      icon: Award,
      bulletPoints: [
        "Technical Excellence: Real ONNX/QNN runtime abstraction with transparent fallback.",
        "Innovation: First unified on-device multimodal guardian (Vision + Voice + Security + Privacy).",
        "Snapdragon Value: Ambient guardian protection made viable by Hexagon NPU efficiency."
      ],
      judgeNote: "Delivers a commercial-grade, polished prototype designed specifically for Snapdragon PCs.",
      color: "text-emerald-400"
    }
  ];

  // Auto-advance timer (approx 20-25 seconds per step, totaling 3 minutes)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        const nextSec = prev + 1;
        // Step transition every 22 seconds
        const stepIdx = Math.min(demoSteps.length - 1, Math.floor(nextSec / 22));
        setCurrentStepIndex(stepIdx);
        return nextSec;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const currentStep = demoSteps[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleJumpToLiveModule = () => {
    onNavigateToModule(currentStep.targetRoute);
    onClose();
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-3xl glass-panel-glow border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
        {/* Top Header: Badge, Timer, Close Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.4)]">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                  Judges Walkthrough Tour
                </span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white">
                  {timeFormatted} / 03:00
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Snapdragon AI Lab Build & Present Challenge
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-8 gap-1.5">
          {demoSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                idx === currentStepIndex
                  ? 'bg-cyan-400 shadow-[0_0_10px_#00D2FF]'
                  : idx < currentStepIndex
                  ? 'bg-cyan-600/70'
                  : 'bg-white/10'
              }`}
              title={`${step.timeLabel} - ${step.title}`}
            />
          ))}
        </div>

        {/* Step Content Card */}
        <div className="p-6 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/5 ${currentStep.color}`}>
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  [{currentStep.timeLabel}] Step {currentStepIndex + 1} of {demoSteps.length}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleJumpToLiveModule}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Jump to Live Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 font-medium italic">
            "{currentStep.subtitle}"
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            {currentStep.bulletPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>

          {/* Judge Evaluation Note */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block">Competition Evaluation Criteria:</span>
              <span className="text-slate-300 text-[11px]">{currentStep.judgeNote}</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Playback Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE TOUR' : 'RESUME TOUR'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === demoSteps.length - 1}
              className="btn-cyan text-xs px-4 py-2.5 cursor-pointer disabled:opacity-30"
            >
              <span>NEXT STEP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
