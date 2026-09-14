"""
Sentinel-X Scenario Benchmark Test Suite
Validates precision and recall across banking, delivery, crypto, and legitimate email vectors.
"""
import json
import pytest
from pathlib import Path
from ai.security.scam_detector import ScamDetector

DATASET_PATH = Path(__file__).resolve().parent.parent / "benchmarks" / "dataset.json"

def test_benchmark_scenarios():
    assert DATASET_PATH.exists()
    with open(DATASET_PATH, "r") as f:
        data = json.load(f)

    for case in data.get("test_cases", []):
        res = ScamDetector.analyze(case["text"])
        if case["expected_level"] == "SAFE":
            assert res["threat_level"] == "SAFE", f"False positive on {case['id']}"
            assert res["risk_score"] == 0
        else:
            assert res["threat_level"] in ["HIGH", "CRITICAL"], f"False negative on {case['id']}"
            assert res["risk_score"] >= case["expected_score_min"]
