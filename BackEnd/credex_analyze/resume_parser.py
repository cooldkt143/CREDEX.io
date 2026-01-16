import pdfplumber
import docx

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_skills(resume_text):
    # Simple keyword match
    skills_keywords = ["Python", "JavaScript", "React", "Node", "FastAPI", "SQL", "Git"]
    skills_found = [skill for skill in skills_keywords if skill.lower() in resume_text.lower()]
    return skills_found