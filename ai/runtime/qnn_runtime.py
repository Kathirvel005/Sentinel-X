"""
Sentinel-X Qualcomm QNN Execution Provider Abstraction
Handles configuration, verification, and inference targeting Qualcomm Hexagon NPU.
"""
import os
import logging
from typing import Any, Dict, List, Optional
from ai.runtime.base_runtime import ExecutionProvider, HardwareTier, InferenceResult

logger = logging.getLogger("sentinel.qnn")

class QNNRuntime:
    """Qualcomm Neural Network (QNN) Execution Provider Driver."""

    def __init__(self, backend_path: str = "QnnHtp.dll"):
        self.backend_path = backend_path
        self.is_supported = self._verify_qnn_support()
        self.provider_options = self._build_provider_options()

    def _verify_qnn_support(self) -> bool:
        """Check if ONNX Runtime has QNNExecutionProvider loaded."""
        try:
            import onnxruntime as ort
            available = ort.get_available_providers()
            return "QNNExecutionProvider" in available
        except Exception as e:
            logger.debug(f"QNN Provider check failed: {e}")
            return False

    def _build_provider_options(self) -> Dict[str, Any]:
        """Configure Qualcomm Hexagon Tensor Processor (HTP) options."""
        return {
            "backend_path": self.backend_path,
            "profiling_level": "basic",
            "qnn_context_priority": "high",
            "htp_performance_mode": "burst",
            "enable_htp_fp16_precision": "1"
        }

    def get_provider_spec(self) -> tuple:
        """Returns provider tuple for onnxruntime.InferenceSession."""
        if self.is_supported:
            return ("QNNExecutionProvider", self.provider_options)
        return ("CPUExecutionProvider", {})

    def is_available(self) -> bool:
        return self.is_supported
