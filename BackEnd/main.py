from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.resume import router as resume_router
from app.api.routes.resume_builder import router as resume_builder_router
from idanalyze.router import router as idanalyze_router
from ats_checker.router import router as ats_router
from credex_analyze.router import router as credex_router

app = FastAPI(title="CREDEX Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/")
def root():
    return {"status": "CREDEX backend running"}