import re
from app.services.resume_text_cleaner import clean_text


def parse_resume_text(text: str) -> dict:
    text = clean_text(text)

    email = extract_email(text)
    phone = extract_phone(text)

    return {
        "header": {
            "firstName": "",
            "lastName": "",
            "city": "",
            "country": "",
            "pincode": "",
            "role": ""
        },
        "contacts": {
            "email": email,
            "phone": phone,
            "links": []
        },
        "summary": "",
        "education": [],
        "skills": {
            "skills": extract_skills(text),
            "languages": []
        },
        "experience": [],
        "projects": [],
        "achievements": []
    }


def extract_email(text):
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else ""


def extract_phone(text):
    match = re.search(r"\b\d{10}\b", text)
    return match.group(0) if match else ""


def extract_skills(text):
    common_skills = [
        "react", "javascript", "python", "node", "mongodb",
        "html", "css", "fastapi"
    ]
    found = []
    lower = text.lower()
    for skill in common_skills:
        if skill in lower:
            found.append(skill.capitalize())
    return found
