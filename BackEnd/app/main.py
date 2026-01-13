from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import resume

app = FastAPI(
    title="ATS Resume Checker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ATS Backend is running"}

app.include_router(resume.router, prefix="/api/resume")
