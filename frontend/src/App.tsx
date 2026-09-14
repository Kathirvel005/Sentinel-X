import React, { useState, useEffect } from 'react';
import { PageRoute, HardwareTelemetry } from './types';
import { api } from './services/api';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { JudgeDemoModal } from './components/JudgeDemoModal';

import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { VisionLab } from './pages/VisionLab';
import { SecurityLab } from './pages/SecurityLab';
import { PrivacyCenter } from './pages/PrivacyCenter';
import { DocumentIntel } from './pages/DocumentIntel';
import { VoiceLab } from './pages/VoiceLab';
import { AccessibilityCenter } from './pages/AccessibilityCenter';
import { AgentLab } from './pages/AgentLab';
import { PerformanceLab } from './pages/PerformanceLab';
import { ActivityCenter } from './pages/ActivityCenter';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('welcome');
  const [telemetry, setTelemetry] = useState<HardwareTelemetry | null>(null);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const res = await api.getHardware();
      setTelemetry(res.data);
    } catch (err) {
      console.warn('Hardware telemetry fetch error, using client fallback:', err);
      // Fallback telemetry if server offline
      setTelemetry({
        device: "Host Workstation (Local Fallback)",
        processor: "x86_64 Host Processor",
        architecture: "AMD64",
        is_snapdragon: false,
        is_arm64: false,
        npu_available: false,
        npu_name: "Qualcomm Hexagon NPU (Simulation Ready)",
        total_ram_gb: 16.0,
        available_ram_gb: 8.5,
        cpu_cores: "8 logical cores",
        active_provider: "CPUExecutionProvider",
        active_hardware: "cpu",
        available_providers: ["CPUExecutionProvider"],
        telemetry_status: "REAL LOCAL (CPU Execution)",
        optimization_mode: "Snapdragon Simulation Mode"
      });
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'welcome':
        return (
          <Welcome
            onNavigate={(route) => setCurrentRoute(route)}
            onStartJudgeDemo={() => setIsJudgeDemoOpen(true)}
            telemetry={telemetry}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={(route) => setCurrentRoute(route)}
            telemetry={telemetry}
            onRefreshTelemetry={fetchTelemetry}
          />
        );
      case 'assistant':
        return <Assistant onNavigate={(route) => setCurrentRoute(route)} />;
      case 'vision':
        return <VisionLab />;
      case 'security':
        return <SecurityLab />;
      case 'privacy':
        return <PrivacyCenter />;
      case 'documents':
        return <DocumentIntel />;
      case 'voice':
        return <VoiceLab onNavigate={(route) => setCurrentRoute(route)} />;
      case 'accessibility':
        return (
          <AccessibilityCenter
            highContrast={highContrast}
            reducedMotion={reducedMotion}
            onToggleHighContrast={() => setHighContrast(!highContrast)}
            onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
          />
        );
      case 'agent-lab':
        return <AgentLab />;
      case 'performance':
        return <PerformanceLab />;
      case 'activity':
        return <ActivityCenter />;
      case 'settings':
        return <SettingsPage onSettingsUpdated={fetchTelemetry} />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <Dashboard
            onNavigate={(route) => setCurrentRoute(route)}
            telemetry={telemetry}
            onRefreshTelemetry={fetchTelemetry}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans ${
      highContrast ? 'border-2 border-white' : ''
    }`}>
      {/* If welcome screen, full screen presentation */}
      {currentRoute === 'welcome' ? (
        <main className="flex-1 w-full">
          {renderActivePage()}
        </main>
      ) : (
        <div className="flex flex-1">
          {/* Persistent Left Sidebar */}
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={(route) => setCurrentRoute(route)}
            telemetry={telemetry}
          />

          {/* Main Content Area with Header */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header
              telemetry={telemetry}
              activeRoute={currentRoute}
              onNavigate={(route) => setCurrentRoute(route)}
              onStartJudgeDemo={() => setIsJudgeDemoOpen(true)}
            />

            <main className="flex-1 overflow-y-auto">
              {renderActivePage()}
            </main>
          </div>
        </div>
      )}

      {/* 3-Minute Guided Judge Demo Tour Modal */}
      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onNavigateToModule={(route) => setCurrentRoute(route)}
      />
    </div>
  );
}

export default App;
