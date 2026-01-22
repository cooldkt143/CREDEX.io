import re
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
    skills_keywords = ["Python", "JavaScript", "React", "Node", "FastAPI", "SQL", "Git", "Docker", "AWS"]
    return [skill for skill in skills_keywords if skill.lower() in resume_text.lower()]


def extract_details(resume_text):
    resume_text = resume_text.replace("\n", " ")

    # 1. Name
    name = re.findall(r"[A-Z][a-z]+(?:\s[A-Z][a-z]+)+", resume_text)
    name = name[0] if name else "Unknown"

    # 2. Email
    email = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", resume_text)
    email = email[0] if email else ""

    # 3. Phone
    phone = re.findall(r"\+?\d[\d\s-]{8,}\d", resume_text)
    phone = phone[0] if phone else ""

    # 4. Skills
    skills_found = extract_skills(resume_text)

    # 5. Projects
    projects = re.findall(
        r"(Project|Projects)\s*:\s*(.*?)\s*(?=Experience|Education|Skills|Achievements|$)",
        resume_text, re.IGNORECASE
    )
    projects = [p[1].strip() for p in projects]

    # 6. Achievements
    achievements = re.findall(
        r"(Achievement|Achievements)\s*:\s*(.*?)\s*(?=Experience|Education|Skills|Projects|$)",
        resume_text, re.IGNORECASE
    )
    achievements = [a[1].strip() for a in achievements]

    # 7. Experience
    experience = re.findall(
        r"(Experience|Work Experience)\s*:\s*(.*?)\s*(?=Education|Skills|Projects|Achievements|$)",
        resume_text, re.IGNORECASE
    )
    experience = [e[1].strip() for e in experience]

    # 8. Education
    education = re.findall(
        r"(Education)\s*:\s*(.*?)\s*(?=Experience|Skills|Projects|Achievements|$)",
        resume_text, re.IGNORECASE
    )
    education = [ed[1].strip() for ed in education]

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills_found,
        "projects": projects,
        "achievements": achievements,
        "experience": experience,
        "education": education
    }