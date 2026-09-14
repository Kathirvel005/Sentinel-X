"""
Sentinel-X Pydantic API Schemas
Enforces strict input validation, type safety, and standardized response formatting.
"""
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class StandardResponse(BaseModel):
    success: bool = True
    runtime: str = "local"
    execution_provider: str = "cpu"
    hardware: str = "cpu"
    latency_ms: float = 0.0
    fallback: bool = False
    warning: Optional[str] = None
    data: Any = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    attachment: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None

class SecurityScanRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=20000)
    message_type: str = "general" # sms, email, whatsapp, url, social

class PrivacyScanRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)
    auto_redact: bool = True

class DocumentAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)
    filename: str = "document.txt"
    file_type: str = "text"

class VisionAnalyzeRequest(BaseModel):
    image_base64: Optional[str] = None
    privacy_mask_active: bool = True
    simulated_mode: bool = False

class VoiceTranscribeRequest(BaseModel):
    transcript: str = Field(..., min_length=1)

class AgentRunRequest(BaseModel):
    task_type: str = "analyze_proposal" # analyze_proposal, security_audit
    custom_input: Optional[str] = None

class BenchmarkRunRequest(BaseModel):
    model_id: str = "sentinel-scam-bert-tiny"
    iterations: int = 50
    warmup_iterations: int = 5

class SettingsUpdateRequest(BaseModel):
    local_only: Optional[bool] = None
    allow_cloud_ai: Optional[bool] = None
    telemetry_enabled: Optional[bool] = None
    preferred_runtime: Optional[str] = None
    camera_permission: Optional[bool] = None
    microphone_permission: Optional[bool] = None
    file_access_permission: Optional[bool] = None
    dark_mode: Optional[bool] = None
    reduced_motion: Optional[bool] = None
    high_contrast: Optional[bool] = None
