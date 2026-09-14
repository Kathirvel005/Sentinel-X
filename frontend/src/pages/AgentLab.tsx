import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Shield, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { AgentResult, AgentStep } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const AgentLab: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<'analyze_proposal' | 'security_audit'>('analyze_proposal');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<AgentStep | null>(null);

  const tasks = [
    {
      id: 'analyze_proposal',
      title: 'Analyze Project Proposal Workflow',
      desc: '7-step pipeline: Document parsing, PII screening, risk extraction, recommendation synthesis, and confirmed disk writing.'
    },
    {
      id: 'security_audit',
      title: 'Full System Privacy & Workspace Audit',
      desc: '5-step pipeline: Clipboard scanner, screen zone inspector, local policy verification, and cache purge.'
    }
  ];

  const handleRunAgent = async () => {
    setIsRunning(true);
    setResult(null);
    setCurrentStepIndex(0);
    setPendingConfirmation(null);

    try {
      // Simulate step-by-step progress animation before final payload
      for (let i = 0; i < 6; i++) {
        setCurrentStepIndex(i);
        await new Promise((r) => setTimeout(r, 450));
      }

      const res = await api.runAgent(selectedTask);
      setResult(res.data);
      setCurrentStepIndex(res.data.steps.length);
    } catch (err) {
      console.warn('Agent run error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            Autonomous Local Task Execution
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Agent Lab
          </h1>
          <p className="text-xs text-slate-400">
            Multi-step on-device autonomous agents with visual execution checkpoints and explicit confirmation gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confirmation Checkpoints Enforced</span>
          </span>
        </div>
      </div>

      {/* Task Selector & Run Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTask(t.id as any)}
              className={`p-4 glass-card text-left rounded-xl flex flex-col justify-between transition-all cursor-pointer ${
                selectedTask === t.id
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                  : 'hover:border-white/20'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">{t.title}</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 glass-panel flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-white block uppercase tracking-wider">Execute Selected Agent</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Runs locally on Snapdragon PC. Destructive or external actions require confirmation.
            </p>
          </div>

          <button
            onClick={handleRunAgent}
            disabled={isRunning}
            className="btn-cyan w-full justify-center text-xs py-2.5 mt-3 cursor-pointer disabled:opacity-30"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'AGENT EXECUTING...' : 'START AGENT WORKFLOW'}</span>
          </button>
        </div>
      </div>

      {/* Visual Execution Pipeline & Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Execution Pipeline Steps (6 cols) */}
        <div className="lg:col-span-6 p-6 glass-panel space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Sequenced Workflow Steps
          </h2>

          <div className="space-y-3">
            {(result ? result.steps : [
              { id: 1, name: "Locate & inspect target document", tool: "FileScanner", requires_confirmation: false },
              { id: 2, name: "Read & extract raw text payload", tool: "DocumentReader", requires_confirmation: false },
              { id: 3, name: "Audit for embedded PII & credentials", tool: "PrivacyShield", requires_confirmation: false },
              { id: 4, name: "Extract key technical milestones & costs", tool: "NpuEntityExtractor", requires_confirmation: false },
              { id: 5, name: "Evaluate legal liability & timeline risks", tool: "RiskAssessmentEngine", requires_confirmation: false },
              { id: 6, name: "Synthesize executive briefing report", tool: "ReportGenerator", requires_confirmation: false },
              { id: 7, name: "Save report to local workspace disk", tool: "DiskWriter", requires_confirmation: true }
            ]).map((step, idx) => {
              const isDone = isRunning ? idx <= currentStepIndex : result !== null;
              const isCurrent = isRunning && idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,210,255,0.2)] animate-pulse'
                      : 'bg-white/[0.02] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-bold w-5">
                      [{step.id}]
                    </span>
                    <div>
                      <span className="font-semibold block text-white">{step.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Tool: {step.tool}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {step.requires_confirmation && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Gate
                      </span>
                    )}

                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Agent Synthesized Output (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="p-6 glass-panel-glow space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Synthesized Agent Output</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{result.latency_ms} ms</span>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Workflow Summary
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {result.output.summary}
                </p>
              </div>

              {/* Risks & Opportunities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-rose-300 uppercase block">Identified Risks</span>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {result.output.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase block">Opportunities</span>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {result.output.opportunities.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  Action Recommendations
                </span>
                <ul className="text-xs text-slate-200 list-disc list-inside space-y-1">
                  {result.output.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-8 glass-panel text-center flex flex-col items-center justify-center space-y-3 h-full min-h-[350px]">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Agent Idle</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Click "Start Agent Workflow" to view real-time sequenced multi-step execution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
