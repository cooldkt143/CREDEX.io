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

    return analyze_profile(payload)