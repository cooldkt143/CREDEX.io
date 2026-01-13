import fitz  # PyMuPDF
from docx import Document

def extract_text(file):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return read_pdf(file)
    elif filename.endswith(".docx"):
        return read_docx(file)
    elif filename.endswith(".txt"):
        return read_txt(file)
    else:
        return "Unsupported file format"


def read_pdf(file):
    text = ""
    pdf = fitz.open(stream=file.file.read(), filetype="pdf")
    for page in pdf:
        text += page.get_text()
    pdf.close()
    return text


def read_docx(file):
    doc = Document(file.file)
    return "\n".join(p.text for p in doc.paragraphs)


def read_txt(file):
    return file.file.read().decode("utf-8")
