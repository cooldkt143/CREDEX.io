from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resumefile_reader import read_file
from app.services.parser import parse_resume_text
from app.services.db_service import (
    insert_resume,
    get_resume,
    update_resume
)
import uuid
import os

router = APIRouter(
    tags=["Resume Builder"]
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    temp_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, temp_filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = read_file(file_path)
    parsed_json = parse_resume_text(text)

    resume_id = insert_resume(parsed_json, file.filename)

    return {
        "id": str(resume_id),
        "resume_json": parsed_json
    }


@router.get("/{resume_id}")
def fetch_resume(resume_id: str):
    resume = get_resume(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.put("/{resume_id}")
def save_resume(resume_id: str, resume_json: dict):
    success = update_resume(resume_id, resume_json)
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume updated successfully"}
