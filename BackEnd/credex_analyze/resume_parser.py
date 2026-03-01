import re
import pdfplumber
import docx


# -------------------------------
# FILE READERS
# -------------------------------

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("PDF Read Error:", e)
    return text


def extract_text_from_docx(file_path):
    text = ""
    try:
        document = docx.Document(file_path)
        text = "\n".join(p.text for p in document.paragraphs)
    except Exception as e:
        print("DOCX Read Error:", e)
    return text


# -------------------------------
# BASIC EXTRACTORS
# -------------------------------

def extract_name(text):
    lines = text.split("\n")
    for line in lines[:5]:
        line = line.strip()
        if len(line.split()) >= 2 and not any(char.isdigit() for char in line):
            return line
    return "Unknown"


def extract_email(text):
    match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    return match.group(0) if match else ""


def extract_phone(text):
    match = re.search(r"\+?\d[\d\s\-]{8,15}", text)
    return match.group(0) if match else ""


def extract_linkedin(text):
    match = re.search(r"(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+", text)
    return match.group(0) if match else ""


def extract_github(text):
    match = re.search(r"(https?:\/\/)?(www\.)?github\.com\/[^\s]+", text)
    return match.group(0) if match else ""


# -------------------------------
# SKILLS EXTRACTION
# -------------------------------

COMMON_SKILLS = [
    "python", "java", "c++", "javascript", "react", "node",
    "django", "flask", "mysql", "mongodb", "html", "css",
    "git", "docker", "aws", "machine learning", "deep learning",
    "data analysis", "sql"
]

def extract_skills(text):
    found = []
    text_lower = text.lower()
    for skill in COMMON_SKILLS:
        if skill in text_lower:
            found.append(skill)
    return list(set(found))


# -------------------------------
# SECTION PARSER
# -------------------------------

def extract_section(text, keywords):
    pattern = "|".join(keywords)
    match = re.search(rf"({pattern})(.*?)(\n[A-Z][A-Za-z ]+\n|$)", text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(2).strip()
    return ""


# -------------------------------
# Education EXTRACTION
# -------------------------------
def count_education_entries(education_text):
    if not education_text:
        return 0

    # Split by double newlines (separate blocks)
    blocks = [block.strip() for block in education_text.split("\n\n") if block.strip()]

    # Count only meaningful blocks (at least 2 lines)
    count = 0
    for block in blocks:
        lines = [l for l in block.split("\n") if l.strip()]
        if len(lines) >= 2:
            count += 1

    return count


# -------------------------------
# Project EXTRACTION
# -------------------------------
def count_projects(project_text):
    if not project_text:
        return 0

    blocks = [block.strip() for block in project_text.split("\n\n") if block.strip()]

    count = 0
    for block in blocks:
        # A project usually has bullet points
        if "•" in block or "-" in block:
            count += 1

    return count


# -------------------------------
# Experience EXTRACTION
# -------------------------------
def count_experience_entries(experience_text):
    if not experience_text:
        return 0

    # Split into blocks
    blocks = [block.strip() for block in experience_text.split("\n\n") if block.strip()]

    count = 0
    for block in blocks:
        # Check if block contains a year pattern like 2023 or 2023-2025
        if re.search(r"\b(19|20)\d{2}\b", block):
            count += 1

    return count


# -------------------------------
# MAIN PARSER
# -------------------------------

def extract_details(text):

    print("\n==============================")
    print("DEBUG: STARTING EXTRACTION")
    print("==============================")
    print("Resume text length:", len(text))

    if not text or len(text) < 50:
        print("WARNING: Resume text too short!")

    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    linkedin = extract_linkedin(text)
    github = extract_github(text)
    skills = extract_skills(text)

    education = extract_section(text, ["Education"])
    experience = extract_section(text, ["Experience", "Work Experience"])
    projects = extract_section(text, ["Projects"])
    
    education_count = count_education_entries(education)
    experience_count = count_experience_entries(experience)
    project_count = count_projects(projects)

    print("Extraction Complete")
    
    print("RESUME DETAILS:")
    print("Name:", name)
    print("Email:", email)
    print("Phone:", phone)
    print("LinkedIn:", linkedin)
    print("GitHub:", github)
    print("Skills Found:", skills)
    print("Education Count:", education_count)
    print("Experience Count:", experience_count)
    print("Project Count:", project_count)
    print("==============================\n")

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "skills": skills,
        "projects": project_count,
        "education": education_count,
        "experience": experience_count
    }