from fastapi import APIRouter, UploadFile, File, HTTPException, Response
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from io import BytesIO
from .resumefile_reader import read_file
from .parser import parse_resume_text
from .db_service import (
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


class GeneratePDFRequest(BaseModel):
    template_id: str
    resume_data: dict


@router.post("/generate-pdf")
async def generate_pdf(request: GeneratePDFRequest):
    template_name = f"{request.template_id}.html"
    templates_dir = os.path.join(os.path.dirname(__file__), "templates")
    
    if not os.path.exists(os.path.join(templates_dir, template_name)):
        raise HTTPException(status_code=400, detail="Template not found")
        
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template(template_name)
    
    html_out = template.render(**request.resume_data)
    
    pdf_file = BytesIO()
    pisa_status = pisa.CreatePDF(
        BytesIO(html_out.encode('utf-8')),
        dest=pdf_file
    )
    
    if pisa_status.err:
        raise HTTPException(status_code=500, detail="PDF generation failed")
        
    pdf_file.seek(0)
    
    return Response(
        content=pdf_file.read(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=resume.pdf"
        }
    )


@router.post("/preview-html", response_class=HTMLResponse)
async def preview_html(request: GeneratePDFRequest):
    template_name = f"{request.template_id}.html"
    templates_dir = os.path.join(os.path.dirname(__file__), "templates")
    
    if not os.path.exists(os.path.join(templates_dir, template_name)):
        raise HTTPException(status_code=400, detail="Template not found")
        
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template(template_name)
    
    html_out = template.render(**request.resume_data)
    return html_out
