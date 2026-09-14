/**
 * Sentinel-X Frontend API Client
 * Connects to the local FastAPI backend (default port 8005 via Vite proxy)
 * with transparent offline demo fallbacks.
 */
import {
  ApiResponse,
  HardwareTelemetry,
  RuntimeStatus,
  ScamResult,
  PrivacyResult,
  DocumentResult,
  VisionResult,
  BenchmarkResult,
  AgentResult,
  UserSettings,
  ActivityEvent
} from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`API call to ${endpoint} failed, falling back to local client processing:`, err);
    throw err;
  }
}

export const api = {
  // System Telemetry
  getHealth: () => fetchJson<{ status: string; app_name: string }>('/health'),
  getHardware: () => fetchJson<HardwareTelemetry>('/hardware'),
  getRuntime: () => fetchJson<RuntimeStatus>('/runtime'),

  // Multimodal Chat
  sendChat: (message: string, attachment?: any) => 
    fetchJson<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, attachment })
    }),

  // Scam & Security Scanning
  scanSecurity: (message: string, message_type: string = 'general') =>
    fetchJson<ScamResult>('/security/scan', {
      method: 'POST',
      body: JSON.stringify({ message, message_type })
    }),

  // Privacy Shield PII Scan
  scanPrivacy: (text: string, auto_redact: boolean = true) =>
    fetchJson<PrivacyResult>('/privacy/scan', {
      method: 'POST',
      body: JSON.stringify({ text, auto_redact })
    }),

  // Document Intelligence
  analyzeDocument: (text: string, filename: string = 'document.txt', file_type: string = 'text') =>
    fetchJson<DocumentResult>('/document/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, filename, file_type })
    }),

  // Vision Analysis
  analyzeVision: (image_base64?: string, privacy_mask_active: boolean = true) =>
    fetchJson<VisionResult>('/vision/analyze', {
      method: 'POST',
      body: JSON.stringify({ image_base64, privacy_mask_active })
    }),

  // Voice Processing
  processVoice: (transcript: string) =>
    fetchJson<any>('/voice/transcribe', {
      method: 'POST',
      body: JSON.stringify({ transcript })
    }),

  // Agent Lab Execution
  runAgent: (task_type: string = 'analyze_proposal', custom_input?: string) =>
    fetchJson<AgentResult>('/agent/run', {
      method: 'POST',
      body: JSON.stringify({ task_type, custom_input })
    }),

  // Benchmark Runner & History
  runBenchmark: (model_id: string = 'sentinel-scam-bert-tiny', iterations: number = 50) =>
    fetchJson<BenchmarkResult>('/benchmark/run', {
      method: 'POST',
      body: JSON.stringify({ model_id, iterations })
    }),
  getBenchmarks: () => fetchJson<BenchmarkResult[]>('/benchmarks'),

  // Activity Log
  getActivity: (limit: number = 50) => fetchJson<ActivityEvent[]>(`/activity?limit=${limit}`),
  clearActivity: () => fetchJson<{ cleared: boolean }>('/activity', { method: 'DELETE' }),

  // User Settings
  getSettings: () => fetchJson<UserSettings>('/settings'),
  updateSettings: (settings: Partial<UserSettings>) =>
    fetchJson<UserSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
};
