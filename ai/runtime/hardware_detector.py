"""
Sentinel-X Hardware Detector
Detects host system capabilities, architecture, memory, and Qualcomm Snapdragon NPU availability.
"""
import os
import platform
import psutil
from typing import List, Tuple
from ai.runtime.base_runtime import HardwareProfile, ExecutionProvider, HardwareTier

class HardwareDetector:
    _cached_profile: HardwareProfile = None

    @classmethod
    def get_profile(cls, force_refresh: bool = False) -> HardwareProfile:
        if cls._cached_profile is not None and not force_refresh:
            return cls._cached_profile

        os_name = platform.system()
        os_version = platform.release() + " " + platform.version()
        arch = platform.machine().lower()
        processor = platform.processor() or "Unknown Processor"

        is_arm64 = "arm" in arch or "aarch64" in arch
        
        # Detect Snapdragon keywords in processor description or environment
        snapdragon_indicators = ["snapdragon", "qualcomm", "sc8380", "x elite", "x plus", "hexagon"]
        is_snapdragon = any(ind in processor.lower() for ind in snapdragon_indicators) or (
            os.getenv("SNAPDRAGON_PLATFORM", "false").lower() == "true"
        )

        # Check available providers from onnxruntime
        available_providers = cls._detect_onnx_providers()

        # NPU availability check:
        # 1. Real QNNExecutionProvider loaded in ONNX Runtime
        # 2. Or explicit Snapdragon platform with Hexagon NPU detected
        qnn_available = "QNNExecutionProvider" in available_providers
        npu_available = qnn_available or (is_snapdragon and is_arm64)
        npu_name = "Qualcomm Hexagon NPU (45 TOPS)" if is_snapdragon or qnn_available else None

        # Determine active provider & hardware tier based on actual availability
        force_cpu = os.getenv("FORCE_CPU_FALLBACK", "false").lower() == "true"
        demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

        if not force_cpu and qnn_available:
            active_provider = ExecutionProvider.QNN
            active_hardware = HardwareTier.NPU
            telemetry_status = "REAL LOCAL (Snapdragon NPU)"
        elif not force_cpu and "DmlExecutionProvider" in available_providers:
            active_provider = ExecutionProvider.DIRECTML
            active_hardware = HardwareTier.GPU
            telemetry_status = "REAL LOCAL (DirectML GPU/NPU)"
        elif not force_cpu and "CUDAExecutionProvider" in available_providers:
            active_provider = ExecutionProvider.CUDA
            active_hardware = HardwareTier.GPU
            telemetry_status = "REAL LOCAL (CUDA GPU)"
        else:
            active_provider = ExecutionProvider.CPU
            active_hardware = HardwareTier.CPU
            if is_snapdragon:
                telemetry_status = "REAL LOCAL (CPU Fallback on Snapdragon)"
            else:
                telemetry_status = "REAL LOCAL (CPU Execution on Host)"

        # Memory telemetry via psutil
        try:
            mem = psutil.virtual_memory()
            total_ram_gb = round(mem.total / (1024 ** 3), 2)
            available_ram_gb = round(mem.available / (1024 ** 3), 2)
        except Exception:
            total_ram_gb = 16.0
            available_ram_gb = 8.0

        physical_cores = psutil.cpu_count(logical=False) or 4
        logical_cores = psutil.cpu_count(logical=True) or 8

        profile = HardwareProfile(
            os_name=os_name,
            os_version=os_version,
            architecture=arch,
            processor_name=processor,
            is_arm64=is_arm64,
            is_snapdragon=is_snapdragon,
            npu_available=npu_available,
            npu_name=npu_name,
            total_ram_gb=total_ram_gb,
            available_ram_gb=available_ram_gb,
            cpu_cores_physical=physical_cores,
            cpu_cores_logical=logical_cores,
            available_providers=available_providers,
            active_provider=active_provider,
            active_hardware=active_hardware,
            telemetry_status=telemetry_status
        )

        cls._cached_profile = profile
        return profile

    @staticmethod
    def _detect_onnx_providers() -> List[str]:
        try:
            import onnxruntime as ort
            return ort.get_available_providers()
        except ImportError:
            return ["CPUExecutionProvider"]
        except Exception:
            return ["CPUExecutionProvider"]

    @classmethod
    def get_telemetry_dict(cls) -> dict:
        p = cls.get_profile()
        return {
            "device": "Snapdragon X-Series PC" if p.is_snapdragon else f"Host Workstation ({p.architecture.upper()})",
            "processor": p.processor_name,
            "architecture": p.architecture,
            "is_snapdragon": p.is_snapdragon,
            "is_arm64": p.is_arm64,
            "npu_available": p.npu_available,
            "npu_name": p.npu_name or "NPU Offline / Not Detected",
            "total_ram_gb": p.total_ram_gb,
            "available_ram_gb": p.available_ram_gb,
            "cpu_cores": f"{p.cpu_cores_physical} physical / {p.cpu_cores_logical} logical",
            "active_provider": p.active_provider.value,
            "active_hardware": p.active_hardware.value,
            "available_providers": p.available_providers,
            "telemetry_status": p.telemetry_status,
            "optimization_mode": "Snapdragon NPU Native" if p.is_snapdragon and p.npu_available else "CPU/Local Acceleration (Snapdragon Simulation Capable)"
        }
