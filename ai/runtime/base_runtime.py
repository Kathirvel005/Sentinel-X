"""
Sentinel-X Base Runtime Abstraction
Defines common types, interfaces, and results for Snapdragon NPU, ONNX, and CPU execution.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional
import time

class ExecutionProvider(str, Enum):
    QNN = "qnn"                    # Qualcomm Neural Network / Hexagon NPU
    DIRECTML = "dml"              # DirectML (Windows GPU/NPU)
    CUDA = "cuda"                  # NVIDIA GPU (if present)
    CPU = "cpu"                    # Local Host CPU Execution Provider
    SIMULATION = "simulation"      # Demo / Simulated hardware acceleration

class HardwareTier(str, Enum):
    NPU = "npu"
    GPU = "gpu"
    CPU = "cpu"
    CLOUD = "cloud"
    SIMULATED = "simulated"

@dataclass
class HardwareProfile:
    os_name: str
    os_version: str
    architecture: str
    processor_name: str
    is_arm64: bool
    is_snapdragon: bool
    npu_available: bool
    npu_name: Optional[str]
    total_ram_gb: float
    available_ram_gb: float
    cpu_cores_physical: int
    cpu_cores_logical: int
    available_providers: List[str]
    active_provider: ExecutionProvider
    active_hardware: HardwareTier
    telemetry_status: str

@dataclass
class InferenceResult:
    success: bool
    data: Any
    runtime: str                  # "local", "cloud", "demo"
    execution_provider: str       # "qnn", "dml", "cpu", "simulation"
    hardware: str                 # "npu", "gpu", "cpu", "simulated"
    latency_ms: float
    first_load_latency_ms: float = 0.0
    memory_delta_mb: float = 0.0
    fallback: bool = False
    warning: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "runtime": self.runtime,
            "execution_provider": self.execution_provider,
            "hardware": self.hardware,
            "latency_ms": round(self.latency_ms, 2),
            "first_load_latency_ms": round(self.first_load_latency_ms, 2),
            "memory_delta_mb": round(self.memory_delta_mb, 2),
            "fallback": self.fallback,
            "warning": self.warning,
            "data": self.data,
            "metadata": self.metadata
        }
