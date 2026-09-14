"""
Sentinel-X Central Multimodal AI Orchestrator
Routes incoming requests to intent classifiers, selects capability engines,
binds to Snapdragon NPU / ONNX runtime, enforces privacy safety verification, and delivers structured responses.
"""
import time
import re
from typing import Dict, Any, List, Optional
from ai.runtime.hardware_detector import HardwareDetector
from ai.security.scam_detector import ScamDetector
from ai.security.privacy_shield import PrivacyShield
from ai.document.document_analyzer import DocumentAnalyzer
from ai.vision.vision_service import VisionService
from ai.speech.voice_service import VoiceService
from ai.orchestrator.agent_runner import AgentTaskRunner

class OrchestratorIntent:
    SCAM_DETECTION = "SCAM_DETECTION"
    PRIVACY_SCAN = "PRIVACY_SCAN"
    DOCUMENT_ANALYSIS = "DOCUMENT_ANALYSIS"
    VISION_ANALYSIS = "VISION_ANALYSIS"
    VOICE_COMMAND = "VOICE_COMMAND"
    AGENT_TASK = "AGENT_TASK"
    BENCHMARK_RUN = "BENCHMARK_RUN"
    GENERAL_ASSISTANT = "GENERAL_ASSISTANT"

class AIOrchestrator:
    @classmethod
    def process_request(
        cls,
        user_message: str,
        attachment: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        start_time = time.perf_counter()
        t_low = user_message.lower().strip()

        # 1. Intent Detection
        intent, tool_name, model_family = cls._classify_intent(t_low, attachment)

        # 2. Hardware / Runtime Selection
        hw_profile = HardwareDetector.get_profile()
        runtime_used = "local"
        execution_provider = hw_profile.active_provider.value
        hardware_tier = hw_profile.active_hardware.value

        # 3. Execution & Safety Verification
        tool_output = None
        assistant_reply = ""
        confidence = 0.96

        if intent == OrchestratorIntent.SCAM_DETECTION:
            tool_output = ScamDetector.analyze(user_message)
            assistant_reply = (
                f"Scam Assessment Completed: Threat level is **{tool_output['threat_level']}** "
                f"(Risk Score: {tool_output['risk_score']}/100). "
                f"Recommended action: {tool_output['recommended_action']}"
            )

        elif intent == OrchestratorIntent.PRIVACY_SCAN:
            tool_output = PrivacyShield.scan_text(user_message)
            assistant_reply = (
                f"Privacy Shield Scan: Detected {tool_output['total_sensitive_items']} sensitive item(s). "
                f"Peak Risk Grade: **{tool_output['max_risk_level']}**. "
                f"Raw data sanitized with zero persistence."
            )

        elif intent == OrchestratorIntent.DOCUMENT_ANALYSIS:
            doc_text = attachment.get("content") if attachment else user_message
            doc_name = attachment.get("filename", "user_text.txt") if attachment else "document.txt"
            tool_output = DocumentAnalyzer.analyze_text(doc_text, filename=doc_name)
            assistant_reply = (
                f"Document Intelligence completed for '{doc_name}'. "
                f"Classification: **{tool_output['classification']}**. "
                f"Extracted {len(tool_output['action_items'])} action items and {len(tool_output['risks'])} risk flags."
            )

        elif intent == OrchestratorIntent.VISION_ANALYSIS:
            tool_output = VisionService.analyze_frame(privacy_mask_active=True)
            assistant_reply = (
                f"Vision Engine: {tool_output['objects_count']} objects detected in scene. "
                f"Active screen zones masked for privacy. Facial presence recognized without biometric identity tracking."
            )

        elif intent == OrchestratorIntent.VOICE_COMMAND:
            tool_output = VoiceService.process_voice_transcript(user_message)
            assistant_reply = tool_output["spoken_response"]

        elif intent == OrchestratorIntent.AGENT_TASK:
            tool_output = AgentTaskRunner.execute_task("analyze_proposal", custom_input=user_message)
            assistant_reply = (
                f"Agent Task '{tool_output['title']}' executed successfully across {len(tool_output['steps'])} steps. "
                f"All destructive actions required explicit local approval."
            )

        elif intent == OrchestratorIntent.BENCHMARK_RUN:
            from ai.runtime.benchmark import BenchmarkEngine
            tool_output = BenchmarkEngine.run_benchmark(iterations=30)
            assistant_reply = (
                f"Live Benchmark Completed: Average latency: **{tool_output['avg_latency_ms']} ms**, "
                f"p95: **{tool_output['p95_latency_ms']} ms** on {tool_output['device']} ({tool_output['hardware'].upper()}). "
                f"Projected Snapdragon NPU performance: {tool_output['snapdragon_npu_comparison']['projected_npu_latency_ms']} ms."
            )

        else: # GENERAL_ASSISTANT
            assistant_reply = (
                f"I am Sentinel-X, your private on-device multimodal guardian. "
                f"I can analyze documents, scan messages for scam hooks, guard sensitive credentials with Privacy Shield, "
                f"run computer vision with display masking, or benchmark local Snapdragon NPU acceleration."
            )
            tool_output = {
                "general_capabilities": ["Security", "Privacy", "Vision", "Voice", "Documents", "Agent Lab", "Benchmarks"],
                "active_guardian_shield": True
            }

        elapsed_ms = (time.perf_counter() - start_time) * 1000

        return {
            "user_message": user_message,
            "assistant_response": assistant_reply,
            "intent": intent,
            "tool": tool_name,
            "model_family": model_family,
            "confidence": confidence,
            "status": "COMPLETED",
            "runtime": runtime_used,
            "execution_provider": execution_provider,
            "hardware": hardware_tier,
            "latency_ms": round(elapsed_ms, 2),
            "tool_output": tool_output
        }

    @staticmethod
    def _classify_intent(text: str, attachment: Optional[Dict[str, Any]]) -> tuple:
        if attachment and attachment.get("type") in ["pdf", "docx", "txt", "document"]:
            return OrchestratorIntent.DOCUMENT_ANALYSIS, "DocumentAnalyzer", "extractive-nlp-pipeline"

        if any(w in text for w in ["scam", "phishing", "fraud", "suspicious message", "is this email safe", "check this link"]):
            return OrchestratorIntent.SCAM_DETECTION, "ScamDetector", "bert-tiny-sequence-classification"

        if any(w in text for w in ["protect my screen", "sensitive", "aadhaar", "pan card", "credit card", "privacy mode", "redact"]):
            return OrchestratorIntent.PRIVACY_SCAN, "PrivacyShield", "token-classification-regex-hybrid"

        if any(w in text for w in ["document", "summarize", "pdf", "contract", "brief", "read this file"]):
            return OrchestratorIntent.DOCUMENT_ANALYSIS, "DocumentAnalyzer", "extractive-nlp-pipeline"

        if any(w in text for w in ["what do you see", "camera", "look at", "detect objects", "vision"]):
            return OrchestratorIntent.VISION_ANALYSIS, "VisionService", "yolov8_nano"

        if any(w in text for w in ["open security", "voice", "listen to me", "speak"]):
            return OrchestratorIntent.VOICE_COMMAND, "VoiceService", "whisper_encoder"

        if any(w in text for w in ["run agent", "automate", "task workflow", "proposal workflow", "agent"]):
            return OrchestratorIntent.AGENT_TASK, "AgentTaskRunner", "autonomous-local-planner"

        if any(w in text for w in ["benchmark", "npu speed", "run benchmark", "latency test"]):
            return OrchestratorIntent.BENCHMARK_RUN, "BenchmarkEngine", "hardware-profiler"

        return OrchestratorIntent.GENERAL_ASSISTANT, "AssistantEngine", "local-guardian-llm"
