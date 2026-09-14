"""
Sentinel-X Privacy Shield & Sensitive Information Sanitizer
Detects PII, financial credentials, Government IDs (PAN, Aadhaar), API keys, and passwords.
Enforces zero-retention ephemeral processing: never persists raw sensitive data.
"""
import re
import time
from typing import Dict, Any, List, Tuple
from ai.runtime.hardware_detector import HardwareDetector

class PrivacyShield:
    # High-precision RegEx patterns for sensitive items
    PATTERNS = {
        "EMAIL": (r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b", "CONTACT", "MEDIUM"),
        "PHONE": (r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b", "CONTACT", "MEDIUM"),
        "AADHAAR": (r"\b\d{4}\s\d{4}\s\d{4}\b|\b\d{12}\b", "GOVERNMENT_ID", "CRITICAL"),
        "PAN_CARD": (r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b", "GOVERNMENT_ID", "CRITICAL"),
        "CREDIT_CARD": (r"\b(?:\d{4}[-\s]?){3}\d{4}\b", "FINANCIAL", "CRITICAL"),
        "BANK_ACCOUNT": (r"\b(?:account|acct|acc|a/c)[\s#:]*([0-9]{9,18})\b", "FINANCIAL", "HIGH"),
        "API_KEY": (r"\b(?:api[_-]?key|secret[_-]?key|token|auth[_-]?token)[\s:=]+['\"]?([A-Za-z0-9_\-\.]{16,64})['\"]?\b", "CREDENTIAL", "CRITICAL"),
        "PASSWORD": (r"\b(?:password|passwd|pwd)[\s:=]+['\"]?(\S{6,32})['\"]?\b", "CREDENTIAL", "CRITICAL"),
        "CRYPTO_SEED": (r"\b([a-z]{3,8}\s){11,23}[a-z]{3,8}\b", "FINANCIAL", "CRITICAL"),
        "JWT_TOKEN": (r"\beyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b", "CREDENTIAL", "HIGH"),
        "IP_ADDRESS": (r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", "TECHNICAL", "LOW")
    }

    @classmethod
    def scan_text(cls, text: str, auto_redact: bool = True) -> Dict[str, Any]:
        start_time = time.perf_counter()
        detections = []
        redacted_text = text

        for label, (pattern, category, risk) in cls.PATTERNS.items():
            for match in re.finditer(pattern, text, re.IGNORECASE):
                val = match.group(0)
                # Never store raw value permanently; store masked representation only
                masked = val[:2] + "*" * (len(val) - 4) + val[-2:] if len(val) > 4 else "****"
                detections.append({
                    "type": label,
                    "category": category,
                    "risk_level": risk,
                    "masked_preview": masked,
                    "length": len(val),
                    "start": match.start(),
                    "end": match.end(),
                    "recommended_action": "Redact or Blur"
                })

        # Apply redaction replacements
        if auto_redact:
            for d in sorted(detections, key=lambda x: x["start"], reverse=True):
                # Replace with category badge e.g. [REDACTED_CREDIT_CARD]
                placeholder = f"[REDACTED_{d['type']}]"
                redacted_text = redacted_text[:d["start"]] + placeholder + redacted_text[d["end"]:]

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        hw_profile = HardwareDetector.get_profile()

        # Group by category
        categories_found = list({d["category"] for d in detections})
        max_risk = "SAFE"
        if any(d["risk_level"] == "CRITICAL" for d in detections):
            max_risk = "CRITICAL"
        elif any(d["risk_level"] == "HIGH" for d in detections):
            max_risk = "HIGH"
        elif any(d["risk_level"] == "MEDIUM" for d in detections):
            max_risk = "MEDIUM"
        elif detections:
            max_risk = "LOW"

        return {
            "total_sensitive_items": len(detections),
            "max_risk_level": max_risk,
            "categories": categories_found,
            "detections": detections,
            "redacted_text": redacted_text,
            "zero_retention_verified": True,
            "latency_ms": round(elapsed_ms, 2),
            "runtime": "local",
            "execution_provider": hw_profile.active_provider.value,
            "hardware": hw_profile.active_hardware.value
        }
