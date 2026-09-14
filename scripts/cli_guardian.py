"""
Sentinel-X Interactive CLI Guardian Console
Full-featured terminal console providing direct access to all AI guardian capabilities.
"""
import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from ai.runtime.hardware_detector import HardwareDetector
from ai.security.scam_detector import ScamDetector
from ai.security.privacy_shield import PrivacyShield
from ai.document.document_analyzer import DocumentAnalyzer
from ai.orchestrator.agent_runner import AgentTaskRunner
from ai.runtime.benchmark import BenchmarkEngine

CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

def display_banner():
    print(f"{CYAN}{BOLD}")
    print("=" * 70)
    print("      SENTINEL-X | PRIVATE ON-DEVICE AI GUARDIAN CONSOLE       ")
    print("        Target: Qualcomm Snapdragon Windows PC (Hexagon NPU)   ")
    print("=" * 70)
    print(f"{RESET}")

def run_menu():
    display_banner()
    profile = HardwareDetector.get_profile()
    print(f"{BOLD}Active Hardware:{RESET} {profile.processor_name}")
    print(f"{BOLD}Runtime Status:{RESET}  {GREEN}{profile.telemetry_status}{RESET}\n")

    menu = """
Select Guardian Capability:
  [1] Scan Message for Scams / Phishing
  [2] Privacy Shield PII & Credential Masking
  [3] Analyze Document / Contract Risks
  [4] Execute Autonomous Agent Workflow
  [5] Run Live NPU / CPU Benchmark
  [6] Refresh Hardware Telemetry
  [0] Exit
    """
    print(menu)

def main():
    while True:
        run_menu()
        choice = input(f"{CYAN}Sentinel-X > {RESET}").strip()

        if choice == "1":
            print(f"\n{BOLD}Enter message to scan:{RESET}")
            msg = input("> ").strip()
            if not msg:
                msg = "URGENT: Your account is suspended. Verify password at http://verify-auth.xyz immediately."
            res = ScamDetector.analyze(msg)
            print(f"\n{RED if res['threat_level'] in ['HIGH', 'CRITICAL'] else GREEN}{BOLD}Threat Level:{RESET} {res['threat_level']} (Score: {res['risk_score']}/100)")
            print(f"{BOLD}Action:{RESET}       {res['recommended_action']}")
            print(f"{BOLD}Latency:{RESET}      {res['latency_ms']} ms\n")
            input("Press Enter to continue...")

        elif choice == "2":
            print(f"\n{BOLD}Enter text containing sensitive data:{RESET}")
            text = input("> ").strip()
            if not text:
                text = "Rajiv Sharma: Aadhaar 1234 5678 9012, PAN: ABCDE1234F, Card: 4111 2222 3333 4444"
            res = PrivacyShield.scan_text(text, auto_redact=True)
            print(f"\n{GREEN}{BOLD}Sanitized Text:{RESET} {res['redacted_text']}")
            print(f"{BOLD}Items Redacted:{RESET} {res['total_sensitive_items']} (Max Risk: {res['max_risk_level']})\n")
            input("Press Enter to continue...")

        elif choice == "3":
            print(f"\n{BOLD}Analyzing sample contract payload...{RESET}")
            sample = "Vendor NDA: Deploy Hexagon NPU models by Dec 15. Unauthorized breach incurs $10,000 penalty."
            res = DocumentAnalyzer.analyze_text(sample)
            print(f"{BOLD}Classification:{RESET} {res['classification']}")
            print(f"{BOLD}Summary:{RESET}        {res['summary']}")
            print(f"{BOLD}Risks Found:{RESET}    {len(res['risks'])}\n")
            input("Press Enter to continue...")

        elif choice == "4":
            print(f"\n{BOLD}Executing autonomous proposal workflow...{RESET}")
            res = AgentTaskRunner.execute_task("analyze_proposal")
            print(f"{GREEN}{BOLD}Completed:{RESET} {res['title']} ({len(res['steps'])} steps verified)\n")
            input("Press Enter to continue...")

        elif choice == "5":
            print(f"\n{BOLD}Running 25 iterations on host silicon...{RESET}")
            b = BenchmarkEngine.run_benchmark(iterations=25)
            print(f"{BOLD}Mean Latency:{RESET}   {b['avg_latency_ms']} ms")
            print(f"{BOLD}p95 Latency:{RESET}    {b['p95_latency_ms']} ms")
            print(f"{BOLD}Snapdragon NPU:{RESET} {b['snapdragon_npu_comparison']['projected_npu_latency_ms']} ms target\n")
            input("Press Enter to continue...")

        elif choice == "6":
            HardwareDetector.get_profile(force_refresh=True)
            print(f"\n{GREEN}Hardware telemetry refreshed.{RESET}\n")
            time.sleep(1)

        elif choice == "0":
            print("\nExiting Sentinel-X Console.")
            break
        else:
            print("\nInvalid selection.")
            time.sleep(1)

if __name__ == "__main__":
    main()
