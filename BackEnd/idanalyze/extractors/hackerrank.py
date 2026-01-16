import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "en-US,en;q=0.9",
}

def extract_hackerrank(username: str) -> dict:
    profile_url = f"https://www.hackerrank.com/{username}"

    res = requests.get(profile_url, headers=HEADERS, timeout=10)

    if res.status_code != 200:
        return {
            "platform": "hackerrank",
            "username": username,
            "profile_visible": False
        }

    soup = BeautifulSoup(res.text, "html.parser")

    # Very rough badge indicator
    badge_svgs = soup.find_all("svg")

    return {
        "platform": "hackerrank",
        "username": username,
        "profile_url": profile_url,
        "profile_visible": True,

        # Publicly inferable (not exact)
        "badge_count_estimated": len(badge_svgs),

        # Not publicly accessible
        "certifications": [],
        "certification_count": None,
        "code_completion_rate": None,

        # Metadata for analyzer
        "data_quality": "limited",
        "note": "HackerRank restricts detailed stats behind authentication"
    }
