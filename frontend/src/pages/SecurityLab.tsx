import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Mail, 
  MessageSquare, 
  Link2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { ScamResult } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const SecurityLab: React.FC = () => {
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'whatsapp' | 'url'>('email');
  const [inputText, setInputText] = useState(
    "URGENT: Your PayPal account has been restricted due to suspicious activity. " +
    "Please confirm your password and card PIN immediately at http://paypal.verify-auth.xyz/login " +
    "within 24 hours to prevent permanent account termination."
  );
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScamResult | null>(null);

  const presets = {
    email: "URGENT: Your PayPal account has been restricted due to suspicious activity. Please confirm your password and card PIN immediately at http://paypal.verify-auth.xyz/login within 24 hours to prevent permanent account termination.",
    sms: "DHL Express: Your package delivery is on hold due to unpaid duty fee of $3.50. Pay immediately via wire transfer or gift card: http://192.168.1.10/pay to receive delivery today.",
    whatsapp: "Dear Winner! You have won $50,000 in the International Mobile Lottery! Send your bank account details and your OTP to claim your cash prize today!",
    url: "https://apple-security-check.verify-token.top/login.php"
  };

  const handleSelectType = (type: 'email' | 'sms' | 'whatsapp' | 'url') => {
    setMessageType(type);
    setInputText(presets[type]);
  };

  const handleScan = async () => {
    if (!inputText.trim()) return;
    setIsScanning(true);
    try {
      const res = await api.scanSecurity(inputText, messageType);
      setResult(res.data);
    } catch (err) {
      console.warn('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Social Engineering & Threat Protection
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Scam & Phishing Detector
          </h1>
          <p className="text-xs text-slate-400">
            Multi-heuristic pattern evaluation for urgency manipulation, authority impersonation, credential harvesting, and suspicious URLs.
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
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 p-6 glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Source Channel</span>
            <div className="flex items-center gap-1.5">
              {(['email', 'sms', 'whatsapp', 'url'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleSelectType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    messageType === t
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Message Payload</span>
              <span className="text-[11px] text-slate-500">Paste raw text or suspected links</span>
            </label>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste email text, SMS message, WhatsApp copy, or URL link..."
              className="w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Evaluated on-device. Your text is never transmitted to cloud databases.
            </span>
            <button
              onClick={handleScan}
              disabled={isScanning || !inputText.trim()}
              className="btn-cyan text-xs px-5 py-2.5 cursor-pointer disabled:opacity-30"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isScanning ? 'ANALYZING...' : 'SCAN FOR FRAUD'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Threat Assessment Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="p-6 glass-panel-glow space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Results</span>
                <span className="text-[11px] font-mono text-cyan-400">{result.latency_ms} ms</span>
              </div>

              {/* Threat Gauge */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Threat Level</span>
                  <span className={`text-2xl font-black tracking-wider ${
                    result.threat_level === 'CRITICAL' ? 'text-rose-400' : 
                    result.threat_level === 'HIGH' ? 'text-orange-400' : 
                    result.threat_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {result.threat_level}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk Score</span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-black text-white font-mono">{result.risk_score}</span>
                    <span className="text-xs text-slate-500 font-mono">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                  Recommended Action
                </span>
                <p className="text-xs font-bold text-white tracking-wide">
                  {result.recommended_action}
                </p>
              </div>

              {/* Reasons Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Identified Risk Triggers</span>
                {result.reasons.length > 0 ? (
                  result.reasons.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-200 block">{r.type}</span>
                        <span className="text-[11px] text-slate-400">{r.detail}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>No urgency, impersonation, or credential harvest signals detected.</span>
                  </div>
                )}
              </div>

              {/* Mandatory Responsible AI Disclaimer */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{result.disclaimer}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 glass-panel text-center flex flex-col items-center justify-center space-y-3 h-full min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Awaiting Inspection</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Click "Scan for Fraud" to run deep local multi-heuristic evaluation on Snapdragon PC.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
