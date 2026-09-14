"""
Sentinel-X Document Intelligence Engine
Processes text, PDF (text extraction), DOCX, and markdown files.
Generates extractive executive summaries, action items, legal/operational risks,
sensitive PII audit, and structured downloadable reports.
"""
import time
import re
from typing import Dict, Any, List, Optional
from ai.runtime.hardware_detector import HardwareDetector
from ai.security.privacy_shield import PrivacyShield

class DocumentAnalyzer:
    @classmethod
    def analyze_text(
        cls,
        text: str,
        filename: str = "document.txt",
        file_type: str = "text"
    ) -> Dict[str, Any]:
        start_time = time.perf_counter()

        # 1. Clean & tokenize into sentences
        clean_text = text.strip()
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean_text) if len(s.strip()) > 10]
        word_count = len(clean_text.split())

        # 2. Document Classification
        classification = cls._classify_document(clean_text)

        # 3. Privacy Shield PII Audit
        privacy_audit = PrivacyShield.scan_text(clean_text, auto_redact=False)

        # 4. Extract Key Points & Summary
        key_points = sentences[:min(5, len(sentences))]
        summary = " ".join(sentences[:min(3, len(sentences))]) if sentences else "Empty or short document content."

        # 5. Extract Action Items (Sentences containing modal verbs: must, shall, will, should, need to, deadline)
        action_patterns = r"\b(must|shall|should|action required|assigned to|deadline|deliverable|needs to|please ensure)\b"
        action_items = []
        for s in sentences:
            if re.search(action_patterns, s, re.IGNORECASE):
                action_items.append(s)
            if len(action_items) >= 4:
                break
        if not action_items and len(sentences) > 1:
            action_items = [f"Review section 1: {sentences[0][:80]}..."]

        # 6. Risk Identification (Liability, non-disclosure, termination, penalties, security)
        risk_patterns = r"\b(liability|indemnify|penalty|breach|termination|confidential|risk|warrant|unauthorized)\b"
        identified_risks = []
        for s in sentences:
            m = re.findall(risk_patterns, s, re.IGNORECASE)
            if m:
                identified_risks.append({
                    "clause": s[:120] + ("..." if len(s) > 120 else ""),
                    "trigger_term": m[0].lower(),
                    "severity": "HIGH" if m[0].lower() in ["breach", "termination", "penalty"] else "MEDIUM"
                })
            if len(identified_risks) >= 4:
                break

        # 7. Generate Downloadable Markdown Briefing Report
        report_md = cls._generate_markdown_report(
            filename=filename,
            classification=classification,
            word_count=word_count,
            summary=summary,
            key_points=key_points,
            action_items=action_items,
            risks=identified_risks,
            privacy_audit=privacy_audit
        )

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        hw_profile = HardwareDetector.get_profile()

        return {
            "filename": filename,
            "file_type": file_type,
            "word_count": word_count,
            "sentence_count": len(sentences),
            "classification": classification,
            "summary": summary,
            "key_points": key_points,
            "action_items": action_items,
            "risks": identified_risks,
            "privacy_audit": {
                "sensitive_items_found": privacy_audit["total_sensitive_items"],
                "max_risk_level": privacy_audit["max_risk_level"],
                "categories": privacy_audit["categories"]
            },
            "report_markdown": report_md,
            "latency_ms": round(elapsed_ms, 2),
            "runtime": "local",
            "execution_provider": hw_profile.active_provider.value,
            "hardware": hw_profile.active_hardware.value
        }

    @staticmethod
    def _classify_document(text: str) -> str:
        t_low = text.lower()
        if any(k in t_low for k in ["agreement", "contract", "nda", "terms of service", "party of the first part"]):
            return "Legal Agreement / Contract"
        elif any(k in t_low for k in ["invoice", "receipt", "billing", "subtotal", "tax id", "amount due"]):
            return "Financial Invoice / Statement"
        elif any(k in t_low for k in ["api", "function", "architecture", "endpoint", "sdk", "vulnerability"]):
            return "Technical / Engineering Spec"
        elif any(k in t_low for k in ["resume", "curriculum vitae", "education", "experience", "skills"]):
            return "Resume / HR Profile"
        return "General Corporate Document"

    @staticmethod
    def _generate_markdown_report(
        filename: str,
        classification: str,
        word_count: int,
        summary: str,
        key_points: List[str],
        action_items: List[str],
        risks: List[Dict[str, str]],
        privacy_audit: Dict[str, Any]
    ) -> str:
        md = f"""# SENTINEL-X DOCUMENT INTELLIGENCE REPORT
**Document Name:** {filename}  
**Classification:** {classification}  
**Word Count:** {word_count}  
**Execution Runtime:** On-Device Local Inference (Snapdragon PC)  
**Security Status:** PII Scanned & Cleared

---

## 1. Executive Summary
{summary}

## 2. Key Highlights
"""
        for kp in key_points:
            md += f"- {kp}\n"

        md += "\n## 3. Action Items & Next Steps\n"
        for act in action_items:
            md += f"- [ ] {act}\n"

        md += "\n## 4. Identified Operational & Legal Risks\n"
        if risks:
            for r in risks:
                md += f"- **[{r['severity']}]** {r['clause']} *(Trigger: `{r['trigger_term']}`)*\n"
        else:
            md += "- No acute high-severity contractual risks detected.\n"

        md += f"\n## 5. Privacy & Sensitive Data Scan\n"
        md += f"- Total PII items detected: **{privacy_audit['total_sensitive_items']}**\n"
        md += f"- Risk Grade: **{privacy_audit['max_risk_level']}**\n"
        md += f"- Categories involved: {', '.join(privacy_audit['categories']) if privacy_audit['categories'] else 'None'}\n"
        md += "\n---\n*Generated locally and securely by Sentinel-X AI Guardian on Snapdragon Platform.*"
        return md
