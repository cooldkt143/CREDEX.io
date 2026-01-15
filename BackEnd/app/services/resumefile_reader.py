from docx import Document
import pdfplumber


def read_file(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        return read_pdf(file_path)
    elif file_path.endswith(".docx"):
        return read_docx(file_path)
    else:
        return ""


def read_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def read_docx(path):
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs)
