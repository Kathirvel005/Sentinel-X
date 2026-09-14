"""
Sentinel-X REST API Endpoints
Implements clean routing, local auditing, security validation, and standardized JSON payloads.
"""
import time
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.database.models import UserSettings, ActivityLog, SecurityEvent, PrivacyEvent, BenchmarkResult
from backend.app.schemas.schemas import (
    StandardResponse, ChatRequest, SecurityScanRequest, PrivacyScanRequest,
    DocumentAnalyzeRequest, VisionAnalyzeRequest, VoiceTranscribeRequest,
    AgentRunRequest, BenchmarkRunRequest, SettingsUpdateRequest
)
from ai.runtime.hardware_detector import HardwareDetector
from ai.runtime.benchmark import BenchmarkEngine
from ai.orchestrator.orchestrator import AIOrchestrator
from ai.security.scam_detector import ScamDetector
from ai.security.privacy_shield import PrivacyShield
from ai.document.document_analyzer import DocumentAnalyzer
from ai.vision.vision_service import VisionService
from ai.speech.voice_service import VoiceService
from ai.orchestrator.agent_runner import AgentTaskRunner

router = APIRouter()

# ----------------- SYSTEM & TELEMETRY -----------------

@router.get("/health", response_model=StandardResponse)
def get_health():
    profile = HardwareDetector.get_profile()
    return StandardResponse(
        success=True,
        runtime="local",
        execution_provider=profile.active_provider.value,
        hardware=profile.active_hardware.value,
        data={
            "status": "HEALTHY",
            "app_name": "Sentinel-X",
            "version": "1.0.0",
            "local_only_enforced": True,
            "timestamp": time.time()
        }
    )

@router.get("/hardware", response_model=StandardResponse)
def get_hardware_telemetry():
    telemetry = HardwareDetector.get_telemetry_dict()
    profile = HardwareDetector.get_profile()
    return StandardResponse(
        success=True,
        runtime="local",
        execution_provider=profile.active_provider.value,
        hardware=profile.active_hardware.value,
        data=telemetry
    )

@router.get("/runtime", response_model=StandardResponse)
def get_runtime_status():
    profile = HardwareDetector.get_profile()
    return StandardResponse(
        success=True,
        runtime="local",
        execution_provider=profile.active_provider.value,
        hardware=profile.active_hardware.value,
        fallback="qnn" not in profile.active_provider.value,
        warning="QNN acceleration unavailable on current host — using CPU fallback" if "qnn" not in profile.active_provider.value else None,
        data={
            "active_provider": profile.active_provider.value,
            "active_hardware": profile.active_hardware.value,
            "is_snapdragon": profile.is_snapdragon,
            "npu_available": profile.npu_available,
            "available_providers": profile.available_providers,
            "status_label": profile.telemetry_status
        }
    )

# ----------------- MULTIMODAL ASSISTANT -----------------

@router.post("/chat", response_model=StandardResponse)
def chat_orchestration(req: ChatRequest, db: Session = Depends(get_db)):
    res = AIOrchestrator.process_request(req.message, attachment=req.attachment, context=req.context)
    
    # Audit event locally
    log_entry = ActivityLog(
        action=f"AI Chat: {res['intent']}",
        category="ASSISTANT",
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        status=res["status"],
        privacy_level="PROTECTED",
        details=f"Tool: {res['tool']} | Latency: {res['latency_ms']}ms"
    )
    db.add(log_entry)
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- SECURITY & SCAM DETECTION -----------------

@router.post("/security/scan", response_model=StandardResponse)
def scan_security_message(req: SecurityScanRequest, db: Session = Depends(get_db)):
    res = ScamDetector.analyze(req.message, message_type=req.message_type)

    # Persist security assessment without storing message content
    sec_event = SecurityEvent(
        message_type=req.message_type,
        threat_level=res["threat_level"],
        risk_score=res["risk_score"],
        recommended_action=res["recommended_action"],
        reasons_summary=json.dumps([r["type"] for r in res["reasons"]])
    )
    db.add(sec_event)

    db.add(ActivityLog(
        action=f"Scam Scan: {res['threat_level']} (Score: {res['risk_score']})",
        category="SECURITY",
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        details=f"Reasons: {len(res['reasons'])}"
    ))
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- PRIVACY SHIELD -----------------

@router.post("/privacy/scan", response_model=StandardResponse)
def scan_privacy_text(req: PrivacyScanRequest, db: Session = Depends(get_db)):
    res = PrivacyShield.scan_text(req.text, auto_redact=req.auto_redact)

    # Record event metrics only — strictly zero retention of raw PII
    if res["total_sensitive_items"] > 0:
        db.add(PrivacyEvent(
            categories=",".join(res["categories"]),
            items_count=res["total_sensitive_items"],
            max_risk=res["max_risk_level"],
            action_taken="REDACTED" if req.auto_redact else "AUDITED"
        ))

    db.add(ActivityLog(
        action=f"Privacy Shield Scan: {res['total_sensitive_items']} item(s)",
        category="PRIVACY",
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        details=f"Max Risk: {res['max_risk_level']}"
    ))
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- DOCUMENT INTELLIGENCE -----------------

@router.post("/document/analyze", response_model=StandardResponse)
def analyze_document(req: DocumentAnalyzeRequest, db: Session = Depends(get_db)):
    res = DocumentAnalyzer.analyze_text(req.text, filename=req.filename, file_type=req.file_type)

    db.add(ActivityLog(
        action=f"Document Analyzed: {req.filename}",
        category="DOCUMENT",
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        details=f"Classification: {res['classification']} | Risks: {len(res['risks'])}"
    ))
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- VISION SERVICE -----------------

@router.post("/vision/analyze", response_model=StandardResponse)
def analyze_vision(req: VisionAnalyzeRequest, db: Session = Depends(get_db)):
    res = VisionService.analyze_frame(
        image_base64=req.image_base64,
        privacy_mask_active=req.privacy_mask_active,
        simulated_mode=req.simulated_mode
    )

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- VOICE SERVICE -----------------

@router.post("/voice/transcribe", response_model=StandardResponse)
def process_voice(req: VoiceTranscribeRequest, db: Session = Depends(get_db)):
    res = VoiceService.process_voice_transcript(req.transcript)

    db.add(ActivityLog(
        action=f"Voice Command: {res['action_code']}",
        category="VOICE",
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        details=f"Recognized: {res['recognized_command']}"
    ))
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- AGENT TASK RUNNER -----------------

@router.post("/agent/run", response_model=StandardResponse)
def run_agent_workflow(req: AgentRunRequest, db: Session = Depends(get_db)):
    res = AgentTaskRunner.execute_task(req.task_type, custom_input=req.custom_input)

    db.add(ActivityLog(
        action=f"Agent Executed: {res['title']}",
        category="AGENT",
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        details=f"Status: {res['status']} | Steps: {len(res['steps'])}"
    ))
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["latency_ms"],
        data=res
    )

# ----------------- BENCHMARK LAB -----------------

@router.post("/benchmark/run", response_model=StandardResponse)
def trigger_benchmark(req: BenchmarkRunRequest, db: Session = Depends(get_db)):
    res = BenchmarkEngine.run_benchmark(
        model_id=req.model_id,
        iterations=req.iterations,
        warmup_iterations=req.warmup_iterations
    )

    # Save benchmark record
    b_record = BenchmarkResult(
        model_id=res["model_id"],
        device=res["device"],
        hardware=res["hardware"],
        execution_provider=res["execution_provider"],
        iterations=res["iterations"],
        avg_latency_ms=res["avg_latency_ms"],
        p50_latency_ms=res["p50_latency_ms"],
        p95_latency_ms=res["p95_latency_ms"],
        throughput_ips=res["throughput_inferences_per_sec"],
        memory_delta_mb=res["memory_delta_mb"]
    )
    db.add(b_record)

    db.add(ActivityLog(
        action=f"Benchmark Executed: {res['model_name']}",
        category="PERFORMANCE",
        runtime="local",
        execution_provider=res["execution_provider"],
        details=f"Avg: {res['avg_latency_ms']}ms | p95: {res['p95_latency_ms']}ms"
    ))
    db.commit()

    return StandardResponse(
        success=True,
        runtime=res["runtime"],
        execution_provider=res["execution_provider"],
        hardware=res["hardware"],
        latency_ms=res["avg_latency_ms"],
        data=res
    )

@router.get("/benchmarks", response_model=StandardResponse)
def list_benchmark_results(db: Session = Depends(get_db)):
    records = db.query(BenchmarkResult).order_by(BenchmarkResult.timestamp.desc()).limit(20).all()
    results = [
        {
            "id": r.id,
            "timestamp": r.timestamp,
            "model_id": r.model_id,
            "device": r.device,
            "hardware": r.hardware,
            "execution_provider": r.execution_provider,
            "iterations": r.iterations,
            "avg_latency_ms": r.avg_latency_ms,
            "p50_latency_ms": r.p50_latency_ms,
            "p95_latency_ms": r.p95_latency_ms,
            "throughput_ips": r.throughput_ips,
            "memory_delta_mb": r.memory_delta_mb
        }
        for r in records
    ]
    return StandardResponse(
        success=True,
        data=results
    )

# ----------------- ACTIVITY CENTER -----------------

@router.get("/activity", response_model=StandardResponse)
def get_activity_log(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(limit).all()
    data = [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "action": l.action,
            "category": l.category,
            "runtime": l.runtime,
            "execution_provider": l.execution_provider,
            "status": l.status,
            "privacy_level": l.privacy_level,
            "details": l.details
        }
        for l in logs
    ]
    return StandardResponse(success=True, data=data)

@router.delete("/activity", response_model=StandardResponse)
def clear_activity_log(db: Session = Depends(get_db)):
    db.query(ActivityLog).delete()
    db.commit()
    return StandardResponse(success=True, data={"cleared": True})

# ----------------- USER SETTINGS -----------------

@router.get("/settings", response_model=StandardResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return StandardResponse(
        success=True,
        data={
            "local_only": settings.local_only,
            "allow_cloud_ai": settings.allow_cloud_ai,
            "telemetry_enabled": settings.telemetry_enabled,
            "preferred_runtime": settings.preferred_runtime,
            "camera_permission": settings.camera_permission,
            "microphone_permission": settings.microphone_permission,
            "file_access_permission": settings.file_access_permission,
            "dark_mode": settings.dark_mode,
            "reduced_motion": settings.reduced_motion,
            "high_contrast": settings.high_contrast
        }
    )

@router.put("/settings", response_model=StandardResponse)
def update_settings(req: SettingsUpdateRequest, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)

    for field, val in req.model_dump(exclude_unset=True).items():
        setattr(settings, field, val)

    settings.updated_at = time.time()
    db.commit()
    db.refresh(settings)

    return StandardResponse(
        success=True,
        data={
            "local_only": settings.local_only,
            "allow_cloud_ai": settings.allow_cloud_ai,
            "telemetry_enabled": settings.telemetry_enabled,
            "preferred_runtime": settings.preferred_runtime,
            "camera_permission": settings.camera_permission,
            "microphone_permission": settings.microphone_permission,
            "file_access_permission": settings.file_access_permission,
            "dark_mode": settings.dark_mode,
            "reduced_motion": settings.reduced_motion,
            "high_contrast": settings.high_contrast
        }
    )
