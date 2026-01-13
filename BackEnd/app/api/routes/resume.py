from fastapi import APIRouter, UploadFile, File, Form
from app.services.file_reader import extract_text
from app.services.text_cleaner import clean_text
from app.services.ats_scorer import calculate_ats_score

router = APIRouter()

@router.post("/check")
async def check_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    raw_text = extract_text(resume)
    cleaned_text = clean_text(raw_text)
    result = calculate_ats_score(cleaned_text, job_description)

    return {
        "status": "success",
        "data": result
    }
