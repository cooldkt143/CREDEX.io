from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
import json
from .service import analyze_profile

router = APIRouter()

@router.post("/analyze")
async def credex_analyze(
    fullName: str = Form(...),
    experience: str = Form(...),
    github_link: Optional[str] = Form(None),
    linkedin_link: Optional[str] = Form(None),
    projects: Optional[str] = Form(None),   # ✅ ADD THIS
    resume_file: Optional[UploadFile] = File(None),
):
    class Payload:
        pass

    payload = Payload()
    payload.fullName = fullName
    payload.experience = experience

    # GitHub
    class GitHub:
        pass

    github_obj = GitHub()
    github_obj.link = github_link
    payload.github = github_obj

    # LinkedIn
    class LinkedIn:
        pass

    linkedin_obj = LinkedIn()
    linkedin_obj.link = linkedin_link
    payload.linkedin = linkedin_obj

    payload.resume_file = resume_file

    # ✅ Parse projects properly
    if projects:
        try:
            payload.projects = json.loads(projects)
        except:
            payload.projects = []
    else:
        payload.projects = []

    payload.otherPlatforms = []

    result = analyze_profile(payload)

    # Save score and name to MongoDB
    try:
        from app.db import get_mongo_db
        from datetime import datetime
        db = get_mongo_db()
        db.credex_scores.insert_one({
            "fullName": fullName,
            "experience": experience,
            "github_link": github_link,
            "linkedin_link": linkedin_link,
            "credex_score": result.get("credex_score", 0),
            "level": result.get("level", "Developer"),
            "timestamp": datetime.utcnow()
        })
        print(f"[DATABASE] Successfully saved CREDEX score for {fullName} to MongoDB.")
    except Exception as db_err:
        print(f"[DATABASE] Error saving CREDEX score to MongoDB: {db_err}")

    return result