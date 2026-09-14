import React from 'react';
import { 
  Info, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  FileCode, 
  CheckCircle2, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            System Architecture & Competition Documentation
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            About Sentinel-X & Snapdragon AI Hub Integration
          </h1>
          <p className="text-xs text-slate-400">
            Prepared for the Snapdragon AI Lab Build & Present Challenge.
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-6 glass-panel-glow space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>Core Product Vision</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          <strong>Sentinel-X</strong> is an on-device personal AI guardian designed specifically for Snapdragon-powered Windows PCs. 
          By unifying Computer Vision, Voice AI, Document Intelligence, Phishing Detection, and Sensitive Information Redaction 
          into a single privacy-first architecture, Sentinel-X eliminates the privacy risks and latency penalties of cloud-dependent AI.
        </p>
      </div>

      {/* 4 Competition Criteria Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 glass-card rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <Cpu className="w-4 h-4" />
            <span>1. Technical Implementation</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real hardware abstraction layer integrating ONNX Runtime, Qualcomm QNN Execution Provider (`QnnHtp.dll`), 
            and transparent fallback to host CPU with verified p50/p95 latency metrics.
          </p>
        </div>

        <div className="p-5 glass-card rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>2. Application Innovation</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            First multimodal guardian combining screen privacy masking, Indian Government ID redaction (Aadhaar & PAN), 
            and social engineering fraud triage directly on local PC silicon.
          </p>
        </div>

        <div className="p-5 glass-card rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
            <FileCode className="w-4 h-4" />
            <span>3. Deployment & Accessibility</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Universal accessibility suite featuring high contrast modes, reduced motion, step-by-step cognitive simplifications, 
            and live speech captioning with zero cloud network dependencies.
          </p>
        </div>

        <div className="p-5 glass-card rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>4. Snapdragon Differentiation</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Demonstrates clear 45 TOPS Hexagon NPU offloading, preserving all-day battery life on Snapdragon HP Windows PCs 
            while running continuous ambient guardian workloads.
          </p>
        </div>
      </div>

      {/* Responsible AI Box */}
      <div className="p-6 glass-panel space-y-3 text-xs">
        <h3 className="font-bold text-white text-sm">Responsible AI Commitment</h3>
        <ul className="text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
          <li><strong>Zero Sensitive Data Retention:</strong> All PII scans and camera buffers execute in volatile memory and are purged immediately.</li>
          <li><strong>Non-Biometric Vision:</strong> Face presence detection does not attempt facial recognition or identity tracking.</li>
          <li><strong>Advisory Scam Scoring:</strong> Security evaluations are advisory tools to aid user decision-making; users are encouraged to verify important messages independently.</li>
          <li><strong>Human in the Loop:</strong> Autonomous agents must obtain explicit confirmation before executing file writes or external tasks.</li>
        </ul>
      </div>
    </div>
  );
};
