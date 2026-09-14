import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Mic, 
  Camera, 
  Folder, 
  Wifi, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  RefreshCw,
  Copy
} from 'lucide-react';
import { PrivacyResult } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const PrivacyCenter: React.FC = () => {
  const [inputText, setInputText] = useState(
    "Employee Profile: Rajiv Sharma\n" +
    "Email: rajiv.sharma@corp-defence.in, Phone: +91 (987) 654-3210\n" +
    "Aadhaar Number: 5432 1098 7654\n" +
    "PAN Card: ABCDE1234F\n" +
    "Salary Account: A/C 9876543210123\n" +
    "Corporate Card: 4532 8901 2345 6789\n" +
    "Internal Production API Token: api_key='sk_live_qualcomm_sec_8923489102482390'\n" +
    "Server Password: password='SentinelSecure2026!'"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PrivacyResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Hardware permission state toggles
  const [permissions, setPermissions] = useState({
    mic: true,
    camera: true,
    files: true,
    networkEgress: false,
    localOnly: true
  });

  const handleScan = async (redact: boolean = true) => {
    if (!inputText.trim()) return;
    setIsScanning(true);
    try {
      const res = await api.scanPrivacy(inputText, redact);
      setResult(res.data);
    } catch (err) {
      console.warn('Privacy scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyRedacted = () => {
    if (!result?.redacted_text) return;
    navigator.clipboard.writeText(result.redacted_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Zero-Persistence Sensitive Data Sanitizer
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Privacy Center & Shield
          </h1>
          <p className="text-xs text-slate-400">
            Real-time heuristic detection of Government IDs, payment credentials, and secrets.
            Processed strictly in ephemeral memory with zero disk retention.
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

      {/* Hardware Access & Egress Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 glass-card rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mic className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">Microphone</span>
              <span className="text-[10px] text-slate-400">Local Only</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>

        <div className="p-3.5 glass-card rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Camera className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-bold text-white block">Camera</span>
              <span className="text-[10px] text-slate-400">Masked Zone</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>

        <div className="p-3.5 glass-card rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Folder className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs font-bold text-white block">Filesystem</span>
              <span className="text-[10px] text-slate-400">Sandboxed</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>

        <div className="p-3.5 glass-card rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-xs font-bold text-white block">Cloud Egress</span>
              <span className="text-[10px] text-slate-400">Telemetry</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            BLOCKED
          </span>
        </div>

        <div className="p-3.5 glass-card rounded-xl flex items-center justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-white block">Inference</span>
              <span className="text-[10px] text-slate-400">Snapdragon</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            LOCAL
          </span>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Box */}
        <div className="p-6 glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Raw Input Text (Pre-Sanitization)</span>
            <span className="text-[11px] text-slate-400 font-mono">Contains test PII/Credentials</span>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => handleScan(true)}
              disabled={isScanning || !inputText.trim()}
              className="btn-cyan text-xs px-5 py-2.5 cursor-pointer disabled:opacity-30"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isScanning ? 'SANITIZING...' : 'SCAN & REDACT SENSITIVE DATA'}</span>
            </button>

            <button
              onClick={() => handleScan(false)}
              disabled={isScanning || !inputText.trim()}
              className="btn-ghost text-xs px-4 py-2.5 cursor-pointer"
            >
              <span>AUDIT ONLY (NO MASK)</span>
            </button>
          </div>
        </div>

        {/* Output Box & Redaction Card */}
        <div className="p-6 glass-panel-glow space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Sanitized Privacy Shield Stream</span>
              {result && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {result.total_sensitive_items} ITEMS MASKED
                </span>
              )}
            </div>

            {result && (
              <button
                onClick={handleCopyRedacted}
                className="text-xs flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Redacted'}</span>
              </button>
            )}
          </div>

          <div className="w-full h-56 p-3.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-cyan-300/90 overflow-y-auto whitespace-pre-wrap">
            {result ? result.redacted_text : 'Run "Scan & Redact" to inspect sanitized text output.'}
          </div>

          {/* Detections List */}
          {result && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-slate-300 block">Detected Entity Types</span>
              <div className="flex flex-wrap gap-2">
                {result.detections.map((d, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200"
                  >
                    <span className="text-amber-400 font-bold">[{d.type}]</span> {d.masked_preview}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
