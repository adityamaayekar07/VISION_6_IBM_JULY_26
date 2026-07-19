"""
Vision 6 AI - Backend Server
FastAPI backend that proxies requests to Anthropic's Claude API.
Keeps the API key server-side only (never exposed to the frontend).
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes import chat, study_tools

app = FastAPI(
    title="Vision 6 AI Backend",
    description="Backend API for the Vision 6 AI exam preparation assistant",
    version="1.0.0",
)

# CORS: restrict this to your actual frontend origin(s) in production.
# Comma-separated list in the ALLOWED_ORIGINS env var, e.g.
# ALLOWED_ORIGINS=https://yourapp.com,http://localhost:5500
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5500").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(study_tools.router, prefix="/api/study", tags=["study-tools"])


@app.get("/")
def root():
    return {"status": "ok", "service": "vision6-ai-backend"}


@app.get("/health")
def health():
    """Used by AWS App Runner / Elastic Beanstalk / load balancer health checks."""
    return {"status": "healthy"}
