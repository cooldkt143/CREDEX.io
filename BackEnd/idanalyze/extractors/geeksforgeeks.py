import requests
from bs4 import BeautifulSoup

def extract_gfg(username: str) -> dict:
    url = f"https://auth.geeksforgeeks.org/user/{username}/"
    headers = {"User-Agent": "Mozilla/5.0"}

    soup = BeautifulSoup(requests.get(url, headers=headers).text, "html.parser")

    stats = [s.text.strip() for s in soup.select(".scoreCard_head")]

    return {
        "username": username,
        "stats": stats
    }
