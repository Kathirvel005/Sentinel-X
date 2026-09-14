# Contributing to Sentinel-X

Thank you for your interest in contributing to **Sentinel-X**, developed for the **Snapdragon AI Lab Build & Present Challenge**!

## Development Guidelines
1. **Snapdragon & NPU-First**: Ensure any new models are formatted or registered in [`models/registry.json`](file:///d:/Project%20work/snaapdragon/SENTINEL-X/models/registry.json) with Qualcomm Hexagon NPU target metadata.
2. **Local-Only Privacy Rule**: Never add features that silently transmit raw user text, documents, PII, or camera feeds to external cloud services without explicit user consent.
3. **Transparent Fallbacks**: If hardware acceleration is unavailable, always provide a clean CPU fallback and transparent status badge. Never display simulated metrics as real NPU hardware numbers.
4. **Testing**: Run pytest unit tests (`py -m pytest tests/ -v`) and frontend build checks (`npm run build`) before submitting pull requests.
