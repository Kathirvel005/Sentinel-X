export type PageRoute = 
  | 'welcome'
  | 'dashboard'
  | 'assistant'
  | 'vision'
  | 'voice'
  | 'security'
  | 'privacy'
  | 'documents'
  | 'accessibility'
  | 'agent-lab'
  | 'performance'
  | 'activity'
  | 'settings'
  | 'about'
  | 'judge-demo';

export interface HardwareTelemetry {
  device: string;
  processor: string;
  architecture: string;
  is_snapdragon: boolean;
  is_arm64: boolean;
  npu_available: boolean;
  npu_name: string;
  total_ram_gb: number;
  available_ram_gb: number;
  cpu_cores: string;
  active_provider: string;
  active_hardware: 'npu' | 'gpu' | 'cpu' | 'simulated';
  available_providers: string[];
  telemetry_status: string;
  optimization_mode: string;
}

export interface RuntimeStatus {
  active_provider: string;
  active_hardware: string;
  is_snapdragon: boolean;
  npu_available: boolean;
  available_providers: string[];
  status_label: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  runtime: 'local' | 'cloud' | 'demo';
  execution_provider: string;
  hardware: string;
  latency_ms: number;
  fallback?: boolean;
  warning?: string | null;
  data: T;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  tool?: string;
  model_family?: string;
  confidence?: number;
  runtime?: string;
  execution_provider?: string;
  hardware?: string;
  latency_ms?: number;
  tool_output?: any;
}

export interface ScamReason {
  type: string;
  weight: 'low' | 'medium' | 'high' | 'critical';
  detail: string;
}

export interface ScamResult {
  threat_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  message_type: string;
  reasons: ScamReason[];
  recommended_action: string;
  disclaimer: string;
  latency_ms: number;
  runtime: string;
  execution_provider: string;
  hardware: string;
}

export interface PrivacyDetection {
  type: string;
  category: string;
  risk_level: string;
  masked_preview: string;
  length: number;
  start: number;
  end: number;
  recommended_action: string;
}

export interface PrivacyResult {
  total_sensitive_items: number;
  max_risk_level: string;
  categories: string[];
  detections: PrivacyDetection[];
  redacted_text: string;
  zero_retention_verified: boolean;
  latency_ms: number;
  runtime: string;
  execution_provider: string;
  hardware: string;
}

export interface DocumentResult {
  filename: string;
  file_type: string;
  word_count: number;
  sentence_count: number;
  classification: string;
  summary: string;
  key_points: string[];
  action_items: string[];
  risks: Array<{ clause: string; trigger_term: string; severity: string }>;
  privacy_audit: {
    sensitive_items_found: number;
    max_risk_level: string;
    categories: string[];
  };
  report_markdown: string;
  latency_ms: number;
  runtime: string;
  execution_provider: string;
  hardware: string;
}

export interface VisionDetection {
  id: string;
  label: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
  privacy_risk: boolean;
  mask_applied: boolean;
}

export interface VisionResult {
  objects_count: number;
  detections: VisionDetection[];
  scene_description: string;
  face_presence_detected: boolean;
  identity_recognition_disabled: boolean;
  privacy_mask_enabled: boolean;
  alerts: Array<{ type: string; message: string }>;
  latency_ms: number;
  fps: number;
  runtime: string;
  execution_provider: string;
  hardware: string;
}

export interface BenchmarkResult {
  id?: number;
  model_id: string;
  model_name: string;
  device: string;
  architecture: string;
  runtime: string;
  execution_provider: string;
  hardware: string;
  iterations: number;
  warmup_iterations: number;
  avg_latency_ms: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms?: number;
  min_latency_ms?: number;
  max_latency_ms?: number;
  first_load_latency_ms?: number;
  memory_delta_mb: number;
  throughput_inferences_per_sec: number;
  history_samples?: number[];
  snapdragon_npu_comparison?: {
    projected_npu_latency_ms: number;
    projected_speedup_factor: string;
    npu_tops_rating: number;
    verification_note: string;
  };
}

export interface AgentStep {
  id: number;
  name: string;
  tool: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'CONFIRMATION_REQUIRED';
  duration_ms?: number;
  requires_confirmation: boolean;
  confirmation_granted?: boolean | null;
}

export interface AgentResult {
  task_id: string;
  task_type: string;
  title: string;
  status: string;
  steps: AgentStep[];
  output: {
    summary: string;
    risks: string[];
    opportunities: string[];
    recommendations: string[];
  };
  safety_confirmations_enforced: boolean;
  latency_ms: number;
}

export interface UserSettings {
  local_only: boolean;
  allow_cloud_ai: boolean;
  telemetry_enabled: boolean;
  preferred_runtime: string;
  camera_permission: boolean;
  microphone_permission: boolean;
  file_access_permission: boolean;
  dark_mode: boolean;
  reduced_motion: boolean;
  high_contrast: boolean;
}

export interface ActivityEvent {
  id: number;
  timestamp: number;
  action: string;
  category: string;
  runtime: string;
  execution_provider: string;
  status: string;
  privacy_level: string;
  details?: string;
}
