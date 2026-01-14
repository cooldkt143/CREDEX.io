from idanalyze.utils.http import HTTPClient
from idanalyze.utils.constants import PLATFORMS

client = HTTPClient()

def extract_github(username: str) -> dict:
    user_url = (
        PLATFORMS["github"]["base_url"]
        + PLATFORMS["github"]["profile"].format(username=username)
    )

    repos_url = (
        PLATFORMS["github"]["base_url"]
        + PLATFORMS["github"]["repos"].format(username=username)
    )

    user = client.get_json(user_url)
    repos = client.get_json(repos_url)

    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    languages = list(
        {r.get("language") for r in repos if r.get("language")}
    )

    return {
        "username": user.get("login"),
        "followers": user.get("followers", 0),
        "public_repos": user.get("public_repos", 0),
        "stars": total_stars,
        "languages": languages,
    }
