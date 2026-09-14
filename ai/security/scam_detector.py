"""
Sentinel-X Scam & Phishing Detection Engine
Deep multi-heuristic & NLP scoring analyzing urgency, impersonation, payment demands,
credential harvesting, and malicious link indicators.
"""
import re
import time
from typing import Dict, Any, List, Tuple
from ai.runtime.hardware_detector import HardwareDetector

class ScamDetector:
    URGENCY_PATTERNS = [
        r"\b(urgent|immediately|act now|suspended|immediate action|within 24 hours|account will be terminated)\b",
        r"\b(last warning|final notice|emergency|action required|risk of closure)\b",
        r"\b(limited time|expire in \d+|don't wait)\b"
    ]

    IMPERSONATION_PATTERNS = [
        r"\b(paypal|apple support|microsoft support|bank of america|wells fargo|chase|amazon customer service)\b",
        r"\b(internal revenue service|irs|tax department|customs|dhl express|fedex delivery|postal service)\b",
        r"\b(it security department|system administrator|helpdesk support|kyc verification team)\b"
    ]

    CREDENTIAL_PATTERNS = [
        r"\b(password|passcode|one-time password|otp|pin code|security code)\b",
        r"\b(verify your account|confirm your login|update your credentials|reset password now)\b",
        r"\b(seed phrase|recovery phrase|secret key|private key)\b"
    ]

    FINANCIAL_PATTERNS = [
        r"\b(wire transfer|cryptocurrency|bitcoin|usdt|gift card|western union)\b",
        r"\b(you have won|lottery winner|cash prize|unclaimed refund|inheritance fund)\b",
        r"\b(overdue payment|invoice attached|processing fee|tax fee|customs duty payable)\b"
    ]

    SUSPICIOUS_LINK_PATTERNS = [
        r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}",
        r"https?://[^/\s]+\.(xyz|top|work|click|country|gq|cf|ml|tk|monster|link)/",
        r"https?://[^/\s]*(paypal|apple|microsoft|amazon|netflix|bank)[^/\s]*\.(?!com|org|net)[^/\s]+",
        r"bit\.ly/|tinyurl\.com/|t\.co/|cutt\.ly/"
    ]

    @classmethod
    def analyze(cls, text: str, message_type: str = "general") -> Dict[str, Any]:
        start_time = time.perf_counter()
        t_lower = text.lower()

        reasons = []
        threat_score = 0

        # 1. Urgency Detection
        urgency_matches = []
        for pat in cls.URGENCY_PATTERNS:
            found = re.findall(pat, t_lower, re.IGNORECASE)
            if found:
                urgency_matches.extend(found)
        if urgency_matches:
            threat_score += 25
            reasons.append({
                "type": "Urgency Manipulation",
                "weight": "high",
                "detail": f"Artificial pressure detected: '{urgency_matches[0]}'"
            })

        # 2. Impersonation Detection
        impersonation_matches = []
        for pat in cls.IMPERSONATION_PATTERNS:
            found = re.findall(pat, t_lower, re.IGNORECASE)
            if found:
                impersonation_matches.extend(found)
        if impersonation_matches:
            threat_score += 25
            reasons.append({
                "type": "Brand / Authority Impersonation",
                "weight": "high",
                "detail": f"Matches high-target entity: '{impersonation_matches[0]}'"
            })

        # 3. Credential Harvesting Detection
        credential_matches = []
        for pat in cls.CREDENTIAL_PATTERNS:
            found = re.findall(pat, t_lower, re.IGNORECASE)
            if found:
                credential_matches.extend(found)
        if credential_matches:
            threat_score += 35
            reasons.append({
                "type": "Credential / Secret Harvesting",
                "weight": "critical",
                "detail": f"Direct solicitation of sensitive credentials: '{credential_matches[0]}'"
            })

        # 4. Financial Request Detection
        financial_matches = []
        for pat in cls.FINANCIAL_PATTERNS:
            found = re.findall(pat, t_lower, re.IGNORECASE)
            if found:
                financial_matches.extend(found)
        if financial_matches:
            threat_score += 20
            reasons.append({
                "type": "Financial Solicitation / Prize Hook",
                "weight": "high",
                "detail": f"Monetary transfer or prize lure detected: '{financial_matches[0]}'"
            })

        # 5. Malicious / Suspicious URL Detection
        url_matches = []
        for pat in cls.SUSPICIOUS_LINK_PATTERNS:
            found = re.findall(pat, text, re.IGNORECASE)
            if found:
                url_matches.extend(found)
        if url_matches:
            threat_score += 30
            reasons.append({
                "type": "Deceptive URL / Link Masking",
                "weight": "critical",
                "detail": "Shortened, raw IP, or suspicious TLD link observed."
            })

        # Normalize score
        threat_score = min(100, threat_score)

        # Classify threat level
        if threat_score >= 80:
            threat_level = "CRITICAL"
            recommended_action = "DO NOT CLICK. BLOCK SENDER & REPORT AS FRAUD."
        elif threat_score >= 50:
            threat_level = "HIGH"
            recommended_action = "DO NOT CLICK LINKS. VERIFY INDEPENDENTLY VIA OFFICIAL CHANNELS."
        elif threat_score >= 25:
            threat_level = "MEDIUM"
            recommended_action = "EXERCISE CAUTION. TREAT AS POTENTIALLY UNSOLICITED."
        elif threat_score > 0:
            threat_level = "LOW"
            recommended_action = "MINOR RISK SIGNALS. VERIFY SENDER ADDRESS."
        else:
            threat_level = "SAFE"
            recommended_action = "NO APPARENT SCAM PATTERNS IDENTIFIED."

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        hw_profile = HardwareDetector.get_profile()

        return {
            "threat_level": threat_level,
            "risk_score": threat_score,
            "message_type": message_type,
            "reasons": reasons,
            "recommended_action": recommended_action,
            "disclaimer": "AI assessment — verify important messages independently.",
            "latency_ms": round(elapsed_ms, 2),
            "runtime": "local",
            "execution_provider": hw_profile.active_provider.value,
            "hardware": hw_profile.active_hardware.value
        }
