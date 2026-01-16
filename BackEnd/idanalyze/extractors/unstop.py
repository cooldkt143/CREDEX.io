import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "en-US,en;q=0.9",
}

def extract_unstop(username: str) -> dict:
    url = f"https://unstop.com/u/{username}"

    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
    except Exception:
        return {
            "platform": "unstop",
            "username": username,
            "profile_visible": False
        }

    if res.status_code != 200:
        return {
            "platform": "unstop",
            "username": username,
            "profile_visible": False
        }

    soup = BeautifulSoup(res.text, "html.parser")

    # Basic visibility checks
    sections = soup.find_all("section")
    has_activity = len(sections) > 3

    text = soup.get_text().lower()

    participation_types = {
        "hackathon": "hackathon" in text,
        "quiz": "quiz" in text,
        "case_study": "case study" in text or "case-study" in text,
        "hiring_challenge": "hiring" in text,
    }

    resume_visible = "resume" in text or "cv" in text

    return {
        "platform": "unstop",
        "username": username,
        "profile_url": url,
        "profile_visible": True,

        # High-level signals only
        "has_activity": has_activity,
        "participation_types": participation_types,
        "participation_count_estimated": sum(participation_types.values()),

        "resume_visible": resume_visible,
        "data_quality": "low"
    }