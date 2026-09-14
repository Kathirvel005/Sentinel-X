import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  FileCheck, 
  ArrowRight 
} from 'lucide-react';
import { DocumentResult } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const DocumentIntel: React.FC = () => {
  const [docText, setDocText] = useState(
    "CONFIDENTIAL STRATEGIC AI VENDOR AGREEMENT\n" +
    "This Agreement is entered into between Core Dynamics Inc and Qualcomm Partner Solutions.\n" +
    "1. Scope of Work: Vendor shall deploy Snapdragon-optimized Hexagon NPU models with 45 TOPS rating by December 15, 2026.\n" +
    "2. Security & Compliance: Vendor must guarantee zero telemetry transmission of client credentials.\n" +
    "3. Penalties & Breach: Any unapproved cloud data egress incurs an immediate $25,000 penalty and grounds for termination.\n" +
    "4. Deliverables: Deliverable 1 is complete ONNX runtime QNN provider pipeline. Deliverable 2 is benchmark report."
  );
  const [filename, setFilename] = useState("vendor_agreement.txt");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentResult | null>(null);

  const samplePresets = [
    {
      name: "Strategic AI Vendor NDA.txt",
      content: "CONFIDENTIAL STRATEGIC AI VENDOR AGREEMENT\n1. Scope of Work: Vendor shall deploy Snapdragon-optimized Hexagon NPU models with 45 TOPS rating by December 15, 2026.\n2. Security & Compliance: Vendor must guarantee zero telemetry transmission of client credentials.\n3. Penalties & Breach: Any unapproved cloud data egress incurs an immediate $25,000 penalty and grounds for termination."
    },
    {
      name: "Enterprise Software License.txt",
      content: "MASTER SOFTWARE LICENSE AGREEMENT\nLicensee is granted a non-exclusive license for on-device execution on Windows PCs.\nLiability: In no event shall Licensor be liable for indirect damages exceeding software license fees paid.\nTermination: Licensor may terminate immediately upon breach of confidentiality or unauthorized reverse engineering."
    }
  ];

  const handleAnalyze = async () => {
    if (!docText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeDocument(docText, filename, "text");
      setResult(res.data);
    } catch (err) {
      console.warn('Document analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result?.report_markdown) return;
    const blob = new Blob([result.report_markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SentinelX_Report_${result.filename.replace(/\.[^/.]+$/, "")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Document Intelligence & Contract Analytics
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Document Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Local extractive summarization, action item extraction, liability risk analysis, and report generation.
          </p>
        </div>

        {result && (
          <StatusBadge 
            runtime={result.runtime} 
            executionProvider={result.execution_provider} 
            hardware={result.hardware} 
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Document Text (6 cols) */}
        <div className="lg:col-span-6 p-6 glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Document Payload</span>
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".txt,.pdf,.docx,.md"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sample Templates:</span>
            {samplePresets.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setFilename(preset.name);
                  setDocText(preset.content);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>

          <textarea
            rows={10}
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            className="w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">File: {filename}</span>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !docText.trim()}
              className="btn-cyan text-xs px-5 py-2.5 cursor-pointer disabled:opacity-30"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'PROCESSING...' : 'ANALYZE DOCUMENT'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Extracted Intelligence (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="p-6 glass-panel-glow space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Intelligence Summary</span>
                  <span className="text-[11px] text-cyan-400 font-medium">Type: {result.classification}</span>
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="btn-cyan text-xs px-3.5 py-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD REPORT</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Executive Brief
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Action Items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Identified Action Items</span>
                <div className="space-y-1.5">
                  {result.action_items.map((act, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contractual Risks */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Identified Contractual Risks</span>
                <div className="space-y-1.5">
                  {result.risks.length > 0 ? (
                    result.risks.map((r, i) => (
                      <div key={i} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">[{r.severity}]</span> {r.clause}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>No immediate legal liability triggers identified.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Audit Pill */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>PII Audit: {result.privacy_audit.sensitive_items_found} items scanned</span>
                <span className="text-emerald-400 font-mono">Status: Cleared</span>
              </div>
            </div>
          ) : (
            <div className="p-8 glass-panel text-center flex flex-col items-center justify-center space-y-3 h-full min-h-[350px]">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Document Analysis Awaiting</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Upload a document or select a sample preset to generate executive brief, legal risks, and exportable reports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
