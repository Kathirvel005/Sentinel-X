"""
Sentinel-X ONNX Runtime Engine
Manages model loading, session creation with QNN/DirectML/CPU fallback, and inference timing.
"""
import os
import time
import logging
import psutil
from typing import Any, Dict, List, Optional, Tuple
from ai.runtime.base_runtime import ExecutionProvider, HardwareTier, InferenceResult
from ai.runtime.hardware_detector import HardwareDetector
from ai.runtime.qnn_runtime import QNNRuntime

logger = logging.getLogger("sentinel.onnx")

class ONNXRuntimeManager:
    _instance = None
    _sessions: Dict[str, Any] = {}

    def __init__(self):
        self.hardware_profile = HardwareDetector.get_profile()
        self.qnn_driver = QNNRuntime()
        self.active_provider_name = self._resolve_provider()

    def _resolve_provider(self) -> str:
        providers = self.hardware_profile.available_providers
        if self.qnn_driver.is_available():
            return "QNNExecutionProvider"
        elif "DmlExecutionProvider" in providers:
            return "DmlExecutionProvider"
        elif "CUDAExecutionProvider" in providers:
            return "CUDAExecutionProvider"
        return "CPUExecutionProvider"

    def load_session(self, model_path: str, session_name: str) -> Tuple[Any, str, bool]:
        """
        Loads an ONNX session with preferred provider, falling back safely to CPU if needed.
        Returns (session, provider_used, is_fallback).
        """
        import onnxruntime as ort

        if session_name in self._sessions:
            return self._sessions[session_name], self.active_provider_name, False

        providers_to_try = []
        if self.qnn_driver.is_available():
            providers_to_try.append(self.qnn_driver.get_provider_spec())
        providers_to_try.append("CPUExecutionProvider")

        session = None
        used_provider = "CPUExecutionProvider"
        is_fallback = False

        try:
            session = ort.InferenceSession(model_path, providers=providers_to_try)
            used_provider = session.get_providers()[0]
            if "QNN" not in used_provider and self.qnn_driver.is_available():
                is_fallback = True
        except Exception as e:
            logger.warning(f"Preferred provider failed for {model_path}, falling back to CPU: {e}")
            session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
            used_provider = "CPUExecutionProvider"
            is_fallback = True

        self._sessions[session_name] = session
        return session, used_provider, is_fallback

    def run_inference(
        self,
        session_name: str,
        inputs: Dict[str, Any],
        fallback_fn: Optional[Any] = None
    ) -> InferenceResult:
        """Executes inference on named session or runs local CPU fallback logic with precise telemetry."""
        mem_before = psutil.Process().memory_info().rss / (1024 * 1024)
        start_time = time.perf_counter()

        if session_name in self._sessions:
            session = self._sessions[session_name]
            provider = session.get_providers()[0]
            hw = "npu" if "QNN" in provider else ("gpu" if "Dml" in provider else "cpu")
            try:
                raw_out = session.run(None, inputs)
                latency = (time.perf_counter() - start_time) * 1000
                mem_after = psutil.Process().memory_info().rss / (1024 * 1024)
                return InferenceResult(
                    success=True,
                    data=raw_out,
                    runtime="local",
                    execution_provider=provider,
                    hardware=hw,
                    latency_ms=latency,
                    memory_delta_mb=max(0.0, mem_after - mem_before),
                    fallback=False
                )
            except Exception as e:
                logger.error(f"Inference execution failed on {session_name}: {e}")

        # If model session not found or threw error, execute CPU fallback
        if fallback_fn is not None:
            res_data = fallback_fn(inputs)
            latency = (time.perf_counter() - start_time) * 1000
            mem_after = psutil.Process().memory_info().rss / (1024 * 1024)
            return InferenceResult(
                success=True,
                data=res_data,
                runtime="local",
                execution_provider="CPUExecutionProvider",
                hardware="cpu",
                latency_ms=latency,
                memory_delta_mb=max(0.0, mem_after - mem_before),
                fallback=True,
                warning="QNN acceleration unavailable — running optimized local CPU fallback"
            )

        latency = (time.perf_counter() - start_time) * 1000
        return InferenceResult(
            success=False,
            data=None,
            runtime="local",
            execution_provider="CPUExecutionProvider",
            hardware="cpu",
            latency_ms=latency,
            fallback=True,
            warning="No inference session or fallback handler defined"
        )
