import requests
from bs4 import BeautifulSoup

def extract_hackerrank(username: str) -> dict:
    url = f"https://www.hackerrank.com/{username}"
    headers = {"User-Agent": "Mozilla/5.0"}

    soup = BeautifulSoup(requests.get(url, headers=headers).text, "html.parser")

    return {
        "username": username,
        "badges": len(soup.find_all("svg")),
        "profile_visible": True
    }
