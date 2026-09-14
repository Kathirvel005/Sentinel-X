import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Eye, 
  Mic, 
  Folder, 
  RotateCcw, 
  Save, 
  Check,
  Zap
} from 'lucide-react';
import { UserSettings } from '../types';
import { api } from '../services/api';

interface SettingsPageProps {
  onSettingsUpdated: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onSettingsUpdated }) => {
  const [settings, setSettings] = useState<UserSettings>({
    local_only: true,
    allow_cloud_ai: false,
    telemetry_enabled: false,
    preferred_runtime: 'auto',
    camera_permission: true,
    microphone_permission: true,
    file_access_permission: true,
    dark_mode: true,
    reduced_motion: false,
    high_contrast: false
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getSettings();
        setSettings(res.data);
      } catch (e) {
        console.warn('Load settings error:', e);
      }
    };
    load();
  }, []);

  const handleToggle = (key: keyof UserSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await api.updateSettings(settings);
      setIsSaved(true);
      onSettingsUpdated();
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.warn('Save settings error:', e);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            Configuration & Permissions
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X System Settings
          </h1>
          <p className="text-xs text-slate-400">
            Configure local AI execution providers, data privacy boundaries, and accessibility preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-cyan text-xs px-5 py-2.5 cursor-pointer"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'SAVED TO DISK' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI & Runtime Preferences */}
        <div className="p-6 glass-panel space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-3">
            <Zap className="w-4 h-4" />
            <span>AI Execution & Acceleration</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-white block mb-1.5">
                Preferred Hardware Provider
              </label>
              <select
                value={settings.preferred_runtime}
                onChange={(e) => setSettings({ ...settings, preferred_runtime: e.target.value })}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="auto">Auto (QNN NPU → DirectML → CPU)</option>
                <option value="qnn">Force Qualcomm QNN Execution Provider</option>
                <option value="dml">DirectML GPU/NPU Provider</option>
                <option value="cpu">Force Local CPU Execution Provider</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Strict Local-Only AI</span>
                <span className="text-[11px] text-slate-400">Prohibits all external AI API calls</span>
              </div>
              <button
                onClick={() => handleToggle('local_only')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  settings.local_only ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.local_only ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Allow Cloud Fallback</span>
                <span className="text-[11px] text-slate-400">Default OFF for privacy compliance</span>
              </div>
              <button
                onClick={() => handleToggle('allow_cloud_ai')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  settings.allow_cloud_ai ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.allow_cloud_ai ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Permissions */}
        <div className="p-6 glass-panel space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-3">
            <Lock className="w-4 h-4" />
            <span>Privacy & Device Permissions</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Camera Access</span>
                <span className="text-[11px] text-slate-400">Local webcam feed for vision lab</span>
              </div>
              <button
                onClick={() => handleToggle('camera_permission')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  settings.camera_permission ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.camera_permission ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Microphone Access</span>
                <span className="text-[11px] text-slate-400">Local voice command recognition</span>
              </div>
              <button
                onClick={() => handleToggle('microphone_permission')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  settings.microphone_permission ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.microphone_permission ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Telemetry Transmission</span>
                <span className="text-[11px] text-slate-400">Disabled by default for privacy</span>
              </div>
              <button
                onClick={() => handleToggle('telemetry_enabled')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  settings.telemetry_enabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.telemetry_enabled ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
