# Sentinel-X Responsible AI Charter

Sentinel-X is built upon four core responsible AI principles designed for personal and enterprise desktop security:

---

## 1. Zero Sensitive Data Persistence
- **Principle**: Sensitive credentials, Government identification numbers (Aadhaar, PAN, SSN), credit card digits, and passwords must **never** be permanently written to storage volumes or telemetry logs.
- **Implementation**: The Privacy Shield processes text and visual buffers strictly in ephemeral memory. Detected PII is replaced with non-reversible category markers (e.g. `[REDACTED_AADHAAR]`) before any disk caching or UI rendering occurs.

---

## 2. Non-Biometric Computer Vision
- **Principle**: Ambient workspace protection must not infringe on individual biometric privacy.
- **Implementation**:
  - The Vision Lab detects **face presence** (to verify whether an occupant is seated at the computer) but **disables identity recognition** and facial feature template generation by default.
  - Display zones (laptops, phones, tablets) in the camera field of view are automatically blurred or covered with a digital Privacy Mask to prevent bystander shoulder surfing.

---

## 3. Advisory Fraud & Scam Classification
- **Principle**: Machine learning classifiers are probabilistic and must never replace human verification for high-consequence financial transactions.
- **Implementation**:
  - All scam and phishing evaluations are explicitly marked with an advisory disclaimer: *"AI assessment — verify important messages independently."*
  - The system provides the underlying heuristic triggers (urgency manipulation, credential requests, suspicious links) so users understand the reasoning rather than blindly trusting a single score.

---

## 4. Human-in-the-Loop Confirmation Gates
- **Principle**: Autonomous agents must not carry out irreversible, destructive, or external actions silently.
- **Implementation**:
  - The Agent Lab implements mandatory confirmation checkpoints.
  - File deletions, disk file saves, and external network transmissions require explicit interactive approval from the user before execution proceeds.
