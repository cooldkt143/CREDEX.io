import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "en-US,en;q=0.9",
}

def extract_gfg(username: str) -> dict:
    url = f"https://auth.geeksforgeeks.org/user/{username}/"

    res = requests.get(url, headers=HEADERS, timeout=10)

    if res.status_code != 200:
        return {
            "platform": "geeksforgeeks",
            "username": username,
            "profile_visible": False
        }

    soup = BeautifulSoup(res.text, "html.parser")

    def safe_int(text):
        try:
            return int(text.replace(",", ""))
        except Exception:
            return 0

    score = 0
    problems_solved = 0
    articles = 0

    # Score card values
    score_cards = soup.select(".scoreCard_head")

    for card in score_cards:
        label = card.find_next("div")
        value = card.find("span")

        if not value:
            continue

        val = safe_int(value.text.strip())

        text = label.text.lower() if label else ""

        if "score" in text:
            score = val
        elif "problem" in text:
            problems_solved = val
        elif "article" in text:
            articles = val

    # Activity hint
    activity_section = soup.select_one(".heatMapContainer")
    recently_active = activity_section is not None

    return {
        "platform": "geeksforgeeks",
        "username": username,
        "profile_url": url,
        "profile_visible": True,

        "coding_score": score,
        "problems_solved": problems_solved,
        "articles_contributed": articles,

        "recent_activity_30_days": recently_active,
        "data_quality": "medium"
    }
