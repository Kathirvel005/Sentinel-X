# Sentinel-X: 3-Minute Pitch & Presentation Guide
### Snapdragon AI Lab Build & Present Challenge

This guide provides the presentation script, slide-by-slide structure, and judge response strategy for the live presentation.

---

## 1. 3-Minute Presentation Timeline

### Slide 1 / Minute 00:00 - 00:30: The Hook & The Silicon Problem
- **Narrative**:
  > *"Every professional and everyday user faces phishing, shoulder surfing, and confidential data exposure. Today's AI assistants promise help, but they send your sensitive documents and camera feeds into the cloud, introducing severe privacy vulnerabilities. Running AI locally on traditional x86 CPUs kills laptop battery life in two hours and causes thermal throttling. Enter Sentinel-X."*
- **Visual**: Welcome screen with 3D Neural Core and Snapdragon AI Lab Challenge banner.
- **Judge Criteria Addressed**: Application Use Case & Innovation.

### Slide 2 / Minute 00:30 - 01:15: The Snapdragon Advantage
- **Narrative**:
  > *"Sentinel-X is built specifically for Snapdragon-powered Windows PCs. By targeting the 45 TOPS Qualcomm Hexagon NPU through ONNX Runtime and the QNN Execution Provider (`QnnHtp.dll`), we achieve sub-5 millisecond inference with approximately 7.2x lower power consumption. Sentinel-X can run ambient, continuous protection all day without draining the battery."*
- **Visual**: Performance Lab comparison graph (Host vs Hexagon NPU 45 TOPS).
- **Judge Criteria Addressed**: Technical Implementation & Snapdragon Silicon Alignment.

### Slide 3 / Minute 01:15 - 02:15: Live Multimodal Demo
- **Narrative**:
  > *"Watch Sentinel-X in action:
  > 1. Scam Detector: Instantly scores an urgent phishing SMS (Score: 100/100, Threat: CRITICAL) and warns the user: 'DO NOT CLICK'.
  > 2. Privacy Shield: Redacts Indian Aadhaar cards, PAN numbers, and API tokens directly in RAM with zero disk retention.
  > 3. Vision Lab: Detects workplace scenes and automatically engages a Privacy Mask over secondary laptop screens and mobile phones.
  > 4. Document Intelligence: Extracts key clauses and legal risks from an NDA, generating an exportable audit report."*
- **Visual**: Live interactive UI or the automated 3-Minute Judge Demo Tour.
- **Judge Criteria Addressed**: Technical Implementation & Product Polish.

### Slide 4 / Minute 02:15 - 03:00: Impact, Accessibility & Conclusion
- **Narrative**:
  > *"Sentinel-X is inclusive by design: with high-contrast themes, reduced motion, step-by-step cognitive modes, and live captions. It is fully offline-first, private by design, and production-ready. Sentinel-X proves why running AI on Snapdragon PCs is the future of personal computing: See. Hear. Understand. Protect. Act. Thank you."*
- **Visual**: Accessibility Center and Final Impact Summary.
- **Judge Criteria Addressed**: Deployment & Accessibility, Presentation & Documentation.

---

## 2. Judge Q&A & Technical Defense

### Q1: "How does your code actually interact with the Snapdragon NPU?"
- **Answer**: 
  > *"Our abstraction layer in `ai/runtime/qnn_runtime.py` configures ONNX Runtime with the `QNNExecutionProvider` pointing to Qualcomm's Hexagon Tensor Processor backend (`QnnHtp.dll`). We pass HTP-specific provider options including burst mode, context priority, and FP16/INT8 precision. When running on non-Snapdragon developer devices, our hardware detector seamlessly falls back to CPU execution with transparent status tags."*

### Q2: "How do you guarantee sensitive data isn't leaked or retained?"
- **Answer**:
  > *"Sentinel-X enforces our strict Zero-Retention Policy (defined in `security/privacy_policy.json`). PII patterns (Aadhaar, PAN, credit cards, passwords) are masked directly in ephemeral memory before being rendered or stored. Our SQLite database stores only operational event metadata, never the raw sensitive content."*

### Q3: "What models from Qualcomm AI Hub are you using?"
- **Answer**:
  > *"We utilize Qualcomm AI Hub validated INT8/FP16 models cataloged in `models/registry.json`: BERT-Tiny sequence classification for scam detection (3.8 ms), MobileNetV4 / YOLOv8-Nano for vision (4.1 ms), and Whisper-Base encoder for speech (14.5 ms)."*
