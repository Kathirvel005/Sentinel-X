"""
Sentinel-X Backend Test Suite
Verifies hardware detection, scam analysis, privacy shielding, document intelligence,
benchmarks, and API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from ai.runtime.hardware_detector import HardwareDetector
from ai.runtime.benchmark import BenchmarkEngine
from ai.security.scam_detector import ScamDetector
from ai.security.privacy_shield import PrivacyShield
from ai.document.document_analyzer import DocumentAnalyzer
from ai.orchestrator.orchestrator import AIOrchestrator

client = TestClient(app)

def test_hardware_detector():
    profile = HardwareDetector.get_profile(force_refresh=True)
    assert profile.os_name is not None
    assert profile.architecture is not None
    assert profile.total_ram_gb > 0
    assert profile.active_provider is not None
    assert profile.telemetry_status is not None

def test_scam_detector_phishing_email():
    phishing_text = (
        "URGENT: Your PayPal account has been suspended! "
        "Verify your password and OTP immediately within 24 hours at http://paypal.verify-auth.xyz "
        "or your funds will be permanently locked."
    )
    res = ScamDetector.analyze(phishing_text)
    assert res["threat_level"] in ["HIGH", "CRITICAL"]
    assert res["risk_score"] >= 70
    assert len(res["reasons"]) >= 3
    assert "DO NOT CLICK" in res["recommended_action"]

def test_scam_detector_legitimate_email():
    safe_text = "Hi team, please find attached the meeting notes from today's design sync. Have a great weekend!"
    res = ScamDetector.analyze(safe_text)
    assert res["threat_level"] == "SAFE"
    assert res["risk_score"] == 0

def test_privacy_shield_aadhaar_and_credit_card():
    sensitive_text = (
        "Customer Aadhaar: 1234 5678 9012, PAN: ABCDE1234F, "
        "Credit Card: 4111 2222 3333 4444, Secret Token: api_key=sk_live_998877665544332211"
    )
    res = PrivacyShield.scan_text(sensitive_text, auto_redact=True)
    assert res["total_sensitive_items"] >= 4
    assert res["max_risk_level"] == "CRITICAL"
    # Ensure sensitive credentials are masked in redacted output
    assert "1234 5678 9012" not in res["redacted_text"]
    assert "4111 2222 3333 4444" not in res["redacted_text"]
    assert "[REDACTED_" in res["redacted_text"]

def test_document_analyzer():
    sample_doc = (
        "Confidential Master Services Agreement. "
        "The Vendor shall deliver the AI system by November 30. "
        "Failure to deliver incurs a penalty of $10,000. "
        "Each party agrees to indemnify the other against unauthorized breach."
    )
    res = DocumentAnalyzer.analyze_text(sample_doc, filename="contract.txt")
    assert res["classification"] == "Legal Agreement / Contract"
    assert len(res["action_items"]) > 0
    assert len(res["risks"]) > 0
    assert "SENTINEL-X DOCUMENT INTELLIGENCE REPORT" in res["report_markdown"]

def test_benchmark_engine():
    res = BenchmarkEngine.run_benchmark(iterations=10, warmup_iterations=2)
    assert res["iterations"] == 10
    assert res["avg_latency_ms"] > 0
    assert res["p50_latency_ms"] > 0
    assert res["p95_latency_ms"] >= res["p50_latency_ms"]
    assert "snapdragon_npu_comparison" in res

def test_api_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "HEALTHY"

def test_api_hardware_endpoint():
    response = client.get("/api/hardware")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "device" in data["data"]
    assert "cpu_cores" in data["data"]

def test_api_chat_orchestration():
    response = client.post("/api/chat", json={"message": "Is this email a scam: You won $10,000 lottery! Click here!"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["intent"] == "SCAM_DETECTION"
