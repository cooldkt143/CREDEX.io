from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Resume analyzer
from app.api.routes.resume import router as resume_router

# Resume Builder 
from app.api.routes.resume_builder import router as resume_builder_router

# ID Analyze
from idanalyze.router import router as idanalyze_router

app = FastAPI(title="CREDEX Backend")

# CORS (React frontend)
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

# Routes
app.include_router(
    resume_router,
    prefix="/api/resume",
    tags=["Resume Analyzer"],
)

app.include_router(
    idanalyze_router,
    prefix="/idanalyze",
    tags=["ID Analyze"],
)

app.include_router(
    resume_builder_router,
    prefix="/resume-builder",
    tags=["Resume Builder"],
)

@app.get("/")
def root():
    return {"status": "CREDEX backend running"}
