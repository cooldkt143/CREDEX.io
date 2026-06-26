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
from fastapi.responses import FileResponse

app = FastAPI(title="CREDEX Backend")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
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


# Setup paths to check for the React build folder (dist)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
DIST_DIR = os.path.join(ROOT_DIR, "dist")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        # Exclude backend API routes and auto-docs to prevent interception
        if catchall.startswith(("api/", "credex/", "idanalyze/", "resume-builder/", "uploads/", "docs", "openapi.json", "redoc")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not Found")
            
        file_path = os.path.join(DIST_DIR, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
else:
    @app.get("/")
    def root():
        return {"status": "CREDEX backend running (development mode: frontend dist not found)"}