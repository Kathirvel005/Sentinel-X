"""
Sentinel-X FastAPI Application Main Entry Point
Private On-Device Multimodal AI Guardian for Snapdragon PCs.
"""
import os
import sys
from pathlib import Path

# Add project root to sys.path to allow clean imports of ai and backend packages
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.database.database import engine, Base, SessionLocal
from backend.app.database.models import UserSettings
from backend.app.api.endpoints import router as api_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed default settings if empty
with SessionLocal() as db:
    if not db.query(UserSettings).first():
        db.add(UserSettings())
        db.commit()

app = FastAPI(
    title="SENTINEL-X AI Guardian",
    description="Private On-Device Multimodal AI Guardian for Snapdragon PCs",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "tauri://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive in local desktop/dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "app": "SENTINEL-X",
        "tagline": "See. Hear. Understand. Protect. Act.",
        "status": "ONLINE",
        "target": "Qualcomm Snapdragon PC / Windows On-Device AI",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
