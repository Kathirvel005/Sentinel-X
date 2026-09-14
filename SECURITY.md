# Security Policy

## Reporting Security Issues
Sentinel-X is a privacy-first AI desktop application. We take local data isolation and zero-retention policies seriously.

If you discover a security vulnerability (such as unintended telemetry leakage, unsafe memory persistence of credentials, or path traversal), please report it to our team rather than opening a public issue.

## Local Isolation Architecture
- **Ephemeral Processing**: Sensitive fields detected by Privacy Shield are processed strictly in volatile memory.
- **Sandboxed File Operations**: All document intelligence analyses occur locally within sandboxed paths.
- **Permission Enforcement**: Device sensors (Camera, Microphone, Network) are controlled by user-governed toggles in System Settings.
