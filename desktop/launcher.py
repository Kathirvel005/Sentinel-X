"""
Sentinel-X Desktop Windows Launcher
Launches local backend API worker and connects to native frontend container.
"""
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

def start_desktop():
    print("[Sentinel-X] Starting On-Device Multimodal AI Guardian...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8005"],
        cwd=str(ROOT_DIR)
    )

    time.sleep(1.5)
    print("[Sentinel-X] Opening Desktop Interface on Snapdragon PC...")
    webbrowser.open("http://localhost:5174")

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        print("[Sentinel-X] Gracefully shutting down...")
        backend_proc.terminate()

if __name__ == "__main__":
    start_desktop()
