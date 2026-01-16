# idanalyze/utils/constants.py

DEFAULT_TIMEOUT = 10

COMMON_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    ),
    "Accept": "text/html,application/json",
}

PLATFORMS = {
    "github": {
        "base_url": "https://api.github.com",
        "profile": "/users/{username}",
        "repos": "/users/{username}/repos",
    },
    "hackerrank": {
        "profile": "https://www.hackerrank.com/{username}",
    },
    "geeksforgeeks": {
        "profile": "https://auth.geeksforgeeks.org/user/{username}/",
    },
    "unstop": {
        "profile": "https://unstop.com/u/{username}",
    },
    "linkedin": {
        "profile": "https://www.linkedin.com/in/{username}",
    },
}

SCORE_LIMITS = {
    "max_score": 1000,
    "github": {
        "followers": 300,
        "stars": 400,
        "repos": 300,
    },
}

CONFIDENCE_LEVELS = {
    "high": "High confidence data (official API)",
    "medium": "Public profile scraping",
    "low": "User provided or limited access",
}
