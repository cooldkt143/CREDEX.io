import re
import pdfplumber
import docx


# ---------------- File Readers ----------------

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join(p.text for p in doc.paragraphs)


# ---------------- Text Utilities ----------------

def normalize_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def extract_section(text: str, section_names, next_sections):
    section_pattern = r"(?i)(?:^|\n)\s*(?:{})\s*:?\s*\n".format(
        "|".join(map(re.escape, section_names))
    )

    stop_pattern = r"(?i)(?:^|\n)\s*(?:{})\s*:?\s*\n".format(
        "|".join(map(re.escape, next_sections))
    )

    match = re.search(section_pattern, text)
    if not match:
        return ""

    start = match.end()
    stop_match = re.search(stop_pattern, text[start:])
    end = start + stop_match.start() if stop_match else len(text)

    return text[start:end].strip()


# ---------------- Basic Field Extraction ----------------

def extract_name(text: str):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if not lines:
        return "Unknown"

    bad_patterns = [r"@", r"http", r"www\.", r"\+?\d[\d\s-]{8,}\d"]

    for line in lines[:5]:
        if not any(re.search(p, line, re.I) for p in bad_patterns):
            cleaned = re.sub(r"[^A-Za-z\s]", " ", line)
            cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
            return cleaned.title()

    return "Unknown"


def extract_email(text: str):
    emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return emails[0] if emails else ""


def extract_phone(text: str):
    phones = re.findall(r"\+?\d[\d\s-]{8,}\d", text)
    return phones[0] if phones else ""


# ---------------- Skills ----------------

def extract_skills(text: str):
    keywords = [
        "Python", "Java", "JavaScript", "React", "Node", "Node.js",
        "FastAPI", "SQL", "MongoDB", "Firebase",
        "Git", "GitHub", "Docker", "AWS", "Azure",
        "HTML", "CSS", "Tailwind",
        "OpenCV", "TensorFlow", "Keras"
    ]

    lower = text.lower()
    return sorted({k for k in keywords if k.lower() in lower})


# ---------------- Projects ----------------

def extract_links(text: str):
    return re.findall(r"https?://[^\s]+", text)


def classify_links(links):
    repo = None
    live = None
    for link in links:
        if "github.com" in link:
            repo = link
        else:
            live = link
    return repo, live


def parse_projects(projects_text: str):
    projects = []

    blocks = re.split(r"\n(?=[A-Z][A-Za-z0-9\s\-:&]+)\n", projects_text)

    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if len(lines) < 2:
            continue

        name = lines[0]
        links = extract_links(block)
        repo, live = classify_links(links)

        projects.append({
            "name": name,
            "repo": repo,
            "live": live
        })

    return projects


# ---------------- Experience ----------------

def infer_experience(text: str):
    keywords = [
        "Hackathon", "Project Expo", "Internship",
        "Participant", "Solo Participant",
        "IEEE", "Smart Hackathon", "Team"
    ]

    hits = sum(1 for k in keywords if k.lower() in text.lower())

    if hits >= 5:
        return "1–3 Years"
    if hits >= 2:
        return "Fresher"
    return "Student"


# ---------------- Main Extractor ----------------

def extract_details(resume_text: str):
    resume_text = normalize_text(resume_text)

    name = extract_name(resume_text)
    email = extract_email(resume_text)
    phone = extract_phone(resume_text)
    skills = extract_skills(resume_text)

    projects_text = extract_section(
        resume_text,
        ["Projects", "Project"],
        ["Experience", "Work Experience", "Education", "Skills", "Achievements", "Awards"]
    )
    projects = parse_projects(projects_text)

    education = extract_section(
        resume_text,
        ["Education"],
        ["Experience", "Work Experience", "Skills", "Projects", "Achievements", "Awards"]
    )

    achievements = extract_section(
        resume_text,
        ["Achievements", "Key Achievements", "Awards"],
        ["Experience", "Work Experience", "Education", "Skills", "Projects"]
    )

    experience_text = extract_section(
        resume_text,
        ["Experience", "Work Experience", "Internship", "Internships"],
        ["Education", "Skills", "Projects", "Achievements", "Awards"]
    )

    if experience_text:
        experience = [experience_text]
    else:
        experience = [infer_experience(resume_text)]

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "projects": projects,
        "achievements": [achievements] if achievements else [],
        "experience": experience,
        "education": [education] if education else []
    }