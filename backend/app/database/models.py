"""
Sentinel-X Database Models
Strictly adheres to privacy rules: no sensitive credentials or raw PII are persisted.
"""
import time
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from backend.app.database.database import Base

class UserSettings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    local_only = Column(Boolean, default=True)
    allow_cloud_ai = Column(Boolean, default=False)
    telemetry_enabled = Column(Boolean, default=False)
    preferred_runtime = Column(String, default="auto") # auto, qnn, cpu
    camera_permission = Column(Boolean, default=True)
    microphone_permission = Column(Boolean, default=True)
    file_access_permission = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=True)
    reduced_motion = Column(Boolean, default=False)
    high_contrast = Column(Boolean, default=False)
    created_at = Column(Float, default=time.time)
    updated_at = Column(Float, default=time.time)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Float, default=time.time)
    action = Column(String, nullable=False)
    category = Column(String, default="GENERAL") # SECURITY, PRIVACY, DOCUMENT, VISION, VOICE, AGENT
    runtime = Column(String, default="local")
    execution_provider = Column(String, default="cpu")
    status = Column(String, default="COMPLETED")
    privacy_level = Column(String, default="PROTECTED")
    details = Column(Text, nullable=True)

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Float, default=time.time)
    message_type = Column(String, default="general")
    threat_level = Column(String, nullable=False)
    risk_score = Column(Integer, nullable=False)
    recommended_action = Column(String, nullable=False)
    reasons_summary = Column(Text, nullable=True)

class PrivacyEvent(Base):
    __tablename__ = "privacy_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Float, default=time.time)
    categories = Column(String, nullable=True)
    items_count = Column(Integer, default=0)
    max_risk = Column(String, default="LOW")
    action_taken = Column(String, default="REDACT")

class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Float, default=time.time)
    model_id = Column(String, nullable=False)
    device = Column(String, nullable=False)
    hardware = Column(String, nullable=False)
    execution_provider = Column(String, nullable=False)
    iterations = Column(Integer, default=50)
    avg_latency_ms = Column(Float, nullable=False)
    p50_latency_ms = Column(Float, nullable=False)
    p95_latency_ms = Column(Float, nullable=False)
    throughput_ips = Column(Float, default=0.0)
    memory_delta_mb = Column(Float, default=0.0)
