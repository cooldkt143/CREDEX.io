from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.resume import router as resume_router
from app.api.routes.auth import router as auth_router
from resume_builder.router import router as resume_builder_router
from idanalyze.router import router as idanalyze_router
from ats_checker.router import router as ats_router
from credex_analyze.router import router as credex_router
from roadmap_builder.router import router as roadmap_router


import os
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="CREDEX Backend")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Read allowed frontend URLs from environment variables
frontend_url = os.getenv("FRONTEND_URL")
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://credex-io.vercel.app",
]
if frontend_url:
    if "," in frontend_url:
        origins.extend([url.strip() for url in frontend_url.split(",") if url.strip()])
    else:
        origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex="https://.*\\.vercel\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Auth"]
)

app.include_router(
    resume_router,
    prefix="/api/resume",
    tags=["Resume Analyzer"]
)

app.include_router(
    idanalyze_router,
    prefix="/idanalyze",
    tags=["ID Analyze"]
)

app.include_router(
    resume_builder_router,
    prefix="/resume-builder",
    tags=["Resume Builder"]
)

app.include_router(
    credex_router,
    prefix="/credex",
    tags=["Credex Analyze"]
)

app.include_router(
    ats_router,
    prefix="/api/ats",
    tags=["ATS Checker"]
)

app.include_router(
    roadmap_router,
    prefix="/api/roadmap",
    tags=["Roadmap Builder"]
)


@app.get("/")
def root():
    return {"status": "CREDEX backend running"}