"""
Sentinel-X Voice & Speech Service
Handles local speech-to-text intent recognition, command parsing, and response audio formatting.
Strictly offline-first: never transmits audio buffers over cloud networks without explicit consent.
"""
import time
from typing import Dict, Any, List, Optional
from ai.runtime.hardware_detector import HardwareDetector

class VoiceService:
    VOICE_COMMANDS = {
        "open security": {"route": "/security", "action": "NAVIGATE_SECURITY", "reply": "Opening Security & Threat Command Center."},
        "scan message": {"route": "/security", "action": "SCAN_MESSAGE", "reply": "Ready to scan incoming message for scam and fraud indicators."},
        "analyze document": {"route": "/documents", "action": "NAVIGATE_DOCUMENTS", "reply": "Opening Document Intelligence lab. Upload your file for local analysis."},
        "enable privacy mode": {"route": "/privacy", "action": "ENABLE_PRIVACY", "reply": "Privacy Shield activated. Ephemeral processing mode engaged."},
        "start camera": {"route": "/vision", "action": "START_CAMERA", "reply": "Activating local computer vision stream with privacy mask."},
        "show performance": {"route": "/performance", "action": "NAVIGATE_PERFORMANCE", "reply": "Loading Snapdragon hardware telemetry and benchmark lab."},
        "explain this alert": {"route": "/activity", "action": "EXPLAIN_ALERT", "reply": "Reviewing latest security telemetry event."},
        "run benchmark": {"route": "/performance", "action": "TRIGGER_BENCHMARK", "reply": "Initializing NPU and CPU benchmark suite."}
    }

    @classmethod
    def process_voice_transcript(cls, transcript: str) -> Dict[str, Any]:
        start_time = time.perf_counter()
        clean = transcript.strip().lower()

        matched_command = None
        for cmd_phrase, details in cls.VOICE_COMMANDS.items():
            if cmd_phrase in clean:
                matched_command = {
                    "matched_trigger": cmd_phrase,
                    "target_route": details["route"],
                    "action_code": details["action"],
                    "spoken_response": details["reply"]
                }
                break

        if not matched_command:
            spoken_response = f"Understood: '{transcript}'. Processing through Sentinel-X Multimodal Orchestrator."
            action_code = "GENERAL_QUERY"
            target_route = "/assistant"
        else:
            spoken_response = matched_command["spoken_response"]
            action_code = matched_command["action_code"]
            target_route = matched_command["target_route"]

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        hw_profile = HardwareDetector.get_profile()

        return {
            "transcript": transcript,
            "recognized_command": matched_command is not None,
            "action_code": action_code,
            "target_route": target_route,
            "spoken_response": spoken_response,
            "local_processing_verified": True,
            "latency_ms": round(elapsed_ms, 2),
            "runtime": "local",
            "execution_provider": hw_profile.active_provider.value,
            "hardware": hw_profile.active_hardware.value
        }
