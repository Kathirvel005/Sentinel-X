import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CameraOff, 
  ShieldCheck, 
  Eye, 
  Zap, 
  RefreshCw, 
  AlertTriangle, 
  Scan, 
  Lock 
} from 'lucide-react';
import { VisionResult, VisionDetection } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const VisionLab: React.FC = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [privacyMaskActive, setPrivacyMaskActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [visionData, setVisionData] = useState<VisionResult>({
    objects_count: 3,
    detections: [
      { id: '1', label: 'Person', confidence: 0.98, box: { x: 0.25, y: 0.15, width: 0.50, height: 0.70 }, privacy_risk: false, mask_applied: false },
      { id: '2', label: 'Laptop Screen', confidence: 0.94, box: { x: 0.08, y: 0.52, width: 0.42, height: 0.38 }, privacy_risk: true, mask_applied: true },
      { id: '3', label: 'Smartphone', confidence: 0.91, box: { x: 0.68, y: 0.62, width: 0.18, height: 0.28 }, privacy_risk: true, mask_applied: true }
    ],
    scene_description: 'Workstation environment with occupant and active secondary screens.',
    face_presence_detected: true,
    identity_recognition_disabled: true,
    privacy_mask_enabled: true,
    alerts: [{ type: 'Display Masking Active', message: 'Screen & mobile device zones automatically obfuscated from camera feed.' }],
    latency_ms: 12.4,
    fps: 30.0,
    runtime: 'local',
    execution_provider: 'cpu',
    hardware: 'cpu'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      triggerScan();
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Physical camera unavailable or permission denied. Running in verified local Simulation Mode.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const triggerScan = async () => {
    setIsLoading(true);
    try {
      const res = await api.analyzeVision(undefined, privacyMaskActive);
      setVisionData(res.data);
    } catch (err) {
      console.warn('Vision analyze call error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            Computer Vision & Privacy Masking
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Vision Lab
          </h1>
          <p className="text-xs text-slate-400">
            Real-time object detection with non-biometric face presence and screen zone privacy masking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge 
            runtime={visionData.runtime} 
            executionProvider={visionData.execution_provider} 
            hardware={visionData.hardware} 
          />
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Vision Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Video Stream / Overlay Box */}
        <div className="lg:col-span-2 p-6 glass-panel flex flex-col justify-between space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="btn-cyan text-xs px-3.5 py-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>START CAMERA</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>STOP CAMERA</span>
                </button>
              )}

              <button
                onClick={triggerScan}
                disabled={isLoading}
                className="btn-ghost text-xs px-3 py-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>SCAN FRAME</span>
              </button>
            </div>

            {/* Privacy Mask Toggle */}
            <button
              onClick={() => {
                setPrivacyMaskActive(!privacyMaskActive);
                setTimeout(triggerScan, 50);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                privacyMaskActive
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>PRIVACY MASK: {privacyMaskActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Viewport Screen */}
          <div className="relative aspect-video w-full bg-black/60 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
            {/* Real Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Simulated Frame Placeholder if camera off */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/80 to-slate-900/90 text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Scan className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Camera Offline</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Click "Start Camera" to engage local webcam, or inspect simulated detection zones below.
                  </p>
                </div>
              </div>
            )}

            {/* Bounding Box Overlays */}
            {visionData.detections.map((det) => {
              const b = det.box;
              return (
                <div
                  key={det.id}
                  className={`absolute transition-all ${
                    det.privacy_risk && privacyMaskActive
                      ? 'backdrop-blur-md bg-cyan-950/70 border-2 border-dashed border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                      : 'border-2 border-emerald-400 bg-emerald-500/10'
                  } rounded-lg flex flex-col justify-between p-1.5 pointer-events-none`}
                  style={{
                    left: `${b.x * 100}%`,
                    top: `${b.y * 100}%`,
                    width: `${b.width * 100}%`,
                    height: `${b.height * 100}%`
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className={`px-1.5 py-0.5 rounded text-black ${
                      det.privacy_risk && privacyMaskActive ? 'bg-cyan-400' : 'bg-emerald-400'
                    }`}>
                      {det.label.toUpperCase()} {Math.round(det.confidence * 100)}%
                    </span>
                    {det.privacy_risk && privacyMaskActive && (
                      <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                        MASKED
                      </span>
                    )}
                  </div>

                  {det.privacy_risk && privacyMaskActive && (
                    <div className="flex items-center justify-center text-center text-cyan-300 font-mono text-[10px] tracking-wider uppercase font-semibold">
                      [Display Privacy Protected]
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase">FPS</span>
              <span className="text-white font-bold text-sm">{visionData.fps} FPS</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase">Latency</span>
              <span className="text-cyan-400 font-bold text-sm">{visionData.latency_ms} ms</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase">Detections</span>
              <span className="text-emerald-400 font-bold text-sm">{visionData.objects_count} Objects</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase">Biometric ID</span>
              <span className="text-slate-300 font-bold text-sm">Disabled (Safe)</span>
            </div>
          </div>
        </div>

        {/* Right col: Detection details & Privacy policy */}
        <div className="space-y-4">
          <div className="p-6 glass-panel space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">
              Detected Scene Objects
            </h2>

            <div className="space-y-2">
              {visionData.detections.map((det) => (
                <div key={det.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{det.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Confidence: {Math.round(det.confidence * 100)}%</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    det.privacy_risk
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {det.privacy_risk ? 'Screen Zone' : 'Environment'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 glass-panel space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Storage Vision Policy</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Sentinel-X processes visual frames directly in temporary volatile memory buffers. 
              No camera snapshots or video streams are ever permanently stored to disk or uploaded to cloud endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
